import { internals } from "../sharedInternals"
import { Callback, Dependencies } from "./hooks.type"

export function useCallback(callback: Callback, dependencies?: Dependencies) {
  const currentIndex = internals.currentHookIndex
  const [oldValue, oldDependencies] = internals.hooks[currentIndex] || []

  let cachedFunction: Callback = oldValue
  let hasChanged = true

  if (oldDependencies) {
    hasChanged = dependencies
      ? dependencies.some((dependency, index) => !Object.is(dependency, oldDependencies[index]))
      : true
  }

  if (hasChanged) {
    cachedFunction = callback
    internals.hooks[currentIndex] = [callback, dependencies]
  }

  internals.currentHookIndex++

  return cachedFunction
}
