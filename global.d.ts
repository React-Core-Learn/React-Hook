declare global {
  interface Window {
    increment: () => void;
    decrement: () => void;
  }
}

export {};
