<template>
  <div v-show="countSelected" class="xbf-clear">
    <div class="xbf-fr xbf-linttext" :style="showmoretag?'':'text-align:right;'">
      <span type="text" @click="clearFilter">清空筛选</span>
    </div>
    <div class="xbf-selectedbox">
      <template v-for="val of innerbasedata">
        <div
          v-if="val.selectedArr.length || val.datevalue || (val.dateval.length && val.dateval[0])"
          :key="val.key"
          class="xbf-selecteditem"
        >
          <span class="xbf-disabletext">{{ val.label }}：</span>
          <template v-if="val.type == 'select'">
            <a-tag
              v-for="(item, index) in val.selectedArr"
              :key="index"
              :closable="!(val.required && val.selectedArr.length == 1)"
              @close.prevent="handleRemove(val, item)"
            >{{ item[val.labelKey || 'label'] || item }}</a-tag>
          </template>
          <template v-else-if="val.type == 'numberrange'">
            <a-tag :closable="!val.required" @close.prevent="handleDelte(val)">
              {{ val.selectedArr[0] }} ~ {{ val.selectedArr[1] }}
              {{ val.unit }}
            </a-tag>
          </template>
          <template v-else-if="val.type == 'selectrange'">
            <a-tag
              :closable="!val.required"
              @close.prevent="handleDelte(val)"
            >{{ val.selectedObj.start }} ~ {{ val.selectedObj.end }}</a-tag>
          </template>
          <template v-else-if="(val.type == 'date' || val.type == 'datetime') && val.datevalue">
            <a-tag
              v-show="val.datevalue"
              :closable="!val.required"
              @close.prevent="handleDelte(val)"
            >{{ val.datevalue }}</a-tag>
          </template>
          <template
            v-else-if="(val.type == 'daterange' || val.type == 'daterangetime') && val.dateval.length && val.dateval[0]"
          >
            <a-tag
              :closable="!val.required"
              @close.prevent="handleDelte(val)"
            >{{ val.dateval[0] }} ~ {{ val.dateval[1] }}</a-tag>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue, Component } from 'vue-property-decorator';
@Component({ name: 'SelectedData' })
export default class SelectedData extends Vue {
  $parent: any;
  @Prop({
    default: () => {
      return {};
    },
    type: Object,
  })
  basedata!: any;

  @Prop({
    default: 0,
    type: Number,
  })
  selectedLen!: number;

  @Prop({ type: Boolean, default: false })
  showmoretag!: boolean;

  filters: any = {};

  get innerbasedata() {
    return this.basedata;
  }

  get countSelected() {
    let count = 0;
    if (!this.basedata) {
      return 0;
    }
    let keys = Object.keys(this.basedata);
    for (let i = 0; i < keys.length; i++) {
      let item = this.basedata[keys[i]];
      if (item.type === 'select' || item.type === 'selectrange' || item.type === 'numberrange') {
        if (item.selectedArr.length) {
          count++;
        }
      } else if (item.type === 'date' || item.type === 'datetime') {
        if (item.datevalue) {
          count++;
        }
      } else if (item.type === 'daterange' || item.type === 'daterangetime') {
        if (item.dateval.length) {
          count++;
        }
      }
    }
    return count;
  }
  handleRemove(val: any, item: any) {
    // this.$emit('handleThis', val, item);
    this.$parent.handleThis(val, item);
  }
  handleDelte(val: any) {
    // this.$emit('handleClearData', val);
    this.$parent.handleClearData(val);
  }
  clearFilter() {
    // this.$emit('clearFilter');
    this.$parent.clearFilter();
  }
}
</script>

<style lang="less"></style>
