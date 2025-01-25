import { updateElement } from "@/core/jsx/jsx-runtime"
import { internals } from "./sharedInternals"
import { Component } from "./jsx/jsx-runtime.type"

/**
 * Note: 현재 microtaskQueue 활용으로 `frameRunner` 함수를 사용하지 않음
 */
function frameRunner(callback: () => void) {
  let rafId: ReturnType<typeof requestAnimationFrame>

  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }

    rafId = requestAnimationFrame(callback)
  }
}

export const { render, reRender } = (function () {
  const render = (element: HTMLElement, component: Component) => {
    internals.rootElement = element
    internals.rootComponent = component
    reRender()
  }

  const reRender = () => {
    if (!internals.rootElement || !internals.rootComponent) return
    const newVDOM = internals.rootComponent()

    updateElement(internals.rootElement, newVDOM, internals.currentVDOM)
    internals.currentHookIndex = 0
    internals.currentVDOM = newVDOM

    internals.effectList.filter((effectHook) => effectHook).forEach((fn) => fn())
    internals.effectList = []
  }

  return { render, reRender }
})()
