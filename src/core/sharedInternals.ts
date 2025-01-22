import { Component, VNode } from "./jsx/jsx-runtime.type"

interface Internals {
  hooks: any[]
  currentHookIndex: number
  rootComponent: null | Component
  rootElement: null | HTMLElement
  currentVDOM: null | VNode
  effectList: (() => void)[]
}

/**
 * NOTE - 이 객체는 코어 객체입니다. 값을 절대로 변경하지 마세요. 만약 값을 변경하게되면 제대로 동작하지 않을 수 있습니다.
 */
export const internals: Internals = {
  hooks: [],
  currentHookIndex: 0,
  rootComponent: null,
  rootElement: null,
  currentVDOM: null,
  effectList: [],
}
