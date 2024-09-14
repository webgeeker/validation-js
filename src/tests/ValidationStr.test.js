import { expect, test } from "vitest";
import Validation from "../ValidationInNode.js";

Validation.setDefaultLang('zh_CN');
Validation.setLang('zh_CN');

test('Str/Str', () => {
  let strVals = ['', '123', 'abc', '你好', '-12311112311111'];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Str');
    // Validation.validate(['valStr' => $strVal], ['valStr' => 'Str']);
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Str'))
      .toThrow('必须是字符串');
  }
})

test('Str/StrEq', () => {
  let strVals = ['', '123', 'abc', '你好', '-12311112311111'];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrEq:' + strVal);
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal, 'StrEq:' + strVal + '1'))
      .toThrow('必须等于"' + strVal + '1"');
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal + '1', 'StrEq:' + strVal))
      .toThrow('必须等于"' + strVal + '"');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrEq:' + notStrVal))
      .toThrow('必须是字符串');
  }
})

test('Str/StrEqI', () => {
  let strVals = ["", "123", "abc", "你好", "-12311112311111", "Abc", "你a好"];
  let str2Vals = ["", "123", "abc", "你好", "-12311112311111", "abC", "你A好"];
  for (let i = 0; i < str2Vals.length; i++) {
    let strVal = strVals[i];
    let str2Val = str2Vals[i];
    Validation.validateValue(strVal, 'StrEqI:' + str2Val);
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal, 'StrEqI:' + strVal + '1'))
      .toThrow('必须等于"' + strVal + '1"（忽略大小写）');
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal + '1', 'StrEqI:' + strVal))
      .toThrow('必须等于"' + strVal + '"（忽略大小写）');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrEqI:' + notStrVal))
      .toThrow('必须是字符串');
  }
})

test('Str/StrNe', () => {
  let strVals = ['', '123', 'abc', '你好', '-12311112311111'];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrNe:' + strVal + '1');
  }
  for (const strVal of strVals) {
    Validation.validateValue(strVal + '1', 'StrNe:' + strVal);
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal, 'StrNe:' + strVal))
      .toThrow('不能等于"' + strVal + '"');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrNe:' + notStrVal))
      .toThrow('必须是字符串');
  }
})

test('Str/StrNeI', () => {
  let strVals = ["", "123", "abc", "你好", "-12311112311111", "Abc", "你a好"];
  let str2Vals = ["", "123", "abc", "你好", "-12311112311111", "abC", "你A好"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrNeI:' + strVal + '1');
  }
  for (const strVal of strVals) {
    Validation.validateValue(strVal + '1', 'StrNeI:' + strVal);
  }
  for (let i = 0; i < str2Vals.length; i++) {
    let strVal = strVals[i];
    let str2Val = str2Vals[i];
    expect(() => Validation.validateValue(strVal, 'StrNeI:' + str2Val))
      .toThrow('不能等于"' + str2Val + '"（忽略大小写）');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrNeI:' + notStrVal))
      .toThrow('必须是字符串');
  }
})

test('Str/StrIn', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrIn:' + strVals.join(','));
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal + 1, 'StrIn:' + strVals.join(',')))
      .toThrow('只能取这些值: "');
  }
  Validation.validateValue("abc", 'StrIn:abc');
  Validation.validateValue("", 'StrIn:');
  Validation.validateValue(" ", 'StrIn: ');
  expect(() => Validation.validateValue('abcd', 'StrIn:abc'))
    .toThrow('只能取这些值: "abc"');
  expect(() => Validation.validateValue(' ', 'StrIn:  '))
    .toThrow('只能取这些值: "  "');
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrIn:' + notStrVal))
      .toThrow('必须是字符串');
  }
})

