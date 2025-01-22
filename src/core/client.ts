import { updateElement } from "@/core/jsx/jsx-runtime"
import { internals } from "./sharedInternals"
import { Component } from "./jsx/jsx-runtime.type"

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

  const reRender = frameRunner(() => {
    if (!internals.rootElement || !internals.rootComponent) return
    const newVDOM = internals.rootComponent()

    updateElement(internals.rootElement, newVDOM, internals.currentVDOM)
    internals.currentHookIndex = 0
    internals.currentVDOM = newVDOM

    internals.effectList.filter((effectHook) => effectHook).forEach((fn) => fn())
    internals.effectList = []
  })

  return { render, reRender }
})()
