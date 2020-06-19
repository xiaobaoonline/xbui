import { Component, Prop } from 'vue-property-decorator';
import Mixin from './mixin';
import uiCheck from './ui-check.vue';
@Component({
  name: 'TableHead',
  components: {
    uiCheck,
  },
})
export default class TableHead extends Mixin {
  @Prop({ type: Array })
  columns!: any[];

  @Prop({ type: Array })
  data!: any[];

  _renderProxy: any;

  get table(): any {
    return this.$parent;
  }
  get isSelectAll() {
    let isSelectAll = true;
    if (!this.data.length) isSelectAll = false;
    for (let i = 0; i < this.data.length; i++) {
      let row = this.data[i];
      let pky = this.getPkey(row, this.table.pkey);
      if (this.table.selectionPkeys.indexOf(pky) === -1 && this.table.disabledPkeys.indexOf(pky) === -1) {
        isSelectAll = false;
        break;
      }
    }
    return isSelectAll;
  }
  render(h: any) {
    return (
      <table cellspacing="0" cellpadding="0" border="0">
        <colgroup>
          {this.columns.map(column => (
            <col name={column.key} width={column.width} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {this.columns.map((column, columnIndex) => (
              <th key={columnIndex} class={this.alignCls(column)}>
                <div class={this.cellClasses()}>{column.renderHeader.call(this._renderProxy, h, { column })}</div>
              </th>
            ))}
          </tr>
        </thead>
      </table>
    );
  }
  cellClasses() {
    return [`${this.prefixCls}-cell`];
  }
  selectAll() {
    const status = !this.isSelectAll;
    this.table.selectAll(status);
  }
}
