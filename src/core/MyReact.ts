import debounceFrame from '../utils/debounceFrame';

interface Options {
  renderCount: number;
  componentStateMap: Map<any, { states: any[]; currentStateKey: number }>;
  root: Element | null;
  rootComponent: any;
}

export default function MyReact() {
  const options: Options = {
    renderCount: 0,
    componentStateMap: new Map(),
    root: null,
    rootComponent: null,
  };

  function getComponentState(component: any) {
    if (!options.componentStateMap.has(component)) {
      options.componentStateMap.set(component, { states: [], currentStateKey: 0 });
    }
    return options.componentStateMap.get(component)!;
  }

  function useState(initState: any) {
    const component = options.rootComponent;
    const componentState = getComponentState(component);
    const { currentStateKey: key, states } = componentState;

    if (states.length === key) states.push(initState);

    const state = states[key];
    const setState = (newState: any) => {
      states[key] = newState;
      _render();
    };

    componentState.currentStateKey += 1;
    return [state, setState];
  }

  const _render = debounceFrame(() => {
    const { root, rootComponent } = options;
    if (!root || !rootComponent) return;
    root.innerHTML = rootComponent();

    options.componentStateMap.forEach(state => (state.currentStateKey = 0));

    options.renderCount += 1;
  });

  function useEffect<T extends (...arg: any[]) => any>(callback: T, dependencies: any[]) {
    const component = options.rootComponent;
    const componentState = getComponentState(component);
    const { currentStateKey: key, states } = componentState;

    const oldDependencies = states[key];
    let hasChanged = true;

    if (oldDependencies) {
      hasChanged = dependencies.some((dep, index) => !Object.is(dep, oldDependencies[index]));
    }
    if (hasChanged) {
      callback();
      states[key] = dependencies;
    }

    componentState.currentStateKey += 1;
  }

  function useCallback<T extends (...arg: any[]) => any>(callback: T, dependencies: any[]) {
    const component = options.rootComponent;
    const componentState = getComponentState(component);
    const { currentStateKey: key, states } = componentState;

    const oldDependencies = states[key]?.dependencies;
    let hasChanged = true;

    if (oldDependencies) {
      hasChanged =
        dependencies.length !== oldDependencies.length ||
        dependencies.some((dep, index) => !Object.is(dep, oldDependencies[index]));
    }

    if (hasChanged) {
      states[key] = { callback, dependencies };
    }

    componentState.currentStateKey += 1;
    return states[key].callback;
  }

  function useMemo<T>(callback: () => T, dependencies: any[]) {
    const component = options.rootComponent;
    const componentState = getComponentState(component);
    const { currentStateKey: key, states } = componentState;

    const [oldDependencies, oldMemoValue] = states[key] || [];
    let hasChanged = true;
    let memoValue = oldMemoValue;

    if (oldDependencies) {
      hasChanged = dependencies.some((dep, index) => !Object.is(dep, oldDependencies[index]));
    }

    if (hasChanged) {
      memoValue = callback();
      states[key] = [dependencies, memoValue];
    }

    componentState.currentStateKey += 1;
    return memoValue;
  }

  function render(rootComponent: any, root: Element | null) {
    options.root = root;
    options.rootComponent = rootComponent;
    _render();
  }

  return { useState, useEffect, useCallback, useMemo, render };
}

// state를 외부에서 관리하지 않아 계속 초기화 문제 발생
// function useCallback<T extends (...arg: any[]) => any>(fn: T, dependencies: any[]) {
//   let cachedFn: T | null = null;
//   let cachedDependencies: any[] | null = null;

//   const hasChanged =
//     cachedDependencies === null ||
//     dependencies.length !== cachedDependencies.length ||
//     dependencies.some((dependency, index) => !Object.is(dependency, cachedDependencies[index]));

//   if (hasChanged) {
//     cachedFn = fn;
//     cachedDependencies = dependencies;
//   }

//   return cachedFn || fn;
// }
