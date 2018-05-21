<template>
<div><button @click="addDispatch()">+</button>{{count}}<button @click="sub()">-</button>  {{computedCount}}</div>
</template>
<script>
import muse from './models/muse';
import Count from './models/count';
import Cute from './models/cute';

export default muse.connect({
    created () {
    }
}, [Count, Cute], (state, actions, getters) => {
  return {
    computed: {
      ...state.count,
      ...getters.count
    },
    methods: {
      ...actions.count
    }
  }
});
</script>
