<template>
  <div v-clickoutside="handleClickout">
    <Xb-hoverlist
      v-show="item.display && checkIfShow(item, parentdata)"
      trigger="click"
      custom-class="xbf-filterdrop"
      placement="bottom"
      :top="0"
      :show="item.show"
      :disabled="ifdisabled(item, parentdata)"
      :duration="3"
      :item-obj="itemObj"
    >
      <div slot="poper">
        <div v-if="item.filter" class="xbf-searchbox">
          <a-input v-model="search" @change="handleSearch" @enter="handleSearch">
            <template name="prefix">
              <a-Icon type="link" />
            </template>
          </a-input>
        </div>
        <div class="xbf-filterscrollbox" @scroll="handleBodyScroll">
          <div v-if="searchtag" class="xbf-itembox">
            <div
              v-for="(fi, i) in searchlist"
              :key="i"
              :class="['xbf-filteritem', ifselected(item, fi) ? 'xbf-item-selected' : '']"
              @click="handleThis(item, fi)"
            >
              <filteritem :item="item" :data="fi" :label-key="labelKey" />
              <a-icon v-if="ifselected(item, fi)" type="check" class="xbf-selectedicon" />
            </div>
            <div v-show="!searchlist.length" class="xbf-nodataitem">暂无搜索结果</div>
          </div>
          <div v-else class="xbf-itembox xbf-item-selected-multiple">
            <template v-if="!search">
              <div
                v-for="(fi, i) in baseList"
                :key="'base' + i"
                :class="['xbf-filteritem', ifselected(item, fi) ? 'xbf-item-selected' : '']"
                @click="handleThis(item, fi)"
              >
                <filteritem :item="item" :data="fi" :label-key="labelKey" />
                <a-icon v-if="ifselected(item, fi)" type="check" class="xbf-selectedicon" />
              </div>
            </template>
            <div
              v-for="(fi, i) in item.list"
              :key="i"
              :class="['xbf-filteritem', ifselected(item, fi) ? 'xbf-item-selected' : '']"
              @click="handleThis(item, fi)"
            >
              <filteritem :item="item" :data="fi" :label-key="labelKey" />
              <a-icon v-if="ifselected(item, fi)" type="check" class="xbf-selectedicon" />
            </div>
            <div v-show="!item.list.length" class="xbf-nodataitem">无结果</div>
          </div>
        </div>
        <div v-if="isShowClear" class="xbf-linktext xbf-chart-clearbox" @click="clearSelect">清空重置</div>
      </div>
      <div slot="hover">
        <span
          :class="['xbf-filtertitle', ifdisabled(item, parentdata) ? 'disabled' : '']"
          type="text"
          @click="handleClick(item)"
        >
          {{ item.label }}
          <a-Icon
            type="caret-down"
            :class="{'xbui-ani-down':true,'xbui-ani-up':item.show}"
            @click.stop="handleClick(item)"
          />
          <a-Icon v-if="item.son" type="link" class="xbf-lintdash" />
          <span v-else class="xbf-splitdash">|</span>
        </span>
      </div>
    </Xb-hoverlist>
  </div>
</template>

<script lang="ts">
import clickoutside from './../../../directives/clickoutside';
import { Component, Prop } from 'vue-property-decorator';
import { throttle, debounce } from './../../../utils/utils';
import Meta from './../utils/mixins';
import filteritem from './filteritem';
import XbHoverlist from './xbhoverlist.vue';
@Component({
  name: 'Droplist',
  components: {
    filteritem,
    XbHoverlist,
  },
  mixins: [Meta],
  directives: { clickoutside },
})
export default class Droplist extends Meta {
  $parent: any;
  @Prop({
    default() {
      return {};
    },
  })
  dropdata!: any;
  @Prop({
    default: false,
  })
  isShowClear!: boolean;

  // props: {
  //   dropdata: {
  //     type: Object,
  //     default: () => {
  //       return {};
  //     },
  //   },
  //   isShowClear: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },

