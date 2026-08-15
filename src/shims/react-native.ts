if (typeof (globalThis as any).__DEV__ === 'undefined') {
  (globalThis as any).__DEV__ = true;
}

import * as RNW from 'react-native-web';

export class NativeEventEmitter {
  private _module: any;
  constructor(nativeModule?: any) {
    this._module = nativeModule;
  }
  addListener(_eventType: string, _listener?: (...args: any[]) => any, _context?: any) {
    return { remove: () => {} };
  }
  removeListener() {}
  removeAllListeners() {}
  emit() {}
  listenerCount() { return 0; }
}

export class EventEmitter {
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

export const DeviceEventEmitter = new EventEmitter();

export const TurboModuleRegistry = {
  get: (name: string) => createSafeProxy(name),
  getEnforcing: (name: string) => createSafeProxy(name),
};

function createSafeProxy(name = 'NativeModule') {
  const handler: ProxyHandler<any> = {
    get: (target, prop) => {
      if (prop === 'EventEmitter' || prop === 'addListener' || prop === 'removeListeners') {
        return () => ({ remove: () => {} });
      }
      if (prop in target) return target[prop];
      return () => Promise.resolve(null);
    }
  };
  return new Proxy({ name }, handler);
}

const nativeModulesTarget: Record<string, any> = (RNW as any).NativeModules || {};
export const NativeModules = new Proxy(nativeModulesTarget, {
  get: (target, prop) => {
    if (typeof prop === 'string' && !(prop in target)) {
      target[prop] = createSafeProxy(prop);
    }
    return target[prop as string];
  }
});

export const NativeModulesProxy = NativeModules;
export const requireNativeComponent = () => () => null;

export * from 'react-native-web';
export default {
  ...RNW,
  NativeEventEmitter,
  EventEmitter,
  DeviceEventEmitter,
  TurboModuleRegistry,
  NativeModules,
  NativeModulesProxy,
  requireNativeComponent,
};


