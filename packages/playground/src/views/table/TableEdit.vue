<template>
  <div>
    <a-layout>
      <a-layout-content>
        <TableInfo
          style="height:50%;"
          :data="data"
          :columns="columns"
          :loading="loading"
          :pagination="pagination"
          @clickcol="handleCol"
        ></TableInfo>
        <Footer>
          <div id="container"></div>
        </Footer>
      </a-layout-content>
      <a-layout-sider theme="light" class="layoutsider" width="300px">
        <div class="tableinfo">
          <h2>列表设置</h2>
          <div class="item">分页设置：</div>
          <div class="item">RowKey设置：</div>
        </div>
        <a-divider />
        <div class="colinfo">
          <h2>列设置</h2>
          <div class="item">
            列表Key:
            <a-input v-model="currentCol.dataIndex" class="iteminput"></a-input>
          </div>
          <div class="item">
            列表Title:
            <a-input v-model="currentCol.title" class="iteminput"></a-input>
          </div>
          <div class="item">
            <a-button @click="addCol">新增列</a-button>
            <a-button @click="save">保存</a-button>
          </div>
        </div>
        <a-divider />
        <div class="datainfo">
          <h2>数据设置</h2>
          <div class="item">
            <a-button @click="addData">新增数据</a-button>
          </div>
        </div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>
<script lang="ts">
import TableInfo from './Tableinfo.vue'
// import * as monaco from 'monaco-editor'
import { Component, Vue } from 'vue-property-decorator'

interface TableColumn {
  id: number
  title: string
  dataIndex: string
  key: string
  sorter?: boolean
  width?: string | number
}

@Component({
  components: {
    TableInfo,
  },
})
export default class TableEdit extends Vue {
  data: any[] = []

  columns: TableColumn[] = [
    { title: '测试一列', dataIndex: 'one', key: 'one', id: 1 },
    { title: '测试二列', dataIndex: 'two', key: 'two', id: 2 },
  ]

  loading: boolean = false

  pagination: object = {}

  monacoEditor: any
  newcolname: string = ''
  newtitlename: string = ''
  value: string = ''

  currentCol: any = {
    dataIndex: '',
    title: '',
    key: '',
    id: 0,
  }

  mounted() {
    // const target = document.getElementById('container') as any
    // this.monacoEditor = monaco.editor.create(target, {
    //   value: ['function x() {', '\tconsole.log("Hello world!");', '}'].join(
    //     '\n'
    //   ),
    //   language: 'typescript'
    // })
  }

  get dataCol() {
    const obj: string[] = []
    this.columns.forEach((col: TableColumn) => {
      obj.push(col.dataIndex)
    })
    return obj
  }

  handleCol(key: string) {
    this.currentCol = this.columns.filter((item: TableColumn) => item.key === key)[0]
  }

  getNewData() {
    const obj: any = {}
    this.dataCol.forEach((item: any) => {
      obj[item] = 1
    })
    obj.key = Number((Math.random() + '').replace(/\D/g, ''))
    return obj
  }

  save() {
    if (this.currentCol.id) {
      // this.columns.map((item: TableColumn) => {
      //   if (item.id === this.currentCol.id) {
      //     item.dataIndex = this.currentCol.dataIndex
      //     item.title = this.currentCol.title
      //   }
      // })
    } else {
      this.columns.push({
        dataIndex: this.currentCol.dataIndex,
        key: this.currentCol.dataIndex,
        title: this.currentCol.title,
        id: Number((Math.random() + '').replace(/\D/g, '')),
      })
    }
    this.currentCol = this.columns[this.columns.length - 1]
  }
  addCol() {
    this.currentCol = {
      dataIndex: '',
      title: '',
    }
  }

  addData() {
    this.data.push(this.getNewData())
  }
}
</script>
<style>
#container {
  width: 800px;
  height: 300px;
  text-align: left;
  border: 1px solid #ccc;
}
.item {
  margin: 10px;
}
.iteminput {
  width: 200px;
}
</style>
