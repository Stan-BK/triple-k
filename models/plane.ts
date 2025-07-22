import type { SceneFactory } from '@/constructors/factory'
import * as THREE from 'three'

export default function usePlane(scene: SceneFactory) {
  const cubeGeometry = new THREE.BoxGeometry(100, 100, 10)
  const material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF })
  const cubeMesh = new THREE.Mesh(cubeGeometry, material)
  cubeMesh.position.set(0, 0, -20)
  cubeMesh.receiveShadow = true
  cubeMesh.castShadow = true
  scene.addGameObject(cubeMesh)
}
