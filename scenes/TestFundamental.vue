<script setup lang="ts">
import mainScene from '@/scenes/test'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { reactive, ref, shallowReactive } from 'vue'
import '@/assets/styles/index.less'

mainScene.active()

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

const textMesh = ref<THREE.Mesh>()

const testCases = shallowReactive<TestCase[]>([{ elem: cubeMesh, name: 'cube' }, { elem: lineGeometry, name: 'line' }, { elem: textMesh.value!, name: 'text' }])

fontLoader.load('./assets/fonts/gentilis_bold.typeface.json', (font) => {
  const textGeometry = new TextGeometry('Hello World', {
    font,
    size: 80,
    depth: 5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 10,
    bevelSize: 8,
    bevelOffset: 0,
    bevelSegments: 5,
  })

  textGeometry.computeBoundingBox()

  textMesh.value = new THREE.Mesh(textGeometry, [
    new THREE.MeshPhongMaterial({ color: 0xFFFFFF, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xFFFFFF }), // side
  ])

  testCases.find(item => item.name === 'text')!.elem = textMesh.value!
})
// #endregion

interface TestCase {
  name: string
  elem: THREE.Object3D
}

function toggleTestCase(tar: THREE.Object3D) {
  testCases.forEach((item) => {
    if (item.elem !== tar) {
      mainScene.removeGameObject(item.elem)
    }
    else {
      mainScene.addGameObject(item.elem)
    }
  })
}
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
