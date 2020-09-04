import { mount } from '@vue/test-utils';
import { XbFilter as Filter } from '@xiaobaoonline/xbui';
import antd from 'ant-design-vue';
import Vue from 'vue';

Vue.use(antd);

let dateData = [
  {
    label: '事件',
    key: 'Dateee',
    type: 'select',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
    mutiple: true,
    father: '',
    baselist: [{ label: '空', value: 0 }],
    son: ['Dateee2', 'Dateee22'],
    list: [
      { label: '按期', value: 1, son: 'Dateee2' },
      { label: '按课时', value: 2, son: 'Dateee22' },
    ],
  },
  {
    label: '儿子',
    key: 'Dateee2',
    type: 'select',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
    mutiple: true,
    father: 'Dateee',
    son: 'Dateee3',
    list: [
      { label: 'SSBDSDSD', value: 0 },
      { label: '１３１３１３１３', value: 1 },
    ],
  },
  {
    label: '孙子',
    key: 'Dateee3',
    type: 'select',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
    mutiple: true,
    father: 'Dateee2',
    son: '',
    list: [
      { label: '孙子', value: 0 },
      { label: '孙子啊', value: 1 },
    ],
  },
  {
    label: '二儿子',
    key: 'Dateee22',
    type: 'select',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
    mutiple: true,
    father: 'Dateee',
    son: '',
    list: [
      { label: '二儿子a ', value: 0 },
      { label: '二儿子s s', value: 1 },
    ],
  },
];

let propData: any = {
  filterdata: dateData,
};
describe('选择事件select 测试', () => {
  it('初始化渲染', async () => {
    const wrapper = mount(Filter, {
      propsData: propData,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});
describe('下拉选择 默认值测试', () => {
  it('默认值展示 select', async () => {
    var data = Object.assign({}, propData);
    data.first = { Dateee: [{ label: '空', value: 0 }] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('空');
  });
  it('多个默认值测试 select', async () => {
    var data = Object.assign({}, propData);
    data.first = { Dateee: [{ label: '空', value: 0 }], Dateee2: [{ label: 'SSBDSDSD', value: 0 }] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.xbf-selectedbox div:nth-child(1)>.ant-tag').text()).toBe('空');
    expect(wrapper.find('.xbf-selectedbox div:nth-child(2)>.ant-tag').text()).toBe('SSBDSDSD');
  });
  it('有默认值时 显示清空按钮', async () => {
    var data = Object.assign({}, propData);
    data.first = { Dateee: [{ label: '空', value: 0 }] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    // 有清空按钮
    expect(wrapper.contains('.xbf-clear>.xbf-linttext>span')).toBe(true);
  });
  it('点击清空筛选按钮清空已选值', async () => {
    var data = Object.assign({}, propData);
    data.first = { Dateee: [{ label: '空', value: 0 }] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-clear>.xbf-linttext>span').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.contains('.ant-tag')).toBe(false);
  });
});
describe('更改选项', () => {
  it('重新选择下拉项', async () => {
    var data = Object.assign({}, propData);
    const wrapper = mount(Filter, {
      propsData: data,
    });

    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-poper-wraper .xbf-itembox div:nth-child(2)').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('按期');
  });
});
