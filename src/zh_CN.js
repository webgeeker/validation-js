export default {
  // 整型（不提供length检测,因为负数的符号位会让人混乱, 可以用大于小于比较来做到这一点）
  Int: "“{{param}}”必须是整数",
  IntEq: "“{{param}}”必须等于 {{value}}",
  IntNe: "“{{param}}”不能等于 {{value}}",
  IntGt: "“{{param}}”必须大于 {{min}}",
  IntGe: "“{{param}}”必须大于等于 {{min}}",
  IntLt: "“{{param}}”必须小于 {{max}}",
  IntLe: "“{{param}}”必须小于等于 {{max}}",
  IntGtLt: "“{{param}}”必须大于 {{min}} 小于 {{max}}",
  IntGeLe: "“{{param}}”必须大于等于 {{min}} 小于等于 {{max}}",
  IntGtLe: "“{{param}}”必须大于 {{min}} 小于等于 {{max}}",
  IntGeLt: "“{{param}}”必须大于等于 {{min}} 小于 {{max}}",
  IntIn: "“{{param}}”只能取这些值: {{valueList}}",
  IntNotIn: "“{{param}}”不能取这些值: {{valueList}}",

  // 长整型（不提供length检测,因为负数的符号位会让人混乱, 可以用大于小于比较来做到这一点）
  Long: "“{{param}}”必须是长整数",
  LongEq: "“{{param}}”必须等于 {{value}}",
  LongNe: "“{{param}}”不能等于 {{value}}",
  LongGt: "“{{param}}”必须大于 {{min}}",
  LongGe: "“{{param}}”必须大于等于 {{min}}",
  LongLt: "“{{param}}”必须小于 {{max}}",
  LongLe: "“{{param}}”必须小于等于 {{max}}",
  LongGtLt: "“{{param}}”必须大于 {{min}} 小于 {{max}}",
  LongGeLe: "“{{param}}”必须大于等于 {{min}} 小于等于 {{max}}",
  LongGtLe: "“{{param}}”必须大于 {{min}} 小于等于 {{max}}",
  LongGeLt: "“{{param}}”必须大于等于 {{min}} 小于 {{max}}",
  LongIn: "“{{param}}”只能取这些值: {{valueList}}",
  LongNotIn: "“{{param}}”不能取这些值: {{valueList}}",

  // 浮点型（内部一律使用double来处理）
  Float: "“{{param}}”必须是浮点数",
  FloatGt: "“{{param}}”必须大于 {{min}}",
  FloatGe: "“{{param}}”必须大于等于 {{min}}",
  FloatLt: "“{{param}}”必须小于 {{max}}",
  FloatLe: "“{{param}}”必须小于等于 {{max}}",
  FloatGtLt: "“{{param}}”必须大于 {{min}} 小于 {{max}}",
  FloatGeLe: "“{{param}}”必须大于等于 {{min}} 小于等于 {{max}}",
  FloatGtLe: "“{{param}}”必须大于 {{min}} 小于等于 {{max}}",
  FloatGeLt: "“{{param}}”必须大于等于 {{min}} 小于 {{max}}",

  // bool型
  Bool: "“{{param}}”必须是bool型", // 忽略大小写
  BoolSmart: "“{{param}}”只能取这些值: true, false, 1, 0, yes, no, y, n（忽略大小写）",
  BoolTrue: "“{{param}}”必须为true",
  BoolFalse: "“{{param}}”必须为false",
  BoolSmartTrue: "“{{param}}”只能取这些值: true, 1, yes, y（忽略大小写）",
  BoolSmartFalse: "“{{param}}”只能取这些值: false, 0, no, n（忽略大小写）",

  // 字符串
  Str: "“{{param}}”必须是字符串",
  StrEq: "“{{param}}”必须等于\"{{value}}\"",
  StrEqI: "“{{param}}”必须等于\"{{value}}\"（忽略大小写）",
  StrNe: "“{{param}}”不能等于\"{{value}}\"",
  StrNeI: "“{{param}}”不能等于\"{{value}}\"（忽略大小写）",
  StrIn: "“{{param}}”只能取这些值: {{valueList}}",
  StrInI: "“{{param}}”只能取这些值: {{valueList}}（忽略大小写）",
  StrNotIn: "“{{param}}”不能取这些值: {{valueList}}",
  StrNotInI: "“{{param}}”不能取这些值: {{valueList}}（忽略大小写）",
  StrLen: "“{{param}}”长度必须等于 {{length}}",
  StrLenGe: "“{{param}}”长度必须大于等于 {{min}}",
  StrLenLe: "“{{param}}”长度必须小于等于 {{max}}",
  StrLenGeLe: "“{{param}}”长度必须在 {{min}} - {{max}} 之间",
  ByteLen: "“{{param}}”长度（字节）必须等于 {{length}}", // 字符串长度
  ByteLenGe: "“{{param}}”长度（字节）必须大于等于 {{min}}",
  ByteLenLe: "“{{param}}”长度（字节）必须小于等于 {{max}}",
  ByteLenGeLe: "“{{param}}”长度（字节）必须在 {{min}} - {{max}} 之间", // 字符串长度
  Letters: "“{{param}}”只能包含字母",
  Alphabet: "“{{param}}”只能包含字母", // 同Letters
  Numbers: "“{{param}}”只能是纯数字",
  Digits: "“{{param}}”只能是纯数字", // 同Numbers
  LettersNumbers: "“{{param}}”只能包含字母和数字",
  Numeric: "“{{param}}”必须是数值", // 一般用于大数处理（超过double表示范围的数,一般会用字符串来表示）, 如果是正常范围内的数, 可以使用'Int'或'Float'来检测
  VarName: "“{{param}}”只能包含字母、数字和下划线，并且以字母或下划线开头",
  Email: "“{{param}}”不是合法的email",
  Url: "“{{param}}”不是合法的Url地址",
  HttpUrl: "“{{param}}”不是合法的Http地址",
  Ip: "“{{param}}”不是合法的IP地址",
  Ipv4: "“{{param}}”不是合法的IPv4地址",
  Ipv6: "“{{param}}”不是合法的IPv6地址",
  Mac: "“{{param}}”不是合法的MAC地址",
  Regexp: "“{{param}}”不匹配正则表达式“{{regexp}}”", // Perl正则表达式匹配. 目前不支持modifiers. http://www.rexegg.com/regex-modifiers.html

  // 数组
  Arr: "“{{param}}”必须是数组",
  ArrLen: "“{{param}}”长度必须等于 {{length}}",
  ArrLenGe: "“{{param}}”长度必须大于等于 {{min}}",
  ArrLenLe: "“{{param}}”长度必须小于等于 {{max}}",
  ArrLenGeLe: "“{{param}}”长度必须在 {{min}} ~ {{max}} 之间",

  // 对象
  Map: "“{{param}}”必须是 Map",

  // 文件
  File: "“{{param}}”必须是文件",
  FileMaxSize: "“{{param}}”必须是文件, 且文件大小不超过{{size}}",
  FileMinSize: "“{{param}}”必须是文件, 且文件大小不小于{{size}}",
  FileImage: "“{{param}}”必须是图像文件",
  FileVideo: "“{{param}}”必须是视频文件",
  FileAudio: "“{{param}}”必须是音频文件",
  FileMimes: "“{{param}}”必须是这些MIME类型的文件:{{mimes}}",

  // Date & Time
  Date: "“{{param}}”必须是有效的日期，格式为：YYYY-MM-DD",
  DateFrom: "“{{param}}”不得早于 {{from}}",
  DateTo: "“{{param}}”不得晚于 {{to}}",
  DateFromTo: "“{{param}}”必须在 {{from}} ~ {{to}} 之间",
  DateTime: "“{{param}}”必须是有效的日期时间，格式为：YYYY-MM-DD HH:mm:ss",
  DateTimeFrom: "“{{param}}”不得早于 {{from}}",
  DateTimeTo: "“{{param}}”必须早于 {{to}}",
  DateTimeFromTo: "“{{param}}”必须在 [{{from}}, {{to}}) 之间",
  // Time: "“{{param}}”必须符合时间格式HH:mm:ss或HH:mm",

  // 其它
  Required: "必须提供“{{param}}”",
}