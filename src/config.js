const BREAK_TIME = 300 // 秒
const MAX_TOMATO_TIME = 25 // 分钟
const WORKDAYS = [1, 2, 3, 4, 5] // [1（星期一）,..., 7（星期日）];
const WORKING_TIME_RANGE = [10, 19] // [起始时间（几点），结束时间（几点）]
const BREAKFAST_TIME_RAGE = [0, 0] // [起始时间（几点），结束时间（几点）]; [0, 0]表示没有早餐时间
const LUNCH_TIME_RANGE = [12, 14] // [起始时间（几点），结束时间（几点）]; [0, 0]表示没有午休时间
const DINNER_TIME_RANGE = [18, 19] // [起始时间（几点），结束时间（几点）]; [0, 0]表示没有晚餐时间

module.exports = {
    BREAK_TIME,
    MAX_TOMATO_TIME,
    WORKDAYS,
    WORKING_TIME_RANGE,
    BREAKFAST_TIME_RAGE,
    LUNCH_TIME_RANGE,
    DINNER_TIME_RANGE
}
