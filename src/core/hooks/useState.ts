import { reRender } from "../client"
import { internals } from "../sharedInternals"

export function useState<T>(initialState: T) {
  const currentIndex = internals.currentHookIndex
  const state = internals.hooks[currentIndex] ?? initialState

  const setState = (newState: T) => {
    if (Object.is(state, newState)) {
      return
    }

    const addBatchQueue = () => {
      internals.hooks[currentIndex] = newState
    }

    internals.batchQueue.push(addBatchQueue)
    scheduleBatch()
  }

  internals.currentHookIndex++

  return [state, setState]
}

function flushBatchQueue() {
  internals.batchQueue.forEach((fn) => fn())
  internals.batchQueue = []
  reRender()
  internals.isBatching = false
}

function scheduleBatch() {
  if (!internals.isBatching) {
    internals.isBatching = true
    queueMicrotask(flushBatchQueue)
  }
}
