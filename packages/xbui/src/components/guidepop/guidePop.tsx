const prefixCls = 'xbui-guide-pop';
import './style/index.less';
export default {
  name: 'XbGuidePop',
  props: {
    isActivited: {
      type: Boolean,
      default: false,
    },
    showMask: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      prefixCls: prefixCls,
    };
  },
  render() {
    return this.isActivited ? (
      <div>
        <div class={this.prefixCls + '-activited'}>
          {this.$slots.default}
          {this.$slots.tip}
        </div>
        {this.showMask ? <div class={this.prefixCls + '-mask'} /> : ''}
        <div class={this.prefixCls + '-trigger-mask'} on-click={e => this.closeMask(e)} />
      </div>
    ) : (
      <div>{this.$slots.default}</div>
    );
  },
  created() {
    if (this.isActivited) {
      document.body.style.overflow = 'hidden';
    }
  },
  watch: {
    isActivited(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
  },
  methods: {
    closeMask(e) {
      e.stopPropagation();
      this.$emit('close-mask');
    },
  },
};
