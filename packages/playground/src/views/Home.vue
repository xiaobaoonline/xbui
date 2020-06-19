<template>
  <div class="home">
    <h1>业务组件库</h1>
    <Xb-Icon type="tag-balance" scale="5"></Xb-Icon>
    <Xb-Icon type="tag-balance"></Xb-Icon>
    <Xb-Icon type="tag-waitpos"></Xb-Icon>
    <Xb-Icon type="tag-notoption"></Xb-Icon>
    <Xb-Icon type="tag-hook"></Xb-Icon>
    <Xb-Icon type="tag-sit"></Xb-Icon>
    <Xb-Icon type="cake"></Xb-Icon>
    <Xb-Icon type="card"></Xb-Icon>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { XbIcon, XbInputNumber } from '@xb/xbui'
@Component({
  components: { XbIcon, XbInputNumber },
})
export default class Home extends Vue {
  v6: any = ''
}
</script>
