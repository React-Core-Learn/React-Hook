import { internals } from "../sharedInternals"

type UseEffectCallback = (...args: any[]) => void
type UseEffectDep = any[]

export function useEffect(callback: UseEffectCallback, dependencies?: UseEffectDep) {
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
