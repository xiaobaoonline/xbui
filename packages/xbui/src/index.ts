// import Button from './components/button';
import XbFilter from './components/filter';
import XbGuidePop from './components/guidepop';
import XbIcon from './components/icon';
import XbInputNumber from './components/inputnumber';
import XbLightTable, { XbTableColumn } from './components/lighttable';
import XbSelectTable from './components/selecttable';
import XbTable from './components/table';

const install = function(Vue: any, axiosService: any) {
  Vue.component('xb-filter', XbFilter);
  Vue.component('xb-icon', XbIcon);
  Vue.component('xb-light-table', XbLightTable);
  Vue.component('xb-table-column', XbTableColumn);
  Vue.component('xb-select-table', XbSelectTable);
  Vue.component('xb-input-number', XbInputNumber);
  Vue.component('xb-table', XbTable);
  Vue.component('xb-guide-pop', XbGuidePop);
  // Vue.component('xbbutton', Button);
  Vue.prototype.$axiosServices = axiosService;
};

// export default Filter;
const xbui = {
  XbFilter,
  XbIcon,
  XbSelectTable,
  XbLightTable,
  XbTableColumn,
  XbTable,
  XbGuidePop,
  XbInputNumber,
  install,
};
export default xbui;
export { XbFilter, XbIcon, XbLightTable, XbTableColumn, XbSelectTable, XbInputNumber, install };
