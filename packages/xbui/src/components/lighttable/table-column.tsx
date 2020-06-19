import { findComponentUpward } from '@/utils/utils';
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

const normalHeader = function(h: any, param: any) {
  return param.column.label;
};
const normalCell = function(h: any, param: any) {
  if (!param.column) {
    return '';
  }
  if (param.column.formatter) {
    return param.column.formatter(param);
  }
  let columnValue = param.row[param.column.key];
  return h('span', columnValue);
};
const column_map = {
  index: {
    renderCell: function(h, param) {
      return h('span', param.rowIndex + 1);
    },
  },
  selection: {
    renderHeader: function(h) {
      return (
        <ui-check
          value={this.isSelectAll}
          nativeOn-click={e => {
            e.stopPropagation();
            this.selectAll();
          }}
        />
      );
    },
    renderCell: function(h, param) {
      let pky = this.getPkey(param.row, this.table.pkey);
      return (
        <ui-check
          value={this.rowChecked(pky)}
          disabled={this.rowDisabled(pky)}
          nativeOn-click={e => {
            e.stopPropagation();
            this.table.toggleSelect(param.row, 'checkbox');
          }}
        />
      );
    },
  },
  radio: {
    renderCell: function(h, param) {
      let pky = this.getPkey(param.row, this.table.pkey);
      return (
        <ui-check
          value={this.rowChecked(pky)}
          disabled={this.rowDisabled(pky)}
          type="radio"
          nativeOn-click={e => {
            e.stopPropagation();
            this.table.toggleSelect(param.row, 'radio');
          }}
        />
      );
    },
  },
};

@Component({
  name: 'XbTableColumn',
})
export default class XbTableColumn extends Vue {
  @Prop({
    type: String,
    default: '',
  })
  type!: string;

  @Prop({
    type: Number,
  })
  width!: number;
  @Prop({
    type: String,
    default: 'left',
  })
  align!: string;
  @Prop({
    type: String,
    default: '',
  })
  columnKey!: string;
  @Prop({
    type: String,
    default: '',
  })
  label!: string;
  @Prop({
    type: Boolean,
    default: false,
  })
  showOverflowTip!: boolean;
  @Prop({
    type: Function,
  })
  renderHeader!: () => void;
  @Prop({
    type: Function,
  })
  formatter!: () => void;

  table: any = findComponentUpward(this, 'XbLightTable');
  column: any = null;

  @Watch('label')
  labelChange(val) {
    this.column.label = val;
  }
  @Watch('width')
  widthChange(val) {
    this.column.width = val;
  }

  created() {
    this.column = {
      type: this.type,
      width: this.width,
      align: this.align,
      key: this.columnKey || this.type,
      label: this.label,
      renderCell: null,
      renderHeader: null,
      formatter: this.formatter || null,
      showOverflowTip: this.showOverflowTip,
      activiteTip: false,
    };
    let renderType = column_map[this.type];
    if (this.renderHeader) {
      this.column.renderHeader = this.renderHeader;
    } else {
      this.column.renderHeader = normalHeader;
      if (renderType) {
        this.column.renderHeader = renderType.renderHeader || normalHeader;
      }
    }
    let renderCell: any = null;
    let that = this;
    this.column.renderCell = function(h, data) {
      if (that.$scopedSlots.default) {
        renderCell = () => that.$scopedSlots && that.$scopedSlots.default && that.$scopedSlots.default(data);
      } else if (renderType) {
        renderCell = renderType.renderCell;
      } else {
        renderCell = normalCell;
      }

      return renderCell.call(this, h, data);
    };
  }
  mounted() {
    this.table.insertColumn(this.column);
  }
  destroyed() {
    this.table.deleteColumn(this.column);
  }
  render() {
    return '';
  }
}
