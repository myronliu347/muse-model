import { mapState, mapGetters } from 'vuex';
import { generateModule, allIn, warn } from './utils';

export default class Muse {
  constructor (store, options) {
    this.$store = store;
    this.$options = options || {};
    this.state = {};
    this.getters = {};
    this.actions = {};
    this._init();
  }

  _init () {
    if (this.$options.models) {
      this.$options.models.forEach((model) => {
        this.registerModel(model);
      });
    }
  }

  registerModel (model) {
    const namespace = model.namespace;
    if (!namespace) {
      warn('每个model必须要有一个namespace');
      return;
    }
    if (this.isRegistedModel(namespace)) return;
    const module = generateModule(model, this.$store);
    this.$store.registerModule(namespace, module);

    let state = {};
    Object.keys(module.state).forEach(key => (state[key] = state => state[namespace][key]));
    state = mapState(state);
    let getters = {};
    Object.keys(module.getters).forEach(key => (getters[key] = `${namespace}/${key}`));
    getters = mapGetters(getters);

    const actions = {};
    Object.keys(model).forEach((key) => {
      if (typeof model[key] !== 'function') return;
      actions[key] = function (...args) {
        return model[key].apply(model, args);
      };
    });

    this.state[namespace] = state;
    this.getters[namespace] = getters;
    this.actions[namespace] = actions;
  }

  isRegistedModel (namespace) {
    return !!this.state[namespace];
  }

  connect (component, models, mergeFunc) {
    const state = {};
    const actions = {};
    const getters = {};
    if (!Array.isArray(models)) models = [models];
    models.forEach(model => {
      if (!model.namespace) return;
      state[model.namespace] = this.state[model.namespace];
      actions[model.namespace] = this.actions[model.namespace];
      getters[model.namespace] = this.getters[model.namespace];
      this.registerModel(model);
    });

    const mergeProp = (mergeFunc || allIn)(state, actions, getters);
    component.computed = {
      ...mergeProp.computed,
      ...component.computed
    };
    component.methods = {
      ...mergeProp.methods,
      ...component.methods
    };
    return component;
  }

  watch (fn, callback, options) {
    this.$store.watch(fn, callback, options);
  }
};