test('Str/StrInI', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "Abcd", "你a好"];
  let str2Vals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "abCd", "你A好"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrInI:' + str2Vals.join(','));
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal + 1, 'StrInI:' + strVals.join(',')))
      .toThrow('只能取这些值: "');
    expect(() => Validation.validateValue(strVal, 'StrInI:' + strVals.join('1,') + '1'))
      .toThrow('"（忽略大小写）');
  }
  Validation.validateValue("abc", 'StrInI:Abc');
  Validation.validateValue("", 'StrInI:');
  Validation.validateValue(" ", 'StrInI: ');
  expect(() => Validation.validateValue('abcd', 'StrInI:abc'))
    .toThrow('只能取这些值: "abc"');
  expect(() => Validation.validateValue(' ', 'StrInI:  '))
    .toThrow('只能取这些值: "  "');
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrInI:Hello'))
      .toThrow('必须是字符串');
  }
})

test('Str/StrNotIn', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal + 'postfix', 'StrNotIn:' + strVals.join(','));
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal, 'StrNotIn:' + strVals.join(',')))
      .toThrow('不能取这些值: "');
  }
  Validation.validateValue("abcd", 'StrNotIn:abc');
  Validation.validateValue("abc", 'StrNotIn:');
  Validation.validateValue("", 'StrNotIn:abc');
  Validation.validateValue("  ", 'StrNotIn: ');
  expect(() => Validation.validateValue('abc', 'StrNotIn:abc'))
    .toThrow('不能取这些值: "abc"');
  expect(() => Validation.validateValue('', 'StrNotIn:'))
    .toThrow('不能取这些值: ""');
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrNotIn:Hello'))
      .toThrow('必须是字符串');
  }
})

test('Str/StrNotInI', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "Abcd", "你a好"];
  let str2Vals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "abCd", "你A好"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal + 'postfix', 'StrNotInI:' + str2Vals.join(','));
  }
  for (const strVal of strVals) {
    expect(() => Validation.validateValue(strVal, 'StrNotInI:' + str2Vals.join(',')))
      .toThrow('不能取这些值: "');
  }
  Validation.validateValue("abcd", 'StrNotInI:abc');
  Validation.validateValue("abc", 'StrNotInI:');
  Validation.validateValue("", 'StrNotInI:abc');
  Validation.validateValue("  ", 'StrNotInI: ');
  expect(() => Validation.validateValue('abc', 'StrNotInI:Abc'))
    .toThrow('不能取这些值: "Abc"（忽略大小写）');
  expect(() => Validation.validateValue('', 'StrNotInI:'))
    .toThrow('不能取这些值: ""（忽略大小写）');
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrNotInI:Hello'))
      .toThrow('必须是字符串');
  }
})

test('Str/StrLen', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "Abcd", "你a好"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrLen:' + strVal.length);
    expect(() => Validation.validateValue(strVal, 'StrLen:' + (strVal.length + 1)))
      .toThrow('必须等于 ' + (strVal.length + 1));
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrLen:8'))
      .toThrow('必须是字符串');
  }
})

test('Str/StrLenGe', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "Abcd", "你a好"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrLenGe:' + strVal.length);
    Validation.validateValue(strVal + '1', 'StrLenGe:' + strVal.length);
    expect(() => Validation.validateValue(strVal, 'StrLenGe:' + (strVal.length + 1)))
      .toThrow('必须大于等于 ' + (strVal.length + 1));
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrLenGe:8'))
      .toThrow('必须是字符串');
  }
})

test('Str/StrLenLe', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "Abcd", "你a好"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrLenLe:' + strVal.length);
    Validation.validateValue(strVal, 'StrLenLe:' + (strVal.length + 1));
    expect(() => Validation.validateValue(strVal + '1', 'StrLenLe:' + strVal.length))
      .toThrow('必须小于等于 ' + strVal.length);
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrLenLe:8'))
      .toThrow('必须是字符串');
  }
})

test('Str/StrLenGeLe', () => {
  let strVals = ["", " ", "  ", "\t", "123", "abc", "你好", "-12311112311111", "Abcd", "你a好"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'StrLenGeLe:' + strVal.length + ',' + strVal.length);
    expect(() => Validation.validateValue(strVal + '1', 'StrLenGeLe:' + strVal.length + ',' + strVal.length))
      .toThrow('长度必须在 ' + strVal.length + ' - ' + strVal.length + ' 之间');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'StrLenGeLe:8,8'))
      .toThrow('必须是字符串');
  }
})

