import { internals } from "../sharedInternals"
import { Callback, Dependencies } from "./hooks.type"

export function useMemo(callback: Callback, dependencies?: Dependencies) {
  const currentIndex = internals.currentHookIndex
  const [oldValue, oldDependencies] = internals.hooks[currentIndex] || []

  let hasChanged = true
  let memoValue = oldValue || null

  if (oldDependencies) {
    hasChanged = dependencies
      ? dependencies.some((dependency, index) => !Object.is(dependency, oldDependencies[index]))
      : true
  }

  if (hasChanged) {
    memoValue = callback()
    internals.hooks[currentIndex] = [memoValue, dependencies]
  }

  internals.currentHookIndex++

  return memoValue
}
