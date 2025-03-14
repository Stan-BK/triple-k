export function usePointerEvent(target: HTMLElement, onPointerDown: (event: PointerEvent) => void, onPointerMove: (event: PointerEvent) => void, onPointerUp: (event: PointerEvent) => void) {
  const pointerEventManager = new PointerEventManager(target, onPointerDown, onPointerMove, onPointerUp)

  return {
    dispose: () => {
      pointerEventManager.dispose()
    },
  }
}

class PointerEventManager {
  onPointerDown: (event: PointerEvent) => void
  onPointerMove: (event: PointerEvent) => void
  onPointerUp: (event: PointerEvent) => void

  constructor(target: HTMLElement, onPointerDown: (event: PointerEvent) => void, onPointerMove: (event: PointerEvent) => void, onPointerUp: (event: PointerEvent) => void) {
    this.onPointerDown = this.baseOnPointerDown(onPointerDown).bind(this)
    this.onPointerMove = this.baseOnPointerMove(onPointerMove).bind(this)
    this.onPointerUp = this.baseOnPointerUp(onPointerUp).bind(this)

    target.addEventListener('pointerdown', this.onPointerDown)
  }

  dispose() {
    document.removeEventListener('pointermove', this.onPointerMove)
    document.removeEventListener('pointerup', this.onPointerUp)
  }

  baseOnPointerDown(onPointerDown: (event: PointerEvent) => void) {
    return (event: PointerEvent) => {
      if (event.isPrimary === false)
        return
      onPointerDown(event)

      document.addEventListener('pointermove', this.onPointerMove)
      document.addEventListener('pointerup', this.onPointerUp)
    }
  }

  baseOnPointerMove(onPointerMove: (event: PointerEvent) => void) {
    return (event: PointerEvent) => {
      if (event.isPrimary === false)
        return
      onPointerMove(event)
    }
  }

  baseOnPointerUp(onPointerUp: (event: PointerEvent) => void) {
    return (event: PointerEvent) => {
      if (event.isPrimary === false)
        return
      onPointerUp(event)
      this.dispose()
    }
  }
}
