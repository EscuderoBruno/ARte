// Motor gráfico TAG 
// WithU ARte
// Author: Elías Alfonso Carrasco Guerrero 
// Version: 3.01
// Last Updated: 18:50 06/02/2024

import * as THREE from 'three';
import {ElementRef, Injectable, NgZone, OnDestroy} from '@angular/core';

import {GLTF, GLTFLoader, GLTFReference} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

@Injectable({providedIn: 'root'})
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camera!: THREE.PerspectiveCamera;
  private scene!: THREE.Scene;
  private light!: THREE.AmbientLight;

  private modelo!: THREE.Group<THREE.Object3DEventMap>;

  private cube!: THREE.Mesh;
  private originalPosition?: THREE.Vector3;
  private originalRotation?: THREE.Euler;
  private originalScale?: THREE.Vector3;

  private frameId!: number;

  private isTouchInsideCanvas = false;
  private isMouseInsideCanvas = false;

  public constructor(private ngZone: NgZone) {
    
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public initCamera(): void {
    const maxCanvasSize = 600;
    const canvasSize = Math.min(maxCanvasSize, window.innerWidth);
    const relacion = canvasSize/600;
    this.camera = new THREE.PerspectiveCamera(
      75, relacion, 0.1, 1000
    );
    this.camera.position.z = 4;
    this.camera.position.y = -1.5;
    this.scene.add(this.camera);
  }

  public initRender(): void {
    const maxCanvasSize = 600;
    const canvasSize = Math.min(maxCanvasSize, window.innerWidth);
    console.log("CANVAS SIZE: " + canvasSize);
  
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // fondo transparente
      antialias: false // bordes suavizados
    });
  
    this.renderer.setSize(canvasSize, 600);
  }
  

  public addDirectionalLight(): void {
    var luzDireccional = new THREE.DirectionalLight("#fff2cc", 2);
    luzDireccional.position.set(1, 1, 1).normalize();
    this.scene.add(luzDireccional);
  };

  public initLighting(): void {
    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);
    this.addDirectionalLight();
  };

  public addCube(): void {
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshPhongMaterial({
        color: "white",
        specular: "#fff2cc", // Color de resplandor especular (0x000, 0x111)
        shininess: 50        // Exponente especular
    });
    this.cube = new THREE.Mesh(geometry, material);

    this.originalPosition = this.cube.position.clone();
    this.originalRotation = this.cube.rotation.clone();
    this.originalScale = this.cube.scale.clone();

    this.scene.add(this.cube);
  }
  
  /*public create3DObject(): void {
    var loader = new THREE.ObjectLoader();
    //var path = "C:/Users/elcar/OneDrive/Documentos/GitHub/arte/angular/src/app/pages/app/adulto/engine/Ancient_Vase.json";
    var path = "assets/Ancient_Vase.json";
    loader.load(path, (obj) => {
      this.scene.add(obj);
    });
  }*/

  public create3DObject(path: string): void {
    const gltfLoader = new GLTFLoader();
    const rgbeLoader = new RGBELoader();

    //let path = 'assets/vasija.glb';

    rgbeLoader.load('assets/luz_global.hdr', (texture) =>{
      texture.mapping = THREE.EquirectangularReflectionMapping;
      this.scene.environment = texture;
      gltfLoader.load(path, (gltf) => {
        this.modelo = gltf.scene;
        this.scene.add(this.modelo);
      })
    })
  }

  public rotateObject(deltaX: number, deltaY: number): void {
    this.modelo.rotation.y += deltaX * 0.008; // Ajusta la sensibilidad según tus necesidades
    this.modelo.rotation.x += deltaY * 0.008; // Ajusta la sensibilidad según tus necesidades
  }

  public rotarConRaton(): void {
    let mouseX = 0;
    let mouseY = 0;
    let isClicked = false;

    document.addEventListener('mousedown', (event) => {
      if (this.isMouseInsideCanvas) {
        isClicked = true;
        mouseX = event.clientX;
        mouseY = event.clientY;
      }
    });

    document.addEventListener('mouseup', () => {
      isClicked = false;
    });

    document.addEventListener('mousemove', (event) => {
      if (isClicked && this.isMouseInsideCanvas) {
        const deltaX = event.clientX - mouseX;
        const deltaY = event.clientY - mouseY;
        mouseX = event.clientX;
        mouseY = event.clientY;

        this.rotateObject(deltaX, deltaY);
      }
    });
  } 


  /*
  public desplazarConTacto(objeto3D: THREE.Mesh): void {
    let touchStartX = 0;
    let touchStartY = 0;
  
    document.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    });
  
    document.addEventListener('touchmove', (event) => {
      const touchCurrentX = event.touches[0].clientX;
      const touchCurrentY = event.touches[0].clientY;
  
      const deltaX = (touchCurrentX - touchStartX) * 0.01; // Ajusta la sensibilidad según tus necesidades
      const deltaY = (touchCurrentY - touchStartY) * 0.01; // Ajusta la sensibilidad según tus necesidades
  
      objeto3D.position.x += deltaX;
      objeto3D.position.y -= deltaY; // Invertido porque en la pantalla táctil, Y aumenta hacia abajo
  
      touchStartX = touchCurrentX;
      touchStartY = touchCurrentY;
    });
  }
  */

  public rotarConTacto(): void {
    let touchStartX = 0;
    let touchStartY = 0;
  
    document.addEventListener('touchstart', (event) => {
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    });
  
    document.addEventListener('touchmove', (event) => {
      if(this.isTouchInsideCanvas) {
        event.preventDefault();
        const touchCurrentX = event.touches[0].clientX;
        const touchCurrentY = event.touches[0].clientY;
    
        const deltaX = (touchCurrentX - touchStartX) * 0.6; // Ajusta la sensibilidad según tus necesidades
        const deltaY = (touchCurrentY - touchStartY) * 0.6; // Ajusta la sensibilidad según tus necesidades
    
        this.rotateObject(deltaX, deltaY);
    
        touchStartX = touchCurrentX;
        touchStartY = touchCurrentY;
      }
    }, { passive: false });
  }

  public zoomRuedaRaton(): void { 
    document.addEventListener('wheel', (event) => {
      if (this.isMouseInsideCanvas) {
        event.preventDefault();   //Para que no haga scroll down mientras se hace zoom
        var delta = event.deltaY * 0.005; // Ajusta la sensibilidad
        this.camera.position.z += delta;
      }
    }, { passive: false });
  }

  public zoomTactil(): void {
    // Zoom en dispositivos táctiles (móviles y tabletas)
    var touchStartDistance = 0;

    if (this.isTouchInsideCanvas) {
      document.addEventListener('touchstart', (event) => {
          if (event.touches.length === 2) {
              var touch1 = event.touches[0].clientX;
              var touch2 = event.touches[1].clientX;
              touchStartDistance = Math.abs(touch1 - touch2);
          }
      }, { passive: false });

      document.addEventListener('touchmove', (event) => {
        event.preventDefault();   //Para que no haga scroll down mientras se hace zoom
        if (event.touches.length === 2) {
          var touch1 = event.touches[0].clientX;
          var touch2 = event.touches[1].clientX;
          var touchCurrentDistance = Math.abs(touch1 - touch2);
          var delta = touchStartDistance - touchCurrentDistance;

          this.camera.position.z += delta * 0.1; // Ajusta la sensibilidad según tus necesidades
          touchStartDistance = touchCurrentDistance;
        }
      }, { passive: false });
    }
  }

  public aplicarZoom(): void {
    this.zoomRuedaRaton();
    this.zoomTactil();
  };

  public detectarSiEstasEnCanvasMovil(): void {
    this.canvas.addEventListener('touchstart', () => {
      this.isTouchInsideCanvas = true;
    });

    this.canvas.addEventListener('touchend', () => {
      this.isTouchInsideCanvas = false;
    });
  }

  public detectarSiEstasEnCanvasRaton(): void {
    this.canvas.addEventListener('mouseenter', () => {
      this.isMouseInsideCanvas = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isMouseInsideCanvas = false;
    });
  }

  public reset(objeto3D: THREE.Mesh): void {
    var resetButton = document.getElementById('resetButton');

    if (resetButton != null) {
      resetButton.addEventListener('click', () => {
          if (this.originalPosition && this.originalRotation && this.originalScale) {
              this.camera.position.z = 5;
              objeto3D.position.copy(this.originalPosition);
              objeto3D.rotation.copy(this.originalRotation);
              objeto3D.scale.copy(this.originalScale);
          }
      });
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.initRender();

    // create the scene
    this.scene = new THREE.Scene();

    //Create camera
    this.initCamera();

    this.initLighting();

    //this.addCube();
    //this.create3DObject('assets/vasija.glb'); //Ruta relativa desde src 

    //this.desplazarConTacto(this.cube);

    this.rotarConRaton();
    this.rotarConTacto();

    this.aplicarZoom();

    this.reset(this.cube);
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });

    this.detectarSiEstasEnCanvasMovil();
    this.detectarSiEstasEnCanvasRaton();

    //this.cube.rotation.x += 0.01;
    //this.cube.rotation.y += 0.01;
    /*
    if (this.modelo) {
      this.modelo.rotation.y += 0.01;
    }
    */
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
