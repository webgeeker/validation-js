
/**
 * 检测并解析整数值
 * @param value value可以是任意数据类型：number, '0x123abc', '123e5'等。不支持8进制(视为10进制)
 * @returns {number} 整数值
 * @throws Error 如果不是整数或者超出整数范围，抛出异常。
 */
export function checkAndParseInt(value) {
  let type = typeof value;
  if (type === 'string') {
    if (!isNaN(value)) { // 是数值
      if (value.indexOf('.') === -1) {// 无小数点。("1.0"不是整数)
        let v;
        if (value.startsWith('0x') || value.startsWith('0X')) {
          v = parseInt(value.substring(2), 16);
        } else {
          v = parseFloat(value); // 没有小数点也可能是浮点数，比如"3e-5"
        }
        if (Number.isInteger(v)) {
          if (v > 2147483647 || v < -2147483648)
            throw new Error(`The value ${v} exceeds the range of integers`);
          return v;
        }
      }
    }
  } else if (type === 'number') {
    if (Number.isInteger(value)) {
      if (value > 2147483647 || value < -2147483648)
        throw new Error(`The value ${value} exceeds the range of integers`);
      return value;
    }
  }
  throw new Error(`${value} is not a integer`)
}

/**
 * 检测并解析长整型值
 * @param value value可以是任意数据类型：number, '0x123abc', '123e5'等。不支持8进制(视为10进制)
 * @returns {number} 整数值
 * @throws Error 如果不是整数或者超出整数范围，抛出异常。
 */
export function checkAndParseLong(value) {
  let type = typeof value;
  if (type === 'string') {
    if (!isNaN(value)) { // 是数值
      if (value.indexOf('.') === -1) {// 无小数点。("1.0"不是整数)
        let v;
        if (value.startsWith('0x') || value.startsWith('0X')) {
          v = parseInt(value.substring(2), 16);
        } else {
          v = parseFloat(value); // 没有小数点也可能是浮点数，比如"3e-5"
        }
        if (Number.isInteger(v))
          return v;
      }
    }
  } else if (type === 'number') {
    if (Number.isInteger(value)) {
      return value;
    }
  }
  throw new Error(`${value} is not a long integer`)
}

export function checkAndParseDate(value) {
  let type = typeof value;
  if (type === 'string') {
    if (/^\d{4}-[0-1]?\d-[0-3]?\d$/.test(value)) {
      let [year, month, day] = value.split('-');
      year = parseInt(year);
      month = parseInt(month);
      day = parseInt(day);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        if (day === 31) {
          if ([2, 4, 6, 9, 11].indexOf(month) >= 0) // 小月没有31号
            throw new Error(`"${value}" is not a valid date`)
        } else if (day === 30) {
          if (month === 2) // 2月没有30号
            throw new Error(`"${value}" is not a valid date`)
        } else if (day === 29 && month === 2) {
          let isLeapYear = false; // 是否是闰年
          // 下面的闰年算法只在公元3200年之前有效
          if (year % 100 > 0) { // 不是100的倍数
            if (year % 4 === 0) // 是4的倍数
              isLeapYear = true; // 是闰年
          } else { // 是100的倍数
            if (year % 400 === 0) // 又是400的倍数
              isLeapYear = true; // 是闰年
          }
          if (!isLeapYear)
            throw new Error(`"${year}" is not a leap year, there is no February 29th`)
        }
        return new Date(year, month - 1, day);
      }
    }
  }
  throw new Error(`"${value}" is not a date string`)
}

export function checkAndParseDateTime(value) {
  let type = typeof value;
  if (type === 'string') {
    if (/^\d{4}-[0-1]?\d-[0-3]?\d \d\d:[0-5]\d:[0-5]\d$/.test(value)) {
      let [date, time] = value.split(' ');
      let [year, month, day] = date.split('-');
      let [hour, minute, second] = time.split(':');
      year = parseInt(year);
      month = parseInt(month);
      day = parseInt(day);
      hour = parseInt(hour);
      minute = parseInt(minute);
      second = parseInt(second);
      if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        if (day === 31) {
          if ([2, 4, 6, 9, 11].indexOf(month) >= 0) // 小月没有31号
            throw new Error(`"${value}" is not a valid datetime`)
        } else if (day === 30) {
          if (month === 2) // 2月没有30号
            throw new Error(`"${value}" is not a valid datetime`)
        } else if (day === 29 && month === 2) {
          let isLeapYear = false; // 是否是闰年
          // 下面的闰年算法只在公元3200年之前有效
          if (year % 100 > 0) { // 不是100的倍数
            if (year % 4 === 0) // 是4的倍数
              isLeapYear = true; // 是闰年
          } else { // 是100的倍数
            if (year % 400 === 0) // 又是400的倍数
              isLeapYear = true; // 是闰年
          }
          if (!isLeapYear)
            throw new Error(`"${year}" is not a leap year, there is no February 29th`)
        }
        if (hour >= 24)
          throw new Error(`"${value}" is not a valid datetime`)
        return new Date(year, month - 1, day, hour, minute, second);
      }
    }
  }
  throw new Error(`"${value}" is not a datetime string`)
}

// 运行环境检测
// chrome浏览器下：
//   1. 不能直接引用global对象，会报错。可以通过"typeof global"来检测global对象，不会报错
//   2. 可以访问this对象，值为undefined
//   3. 可以访问window对象
// node或vitest环境下：
//   1. 可以访问global对象
//   2. 可以访问this对象
//   3. 不能直接引用window对象，会报错。可以通过"typeof window"来检测window对象，不会报错

function isBrowserEnv() {
  return typeof window === 'object';
}

function isNodeEnv() {
  return typeof global === 'object';
}

function isVitestEnv() {
  if (typeof global === 'object') {
    return global.hasOwnProperty('__vitest_environment__');
  }
  return false;
}
