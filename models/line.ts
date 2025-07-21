import type { TestCase } from '@/types/type'
import * as THREE from 'three'

export default function useLine(testCases: TestCase[]) {
  const points = []
  points.push(new THREE.Vector3(-10, 0, 0))
  points.push(new THREE.Vector3(0, 10, 0))
  points.push(new THREE.Vector3(10, 0, 0))

  testCases.push({
    name: 'line',
    elem: new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x0000FF })),
  })
}
