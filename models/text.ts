import type { TestCase } from '@/types/type'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

export default function useText(testCases: TestCase[], group: THREE.Group) {
  const fontLoader = new FontLoader()

  let textMesh: THREE.Mesh
  let textMaterials: THREE.MeshPhongMaterial[] = [] // 存储材质引用

  fontLoader.load('./assets/fonts/gentilis_bold.typeface.json', (font) => {
    const textGeometry = new TextGeometry('KKK', {
      font,
      size: 10,
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.3,
      bevelSize: 0.1,
      bevelOffset: 0.1,
      bevelSegments: 100,
    })

    textGeometry.computeBoundingBox()
    const centerOffsetX = -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x)
    const centerOffsetY = -0.5 * (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y)
    textGeometry.translate(centerOffsetX, centerOffsetY, 0)

    // 创建材质并保存引用
    textMaterials = [
      new THREE.MeshPhongMaterial({ color: 0x6C757D, emissive: 0x6C757D, flatShading: true }),
      new THREE.MeshPhongMaterial({ color: 0x6C757D, emissive: 0x330000 }),
    ]

    textMesh = new THREE.Mesh(textGeometry, textMaterials)

    textMesh.position.set(0, 0, 0)
    textMesh.receiveShadow = true
    textMesh.castShadow = true

    testCases.push({
      name: 'text',
      elem: textMesh,
    })

    group.add(textMesh)
  })
}
