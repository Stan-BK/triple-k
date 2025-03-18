<script setup lang="ts">
import { usePointerEvent } from '@/composables/usePointerEvent'
import { useRandomRotate } from '@/composables/useRandomRotate'
import { SceneFactory } from '@/constructors/factory'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { onUnmounted, ref, shallowReactive, watch } from 'vue'
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

const mainScene = new SceneFactory()

function setSizeWhenResize() {
  mainScene.setSize(window.innerWidth, window.innerHeight)
}

window.addEventListener('resize', setSizeWhenResize)

mainScene.addGameObject(group)

const { startRotate, stopRotate } = useRandomRotate(group)

startRotate()

let isPointerDown = false
const { dispose } = usePointerEvent(document.body, (event) => {
  if (event.isPrimary === false)
    return

  isPointerDown = true
  stopRotate()

  pointerXOnPointerDown = event.clientX - windowHalfX
  pointerYOnPointerDown = event.clientY - windowHalfY
  targetRotationOnPointerDownX = targetRotationX = group.rotation.x
  targetRotationOnPointerDownY = targetRotationY = group.rotation.y
}, (event) => {
  pointerX = event.clientX - windowHalfX
  pointerY = event.clientY - windowHalfY
  targetRotationX = targetRotationOnPointerDownX + (pointerX - pointerXOnPointerDown) * 0.02
  targetRotationY = targetRotationOnPointerDownY + (pointerY - pointerYOnPointerDown) * 0.02
}, () => {
  isPointerDown = false
  startRotate()
})

mainScene.active(() => {
  if (!isPointerDown)
    return
  group.rotation.x += (targetRotationX - group.rotation.x) * 0.05
  group.rotation.y += (targetRotationY - group.rotation.y) * 0.05
})

mainScene.renderer.setClearColor(0xAAAAAA)

// #region Light
// 添加光源
const ambientLight = new THREE.AmbientLight(0xAAAAAA, 2) // 环境光
mainScene.addGameObject(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x000000, 1) // 平行光
directionalLight.position.set(1, 1, 1)
mainScene.addGameObject(directionalLight)
// #endregion

// #region Cube
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const cubeMesh = new THREE.Mesh(cubeGeometry, material)
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

const testCases = shallowReactive<TestCase[]>([{ elem: cubeMesh, name: 'cube' }, { elem: lineGeometry, name: 'line' }, { elem: null!, name: 'text' }, { elem: null!, name: '3dModel' }])

// #region Text
const fontLoader = new FontLoader()

let textMesh: THREE.Mesh
let textMaterials: THREE.MeshPhongMaterial[] = [] // 存储材质引用

const textColor = ref('#FF0000')

// 添加更新颜色的方法

watch(textColor, (value) => {
  if (textMaterials.length > 0) {
    const newColor = new THREE.Color(value)
    textMaterials.forEach((material, idx) => {
      material.color.set(new THREE.Color(newColor.r - idx * 0.8, newColor.g, newColor.b))
      material.emissive.set(new THREE.Color(newColor.r - idx * 0.8, newColor.g, newColor.b))
    })
  }
})

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
    new THREE.MeshPhongMaterial({ color: 0xFF0000, emissive: 0xFF0000, flatShading: true }),
    new THREE.MeshPhongMaterial({ color: 0xFF0000, emissive: 0x330000 }),
  ]

  textMesh = new THREE.Mesh(textGeometry, textMaterials)

  textMesh.position.set(0, 0, 0)

  testCases.find(item => item.name === 'text')!.elem = textMesh

  group.add(textMesh)
})
// #endregion

// #region 3D Model
let Model3D: THREE.Group
const loader = new GLTFLoader()
loader.load('../assets/models/shiba/scene.gltf', (gltf) => {
  Model3D = gltf.scene
  Model3D.scale.set(5, 5, 5)
  testCases.find(item => item.name === '3dModel')!.elem = Model3D
}, undefined, (error) => {
  console.error(error)
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
  window.removeEventListener('resize', setSizeWhenResize)
})
</script>

<template>
  <ul id="control-panel">
    <li v-for="(item) in testCases" :key="item.name">
      <button @click="toggleTestCase(item.elem)">
        {{ item.name }}
      </button>
    </li>
    <!-- <li>
      <input
        v-model="textColor"
        type="color"
        value="#FF0000"
      >
    </li> -->
  </ul>
</template>

<style scoped lang="less">
#test-fundamental {
    width: 100%;
    height: 100%;
}

#control-panel {
  position: fixed;
  top: 10px;
  left: 10px;
  list-style: none;
  padding: 24px;
  margin: 0;
  background-color: #fff;

  li {
    margin-bottom: 10px;
  }

  button {
    padding: 5px 10px;
    cursor: pointer;
  }

  input[type="color"] {
    width: 50px;
    height: 30px;
    cursor: pointer;
  }
}
</style>
