<template>
<div><button @click="addDispatch()">+</button>{{count}}<button @click="sub()">-</button></div>
</template>
<script>
import muse from './models/muse';
import Count from './models/count';
import Cute from './models/cute';

export default muse.connect({
    created () {
    }
}, [Count, Cute], (state, actions) => {
  return {
    computed: {
      ...state.count
    },
    methods: {
      ...actions.count
    }
  }
});
</script>
