# Validation for Javascript

[中文](/webgeeker/validation-js/ "中文") | [English](readme-en.md "English")

## 1 简介

一个强大的 Javascript 参数验证器，用于对用户输入的参数进行合法性检查。

支持多种数据类型的校验：整型、浮点型、bool型、字符串、数组、对象(Map)，能够验证嵌套的数据结构中的参数，还支持带条件判断的验证。

## 2 安装

```shell
npm i -S webgeeker-validation-js@^1.0.1
```

## 3 快速上手

### 3.1 一个简单的使用方法示例

```js
import Validation from "validation-js";

let params = { // 待验证参数
  "name": "Hello",
  "age": 25
};

Validation.setLang('zh_CN'); // 设置当前语言（在使用前必须调用一次，否则不会加载语言包）

// 验证（如果验证不通过，会抛出异常）
Validation.validate(params, {
  "name": "Required|StrLenGeLe:2,50",  // 参数"name"是必需的且长度在[2, 50]之间
  "age": "Required|IntGtLe:18,60",  // 参数"age"是必需的且取值在[18, 60]之间
});
```

### 3.2 验证不通过的错误处理

如果验证不通过，`Validation.validate(...)`方法会抛出异常。

如果是在前端使用，可以捕获异常，然后在用户界面上显示异常的message以提示用户验证失败的原因；

如果是在后端使用，建议在框架层面统一捕获这些异常，提取错误描述信息并返回给客户端。

## 4 详细使用方法

### 4.1 验证整型参数

整型验证器全部以"Int"开头，用于验证取值范围相当于32位整型的数值（如`123`）或数值字符串（如`"123"`）。其它数据类型均不匹配。

```js
Validation.validate(params, {
    "size": "IntGeLe:1,100",
});
```
这条验证要求参数"size"是整数，并且大于等于1，小于等于100。

完整的整型验证器的列表参考附录 A.1 。

### 4.2 验证长整型参数

整型验证器全部以"Long"开头，用于验证取值范围相当于64位整型的数值（如`123`）或数值字符串（如`"123"`）。其它数据类型均不匹配。

由于js内部的数值全部用浮点数来表示，所以"Long"的实际可取值范围要小于64位整型，大概相当于53位整型。

```js
Validation.validate(params, {
    "money": "LongGeLe:5000000000,10000000000",
});
```
这条验证要求参数"money"是长整数，并且大于等于5000000000，小于等于10000000000。

完整的长整型验证器的列表参考附录 A.2 。

### 4.3 验证浮点型参数

浮点型验证器全部以"Float"开头，用于验证浮点型数值（如`1.0`）、浮点型字符串（如`"1.0"`）、整型数值（如`123`）或整型字符串（如`"123"`）。其它数据类型均不匹配。

*注意*: FloatXxx不区分单精度和双精度, 一率按双精度浮点数来处理.

```js
Validation.validate(params, {
    "height": "FloatGeLe:0.0,100.0",
});
```
这条验证要求参数"height"是浮点数，并且大于等于0，小于等于100.0。

完整的浮点型验证器的列表参考附录 A.3 。

### 4.4 验证bool型参数

bool型验证器：
* Bool: 合法的取值为: `true`, `false`, `"true"`, `"false"`（字符串忽略大小写）。
* BoolTrue: 合法的取值为: `true`, `"true"`（字符串忽略大小写）。
* BoolFalse: 合法的取值为: `false`, `"false"`（字符串忽略大小写）。
* BoolSmart: 合法的取值为: `true`, `false`, `"true"`, `"false"`, `1`, `0`, `"1"`, `"0"`, `"yes"`, `"no"`, `"y"`, `"n"`（字符串忽略大小写）
* BoolSmartTrue: 合法的取值为: `true`, `"true"`, `1`, `"1"`, `"yes"`, `"y"`（字符串忽略大小写）
* BoolSmartFalse: 合法的取值为: `false`, `"false"`, `0`, `"0"`, `"no"`, `"n"`（字符串忽略大小写）