test('Str/Letters', () => {
  let strVals = ["a", "z", "A", "Z", "abc", "ABC", "Hello", "ZZZ", "abc"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Letters');
  }
  let wrongVals = ["", " ", "  ", "\t", "123", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Letters'))
      .toThrow('只能包含字母');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Letters'))
      .toThrow('必须是字符串');
  }
})

test('Str/Alphabet', () => {
  let strVals = ["a", "z", "A", "Z", "abc", "ABC", "Hello", "ZZZ", "abc"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Alphabet');
  }
  let wrongVals = ["", " ", "  ", "\t", "123", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Alphabet'))
      .toThrow('只能包含字母');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Alphabet'))
      .toThrow('必须是字符串');
  }
})

test('Str/Numbers', () => {
  let strVals = ["0", "1", "123", "32456236234523452354324"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Numbers');
  }
  let wrongVals = ["", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Numbers'))
      .toThrow('只能是纯数字');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Numbers'))
      .toThrow('必须是字符串');
  }
})

test('Str/Digits', () => {
  let strVals = ["0", "1", "123", "32456236234523452354324"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Digits');
  }
  let wrongVals = ["", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Digits'))
      .toThrow('只能是纯数字');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Digits'))
      .toThrow('必须是字符串');
  }
})

test('Str/LettersNumbers', () => {
  let strVals = ["a", "z", "A", "Z", "abc", "ABC", "Hello", "ZZZ", "abc", "0", "1", "123", "32456236234523452354324", "abc123"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'LettersNumbers');
  }
  let wrongVals = ["_abc123", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'LettersNumbers'))
      .toThrow('只能包含字母和数字');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'LettersNumbers'))
      .toThrow('必须是字符串');
  }
})

test('Str/Numeric', () => {
  let strVals = ["0", "-0", "0.0", "-0.0", "1", "-1", "1.0", "-1.0", "123", "-123", "123.0", "-123.0", "-.0", ".0", "1.", "-1.", "23412341234.423412341241234", "3245623623452341234234123452354324", ".3245623623452341234234123452354324", "3245623623452341234234123452354324.3245623623452341234234123452354324"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Numeric');
  }
  let wrongVals = ["1.2.3", ".", "-.", "", " ", "  ", "\t", " 123", "abc.def", "你好", "abc123"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Numeric'))
      .toThrow('必须是数值');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Numeric'))
      .toThrow('必须是字符串');
  }
})

test('Str/VarName', () => {
  let strVals = ["_", "_abc", "_abc123", "a", "z", "A", "Z", "abc", "ABC", "Hello", "ZZZ", "abc", "abc123"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'VarName');
  }
  let wrongVals = ["0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'VarName'))
      .toThrow('只能包含字母、数字和下划线，并且以字母或下划线开头');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'VarName'))
      .toThrow('必须是字符串');
  }
})

test('Str/Email', () => {
  let strVals = ["hi@abc.com", "admin@webgeeker.com", "32456236234523452354324@webgeeker.com", "hello@abc-def.com"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Email');
  }
  let wrongVals = ["hi @abc.com", "0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Email'))
      .toThrow('不是合法的email');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Email'))
      .toThrow('必须是字符串');
  }
})

test('Str/Url', () => {
  let strVals = ["http://abc.com", "https://webgeeker.com", "http://hello.com/p/1", "http://hello.com/p/1?str=1&abc=123", "ftp://abc.com"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Url');
  }
  let wrongVals = ["abc.com", "//abc.com", "hi @abc.com", "0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Url'))
      .toThrow('不是合法的Url地址');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Url'))
      .toThrow('必须是字符串');
  }
})

