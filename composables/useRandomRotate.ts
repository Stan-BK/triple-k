import type * as THREE from 'three'

export function useRandomRotate(obj: THREE.Object3D, interval?: number) {
  const randomRotate = new RandomRotate(obj, interval)
  return {
    startRotate() {
      randomRotate.randomRotate()
    },
    stopRotate() {
      randomRotate.stopRotate()
    },
  }
}

class RandomRotate {
  isRotate = true
  constructor(private obj: THREE.Object3D, private interval?: number) {
    this.obj = obj
  }

  randomRotate() {
    let time = 0
    const animate = (t: number) => {
      if (!this.isRotate)
        return
      const elapsed = t - time
      if (elapsed < 2) {
        requestAnimationFrame(animate.bind(this))
        return
      }
      time = t
      this.obj.rotateX(Math.PI / 360)
      this.obj.rotateY(Math.PI / 360)
      this.obj.rotateZ(Math.PI / 360)
      requestAnimationFrame(animate.bind(this))
    }
    this.isRotate = true
    animate.bind(this)(time)
  }

  stopRotate() {
    this.isRotate = false
  }
}
