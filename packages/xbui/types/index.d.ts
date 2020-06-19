import { FilterItem, FilterOption, XbFilter } from './filter';
import { XbGuidePop } from './guidepop';
import { XbIcon } from './icon';
import { XbInputNumber } from './inputnumber';
import { XbLightTable, XbTableColumn } from './lighttable';
import { XbSelectTable } from './selecttable';
import { XbTable } from './table';
declare const Xbui: {
    XbFilter: typeof XbFilter;
    XbIcon: typeof XbIcon;
    XbLightTable: typeof XbLightTable;
    XbSelectTable: typeof XbSelectTable;
    XbTableColumn: typeof XbTableColumn;
    XbInputNumber: typeof XbInputNumber;
    XbTable: typeof XbTable;
    XbGuidePop: typeof XbGuidePop;
};
export { XbFilter, FilterOption, FilterItem, XbIcon, XbLightTable, XbSelectTable, XbTableColumn, XbInputNumber, XbTable, XbGuidePop, };
export default Xbui;
