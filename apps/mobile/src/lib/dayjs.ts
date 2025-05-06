import _dayjs from "dayjs";
import "dayjs/locale/vi";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

_dayjs.locale("vi");
_dayjs.extend(isoWeek);
_dayjs.extend(isSameOrAfter);
_dayjs.extend(isSameOrBefore);

export const dayjs = _dayjs;
