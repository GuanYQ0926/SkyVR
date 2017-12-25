import * as THREE from 'three'


export default class Sky {
    constructor(){
        // uniforms
        this.uniforms = {
            luminance: {value: 1},
            turbidity: {value: 2},
            rayleigh: {value: 1},
            mieCoefficient: {value: 0.005},
            mieDirectionalG: { value: 0.8 },
            sunPosition: {value: new THREE.Vector3()}
        }
        // mesh
        const sky_mat = new THREE.ShaderMaterial({
            fragmentShader: require('./glsl/sky.frag'),
            vertexShader: require('./glsl/sky.vert'),
            uniforms: this.uniforms,
            side: THREE.BackSide,
        })
        const sky_geo = new THREE.SphereBufferGeometry(450000, 32, 15)
        this.mesh = new THREE.Mesh(sky_geo, sky_mat)
        // camera
        this.camera = new THREE.PerspectiveCamera(60,
            window.innerWidth/window.innerHeight, 100, 2000000)
        this.camera.position.set(0, 100, 2000)
        // scene
        this.scene = new THREE.Scene()
        this.helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff)
        this.scene.add(this.helper)
        // renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            precision: 'highp',
            alpha: true
        })
        // animate
        this.animate = this.animate.bind(this)
        this.animate()
    }
    initScene(){
        this.scene.add(this.mesh)
        // sun sphere
        const sun_mesh = new THREE.Mesh(
            new THREE.SphereBufferGeometry(20000, 16, 8),
            new THREE.MeshBasicMaterial({color: 0xffffff})
        )
        sun_mesh.position.y = - 700000
        sun_mesh.visible = false
        this.scene.add(sun_mesh)
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
        const uniforms = this.uniforms
        uniforms.turbidity.value = effectController.turbidity
        uniforms.rayleigh.value = effectController.rayleigh
        uniforms.luminance.value = effectController.luminance
        uniforms.mieCoefficient.value = effectController.mieCoefficient
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG
        const theta = Math.PI * (effectController.inclination - 0.5)
        const phi = 2 * Math.PI * (effectController.azimuth - 0.5)
        sun_mesh.position.x = distance * Math.cos(phi)
        sun_mesh.position.y = distance * Math.sin(phi) * Math.sin(theta)
        sun_mesh.position.z = distance * Math.sin(phi) * Math.cos(theta)
        sun_mesh.visible = effectController.sun
        this.uniforms.sunPosition.value.copy(sun_mesh.position)

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
}
