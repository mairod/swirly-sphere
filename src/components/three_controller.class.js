import * as TOOLS from './tools.class.js'
import * as THREE from 'three'


class THREE_Controller {

    constructor(options) {

        this.options            = options
        this.container          = this.options.container
        this.debug              = this.options.debug || false
        this.width              = this.container.offsetWidth
        this.height             = this.container.offsetHeight
        this.camera             = new Object()
        this.assets             = new Object()
        this.scene              = new THREE.Scene()
        this.mouse              = new THREE.Vector2(0, 0)
        this.direction          = new THREE.Vector2(0, 0)
        this.cameraPosition     = new THREE.Vector2(0, 0)
        this.sound_height       = new THREE.Vector2(0, .5)
        this.sound_add          = new THREE.Vector2(0, .5)
        this.sound_target       = new THREE.Vector2(0, 0)
        this.cameraEasing       = {x: 100, y: 10}
        this.time               = 0

        this.init_loader()
        this.init_environement()
        this.init_camera()
        this.init_event()
        this.init_loader()
        this.init_lights()
        this.init_material()
        this.init_object()
        this.update()

    }

    init_loader() {

        this.manager = new THREE.LoadingManager();
		    this.manager.onProgress = function ( item, loaded, total ) {
            var progress = Math.round((loaded / total) * 100)
            console.log(progress);
            if (progress == 100) {
                console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
                console.log("%cPress \"@\" to show/hide devs tools", "padding: 10px; margin-bottom: 10px; color: #262626; font-size: 20px; font-family: sans-serif;")
                console.log("%cCode available here : https://github.com/mairod/swirly-sphere", "padding: 10px; margin-bottom: 10px; color: #262626; font-size: 20px; font-family: sans-serif;")
                setTimeout(function () {
                    STORAGE.audio.play()
                }, 1000);
           }
        }

    }

