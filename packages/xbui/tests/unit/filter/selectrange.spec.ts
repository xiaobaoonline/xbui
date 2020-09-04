import { mount } from '@vue/test-utils';
import { XbFilter as Filter } from '@xiaobaoonline/xbui';
import antd from 'ant-design-vue';
import Vue from 'vue';

Vue.use(antd);

let dateData = [
  {
    label: '年龄',
    key: 'age',
    type: 'selectrange',
    filter: false,
    remote: false,
    priority: 1,
    remoteUrl: '',
    mutiple: false,
    father: '',
    son: '',
    list: [
      {
        label: '36个月',
        value: 1,
      },
      {
        label: '2岁',
        value: 2,
      },
      {
        label: '3岁',
        value: 3,
      },
      {
        label: '4岁',
        value: 4,
      },
      {
        label: '50岁',
        value: 5,
      },
    ],
  },
];

let propData: any = {
  filterdata: dateData,
};
describe('选择范围测试', () => {
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

  it('点击筛选项后 点击下拉渲染', async () => {
    const wrapper = mount(Filter, {
      propsData: propData,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-rangepopbox div:nth-child(1)').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toMatchSnapshot();
  });
});

describe('默认值测试', () => {
  it('默认值展示', async () => {
    var data = Object.assign({}, propData);
    data.first = { age: [1, 2] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('36个月 ~ 2岁');
  });

  it('默认值弹出层展示', async () => {
    var data = Object.assign({}, propData);
    data.first = { age: [1, 2] };
    const wrapper = mount(Filter, {
      propsData: data,
    });

    await wrapper.vm.$nextTick();
    wrapper.find('.xbf-filterdropitem .xbf-filtertitle').trigger('click');
    await wrapper.vm.$nextTick();

    // let start = wrapper.find('.xbf-rangepopbox div:nth-child(1) .ant-select-selection-selected-value');
    expect(wrapper.contains('.xbf-rangepopbox div:nth-child(1) .ant-select-selection-selected-value')).toBeTruthy();

    expect(wrapper.find('.xbf-rangepopbox div:nth-child(1) .ant-select-selection-selected-value').text()).toEqual(
      '36个月',
    );
    expect(wrapper.find('.xbf-rangepopbox div:nth-child(3) .ant-select-selection-selected-value').text()).toEqual(
      '2岁',
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

    // 点击第一个选择框
    wrapper.find('.xbf-rangepopbox div:nth-child(1)').trigger('click');
    await wrapper.vm.$nextTick();
    // 选择第二项
    expect(wrapper.contains('.ant-select-dropdown')).toBeTruthy();
    wrapper.find('.ant-select-dropdown li:nth-child(1)').trigger('click');

    // // 点击第二个选择框
    // wrapper.find(".xbf-rangepopbox div:nth-child(3)").trigger("click");
    // await wrapper.vm.$nextTick();
    // // 选择第四项
    // let wrapid2 = wrapper
    //   .find(".xbf-rangepopbox div:nth-child(3) div")
    //   .attributes("aria-controls");
    // wrapper.find("#" + wrapid2 + "> ul > li:nth-child(4)").trigger("click");

    wrapper.find('.xbf-confirmbtn').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.ant-tag').text()).toBe('2岁 ~ 4岁');
  });
});
