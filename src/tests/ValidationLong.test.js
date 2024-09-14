import { expect, test } from "vitest";
import Validation from "../ValidationInNode.js";

Validation.setDefaultLang('zh_CN');
Validation.setLang('zh_CN');

test('Long/Long', () => {
  var a = 1;
  expect(Validation.validateValue('-1', 'Long', 'Parameter')).toBe('-1');
  expect(Validation.validateValue('0', 'Long', 'Parameter')).toBe('0');
  expect(Validation.validateValue('1', 'Long', 'Parameter')).toBe('1');
  expect(Validation.validateValue(-1, 'Long', 'Parameter')).toBe(-1);
  expect(Validation.validateValue(0, 'Long', 'Parameter')).toBe(0);
  expect(Validation.validateValue(1, 'Long', 'Parameter')).toBe(1);
  expect(Validation.validateValue(Number.MAX_SAFE_INTEGER, 'Long', 'Parameter')).toBe(Number.MAX_SAFE_INTEGER);
  expect(Validation.validateValue(Number.MIN_SAFE_INTEGER, 'Long', 'Parameter')).toBe(Number.MIN_SAFE_INTEGER);
  expect(() => Validation.validateValue(Number.MAX_SAFE_INTEGER + 1, 'Long', 'Param')).toThrow('必须大于等于 -9007199254740991 小于等于 9007199254740991');
  expect(() => Validation.validateValue(Number.MIN_SAFE_INTEGER - 1, 'Long', 'Param')).toThrow('必须大于等于 -9007199254740991 小于等于 9007199254740991');
  expect(() => Validation.validateValue(true, 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue([], 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue({}, 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(0.5, 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(()=>{}, 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue('', 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue('0.5', 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue('123a', 'Long', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue('abc', 'Long', 'Param')).toThrow('必须是长整数');
})

test('Long/LongEq', () => {
  expect(Validation.validateValue(-1, 'LongEq:-1', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'LongEq:-1', 'Param')).toBe('-1');
  expect(() => Validation.validateValue('abc', 'LongEq:-1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue({}, 'LongEq:-1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("0", 'LongEq:-1', 'Param')).toThrow('必须等于 -1');
  expect(() => Validation.validateValue(0, 'LongEq:-1', 'Param')).toThrow('必须等于 -1');
})

test('Long/LongNe', () => {
  expect(Validation.validateValue(1, 'LongNe:-1', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'LongNe:-1', 'Param')).toBe('1');
  expect(() => Validation.validateValue('abc', 'LongNe:-1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(true, 'LongNe:-1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("-1", 'LongNe:-1', 'Param')).toThrow('不能等于 -1');
  expect(() => Validation.validateValue(-1, 'LongNe:-1', 'Param')).toThrow('不能等于 -1');
})

test('Long/LongGt', () => {
  expect(Validation.validateValue(1, 'LongGt:0', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'LongGt:0', 'Param')).toBe('1');
  expect(() => Validation.validateValue('abc', 'LongGt:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(0.5, 'LongGt:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("0", 'LongGt:0', 'Param')).toThrow('必须大于 0');
  expect(() => Validation.validateValue(0, 'LongGt:0', 'Param')).toThrow('必须大于 0');
})

test('Long/LongGe', () => {
  expect(Validation.validateValue(1, 'LongGe:0', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'LongGe:0', 'Param')).toBe('1');
  expect(Validation.validateValue(0, 'LongGe:0', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'LongGe:0', 'Param')).toBe('0');
  expect(() => Validation.validateValue('abc', 'LongGe:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue([], 'LongGe:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("-1", 'LongGe:0', 'Param')).toThrow('必须大于等于 0');
  expect(() => Validation.validateValue(-1, 'LongGe:0', 'Param')).toThrow('必须大于等于 0');
})

test('Long/LongLt', () => {
  expect(Validation.validateValue(-1, 'LongLt:0', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'LongLt:0', 'Param')).toBe('-1');
  expect(() => Validation.validateValue('abc', 'LongLt:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(-0.5, 'LongLt:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("0", 'LongLt:0', 'Param')).toThrow('必须小于 0');
  expect(() => Validation.validateValue(0, 'LongLt:0', 'Param')).toThrow('必须小于 0');
})

test('Long/LongLe', () => {
  expect(Validation.validateValue(-1, 'LongLe:0', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'LongLe:0', 'Param')).toBe('-1');
  expect(() => Validation.validateValue('abc', 'LongLe:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(-0.5, 'LongLe:0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("1", 'LongLe:0', 'Param')).toThrow('必须小于等于 0');
  expect(() => Validation.validateValue(1, 'LongLe:0', 'Param')).toThrow('必须小于等于 0');
})

test('Long/LongGeLe', () => {
  expect(Validation.validateValue(0, 'LongGeLe:0,0', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'LongGeLe:0,0', 'Param')).toBe('0');
  expect(Validation.validateValue(11, 'LongGeLe:-100,100', 'Param')).toBe(11);
  expect(Validation.validateValue('11', 'LongGeLe:-100,100', 'Param')).toBe('11');
  expect(() => Validation.validateValue('abc', 'LongGeLe:0,0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(0.5, 'LongGeLe:0,0', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("-1", 'LongGeLe:0,10', 'Param')).toThrow('必须大于等于 0 小于等于 10');
  expect(() => Validation.validateValue(-1, 'LongGeLe:0,10', 'Param')).toThrow('必须大于等于 0 小于等于 10');
})

test('Long/LongGtLt', () => {
  expect(Validation.validateValue(0, 'LongGtLt:-1,1', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'LongGtLt:-1,1', 'Param')).toBe('0');
  expect(Validation.validateValue('000', 'LongGtLt:-1,1', 'Param')).toBe('000');
  expect(() => Validation.validateValue('abc', 'LongGtLt:-1,1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(0.5, 'LongGtLt:-1,1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("-1", 'LongGtLt:-1,1', 'Param')).toThrow('必须大于 -1 小于 1');
  expect(() => Validation.validateValue(1, 'LongGtLt:-1,1', 'Param')).toThrow('必须大于 -1 小于 1');
})

test('Long/LongGtLe', () => {
  expect(Validation.validateValue(0, 'LongGtLe:-1,1', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'LongGtLe:-1,1', 'Param')).toBe('0');
  expect(Validation.validateValue(1, 'LongGtLe:-1,1', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'LongGtLe:-1,1', 'Param')).toBe('1');
  expect(Validation.validateValue('001', 'LongGtLe:-1,1', 'Param')).toBe('001');
  expect(() => Validation.validateValue('abc', 'LongGtLe:-1,1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(0.5, 'LongGtLe:-1,1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("-1", 'LongGtLe:-1,1', 'Param')).toThrow('必须大于 -1 小于等于 1');
  expect(() => Validation.validateValue(2, 'LongGtLe:-1,1', 'Param')).toThrow('必须大于 -1 小于等于 1');
})

test('Long/LongGeLt', () => {
  expect(Validation.validateValue(0, 'LongGeLt:-1,1', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'LongGeLt:-1,1', 'Param')).toBe('0');
  expect(Validation.validateValue(-1, 'LongGeLt:-1,1', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'LongGeLt:-1,1', 'Param')).toBe('-1');
  expect(Validation.validateValue('-001', 'LongGeLt:-1,1', 'Param')).toBe('-001');
  expect(() => Validation.validateValue('abc', 'LongGeLt:-1,1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(-0.5, 'LongGeLt:-1,1', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("-2", 'LongGeLt:-1,1', 'Param')).toThrow('必须大于等于 -1 小于 1');
  expect(() => Validation.validateValue(1, 'LongGeLt:-1,1', 'Param')).toThrow('必须大于等于 -1 小于 1');
})

test('Long/LongIn', () => {
  expect(Validation.validateValue(1, 'LongIn:1,2,-3', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'LongIn:1,2,-3', 'Param')).toBe('1');
  expect(Validation.validateValue(2, 'LongIn:1,2,-3', 'Param')).toBe(2);
  expect(Validation.validateValue('02', 'LongIn:1,2,-3', 'Param')).toBe('02');
  expect(() => Validation.validateValue('abc', 'LongIn:1,2,-3', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(-0.5, 'LongIn:1,2,-3', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("0", 'LongIn:1,2,-3', 'Param')).toThrow('只能取这些值: 1, 2, -3');
  expect(() => Validation.validateValue(5, 'LongIn:1,2,-3', 'Param')).toThrow('只能取这些值: 1, 2, -3');
})

test('Long/LongNotIn', () => {
  expect(Validation.validateValue(0, 'LongNotIn:1,2,-3', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'LongNotIn:1,2,-3', 'Param')).toBe('0');
  expect(Validation.validateValue(4, 'LongNotIn:1,2,-3', 'Param')).toBe(4);
  expect(Validation.validateValue('04', 'LongNotIn:1,2,-3', 'Param')).toBe('04');
  expect(() => Validation.validateValue('abc', 'LongNotIn:1,2,-3', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue(-0.5, 'LongNotIn:1,2,-3', 'Param')).toThrow('必须是长整数');
  expect(() => Validation.validateValue("1", 'LongNotIn:1,2,-3', 'Param')).toThrow('不能取这些值: 1, 2, -3');
  expect(() => Validation.validateValue(-3, 'LongNotIn:1,2,-3', 'Param')).toThrow('不能取这些值: 1, 2, -3');
})
