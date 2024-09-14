# Validation-JS

[中文](# "中文") | [English](readme-en.md "English")

```js
import Validation from "validation-js";
```

## 国际化

### 设置当前语言

```js
Validation.setLang('zh_CN'); // （必选）设置Validation类的当前语言
MyValidation.setLang('zh_CN'); // （必选）设置子类的当前语言
```

至少要调用一次`setLang()`方法，因为默认不会下载任何语言包，调用此方法会触发语言包的下载。
并且要在实际使用 Validation 类之前调用。建议在程序初始化时调用，比如在main.js中调用

可以在程序运行过程中调用以动态切换当前语言。

### 设置默认语言

默认语言的作用是：  
如果没有找到当前语言的翻译项，则会到默认语言的翻译表中去查找，以避免由于某些语言没有提供翻译项，导致无法翻译的问题。

```js
Validation.setDefaultLang(lang); // 设置 Validation 类的默认语言
MyValidation.setDefaultLang(lang); // 设置子类 MyValidation类的默认语言
```

这是可选操作。 如果不设置，默认语言初始值为'en_US'。

建议在`setLang()`之前调用，因为`setLang()`会触发语言包的下载。在`setLang()`之后再调用`setDefaultLang()`修改默认语言，可能会触发下载新的语言包，拖慢页面加载速度

### 翻译表的优先级

翻译表的作用是当参数验证失败时，会抛出异常，异常的message会使用翻译表翻译成本地语言，以准确提示用户验证失败的原因。

Validation类可以通过多级继承的方式来提供多级翻译表，优先级高的翻译表中的项会覆盖优先级低的翻译表中的同名的项。

翻译表优先级从高到低依次是：
1. 子类的翻译表
2. 父类的翻译表
3. Validation类的翻译表（默认为空）
4. Validation类的内置翻译表（提供了几种内置语言的翻译表，如zh_CN, en_US等）

在翻译时，会依次从上述翻译表中查找要翻译的文本

### 自定义翻译表

有两种方式来自定义翻译表：
* 继承Validation类，在子类中提供静态翻译表
* 动态注入翻译表：调用`setTranslations()`向当前类中注入指定语言的翻译表

二者可以结合使用，即可以在子类中提供静态的翻译表，同时又可以调用子类的`setTranslations()`方法动态注入翻译表

#### 在继承类中提供静态翻译表

在Validation的子类中创建一个名为"_langToTranslations"的属性，即为该子类的翻译表，如：
```js
class MyValidation extends Validation {

  /**
   * 翻译表。key = 语言代码, value = 该语言的翻译表
   * @private 因为子类要间接访问此属性，所以不能真的设置为私有，只能打上 @private 标记
   */
  static _langToTranslations = {
    en_US: {
      CustomStartWith: '{{param}} must start with "{{prefix}}"',
      CustomPhoneCN: '{{param}} must be a valid 11-digit mobile phone number',
    }
  }
}
```

可以利用该机制为自定义验证器提供翻译项。

#### 动态注入翻译表

一般用于加载其它非内置语言的翻译表，比如：
```js
import zh_HK from './zh_HK.js';

Validation.setTranslations("zh_HK", zh_HK);
```

如果指定语言的翻译表已存在，则会被替换。

注意用上述代码加载语言包是没有按需下载的特性的，可以用下列代码来按需下载并加载语言包：
```js
import zh_HK from './zh_HK.js';

import('./zh_HK.js').then((module) => {
  Validation.setTranslations("zh_HK", module.default);
}).catch((reason) => {
  console.error(`Validation: 加载内置语言包 zh_HK 失败`, reason);
})
```

也可以用于添加新的翻译项，或覆盖已有翻译项：
```js
Validation.setTranslations("zh_CN", {
  HelloWorld: "你好世界", // 新的翻译项
  Int: "“{{param}}”应该是整数" // 覆盖已有的翻译项
});

let params = {age: 'abc'}; // 测试数据
Validation.validate(params, {age: "IntGe:18"}); // 抛出异常：“age”应该是整数
```

向子类中注入翻译表，其优先级高于父类中的翻译表：
```js
// 假设 MyValidation 继承了 Validation 类
MyValidation.setTranslations("zh_CN", {
  HelloWorld: "你好世界!!!!!!",
  Int: "“{{param}}”应该是整数！！！！！！" 
});

let params = {age: 'abc'}; // 测试数据
Validation.validate(params, {age: "IntGe:18"}); // 抛出异常：“age”应该是整数
MyValidation.validate(params, {age: "IntGe:18"}); // 抛出异常：“age”应该是整数！！！！！！
```

