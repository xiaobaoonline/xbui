import elementResizeDetectorMaker from 'element-resize-detector';
import { getScrollBarSize } from '../../utils/utils';
import Bar from './bar';
const prefixCls = 'xbui-scrollbar';
export default {
  name: 'XbScrollbar',

  components: {
    Bar,
  },

  props: {
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: 'div',
    },
  },

  data() {
    return {
      sizeWidth: '0',
      sizeHeight: '0',
      moveX: 0,
      moveY: 0,
    };
  },

  computed: {
    wrap() {
      return this.$refs.wrap;
    },
  },

  render(h) {
    let that = this;
    let gutter = getScrollBarSize();
    let style = this.wrapStyle || {};

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;
      style.marginRight = style.marginBottom = gutterWith;
    }
    return h(
      'div',
      {
        class: [prefixCls],
      },
      [
        h(
          'div',
          {
            ref: 'wrap',
            style: style,
            class: [that.wrapClass, prefixCls + '-wrap'],
            on: {
              scroll: $event => {
                that.handleScroll($event);
              },
            },
          },
          [
            h(
              that.tag,
              {
                class: [prefixCls + '-view', that.viewClass],
                style: that.viewStyle,
                ref: 'resize',
              },
              that.$slots.default,
            ),
          ],
        ),
        h('Bar', {
          props: {
            move: that.moveX,
            size: that.sizeWidth,
          },
        }),
        h('Bar', {
          props: {
            vertical: true,
            move: that.moveY,
            size: that.sizeHeight,
          },
        }),
      ],
    );
  },

  methods: {
    emitScroll(scrollType, distance) {
      this.$emit('on-barScroll', {
        scroll: scrollType,
        distance: distance,
      });
    },
    handleWhell(distance) {
      const wrap = this.wrap;
      // this.moveY = ((wrap.scrollTop+event.deltaY) * 100) / wrap.clientHeight;
      this.moveX = (distance * 100) / wrap.clientWidth;
    },
    handleScroll() {
      const wrap = this.wrap;
      this.moveY = (wrap.scrollTop * 100) / wrap.clientHeight;
      this.moveX = (wrap.scrollLeft * 100) / wrap.clientWidth;
    },

    update() {
      let heightPercentage, widthPercentage;
      const wrap = this.wrap;
      if (!wrap) return;
      heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
      widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

      this.sizeHeight = heightPercentage < 100 ? heightPercentage + '%' : '';
      this.sizeWidth = widthPercentage < 100 ? widthPercentage + '%' : '';
    },
  },

  mounted() {
    this.$nextTick(() => this.update());
    if (!this.noresize) {
      this.observer = elementResizeDetectorMaker();
      this.observer.listenTo(this.$refs.resize, this.update);
      this.observer.listenTo(this.$refs.wrap, this.update);
    }
  },

  beforeDestroy() {
    if (!this.noresize) {
      this.observer.removeListener(this.$refs.resize, this.update);
      this.observer.removeListener(this.$refs.wrap, this.update);
    }
  },
};
