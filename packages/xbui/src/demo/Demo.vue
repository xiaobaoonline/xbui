<template>
  <div id="app">
    <input v-model="v1" type="text" @change="Log('change')" @input="Log('input')" />
    <a-select>
      <a-select-option v-if="false" key="1">11111</a-select-option>
      <a-select-option v-show="false" key="2">22222</a-select-option>
      <a-select-option key="3" @click="handleClick">33333</a-select-option>
    </a-select>
    <xb-select-table
      ref="selectTable"
      :data-list="data"
      align="center"
      autohide
      multiple
      :preselect="preselect"
      value-key="id"
      label-key="name"
      :selected-item="selectedItem"
      :disabled-item="disabledItem"
      :table-width="500"
      :max-height="200"
      filterable
      clearable
      :loading="loading"
      @on-change="SelectThis"
      @on-load-more="fetchData()"
    >
      <xb-table-column column-key="name" label="姓名" :render-header="renderHeader"></xb-table-column>
      <xb-table-column column-key="age" label="年龄" :formatter="formatter"></xb-table-column>
      <xb-table-column column-key="address" label="地址" show-overflow-tip></xb-table-column>
      <xb-table-column column-key="date" label="生日" align="center" :width="120">
        <template slot-scope="scope">
          <a-Tooltip
            placement="top"
            content="Tooltip 文字提示鬼斧神工可接受的就肯定会给结果和发收到就好单身狗读后感读后感合适的个好多个"
            :max-width="100"
          >
            <div
              style="margin-left: 10px;color:red;height:60px;line-height:60px"
            >{{ scope.row.date }}</div>
          </a-Tooltip>
        </template>
      </xb-table-column>
      <template slot="header">Hahahaha</template>

      <template slot="emptyData">
        <div class="table-empty">很抱歉，这里什么都没有</div>
      </template>
      <template slot="footer">
        <div class="table-empty">很抱歉，这里什么都没有</div>
      </template>
    </xb-select-table>

    <xb-filter
      :filterdata="filterdata"
      :first="first"
      :freeze="freeze"
      @on-filter-change="changeFilter"
      @onError="handleError"
    >
      <div slot="head">Head</div>
      <template slot="Dateee" slot-scope="data">{{ data.label }}+{{ data.value }}</template>
    </xb-filter>
    <!-- <xb-filter
      ref="xbfilter"
      :first="firstParam"
      :filterdata="filterdata"
      filtername="studentenrolllistfilter"
      @on-filter-change="changeFilter"
    >
      <template slot="educationConsultantHrdocIds" slot-scope="data">
        <p style="display:inline-flex; justify-content:space-between;width:100%">
          <span>{{ data.educationConsultantHrdocName }}</span>
          <span style="margin-left:40px;">{{ data.educationConsultantHrdocPhone }}</span>
        </p>
      </template>
    </xb-filter>-->
    <!-- <xb-button>123123</xb-button> -->

    <!-- <Xb-Icon type="tag-balance" scale="5"></Xb-Icon>
    <Xb-Icon type="tag-balance"></Xb-Icon>
    <Xb-Icon type="tag-waitpos"></Xb-Icon>
    <Xb-Icon type="tag-notoption"></Xb-Icon>
    <Xb-Icon type="tag-hook"></Xb-Icon>
    <Xb-Icon type="cake"></Xb-Icon>
    <Xb-Icon type="card"></Xb-Icon>
    <Xb-Icon type="sphome"></Xb-Icon>
    <Xb-Icon type="sphome-no"></Xb-Icon>
    <Xb-Icon type="star" theme="filled" color="red" size="50" scale="2"></Xb-Icon>
    <Xb-Icon :type="icontype"></Xb-Icon>-->

    <!-- <xb-light-table
      :data="data"
      :preselect="preselect"
      trigger-type="row"
      :selected-item="selectedItem"
      :disabled-item="disabledItem"
      :row-class-name="rowClassName"
      :height="300"
      @on-selection-change="getSelectedItem"
    >
      <xb-table-column type="selection"></xb-table-column>
      <xb-table-column column-key="name" :label="tempLabel"></xb-table-column>
      <xb-table-column column-key="age" label="年龄" :formatter="formatter"></xb-table-column>
      <xb-table-column
        v-if="showDate"
        column-key="address"
        label="地址"
        show-overflow-tip
        type="link"
      ></xb-table-column>
      <xb-table-column column-key="date" label="生日" align="center" :width="120">
        <template slot-scope="scope">
          <a-Tooltip placement="top" content="Tooltip 文字提示">
            <div
              style="margin-left: 10px;color:red;height:60px;line-height:60px"
            >{{ scope.row.date }}</div>
          </a-Tooltip>
        </template>
      </xb-table-column>
      <template slot="emptyData">
        <div class="table-empty">很抱歉，这里什么都没有</div>
      </template>
    </xb-light-table>-->
    <div style="width:100px;">
      <Xb-Input-number
        v-model="v1"
        :max="10"
        name="he"
        :min="-1"
        :autofocus="autofocus"
        :defaultnumber="4"
      ></Xb-Input-number>
      {{ v1 }}
      <div @click="c">change v1</div>
      <h1>一般测试</h1>
      <Xb-Input-number
        v-model="v2"
        :max="9999"
        :min="0"
        :step="1.2"
        hidestep
        @on-change="changeInput"
      ></Xb-Input-number>
      <h1>一般测试结束</h1>隐藏步数 hidestep：
      <Xb-Input-number v-model="v2" :max="10" name="he" :min="-1" :autofocus="autofocus" hidestep></Xb-Input-number>
      测试undefined v4:{{number.v4}}
      <Xb-Input-number
        v-model="number.v4"
        :max="10"
        :fixed="2"
        name="he"
        :min="0"
        :required="false"
        :autofocus="autofocus"
      ></Xb-Input-number>小数位数：
      <Xb-Input-number
        v-model="v3"
        name="he"
        align="left"
        :autofocus="autofocus"
        :fixed="2"
        :max="10"
        :min="0.01"
      ></Xb-Input-number>可为空：
      <Xb-Input-number
        v-model="v4"
        :max="10"
        name="he"
        :min="-1"
        :autofocus="autofocus"
        :required="false"
      ></Xb-Input-number>默认值：
      <Xb-Input-number
        v-model="v5"
        :max="10"
        name="he"
        :min="-1"
        :defaultnumber="0"
        @input="change2"
      ></Xb-Input-number>
      <xb-input-number
        v-model="v6"
        :max="10"
        name="he"
        :min="-2"
        style="width: 200px"
        hidestep
        :required="false"
        :fixed="5"
      ></xb-input-number>
      <Xb-Input-number
        v-model="v6"
        :max="9999999"
        name="he"
        :min="1"
        :required="false"
        style="width: 170px;margin-right: 6px;"
        hidestep
        :fixed="0"
      ></Xb-Input-number>
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue } from 'vue-property-decorator';
import XbFilter from './../components/filter/Filter.vue';
import XbIcon from './../components/icon/XBIcon';
import XbSelectTable from './../components/selecttable/select.vue';
import XbLightTable from './../components/lighttable/table.vue';
import XbInputNumber from './../components/inputnumber/input-number';
import xbTableColumn from './../components/lighttable/table-column';
import { FilterOption } from '@xb/xbui';
import { studentListFilterData } from './filterdata';

