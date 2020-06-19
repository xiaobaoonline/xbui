import { Component, Prop, Watch } from 'vue-property-decorator';
import { addClass, hasClass, removeClass } from '../../utils/dom';
import controlCell from './control-cell.vue';
import expand from './expand';
import inputCell from './input-cell.vue';
import Mixin from './mixin';

const column_map = {
  index: {
    render(h: any, rowIndex: any, row: any, column: any) {
      return <span>{rowIndex + 1}</span>;
    },
  },
  selection: {
    render(h: any, rowIndex: any, row: any, column: any) {
      let that = this;
      let disabled = that.rowDisabled(rowIndex);
      let checked = that.rowChecked(rowIndex);
      let labelclass = [
        'ant-checkbox-wrapper',
        disabled ? 'ant-checkbox-wrapper-disabled' : '',
        checked ? 'ant-checkbox-wrapper-checked' : '',
      ];
      let wrapspanclass = [
        'ant-checkbox',
        disabled ? 'ant-checkbox-disabled' : '',
        checked ? 'ant-checkbox-checked' : '',
      ];
      return (
        <label class={labelclass}>
          <span class={wrapspanclass}>
            <span class="ant-checkbox-inner"></span>
            <input
              type="checkbox"
              class="ant-checkbox-input"
              on-click={e => {
                e.stopPropagation();
                let status = !checked; //变化的目标
                if (typeof column.preselect == 'function') {
                  if (column.preselect(row, status, 'one')) {
                    that.$parent.toggleSelect(row);
                  }
                } else {
                  that.$parent.toggleSelect(row);
                }
              }}
            ></input>
          </span>
        </label>
      );
    },
  },
  normal: {
    render(h, rowIndex, row, column) {
      let columnValue =
        row[column.key] === '' || row[column.key] === null || row[column.key] === undefined ? '-' : row[column.key];
      return <span>{columnValue}</span>;
    },
  },
  selfRender: {
    render(h, rowIndex, row, column) {
      let props = {
        row: row,
        column: column,
        index: row._index,
        render: column.render,
      };

      return <expand props={props}></expand>;
    },
  },
  radio: {
    render(h, rowIndex, row, column) {
      return (
        <span class={this.prefixCls + '-radio-box'}>
          <a-icon type="checkmark" size="22"></a-icon>
        </span>
      );
    },
  },
  expand: {
    render(h, rowIndex, row, column) {
      let that = this;
      if (row._disableExpand) {
        return '';
      }
      let divclass = [
        this.prefixCls + '-cell-expand',
        this.rowExpanded(row._index) ? this.prefixCls + '-cell-expand-expanded' : '',
      ];
      return (
        <div
          class={divclass}
          on-click={() => {
            that.$parent.toggleExpand(row._index);
          }}
        >
          <a-icon type="right"></a-icon>
        </div>
      );
    },
  },
  input: {
    render(h, rowIndex, row, column) {
      let props = {
        row: row,
        column: column,
        index: row._index,
        render: column.render,
      };

      return <inputCell props={props} />;
    },
  },
  control: {
    render(h, rowIndex, row, column) {
      let props = {
        row: row,
        column: column,
        index: row._index,
        render: column.render,
      };
      return <controlCell props={props} />;
    },
  },
};

@Component({
  name: 'TableBody',
  components: { controlCell, inputCell, expand },
})
export default class TableBody extends Mixin {
  @Prop({ type: Object })
  styleObject!: any;
  @Prop({ type: Array })
  columns!: any[];
  @Prop({ type: Array })
  data!: any[]; // rebuildData
  @Prop({ type: Object })
  columnsWidth: any;

  @Prop({ type: Object })
  control!: any;

  $parent: any;

