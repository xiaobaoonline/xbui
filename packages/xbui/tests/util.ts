import Vue from 'vue';

export function asyncExpect(fn: any, timeout: any) {
  return new Promise(resolve => {
    if (typeof timeout === 'number') {
      setTimeout(() => {
        fn();
        resolve();
      }, timeout);
    } else {
      Vue.nextTick(() => {
        fn();
        resolve();
      });
    }
  });
}