test('Str/HttpUrl', () => {
  let strVals = ["http://abc.com", "https://webgeeker.com", "http://hello.com/p/1", "http://hello.com/p/1?str=1&abc=123"];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'HttpUrl');
  }
  let wrongVals = ["abc.com", "ftp://abc.com", "//abc.com", "hi @abc.com", "0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'HttpUrl'))
      .toThrow('不是合法的Http地址');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'HttpUrl'))
      .toThrow('必须是字符串');
  }
})

test('Str/Ip', () => {
  let ips = [
    "1.1.1.1", "0.0.0.0", "8.8.8.8", "255.255.255.255",
    "::",
    "::1", // 本地回环地址.相当于ipv4的127.0.0.1
    "::ffff:192.168.89.9", // ipv4的ipv6形式（IPv4映射地址）
    "::ffff:c0a8:5909", // 等价于::ffff:192.168.89.9
    "fe80::", //fe80::/10－这些链路本地地址指明，这些地址只在区域连接中是合法的，这有点类似于IPv4中的169.254.0.0/16
    "169.254.0.0",
    "2001:0DB8:02de:0000:0000:0000:0000:0e13",
    "2001:DB8:2de:0000:0000:0000:0000:e13",
    "2001:DB8:2de:000:000:000:000:e13",
    "2001:DB8:2de:00:00:00:00:e13",
    "2001:DB8:2de:0:0:0:0:e13",
    "2001:DB8:2de::e13",
    "2001:0DB8:0000:0000:0000:0000:1428:57ab",
    "2001:0DB8:0000:0000:0000::1428:57ab",
    "2001:0DB8:0:0:0:0:1428:57ab",
    "2001:0DB8:0::0:1428:57ab",
    "2001:0DB8::1428:57ab",
  ];
  for (const ip of ips) {
    Validation.validateValue(ip, 'Ip');
  }
  let wrongIps = ["1.2.3.", "1.2.3.256", "2001::25de::cade", ":::",
    "abc.com", "//abc.com", "hi @abc.com", "0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongIp of wrongIps) {
    expect(() => Validation.validateValue(wrongIp, 'Ip'))
      .toThrow('不是合法的IP地址');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Ip'))
      .toThrow('必须是字符串');
  }
})

test('Str/Ipv4', () => {
  let ips = ["1.1.1.1", "0.0.0.0", "8.8.8.8", "255.255.255.255", "169.254.0.0"];
  for (const ip of ips) {
    Validation.validateValue(ip, 'Ipv4');
  }
  let wrongIps = ["1.2.3.", "1.2.3.256", "2001::25de::cade", ":::", "2001:0DB8:02de:0000:0000:0000:0000:0e13",
    "abc.com", "//abc.com", "hi @abc.com", "0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongIp of wrongIps) {
    expect(() => Validation.validateValue(wrongIp, 'Ipv4'))
      .toThrow('不是合法的IPv4地址');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Ipv4'))
      .toThrow('必须是字符串');
  }
})

test('Str/Ipv6', () => {
  let ips = [
    "::",
    "::1", // 本地回环地址.相当于ipv4的127.0.0.1
    "::ffff:192.168.89.9", // ipv4的ipv6形式（IPv4映射地址）
    "::ffff:c0a8:5909", // 等价于::ffff:192.168.89.9
    "fe80::", //fe80::/10－这些链路本地地址指明，这些地址只在区域连接中是合法的，这有点类似于IPv4中的169.254.0.0/16
    "2001:0DB8:02de:0000:0000:0000:0000:0e13",
    "2001:DB8:2de:0000:0000:0000:0000:e13",
    "2001:DB8:2de:000:000:000:000:e13",
    "2001:DB8:2de:00:00:00:00:e13",
    "2001:DB8:2de:0:0:0:0:e13",
    "2001:DB8:2de::e13",
    "2001:0DB8:0000:0000:0000:0000:1428:57ab",
    "2001:0DB8:0000:0000:0000::1428:57ab",
    "2001:0DB8:0:0:0:0:1428:57ab",
    "2001:0DB8:0::0:1428:57ab",
    "2001:0DB8::1428:57ab",
  ];
  for (const ip of ips) {
    Validation.validateValue(ip, 'Ipv6');
  }
  let wrongIps = ["1.2.3.", "1.2.3.256", "2001::25de::cade", ":::", "169.254.0.0",
    "abc.com", "//abc.com", "hi @abc.com", "0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongIp of wrongIps) {
    expect(() => Validation.validateValue(wrongIp, 'Ipv6'))
      .toThrow('不是合法的IPv6地址');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Ipv6'))
      .toThrow('必须是字符串');
  }
})

