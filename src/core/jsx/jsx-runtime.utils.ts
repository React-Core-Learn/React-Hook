import { VNode } from "./jsx-runtime.type"

export function isNullOrUndefined(node: VNode) {
  return node === null || node === undefined
}

export function isPrimitive(node: VNode) {
  return typeof node === "string" || typeof node === "number"
}
