import { Debugger } from '../debug';

const SessionStoreDebugger = Debugger.extend('session-store');

export function debug(...args: any) {
  SessionStoreDebugger.log = console.debug.bind(console);
  SessionStoreDebugger.apply(SessionStoreDebugger, args);
}

export function log(...args: any) {
  SessionStoreDebugger.log = console.log.bind(console);
  SessionStoreDebugger.apply(SessionStoreDebugger, args);
}

export function warn(...args: any) {
  SessionStoreDebugger.log = console.warn.bind(console);
  SessionStoreDebugger.apply(SessionStoreDebugger, args);
}

export function error(...args: any) {
  SessionStoreDebugger.log = console.error.bind(console);
  SessionStoreDebugger.apply(SessionStoreDebugger, args);
}
