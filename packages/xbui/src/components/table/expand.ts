export default {
  name: 'TableExpand',
  functional: true,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null,
    },
  },
  render: (h: any, ctx: any) => {
    const params: any = {
      row: ctx.props.row,
      index: ctx.props.index,
    };
    if (ctx.props.column) params.column = ctx.props.column;
    return ctx.props.render(h, params);
  },
};
