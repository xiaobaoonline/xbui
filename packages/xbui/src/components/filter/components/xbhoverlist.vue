<template>
  <div
    v-clickoutside="Hide"
    :class="['xbf-hoverpoper-wraper', customClass]"
    @mouseenter="handleMouseenter"
    @mouseleave="handleMouseleave"
  >
    <div
      ref="hover"
      @click="handleClick"
      @mousedown="handleFocus(false)"
      @mouseup="handleBlur(false)"
    >
      <slot name="hover" />
    </div>
    <div v-if="visible && !disabled" class="xbf-poper-wraper" :style="customStyle">
      <div class="xbf-poper" @click.stop="handleBubble">
        <slot name="poper" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { oneOf } from './../../../utils/utils';
import clickoutside from './../../../directives/clickoutside';
import { Component, Vue, Prop, Inject, Watch } from 'vue-property-decorator';
// import eventEmitter from '../../utils/eventEmitter';

const hasProp = (instance: any, prop: any) => {
  const $options = instance.$options || {};
  const propsData = $options.propsData || {};
  return prop in propsData;
};
@Component({
  directives: { clickoutside },
  name: 'Xbhoverlist',
})
export default class Xbhoverlist extends Vue {
  @Inject({ default: false }) track!: boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  value!: boolean;

  @Prop({
    default() {
      return {};
    },
    type: Object,
  })
  itemObj!: any;

  @Prop({
    default: false,
    type: Boolean,
  })
  show!: boolean;

  @Prop({
    default: false,
    type: Boolean,
  })
  disabled!: boolean;

  /** 点击后是否直接隐藏 */
  @Prop({
    default: false,
    type: Boolean,
  })
  autohide!: boolean;

  @Prop({
    default: 0,
    type: Number,
  })
  duration!: number;

  @Prop({
    default: 300,
    type: Number,
  })
  mousemovehide!: number;

  /** 偏移距离 */
  @Prop({
    default: 20,
    type: Number,
  })
  top!: number;

  /** 偏移方向 */
  @Prop({
    default: 'top',
    type: String,
    validator(value: any) {
      return oneOf(value, ['top', 'bottom', 'leftbot']);
    },
  })
  placement!: string;

  /** 触发方式 */
  @Prop({
    default: 'hover',
    type: String,
    validator(value: any) {
      return oneOf(value, ['hover', 'click', 'focus']);
    },
  })
  trigger!: string;

  /** 自定义样式 */
  @Prop({})
  customClass!: string;

  $parent: any;
  hoverHeight: number = 0;
  visible: boolean = true;
  customStyle: any = {};
  int: any = 0;
  startTime: number = 0;
  minWidth: any;
  $refs!: {
    hover: any;
  };

  @Watch('show')
  showChang(val: any) {
    this.visible = val;
  }
  @Watch('value')
  valueChang(val: any) {
    this.visible = val;
  }
  /** 用于计算某一选项的筛选时间
      从展开面板到收起面板（且中间必须触发过筛选项数据变化）的时间
  */
  @Watch('visible')
  visibleChang(val: any) {
    if (val) {
      this.startTime = new Date().getTime();
    } else {
      if (this.startTime && this.itemObj.key && this.track) {
        // let duration = (new Date().getTime() - this.startTime) / 1000;
        // eventEmitter.emit('getSelectDuration', {
        //     key: this.itemObj.key,
        //     label: this.itemObj.label,
        //     duration
        // });
      }
      this.startTime = 0;
      this.$parent.itemObj = {};
    }
  }
  mounted() {
    this.hoverHeight = this.$refs.hover.offsetHeight;
    this.minWidth = this.$refs.hover.offsetWidth;
    if (this.placement == 'top') {
      this.customStyle = {
        bottom: this.hoverHeight + 'px',
        'padding-bottom': this.top + 'px',
        'min-width': this.minWidth + 'px',
      };
    } else if (this.placement == 'leftbot') {
      this.customStyle = {
        left: 0,
        transform: 'translateX(0)',
        'padding-top': this.top + 'px',
        'min-width': this.minWidth + 'px',
      };
    } else {
      this.customStyle = {
        'padding-top': this.top + 'px',
        'min-width': this.minWidth + 'px',
      };
    }
    this.visible = this.show;
    if (this.show && this.duration) {
      setTimeout(() => {
        this.visible = !this.show;
      }, this.duration * 1000);
    }
  }
  handleBubble() {
    if (this.autohide) {
      this.visible = false;
    }
  }
  handleMouseenter() {
    if (this.trigger !== 'hover') {
      return;
    }
    clearTimeout(this.int);
    this.visible = true;
  }
  handleMouseleave() {
    if (this.trigger !== 'hover') {
      return;
    }
    this.int = setTimeout(() => {
      this.visible = false;
    }, this.mousemovehide);
  }
  Hide() {
    this.$emit('input', false);
    this.visible = false;
  }
  handleClick() {
    if (this.trigger !== 'click') {
      return;
    }
    if (!hasProp(this, 'show')) {
      this.visible = !this.visible;
    }
  }
  handleFocus() {
    if (this.trigger !== 'focus') {
      return;
    }
    this.visible = true;
  }
  handleBlur() {
    if (this.trigger !== 'focus') {
      return;
    }
    this.visible = false;
  }
}
</script>

<style></style>
