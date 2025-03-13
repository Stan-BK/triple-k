import * as THREE from 'three'

export class SceneFactory {
  public scene: THREE.Scene
  public camera: THREE.PerspectiveCamera
  public renderer: THREE.WebGLRenderer

  constructor() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      100,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    )

    this.renderer = new THREE.WebGLRenderer()
    this.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)
  }

  setSize(width: number, height: number) {
    this.renderer.setSize(width, height)
  }

  animate() {
    this.renderer.render(this.scene, this.camera)
  }

  active(fn?: () => void) {
    this.renderer.setAnimationLoop(() => {
      this.animate.bind(this)()
      fn?.bind(this)()
    })
  }

  addGameObject(gameObject: THREE.Object3D) {
    this.scene.add(gameObject)
  }

  removeGameObject(gameObject: THREE.Object3D) {
    this.scene.remove(gameObject)
  }
}
