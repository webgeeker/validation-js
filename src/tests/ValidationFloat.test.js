import { expect, test } from "vitest";
import Validation from "../ValidationInNode.js";

Validation.setDefaultLang('zh_CN');
Validation.setLang('zh_CN');

test('Float/Float', () => {
  var bigNums = [
    // 超大负数
    '-1e309',
    '-1234567890123456789012345671234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123',
    // 超大正数
    '1e309',
    '1234567890123456789012345671234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123',
  ];
  for (const bigNum of bigNums) {
    expect(() => Validation.validate({ p: bigNum }, { p: 'Float' }))
      .toThrow('必须大于等于 -1.7976931348623157e+308 小于等于 1.7976931348623157e+308');
  }

  var vals = ["-1", "0", "1", "-1.0", "0.0", "1.0", '+123', '-1.', '.3', '+.5', '000', '00.0', '-.6', '3e7', '10.8e-9', '-1e308', '1E308', -1.0, 0.0, 1.0, -1, 0, 1, 2147483647, -2147483648, '-1.7976931348623157e+308', '1.7976931348623157e+308'];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'Float' });
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validate({ p: wrongTypeVal }, { p: 'Float' })).toThrow('必须是浮点数');
  }
})

test('Float/FloatGt', () => {
  var vals = ["1", "1.0", "0.1", 1, 1.0, 0.1];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatGt:0' });
    Validation.validate({ p: val }, { p: 'FloatGt:0.0' });
  }

  var wrongVals = ["-1", "-1.0", "-0.1", "0", "0.0", -1, -1.0, -0.1, 0, 0.0];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGt:0' })).toThrow('必须大于 0.0');
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGt:0.0' })).toThrow('必须大于 0.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatGt:0')).toThrow('必须是浮点数');
  }
})

test('Float/FloatGe', () => {
  var vals = ["1", "1.0", "0.1", "0", "0.0", 1, 1.0, 0.1, 0, 0.0];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatGe:0' });
    Validation.validate({ p: val }, { p: 'FloatGe:0.0' });
  }

  var wrongVals = ["-1", "-1.0", "-0.1", -1, -1.0, -0.1];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGe:0' })).toThrow('必须大于等于 0.0');
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGe:0.0' })).toThrow('必须大于等于 0.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatGe:0')).toThrow('必须是浮点数');
  }
})

test('Float/FloatLt', () => {
  var vals = ["-1", "-1.0", "-0.1", -1, -1.0, -0.1];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatLt:0' });
    Validation.validate({ p: val }, { p: 'FloatLt:0.0' });
  }

  var wrongVals = ["1", "1.0", "0.1", "0", "0.0", 1, 1.0, 0.1, 0, 0.0];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatLt:0' })).toThrow('必须小于 0.0');
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatLt:0.0' })).toThrow('必须小于 0.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatLt:0')).toThrow('必须是浮点数');
  }
})

test('Float/FloatLe', () => {
  var vals = ["-1", "-1.0", "-0.1", "0", "0.0", -1, -1.0, -0.1, 0, 0.0];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatLe:0' });
    Validation.validate({ p: val }, { p: 'FloatLe:0.0' });
  }

  var wrongVals = ["1", "1.0", "0.1", 1, 1.0, 0.1];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatLe:0' })).toThrow('必须小于等于 0.0');
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatLe:0.0' })).toThrow('必须小于等于 0.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatLe:0')).toThrow('必须是浮点数');
  }
})

test('Float/FloatGeLe', () => {
  Validation.validate({ p: '-11' }, { p: 'FloatGeLe:-100.0,100' });
  Validation.validate({ p: '11.0' }, { p: 'FloatGeLe:-100.0,100' });
  Validation.validate({ p: 11 }, { p: 'FloatGeLe:-100,100.0' });
  Validation.validate({ p: -11.0 }, { p: 'FloatGeLe:-100,100.0' });
  Validation.validate({ p: '0123' }, { p: 'FloatGeLe:123.0,123' });
  Validation.validate({ p: '0123.0' }, { p: 'FloatGeLe:123.0,123' });
  Validation.validate({ p: -123 }, { p: 'FloatGeLe:-123,-123.0' });
  Validation.validate({ p: -123.0 }, { p: 'FloatGeLe:-123,-123.0' });
  var vals = ["0", "0.0", 0, 0.0, "000", "00.0"];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatGeLe:0.0,0' });
  }

  var wrongVals = ["-1", "-1.0", "-0.51", "1.1", "2", -1, -1.0, -0.51, 1.1, 2];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGeLe:-0.5,1.0' })).toThrow('必须大于等于 -0.5 小于等于 1.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatGeLe:0.0,10')).toThrow('必须是浮点数');
  }
})

test('Float/FloatGtLt', () => {
  var vals = ["0", "0.0", '.1', "-.1", 0.1, -0.1, 0, 0.0, "000", "00.0"];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatGtLt:-1.0,1' });
  }

  var wrongVals = ["1", "1.0", 1, 1.0, "-1", "-1.0", -1, -1.0];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGtLt:-1,1.0' })).toThrow('必须大于 -1.0 小于 1.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatGtLt:0.0,1.0')).toThrow('必须是浮点数');
  }
})

test('Float/FloatGtLe', () => {
  var vals = ["0", "0.0", '-.9', "1", '1.0', -0.9, 0, 0.0, 1, 1.0, "000", "00.0"];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatGtLe:-1.,1' });
  }

  var wrongVals = ["-1", "-1.0", "1.1", "10", -1, -1.0, 1.1, 10];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGtLe:-1,1.0' })).toThrow('必须大于 -1.0 小于等于 1.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatGtLe:0.0,1.0')).toThrow('必须是浮点数');
  }
})

test('Float/FloatGeLt', () => {
  var vals = ["0", "0.0", ".9", "-1", "-1.0", 0.9, 0, 0.0, -1, -1.0, "000", "00.0"];
  for (const val of vals) {
    Validation.validate({ p: val }, { p: 'FloatGeLt:-1.,1' });
  }

  var wrongVals = ["1", "1.0", "-1.1", "-10", 1, 1.0, -1.1, -10];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validate({ p: wrongVal }, { p: 'FloatGeLt:-1,1.0' })).toThrow('必须大于等于 -1.0 小于 1.0');
  }

  var wrongTypeVals = ["", true, false, 'e', '-', '+', '-.', '+.', 'Infinity', '-Infinity', '123a', '1.5e', '10.3e', "abc", ".", " -1.0", [], {}, () => {}, function() {}];
  for (const wrongTypeVal of wrongTypeVals) {
    expect(() => Validation.validateValue(wrongTypeVal, 'FloatGeLt:0.0,1.0')).toThrow('必须是浮点数');
  }
})

