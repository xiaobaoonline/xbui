import { oneOf } from '@/utils/utils';
import Emitter from '../../mixins/emitter';
import './style/index.less';

const prefixCls = 'xbui-input-number';
const iconPrefixCls = 'anticon';

function addNum(num1: number, num2: number) {
  let sq1, sq2, m;
  try {
    sq1 = num1.toString().split('.')[1].length;
  } catch (e) {
    sq1 = 0;
  }
  try {
    sq2 = num2.toString().split('.')[1].length;
  } catch (e) {
    sq2 = 0;
  }

  m = Math.pow(10, Math.max(sq1, sq2));
  return (Math.round(num1 * m) + Math.round(num2 * m)) / m;
}

export default {
  name: 'XbInputNumber',
  mixins: [Emitter],
  props: {
    max: {
      type: Number,
      default: Infinity,
    },
    min: {
      type: Number,
      default: -Infinity,
    },
    step: {
      type: Number,
      default: 1,
    },
    align: {
      type: String,
      validator(value: string) {
        return oneOf(value, ['left', 'center', 'right']);
      },
    },
    value: [Number, String],
    size: {
      validator(value: string) {
        return oneOf(value, ['small', 'large']);
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autofocus: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
    },
    defaultnumber: [Number, String],
    required: {
      //是否可为空
      type: Boolean,
      default: true,
    },
    hidestep: {
      //隐藏step
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
    },
    fixed: {
      //小数位数
      type: Number,
      default: 0,
    },
    pointInfo: Object,
  },
  data() {
    return {
      focused: false,
      upDisabled: false,
      downDisabled: false,
      iferror: false,
      errcontent: '',
      currentValue: this.value,
    };
  },
  computed: {
    precisionValue() {
      // can not display 1.0
      if (this.value === '' || this.value === null || isNaN(this.value)) {
        return '';
      }
      return this.fixed ? this.fiexdNumber(this.value) : this.value;
    },
    alignStyle() {
      return {
        textAlign: this.align ? this.align : this.hidestep ? 'right' : 'left',
        paddingRight: this.align == 'right' && !this.hidestep ? '25px' : '',
      };
    },
    wrapClasses() {
      return [
        `${prefixCls}`,
        {
          [`${prefixCls}-${this.size}`]: !!this.size,
          [`${prefixCls}-disabled`]: this.disabled,
          [`${prefixCls}-focused`]: this.focused,
        },
      ];
    },
    handlerClasses() {
      return `${prefixCls}-handler-wrap`;
    },
    upClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-up`,
        {
          [`${prefixCls}-handler-up-disabled`]: this.upDisabled,
        },
      ];
    },
    innerUpClasses() {
      return `${prefixCls}-handler-up-inner ${iconPrefixCls} ${iconPrefixCls}-chevron-up`;
    },
    downClasses() {
      return [
        `${prefixCls}-handler`,
        `${prefixCls}-handler-down`,
        {
          [`${prefixCls}-handler-down-disabled`]: this.downDisabled,
        },
      ];
    },
    innerDownClasses() {
      return `${prefixCls}-handler-down-inner ${iconPrefixCls} ${iconPrefixCls}-chevron-down`;
    },
    inputWrapClasses() {
      return `${prefixCls}-input-wrap`;
    },
    inputClasses() {
      return `${prefixCls}-input`;
    },
  },
  watch: {
    // value(val) {
    //   if (isNaN(Number(val))) {
    //     this.currentValue = '';
    //   } else {
    //     this.currentValue = val;
    //   }
    // },
    precisionValue(val) {
      this.changeVal(val);
    },
    min() {
      this.changeVal(this.precisionValue);
    },
    max() {
      this.changeVal(this.precisionValue);
    },
  },
  mounted() {
    this.changeVal(this.precisionValue);
  },
  methods: {
    preventDefault(e: any) {
      e.preventDefault();
    },
    up(e: any) {
      const targetVal = Number(e.target.value);
      if (this.upDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep('up', e);
    },
    down(e: any) {
      const targetVal = Number(e.target.value);
      if (this.downDisabled && isNaN(targetVal)) {
        return false;
      }
      this.changeStep('down', e);
    },
    changeStep(type: any, e: any) {
      if (this.disabled) {
        return false;
      }

      const targetVal = Number(e.target.value);
      let val = Number(this.precisionValue);
      const step = Number(this.step);
      if (isNaN(val)) {
        return false;
      }

      // input a number, and key up or down
      if (!isNaN(targetVal)) {
        if (type === 'up') {
          if (addNum(targetVal, step) <= this.max) {
            val = targetVal;
          } else {
            return false;
          }
        } else if (type === 'down') {
          if (addNum(targetVal, -step) >= this.min) {
            val = targetVal;
          } else {
            return false;
          }
        }
      }

      if (type === 'up') {
        val = addNum(val, step);
      } else if (type === 'down') {
        val = addNum(val, -step);
      }
      this.setValue(val);
    },
    setValue(val: any) {
      if (!isNaN(this.fixed) && val) {
        val = this.fiexdNumber(val);
      }
      this.$emit('input', val);
      this.$nextTick(() => {
        // this.currentValue = val;
        this.$emit('on-change', val);
        // this.dispatch('FormItem', 'on-form-change', val);
      });
    },
    focus() {
      this.focused = true;
      this.$emit('on-focus');
      // if(this.currentValue!==''&&Number(this.currentValue)!==0){
      //     this.currentValue = '';
      // }
    },
    blur(event: any) {
      this.focused = false;
      this.$emit('on-blur');
      this.checkRange(event);
    },
    checkRange(event: any) {
      //离焦之后的大小值校验
      let val = event.target.value.trim();
      if (val !== '') {
        val = Number(val);
      } else {
        val = this.required ? (this.defaultnumber ? this.defaultnumber : 0) : val;
        if (this.required) {
          this.setError('empty');
        }
        this.setValue(val);
        return;
      }
      const max = this.max;
      const min = this.min;
      if (Number(val) > max) {
        this.setValue(max);
        this.setError('max');
      } else if (Number(val) < min) {
        //离焦时 不用处理特殊分支
        this.setValue(min);
        this.setError('min');
      } else {
        this.setValue(val);
      }
    },
    keyDown(e: any) {
      if (e.keyCode === 38) {
        e.preventDefault();
        this.up(e);
      } else if (e.keyCode === 40) {
        e.preventDefault();
        this.down(e);
      }
    },
    fiexdNumber(val: any) {
      if (isNaN(val)) {
        return '';
      }
      //小数点补足原则  整数或小数未超过指定小数位数长度 不管，超过后截取指定小数位数
      let strarr = (val + '').split('.');
      if (strarr.length == 2 && strarr[1].length > this.fixed) {
        this.setError('fixed');
      }
      if (strarr.length == 2 && this.fixed) {
        return (strarr[0] || 0) + '.' + (strarr[1] || '0').substring(0, this.fixed);
      } else {
        return Number(strarr[0]);
      }
    },
    setError(type: any) {
      let tip = '';
      switch (type) {
        case 'max':
          tip = '最大值为' + this.max;
          break;
        case 'min':
          tip = '最小值为' + this.min;
          break;
        case 'fixed':
          tip = this.fixed === 0 ? '只能输入整数' : '只保留' + this.fixed + '位小数';
          break;
        case 'nan':
          tip = '只能输入合法数值';
          break;
        case 'empty':
          tip = '不可为空';
          break;
        default:
          break;
      }
      this.iferror = true;
      this.errcontent = tip;

      let timer = setTimeout(() => {
        this.iferror = false;
        clearTimeout(timer);
      }, 1000);
    },
    change(event: any) {
      let val = event.target.value.trim();
      if (event.type == 'input' && val.match(/^\-?\.?$|\.$/)) return; // prevent fire early if decimal. If no more input the change event will fire later
      if (event.type == 'change' && Number(val) === this.precisionValue) return; // already fired change for input event

      const max = this.max;
      const min = this.min;

      const isEmptyString = val.length === 0;
      // val = Number(val);
      if (!isNaN(Number(val)) && !isEmptyString) {
        // this.currentValue = val;

        if (Number(val) > max) {
          this.setValue(max);
          this.setError('max');
        } else if (Number(val) < min) {
          //处理一个特殊的分支  当最小为0.01 但 现在输入的值为0\0.\0.0时 应当允许继续输入
          //添加 .0 时的处理 同时min 最小为 0或无小数点的
          // if(val.split('.').length==1||(''+min).split('.').length==1||val.split('.')[1].length<(''+min).split('.')[1].length){
          if (
            val.split('.').length == 1 ||
            val.split('.')[1].length < this.fixed
            // ('' + this.min.toFixed(val.split('.')[1].length)).split('.')[1].length
          ) {
            this.setValue(val);
          } else {
            this.setValue(min);
            this.setError('min');
          }
        } else {
          this.setValue(val);
        }
      } else {
        if (isNaN(Number(val))) {
          this.setError('nan');
        } else {
          if (this.required) {
            this.setError('empty');
          }
        }
        if (this.defaultnumber !== undefined) {
          let fixedval = this.defaultnumber.toFixed(this.fixed || 0);
          event.target.value = fixedval;
          this.setValue(fixedval);
        } else {
          if (this.required) {
            event.target.value = this.precisionValue;
            this.setValue(this.precisionValue);
          } else {
            event.target.value = '';
            this.setValue('');
          }
        }
      }
    },
    changeVal(val: any) {
      if (this.hidestep) {
        return;
      }
      val = Number(val);
      if (!isNaN(val)) {
        const step = this.step;

        this.upDisabled = val + step > this.max;
        this.downDisabled = val - step < this.min;
      } else {
        this.upDisabled = true;
        this.downDisabled = true;
      }
    },
    getStepRender() {
      return (
        <div class={this.handlerClasses}>
          <a class={this.upClasses} onclick={this.up} onmousedown={this.preventDefault}>
            <a-icon type="up" class={this.innerUpClasses} onclick={this.preventDefault}></a-icon>
          </a>
          <a class={this.downClasses} onclick={this.down} onmousedown={this.preventDefault}>
            <a-icon type="down" class={this.innerDownClasses} onclick={this.preventDefault}></a-icon>
          </a>
        </div>
      );
    },
  },

  render(h: any) {
    let tooltipProp = {
      getPopupContainer: this.getPopupContainer,
      visible: this.iferror,
      trigger: 'click',
      mistake: true,
      title: this.errcontent,
      placement: 'top',
    };
    return (
      <div class="xb-inputnumber-wrap">
        <a-tooltip props={tooltipProp}>
          <div class={this.wrapClasses} style="width:100%;">
            {this.hidestep ? '' : this.getStepRender()}
            <div class={this.inputWrapClasses}>
              <input
                class={this.inputClasses}
                disabled={this.disabled}
                placeholder={this.placeholder}
                autocomplete="off"
                autofocus={this.autofocus}
                name={this.name}
                value={this.precisionValue}
                style={this.alignStyle}
                onfocus={this.focus}
                onblur={this.blur}
                onkeydown={e => {
                  e.stopPropagation();
                  this.keyDown;
                }}
                oninput={this.change}
                onchange={this.change}
              ></input>
            </div>
          </div>
        </a-tooltip>
      </div>
    );
  },
};
