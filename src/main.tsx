// Ensure React Native/Expo globals exist in web environment
if (typeof (globalThis as any).__DEV__ === 'undefined') {
  (globalThis as any).__DEV__ = true;
}
if (typeof window !== 'undefined' && typeof (window as any).__DEV__ === 'undefined') {
  (window as any).__DEV__ = true;
}

class WebEventEmitter {
  listeners: Map<string, Set<Function>> = new Map();
  addListener(event: string, fn: Function) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(fn);
    return {
      remove: () => {
        this.listeners.get(event)?.delete(fn);
      }
    };
  }
  on(event: string, fn: Function) {
    return this.addListener(event, fn);
  }
  removeListener(event: string, fn: Function) {
    this.listeners.get(event)?.delete(fn);
  }
  removeAllListeners(event?: string) {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
  }
  emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach(fn => {
      try { fn(...args); } catch {}
    });
  }
}

if (typeof (globalThis as any).EventEmitter === 'undefined') {
  (globalThis as any).EventEmitter = WebEventEmitter;
}
if (typeof window !== 'undefined' && typeof (window as any).EventEmitter === 'undefined') {
  (window as any).EventEmitter = WebEventEmitter;
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
