import React from "react";
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {DirectionalLight} from "three";
import Loading from "../../loading/Loading";

export default function Map3D() {
    const [loading, setLoading] = React.useState(true)
    let [loadingAt, setLoadingAt] = React.useState(0)
    let mount: any = React.useRef<HTMLElement>();
    React.useEffect(()=> {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body

        if (mount.children[0]) {
            mount.removeChild(mount.children[0])
        }
        mount.appendChild(renderer.domElement);
        // const geometry = new THREE.BoxGeometry(1, 1, 1);
        // const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        // const cube = new THREE.Mesh(geometry, material);
        // scene.add(cube);
        const controls = new OrbitControls( camera, renderer.domElement );

        const loader = new GLTFLoader();
        let obj: THREE.Group;
        loader.load(
            'untitled.glb',
                (gltf) => {
                gltf.scene.rotation.y = 0
                scene.add( gltf.scene );
                setLoading(false)
                obj = gltf.scene
                // gltf.animations; // Array<THREE.AnimationClip>
                // gltf.scene; // THREE.Group
                // gltf.scenes; // Array<THREE.Group>
                // gltf.cameras; // Array<THREE.Camera>
                // gltf.asset; // Object
            },
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
                setLoadingAt(loadingAt + 1)
            },
            function ( error ) {
                console.log( 'An error happened', error );
            }
        );

        // const light = new THREE.PointLight( 0xddddff, 1.6, 100 );
        const light = new DirectionalLight('white', .9);
        light.position.set( 0, 10, 4 );
        scene.add( light );
        const light2 = new DirectionalLight('white', .9);
        light2.position.set( 0, 10, -4 );
        scene.add( light2 );


        camera.position.y = 3;
        camera.position.z = 4;
        camera.rotation.x = Math.PI * 3 / 1.7;

        window.addEventListener('mousemove', (e) => {
            try {
                // obj.rotation.y = -(.5 - e.clientX / window.innerWidth) / 20
                // obj.rotation.x = -(.5 - e.clientY / window.innerHeight) / 40
            } catch (e) {}
        })
        window.addEventListener('scroll', () => {
            // console.log(window.scrollY / 1400)
            let doc = document.getElementById('par')
            if (doc) {
                camera.position.x = 4 * window.scrollY / doc.getBoundingClientRect().height
                camera.position.y = 3 * window.scrollY / doc.getBoundingClientRect().height
                camera.position.z = 4 * window.scrollY / doc.getBoundingClientRect().height
            }
        })

        let animate = function () {
            requestAnimationFrame(animate);
            controls.update()
            try {
                // obj.rotation.x += 0.001;
                // obj.rotation.y += 0.001;
            } catch (e) {}
            renderer.render(scene, camera);
        }
        animate();

        console.log('anim', mount)
    }, [])

    return (
        <div>
            <div id='threeD' ref={ref => (mount = ref)} />
            {loading && <div>
                <h1 className='PhilosophyText navbarLinks' id='historyTabMargin'> </h1>
                <Loading text={' 40MB'} />
            </div>}
        </div>
    )
}