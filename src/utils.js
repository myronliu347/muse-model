export function warn (msg, err) {
  if (typeof console !== 'undefined') {
    console.warn('[muse-model] ' + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}

const toString = Object.prototype.toString;
const OBJECT_STRING = '[object Object]';
export function isPlainObject (obj) {
  return toString.call(obj) === OBJECT_STRING;
}

export function isPromise (val) {
  return val && typeof val.then === 'function';
}

export function assert (condition, msg) {
  if (!condition) throw new Error(`[muse-model] ${msg}`);
}

export function generateModule (model) {
  const namespace = model.namespace;
  const module = {
    namespaced: true,
    state: model.state,
    actions: {},
    mutations: {}
  };

  Object.keys(model).forEach((actionKey) => {
    if (typeof model[actionKey] !== 'function') return;
    const mutationType = `${namespace}_${actionKey}`;
    module.actions[actionKey] = function ({ commit }, args) {
      const result = model[actionKey].apply(model, args);
      switch (true) {
        case isPlainObject(result):
          commit({
            type: mutationType,
            res: result
          });
          return result;
        case isPromise(result):
          result.then(res => commit({ type: mutationType, res: res }));
          return result;
      }
    };

    module.mutations[mutationType] = function (state, payload) {
      const result = payload.res;
      Object.keys(result).forEach((key) => {
        state[key] = result[key];
      });
    };
  });

  return module;
}

export function allIn (state, actions) {
  let computed = {};
  let methods = {};

  Object.keys(state).forEach((key) => {
    computed = {
      ...computed,
      ...state[key]
    };
  });

  Object.keys(actions).forEach((key) => {
    methods = {
      ...methods,
      ...actions[key]
    };
  });

  return {
    computed,
    methods
  };
}
