import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

const hdrTextureURL = new URL('../imgs/MR_INT-004_BigWindowTree_Thea.hdr', import.meta.url);



const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background
renderer.setClearColor(0xFEFEFE);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning
camera.position.set(6, 8, 14);
orbit.update();

renderer.outputEncoding = THREE.sRGBEncoding;
// map color to srgb colorspace
renderer.toneMapping = THREE.ACESFilmicToneMapping;
const loader = new RGBELoader();
loader.load(hdrTextureURL, function(texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    //load 360

    scene.background = texture;
    scene.environment = texture;
    //light information from texture

    const square = new THREE.Mesh(
        new THREE.BoxGeometry(5,5, 5),
        new THREE.MeshPhysicalMaterial({
            roughness:0,
            metalness: 1
        })

    );
    
    scene.add(square);

});

function animate() {
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});