import { expect, test } from "vitest";
import Validation from "../ValidationInNode.js";

Validation.setDefaultLang('zh_CN');
Validation.setLang('zh_CN');

test('Arr/Arr', () => {
  let arrVals = [
    [],
    [1, 2, 3],
    ['a', 'b', 'cde'],
  ];
  for (const arrVal of arrVals) {
    Validation.validate({p: arrVal}, {p: 'Arr'});
  }
  let notArrVals = [10.0, 1, -100, true, false, 'abc', '.', ' -1.0', '', {}, () => {}, function () {}];
  for (const notArrVal of notArrVals) {
    expect(() => Validation.validate({p: notArrVal}, {p: 'Arr'})).toThrow('必须是数组');
  }
})

test('Arr/ArrLen', () => {
  expect(() => Validation.validate({p: []}, {p: 'ArrLen:-22'})).toThrow('验证器 ArrLen 的参数必须是一个非负整数');

  let arrVals = [
    [],
    [1, 2, 3],
    ['a', 'b', 'cde'],
  ];
  for (const arrVal of arrVals) {
    Validation.validate({p: arrVal}, {p: 'ArrLen:' + arrVal.length});
    expect(() => Validation.validate({p: arrVal}, {p: 'ArrLen:' + (arrVal.length + 1)}))
      .toThrow('必须等于 ' + (arrVal.length + 1));
  }
  let notArrVals = [10.0, 1, -100, true, false, 'abc', '.', ' -1.0', '', {}, () => {}, function () {}];
  for (const notArrVal of notArrVals) {
    expect(() => Validation.validate({p: notArrVal}, {p: 'ArrLen:22'})).toThrow('必须是数组');
  }
})

test('Arr/ArrLenGe', () => {
  let arrVals = [
    [],
    [1, 2, 3],
    ['a', 'b', 'cde'],
  ];
  for (const arrVal of arrVals) {
    Validation.validate({p: arrVal}, {p: 'ArrLenGe:' + arrVal.length});
    if (arrVal.length > 0)
      Validation.validate({p: arrVal}, {p: 'ArrLenGe:' + (arrVal.length - 1)});
    expect(() => Validation.validate({p: arrVal}, {p: 'ArrLenGe:' + (arrVal.length + 1)}))
      .toThrow('长度必须大于等于 ' + (arrVal.length + 1));
  }
  let notArrVals = [10.0, 1, -100, true, false, 'abc', '.', ' -1.0', '', {}, () => {}, function () {}];
  for (const notArrVal of notArrVals) {
    expect(() => Validation.validate({p: notArrVal}, {p: 'ArrLenGe:22'})).toThrow('必须是数组');
  }
})

test('Arr/ArrLenLe', () => {
  let arrVals = [
    [],
    [1, 2, 3],
    ['a', 'b', 'cde'],
  ];
  for (const arrVal of arrVals) {
    Validation.validate({p: arrVal}, {p: 'ArrLenLe:' + arrVal.length});
    Validation.validate({p: arrVal}, {p: 'ArrLenLe:' + (arrVal.length + 1)});
    if (arrVal.length > 0) {
      expect(() => Validation.validate({ p: arrVal }, { p: 'ArrLenLe:' + (arrVal.length - 1) }))
        .toThrow('长度必须小于等于 ' + (arrVal.length - 1));
    }
  }
  let notArrVals = [10.0, 1, -100, true, false, 'abc', '.', ' -1.0', '', {}, () => {}, function () {}];
  for (const notArrVal of notArrVals) {
    expect(() => Validation.validate({p: notArrVal}, {p: 'ArrLenLe:22'})).toThrow('必须是数组');
  }
})

test('Arr/ArrLenGeLe', () => {
  let arrVals = [
    [],
    [1, 2, 3],
    ['a', 'b', 'cde'],
  ];
  for (const arrVal of arrVals) {
    Validation.validate({ p: arrVal }, { p: 'ArrLenGeLe:' + arrVal.length + ',' + arrVal.length });
    expect(() => Validation.validate({ p: arrVal }, { p: 'ArrLenGeLe:' + (arrVal.length + 1) + ',' + (arrVal.length + 1) }))
      .toThrow('长度必须在 ' + (arrVal.length + 1) + ' ~ ' + (arrVal.length + 1) + ' 之间');
  }
  let notArrVals = [10.0, 1, -100, true, false, 'abc', '.', ' -1.0', '', {}, () => {}, function () {}];
  for (const notArrVal of notArrVals) {
    expect(() => Validation.validate({p: notArrVal}, {p: 'ArrLenGeLe:22,23'})).toThrow('必须是数组');
  }
})

test('Map/Map', () => {
  let mapVals = [
    {},
    {a: 1},
    {'abc': 123, 'hello': 'world'},
  ];
  for (const mapVal of mapVals) {
    Validation.validate({ p: mapVal }, { p: 'Map' });
  }
  let notMapVals = [10.0, 1, -100, true, false, 'abc', '.', ' -1.0', '', [], () => {}, function () {}];
  for (const notMapVal of notMapVals) {
    expect(() => Validation.validate({p: notMapVal}, {p: 'Map'})).toThrow('必须是 Map');
  }
})