例
```js
Validation.validate(params, {
    "accept": "BoolSmart",
});
```

完整的bool型验证器的列表参考附录 A.4 。

### 4.5 验证字符串型参数

字符串型验证器不全以"Str"开头。只接收字符串型数据，其它数据类型均不匹配。

例1：
```js
Validation.validate(params, {
    "name": "StrLenGeLe:2,20",
});
```
这条验证要求参数"name"是字符串，长度在2-20之间。

例2：
```js
Validation.validate(params, {
    "comment": "StrLenLe:1048576",
});
```
这条验证要求参数"comment"是字符串，长度不超过1048576。

例3：
```js
Validation.validate(params, {
    "email": "Email",
});
```
这条验证要求参数"email"是必须是合法的电子邮件地址。

例4（正则表达式验证）：
```js
Validation.validate(params, {
    "phone": "Regexp:/^1[3-9][0-9]\d{8}$/", null,
});
```
这条验证要求参数"phone"是CN手机号。

关于正则表达式中的哪些特殊字符需要做额外的转义的问题，只需要先用 `String.matches()` 函数验证好，如：
```
string.matches("^abc/$")
```

注意正则表达式要放在双`/`之间，其中的`|`符号，不需要做转义。  

完整的字符串型验证器的列表参考附录 A.5 。

### 4.6 验证数组型、Map型、文件型、日期时间型参数

参考附录A.6-A.9

### 4.7 验证器串联（与）

一条规则中可以有多个验证器前后串联，它们之间是“AND”的关系，如：
```js
Validation.validate(params, {
    "num": "IntGe:10|IntLe:100",
});
```
这个验证要求参数"num"是整数，并且大于等于10，小于等于100

### 4.8 Required 验证器

* Required验证器要求参数必须存在，且其值不能为`null`或`undefined`（参数值为`null`或`undefined`等价于参数不存在）。
* 如果多个验证器串联，Required验证器必须在其它验证器前面。
* 如果还有条件验证器，Required必须串联在条件验证器后面。
* 如果验证规则中没有 Required，当参数存在时才进行验证，验证不通过会抛异常；如果参数不存在，那么就不验证（相当于验证通过）

例：
```js
Validation.validate(params, {
    "size": "Required|StrIn:small,middle,large",
});
```
该验证要求参数"size"是必需的，且只能是字符串的"small", "middle"或者"large"。

### 4.9 忽略所有 Required 验证器

比如当创建一个用户时，要求姓名、性别、年龄全部都要提供；但是当更新用户信息时，不需要提供全部信息，提供哪个信息就更新哪个信息。

```js
let validations = {
    "name": "Required|StrLenGeLe:2,20",
    "sex": "Required|IntIn:0,1",
    "age": "Required|IntGeLe:1,200",
};

let userInfo = {
    "name": "tom",
    "sex": "0",
    "age": "10",
};
Validation.validate(userInfo, validations); // 创建用户时的验证

delete userInfo.age; // 删除age字段
Validation.validate(userInfo, validations, true); // 更新用户信息时的验证
```
注意上面代码的最后一行：`validate()`函数的第三个参数为true表示忽略所有的 Required 验证器。

这样我们就只需要写一份验证规则，就可以同时用于创建用户和更新用户信息这两个接口。

### 4.10 嵌套参数的验证

下面这个例子展示了包含数组和Map的嵌套的参数的验证：
```js
let validations = {
    "comments[*].title": "Required|StrLenGeLe:2,50",
    "comments[*].content": "Required|StrLenGeLe:2,500",
};

let params = {
    "comments": [
        {
            "title": "title 1",
            "content": "content 1"
        }, {
            "title": "title 2",
            "content": "content 2"
        }, {
            "title": "title 3",
            "content": "content 3"
        }
    ],
};

Validation.validate(params, validations);
```

### 4.11 条件判断型验证器(尚未实现)

条件判断型验证器都以"If"开头。

如果条件不满足，则条件验证器后面的规则都不检测，忽略当前这条验证规则。

