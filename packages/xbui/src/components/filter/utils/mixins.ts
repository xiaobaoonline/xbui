import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class Meta extends Vue {
  @Prop({})
  parentdata!: any;
  @Prop({})
  dropdata!: any;

  /** 外部设置时的数据设置 */
  @Prop({})
  outerdata!: any;
  get item() {
    return this.dropdata || {};
  }
  ifdisabled(item: any, baseData: any) {
    if (!item.father) {
      return false;
    } else {
      return baseData[item.father].selectedArr.length == 0;
    }
  }
  checkIfShow(item: any, baseData: any) {
    if (!item.father) {
      return true;
    }
    let fatherData = baseData[item.father];
    if (this.checkIfShow(fatherData, baseData)) {
      if (fatherData.selectedArr.length) {
        let tag = false;
        fatherData.selectedArr.map((arr: any) => {
          if (arr.son) {
            if (arr.son == item.key) {
              tag = true;
            }
          } else {
            tag = true;
          }
        });
        return tag;
      } else {
        // 多个儿子的情况   默认显示第一个
        return fatherData.son == item.key || fatherData.son[0] == item.key;
      }
    }
  }
}
