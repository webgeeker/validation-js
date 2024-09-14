import { expect, test } from "vitest";
import Validation from "../ValidationInNode.js";

Validation.setDefaultLang('zh_CN');
Validation.setLang('zh_CN');

test('Bool/Bool', () => {
  let boolVals = [true, false, "true", "false", "tRue", "fAlse"];
  for (const boolVal of boolVals) {
    Validation.validate({ p: boolVal }, { "p": 'Bool' }, false);
  }
  let notBoolVals = [1, 0, "1", "0", 1.0, "hello", [], {}, () => {}];
  for (const notBoolVal of notBoolVals) {
    expect(() => Validation.validate({ p: notBoolVal }, { "p": 'Bool' }, false))
      .toThrow('必须是bool型');
  }
})

test('Bool/BoolTrue', () => {
  let boolVals = [true, "true", "tRue"];
  for (const boolVal of boolVals) {
    Validation.validate({ p: boolVal }, { "p": 'BoolTrue' }, false);
  }
  let notTrueVals = [false, "false", "falsE"];
  for (const notTrueVal of notTrueVals) {
    expect(() => Validation.validate({ p: notTrueVal }, { "p": 'BoolTrue' }, false))
      .toThrow('必须为true');
  }
  let notBoolVals = [1, 0, "1", "0", 1.0, "hello", [], {}, () => {}];
  for (const notBoolVal of notBoolVals) {
    expect(() => Validation.validate({ p: notBoolVal }, { "p": 'BoolTrue' }, false))
      .toThrow('必须是bool型');
  }
})

test('Bool/BoolFalse', () => {
  let boolVals = [false, "false", "falsE"];
  for (const boolVal of boolVals) {
    Validation.validate({ p: boolVal }, { "p": 'BoolFalse' }, false);
  }
  let notFalseVals = [true, "true", "tRue"];
  for (const notFalseVal of notFalseVals) {
    expect(() => Validation.validate({ p: notFalseVal }, { "p": 'BoolFalse' }, false))
      .toThrow('必须为false');
  }
  let notBoolVals = [1, 0, "1", "0", 1.0, "hello", [], {}, () => {}];
  for (const notBoolVal of notBoolVals) {
    expect(() => Validation.validate({ p: notBoolVal }, { "p": 'BoolFalse' }, false))
      .toThrow('必须是bool型');
  }
})

test('Bool/BoolSmart', () => {
  let boolVals = [true, false, "true", "false", "tRue", "fAlse", 1.0, 0.0, 1, 0, "1", "0", "Yes", "no", "y", "n"];
  for (const boolVal of boolVals) {
    Validation.validate({ p: boolVal }, { "p": 'BoolSmart' }, false);
  }
  let notBoolVals = [8, "100", "1.0", "0.0", "hello", [], {}, () => {}];
  for (const notBoolVal of notBoolVals) {
    expect(() => Validation.validate({ p: notBoolVal }, { "p": 'BoolSmart' }, false))
      .toThrow('只能取这些值: true, false, 1, 0, yes, no, y, n（忽略大小写）');
  }
})

test('Bool/BoolSmartTrue', () => {
  let boolVals = [true, "true", "tRue", 1.0, 1, "1", "Yes", "y"];
  for (const boolVal of boolVals) {
    Validation.validate({ p: boolVal }, { "p": 'BoolSmartTrue' }, false);
  }
  let notTrueVals = [false, "false", "falsE", 0.0, 0, "0", "no", "n"];
  for (const notTrueVal of notTrueVals) {
    expect(() => Validation.validate({ p: notTrueVal }, { "p": 'BoolSmartTrue' }, false))
      .toThrow('只能取这些值: true, 1, yes, y（忽略大小写）');
  }
  let notBoolVals = [8, "100", "1.0", "0.0", "hello", [], {}, () => {}];
  for (const notBoolVal of notBoolVals) {
    expect(() => Validation.validate({ p: notBoolVal }, { "p": 'BoolSmartTrue' }, false))
      .toThrow('只能取这些值: true, 1, yes, y（忽略大小写）');
  }
})

test('Bool/BoolSmartFalse', () => {
  let boolVals = [false, "false", "falsE", 0.0, 0, "0", "no", "n"];
  for (const boolVal of boolVals) {
    Validation.validate({ p: boolVal }, { "p": 'BoolSmartFalse' }, false);
  }
  let notFalseVals = [true, "true", "tRue", 1.0, 1, "1", "Yes", "y"];
  for (const notFalseVal of notFalseVals) {
    expect(() => Validation.validate({ p: notFalseVal }, { "p": 'BoolSmartFalse' }, false))
      .toThrow('只能取这些值: false, 0, no, n（忽略大小写）');
  }
  let notBoolVals = [8, "100", "1.0", "0.0", "hello", [], {}, () => {}];
  for (const notBoolVal of notBoolVals) {
    expect(() => Validation.validate({ p: notBoolVal }, { "p": 'BoolSmartFalse' }, false))
      .toThrow('只能取这些值: false, 0, no, n（忽略大小写）');
  }
})