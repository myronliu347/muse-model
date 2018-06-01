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

const POINT = '.';
export function generateModule (model, $store) {
  const namespace = model.namespace;
  const module = {
    namespaced: true,
    state: model.state || {},
    getters: model.getters || {},
    actions: {},
    mutations: {
      CHANGE (state, payload) {
        if (!payload.key) return;
        const arr = payload.key.split(POINT);
        let obj = state;
        arr.forEach((key, index) => {
          if (arr.length - index <= 1) {
            obj[key] = payload.result;
            return;
          }
          obj = obj[key];
        });
      }
    }
  };

  Object.keys(model).forEach((actionKey) => {
    if (typeof model[actionKey] !== 'function') return;
    const mutationType = actionKey;
    const path = `${namespace}/${mutationType}`;
    const action = model[actionKey];

    module.mutations[mutationType] = function (state, payload) {
      const result = payload.result;
      if (!result || !isPlainObject(result)) return;
      Object.keys(result).forEach((key) => (state[key] = result[key]));
    };

    model[actionKey] = function (...args) {
      const result = action.apply(model, args);
      switch (true) {
        case isPlainObject(result):
          $store.commit({ type: path, result });
          return result;
        case isPromise(result):
          result.then(result => $store.commit({ type: path, result }));
          return result;
      }
      return result;
    };
  });

  model.change = function (key, val) {
    $store.commit({
      type: `${namespace}/CHANGE`,
      key,
      result: val
    });
  };
  return module;
}

export function allIn (state, actions, getters) {
  let computed = {};
  let methods = {};

  Object.keys(state).forEach((key) => {
    computed = {
      ...computed,
      ...state[key],
      ...getters[key]
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
