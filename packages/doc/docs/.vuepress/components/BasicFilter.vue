<template>
  <div class="basic">
    <xb-filter :filterdata="filterdata" :first="first" @on-filter-change="changeFilter"></xb-filter>
  </div>
</template>

<script >
import Vue from 'vue'
import AntD from 'ant-design-vue/dist/antd-with-locales'
import 'ant-design-vue/dist/antd.css'
Vue.use(AntD)

import Xbui from '@xb/xbui'
import moment from 'moment'
require('@xb/xbui/dist/style.css')
export default {
  components: {
    'xb-filter': Xbui.Filter,
  },
  data() {
    return {
      first: {
        mode: [1],
        age: [1, 3],
        classtime: [1, 3],
        date: [moment('2020-02-02')],
        datetime: [moment('2020-02-02 20:20:20')],
        daterange: [moment('2020-02-02'), moment('2020-02-20')],
        daterangetime: [moment('2020-02-02 20:20:20'), moment('2020-02-20 20:20:20')],
      },
      filterdata: [
        {
          label: '简单下拉选择',
          key: 'mode',
          type: 'select',
          filter: false,
          remote: false,
          priority: 1,
          remoteUrl: '',
          mutiple: true,
          father: '',
          baselist: [{ label: '空', value: 0 }],
          son: '',
          list: [
            { label: '按期', value: 1 },
            { label: '按课时', value: 2 },
          ],
        },
        {
          label: '下拉范围-年龄',
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
          label: '数字输入-剩余情况',
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
          unit: '课时',
          son: '',
          list: [],
        },
        {
          label: '日期',
          key: 'date',
          type: 'date',
          priority: 1,
        },
        {
          label: '日期时间',
          key: 'datetime',
          type: 'datetime',
          format: 'YYYY-MM-DD HH:mm:ss',
          priority: 1,
        },
        {
          label: '日期范围',
          key: 'daterange',
          type: 'daterange',
          priority: 1,
        },
        {
          label: '日期时间范围',
          key: 'daterangetime',
          type: 'daterangetime',
          format: 'YYYY-MM-DD HH:mm:ss',
          priority: 1,
        },
      ],
    }
  },
  methods: {
    changeFilter(data) {
      console.log(data)
    },
  },
}
</script>

