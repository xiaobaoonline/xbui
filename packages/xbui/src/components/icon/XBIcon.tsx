import SvgData, { Indexer } from './IconSvgData';

export default {
  name: 'XbIcon',
  props: {
    type: String,
    scale: {
      type: [String, Number],
      default: 1,
    },
    color: String,
    size: {
      type: [String, Number],
      default: 20,
    },
    theme: String,
  },
  computed: {
    IconTemplate() {
      return SvgData[this.type];
    },

    IconData() {
      return { template: this.IconTemplate };
    },

    styles() {
      let style: Indexer<any> = {};
      if (this.scale) {
        style.fontSize = Number(this.scale) * Number(this.size) + 'px';
      }
      if (this.color) {
        style.color = this.color;
      }

      return style;
    },
  },
  render() {
    // <a-icon :component="IconData" :type="type" class="xb-icon" :style="styles" />
    let props: any = {};

    if (this.IconTemplate) {
      props.component = this.IconData;
    } else {
      props.type = this.type;
      props.theme = this.theme;
    }
    return <a-icon style={this.styles} class="xb-icon" props={props} />;
  },
};
