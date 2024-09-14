import { expect, test } from "vitest";
import Validation from "../ValidationInNode.js";

Validation.setDefaultLang('zh_CN');
Validation.setLang('zh_CN');

test('Date/Date', () => {
  let dateVals = ["2017-06-01", "2017-6-1", "2017-6-01", "2017-06-1"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'Date');
  }
  let notDateVals = ["17-6-1", "2017 6 1", "2017/6/1", "2017-06", "2017-06-31", "2019-02-29", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'Date')).toThrow('必须是有效的日期，格式为：YYYY-MM-DD');
  }
})

test('Date/DateFrom', () => {
  let dateVals = ["2017-06-15", "2017-6-16"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'DateFrom:2017-06-15');
  }
  let wrongDateVals = ["2017-06-14", "2011-6-1"];
  for (const wrongDateVal of wrongDateVals) {
    expect(() => Validation.validateValue(wrongDateVal, 'DateFrom:2017-06-15')).toThrow('不得早于 2017-06-15');
  }
  let notDateVals = ["17-6-1", "2017 6 1", "2017/6/1", "2017-06", "2017-06-31", "2019-02-29", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'DateFrom:2017-06-15')).toThrow('必须是有效的日期，格式为：YYYY-MM-DD');
  }
  expect(() => Validation.validateValue("2017-06-15", 'DateFrom:2017/06/15')).toThrow('验证器 DateFrom 格式错误. 正确的格式示例: DateFrom:2017-04-13');
})

test('Date/DateTo', () => {
  let dateVals = ["2017-06-15", "2017-6-14"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'DateTo:2017-06-15');
  }
  let wrongDateVals = ["2017-06-16", "2019-6-17"];
  for (const dateVal of wrongDateVals) {
    expect(() => Validation.validateValue(dateVal, 'DateTo:2017-06-15')).toThrow('不得晚于 2017-06-15');
  }
  let notDateVals = ["17-6-1", "2017 6 1", "2017/6/1", "2017-06", "2017-06-31", "2019-02-29", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'DateTo:2017-06-15')).toThrow('必须是有效的日期，格式为：YYYY-MM-DD');
  }
  expect(() => Validation.validateValue("2017-06-15", 'DateTo:2017/06/15')).toThrow('验证器 DateTo 格式错误. 正确的格式示例: DateTo:2017-04-13');
})

test('Date/DateFromTo', () => {
  let dateVals = ["2017-06-15", "2017-6-14", "2017-6-10", "2017-6-20"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'DateFromTo:2017-06-10,2017-06-20');
  }
  let wrongDateVals = ["2017-06-9", "2017-6-21"];
  for (const wrongDateVal of wrongDateVals) {
    expect(() => Validation.validateValue(wrongDateVal, 'DateFromTo:2017-06-10,2017-06-20')).toThrow('必须在 2017-06-10 ~ 2017-06-20 之间');
  }
  let notDateVals = ["17-6-1", "2017 6 1", "2017/6/1", "2017-06", "2017-06-31", "2019-02-29", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'DateFromTo:2017-06-10,2017-06-20')).toThrow('必须是有效的日期，格式为：YYYY-MM-DD');
  }
  expect(() => Validation.validateValue("2017-06-15", 'DateFromTo:2017-06-15')).toThrow('验证器 DateFromTo 格式错误. 正确的格式示例: DateFromTo:2017-04-13,2017-04-13');
})

test('Date/DateTime', () => {
  let dateVals = ["2017-06-01 12:00:00", "2017-6-1 12:00:00", "2017-6-01 12:00:00", "2017-06-1 12:00:00"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'DateTime');
  }
  let notDateVals = ["2017-06-01 12:00:aa", "2017-06-01 12:00", "2017-06-01 12/00/00", "17-06-01 12:00:00", "2017-06-01", "17-6-1", "2017 6 1", "2017/6/1", "2017-06", "2017-06-01 12:80:80", "2017-06-31 12:00:00", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'DateTime')).toThrow('必须是有效的日期时间，格式为：YYYY-MM-DD HH:mm:ss');
  }
})

