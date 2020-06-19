<template>
  <div :class="[prefixCls+'-control-body']">
    <template v-if="controldata.tileButtons.length">
      <div
        v-for="(btn,bindex) in controldata.tileButtons"
        :key="bindex"
        :class="[prefixCls+'-control-btn']"
        type="text"
        @click="handleControlClick(btn)"
      >
        <a-button v-if="!btn.render" :disabled="btn.disabled" type="link">{{btn.title}}</a-button>
        <Cell v-else :row="row" :column="column" :index="index" :render="btn.render"></Cell>
      </div>
    </template>
    <template v-if="controldata.dropButtons.length">
      <a-dropdown
        placement="bottomLeft"
        :get-popup-container="getPopupContainer"
        @visibleChange="dropVisibleChange"
      >
        <a-button :class="[prefixCls+'-control-btn']" type="link">
          操作
          <!--:type="showdrop?'up':'down'" -->
          <a-icon
            style="font-size:14px;"
            type="caret-down"
            :class="{'xbui-ani-down':true,'xbui-ani-up':showdrop}"
          ></a-icon>
        </a-button>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="(btn,bindex) in controldata.dropButtons"
            :key="bindex"
            :name="bindex"
            style="min-width:100px;text-align:center;"
            :disabled="btn.disabled"
            @click="getDropData(bindex)"
          >
            <span v-if="!btn.render">{{btn.title}}</span>
            <Cell v-else :row="row" :column="column" :index="index" :render="btn.render"></Cell>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </template>
  </div>
</template>

<script lang="ts">
import Cell from './expand';

import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'ControlCell',
  components: { Cell },
})
export default class ControlCell extends Vue {
  @Prop({ type: Object })
  row!: Object;
  @Prop({ type: Function })
  render!: () => any;
  @Prop({ type: Number })
  index!: Number;
  @Prop({ type: Object, default: null })
  column!: object;

  prefixCls: string = 'xbui-table';
  // controldata: ,
  showdrop: boolean = false;

  get controldata() {
    return this.initcontrol(this.column, this.row, this.index);
  }

  initcontrol(column: any, row: any, index: any) {
    let tileButtons: any[] = [];
    let dropButtons: any[] = [];
    column.handleArr.forEach((btn: any) => {
      if (btn.ifshow && btn.ifshow(row, index)) {
        if ('isDrop' in btn && !btn.isDrop) {
          tileButtons.push({
            title: btn.title,
            disabled: btn.disabled && btn.disabled(row, index),
            render: btn.render ? btn.render : '',
            func: btn.func,
          });
        } else {
          dropButtons.push({
            title: btn.title,
            disabled: btn.disabled && btn.disabled(row, index),
            render: btn.render ? btn.render : '',
            func: btn.func,
          });
        }
      }
    });
    return {
      tileButtons: tileButtons,
      dropButtons: dropButtons,
    };
  }
  getPopupContainer(trigger: any) {
    return trigger.parentNode;
  }
  dropVisibleChange(visible: boolean) {
    this.showdrop = visible;
  }
  getDropData(index: number) {
    this.showdrop = false;
    this.handleControlClick(this.controldata.dropButtons[index]);
  }
  handleControlClick(btn: any) {
    if (!btn.disabled && btn.func) {
      btn.func(this.row, this.index);
    }
  }
}
</script>

<style>
</style>
