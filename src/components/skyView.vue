<template>
    <div id="sky"></div>
</template>

<script>
import Sky from '../sky'

export default{
    data: () => ({
        sky: new Sky()
    }),
    mounted(){
        this.eventHub.$on('initSkyScene', () => this.sky.initScene())
        document.getElementById('sky').appendChild(this.sky.domElement)
    }
}
</script>
