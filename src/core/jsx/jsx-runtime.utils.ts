import { VNode } from "./jsx-runtime.type"

export function isNullOrUndefined(node: VNode) {
  return node === null || node === undefined
}

export function isPrimitive(node: VNode) {
  return typeof node === "string" || typeof node === "number"
}

export function isVDOM(node: VNode) {
  return typeof node === "object" && node !== null
}

export function isDiffText(newNode: VNode, oldNode: VNode) {
  if (JSON.stringify(newNode) === JSON.stringify(oldNode)) return false
  if (typeof newNode === "object" || typeof oldNode === "object") return false
  return true
}