比如你想招聘一批模特，男的要求180以上，女的要求170以上，验证可以这样写：
```js
let validations = {
    "sex": "StrIn:male,female",
    "height": [
        "IfStrEq:sex,male|IntGe:180",
        "IfStrEq:sex,female|IntGe:170",
    ],
};
```
参数"sex"的值不同，参数"height"的验证规则也不一样。

除了`IfExist`和`IfNotExist`，其它的条件验证器 IfXxx 都要求*条件参数*必须存在。如果希望*条件参数*是可选的，那么可以结合`IfExist`或`IfNotExist`一起使用, 如:
```js
"IfExist:sex|IfStrEq:sex,male|IntGe:180"
```

注意：  
设计条件验证器的主要目的是根据一个参数的取值不同，对另外一个参数应用不同的验证规则。  
"IfXxx:"的后面应该是另一个参数的名称，而不是当前参数，这一点一定要注意。  
比如上面的例子中，是根据参数"sex"的取值不同，对参数"height"应用了不同的验证规则，"IfXxx:"后面跟的是"sex"。

完整的条件判断型验证器的列表参考附录 A.10 。

### 4.12 验证规则并联（或）

多条验证规则可以并联，它们之间是“或”的关系，如
```js
let validations = {
    "type": [
        "StrIn:small,middle,large",
        "IntIn:1,2,3",
    ],
};
```
上面这条验证要求参数"type"既可以是字符串"small", "middle"或"large"，也可以整型的1, 2或3

验证规则并联不是简单的“或”的关系，具体验证流程如下：
1. 按顺序验证这些规则，如果有一条验证规则通过, 则该参数验证通过。
2. 如果全部验证规则都被忽略（If验证器条件不满足，或者没有Required验证器并且该参数不存在，或者有0条验证规则），也算参数验证通过。
3. 上面两条都不满足, 则该参数验证失败。

这些规则如果要完全理清并不是一件容易的事，所以不建议使用验证规则并联，也尽量不要设计需要这种验证方式的参数。

### 4.13 关于特殊值`null`，`undefined`，`""`，`0`，`false`的问题

这些特殊的值是不等价的，它们是不同的数据类型（需要用不同的验证器去验证）：
* `""`是字符串。
* `0`是整型。
* `false`是bool型。
* `null`或`undefined`是js的特殊值。在本工具中它有特殊的含义。

如果某个参数的值为`null`或`undefined`，则本工具会视为该参数不存在。

比如下面两个Map对于本工具来说是等价的.
```js
let params = {
    "name": "hello"
};
```
与
```js
let params = {
  "name": "hello",
  "comment": null
};
```
是等价的。

为什么本工具会将参数的值为`null`等价为该参数不存在？

因为常规的HTTP请求无法传递`null`值，一般情况下客户端如果要发送一个值为`null`的参数，实际的HTTP请求中是没有这个参数的，这样处理歧义是最小的。

但是有一些客户端不是这么处理的，而是将`null`值转换为字符串`"null"`传递。这种情况服务端很难正确处理，因为无法知道客户端传递的原始值是`null`值还是字符串`"null"`。

如果非要从客户端传递`null`值，那只能把所有参数转换为json格式作为Body以POST方式发送请求，并且`Content-Type`要设置为`application/json`；然后服务端要手动把json格式的body解析出来，因为servlet的 ServletRequest 不会解析 json 格式的body。

### 4.14 关于基本数据类型与字符串的关系

对于以下url地址
```
http://abc.com/index.php?p1=&&p2=hello&&p3=123
```
我们将得到的参数数组：
```js
let params = {
    "p1": "",
    "p2": "hello",
    "p3": "123"
};
```
*注意*：
* 参数"p1"的值为空字符串`""`，而不是`null`。
* 参数"p3"的值为字符串`"123"`，而不是数值`123`。
* GET方式的HTTP请求是传递不了`null`值的。

