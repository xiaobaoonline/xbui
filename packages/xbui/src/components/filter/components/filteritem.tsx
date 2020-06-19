import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'XbFilterItem',
})
export default class XbFilterItem extends Vue {
  @Prop({})
  item!: any;

  @Prop({})
  data!: object | number | string;

  @Prop({})
  labelKey!: string;

  // props: {
  //   // item: {
  //   //   type: Object,
  //   // },
  //   // data: {
  //   //   type: Object | Number | String,
  //   // },
  //   // labelKey: {
  //   //   type: String,
  //   // },
  // },

  itemconfig: any = null;

  get parentSlot() {
    return this.$parent.$parent.$parent.$scopedSlots[this.item.key];
  }

  render() {
    const { data, labelKey } = this.$props;
    const { parentSlot } = this;
    return <span>{parentSlot ? parentSlot(data) : typeof data == 'object' ? data[labelKey] : data}</span>;
  }
}
