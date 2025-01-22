import { reRender } from "../client"
import { internals } from "../sharedInternals"

export function useState<T>(initialState: T) {
  const currentIndex = internals.currentHookIndex
  const state = internals.hooks[currentIndex] ?? initialState

  const setState = (newState: T) => {
    if (Object.is(state, newState)) {
      return
    }

    internals.hooks[currentIndex] = newState
    reRender()
  }

  internals.currentHookIndex++

  return [state, setState]
}
