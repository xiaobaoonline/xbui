<template>
  <label :class="wrapClasses">
    <span :class="checkboxClasses">
      <span :class="innerClasses"></span>
      <input :class="inputClasses" :disabled="disabled" />
    </span>
  </label>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'uiCheck',
})
export default class uiCheck extends Vue {
  @Prop({
    type: String,
    default: 'checkbox',
  })
  type!: string;

  @Prop({
    type: Boolean,
    default: false,
  })
  disabled!: boolean;
  @Prop({
    type: Boolean,
    default: false,
  })
  value!: boolean;

  get prefixCls() {
    return 'ant-' + this.type;
  }

  get wrapClasses() {
    return [
      `${this.prefixCls}-wrapper`,
      {
        [`${this.prefixCls}-wrapper-checked`]: this.value,
        [`${this.prefixCls}-wrapper-disabled`]: this.disabled,
      },
    ];
  }
  get checkboxClasses() {
    return [
      `${this.prefixCls}`,
      {
        [`${this.prefixCls}-checked`]: this.value,
        [`${this.prefixCls}-disabled`]: this.disabled,
      },
    ];
  }
  get innerClasses() {
    return `${this.prefixCls}-inner`;
  }
  get inputClasses() {
    return `${this.prefixCls}-input`;
  }
}
</script>
