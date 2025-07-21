<script setup lang="ts">
import type { TestCase } from '@/types/type'
import { usePointerEvent } from '@/composables/usePointerEvent'
import { useRandomRotate } from '@/composables/useRandomRotate'
import { SceneFactory } from '@/constructors/factory'
import use3DModel from '@/models/3D_Model'
import useCube from '@/models/cube'
import useLine from '@/models/line'
import useText from '@/models/text'
import * as THREE from 'three'
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

const testCases = shallowReactive<TestCase[]>([])
useLine(testCases)
useCube(testCases, mainScene)
useText(testCases, group)
use3DModel(testCases)

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