本工具的所有验证器都是**强类型**的，IntXxx和FloatXxx验证的是数值，StrXxx验证的是字符串型，数据类型不匹配，验证是通不过的。但是字符串类型是个例外。

因为常规的HTTP请求，所有的基本数据类型最终都会转换成字符串，所以：
* 数值`123`和字符串`"123"`均可以通过验证器IntXxx的验证；
* 数值`123.0`和字符串`"123.0"`均可以通过验证器FloatXxx的验证；
* boolean型`true`和字符串`"true"`均可以通过验证器BoolXxx的验证；
* `null`和字符串`"null"`永远不等价，字符串`"null"`就只是普通的字符串。
* `undefined`和字符串`"undefined"`永远不等价，字符串`"undefined"`就只是普通的字符串。

### 4.15 自定义错误信息输出文本

如果参数验证不通过，`Validation.validate()`方法会抛出异常，这个异常会包含验证不通过的错误信息描述的文本。

但是这个描述文本对用户来说可能不那么友好，我们可以通过两个伪验证器来自定义这些文本：
* `Alias` 用于自定义参数名称（这个名称会与内部的错误信息模版相结合，生成最终的错误信息描述文本）
* `>>>` 用于自定义错误描述文本（这个文本会完全取代模版生成的错误描述文本）。

看下面的例子：

```js
let params = {
    "title": "a"
};
Validation.validate(params, {
    "title": "Required|StrLenGeLe:2,50",
}); // 抛出异常的错误描述为：“title”长度必须在 2 - 50 之间
Validation.validate(params, {
    "title": "Required|StrLenGeLe:2,50|Alias:标题", // 自定义参数名称
}); // 抛出异常的错误描述为：“标题”长度必须在 2 - 50 之间
Validation.validate(params, {
    "title": "Required|StrLenGeLe:2,50|>>>:标题长度应在2~50之间", // 自定义错误信息描述文本
}); // 抛出异常的错误描述为：标题长度应在2~50之间
```
参考附录A.11获取更详细的信息

### 4.16 国际化

#### 4.16.1 设置当前语言

```js
Validation.setLang('zh_CN'); // （必选）设置Validation类的当前语言
MyValidation.setLang('zh_CN'); // （必选）设置子类的当前语言
```

至少要调用一次`setLang()`方法，因为默认不会下载任何语言包，调用此方法会触发语言包的下载。
并且要在实际使用 Validation 类之前调用。建议在程序初始化时调用，比如在main.js中调用

可以在程序运行过程中调用以动态切换当前语言。

#### 4.16.2 设置默认语言

默认语言的作用是：  
如果没有找到当前语言的翻译项，则会到默认语言的翻译表中去查找，以避免由于某些语言没有提供翻译项，导致无法翻译的问题。

```js
Validation.setDefaultLang(lang); // 设置 Validation 类的默认语言
MyValidation.setDefaultLang(lang); // 设置子类 MyValidation类的默认语言
```

这是可选操作。 如果不设置，默认语言初始值为'en_US'。

建议在`setLang()`之前调用，因为`setLang()`会触发语言包的下载。在`setLang()`之后再调用`setDefaultLang()`修改默认语言，可能会触发下载新的语言包，拖慢页面加载速度

#### 4.16.3 翻译表的优先级

翻译表的作用是当参数验证失败时，会抛出异常，异常的message会使用翻译表翻译成本地语言，以准确提示用户验证失败的原因。

Validation类可以通过多级继承的方式来提供多级翻译表，优先级高的翻译表中的项会覆盖优先级低的翻译表中的同名的项。

翻译表优先级从高到低依次是：
1. 子类的翻译表
2. 父类的翻译表
3. Validation类的翻译表（默认为空）
4. Validation类的内置翻译表（提供了几种内置语言的翻译表，如zh_CN, en_US等）

在翻译时，会依次从上述翻译表中查找要翻译的文本

#### 4.16.4 自定义翻译表

有两种方式来自定义翻译表：
* 继承Validation类，在子类中提供静态翻译表
* 动态注入翻译表：调用`setTranslations()`向当前类中注入指定语言的翻译表

