<script setup lang="ts">
import { usePointerEvent } from '@/composables/usePointerEvent'
import mainScene from '@/scenes/test'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { onUnmounted, shallowReactive } from 'vue'
import '@/assets/styles/index.less'

let pointerX = 0
let pointerXOnPointerDown = 0
let pointerY = 0
let pointerYOnPointerDown = 0
const windowHalfX = window.innerWidth / 2
const windowHalfY = window.innerHeight / 2
let targetRotationX = 0
let targetRotationY = 0
let targetRotationOnPointerDownX = 0
let targetRotationOnPointerDownY = 0
const group = new THREE.Group()

mainScene.addGameObject(group)

const { dispose } = usePointerEvent(document.body, (event) => {
  if (event.isPrimary === false)
    return

  pointerXOnPointerDown = event.clientX - windowHalfX
  pointerYOnPointerDown = event.clientY - windowHalfY
  targetRotationOnPointerDownX = targetRotationX
  targetRotationOnPointerDownY = targetRotationY
}, (event) => {
  pointerX = event.clientX - windowHalfX
  pointerY = event.clientY - windowHalfY
  targetRotationX = targetRotationOnPointerDownX + (pointerX - pointerXOnPointerDown) * 0.02
  targetRotationY = targetRotationOnPointerDownY + (pointerY - pointerYOnPointerDown) * 0.02
}, () => {
})

mainScene.active(() => {
  group.rotation.y += (targetRotationX - group.rotation.y) * 0.05
  group.rotation.x += (targetRotationY - group.rotation.x) * 0.05
})
mainScene.renderer.setClearColor(0xAAAAAA)
// #region Geometry
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const cubeMesh = new THREE.Mesh(boxGeometry, material)
cubeMesh.rotation.x += 0.05
cubeMesh.rotation.y += 0.05
mainScene.camera.position.z = 20
// #endregion

// #region Line
const points = []
points.push(new THREE.Vector3(-10, 0, 0))
points.push(new THREE.Vector3(0, 10, 0))
points.push(new THREE.Vector3(10, 0, 0))

const lineGeometry = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x0000FF }))
// #endregion

// #region Text
const fontLoader = new FontLoader()

let textMesh: THREE.Mesh

const testCases = shallowReactive<TestCase[]>([{ elem: cubeMesh, name: 'cube' }, { elem: lineGeometry, name: 'line' }, { elem: textMesh!, name: 'text' }])

fontLoader.load('./assets/fonts/gentilis_bold.typeface.json', (font) => {
  const textGeometry = new TextGeometry('KKK', {
    font,
    size: 1,
    depth: 0.5,
  })

  textGeometry.computeBoundingBox()
  const centerOffsetX = -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x)
  const centerOffsetY = -0.5 * (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y)
  textGeometry.translate(centerOffsetX, centerOffsetY, 0)

  textMesh = new THREE.Mesh(textGeometry, [
    new THREE.MeshPhongMaterial({ color: 0xFFFFFF, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xFFFFFF }), // side
  ])

  textMesh.position.set(0, 0, 0)

  testCases.find(item => item.name === 'text')!.elem = textMesh
})
// #endregion

interface TestCase {
  name: string
  elem: THREE.Object3D
}

function toggleTestCase(tar: THREE.Object3D) {
  testCases.forEach((item) => {
    if (item.elem !== tar) {
      group.remove(item.elem)
    }
    else {
      group.add(item.elem)
      item.elem.position.set(0, 0, 0)
    }
  })
}

onUnmounted(() => {
  dispose()
})
</script>

<template>
  <ul id="control-panel">
    <li v-for="(item) in testCases" :key="item.name">
      <button @click="toggleTestCase(item.elem)">
        {{ item.name }}
      </button>
    </li>
  </ul>
</template>

<style scoped lang="less">
#test-fundamental {
    width: 100%;
    height: 100%;
}
</style>
