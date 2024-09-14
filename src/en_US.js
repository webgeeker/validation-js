export default {
  // 整型（不提供length检测,因为负数的符号位会让人混乱, 可以用大于小于比较来做到这一点）
  Int: "{{param}} must be an integer",
  IntEq: "{{param}} must be equal to {{value}}",
  IntNe: "{{param}} cannot be equal to {{value}}",
  IntGt: "{{param}} must be greater than {{min}}",
  IntGe: "{{param}} must be greater than or equal to {{min}}",
  IntLt: "{{param}} must be less than {{max}}",
  IntLe: "{{param}} must be less than or equal to {{max}}",
  IntGtLt: "{{param}} must be greater than {{min}} and less than {{max}}",
  IntGeLe: "{{param}} must be greater than or equal to {{min}} and less than or equal to {{max}}",
  IntGtLe: "{{param}} must be greater than {{min}} and less than or equal to {{max}}",
  IntGeLt: "{{param}} must be greater than or equal to {{min}} and less than {{max}}",
  IntIn: "{{param}} can only take these values: {{valueList}}",
  IntNotIn: "{{param}} cannot take these values: {{valueList}}",

  // 长整型（不提供length检测,因为负数的符号位会让人混乱, 可以用大于小于比较来做到这一点）
  Long: "{{param}} must be a long integer",
  LongEq: "{{param}} must be equal to {{value}}",
  LongNe: "{{param}} cannot be equal to {{value}}",
  LongGt: "{{param}} must be greater than {{min}}",
  LongGe: "{{param}} must be greater than or equal to {{min}}",
  LongLt: "{{param}} must be less than {{max}}",
  LongLe: "{{param}} must be less than or equal to {{max}}",
  LongGtLt: "{{param}} must be greater than {{min}} and less than {{max}}",
  LongGeLe: "{{param}} must be greater than or equal to {{min}} and less than or equal to {{max}}",
  LongGtLe: "{{param}} must be greater than {{min}} and less than or equal to {{max}}",
  LongGeLt: "{{param}} must be greater than or equal to {{min}} and less than {{max}}",
  LongIn: "{{param}} can only take these values: {{valueList}}",
  LongNotIn: "{{param}} cannot take these values: {{valueList}}",

  // 浮点型（内部一律使用double来处理）
  Float: "{{param}} must be a floating point number",
  FloatGt: "{{param}} must be greater than {{min}}",
  FloatGe: "{{param}} must be greater than or equal to {{min}}",
  FloatLt: "{{param}} must be less than {{max}}",
  FloatLe: "{{param}} must be less than or equal to {{max}}",
  FloatGtLt: "{{param}} must be greater than {{min}} and less than {{max}}",
  FloatGeLe: "{{param}} must be greater than or equal to {{min}} and less than or equal to {{max}}",
  FloatGtLe: "{{param}} must be greater than {{min}} and less than or equal to {{max}}",
  FloatGeLt: "{{param}} must be greater than or equal to {{min}} and less than {{max}}",

  // bool型
  Bool: "{{param}} must be a bool type", // Ignore case
  BoolSmart: "{{param}} can only take these values: true, false, 1, 0, yes, no, y, n (ignore case)",
  BoolTrue: "{{param}} must be true",
  BoolFalse: "{{param}} must be false",
  BoolSmartTrue: "{{param}} can only take these values: true, 1, yes, y (ignore case)",
  BoolSmartFalse: "{{param}} can only take these values: false, 0, no, n (ignore case)",

  // 字符串
  Str: "{{param}} must be a string",
  StrEq: "{{param}} must be equal to \"{{value}}\"",
  StrEqI: "{{param}} must be equal to \"{{value}}\" (ignore case)",
  StrNe: "{{param}} cannot be equal to \"{{value}}\"",
  StrNeI: "{{param}} cannot be equal to \"{{value}}\" (ignore case)",
  StrIn: "{{param}} can only take these values: {{valueList}}",
  StrInI: "{{param}} can only take these values: {{valueList}} (ignore case)",
  StrNotIn: "{{param}} cannot take these values: {{valueList}}",
  StrNotInI: "{{param}} cannot take these values: {{valueList}} (ignore case)",
  StrLen: "The length of \"{{param}}\" must be equal to {{length}}",
  StrLenGe: "The length of \"{{param}}\" must be greater than or equal to {{min}}",
  StrLenLe: "The length of \"{{param}}\" must be less than or equal to {{max}}",
  StrLenGeLe: "The length of \"{{param}}\" must be between {{min}} - {{max}}",
  ByteLen: "The length (bytes) of \"{{param}}\" must be equal to {{length}}",
  ByteLenGe: "The length (bytes) of \"{{param}}\" must be greater than or equal to {{min}}",
  ByteLenLe: "The length (bytes) of \"{{param}}\" must be less than or equal to {{max}}",
  ByteLenGeLe: "The length (bytes) of \"{{param}}\" must be between {{min}} - {{max}}",
  Letters: "{{param}} can only contain letters",
  Alphabet: "{{param}} can only contain letters", // Same as Letters
  Numbers: "{{param}} can only be pure numbers",
  Digits: "{{param}} can only be pure numbers", // Same as Numbers
  LettersNumbers: "{{param}} can only contain letters and pure numbers",
  Numeric: "{{param}} must be a numeric value", // Generally used for large number processing (numbers exceeding the double representation range are generally represented by strings). If a number within the normal range, you can use 'Int' or 'Float' to detect
  VarName: "{{param}} can only contain letters, pure numbers and underscores, and start with a letter or underscore",
  Email: "{{param}} is not a legal email",
  Url: "{{param}} is not a legal Url address",
  HttpUrl: "{{param}} is not a valid HTTP address",
  Ip: "{{param}} is not a valid IP address",
  Ipv4: "{{param}} is not a valid IPv4 address",
  Ipv6: "{{param}} is not a valid IPv6 address",
  Mac: "{{param}} is not a valid MAC address",
  Regexp: "{{param}} does not match the regular expression \"{{regexp}}\"", // Perl regular expression matching. Modifiers are not currently supported. http://www.rexegg.com/regex-modifiers.html

  // 数组
  Arr: "{{param}} must be an array",
  ArrLen: "The length of \"{{param}}\" must be equal to {{length}}",
  ArrLenGe: "The length of \"{{param}}\" must be greater than or equal to {{min}}",
  ArrLenLe: "The length of \"{{param}}\" must be less than or equal to {{max}}",
  ArrLenGeLe: "The length of \"{{param}}\" must be between {{min}} and {{max}}",

  // 对象
  Map: "{{param}} must be a Map",

  // 文件
  File: "{{param}} must be a file",
  FileMaxSize: "{{param}} must be a file, and the file size does not exceed {{size}}",
  FileMinSize: "{{param}} must be a file, and the file size is not less than {{size}}",
  FileImage: "{{param}} must be an image file",
  FileVideo: "{{param}} must be a video file",
  FileAudio: "{{param}} must be an audio file",
  FileMimes: "{{param}} must be a file of these MIME types: {{mimes}}",

  // Date & Time
  Date: "{{param}} must be a valid date in the format of YYYY-MM-DD",
  DateFrom: "{{param}} must not be earlier than {{from}}",
  DateTo: "{{param}} must not be later than {{to}}",
  DateFromTo: "{{param}} must be between {{from}} and {{to}}",
  DateTime: "{{param}} must be a valid date and time in the format of YYYY-MM-DD HH:mm:ss",
  DateTimeFrom: "{{param}} must not be earlier than {{from}}",
  DateTimeTo: "{{param}} must be earlier than {{to}}",
  DateTimeFromTo: "{{param}} must be between [{{from}}, {{to}})",
  // Time: "{{param}} must conform to the time format HH:mm:ss or HH:mm",

  // 其它
  Required: "{{param}} is Required",
}