import { updateElement } from "@/core/jsx/jsx-runtime"
import { internals } from "./sharedInternals"
import { Component } from "./jsx/jsx-runtime.type"

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
  }

  return { render, reRender }
})()