二者可以结合使用，即可以在子类中提供静态的翻译表，同时又可以调用子类的`setTranslations()`方法动态注入翻译表

#### 4.16.5 在继承类中提供静态翻译表

在Validation的子类中创建一个名为"_langToTranslations"的静态属性，即为该子类的翻译表，如：
```js
class MyValidation extends Validation {

  /**
   * 翻译表。key = 语言代码, value = 该语言的翻译表
   * @private 因为子类要间接访问此属性，所以不能真的设置为私有，只能打上 @private 标记
   */
  static _langToTranslations = {
    zh_CN: {
      CustomStartWith: '“{{param}}”必须以"{{prefix}}"开头',
      CustomPhoneCN: '“{{param}}”必须是一个有效的11位手机号',
    },
    en_US: {
      CustomStartWith: '{{param}} must start with "{{prefix}}"',
      CustomPhoneCN: '{{param}} must be a valid 11-digit mobile phone number',
    }
  }
}
```

可以利用该机制为自定义验证器提供翻译项。

#### 4.16.6 动态注入翻译表

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

## A 附录 - 验证器列表

### A.1 整型

整型验证器全部以"Int"开头。

| 整型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Int | Int | “{{param}}”必须是整数 |
| IntEq | IntEq:100 | “{{param}}”必须等于 {{value}} |
| IntNe | IntNe:100 | “{{param}}”不能等于 {{value}} |
| IntGt | IntGt:100 | “{{param}}”必须大于 {{min}} |
| IntGe | IntGe:100 | “{{param}}”必须大于等于 {{min}} |
| IntLt | IntLt:100 | “{{param}}”必须小于 {{max}} |
| IntLe | IntLe:100 | “{{param}}”必须小于等于 {{max}} |
| IntGtLt | IntGtLt:1,100 | “{{param}}”必须大于 {{min}} 小于 {{max}} |
| IntGeLe | IntGeLe:1,100 | “{{param}}”必须大于等于 {{min}} 小于等于 {{max}} |
| IntGtLe | IntGtLe:1,100 | “{{param}}”必须大于 {{min}} 小于等于 {{max}} |
| IntGeLt | IntGeLt:1,100 | “{{param}}”必须大于等于 {{min}} 小于 {{max}} |
| IntIn | IntIn:2,3,5,7,11 | “{{param}}”只能取这些值: {{valueList}} |
| IntNotIn | IntNotIn:2,3,5,7,11 | “{{param}}”不能取这些值: {{valueList}} |

### A.2 长整型

整型验证器全部以"Long"开头。

| 整型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Long | Long | “{{param}}”必须是长整数 |
| LongEq | LongEq:100 | “{{param}}”必须等于 {{value}} |
| LongNe | LongNe:100 | “{{param}}”不能等于 {{value}} |
| LongGt | LongGt:100 | “{{param}}”必须大于 {{min}} |
| LongGe | LongGe:100 | “{{param}}”必须大于等于 {{min}} |
| LongLt | LongLt:100 | “{{param}}”必须小于 {{max}} |
| LongLe | LongLe:100 | “{{param}}”必须小于等于 {{max}} |
| LongGtLt | LongGtLt:1,100 | “{{param}}”必须大于 {{min}} 小于 {{max}} |
| LongGeLe | LongGeLe:1,100 | “{{param}}”必须大于等于 {{min}} 小于等于 {{max}} |
| LongGtLe | LongGtLe:1,100 | “{{param}}”必须大于 {{min}} 小于等于 {{max}} |
| LongGeLt | LongGeLt:1,100 | “{{param}}”必须大于等于 {{min}} 小于 {{max}} |
| LongIn | LongIn:2,3,5,7,11 | “{{param}}”只能取这些值: {{valueList}} |
| LongNotIn | LongNotIn:2,3,5,7,11 | “{{param}}”不能取这些值: {{valueList}} |

### A.3 浮点型

内部一律使用双精度浮点数来处理

