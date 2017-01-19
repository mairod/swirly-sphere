import * as THREE from 'three'

class Spiral {

    constructor(options) {

        this.options          = options                       || {}
        this.count            = this.options.count            || 1000
        this.circle_count     = this.options.circle_count     || 100
        this.radius           = this.options.radius           || 30
        this.length           = this.options.length           || 200
        // NOTE : position de la camera
        this.offset_Z         = 100
        this.object           = new THREE.Group()
        this.init_texture()
        this.init_spiral()
        this.init_debug()

    }

    init_texture() {
        this.material = new THREE.SpriteMaterial( {
            map: STORAGE.assets.particle,
            color: new THREE.Color('#ffffff'),
            transparent: true
        } )
    }

    init_spiral(){

        for (var i = 0; i < this.count; i++) {

            var sprite = new THREE.Sprite( this.material )

            var pos_X = Math.cos( ( (Math.PI * 2) / this.circle_count) * i ) * this.radius
            var pos_Y = Math.sin( ( (Math.PI * 2) / this.circle_count) * i ) * this.radius
            var pos_Z = i * ( this.length / this.count ) - this.offset_Z

            // Here

            if (i === 1) {
                this.ecart_Z = pos_Z - this.offset_Z
            }

            sprite.position.set(pos_X, pos_Y, pos_Z)

            // console.log(sprite);
            this.object.add( sprite )
        }

        this.count = this.count - 1;
        console.log(this.object);

    }


    add_point(){


        var sprite = new THREE.Sprite( this.material )

        this.count = this.count + 1;
        var pos_X = Math.cos( ( (Math.PI * 2) / this.circle_count) * this.count) * this.radius
        var pos_Y = Math.sin( ( (Math.PI * 2) / this.circle_count) * this.count) * this.radius

        var ecart_Z = this.length / this.count
        var pos_Z = this.count * ( this.length / this.count ) - this.offset_Z

        sprite.position.set(pos_X, pos_Y, pos_Z)

        console.log(sprite);
        this.object.position.z -= ecart_Z
        this.object.add(sprite)

    }

    init_raycaster(){

          // https://threejs.org/docs/?q=ray#Reference/Core/Raycaster

    }


    init_debug(){
        var that = this
        document.addEventListener('click', function() {
            that.add_point()
        })
    }

    update(){


    }
}

export default Spiral
