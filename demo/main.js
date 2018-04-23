import Vue from 'vue';
import { store } from './models/muse';
import App from './app';

const app = new Vue({
  ...App,
  store
});
app.$mount('#app');
