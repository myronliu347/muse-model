<template>
<div><button @click="addTimeOut()">+</button>{{count}}<button @click="sub()">-</button></div>
</template>
<script>
import muse from './models/muse';
import Count from './models/count';

export default muse.connect({
    created () {
    }
}, Count);
</script>
