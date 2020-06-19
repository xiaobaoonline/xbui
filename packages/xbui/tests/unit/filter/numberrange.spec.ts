import { mount } from '@vue/test-utils';
import { XbFilter as Filter } from '@xb/xbui';
import antd from 'ant-design-vue';
import Vue from 'vue';

Vue.use(antd);

let unittext = '课时测试';
let dateData = [
  {
    label: '剩余情况',
    key: 'classtime',
    type: 'numberrange',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
    mutiple: false,
    range: [1, 100],
    fixed: 0,
    father: '',
    unit: unittext,
    son: '',
    list: [],
  },
];

let propData: any = {
  filterdata: dateData,
};
describe('数字范围测试', () => {
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
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('默认值测试', () => {
  it('默认值展示', async () => {
    var data = Object.assign({}, propData);
    data.first = { classtime: [1, 2] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('1 ~ 2 ' + unittext);
  });

  it('默认值弹出层展示', async () => {
    var data = Object.assign({}, propData);
    data.first = { classtime: [1, 2] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    expect((wrapper.find('.xbf-poper-wraper div:nth-child(1).xbf-numberinput input').element as any).value).toEqual(
      '1',
    );
    expect((wrapper.find('.xbf-poper-wraper div:nth-child(3).xbf-numberinput input').element as any).value).toEqual(
      '2',
    );
  });
});

describe('重新选择值测试', () => {
  it('重新选择值展示', async () => {
    var data = Object.assign({}, propData);

    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-poper-wraper div:nth-child(1).xbf-numberinput input').setValue(5);
    wrapper.find('.xbf-poper-wraper div:nth-child(3).xbf-numberinput input').setValue(10);
    wrapper.find('.xbf-confirmbtn').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('5 ~ 10 ' + unittext);
  });
});
