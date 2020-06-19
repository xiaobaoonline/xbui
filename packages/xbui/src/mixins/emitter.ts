import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'Emitter',
})
export default class Emitter extends Vue {
  dispatch(componentName: any, eventName: string, params: any) {
    let parent = this.$parent || this.$root;
    let name = parent.$options.name;

    while (parent && (!name || name !== componentName)) {
      parent = parent.$parent;

      if (parent) {
        name = parent.$options.name;
      }
    }
    if (parent) {
      let param: any = [eventName].concat(params);
      parent.$emit.apply(parent, param);
    }
  }
  broadcast(componentName: any, eventName: any, params: any) {
    broadcast.call(this, componentName, eventName, params);
  }
}
function broadcast(componentName: string, eventName: string, params: any) {
  this.$children.forEach(child => {
    const name: string | undefined = child.$options.name;

    if (name === componentName) {
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      // todo 如果 params 是空数组，接收到的会是 undefined
      let args: any = [componentName, eventName].concat([params]);
      broadcast.apply(child, args);
    }
  });
}
