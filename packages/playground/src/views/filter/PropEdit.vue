<template>
  <div>
    <div name="1231231" v-for="item in baseitem" :key="item.key" v-show="checkIfShow(item)" class="filterpropitem">
      <a-tooltip placement="topLeft">
        <template slot="title">
          <span>{{ item.desc }}</span>
        </template>
        <span class="filterproplabel">{{ item.key }}:</span>
      </a-tooltip>
      <template v-if="item.type == 'input'">
        <a-input v-model="item.default" class="iteminput"></a-input>
      </template>
      <template v-else-if="item.type == 'select'">
        <a-select v-model="item.default" class="iteminput">
          <a-select-option v-for="(d, i) in item.data" :key="i" :value="d">{{ d }}</a-select-option>
        </a-select>
      </template>
      <template v-else-if="item.type == 'switch'">
        <a-switch v-model="item.default"></a-switch>
      </template>
      <template v-else-if="item.type == 'numberinput'">
        <a-input-number v-model="item.default" class="iteminput" />
      </template>
      <template v-else-if="item.type == 'numberrange'">
        <a-input-number v-model="item.default[0]" class="iteminput" />
        <a-input-number v-model="item.default[1]" class="iteminput" />
      </template>
      <template v-else-if="item.type == 'inputgroup'">
        <a-input v-model="item.default" class="iteminput"></a-input>
      </template>
      <template v-else>无匹配类型</template>
    </div>
    <a-divider />
    <div v-for="item in filterItems" :key="item.key" v-show="checkIfShow(item)" class="filterpropitem">
      <a-tooltip placement="topLeft">
        <template slot="title">
          <span>{{ item.desc }}</span>
        </template>
        <span class="filterproplabel">{{ item.key }}:</span>
      </a-tooltip>
      <template v-if="item.type == 'input'">
        <a-input v-model="item.default" class="iteminput"></a-input>
      </template>
      <template v-else-if="item.type == 'select'">
        <a-select v-model="item.default" class="iteminput">
          <a-select-option v-for="(d, i) in item.data" :key="i" :value="d">{{ d }}</a-select-option>
        </a-select>
      </template>
      <template v-else-if="item.type == 'switch'">
        <a-switch v-model="item.default"></a-switch>
      </template>
      <template v-else-if="item.type == 'numberinput'">
        <a-input-number v-model="item.default" class="iteminput" />
      </template>
      <template v-else-if="item.type == 'numberrange'">
        <a-input-number v-model="item.default[0]" class="iteminput" />
        <a-input-number v-model="item.default[1]" class="iteminput" />
      </template>
      <template v-else-if="item.type == 'inputgroup'">
        <a-input v-model="item.default" class="iteminput"></a-input>
      </template>
      <template v-else>无匹配类型</template>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { FilterOption } from '@xb/xbui'
import { FinterOptionConfig, getBaseFilterConfig, getFilterConfig } from './Model'

@Component({})
export default class PropEdit extends Vue {
  @Prop({})
  base!: FilterOption

  filterItems: FinterOptionConfig[] = getFilterConfig()
  baseitem: FinterOptionConfig[] = getBaseFilterConfig()

  @Watch('base', { deep: true })
  handleBaseChange(val: FilterOption) {
    this.filterItems.map(item => {
      item.default = val[item.key] || item.default
    })
    this.baseitem.map(item => {
      item.default = val[item.key] || item.default
    })
  }

  checkIfShow(data: FinterOptionConfig) {
    if (!data.linkattr) {
      return true
    } else {
      const key = data.linkattr.key
      const check = data.linkattr.value
      let target = this.baseitem.filter((item: FinterOptionConfig) => {
        return item.key === key
      })
      if (target.length) {
        if (Array.isArray(check)) {
          return check.indexOf(target[0].default) > -1
        } else {
          return check === target[0].default
        }
      }
      target = this.filterItems.filter((item: FinterOptionConfig) => {
        return item.key === key
      })
      if (target.length) {
        if (Array.isArray(check)) {
          return check.indexOf(target[0].default) > -1
        } else {
          return check === target[0].default
        }
      }
    }
  }

  getPropData() {
    const obj: Indexer<any> = {}

    this.baseitem.map((item: FinterOptionConfig) => {
      if (this.checkIfShow(item)) {
        obj[item.key] = item.default
      }
    })
    this.filterItems.map((item: FinterOptionConfig) => {
      if (this.checkIfShow(item)) {
        obj[item.key] = item.default
      }
    })
    console.log(obj)
    return obj
  }
}
</script>
<style lang="less">
.filterpropitem {
  padding: 10px;
}
.filterproplabel {
  display: inline-block;
  width: 60px;
}
</style>