  get expandRender() {
    let render = function() {
      return '';
    };
    for (let i = 0; i < this.columns.length; i++) {
      const column = this.columns[i];
      if (column.type && column.type === 'expand') {
        if (column.render) render = column.render;
      }
    }
    return render;
  }
  @Watch('$parent.currentHoverRow')
  currentHoverRowWatch(newVal: any, oldVal: any) {
    const el: any = this.$el;
    if (!el) return;
    const tr = el.querySelector('tbody').children;
    const rows = [].filter.call(tr, row => hasClass(row, `${this.prefixCls}-row`));
    const oldRow = rows[oldVal];
    const newRow = rows[newVal];
    if (oldRow) {
      removeClass(oldRow, `${this.prefixCls}-row-hover`);
    }
    if (newRow) {
      addClass(newRow, `${this.prefixCls}-row-hover`);
    }
  }
  @Watch('$parent.currentClickRow')
  currentClickRowWatch(newVal: any, oldVal: any) {
    if (!this.$parent.isRadio) {
      return;
    }
    const el: any = this.$el;
    if (!el) return;
    const tr = el.querySelector('tbody').children;
    const rows = [].filter.call(tr, row => hasClass(row, `${this.prefixCls}-row`));
    const oldRow = rows[oldVal];
    const newRow = rows[newVal];
    if (oldRow) {
      removeClass(oldRow, `${this.prefixCls}-row-checked`);
    }
    if (newRow) {
      addClass(newRow, `${this.prefixCls}-row-checked`);
    }
  }

  //处理合并行列
  getSpan(row, column, rowIndex, columnIndex) {
    let rowspan = 1;
    let colspan = 1;

    const fn = this.$parent.spanMethod;
    if (typeof fn === 'function') {
      const result = fn(row, column, rowIndex, columnIndex);
      if (result) {
        rowspan = result.rowspan;
        colspan = result.colspan;
      }
    }
    return {
      rowspan,
      colspan,
    };
  }
  //固定表格单元格高度设置与中间表格高度一致
  trStyles(_index, expand = false) {
    let style: any = {};
    if (this.fixed && this.$parent.fixedColumnsBodyRowsHeight.length) {
      let heightItem = this.$parent.fixedColumnsBodyRowsHeight[_index];
      let trHeight = 0;
      if (heightItem) {
        trHeight = expand ? heightItem.expandHeight : heightItem.height;
      }
      style.height = `${trHeight}px`;
    }
    return style;
  }
  ellipsisStyle(column) {
    let style: any = {};
    if (column.breakWord && column.lineClamp) {
      style.display = '-webkit-box';
      style.webkitBoxOrient = 'vertical';
      style.webkitLineClamp = column.lineClamp;
      style.maxHeight = 24 * column.lineClamp + 'px';
    }
    return style;
  }
  rowClasses(_index) {
    return [
      `${this.prefixCls}-row`,
      this.rowClsName(_index),
      this.rowChecked(_index) ? `${this.prefixCls}-row-checked` : '',
    ];
  }
  rowClsName(_index) {
    return this.$parent.rowClassName(this.data[_index], _index);
  }
  rowChecked(_index) {
    return this.data[_index] ? this.$parent.selectionPkeys.indexOf(this.data[_index]._pkey) > -1 : false;
  }
  rowDisabled(_index) {
    return this.data[_index]._disabled;
  }
  rowExpanded(_index) {
    return this.$parent.expandArr[_index] && this.$parent.expandArr[_index].expanded;
  }
  handleMouseIn(_index, event) {
    this.$parent.handleMouseIn(_index, event);
  }
  handleMouseOut(_index, event) {
    this.$parent.handleMouseOut(_index, event);
  }
  clickCurrentRow(_index, row) {
    this.$parent.setCurrentRow(_index, row);
  }