test('Str/Mac', () => {
  let strVals = [
    "00:16:3e:02:02:9c",
    "00:0A:02:0B:03:0C",
    "ff:ff:ff:ff:ff:ff", // 广播地址
    "01:00:00:00:00:00", // 01:xx:xx:xx:xx:xx是多播地址
    "01:00:5e:00:00:00", // 01:00:5e:xx:xx:xx是IPv4多播地址
  ];
  for (const strVal of strVals) {
    Validation.validateValue(strVal, 'Mac');
  }
  let wrongVals = ["00:16:3e:02:02:9", "1.2.3.", "1.2.3.256", "2001::25de::cade", ":::",
    "abc.com", "//abc.com", "hi @abc.com", "0", "1", "123", "32456236234523452354324", "1abc", "", " ", "  ", "\t", " 123", "-123", "1.0", "abc.def", "你好", "-12311112311111"];
  for (const wrongVal of wrongVals) {
    expect(() => Validation.validateValue(wrongVal, 'Mac'))
      .toThrow('不是合法的MAC地址');
  }
  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Mac'))
      .toThrow('必须是字符串');
  }
})

test('Str/Regexp', () => {
  let valExps = new Map();
  valExps.set("0123456789", "/345/"); // 在PHP中这个是匹配的, 但是Java中这个不匹配.
  valExps.set("01234567", "/.*345.*/");
  valExps.set("012345678", "/^.*345.*$/");
  valExps.set("0123456789", "/0123456789/");
  valExps.set("10.", "/^[0-9.]+$/");
  valExps.set("10/ab|cd", "/^[0-9]+\\/ab\\|cd$/");
  valExps.set("var=123", "/^\\s*var\\s*=\\s*[0-9]+\\s*$/");
  valExps.set(" var = 123 ", "/^\\s*var\\s*=\\s*[0-9]+\\s*$/");
  for (const strVal of valExps.keys()) {
    Validation.validateValue(strVal, 'Regexp:' + valExps.get(strVal));
  }

  let notMatchValExps = new Map();
  notMatchValExps.set("a10.", "/^[0-9.]+$/");
  notMatchValExps.set("a10/abcd", "/^[0-9]+\\/abcd$/");
  for (const strVal of notMatchValExps.keys()) {
    expect(() => Validation.validateValue(strVal, 'Regexp:' + notMatchValExps.get(strVal)))
      .toThrow('不匹配正则表达式“');
  }
  expect(() => Validation.validateValue('abc', 'Regexp:/abc'))
    .toThrow('正则表达式验证器Regexp格式错误. 正确的格式是 Regexp:/xxxx/');
  expect(() => Validation.validateValue('abc', 'Regexp:abc/'))
    .toThrow('正则表达式验证器Regexp格式错误. 正确的格式是 Regexp:/xxxx/');

  let notStrVals = [1, 0, 1.0, 0.0, true, false, [], {}, () => {}, function () {}];
  for (const notStrVal of notStrVals) {
    expect(() => Validation.validateValue(notStrVal, 'Regexp:/abc/'))
      .toThrow('必须是字符串');
  }

  // 为了提高测试覆盖率: __compileValidator() 方法中的行: else if (pos === len - 2)
  Validation.validateValue('abc/', 'Regexp:/^(abc\\/|def)$/');
  Validation.validateValue('def', 'Regexp:/^(abc\\/|def)$/');
})

