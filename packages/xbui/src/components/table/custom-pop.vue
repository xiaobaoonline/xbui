<template>
  <a-Modal
    v-model="value"
    :closable="false"
    :mask-closable="false"
    class-name="vertical-center-modal"
    width="680"
    :class="[prefixCls+'-custom-pop']"
  >
    <p slot="header" style="text-align:center">自定义选项</p>
    <div>
      <p :class="[prefixCls+'-custom-subtitle']">
        <a-checkbox
          v-model="selectalltag"
          label="全选"
          :class="[prefixCls+'-custom-select-all']"
          @change="selectAll()"
        >全选</a-checkbox>
      </p>
      <div :class="[prefixCls+'-custom-subcontent']">
        <a-checkbox-group v-model="showculumns">
          <a-checkbox
            v-for="(column,index) in data"
            :key="index"
            :label="column.key"
            :class="[prefixCls+'-custom-columns']"
          >{{column.title}}</a-checkbox>
        </a-checkbox-group>
      </div>
    </div>
    <div slot="footer">
      <a-button type="default" @click="cancel">取消</a-button>
      <a-button type="primary" @click="ok">确定</a-button>
    </div>
  </a-Modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'CustomPop',
})
export default class CustomPop extends Vue {
  @Prop({
    type: Boolean,
    default: false,
  })
  value!: boolean;
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  data!: any[];

  prefixCls: string = 'xbui-table';
  culumns: boolean = false;
  selectalltag: boolean = false;
  showculumns: any = this.getshowcol();

  @Watch('data', { deep: true })
  dataWatch() {
    this.showculumns = this.getshowcol();
  }
  @Watch('value')
  valueChange(val: any) {
    if (val) {
      this.showculumns = this.getshowcol();
    }
  }
  @Watch('showculumns', { deep: true })
  showculumnsWatch() {
    this.selectalltag = this.showculumns.length === this.data.length;
  }

  ok() {
    // this.modal1 = false;
    //把不显示的扔出去？？
    let hidecol: any[] = [],
      colobj: any = {};
    this.data.forEach(col => {
      if (this.showculumns.indexOf(col.key) == -1) {
        hidecol.push(col.key);
        colobj[col.key] = false;
      } else {
        colobj[col.key] = true;
      }
    });
    this.$emit('showcol', hidecol, colobj);
    this.$emit('input', false);
  }
  selectAll() {
    if (this.selectalltag) {
      this.showculumns = this.data.map(col => {
        return col.key;
      });
    } else {
      this.showculumns = [];
    }
  }
  cancel() {
    this.$emit('input', false);
  }
  getshowcol() {
    let arr: any[] = [];
    this.data.forEach(col => {
      if (col.show) {
        arr.push(col.key);
      }
    });
    return arr;
  }
}
</script>