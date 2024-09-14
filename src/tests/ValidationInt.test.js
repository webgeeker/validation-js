import { expect, test } from "vitest";
import Validation from "../ValidationInNode.js";

Validation.setDefaultLang('zh_CN');
Validation.setLang('zh_CN');

test('Int/Int', () => {
  expect(Validation.validateValue('-1', 'Int', 'Parameter')).toBe('-1');
  expect(Validation.validateValue('0', 'Int', 'Parameter')).toBe('0');
  expect(Validation.validateValue('1', 'Int', 'Parameter')).toBe('1');
  expect(Validation.validateValue(-1, 'Int', 'Parameter')).toBe(-1);
  expect(Validation.validateValue(0, 'Int', 'Parameter')).toBe(0);
  expect(Validation.validateValue(1, 'Int', 'Parameter')).toBe(1);
  expect(Validation.validateValue(2147483647, 'Int', 'Parameter')).toBe(2147483647);
  expect(Validation.validateValue(-2147483648, 'Int', 'Parameter')).toBe(-2147483648);
  expect(() => Validation.validateValue(2147483648, 'Int', 'Param')).toThrow('必须大于等于 -2147483648 小于等于 2147483647');
  expect(() => Validation.validateValue(-2147483649, 'Int', 'Param')).toThrow('必须大于等于 -2147483648 小于等于 2147483647');
  expect(() => Validation.validateValue(true, 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue([], 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue({}, 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(0.5, 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(()=>{}, 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue('', 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue('0.5', 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue('123a', 'Int', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue('abc', 'Int', 'Param')).toThrow('必须是整数');
})

test('Int/IntEq', () => {
  expect(Validation.validateValue(-1, 'IntEq:-1', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'IntEq:-1', 'Param')).toBe('-1');
  expect(() => Validation.validateValue('abc', 'IntEq:-1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue({}, 'IntEq:-1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("0", 'IntEq:-1', 'Param')).toThrow('必须等于 -1');
  expect(() => Validation.validateValue(0, 'IntEq:-1', 'Param')).toThrow('必须等于 -1');
})

test('Int/IntNe', () => {
  expect(Validation.validateValue(1, 'IntNe:-1', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'IntNe:-1', 'Param')).toBe('1');
  expect(() => Validation.validateValue('abc', 'IntNe:-1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(true, 'IntNe:-1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("-1", 'IntNe:-1', 'Param')).toThrow('不能等于 -1');
  expect(() => Validation.validateValue(-1, 'IntNe:-1', 'Param')).toThrow('不能等于 -1');
})

test('Int/IntGt', () => {
  expect(Validation.validateValue(1, 'IntGt:0', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'IntGt:0', 'Param')).toBe('1');
  expect(() => Validation.validateValue('abc', 'IntGt:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(0.5, 'IntGt:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("0", 'IntGt:0', 'Param')).toThrow('必须大于 0');
  expect(() => Validation.validateValue(0, 'IntGt:0', 'Param')).toThrow('必须大于 0');
})

test('Int/IntGe', () => {
  expect(Validation.validateValue(1, 'IntGe:0', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'IntGe:0', 'Param')).toBe('1');
  expect(Validation.validateValue(0, 'IntGe:0', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'IntGe:0', 'Param')).toBe('0');
  expect(() => Validation.validateValue('abc', 'IntGe:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue([], 'IntGe:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("-1", 'IntGe:0', 'Param')).toThrow('必须大于等于 0');
  expect(() => Validation.validateValue(-1, 'IntGe:0', 'Param')).toThrow('必须大于等于 0');
})

test('Int/IntLt', () => {
  expect(Validation.validateValue(-1, 'IntLt:0', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'IntLt:0', 'Param')).toBe('-1');
  expect(() => Validation.validateValue('abc', 'IntLt:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(-0.5, 'IntLt:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("0", 'IntLt:0', 'Param')).toThrow('必须小于 0');
  expect(() => Validation.validateValue(0, 'IntLt:0', 'Param')).toThrow('必须小于 0');
})

test('Int/IntLe', () => {
  expect(Validation.validateValue(-1, 'IntLe:0', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'IntLe:0', 'Param')).toBe('-1');
  expect(() => Validation.validateValue('abc', 'IntLe:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(-0.5, 'IntLe:0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("1", 'IntLe:0', 'Param')).toThrow('必须小于等于 0');
  expect(() => Validation.validateValue(1, 'IntLe:0', 'Param')).toThrow('必须小于等于 0');
})

test('Int/IntGeLe', () => {
  expect(Validation.validateValue(0, 'IntGeLe:0,0', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'IntGeLe:0,0', 'Param')).toBe('0');
  expect(Validation.validateValue(11, 'IntGeLe:-100,100', 'Param')).toBe(11);
  expect(Validation.validateValue('11', 'IntGeLe:-100,100', 'Param')).toBe('11');
  expect(() => Validation.validateValue('abc', 'IntGeLe:0,0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(0.5, 'IntGeLe:0,0', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("-1", 'IntGeLe:0,10', 'Param')).toThrow('必须大于等于 0 小于等于 10');
  expect(() => Validation.validateValue(-1, 'IntGeLe:0,10', 'Param')).toThrow('必须大于等于 0 小于等于 10');
})

test('Int/IntGtLt', () => {
  expect(Validation.validateValue(0, 'IntGtLt:-1,1', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'IntGtLt:-1,1', 'Param')).toBe('0');
  expect(Validation.validateValue('000', 'IntGtLt:-1,1', 'Param')).toBe('000');
  expect(() => Validation.validateValue('abc', 'IntGtLt:-1,1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(0.5, 'IntGtLt:-1,1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("-1", 'IntGtLt:-1,1', 'Param')).toThrow('必须大于 -1 小于 1');
  expect(() => Validation.validateValue(1, 'IntGtLt:-1,1', 'Param')).toThrow('必须大于 -1 小于 1');
})

test('Int/IntGtLe', () => {
  expect(Validation.validateValue(0, 'IntGtLe:-1,1', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'IntGtLe:-1,1', 'Param')).toBe('0');
  expect(Validation.validateValue(1, 'IntGtLe:-1,1', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'IntGtLe:-1,1', 'Param')).toBe('1');
  expect(Validation.validateValue('001', 'IntGtLe:-1,1', 'Param')).toBe('001');
  expect(() => Validation.validateValue('abc', 'IntGtLe:-1,1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(0.5, 'IntGtLe:-1,1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("-1", 'IntGtLe:-1,1', 'Param')).toThrow('必须大于 -1 小于等于 1');
  expect(() => Validation.validateValue(2, 'IntGtLe:-1,1', 'Param')).toThrow('必须大于 -1 小于等于 1');
})

test('Int/IntGeLt', () => {
  expect(Validation.validateValue(0, 'IntGeLt:-1,1', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'IntGeLt:-1,1', 'Param')).toBe('0');
  expect(Validation.validateValue(-1, 'IntGeLt:-1,1', 'Param')).toBe(-1);
  expect(Validation.validateValue('-1', 'IntGeLt:-1,1', 'Param')).toBe('-1');
  expect(Validation.validateValue('-001', 'IntGeLt:-1,1', 'Param')).toBe('-001');
  expect(() => Validation.validateValue('abc', 'IntGeLt:-1,1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(-0.5, 'IntGeLt:-1,1', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("-2", 'IntGeLt:-1,1', 'Param')).toThrow('必须大于等于 -1 小于 1');
  expect(() => Validation.validateValue(1, 'IntGeLt:-1,1', 'Param')).toThrow('必须大于等于 -1 小于 1');
})

test('Int/IntIn', () => {
  expect(Validation.validateValue(1, 'IntIn:1,2,-3', 'Param')).toBe(1);
  expect(Validation.validateValue('1', 'IntIn:1,2,-3', 'Param')).toBe('1');
  expect(Validation.validateValue(2, 'IntIn:1,2,-3', 'Param')).toBe(2);
  expect(Validation.validateValue('02', 'IntIn:1,2,-3', 'Param')).toBe('02');
  expect(() => Validation.validateValue('abc', 'IntIn:1,2,-3', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(-0.5, 'IntIn:1,2,-3', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("0", 'IntIn:1,2,-3', 'Param')).toThrow('只能取这些值: 1, 2, -3');
  expect(() => Validation.validateValue(5, 'IntIn:1,2,-3', 'Param')).toThrow('只能取这些值: 1, 2, -3');
})

test('Int/IntNotIn', () => {
  expect(Validation.validateValue(0, 'IntNotIn:1,2,-3', 'Param')).toBe(0);
  expect(Validation.validateValue('0', 'IntNotIn:1,2,-3', 'Param')).toBe('0');
  expect(Validation.validateValue(4, 'IntNotIn:1,2,-3', 'Param')).toBe(4);
  expect(Validation.validateValue('04', 'IntNotIn:1,2,-3', 'Param')).toBe('04');
  expect(() => Validation.validateValue('abc', 'IntNotIn:1,2,-3', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue(-0.5, 'IntNotIn:1,2,-3', 'Param')).toThrow('必须是整数');
  expect(() => Validation.validateValue("1", 'IntNotIn:1,2,-3', 'Param')).toThrow('不能取这些值: 1, 2, -3');
  expect(() => Validation.validateValue(-3, 'IntNotIn:1,2,-3', 'Param')).toThrow('不能取这些值: 1, 2, -3');
})
