import { internals } from "./sharedInternals"
import { reRender } from "./client"

type UseEffectCallback = (...args: any[]) => void
type UseEffectDep = any[]

export const { useState, useEffect } = (function () {
  const useState = <T>(initialState: T) => {
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

  const useEffect = (callback: UseEffectCallback, dependencies?: UseEffectDep) => {
    const currentIndex = internals.currentHookIndex
    const oldDependencies = internals.hooks[currentIndex]
    let hasChanged = true

    if (oldDependencies) {
      hasChanged = dependencies
        ? dependencies.some((dependency, index) => !Object.is(dependency, oldDependencies[index]))
        : true
    }

    if (hasChanged) {
      internals.hooks[currentIndex] = dependencies || null
      internals.effectList[currentIndex] = callback
    }

    internals.currentHookIndex++
  }

  return { useState, useEffect }
})()
