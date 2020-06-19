import Vue from 'vue'
export const wrap = (method: string) => {
  const original = Vue.prototype[method]
  if (original) {
    Vue.prototype[method] = (...args) => {
      const res = original.apply(this, args)
      // eslint-disable-next-line no-console
      // console.table({
      //   eventName: args[0],
      //   type: method,
      //   payload: args.slice(1),
      //   instanceId: this._uid,
      //   instanceName: this._self.$options.name,
      // })
      return res
    }
  }
}
