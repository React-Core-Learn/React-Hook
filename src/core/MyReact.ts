import debounceFrame from '../utils/debounceFrame';

interface Options {
  currentStateKey: number;
  renderCount: number;
  states: any[];
  root: Element | null;
  rootComponent: any;
}

export default function MyReact() {
  const options: Options = {
    currentStateKey: 0,
    renderCount: 0,
    states: [],
    root: null,
    rootComponent: null,
  };

  function useState(initState: any) {
    const { currentStateKey: key, states } = options;
    if (states.length === key) states.push(initState);

    const state = states[key];
    const setState = (newState: any) => {
      states[key] = newState;
      _render();
    };
    options.currentStateKey += 1;
    return [state, setState];
  }

  const _render = debounceFrame(() => {
    const { root, rootComponent } = options;
    if (!root || !rootComponent) return;
    root.innerHTML = rootComponent();
    options.currentStateKey = 0;
    options.renderCount += 1;
  });

  function useEffect(callback: () => void, dependencies: any[]) {
    const { currentStateKey: key, states } = options;
    const oldDependencies = states[key];

    let hasChanged = true;
    if (oldDependencies) {
      hasChanged = dependencies.some((dependency, index) => !Object.is(dependency, oldDependencies[index]));
    }
    if (hasChanged) {
      callback();
      states[key] = dependencies;
    }

    options.currentStateKey += 1;
  }

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

  function useCallback<T extends (...arg: any[]) => any>(fn: T, dependencies: any[]) {
    const { currentStateKey: key, states } = options;
    const oldDependencies = states[key]?.dependencies;

    let hasChanged = true;
    if (oldDependencies) {
      hasChanged =
        dependencies.length !== oldDependencies.length ||
        dependencies.some((dep, index) => !Object.is(dep, oldDependencies[index]));
    }

    if (hasChanged) {
      states[key] = { fn, dependencies };
    }

    options.currentStateKey += 1;
    return states[key].fn;
  }

  function render(rootComponent: any, root: Element | null) {
    options.root = root;
    options.rootComponent = rootComponent;
    _render();
  }

  return { useState, useEffect, useCallback, render };
}
