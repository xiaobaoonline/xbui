<template>
  <div>
    <a-layout>
      <a-layout-content>
        <FilterInfo style="height:50%;" :data="data" @clickcol="handleCol"></FilterInfo>
        <Footer>
          <div id="container"></div>
        </Footer>
      </a-layout-content>
      <a-layout-sider theme="light" class="layoutsider" width="300px">
        <div class="tableinfo">
          <h2>筛选组件设置</h2>
        </div>
        <a-divider />
        <div class="colinfo">
          <h2>筛选项设置</h2>
          <div>
            <PropEdit :base="currentCol" ref="propedit" />
          </div>
          <div class="item">
            <a-button @click="addCol">新增筛选项</a-button>
            <a-button @click="save">保存</a-button>
          </div>
        </div>
      </a-layout-sider>
    </a-layout>
  </div>
</template>
<script lang="ts">
import FilterInfo from './FilterInfo.vue'
import { FilterOption } from '@xb/xbui'
// import * as monaco from 'monaco-editor'
import { Component, Vue } from 'vue-property-decorator'
import PropEdit from './PropEdit.vue'

@Component({
  components: {
    FilterInfo,
    PropEdit,
  },
})
export default class FilterEdit extends Vue {
  $refs!: {
    propedit: any
  }
  data: FilterOption[] = []

  monacoEditor: any
  newcolname: string = ''
  newtitlename: string = ''
  value: string = ''
  // TS全局类型包引入
  // tsconfig.json typeRoots 额外配置

  currentCol: FilterOption = {
    key: '',
    label: '',
    labelKey: 'lable',
    valueKey: 'value',
    type: 'select',
    priority: 1,
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

  handleCol(key: string) {
    // TODO
  }

  save() {
    // TODO
    let data = this.$refs.propedit.getPropData()
    this.data.push(data)
  }
  addCol() {
    this.currentCol = {
      key: 'test',
      label: '测试',
      labelKey: 'lable',
      valueKey: 'value',
      type: 'select',
      priority: 1,
      list: [],
    }
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
.colinfo .ant-divider-horizontal {
  margin: 10px 0;
}
</style>
