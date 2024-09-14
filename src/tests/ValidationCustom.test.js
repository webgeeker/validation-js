import { expect, test } from "vitest";
import { MyValidation } from "../MyValidation";

MyValidation.setDefaultLang('zh_CN');
MyValidation.setLang('zh_CN');

test('Custom/SubClass', () => {
  let arrVals = [
    [],
    [1, 2, 3],
    ['a', 'b', 'cde'],
  ];
  for (const arrVal of arrVals) {
    MyValidation.validate({p: arrVal}, {p: 'Arr'});
  }
  let notArrVals = [10.0, 1, -100, true, false, 'abc', '.', ' -1.0', '', {}, () => {}, function () {}];
  for (const notArrVal of notArrVals) {
    expect(() => MyValidation.validate({p: notArrVal}, {p: 'Arr'})).toThrow('必须是数组');
  }
})
