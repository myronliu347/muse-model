import { mapState, mapActions } from 'vuex';
import { generateModule, allIn, warn } from './utils';

export default class Muse {
  constructor (store, options) {
    this.$store = store;
    this.$options = options;
    this.state = {};
    this.actions = {};
    this._init();
  }

  _init () {
    if (this.$options.models) {
      this.$options.models.forEach((model) => {
        this.registerModel(model);
      });
    }

    if (this.$options.plugins) {
      // TODO 加载插件
    }
  }

  registerModel (model) {
    const namespace = model.namespace;
    if (!namespace) {
      warn('每个model必须要有一个namespace');
      return;
    }
    if (this.isRegistedModel(namespace)) return;
    const module = generateModule(model);
    this.$store.registerModule(namespace, module);

    let state = {};
    Object.keys(module.state).forEach(key => (state[key] = state => state[namespace][key]));
    state = mapState(state);

    const actions = {};
    Object.keys(module.actions).forEach((key) => {
      const action = mapActions({
        [key]: `${namespace}/${key}`
      })[key];
      actions[key] = function (...args) {
        return action.call(this, args);
      };
    });

    this.state[namespace] = state;
    this.actions[namespace] = actions;
  }

  isRegistedModel (namespace) {
    return !!this.state[namespace];
  }

  connect (component, models, filter) {
    if (!Array.isArray(models)) models = [models];

    models.forEach(model => this.registerModel(model));

    const mergeProp = (filter || allIn)(this.state, this.actions);
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
};
