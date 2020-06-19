<template>
  <div class="xb-button-box">
    <button class="normal-btn">{{ msg }}</button>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
export default class PropEdit extends Vue {
  msg: string = '232323'
}
</script>
<style lang="less">
@import './style/main.less';
.normal-btn {
  width: 120px;
  height: 30px;
  border: 1px #aaa solid;
  outline: none;
  border-radius: 3px;
}
.normal-btn:active {
  background: #eee;
}
.normal-btn:hover {
  cursor: pointer;
  border-color: #888;
}
</style>