test('Date/DateTimeFrom', () => {
  let dateVals = ["2017-06-15 12:00:00", "2017-6-15 12:00:01"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'DateTimeFrom:2017-06-15 12:00:00');
  }
  let wrongDateVals = ["2017-06-15 11:59:59", "2017-6-15 00:00:00"];
  for (const wrongDateVal of wrongDateVals) {
    expect(() => Validation.validateValue(wrongDateVal, 'DateTimeFrom:2017-06-15 12:00:00')).toThrow('不得早于 2017-06-15 12:00:00');
  }
  let notDateVals = ["2017-06-01 12:00:aa", "2017-06-01 12:00", "2017-06-01 12/00/00", "17-06-01 12:00:00", "2017-06-01", "17-6-1", "2017 6 1", "2017/6/1", "2017-06", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'DateTimeFrom:2017-06-15 12:00:00')).toThrow('必须是有效的日期时间，格式为：YYYY-MM-DD HH:mm:ss');
  }
  expect(() => Validation.validateValue("2017-06-15 12:00:00", 'DateTimeFrom:2017-06-15 12/00/00')).toThrow('验证器 DateTimeFrom 格式错误. 正确的格式示例: DateTimeFrom:2017-04-13 12:00:00');
})

test('Date/DateTimeTo', () => {
  let dateVals = ["2017-06-15 11:59:59", "2017-6-15 11:59:58"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'DateTimeTo:2017-06-15 12:00:00');
  }
  let wrongDateVals = ["2017-06-15 12:00:00", "2017-06-15 12:00:01", "2017-6-15 12:00:02"];
  for (const dateVal of wrongDateVals) {
    expect(() => Validation.validateValue(dateVal, 'DateTimeTo:2017-06-15 12:00:00')).toThrow('必须早于 2017-06-15 12:00:00');
  }
  let notDateVals = ["2017-06-01 12:00:aa", "2017-06-01 12:00", "2017-06-01 12/00/00", "17-06-01 12:00:00", "2017-06-01", "17-6-1", "2017 6 1", "2017/6/1", "2017-06", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'DateTimeTo:2017-06-15 12:00:00')).toThrow('必须是有效的日期时间，格式为：YYYY-MM-DD HH:mm:ss');
  }
  expect(() => Validation.validateValue("2017-06-15 12:00:00", 'DateTimeTo:2017-06-15 12/00/00')).toThrow('验证器 DateTimeTo 格式错误. 正确的格式示例: DateTimeTo:2017-04-13 12:00:00');
})

test('Date/DateTimeFromTo', () => {
  let dateVals = ["2017-06-15 12:00:00", "2017-06-15 12:30:00", "2017-06-15 12:59:59"];
  for (const dateVal of dateVals) {
    Validation.validateValue(dateVal, 'DateTimeFromTo:2017-06-15 12:00:00,2017-06-15 13:00:00');
  }
  let wrongDateVals = ["2017-06-15 11:59:59", "2017-06-15 13:00:00"];
  for (const wrongDateVal of wrongDateVals) {
    expect(() => Validation.validateValue(wrongDateVal, 'DateTimeFromTo:2017-06-15 12:00:00,2017-06-15 13:00:00')).toThrow('必须在 [2017-06-15 12:00:00, 2017-06-15 13:00:00) 之间');
  }
  let notDateVals = ["2017-06-01 12:00:aa", "2017-06-01 12:00", "2017-06-01 12/00/00", "17-06-01 12:00:00", "2017-06-01", "17-6-1", "2017 6 1", "2017/6/1", "2017-06", true, 1.0, "345", [], {}, () => {}];
  for (const notDateVal of notDateVals) {
    expect(() => Validation.validateValue(notDateVal, 'DateTimeFromTo:2017-06-15 12:00:00,2017-06-15 13:00:00')).toThrow('必须是有效的日期时间，格式为：YYYY-MM-DD HH:mm:ss');
  }
  expect(() => Validation.validateValue("2017-06-15", 'DateTimeFromTo:2017-06-15')).toThrow('验证器 DateTimeFromTo 格式错误. 正确的格式示例: DateTimeFromTo:2017-04-13 12:00:00,2017-04-13 12:00:00');
})

