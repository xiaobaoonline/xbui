<template>
  <div id="app">
    <a-layout id="playground">
      <a-layout-sider :trigger="null" collapsible v-model="collapsed">
        <div class="logo" />
        <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
          <a-menu-item key="1">
            <router-link to="/">
              <a-icon type="user" />
              Home
            </router-link>
          </a-menu-item>
          <a-menu-item key="2">
            <router-link to="/filter">
              <a-icon type="video-camera" />
              Filter
            </router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/table">
              <a-icon type="video-camera" />
              Table
            </router-link>
          </a-menu-item>
        </a-menu>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <a-icon
            class="trigger"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="() => (collapsed = !collapsed)"
          />
        </a-layout-header>
        <a-layout-content
          :style="{ borderTop: '1px solid #ece4e4', padding: '24px', background: '#fff', minHeight: '280px' }"
        >
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class Home extends Vue {
  collapsed: boolean = false
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#playground {
  height: 100vh;
}
</style>