  getExpand(row: any, rowIndex: any) {
    let expandClass = [this.prefixCls + '-expanded-row', this.fixed ? this.prefixCls + '-expanded-row-fixed' : ''];
    return (
      <tr class={expandClass} style={this.trStyles(rowIndex, true)}>
        <td colSpan={this.columns.length} class={this.prefixCls + '-expanded-cell'}>
          {!this.fixed ? (
            this.$parent.$scopedSlots['expand'] ? (
              this.$parent.$scopedSlots['expand']({
                data: { row: row, fixed: this.fixed },
              })
            ) : (
              <expand key={row._rowKey} row={row} render={this.expandRender} index={row._index}></expand>
            )
          ) : (
            ''
          )}
        </td>
      </tr>
    );
  }

  getRow(h: any, row: any, rowIndex: any) {
    return (
      <tr
        key={row._rowkey}
        class={this.rowClasses(rowIndex)}
        style={this.trStyles(rowIndex)}
        on-click={$event => {
          let status = !this.rowChecked(rowIndex); //变化的目标
          if (
            ((this.$parent.selectTriggerByRow || this.$parent.isRadio) &&
              typeof this.columns[0].preselect == 'function' &&
              this.columns[0].preselect(row, status, 'one')) ||
            !this.columns[0].preselect
          ) {
            this.clickCurrentRow(rowIndex, row);
          }
        }}
        on-mouseenter={$event => this.handleMouseIn(rowIndex, $event)}
        on-mouseleave={$event => this.handleMouseOut(rowIndex, $event)}
      >
        {this.columns.map((column, columnIndex) => {
          const { rowspan, colspan } = this.getSpan(row, column, rowIndex, columnIndex);
          // console.log(123);
          if (rowspan || colspan) {
            let styleobj = {
              display: !column.show ? 'none' : 'table-cell',
              'border-bottom-color': this.rowExpanded(row._index) ? '#5295e7' : '#d4dfe5',
            };
            let cellclasses = [
              this.prefixCls + '-cell',
              column.breakWord ? this.prefixCls + '-cell-noEllipsis' : '',
              column.type === 'expand' ? this.prefixCls + '-cell-with-expand' : '',
            ];

            return (
              <td
                class={[
                  ...this.alignCls(column, false, row),
                  column.type === 'link' ? `${this.prefixCls}-link-hover` : '',
                ]}
                style={styleobj}
                key={column._columnKey}
                rowSpan={rowspan}
                colSpan={colspan}
                on-click={$event => {
                  if (column.type === 'link') {
                    if ($event.target.nodeName === 'TD') {
                      let link = $event.target.querySelector('a');
                      if (link) {
                        link.click();
                        $event.stopPropagation();
                        $event.preventDefault();
                      }
                    }
                  }
                }}
              >
                <div
                  class={cellclasses}
                  style={this.ellipsisStyle(column)}
                  on-mouseenter={$event => {
                    if (column.showOverflowTip) {
                      let target = $event.target;
                      if (target.offsetWidth < target.scrollWidth || target.offsetHeight < target.scrollHeight) {
                        target.title = row[column.key];
                      }
                    }
                  }}
                  on-mouseleave={$event => {
                    let target = $event.target;
                    target.title = '';
                  }}
                >
                  {this.$parent.$scopedSlots[column.key]
                    ? (this.$parent.$scopedSlots[column.key] as any)({ data: { col: column, row: row } })
                    : column_map[column.renderType].render.call(this, h, rowIndex, row, column)}
                </div>
              </td>
            );
          }
        })}
      </tr>
    );
  }

  render(h: any) {
    // console.log('render');
    return (
      <table cellspacing="0" cellpadding="0" border="0" style={this.styleObject}>
        <colgroup>
          {this.columns.map(column => (
            <col
              name={column.key}
              width={this.setCellWidth(column)}
              style={!column.show ? 'display:none' : 'display:table-column'}
            />
          ))}
        </colgroup>
        <tbody class={this.prefixCls + '-tbody'}>
          {this.data.map((row, rowIndex) => {
            let arr = [this.getRow(h, row, rowIndex)];
            if (this.rowExpanded(row._index)) {
              arr.push(this.getExpand(row, rowIndex));
            }
            return arr;
          })}
        </tbody>
      </table>
    );
  }
}
