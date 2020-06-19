<script>
const requireComponent = require.context("", true, /\.vue|.jsx$/);
import Props from "./Props.vue";
import { wrap } from "./events.js";

export default {
  name: "Example",
  components: {
    Props
  },
  props: {
    // 试验组件名
    compobj: {
      type: Object,
      default() {
        return {};
      }
    },
    compname: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      propsArr: [],
      propsObj: {},
      comp: "Test"
    };
  },
  computed: {
    classes() {
      return {
        "right-nav": true
      };
    }
  },
  created() {
    wrap("$emit");
    this.changeProp();
  },
  watch: {
    compname: function() {
      this.changeProp();
    }
  },
  methods: {
    change() {
      this.$forceUpdate();
    },
    changeProp() {
      let Prop =
        requireComponent(this.compobj.file).default ||
        requireComponent(this.compobj.file);
      this.comp = Prop;
      let arr = [];
      this.propsObj = Object.assign({});
      for (let prop in Prop.props) {
        arr.push({
          name: prop,
          text: Prop.props[prop].text,
          type: Prop.props[prop].type.name,
          default: Prop.props[prop].default,
          validator: Prop.props[prop].validator
        });
        this.propsObj[prop] = Prop.props[prop].default;
      }
      this.propsArr = arr;
    }
  },
  render(h) {
    const { $listeners, $slots = {}, $attrs, $scopedSlots } = this;
    let prop = {
      props: {
        propsArr: this.propsArr,
        propsObj: this.propsObj
      },
      class: this.classes,
      on: {
        click: this.change
      }
    };
    let prop2 = {
      props: this.propsObj,
      on: $listeners,
      attrs: $attrs
    };
    return (
      <div>
        <x-layout id="layout-basic">
          <x-layout>
            <x-layout-content>
              <this.comp {...prop2}>测试内容</this.comp>
            </x-layout-content>
            <x-layout-sider>
              <Props {...prop} />
            </x-layout-sider>
          </x-layout>
        </x-layout>
      </div>
    );
  }
};
</script>

<style>
/* .right-nav {
  position: absolute;
  right: 0;
  top: 0;
  width: 100px;
  border-left: 1px solid salmon;
} */
#layout-basic .sp-layout-footer {
  line-height: 1.5;
}
#layout-basic .sp-layout-sider {
  background: #3ba0e9;
  color: #fff;
  line-height: 120px;
}
</style>