    init_camera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
        this.camera.position.z = 200;
    }

    init_environement() {

        this.scene.fog = new THREE.FogExp2( 0xeaeaea, 0.0020 )

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.width, this.height)

        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
        this.renderer.shadowMapWidth = 1024
        this.renderer.shadowMapHeight = 1024
        this.renderer.sortObjects = false

        this.container.appendChild(this.renderer.domElement)
    }

    init_event() {
        var that = this
        window.addEventListener('resize', function() {
            that.width = window.innerWidth
            that.height = window.innerHeight
            that.camera.aspect = that.width / that.height;
            that.camera.updateProjectionMatrix();
            that.renderer.setSize(that.width, that.height);
        }, false)

        window.addEventListener("mousemove", function(event) {
            that.mouse.x = (event.clientX / that.width - .5) * 2
            that.mouse.y = (event.clientY / that.height - .5) * 2
        })

    }

    init_lights(){

        this.light_1 = new THREE.SpotLight( 0xffffff )

        this.light_1.castShadow = true
        this.light_1.penumbra = .8
        this.light_1.power = Math.PI * .5

        this.light_1.castShadow = true
    	  this.light_1.shadow.camera.near = 1
    	  this.light_1.shadow.camera.far = 200

        this.light_1.position.set(200, 150, 0)
        this.light_1.lookAt(new THREE.Vector3(30,20,0))
        this.scene.add(this.light_1)

        var time = 0
        this.light_1.update = function(){
            time += .01
            this.power = ((Math.PI * Math.cos(time)) / 4) + (Math.PI * 1.7)
        }

        this.light_2 = new THREE.SpotLight( 0xffffff )

        this.light_2.castShadow = true
        this.light_2.penumbra = .8
        this.light_2.power = Math.PI * .5

        this.light_2.castShadow = true
    	  this.light_2.shadow.camera.near = 1
    	  this.light_2.shadow.camera.far = 200

        this.light_2.position.set(-200, 150, 0)
        this.light_2.lookAt(new THREE.Vector3(30,20,0))
        this.scene.add(this.light_2)

        var time = 0
        this.light_2.update = function(){
            time += .01
            this.power = ((Math.PI * Math.cos(time)) / 4) + (Math.PI * 1.7)
        }

    }

    init_material(){

        var that = this
        var glsl = require('glslify')

        const vertex_shader = glsl.file("../shaders/flux.vert")
        const fragment_shader = glsl.file("../shaders/flux.frag")
        const noise = new THREE.TextureLoader( this.manager ).load('assets/noise.jpg')
        const noise_perlin = new THREE.TextureLoader( this.manager ).load('assets/noise.png')
        const matcap_1 = new THREE.TextureLoader( this.manager ).load('assets/matcap_silver.png')
        const matcap_2 = new THREE.TextureLoader( this.manager ).load('assets/matcap_blue.png')

        this.sphere_1_material = new THREE.ShaderMaterial({
            uniforms: {
                noise_map: {
                    type: 't',
                    value: noise_perlin
                },
                matcap: {
                    type: 't',
                    value: matcap_1
                },
                clamping: {
                    type: 'f',
                    value: 0.9
                },
                key: {
                    type: 'f',
                    value: 0.96
                },
                time: {
                    type: 'f',
                    value: 100
                }
            },
            vertexShader: vertex_shader,
            fragmentShader: fragment_shader,
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: true,
            depthWrite: false
        });

        this.sphere_1_material.castShadow = true
        this.sphere_1_material.receiveShadow = false

        this.sphere_1_material.update = function(){
            this.uniforms.time.value += .02

            that.sound_height.y = .5 + (STORAGE.audio.controls[0].strength * .9)
            that.sound_height.y = Math.min(that.sound_height.y, .9)
            that.sound_target.subVectors(that.sound_height, that.sound_add)
            that.sound_target.multiplyScalar(.1)
            that.sound_add.addVectors(that.sound_add, that.sound_target)
            this.uniforms.clamping.value = that.sound_add.y

        }

        this.sphere_2_material = new THREE.ShaderMaterial({
            uniforms: {
                noise_map: {
                    type: 't',
                    value: noise
                },
                matcap: {
                    type: 't',
                    value: matcap_2
                },
                clamping: {
                    type: 'f',
                    value: 0.9
                },
                key: {
                    type: 'f',
                    value: 1.6
                },
                time: {
                    type: 'f',
                    value: 0
                }
            },
            vertexShader: vertex_shader,
            fragmentShader: fragment_shader,
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: true,
            depthWrite: false
        });

        this.sphere_2_material.update = function(){
            this.uniforms.time.value += .02 + (STORAGE.audio.controls[1].strength * .4)
        }

        this.midle_shpere_material = new THREE.MeshPhongMaterial({
            color: 0x3c4448,
            emissive: 0x141212,
            specular: 0x23293c,
            shininess: 40
        })
        this.midle_shpere_material.castShadow = true
        this.midle_shpere_material.receiveShadow = true
    }

    init_object(){

        var geometry_3 = new THREE.SphereBufferGeometry(45, 64, 64)
        var sphere_3 = new THREE.Mesh(geometry_3, this.midle_shpere_material)
        this.scene.add(sphere_3)

        var geometry_2 = new THREE.SphereBufferGeometry(45.1, 64, 64)
        geometry_2.computeFaceNormals();
        geometry_2.computeVertexNormals();

        var sphere_2 = new THREE.Mesh(geometry_2, this.sphere_2_material)
        sphere_2.rotation.y = - Math.PI / 2
        sphere_2.rotation.x = - Math.PI / 8
        this.scene.add(sphere_2)

        var geometry_1 = new THREE.SphereBufferGeometry(52, 64, 64)
        geometry_1.computeFaceNormals();
        geometry_1.computeVertexNormals();

        var sphere_1 = new THREE.Mesh(geometry_1, this.sphere_1_material)
        sphere_1.rotation.y = - Math.PI / 2
        sphere_1.rotation.x = - Math.PI / 10
        this.scene.add(sphere_1)

    }



    update() {

        if ( this.sphere_1_material != undefined ) { this.sphere_1_material.update() }
        if ( this.sphere_2_material != undefined ) { this.sphere_2_material.update() }
        if ( this.light             != undefined ) { this.light.update() }

        // camera
        this.direction.subVectors(this.mouse, this.cameraPosition)
        this.direction.multiplyScalar(.06)
        this.cameraPosition.addVectors(this.cameraPosition, this.direction)
        this.camera.position.x = this.cameraPosition.x * this.cameraEasing.x * -1
        this.camera.position.y = -this.cameraPosition.y * this.cameraEasing.y * -1
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))

        this.renderer.render(this.scene, this.camera);
    }


}

export default THREE_Controller
