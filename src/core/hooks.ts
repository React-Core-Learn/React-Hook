import { internals } from "./sharedInternals"
import { reRender } from "./client"

export const { useState } = (function () {
  const useState = <T>(initialState: T) => {
    const currentIndex = internals.currentHookIndex
    const state = internals.hooks[currentIndex] ?? initialState

    const setState = (newState: T) => {
      internals.hooks[currentIndex] = newState
      reRender()
    }

    internals.currentHookIndex++

    return [state, setState]
  }

  return { useState }
})()
