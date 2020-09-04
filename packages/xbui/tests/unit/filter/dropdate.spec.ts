import { mount } from '@vue/test-utils';
import { XbFilter as Filter } from '@xiaobaoonline/xbui';
import antd from 'ant-design-vue';
import moment from 'moment';
import Vue from 'vue';
import { asyncExpect } from '../../util';

Vue.use(antd);

let dateData = [
  {
    label: '时间',
    key: 'date1',
    type: 'date',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
  },
  {
    label: '时间',
    key: 'datetime1',
    type: 'datetime',
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
describe('日期与日期时间测试', () => {
  it('初始化渲染', async () => {
    const wrapper = mount(Filter, {
      propsData: propData,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });

  // 这个用例有点傻  每次新点击开的弹窗 当前日期会变化，所以这个Dom截图没有参考意义
  it('点击筛选项后渲染', async () => {
    var data = Object.assign({}, propData);
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    // expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.contains('.ant-calendar-selected-day')).toBeTruthy();
  });
});

describe('日期范围 默认值测试', () => {
  it('判断默认值 datetime', async () => {
    var data = Object.assign({}, propData);
    data.first = { datetime1: [moment('2020-01-01 10:10:10')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('2020-01-01 10:10:10');
  });

  it('判断默认值 date', async () => {
    var data = Object.assign({}, propData);
    data.first = { date1: [moment('2020-01-01')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('2020-01-01');
  });

  it('默认值 datetime 已选择范围正常', async () => {
    var data = Object.assign({}, propData);
    data.first = { date1: [moment('2020-01-01')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.contains('.ant-calendar-selected-day')).toBeTruthy();
    let currentdate = moment(new Date(wrapper.find('.ant-calendar-selected-day').attributes('title') as string)).format(
      'YYYY-MM-DD',
    );
    expect(currentdate).toEqual('2020-01-01');
  });

  it('有默认值时 有删除按钮', async () => {
    var data = Object.assign({}, propData);
    data.first = {
      date1: [moment('2020-01-01')],
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
      date1: [moment('2020-01-01')],
    };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    // 有清空按钮
    expect(wrapper.contains('.xbf-clear>.xbf-linttext>span')).toBe(true);
  });

  it('点击关闭标签按钮 清空已选值', async () => {
    var data = Object.assign({}, propData);
    data.first = { date1: [moment('2020-01-01')] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    // 有删除按钮
    expect(wrapper.contains('.ant-tag')).toBe(true);
    expect(wrapper.contains('.anticon-close')).toBe(true);

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

describe('选择项更新', () => {
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

    todaydom.trigger('click');

    await wrapper.vm.$nextTick();
    asyncExpect(() => {
      expect(onFilterChangeStub).toHaveBeenCalledTimes(1);
    }, 0);
  });
});
