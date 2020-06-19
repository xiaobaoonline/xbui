import Button from './Button.vue';

(Button as any).install = vue => {
  vue.component(name, Button);
};

export default Button;
