import { Component, AfterViewInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

@Component({
  selector: 'app-conocer',
  templateUrl: './conocer.component.html',
  styleUrls: ['./conocer.component.css']
})
export class AppConocerComponent {

  constructor(
  ) { }

  ngAfterViewInit(): void {
    // Crear la escena
    const scene = new THREE.Scene();

    // Crear la cámara
    // Crear la cámara con posición un poco más baja
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // Relación de aspecto 1:1
    camera.position.set(0, 0.30, 2); // Posición de la cámara (x, y, z)
    camera.position.z = 1; // Aumentar la distancia de la cámara para hacer zoom

    // Crear el renderizador con fondo transparente y dimensiones específicas
    let width: number;
    let height: number;

    if (window.innerWidth <= 768) {
      width = 380; // Ancho del canvas para otros dispositivos
      height = 280; // Alto del canvas para otros dispositivos
      camera.position.z = 0.8; // Aumentar la distancia de la cámara para hacer zoom
    } else {
      width = 450; // Ancho del canvas para dispositivos móviles
      height = 240; // Alto del canvas para dispositivos móviles
    }

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0); // Fondo transparente

    // Obtener el contenedor del canvas
    const canvasContainer = document.getElementById('canvas-container');

    // Verificar si el contenedor existe y no es nulo
    if (canvasContainer) {
      // Agregar el renderizador al DOM
      canvasContainer.appendChild(renderer.domElement);
    } else {
      console.error('Canvas container not found.');
    }

    // Añadir luz ambiental a la escena
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Cargar el modelo GLTF
    const loader = new GLTFLoader();
    loader.load(
      '../../../assets/modelos3D/Lucerna vidriada.glb',
      (gltf) => {
        // Añadir el modelo a la escena
        scene.add(gltf.scene);

        // Recorrer los materiales del modelo y configurarlos correctamente
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Configurar el material del modelo
            const material = child.material as THREE.MeshStandardMaterial;
            material.metalness = 0; // Configurar metalness a 0 para que el modelo no parezca metálico
            material.emissive.setHex(0x000000); // Configurar el color emissive
            material.emissiveIntensity = 1; // Configurar la intensidad emissive

            // Si el modelo tiene texturas, asegúrate de que se muestren correctamente
            if (material.map) {
              material.map.encoding = THREE.sRGBEncoding; // Configurar la codificación de textura a sRGB
            }
          }
        });

        // Añadir rotación al modelo en la escena
        gltf.scene.rotation.y = Math.PI / 2; // Rotar 90 grados inicialmente
      },
      undefined,
      (error) => {
        console.error('Error loading GLTF model', error);
      }
    );

    // Animación
    function animate() {
      requestAnimationFrame(animate);

      // Rotar el modelo en la escena
      if (scene.children.length > 0) {
        const model = scene.children[scene.children.length - 1]; // Último objeto añadido a la escena (en este caso, el modelo)
        model.rotation.y += 0.01; // Cambia el valor de rotación para ajustar la velocidad
      }

      renderer.render(scene, camera);
    }

    animate();
  }

}
