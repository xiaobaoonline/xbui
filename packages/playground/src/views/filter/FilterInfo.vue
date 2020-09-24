<template>
  <div class="previewbox">
    <xbfilter v-if="data.length" :filterdata="data"></xbfilter>
    <div v-else>暂无筛选配置数据</div>
  </div>
</template>
<script lang="ts">
// tslint:disable-next-line:no-var-requires
require('@xiaobaoonline/xbui/dist/style.css')
import Xbui, { XbFilter, FilterOption } from '@xiaobaoonline/xbui'
import { Component, Prop, Vue } from 'vue-property-decorator'
// Vue.use(Xbui)
@Component({
  components: {
    xbfilter: XbFilter,
  },
})
export default class FilterInfo extends Vue {
  @Prop({})
  data!: FilterOption[]
  created() {
    console.log(Xbui)
  }
}
</script>
<style lang="less"></style>