| 浮点型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Float | Float | “{{param}}”必须是浮点数 |
| FloatGt | FloatGt:1.0 | “{{param}}”必须大于 {{min}} |
| FloatGe | FloatGe:1.0 | “{{param}}”必须大于等于 {{min}} |
| FloatLt | FloatLt:1.0 | “{{param}}”必须小于 {{max}} |
| FloatLe | FloatLe:1.0 | “{{param}}”必须小于等于 {{max}} |
| FloatGtLt | FloatGtLt:0,1.0 | “{{param}}”必须大于 {{min}} 小于 {{max}} |
| FloatGeLe | FloatGeLe:0,1.0 | “{{param}}”必须大于等于 {{min}} 小于等于 {{max}} |
| FloatGtLe | FloatGtLe:0,1.0 | “{{param}}”必须大于 {{min}} 小于等于 {{max}} |
| FloatGeLt | FloatGeLt:0,1.0 | “{{param}}”必须大于等于 {{min}} 小于 {{max}} |

### A.4 bool型

| bool型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Bool | Bool | 合法的取值为: `true`, `false`, `"true"`, `"false"`（忽略大小写） |
| BoolTrue | BoolTrue | 合法的取值为: `true`, `"true"`（忽略大小写） |
| BoolFalse | BoolFalse | 合法的取值为: `false`,`"false"`（忽略大小写） |
| BoolSmart | BoolSmart | 合法的取值为: `true`, `false`, `"true"`, `"false"`, `1`, `0`, `"1"`, `"0"`, `"yes"`, `"no"`, `"y"`, `"n"`（忽略大小写） |
| BoolSmartTrue | BoolSmartTrue | 合法的取值为: `true`, `"true"`, `1`, `"1"`, `"yes"`, `"y"`（忽略大小写） |
| BoolSmartFalse | BoolSmartFalse | 合法的取值为: `false`, `"false"`, `0`, `"0"`, `"no"`, `"n"`（忽略大小写） |

### A.5 字符串型

| 字符串型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Str | Str | “{{param}}”必须是字符串 |
| StrEq | StrEq:abc | “{{param}}”必须等于"{{value}}" |
| StrEqI | StrEqI:abc | “{{param}}”必须等于"{{value}}"（忽略大小写） |
| StrNe | StrNe:abc | “{{param}}”不能等于"{{value}}" |
| StrNeI | StrNeI:abc | “{{param}}”不能等于"{{value}}"（忽略大小写） |
| StrIn | StrIn:abc,def,g | “{{param}}”只能取这些值: {{valueList}} |
| StrInI | StrInI:abc,def,g | “{{param}}”只能取这些值: {{valueList}}（忽略大小写） |
| StrNotIn | StrNotIn:abc,def,g | “{{param}}”不能取这些值: {{valueList}} |
| StrNotInI | StrNotInI:abc,def,g | “{{param}}”不能取这些值: {{valueList}}（忽略大小写） |
| StrLen | StrLen:8 | “{{param}}”长度必须等于 {{length}} |
| StrLenGe | StrLenGe:8 | “{{param}}”长度必须大于等于 {{min}} |
| StrLenLe | StrLenLe:8 | “{{param}}”长度必须小于等于 {{max}} |
| StrLenGeLe | StrLenGeLe:6,8 | “{{param}}”长度必须在 {{min}} - {{max}} 之间 |
| Letters | Letters | “{{param}}”只能包含字母 |
| Alphabet | Alphabet | 同Letters |
| Numbers | Numbers | “{{param}}”只能是纯数字 |
| Digits | Digits | 同Numbers |
| LettersNumbers | LettersNumbers | “{{param}}”只能包含字母和数字 |
| Numeric | Numeric | “{{param}}”必须是数值。一般用于大数处理（超过double表示范围的数,一般会用字符串来表示）（尚未实现大数处理）, 如果是正常范围内的数, 可以使用IntXxx或FloatXxx来检测 |
| VarName | VarName | “{{param}}”只能包含字母、数字和下划线，并且以字母或下划线开头 |
| Email | Email | “{{param}}”必须是合法的email |
| Url | Url | “{{param}}”必须是合法的Url地址 |
| Ip | Ip | “{{param}}”必须是合法的IP地址 |
| Mac | Mac | “{{param}}”必须是合法的MAC地址 |
| Regexp | Regexp:/^abc$/ | Perl正则表达式匹配 |