  search: string = '';
  searchtag: boolean = false; //搜索状态
  totalCount: number = 0; //下拉数据总数量 远程搜索时使用
  pageIndex: number = 1;
  handleSearch: any = () => {};
  searchlist: any[] = []; //本地搜索列表
  itemObj: any = {};
  get item() {
    return this.dropdata;
  }
  get labelKey() {
    return this.dropdata.labelKey || 'label';
  }
  get valueKey() {
    return this.dropdata.valueKey || 'value';
  }
  get parentSlot() {
    return this.$parent.$scopedSlots[this.item.key];
  }
  get baseList() {
    return this.dropdata.baselist || [];
  }
  created() {
    this.handleSearch = debounce(throttle(this.onSearch, 50), 300);
  }
  handleClickout() {
    this.dropdata.show = false;
  }
  getHeight(item: any) {
    let height = item.list.length * 40;
    if (height == 0) {
      height = 40;
    } else if (height > 200) {
      height = 200;
    }
    return height;
  }
  ifselected(item: any, fi: any) {
    let key = typeof fi === 'object' ? fi[this.valueKey] : fi;
    return this.item.selectedObj[key] == true;
  }
  handleThis(item: any, fi: any) {
    this.itemObj = { key: item.key, label: item.label };
    this.$parent.handleThis(item, fi);
  }
  clearSelect() {
    this.$parent.uimodel.school.selectedArr = [];
    this.$parent.uimodel.school.selectedObj = {};
    this.$parent.setpackParam();
  }
  /** 处理搜索 */
  onSearch() {
    let { item, search, labelKey } = this;
    // if (!this.search) {
    //     this.searchtag = false;
    //     return;
    // }
    if (!item.remote) {
      // 本地搜索
      this.searchlist = [...item.list];
      this.searchtag = true;
      // 处理本地搜索
      this.searchlist = this.searchlist.filter(itme => {
        return itme[labelKey] !== null && itme[labelKey] !== undefined && itme[labelKey].indexOf(search) > -1;
      });
    } else {
      //远程 带参数搜索
      this.fetchData(item, {
        query: search,
        pageIndex: 1,
        pageSize: 50,
      });
    }
  }
  get handleBodyScroll() {
    return throttle((event: any) => {
      // this.$emit('on-scroll', event);
      let scrollTop = event.target.scrollTop;
      let scrollHeight = event.target.scrollHeight;
      let offsetHeight = event.target.offsetHeight;
      if (scrollTop > scrollHeight - offsetHeight - 10 && this.item.list.length > 0) {
        // this.$emit('on-load-more', event);
        this.handleScroll();
      }
    }, 50);
  }
  /** 处理滚动加载 */
  get handleScroll() {
    return throttle(() => {
      if (this.item.list.length >= this.totalCount) {
        return;
      }
      if (this.item.filter && this.item.remote) {
        this.fetchData(
          this.item,
          {
            query: this.search,
            pageIndex: this.pageIndex + 1,
            pageSize: 50,
          },
          'scroll',
        );
      }
    }, 300);
  }
  /** 远程搜索 */
  fetchData(item: any, param: any, type?: any) {
    item.loading = true;
    let parentparam = {};
    if (item.father) {
      //处理 父子级选中时 子级远程搜索的参数
      parentparam = this.$parent.getFatherparam(item.father);
    }
    // 额外处理远程接口的自定义参数
    Object.assign(param, item.extraparam || {});
    Object.assign(param, parentparam);
    this.$parent.handleRemote(item, param, (res: any) => {
      if (res.status) {
        let data = res.data || res.Data;
        let listData = data.list || data.List || [];
        if (type == 'scroll') {
          //处理分页和 正常搜索
          item.list = item.list.concat(listData);
        } else {
          item.list = listData;
        }
        this.pageIndex = data.currentIndex || data.CurrentIndex;
        this.totalCount = data.totalCount || data.TotalCount;
      }
    });
  }
  /** 第一次点击时请求数据 */
  handleClick(item: any) {
    if (this.ifdisabled(item, this.parentdata)) {
      return;
    }
    // 处理点击  处理远程模式时 首次数据为空的分支
    if (!item.show) {
      if (item.remote && item.list.length == 0) {
        this.fetchData(item, {
          pageIndex: 1,
          pageSize: 50,
        });
      }
    }
    item.show = !item.show;
  }
}
</script>

<style lang="less"></style>
