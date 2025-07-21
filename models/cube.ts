import type { SceneFactory } from '@/constructors/factory'
import type { TestCase } from '@/types/type'
import * as THREE from 'three'

export default function useCube(testCases: TestCase[], scene: SceneFactory) {
  const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
  const cubeMesh = new THREE.Mesh(cubeGeometry, material)
  cubeMesh.rotation.x += 0.05
  cubeMesh.rotation.y += 0.05
  scene.camera.position.z = 20

  testCases.push({
    name: 'cube',
    elem: cubeMesh,
  })

  return cubeMesh
}
