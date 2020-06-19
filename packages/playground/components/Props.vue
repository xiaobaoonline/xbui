<template>
  <ul>
    <li v-for="prop in propsArr" :key="prop.name">
      {{ prop.name }}:
      <div v-if="prop.type === 'String'">
        <input v-if="!prop.text" v-model="propsObj[prop.name]" @change="Change(prop)" />
        <select v-else v-model="propsObj[prop.name]" @change="Change(prop)">
          <option v-for="(item, index) in prop.text" :key="index" :value="item">{{ item }}</option>
        </select>
      </div>
      <div v-else-if="prop.type === 'Boolean'" @click="Change(prop)">
        <button @click="propsObj[prop.name] = true">True</button>
        <button @click="propsObj[prop.name] = false">False</button>
      </div>
      <div v-else>
        <input v-model="propsObj[prop.name]" @change="Change(prop)" />
      </div>
      <div v-if="testtag">校验失败</div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    propsArr: {
      type: Array,
      default() {
        return [];
      }
    },
    propsObj: {
      type: Object,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      testtag: false
    };
  },
  methods: {
    Change(prop) {
      if (prop.validator && !prop.validator(this.propsObj[prop.name])) {
        this.testtag = true;
        return;
      }
      this.testtag = false;
      this.$emit("click");
    }
  }
};
</script>

<style></style>