### A.6 数组型

| 数组型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| List | List | “{{param}}”必须是数组或List |
| ListLen | ListLen:5 | “{{param}}”长度必须等于 {{length}} |
| ListLenGe | ListLenGe:1 | “{{param}}”长度必须大于等于 {{min}} |
| ListLenLe | ListLenLe:9 | “{{param}}”长度必须小于等于 {{max}} |
| ListLenGeLe | ListLenGeLe:1,9 | “{{param}}”组度必须在 {{min}} ~ {{max}} 之间 |
| Arr | Arr | “{{param}}”必须是数组或List |
| ArrLen | ArrLen:5 | “{{param}}”长度必须等于 {{length}} |
| ArrLenGe | ArrLenGe:1 | “{{param}}”长度必须大于等于 {{min}} |
| ArrLenLe | ArrLenLe:9 | “{{param}}”长度必须小于等于 {{max}} |
| ArrLenGeLe | ArrLenGeLe:1,9 | “{{param}}”组度必须在 {{min}} ~ {{max}} 之间 |

### A.7 Map型

| Map型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Map | Map | “{{param}}”必须是 Map<String, Object> |

### A.8 文件型

*尚未实现*

| 文件型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| File | File | “{{param}}”必须是文件 |
| FileMaxSize | FileMaxSize:10mb | “{{param}}”必须是文件, 且文件大小不超过{{size}} |
| FileMinSize | FileMinSize:100kb | “{{param}}”必须是文件, 且文件大小不小于{{size}} |
| FileImage | FileImage | “{{param}}”必须是图片 |
| FileVideo | FileVideo | “{{param}}”必须是视频文件 |
| FileAudio | FileAudio | “{{param}}”必须是音频文件 |
| FileMimes | FileMimes:mpeg,jpeg,png | “{{param}}”必须是这些MIME类型的文件:{{mimes}} |

### A.9 日期和时间型

| 日期和时间型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Date | Date | “{{param}}”必须是合法的日期，格式为：YYYY-MM-DD |
| DateFrom | DateFrom:2017-04-13 | “{{param}}”不得早于 {{from}} |
| DateTo | DateTo:2017-04-13 | “{{param}}”不得晚于 {{to}} |
| DateFromTo | DateFromTo:2017-04-13,2017-04-13 | “{{param}}”必须在 {{from}} ~ {{to}} 之间 |
| DateTime | DateTime | “{{param}}”必须是合法的日期时间，格式为：YYYY-MM-DD HH:mm:ss |
| DateTimeFrom | DateTimeFrom:2017-04-13 12:00:00 | “{{param}}”不得早于 {{from}} |
| DateTimeTo | DateTimeTo:2017-04-13 12:00:00 | “{{param}}”必须早于 {{to}} |
| DateTimeFromTo | DateTimeFromTo:2017-04-13 12:00:00,2017-04-13 12:00:00 | “{{param}}”必须在 {{from}} ~ {{to}} 之间 |

### A.10 条件判断型(尚未实现)

在一条验证规则中，条件验证器必须在其它验证器前面，多个条件验证器可以串联。

注意，条件判断中的“条件”一般是检测**另外一个参数**的值，而当前参数的值是由串联在条件判断验证器后面的其它验证器来验证。

