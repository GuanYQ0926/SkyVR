// import * as AFRAME.THREE from 'AFRAME.THREE'
import AFRAME from 'aframe'

export default class Sky {
    constructor(){
        // sky_uniforms
        this.sky_uniforms = {
            luminance: {value: 1},
            turbidity: {value: 2},
            rayleigh: {value: 1},
            mieCoefficient: {value: 0.005},
            mieDirectionalG: { value: 0.8 },
            sunPosition: {value: new AFRAME.THREE.Vector3()}
        }
        // sky_mesh
        const sky_mat = new AFRAME.THREE.ShaderMaterial({
            fragmentShader: require('./glsl/sky.frag'),
            vertexShader: require('./glsl/sky.vert'),
            uniforms: this.sky_uniforms,
            side: AFRAME.THREE.BackSide,
        })
        const sky_geo = new AFRAME.THREE.SphereBufferGeometry(450000, 32, 15)
        this.sky_mesh = new AFRAME.THREE.Mesh(sky_geo, sky_mat)
        // sun_mesh
        this.sun_mesh = new AFRAME.THREE.Mesh(
            new AFRAME.THREE.SphereBufferGeometry(20000, 16, 8),
            new AFRAME.THREE.MeshBasicMaterial({color: 0xffffff})
        )
        // camera
        this.camera = new AFRAME.THREE.PerspectiveCamera(60,
            window.innerWidth/window.innerHeight, 100, 2000000)
        this.camera.position.set(0, 100, 2000)
        // scene
        this.scene = new AFRAME.THREE.Scene()
        this.helper = new AFRAME.THREE.GridHelper(10000, 2, 0xffffff, 0xffffff)
        this.scene.add(this.helper)
        // renderer
        this.renderer = new AFRAME.THREE.WebGLRenderer({
            antialias: true,
            precision: 'highp',
            alpha: true
        })
        // animate
        this.animate = this.animate.bind(this)
        this.animate()
    }
    initScene(){
        this.scene.add(this.sky_mesh)
        this.sun_mesh.position.y = - 700000
        this.sun_mesh.visible = false
        this.scene.add(this.sun_mesh)
        // set sky param
        const effectController = {
            turbidity: 10,
            rayleigh: 2,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            luminance: 1,
            inclination: 0.49,
            azimuth: 0.25,
            sun: !true
        }
        const distance = 400000
        const uniforms = this.sky_uniforms
        uniforms.turbidity.value = effectController.turbidity
        uniforms.rayleigh.value = effectController.rayleigh
        uniforms.luminance.value = effectController.luminance
        uniforms.mieCoefficient.value = effectController.mieCoefficient
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG
        const theta = Math.PI * (effectController.inclination - 0.5)
        const phi = 2 * Math.PI * (effectController.azimuth - 0.5)
        this.sun_mesh.position.x = distance * Math.cos(phi)
        this.sun_mesh.position.y = distance * Math.sin(phi) * Math.sin(theta)
        this.sun_mesh.position.z = distance * Math.sin(phi) * Math.cos(theta)
        this.sun_mesh.visible = effectController.sun
        this.sky_uniforms.sunPosition.value.copy(this.sun_mesh.position)

        // drawing
        this.resetWindow()
        this.renderScene()
    }
    renderScene(){
        this.renderer.render(this.scene, this.camera)
    }
    resetWindow(){
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(window.devicePixelRatio)
    }
    animate(){
        window.requestAnimationFrame(this.animate)
        this.renderScene()
    }
    get domElement(){
        return this.renderer.domElement
    }
    get skyMesh(){
        return this.sky_mesh
    }
    get sunMesh(){
        return this.sun_mesh
    }
}