@Component({
  name: 'Demo',
  components: {
    xbFilter: XbFilter,
    XbIcon,
    XbLightTable,
    xbTableColumn,
    XbSelectTable,
    XbInputNumber,
    // xbButton: Button,
  },
})
export default class Demo extends Vue {
  value: any[] = [];
  time2: string = '';
  icontype: string = 'tag-class';

  isShowModal = false;
  selectData = [];
  tempLabel = '不能拥有姓名';
  data: any[] = [];
  showDate = true;
  data1 = [];
  filterdata: any[] = studentListFilterData;
  pkey = ['id', 'id2'];
  loading: boolean = false;
  selectedItem: any[] = [{ id: 1, name: 'hh' }];
  disabledItem: any[] = [{ id: 2 }, { id: 5 }];
  firstParam: any = {
    classTimeType: [1],
    classtime: [1, 2],
  };
  v1: number = 1;
  v2: number | null = 0;
  v3: number = 2.2;
  v4: any = null;
  number: any = {
    v4: undefined,
  };
  v5: any = '';
  v6: any = '';
  autofocus: boolean = true;
  visible: boolean = false;

  filterdata2: any[] = [
    {
      label: '年龄',
      key: 'age',
      type: 'selectrange',
      filter: false,
      remote: false,
      priority: 1,
      remoteUrl: '',
      mutiple: true,
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
  // filterdata: FilterOption[] = [];
  first: any = {
    mTime: [moment('2020-01-01 10:10:10'), moment('2020-01-02 10:10:10')],
    sTime2: [moment('2019-11-11 11:11:11'), moment('2020-11-11 11:11:11')],
    age: [1, 2],
    Dateee: [{ label: '空', value: 0 }],
  };
  freeze: any = {};

  c() {
    this.v1 = 5;
  }
  change2() {
    // debugger
    if (this.v5 === 0) {
      this.v5 = 1;
    }
  }
  changeInput(val: any) {
    console.log(val);
    if (val > 9) {
      this.v2 = 0;
    }
  }
  errorHandle() {
    this.visible = true;
    setTimeout(() => {
      this.visible = false;
    }, 1000);
  }

  getSelectedItem(data: any) {
    this.selectData = data;
  }

  rowClassName(row: any, index: any) {
    if (index === 1) {
      return 'demo-table-info-row';
    } else if (index === 3) {
      return 'demo-table-error-row';
    }
    return '';
  }
  Log(msg: string) {
    console.log(msg, this.v1);
  }
  preselect(row: any, tag: boolean) {
    console.log(row);
    if (this.selectedItem.length >= 3 && tag) {
      console.log('不可选');
      return false;
    }
    return true;
  }
  formatter(data: any) {
    return data.row.age.toFixed(2);
  }
  created() {
    this.getFilterData();
    setTimeout(() => {
      this.filterdata.splice(3, 0, {
        label: '学管师',
        key: 'educationConsultantHrdocIds',
        type: 'select',
        filter: true,
        remote: true,
        priority: 1,
        remoteUrl: '/api2/Org/GetEducationConsultantHrdocList',
        labelKey: 'educationConsultantHrdocName',
        valueKey: 'educationConsultantHrdocId',
        mutiple: true,
        father: '',
        son: '',
        list: [],
        baselist: [{ educationConsultantHrdocName: '空', educationConsultantHrdocId: 0 }],
      });
    }, 3000);
    this.fetchData();
  }
  handleClick() {
    console.log(323232323);
  }
  SelectThis(data: any) {
    console.log(arguments);
    this.selectedItem = data;
    // this.$message.success('H');
  }

  renderHeader(h: any) {
    return h('a-switch', {
      prop: {
        value: 0,
      },
    });
  }
  fetchData() {
    for (let i = 0; i < 50; i++) {
      this.data.push({
        id: i,
        id2: i,
        name: 'Jon Snow' + i,
        age: 26,
        address: 'Ottawa No. 2 Lake Park aefuyguwe fhgruh换个方式多久发货哈艰苦奋斗该回访的科技股份昂',
        date: '2016-10-04',
      });
    }
  }
  changeFilter(data: any) {
    console.log(data);
  }
  handleError(err: any) {
    console.log(err);
  }
  async getFilterData() {
    // var config = {
    //   labelKey: 'Name',
    //   valueKey: 'Id'
    // }
    // let localdata = [
    //   {
    //     label: "日期时间",
    //     key: "sTime2",
    //     type: "daterangetime",
    //     filter: false,
    //     remote: false,
    //     priority: 1,
    //     remoteUrl: "",
    //     mutiple: true,
    //     options: {
    //       shortcuts: {
    //         今天: [moment(), moment()],
    //         这个月: [moment(), moment().endOf("month")]
    //       },
    //       disabledDate(current) {
    //         return current && current < moment().endOf("day");
    //       }
    //     },
    //     format: "YYYY-MM-DD HH:mm",
    //     father: "",
    //     son: ""
    //   },

    //     mutiple: true,
    //     father: "",
    //     son: ""
    //   }
    // ];
    let localdata: FilterOption[] = [
      {
        label: '时间',
        key: 'sTime',
        type: 'daterange',
        filter: false,
        remote: false,
        priority: 1,
        remoteUrl: '',
        options: {
          // shortcuts: {
          //   今天: [moment(), moment()],
          // },
          shortcuts: [
            {
              text: '当月',
              value() {
                let lastday = moment()
                  .set('date', 1)
                  .add(1, 'month')
                  .add(-1, 'day');
                // .format('YYYY-MM-DD');
                return [
                  moment().set('date', 1),
                  // .format('YYYY-MM-DD'),
                  lastday,
                ];
              },
            },
          ],
          // disabledDate(current: any) {
          //   return current && current < moment().endOf('day');
          // },
        },
      },
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
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
          { label: '孙子啊', value: 1 },
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

      {
        label: '年龄',
        key: 'age',
        type: 'selectrange',
        filter: false,
        remote: false,
        priority: 1,
        remoteUrl: '',
        mutiple: true,
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
      {
        label: '日期测试',
        key: 'mTime',
        type: 'daterange',
        filter: false,
        remote: false,
        priority: 1,
        remoteUrl: '',
        mutiple: true,
        options: {
          shortcuts: [
            {
              text: '今天',
              value() {
                return [new Date(), new Date()];
              },
            },
            {
              text: '昨天',
              value() {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                return [date, date];
              },
            },
            {
              text: '本周',
              value() {
                const date = new Date();
                const date2 = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                return [date, date2];
              },
            },
          ],
        },
        maxSpan: 1,
        unit: 'month',
        father: '',
        son: '',
      },
      // {
      //   label: '时间',
      //   key: 'sTime',
      //   type: 'date',
      //   filter: false,
      //   remote: false,
      //   priority: 1,
      //   remoteUrl: '',
      //   mutiple: true,
      //   maxSpan: 7,
      //   father: '',
      //   son: '',
      // },
      // {
      //   label: '时间',
      //   key: 'date5',
      //   type: 'daterange',
      //   filter: false,
      //   remote: false,
      //   priority: 2,
      //   remoteUrl: '',
      //   mutiple: true,
      //   maxSpan: 7,
      //   father: '',
      //   son: '',
      // },
      // {
      //   label: '时间',
      //   key: 'date6',
      //   type: 'daterange',
      //   filter: false,
      //   remote: false,
      //   priority: 2,
      //   remoteUrl: '',
      //   mutiple: true,
      //   maxSpan: 7,
      //   father: '',
      //   son: '',
      // },
      // {
      //   label: '时间',
      //   key: 'date7',
      //   type: 'daterange',
      //   filter: false,
      //   remote: false,
      //   priority: 2,
      //   remoteUrl: '',
      //   mutiple: true,
      //   maxSpan: 7,
      //   father: '',
      //   son: '',
      // },
      {
        label: '收费模式',
        key: 'feemode',
        type: 'select',
        filter: false,
        remote: false,
        priority: 1,
        remoteUrl: '',
        mutiple: false,
        maxSpan: 7,
        father: '',
        son: 'classtime',
        list: [
          { label: '按期', value: 1, son: 'classtime' },
          { label: '按课时', value: 2, son: 'classtime' },
          { label: '按时间', value: 3, son: 'time' },
        ],
      },
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
        father: 'feemode',
        unit: '元',
        son: '',
        list: [],
      },
      // {
      //   label: '剩余情况2',
      //   key: 'time2',
      //   type: 'daterange',
      //   filter: false,
      //   remote: false,
      //   priority: 1,
      //   remoteUrl: '',
      //   mutiple: false,
      //   father: 'classtime',
      //   son: '',
      //   list: [],
      // },
      // {
      //   label: '剩余情况',
      //   key: 'time',
      //   type: 'daterange',
      //   filter: false,
      //   remote: false,
      //   priority: 1,
      //   remoteUrl: '',
      //   mutiple: false,
      //   father: 'feemode',
      //   son: '',
      //   list: [],
      // },
      // {
      //   label: '测试远程',
      //   key: 'school',
      //   type: 'select',
      //   filter: true,
      //   remote: true,
      //   priority: 1,
      //   // apitype:'get',  //支持get请求
      //   remoteUrl: 'https://easymock.schoolpal.cn/mock/5b8f4d4bd0ea220edcda4ef7/spuitest/getsondata',
      //   extraparam: {
      //     entity: 'info',
      //     name: '测试啊',
      //   },
      //   mutiple: true,
      //   father: '',
      //   son: '',
      //   baselist: [{ label: '空', value: 0 }],
      //   list: [],
      // },
      // {
      //   label: '课程',
      //   key: 'lesson',

      //   type: 'select',
      //   filter: true,
      //   remote: true,
      //   priority: 2,
      //   remoteUrl: 'https://easymock.schoolpal.cn/mock/5b8f4d4bd0ea220edcda4ef7/spuitest/getsondata',

      //   mutiple: true,
      //   father: 'school',
      //   son: '',
      //   list: [],
      // },
    ];

    // var url = 'https://easymock.schoolpal.cn/mock/5b8f4d4bd0ea220edcda4ef7/spuitest/filterdata';

    // var data = await axios.get(url);
    // this.filterdata = data.data.data;

    this.filterdata = localdata;
    // this.filterdata = this.filterdata.concat(localdata);
    // this.filterdata = this.filterdata.concat(localdata);
    // this.filterdata = this.filterdata.concat(localdata);
  }
}
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
  img {
    display: none;
  }
}
</style>
