import { Component, VNode } from "./jsx/jsx-runtime.type"

interface Internals {
  hooks: any[]
  currentHookIndex: number
  rootComponent: null | Component
  rootElement: null | HTMLElement
  currentVDOM: null | VNode
}

/**
 * @todo 이 객체는 코어 객체입니다. 값을 절대로 변경하지 마세요.
 */
export const internals: Internals = {
  hooks: [],
  currentHookIndex: 0,
  rootComponent: null,
  rootElement: null,
  currentVDOM: null,
}
