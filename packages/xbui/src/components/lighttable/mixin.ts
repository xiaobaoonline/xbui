import { Component, Vue } from 'vue-property-decorator';
import { Indexer } from '../icon/IconSvgData';

@Component({
  name: 'TableMixin',
})
export default class TableMixin extends Vue {
  prefixCls: string = 'xbui-light-table';
  alignCls(column: any) {
    return [
      {
        [`${this.prefixCls}-column-${column.align}`]: column.align,
        [`${this.prefixCls}-column-link`]: column.type === 'link',
        [`${this.prefixCls}-column-normal`]: column.type !== 'link',
      },
    ];
  }
  getPkey(row: Indexer<string>, pkey: string | string[]) {
    if (Array.isArray(pkey)) {
      let keyarr: string[] = [];
      pkey.forEach((k: string) => {
        keyarr.push(row[k]);
      });
      return keyarr.join('_');
    } else {
      return row[pkey];
    }
  }
}
