<template>
    <div id="app">
        <sky></sky>
    </div>
</template>

<script>
import Sky from './components/skyView.vue'


export default {
    components:{
        sky: Sky,
    },
    mounted(){
        this.eventHub.$emit('initSkyScene')
    }
}
</script>
