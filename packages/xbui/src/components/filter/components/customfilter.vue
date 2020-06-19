<template>
  <div v-clickoutside="handleHide" class="customfilter">
    <slot />
    <div v-if="value" :class="['custommodal', direcClass]">
      <div class="custumbox">
        <div v-if="subdata.length.length" class="header">我们建议：</div>
        <div class="content-filter">
          <div v-for="(item, index) in topdata" :key="index" class="item">
            <a-Checkbox v-model="item.display" @change="onChange(item)">{{ item.label }}</a-Checkbox>
          </div>
        </div>
      </div>
      <div v-if="subdata.length" class="custumbox">
        <div v-if="topdata.length.length" class="header">用户自定义：</div>
        <div class="content-filter">
          <div v-for="(item, index) in subdata" :key="index" class="item">
            <a-Checkbox v-model="item.display" @change="onChange(item)">{{ item.label }}</a-Checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import clickoutside from './../../../directives/clickoutside';
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  directives: { clickoutside },
  name: 'Customfilter',
})
export default class Customfilter extends Vue {
  @Prop({
    default() {
      return [];
    },
  })
  topdata!: [];

  @Prop({
    default() {
      return [];
    },
  })
  subdata!: [];

  @Prop({
    default: false,
  })
  value!: boolean;
  get direcClass() {
    if (this.topdata.length + this.subdata.length > 10) {
      return 'horizontalmodal';
    } else {
      return 'verticalmodal';
    }
  }
  handleHide() {
    this.$emit('input', false);
  }
  onChange(val: any) {
    console.log(val);
    this.$emit('onchange', val);
  }
}
</script>

<style scoped lang="less">
@import './../style/index.less';

.customfilter {
  float: right;
  position: relative;
}

.horizontalmodal {
  width: 450px;
}
.custommodal {
  position: absolute;
  right: 0;
  max-width: 450px;
  z-index: 100;
  padding: 10px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 5px 0px rgba(53, 83, 158, 0.3);
  border-radius: 4px;
  .custumbox:first-child {
    padding-bottom: 10px;
    border-bottom: 1px solid @border-color-split;
  }
  .custumbox:last-child {
    border: none;
  }
  .header {
    color: @primary-color;
    font-size: 12px;
  }
  .content-filter {
    width: 100%;
    padding-top: 10px;
    .item {
      width: 200px;
      display: inline-block;
      margin-bottom: 10px;
      font-size: 14px;
      .ant-checkbox-wrapper {
        margin-left: 0;
      }
    }
    .item:last-child {
      margin-bottom: 0;
    }
  }
  .custumbox {
    height: 50%;
    margin-bottom: 10px;
  }
  .custumbox:last-child {
    margin-bottom: 0;
  }
}
</style>
