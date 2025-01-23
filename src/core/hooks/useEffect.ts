import { internals } from "../sharedInternals"
import { Callback, Dependencies } from "./hooks.type"

export function useEffect(callback: Callback, dependencies?: Dependencies) {
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
