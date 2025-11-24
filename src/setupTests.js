import '@testing-library/jest-dom/vitest';

// Simple stubs for browser APIs que usa Bootstrap o componentes
window.matchMedia =
  window.matchMedia ||
  function matchMedia() {
    return {
      matches: false,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    };
  };
