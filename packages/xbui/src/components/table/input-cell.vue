<template>
  <div>
    <div v-show="!edittag" :class="[prefixCls+'-row-canedit']">
      <span v-if="!column.render">{{row[column.key]}}</span>
      <Cell v-else :row="row" :column="column" :index="index" :render="column.render"></Cell>
      <a-Icon type="highlight" style="visibility: hidden;" @click="handleinput"></a-Icon>
    </div>
    <div v-show="edittag" :class="[prefixCls+'-row-canedit']">
      <a-input ref="input" v-model="editvalue" @blur="handleblur()"></a-input>
    </div>
  </div>
</template>

<script lang="ts">
import Cell from './expand';

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'InputCell',
  components: { Cell },
})
export default class InputCell extends Vue {
  $refs!: {
    input: any;
  };
  @Prop({ type: Object })
  row!: any;
  @Prop({ type: Function })
  render!: () => any;
  @Prop({ type: Number })
  index!: Number;
  @Prop({ type: Object, default: null })
  column!: any;

  prefixCls: string = 'xbui-table';

  edittag: boolean = false;
  editvalue: any = this.geteidtvalue();

  handleinput() {
    this.editvalue = this.geteidtvalue();
    this.edittag = true;
    //input元素所在Dom被edittag控制显示/隐藏。如果直接调用focus，该Dom并未立即显示导致聚焦失败。此处延迟调用。
    this.$nextTick(() => {
      this.$refs.input.focus();
    });
  }
  handleblur() {
    //是否允许批量编辑 允许则跳过
    this.$refs.input.blur();
    this.edittag = false;
    if (this.column.validate) {
      if (!this.column.validate(this.row, this.editvalue)) {
        // this.handleinput();
        return;
      }
    }
    //离焦后是否立刻保存？
    if (this.column.callback) {
      this.column.callback(this.row, this.editvalue);
    }
  }
  geteidtvalue() {
    return this.row[this.column.key];
  }
}
</script>

<style>
</style>
