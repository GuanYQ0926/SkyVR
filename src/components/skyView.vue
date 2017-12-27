<template>
    <div id="sky"></div>
</template>

<script>
import Sky from '../sky'
import AFRAME from 'aframe'


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
