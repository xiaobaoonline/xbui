<template>
  <div class="previewbox">
    <a-table
      ref="table"
      :columns="columns"
      :dataSource="data"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    ></a-table>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class TableInfo extends Vue {
  $refs!: {
    table: any
  }
  /** 列表数据 */
  @Prop({
    default: () => {
      return []
    },
  })
  data!: any[]

  /** 分页数据 */
  @Prop({})
  pagination!: object

  /** 加载状态 */
  @Prop({ default: false, type: Boolean })
  loading!: boolean

  /** 列数据 */
  @Prop({
    default: () => {
      return []
    },
  })
  columns!: any[]

  handleTableChange(val: any) {
    console.log(val)
  }

  getKey(el: any) {
    return el.getAttribute('key')
  }

  mounted() {
    const el = this.$refs.table.$el
    el.addEventListener('click', (e: any) => {
      let current = e.target
      let target = null

      while (current !== el && !target) {
        if (this.getKey(current)) {
          target = current
        } else {
          current = current.parentNode
        }
      }
      if (target) {
        this.$emit('clickcol', this.getKey(target))
      }
    })
  }
}
</script>
<style lang="less"></style>
