import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'XBTableMixin',
})
export default class XBTableMixin extends Vue {
  @Prop({
    type: [Boolean, String],
    default: false,
  })
  fixed!: boolean | string;
  prefixCls: string = 'xbui-table';

  alignCls(column: any, isHeader: any, row: any = {}) {
    let cellClassName = '';
    if (row.cellClassName && column.key && row.cellClassName[column.key]) {
      cellClassName = row.cellClassName[column.key];
    }
    return [
      {
        [`${cellClassName}`]: cellClassName, // cell className
        [`${column.className}`]: !isHeader ? column.className : '', // column className
        [`${this.prefixCls}-column-${column.align}`]: column.align,
        [`${this.prefixCls}-column-link`]: column.type === 'link',
        [`${this.prefixCls}-column-control`]: column.type === 'control',
        [`${this.prefixCls}-hidden`]:
          (this.fixed === 'left' && column.fixed !== 'left') ||
          (this.fixed === 'right' && column.fixed !== 'right') ||
          (!this.fixed && column.fixed && (column.fixed === 'left' || column.fixed === 'right')),
      },
    ];
  }
  setCellWidth(column: any) {
    let width = '';
    if (column.realWidth) {
      width = column.realWidth;
    } else if (column.width) {
      width = column.width;
    }

    if (width === '0') width = '';
    return width;
  }
}
