import THREE from 'three'

class SkyShader{
    constructor(){
        const skyUniforms = {
            luminance: {value: 1},
            turbidity: {value: 2},
            rayleigh: {value: 1},
            mieCoefficient: {value: 0.005},
            sunPosition: {value: new THREE.Vector3()}
        }
        const skyMat = new THREE.ShaderMaterial({
            fragmentShader: require('./glsl/sky.fs'),
            vertexShader: require('./glsl/sky.vs'),
            uniforms: skyUniforms,
            side: THREE.BackSide
        })
        const skyGeo = new THREE.SphereBufferGeometry(450000, 32, 15)
        const skyMesh = new THREE.Mesh(skyGeo, skyMat)
        this.mesh = skyMesh
        this.uniforms = skyUniforms
    }
}

let scene, skyShader, sunSphere
let camera, renderer, controls

init()
render()

function initSky(){
    skyShader = new SkyShader()
    scene.add(skyShader.mesh)

    sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({color: 0xffffff})
    )
    sunSphere.position.y = - 700000
    sunSphere.visible = false
    scene.add(sunSphere)

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

    function guiChanged(){
        const uniforms = skyShader.uniforms
        uniforms.turbidity.value = effectController.turbidity
        uniforms.rayleigh.value = effectController.rayleigh
        uniforms.luminance.value = effectController.luminance
        uniforms.mieCoefficient.value = effectController.mieCoefficient
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG

        const theta = Math.PI * (effectController.inclination - 0.5)
        const phi = 2 * Math.PI * (effectController.azimuth - 0.5)

        sunSphere.position.x = distance * Math.cos(phi)
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta)
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta)

        sunSphere.visible = effectController.sun
        skyShader.uniforms.sunPosition.value.copy(sunSphere.position)

        renderer.render(scene, camera)
    }

    let gui = new dat.GUI()
    gui.add( effectController, 'turbidity', 1.0, 20.0, 0.1 ).onChange( guiChanged )
    gui.add( effectController, 'rayleigh', 0.0, 4, 0.001 ).onChange( guiChanged )
    gui.add( effectController, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( guiChanged )
    gui.add( effectController, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( guiChanged )
    gui.add( effectController, 'luminance', 0.0, 2 ).onChange( guiChanged )
    gui.add( effectController, 'inclination', 0, 1, 0.0001 ).onChange( guiChanged )
    gui.add( effectController, 'azimuth', 0, 1, 0.0001 ).onChange( guiChanged )
    gui.add( effectController, 'sun' ).onChange( guiChanged )
    guiChanged()
}

function init(){
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 2000000)
    camera.position.set(0, 100, 2000)
    scene = new THREE.Scene()

    const helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff)
    scene.add(helper)

    renderer = new THREE.WebGLRenderer()
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)

    controls.enableZoom = false
    controls.enablePan = false

    initSky()
    window.addEventListener('resize', onWindowResize, false)
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function render(){
    renderer.render(scene, camera)
}
