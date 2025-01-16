import { internals } from "../sharedInternals"
import type { Type, VDOM, Props, VNode } from "./jsx-runtime.type"
import { isNullOrUndefined, isPrimitive } from "./jsx-runtime.utils"

function h(type: Type, props: Props, ...children: VNode[]): VDOM {
  return { type, props: props || {}, children: children.flat() }
}

function createElement(node: VNode) {
  if (isNullOrUndefined(node)) {
    return document.createDocumentFragment()
  }

  if (isPrimitive(node)) {
    return document.createTextNode(String(node))
  }

  const element = document.createElement(node.type)

  setAttribute(element, node.props)
  node.children.map(createElement).forEach((child) => element.appendChild(child))

  return element
}

function setAttribute(element: HTMLElement, props: Props) {
  Object.entries(props)
    .filter(([_, value]) => value)
    .forEach(([attr, value]) => {
      if (attr.startsWith("on") && typeof props[attr] === "function") {
        const eventType = attr.slice(2).toLowerCase()
        element.addEventListener(eventType, props[attr])
      }

      if (attr === "className") {
        element.setAttribute("class", value)
        return
      }

      element.setAttribute(attr, value)
    })
}

function updateAttributes(element: HTMLElement, newProps: Props = {}, oldProps: Props = {}) {
  for (const [attr, value] of Object.entries(newProps)) {
    if (newProps[attr] === oldProps[attr]) continue

    if (attr.startsWith("on") && typeof value === "function") {
      const eventType = attr.slice(2).toLowerCase()
      element.removeEventListener(eventType, oldProps[attr])
      element.addEventListener(eventType, newProps[attr])
    }

    element.setAttribute(attr, value)
  }

  for (const [attr] of Object.entries(oldProps)) {
    if (newProps[attr]) continue
    element.removeAttribute(attr)
  }
}

export function updateElement(parent: HTMLElement, newNode?: VNode, oldNode?: VNode, index: number = 0) {
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index])
    return
  }

  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode))
    return
  }

  if (diffText(newNode, oldNode)) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index])
    return
  }

  if (!isVDOM(newNode) || !isVDOM(oldNode)) return

  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index])
    return
  }

  if (parent.childNodes[index]) {
    updateAttributes(parent.childNodes[index] as HTMLElement, newNode.props, oldNode.props)
  }

  const maxLength = Math.max(newNode.children.length, oldNode.children.length)

  for (let i = 0; i < maxLength; i++) {
    updateElement(parent.childNodes[index] as HTMLElement, newNode.children[i], oldNode.children[i], i)
  }
}

function isVDOM(node: VNode) {
  return typeof node === "object" && node !== null
}

function diffText(newNode: VNode, oldNode: VNode) {
  if (JSON.stringify(newNode) === JSON.stringify(oldNode)) return false
  if (typeof newNode === "object" || typeof oldNode === "object") return false
  return true
}

export { h, createElement }