| 条件判断型验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| If|  If:selected |  如果参数"selected"值等于 1, true, "1", "true", "yes"或 "y"(字符串忽略大小写) |
| IfNot|  IfNot:selected |  如果参数"selected"值等于 0, false, "0", "false", "no"或"n"(字符串忽略大小写) |
| IfTrue|  IfTrue:selected |  如果参数"selected"值等于 true 或 "true"(忽略大小写) |
| IfFalse|  IfFalse:selected |  如果参数"selected"值等于 false 或 "false"(忽略大小写) |
| IfExist|  IfExist:var |  如果参数"var"存在 |
| IfNotExist|  IfNotExist:var |  如果参数"var"不存在 |
| IfIntEq|  IfIntEq:var,1 |  if (var == 1) |
| IfIntNe|  IfIntNe:var,2 |  if (var != 2). 特别要注意的是如果条件参数var的数据类型不匹配, 那么If条件是成立的; 而其它几个IfIntXx当条件参数var的数据类型不匹配时, If条件不成立 |
| IfIntGt|  IfIntGt:var,0 |  if (var > 0) |
| IfIntLt|  IfIntLt:var,1 |  if (var < 1) |
| IfIntGe|  IfIntGe:var,6 |  if (var >= 6) |
| IfIntLe|  IfIntLe:var,8 |  if (var <= 8) |
| IfIntIn|  IfIntIn:var,2,3,5,7 |  如果var的值等于2,3,5,7中的某一个 |
| IfIntNotIn|  IfIntNotIn:var,2,3,5,7 |  如果var的值不等于2,3,5,7中的任何一个 |
| IfLongEq|  IfLongEq:var,1 |  if (var == 1L) |
| IfLongNe|  IfLongNe:var,2 |  if (var != 2L). 特别要注意的是如果条件参数var的数据类型不匹配, 那么If条件是成立的; 而其它几个IfLongXx当条件参数var的数据类型不匹配时, If条件不成立 |
| IfLongGt|  IfLongGt:var,0 |  if (var > 0L) |
| IfLongLt|  IfLongLt:var,1 |  if (var < 1L) |
| IfLongGe|  IfLongGe:var,6 |  if (var >= 6L) |
| IfLongLe|  IfLongLe:var,8 |  if (var <= 8L) |
| IfLongIn|  IfLongIn:var,2,3,5,7 |  如果var的值等于2L,3L,5L,7L中的某一个 |
| IfLongNotIn|  IfLongNotIn:var,2,3,5,7 |  如果var的值不等于2L,3L,5L,7L中的任何一个 |
| IfStrEq|  IfStrEq:var,waiting |  if ("waiting".equals(var)) |
| IfStrNe|  IfStrNe:var,editing |  if (!"editing".equals(var)). 特别要注意的是如果条件参数var的数据类型不匹配, 那么If条件是成立的; 而其它几个IfStrXx当条件参数var的数据类型不匹配时, If条件不成立 |
| IfStrGt|  IfStrGt:var,a |  if (var.compareTo("a") > 0) |
| IfStrLt|  IfStrLt:var,z |  if (var.compareTo("z") < 0) |
| IfStrGe|  IfStrGe:var,A |  if (var.compareTo("A") >= 0) |
| IfStrLe|  IfStrLe:var,Z |  if (var.compareTo("Z") <= 0) |
| IfStrIn|  IfStrIn:var,normal,warning,error |  如果var的值等于"normal", "warning", "error"中的某一个 |
| IfStrNotIn|  IfStrNotIn:var,warning,error |  如果var的值不等于"normal", "warning", "error"中的任何一个 |

### A.11 其它验证器

| 其它验证器 | 示例 | 说明 |
| :------| :------ | :------ |
| Required | Required | 待验证的参数是必需的。如果验证器串联，除了条件型验证器外，必须为第一个验证器 |
| Alias | Alias:参数名称 | 自定义错误提示文本中的参数名称（必须是最后一个验证器） |
| \>>> | \>>>:这是自定义错误提示文本 | 自定义错误提示文本（与Alias验证器二选一，必须是最后一个验证器） |
| 自定义Java函数，Lambda表达式 |  | 暂不提供该机制，因为如果遇到本工具不支持的复杂参数验证，你可以直接写Java代码来验证，不需要再经由本工具来验证（否则就是脱裤子放屁，多此一举） |
