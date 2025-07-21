import type { TestCase } from '@/types/type'
import type * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export default function use3DModel(testCases: TestCase[]) {
  let Model3D: THREE.Group
  const loader = new GLTFLoader()
  loader.load('../assets/models/shiba/scene.gltf', (gltf) => {
    Model3D = gltf.scene
    Model3D.scale.set(5, 5, 5)
    testCases.push({
      name: 'model',
      elem: Model3D,
    })
  }, undefined, (error) => {
    console.error(error)
  })
}
