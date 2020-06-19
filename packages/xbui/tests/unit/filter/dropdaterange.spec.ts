import { mount } from '@vue/test-utils';
import { XbFilter as Filter } from '@xb/xbui';
import antd from 'ant-design-vue';
import moment from 'moment';
import Vue from 'vue';
import { asyncExpect } from '../../util';

Vue.use(antd);

let dateData = [
  {
    label: '时间',
    key: 'date1',
    type: 'daterange',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
  },
  {
    label: '时间',
    key: 'datetime1',
    type: 'daterangetime',
    format: 'YYYY-MM-DD HH:mm:ss',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
  },
];

let propData: any = {
  filterdata: dateData,
};
describe('日期范围与日期时间范围测试', () => {
  it('初始化渲染', async () => {
    const wrapper = mount(Filter, {
      propsData: propData,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('点击筛选项后渲染', async () => {
    const wrapper = mount(Filter, {
      propsData: propData,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    // expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.contains('.ant-calendar-body')).toBeTruthy();
  });
});

describe('日期范围 默认值测试', () => {
  it('判断默认值 datetimerange', async () => {
    var data = Object.assign({}, propData);
    data.first = {
      datetime1: [moment('2020-01-01 10:10:10'), moment('2020-01-02 10:10:10')],
    };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('2020-01-01 10:10:10 ~ 2020-01-02 10:10:10');
  });

  it('判断默认值 daterange', async () => {
    var data = Object.assign({}, propData);
    data.first = { date1: [moment('2020-01-01'), moment('2020-01-02')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('2020-01-01 ~ 2020-01-02');
  });

  it('默认值 datetime 已选择范围正常', async () => {
    var data = Object.assign({}, propData);
    data.first = { date1: [moment('2020-01-01'), moment('2020-01-02')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.contains('.ant-calendar-selected-day')).toBeTruthy();
    let start = moment(
      new Date(
        wrapper.find('.ant-calendar-selected-start-date.ant-calendar-selected-day').attributes('title') as string,
      ),
    ).format('YYYY-MM-DD');
    let end = moment(
      new Date(wrapper.find('.ant-calendar-selected-end-date.ant-calendar-selected-day').attributes('title') as string),
    ).format('YYYY-MM-DD');
    expect(start).toEqual('2020-01-01');
    expect(end).toEqual('2020-01-02');
  });

  it('有默认值时 有删除按钮', async () => {
    var data = Object.assign({}, propData);
    data.first = {
      datetime1: [moment('2020-01-01 10:10:10'), moment('2020-01-02 10:10:10')],
    };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    // 有删除按钮
    expect(wrapper.contains('.ant-tag')).toBe(true);
  });

  it('有默认值时 有清空按钮', async () => {
    var data = Object.assign({}, propData);
    data.first = {
      datetime1: [moment('2020-01-01 10:10:10'), moment('2020-01-02 10:10:10')],
    };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    // 有清空按钮
    expect(wrapper.contains('.xbf-clear>.xbf-linttext>span')).toBe(true);
  });
});

describe('更新已选', () => {
  it('重新选择日期', async () => {
    var data = Object.assign({}, propData);
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    // 点击出现的第一列最后一天
    let startdom = wrapper.find('.ant-calendar-tbody tr:nth-child(1)>td:nth-child(7)');
    let startdate = startdom.attributes('title') as string;
    startdom.trigger('click');

    // 点击出现的第二列最后一天
    let enddom = wrapper.find('.ant-calendar-tbody tr:nth-child(2)>td:nth-child(7)');
    let enddate = enddom.attributes('title') as string;
    enddom.trigger('click');

    await wrapper.vm.$nextTick();
    let tagdata = wrapper.find('.ant-tag').text();

    expect(tagdata).toBe(
      moment(new Date(startdate)).format('YYYY-MM-DD') + ' ~ ' + moment(new Date(enddate)).format('YYYY-MM-DD'),
    );
  });

  it('重新选择日期 回调判断', async () => {
    var data = Object.assign({}, propData);

    const onFilterChangeStub = jest.fn();

    const wrapper = mount(Filter, {
      propsData: data,
      listeners: {
        onFilterChange: onFilterChangeStub,
      },
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    // 点击出现的第一列最后一天
    let todaydom = wrapper.find('.ant-calendar-tbody tr:nth-child(1)>td:nth-child(7)');
    // let title = todaydom.attributes('title');

    todaydom.trigger('click');

    await wrapper.vm.$nextTick();
    asyncExpect(() => {
      expect(onFilterChangeStub).toHaveBeenCalledTimes(1);
    }, 0);
  });
});

describe('日期范围 删除已选测试', () => {
  it('点击关闭标签按钮 清空已选值', async () => {
    var data = Object.assign({}, propData);
    data.first = { date1: [moment('2020-01-01'), moment('2020-01-02')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();

    wrapper.find('.anticon-close').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.contains('.ant-tag')).toBe(false);
  });

  it('点击清空筛选按钮清空已选值', async () => {
    var data = Object.assign({}, propData);
    data.first = { date1: [moment('2020-01-01')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();

    wrapper.find('.xbf-clear>.xbf-linttext>span').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.contains('.ant-tag')).toBe(false);
  });
});
