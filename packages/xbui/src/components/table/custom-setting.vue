<template>
  <div :class="[prefixCls+'-custom-subcontent']">
    <transition :name="transitionName">
      <div
        class="ant-select-dropdown"
        x-placement="bottom"
        style="position: absolute;padding:10px;max-height: none;right:0"
      >
        <ul :class="'ant-select-dropdown-list'">
          <li class="ant-select-item">
            <a-Checkbox
              v-model="selectalltag"
              label="全选"
              :class="[prefixCls+'-custom-select-all']"
              @change="selectAll()"
            >全选</a-Checkbox>
          </li>
          <li v-for="(column,index) in data" :key="index" class="ant-select-item">
            <a-Checkbox-group v-model="showculumns">
              <a-Checkbox
                :label="column.key"
                :class="[prefixCls+'-custom-columns']"
              >{{column.title}}</a-Checkbox>
            </a-Checkbox-group>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'CustomSetting',
})
export default class CustomSetting extends Vue {
  @Prop({
    type: Array,
    default() {
      return [];
    },
  })
  data!: any[];

  prefixCls: string = 'xbui-table';
  selectalltag: boolean = false;
  showculumns: any = this.getshowcol();

  get transitionName() {
    return 'slide-up';
  }
  @Watch('data', { deep: true })
  WatchData() {
    this.showculumns = this.getshowcol();
  }
  @Watch('showculumns', { deep: true })
  showculumnsWatch() {
    this.selectalltag = this.showculumns.length === this.data.length;
    this.ok();
  }

  ok() {
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
    this.$nextTick(() => {
      this.selectalltag = arr.length === this.data.length;
    });
    return arr;
  }
}
</script>