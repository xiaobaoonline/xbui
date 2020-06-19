import { Component, Prop } from 'vue-property-decorator';
import Mixin from './mixin';
import uiCheck from './ui-check.vue';

@Component({
  name: 'TableBody',
  components: {
    uiCheck,
  },
})
export default class TableBody extends Mixin {
  @Prop({ type: Array })
  columns!: any[];

  @Prop({ type: Array })
  data!: any[];

  $parent: any;
  _renderProxy: any;

  get table() {
    return this.$parent;
  }

  render(h: any) {
    return (
      <table cellspacing="0" cellpadding="0" border="0">
        <colgroup>
          {this.columns.map(column => (
            <col name={column.key} width={column.width} />
          ))}
        </colgroup>
        <tbody>
          {this.data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              class={this.rowClasses(row, rowIndex)}
              on-click={() => this.clickRow(row, rowIndex, this.columns[0].key)}
            >
              {this.columns.map((column, columnIndex) => (
                <td key={columnIndex} class={this.alignCls(column)}>
                  <div
                    class={this.cellClasses(column)}
                    on-mouseenter={$event => this.handleCellMouseEnter($event, column, row)}
                    on-mouseleave={$event => this.handleCellMouseLeave($event, column, row)}
                  >
                    {column.renderCell.call(this._renderProxy, h, {
                      column: column,
                      columnIndex: columnIndex,
                      row: row,
                      rowIndex: rowIndex,
                    })}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  cellClasses(column: any) {
    return [`${this.prefixCls}-cell`, { [`${this.prefixCls}-cell-over-show`]: column.showOverflowTip }];
  }
  rowChecked(pky: string) {
    return this.table.selectionPkeys.indexOf(pky) > -1;
  }
  rowDisabled(pky: string) {
    return this.table.disabledPkeys.indexOf(pky) > -1;
  }
  handleCellMouseEnter(e: any, column: any, row: any) {
    if (column.showOverflowTip) {
      let target = e.target;
      if (target.offsetWidth < target.scrollWidth || target.offsetHeight < target.scrollHeight) {
        target.title = row[column.key];
      }
    }
  }
  handleCellMouseLeave(e: any, column: any, row: any) {
    let target = e.target;
    target.title = '';
  }
  clickRow(row: any, rowIndex: any, type: string) {
    if (this.table.triggerType === 'row' && (type === 'selection' || type === 'radio')) {
      let selectType = type === 'selection' ? 'checkbox' : 'radio';
      this.table.toggleSelect(row, selectType);
    }
    this.table.clickCurrentRow(row);
  }
  rowClasses(row: any, index: any) {
    return [
      this.rowClsName(index),
      this.rowChecked(this.getPkey(row, this.table.pkey)) ? this.prefixCls + '-row-selected' : '',
      this.columns[0] &&
      this.table.triggerType === 'row' &&
      (this.columns[0].key === 'selection' || this.columns[0].key === 'radio')
        ? this.prefixCls + '-row-selection'
        : '',
    ];
  }
  rowClsName(index) {
    return this.$parent.rowClassName(this.data[index], index);
  }
}
