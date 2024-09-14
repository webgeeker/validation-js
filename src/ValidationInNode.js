// 本文件供nodejs代码引用，目的是提前加载语言包，以避免验证代码在语言包加载前被调用而导致报错。
import Validation from './Validation.js'

// 下面的import语句可以避免Validation.setLang()延迟加载语言包，避免验证代码在语言包加载之前执行而导致报错。
// 只要import即可（这会影响到打包程序），不需要调用什么代码。
import zh_CN from "./zh_CN.js";
import en_US from "./en_US.js";

export default Validation;