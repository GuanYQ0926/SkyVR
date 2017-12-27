import AFRAME from 'aframe'


// AFRAME.registerComponent('box', {
//     schema: {
//         width: {type: 'number', default: 1},
//         height: {type: 'number', default: 1},
//         depth: {type: 'number', default: 1},
//         color: {type: 'color', default: '#AAA'}
//     },
//     init: function () {
//         const data = this.data
//         const el = this.el
//         this.geometry = new AFRAME.THREE.BoxBufferGeometry(data.width, data.height, data.depth)
//         this.material = new AFRAME.THREE.MeshStandardMaterial({color: data.color})
//         this.mesh = new AFRAME.THREE.Mesh(this.geometry, this.material)
//         el.setObject3D('mesh', this.mesh)
//     },
//     remove: function () {
//         this.el.removeObject3D('mesh')
//     }
// })

const vert_shader = require('./glsl/sky.vert')
const frag_shader = require('./glsl/sky.frag')

AFRAME.registerShader('sky-shaders', {
    schema: {
        luminance: {default: 1, is: 'uniform'},
        mieCoefficient: {default: 0.005, is: 'uniform'},
        mieDirectionalG: {default: 0.8, is: 'uniform'},
        rayleigh: {default: 1, is: 'uniform'},
        sunPosition: {type: 'vec3', default: '0 0 -1', is: 'uniform'},
        turbidity: {default: 2, is: 'uniform'}
    },
    vertexShader: vert_shader,
    fragmentShader: frag_shader,
})
