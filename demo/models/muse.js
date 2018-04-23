import Vue from 'vue';
import Vuex from 'vuex';
import Muse from '../../src';
Vue.use(Vuex);

export const store = new Vuex.Store({
  strict: true
});
export default new Muse(store);
