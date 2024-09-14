import { ValidationException } from "./ValidationException.js";
import { checkAndParseInt, checkAndParseLong, checkAndParseDate, checkAndParseDateTime } from "./ValidationUtil.js";

export default class Validation {
  // region 基本功能

  /**
   * 参数验证
   * 此方法主要用于后端API接口的参数验证
   * @param params 包含待验证参数的Map
   * @param rules 验证规则。格式示例: [
   *   "name": "Required|StrLenGeLe:2,50",
   *   "sex": "Required|StrIn:male,female",
   *   "age": "Required|IntGeLe:18,60",
   *   "height": [
   *     "IfStrEq:male|IntGe:180",
   *     "IfStrEq:female|IntGe:170",
   *   ]
   * ]
   * @param ignoreRequired 是否忽略验证规则中的"Required"验证器
   */
  static validate(params, rules, ignoreRequired) {
    if (typeof params !== 'object' || params === null) {
      throw new Error('参数params必须是object');
    }
    for (let keyPath of Object.keys(rules)) {
      let validations = rules[keyPath];
      let keys = this._compileKeyPath(keyPath);
      this._validate(params, keys, validations, '', ignoreRequired);
    }
  }

  /**
   *
   * @param params
   * @param keys
   * @param ruleStrings
   * @param keyPrefix
   * @param ignoreRequired
   * @protected 此方法不能是私有方法，因为子类需要访问
   */
  static _validate(params, keys, ruleStrings, keyPrefix, ignoreRequired) {

    let keyPath = keyPrefix;
    let siblings = params;
    let value = params;

    let keysCount = keys.length;

    let n = 0;
    for (; n < keysCount; n++) {
      siblings = value;
      keyPrefix = keyPath;

      let key = keys[n];
      if (key === '*') {
        let siblingsList = this.validateArr(siblings, null, keyPrefix);
        let c = siblingsList.length;
        if (c > 0) {
          let subKeys = keys.subarray(n + 1, keysCount);
          let subKeysCount = keysCount - n - 1;
          for (let i = 0; i < c; i++) {
            let element = siblingsList.get(i);
            keyPath = keyPrefix + "[" + i + "]";
            if (subKeysCount > 0) {
              this._validate(element, subKeys, ruleStrings, keyPath, ignoreRequired);
            } else {
              this._validateValue(element, ruleStrings, keyPath, ignoreRequired, params, siblingsList);
            }
          }
          return;
        } else { // 'items[*]' => 'Required' 要求items至少有1个元素, 但上面的循环不检测items==[]的情况
          value = null; // 这里是针对$value==[]这种情况的特殊处理
        }
      } else {
        if (typeof key === 'number') {
          siblings = this.validateArr(siblings, null, keyPrefix);
          value = (key < 0 || key >= siblings.length) ? null : siblings.get(key);
        } else {
          this.validateMap(siblings, null, keyPrefix);
          value = siblings[key];
        }
      } // end if key != "*"

      if (keyPrefix.length === 0)
        keyPath = key;
      else if (typeof key === "number" || key === '*')
        keyPath = keyPrefix + "[" + key + "]";
      else
        keyPath = keyPrefix + "." + key;

      if (value === undefined || value == null) {
        n++;
        break;
      }
    }

    // 到这里n表示当前的value是第几层
    if (n === keysCount) {
      this._validateValue(value, ruleStrings, keyPath, ignoreRequired, params, siblings);
    }
  }

  /**
   *
   * @param keyPath
   * @return string[]
   * @protected 此方法不能是私有方法，因为子类需要访问
   */
  static _compileKeyPath(keyPath) {
    if (keyPath.length === 0)
      throw new Error("参数rules中包含空的参数名称");
    if (!/^[a-zA-Z0-9_.\[\]*]+$/.test(keyPath))
      throw new Error(`非法的参数名称“${keyPath}”`);
    let keys = keyPath.split('.');
    let filteredKeys = [];
    for (let key of keys) {
      if (key.length === 0)
        throw new Error(`“${keyPath}”中包含空的参数名称`);
      let i = key.indexOf('[');
      if (i === -1) { // 普通的key
        if (key.indexOf('*') >= 0)
          throw new Error(`“${keyPath}”中'*'号只能处于方括号[]中`);
        if (key.indexOf(']') >= 0)
          throw new Error(`“${key}”中包含了非法的']'号`);
        let firstChar = key[0];
        if (firstChar >= '0' && firstChar <= '9') {
          if (keys.length === 1)
            throw new Error(`参数名称“${keyPath}”不得以数字开头`);
          else
            throw new Error(`“${keyPath}”中包含了以数字开头的参数名称“${key}”`);
        }
        filteredKeys.push(key);
      } else if (i === 0) {
        throw new Error(`“${keyPath}”中'['号前面没有参数名称`);
      } else { // 有数组索引的 key path
        let j = key.indexOf(']');
        if (j === -1)
          throw new Error(`“${keyPath}”中的'['号之后缺少']'`);
        else if (i > j)
          throw new Error(`“${keyPath}”中'[', ']'顺序颠倒了`);

        // 识别普通数组的变量名（'[*]'之前的部分）
        let varName = key.substring(0, i);
        if (varName.indexOf('*') >= 0)
          throw new Error(`“${key}”中包含了非法的'*'号`);
        let firstChar = varName[0];
        if (firstChar >= '0' && firstChar <= '9')
          throw new Error(`“${keyPath}”中包含了以数字开头的参数名称“${key}”`);
        filteredKeys.add(varName);

        // 识别普通数组的索引值
        let index = key.substring(i + 1, j);
        if (index === '*') {
          filteredKeys.add(index);
        } else if (Number.isInteger(index) && index >= 0) {
          filteredKeys.add(parseInt(index));
        } else {
          throw new Error(`“${key}”中的方括号[]之间只能包含'*'号或数字`);
        }

        // 尝试识别多维数组
        let len = key.length;
        while (j < len - 1) {
          j++;
          i = key.indexOf('[', j);
          if (i !== j)
            throw new Error(`“${key}”中的“${index}”之后包含非法字符`);
          j = key.indexOf(']', i);
          if (j === -1)
            throw new Error(`“${key}”中的'['号之后缺少']'`);

          index = key.substring(i + 1, j);
          if (index === "*") {
            filteredKeys.add(index);
          } else if (Number.isInteger(index) && index >= 0) {
            filteredKeys.add(parseInt(index));
          } else {
            throw new Error(`“${key}”中的方括号[]之间只能包含'*'号或数字`);
          }
        }
      }
    } // end for (let key of keys)
    return filteredKeys;
  }

  /**
   * 验证规则缓存
   * key = 验证规则。如"Required|IntGt:0|Alias:用户ID"
   * value = 验证规则编译后的 Validator 对象
   * @protected
   */
  static #cachedRules = {};

  /**
   *
   * @param value
   * @param rules string | string[]
   * @param alias 如果验证规则中包含'Alias:xxx'，则这个参数可以不传；否则一定要传
   * @return 返回value原值
   */
  static validateValue(value, rules, alias) {
    return this._validateValue(value, rules, alias);
  }

  /**
   *
   * @param value
   * @param ruleStrings
   * @param alias
   * @param ignoreRequired
   * @protected 此方法不能是私有方法，因为子类需要访问
   */
  static _validateValue(
    value,
    ruleStrings,
    alias,
    ignoreRequired,
    // originParams,
    // siblings
  ) {
    if (!ruleStrings || ruleStrings.length === 0)
      throw new ValidationException("没有提供验证规则");

    let validators = typeof ruleStrings === 'string' ? [ruleStrings] : ruleStrings;

    /*
     * 一个参数可以有一条或多条validator, 检测是否通过的规则如下:
     * 1. 如果有一条validator检测成功, 则该参数检测通过
     * 2. 如果即没有成功的也没有失败的（全部validator都被忽略或者有0条validator）, 也算参数检测通过
     * 3. 上面两条都不满足, 则参数检测失败
   */
    let success = 0;
    let failed = 0;
    let lastValidationException;

    for (let strValidator of validators) {
      if (strValidator.length === 0) {
        success++;
        continue;
      }
      let validator = this._compileValidator(strValidator);
      let validatorUnits = validator.units;

      try {
        let countOfIfs = validator.countOfIfs;
        let countOfUnits = validatorUnits.length;

        let aAlias = validator.alias ? validator.alias : alias;

        let i = 0;
        // ...条件验证器检测

        if (i < countOfIfs) // 有If条件不满足, 忽略本条验证规则
          continue;

        if (value == null) { // 没有提供参数
          if (!validator.required || ignoreRequired)
            continue; // 忽略本条验证规则

          this._throwIfHasReason(validator.reason);

          aAlias = this._finalAlias(aAlias);
          this._throwWithErrorTemplate("Required", "{{param}}", aAlias);
        }

        for (i = countOfIfs; i < countOfUnits; i++) {
          let validatorUnit = validatorUnits[i];
          let validatorName = validatorUnit[0];

          let params = [value];
          for (let j = 1; j < validatorUnit.length; j++) {
            params.push(validatorUnit[j]);
          }
          params.push(validator.reason, aAlias);
          this['validate' + validatorName].apply(this, params);
        }

        success++;
        break; // 多个validator只需要一条验证成功即可
      } catch (e) {
        lastValidationException = e;
        failed++;
      }
    }

    if (success > 0 || failed === 0)
      return value;

    throw lastValidationException; // 此时 success == 0 && failed > 0
  }

  /**
   * 将字符串验证器编译为Validator对象
   * 示例1:
   * 输入: $validator = 'StrLen:6,16|regex:/^[a-zA-Z0-9]+$/'
   * 输出: [
   *   'countOfIfs' => 0,
   *   'required' => false,
   *   'reason' => null,
   *   'alias' => $alias,
   *   'units' => [
   *     ['StrLen', 6, 16],
   *     ['regex', '/^[a-zA-Z0-9]+$/'],
   *   ],
   * ]
   * 示例2（自定义验证失败的提示）:
   * 输入: validator = 'StrLen:6,16|regex:/^[a-zA-Z0-9]+$/|>>>:参数验证失败了'
   * 输出: [
   *   'countOfIfs' => 0,
   *   'required' => false,
   *   'reason' => "参数验证失败了",
   *   'alias' => $alias,
   *   'units' => [
   *     ['StrLen', 6, 16],
   *     ['regex', '/^[a-zA-Z0-9]+$/'],
   *   ],
   * ]
   *
   * @param strValidator 一条验证字符串
   * @return Array 返回Validator
   * @protected 此方法不能是私有方法，因为子类需要访问
   */
  static _compileValidator(strValidator) {

    let validator = Validation.#cachedRules[strValidator];
    if (!validator)
      validator = new Validator();

    // if (strValidator.length === 0); // 外部函数已经检测过了, 不可能出现strValidator为空串

    let countOfIfs = 0;
    let required = false;
    let customReason = null;
    let alias = null;
    let units = [];

    let segments = strValidator.split('|');
    let segCount = segments.length;
    for (let i = 0; i < segCount; ) {
      let segment = segments[i];
      i++;

      if (segment.startsWith("Regexp:")) { // 是正则表达式
        if (segment.indexOf('/', 7) !== 7) // 非法的正则表达. 合法的必须首尾加/
          throw new ValidationException("正则表达式验证器Regexp格式错误. 正确的格式是 Regexp:/xxxx/");

        let pos = 8;
        let len = segment.length;

        let finish = false;
        do {
          let pos2 = segment.lastIndexOf('/'); //反向查找字符/
          if (pos2 !== len - 1 || // 不是以/结尾, 说明正则表达式中包含了|分隔符, 正则表达式被explode拆成了多段
            pos2 === 7) { // 第1个/后面就没字符了, 说明正则表达式中包含了|分隔符, 正则表达式被explode拆成了多段
            // do nothing
          } else { // 以/结尾, 可能是完整的正则表达式, 也可能是不完整的正则表达式
            do {
              pos = segment.indexOf('\\', pos); // 从前往后扫描转义符\
              if (pos === -1) { // 结尾的/前面没有转义符\, 正则表达式扫描完毕
                finish = true;
                break;
              } else if (pos === len - 1) { // 不可能, $len-1这个位置是字符/
                // do nothing
              } else if (pos === len - 2) { // 结尾的/前面有转义符\, 说明/只是正则表达式内容的一部分, 正则表达式尚未结束
                pos += 3; // 跳过“\/|”三个字符
                break;
              } else {
                pos += 2;
              }
              // eslint-disable-next-line no-constant-condition
            } while (true);

            if (finish)
              break;
          }

          if (i >= segCount)
            throw new ValidationException("正则表达式验证器Regexp格式错误. 正确的格式是 Regexp:/xxxx/");

          segment = segment + '|';
          segment = segment + segments[i]; // 拼接后面一个segment
          len = segment.length;
          i++;
          // eslint-disable-next-line no-constant-condition
        } while (true);
        let regexp = segment.substring(8, segment.length - 1); // 正则表达式要去掉首尾的斜杠/
        let p = new RegExp(regexp);
        units.push(["Regexp", p]);
      } // end if (segment.startsWith("Regexp:")) { // 是正则表达式
      else { // 非正则表达式验证器
        let pos = segment.indexOf(':');
        if (pos === -1) { // 不带参数的验证器
          if (segment === "Required") {
            if (units.length > countOfIfs)
              throw new ValidationException("Required只能出现在验证规则的开头（IfXxx后面）");
            required = true;
          } else {
            let validatorName = segment;
            if (validatorName.indexOf('Custom') === 0) {
              if (validatorName.length === 6)
                throw new ValidationException(`自定义验证器必须以"Custom"开头，但不能是"Custom"`);

              let methodName = 'validate' + validatorName;
              let method = this[methodName];
              if (method === undefined)
                throw new ValidationException(`未知的验证器"${validatorName}"`);
              if (!method instanceof Function)
                throw new ValidationException(`自定义验证器"${validatorName}"必须提供实现方法 ${methodName}()`);

              let pCount = method.length - 3;
              if (pCount < 0) {
                throw new ValidationException(`自定义验证器"${validatorName}"的实现方法 ${methodName}() 应该至少有3个参数`);
              } else if (pCount > 0) {
                throw new ValidationException(`自定义验证器"${validatorName}"应该有 ${pCount} 个参数`);
              }
            }
            units.push([validatorName]);
          }
        } else { // 有冒号:, 是带参数的验证器
          if (pos === 0)
            throw new ValidationException("“" + segment + "”中的':'号前面没有验证器");
          let validatorName = segment.substring(0, pos);
          let p;
          if (pos + 1 === segment.length)
            p = "";
          else
            p = segment.substring(pos + 1);
          let validatorUnit;
          switch (validatorName) {
            case 'IntEq':
            case 'IntNe':
            case 'IntGt':
            case 'IntGe':
            case 'IntLt':
            case 'IntLe': {
              let v = Validation.#parseParamIntOrThrow(p, validatorName);
              validatorUnit = [validatorName, v];
              break;
            }
            case 'LongEq':
            case 'LongNe':
            case 'LongGt':
            case 'LongGe':
            case 'LongLt':
            case 'LongLe': {
              let v = Validation.#parseParamLongOrThrow(p, validatorName);
              validatorUnit = [validatorName, v];
              break;
            }
            case 'StrLen':
            case 'StrLenGe':
            case 'StrLenLe':
            case 'ByteLen':
            case 'ByteLenGe':
            case 'ByteLenLe':
            case 'ListLen':
            case 'ListLenGe':
            case 'ListLenLe':
            case 'ArrLen':
            case 'ArrLenGe':
            case 'ArrLenLe':{
              let v = Validation.#parseParamIntNonNegativeOrThrow(p, validatorName);
              validatorUnit = [validatorName, v];
              break;
            }
            case 'IntGtLt':
            case 'IntGeLe':
            case 'IntGtLe':
            case 'IntGeLt':{
              let vals = p.split(",");
              if (vals.length !== 2)
                Validation.#throwFormatError(validatorName);
              let v1 = Validation.#parseParamIntOrThrow(vals[0], validatorName);
              let v2 = Validation.#parseParamIntOrThrow(vals[1], validatorName);
              validatorUnit = [validatorName, v1, v2];
              break;
            }
            case 'LongGtLt':
            case 'LongGeLe':
            case 'LongGtLe':
            case 'LongGeLt':{
              let vals = p.split(",");
              if (vals.length !== 2)
                Validation.#throwFormatError(validatorName);
              let v1 = Validation.#parseParamLongOrThrow(vals[0], validatorName);
              let v2 = Validation.#parseParamLongOrThrow(vals[1], validatorName);
              validatorUnit = [validatorName, v1, v2];
              break;
            }
            case 'StrLenGeLe':
            case 'ByteLenGeLe':
            case 'ListLenGeLe':
            case 'ArrLenGeLe': {
              let vals = p.split(",");
              if (vals.length !== 2)
                Validation.#throwFormatError(validatorName);
              let v1 = Validation.#parseParamIntNonNegativeOrThrow(vals[0], validatorName);
              let v2 = Validation.#parseParamIntNonNegativeOrThrow(vals[1], validatorName);
              validatorUnit = [validatorName, v1, v2];
              break;
            }
            case 'IntIn':
            case 'IntNotIn': {
              let ints = Validation.#parseParamIntArray(p);
              if (!ints)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, ints];
              break;
            }
            case 'LongIn':
            case 'LongNotIn': {
              let longs = Validation.#parseParamLongArray(p);
              if (!longs)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, longs];
              break;
            }
            case 'StrEq':
            case 'StrNe':
            case 'StrEqI':
            case 'StrNeI': {
              validatorUnit = [validatorName, p];
              break;
            }
            case 'StrIn':
            case 'StrNotIn':
            case 'StrInI':
            case 'StrNotInI': {
              let strings = Validation.#parseParamStrArray(p);
              validatorUnit = [validatorName, strings];
              break;
            }
            case 'IfIntEq':
            case 'IfIntNe':
            case 'IfIntGt':
            case 'IfIntLt':
            case 'IfIntGe':
            case 'IfIntLe': {
              if (units.length > countOfIfs)
                throw new ValidationException("条件验证器 IfXxx 只能出现在验证规则的开头");
              let params = Validation.#parseIfXxxWith1Param1Int(p, validatorName);
              if (!params)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, params[0], params[1]];
              countOfIfs++;
              break;
            }
            case 'IfIntIn':
            case 'IfIntNotIn': {
              if (units.length > countOfIfs)
                throw new ValidationException("条件验证器 IfXxx 只能出现在验证规则的开头");
              let params = Validation.#parseIfXxxWith1ParamNInts(p, validatorName);
              if (!params)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, params[0], params[1]];
              countOfIfs++;
              break;
            }
            case 'IfLongEq':
            case 'IfLongNe':
            case 'IfLongGt':
            case 'IfLongLt':
            case 'IfLongGe':
            case 'IfLongLe': {
              if (units.length > countOfIfs)
                throw new ValidationException("条件验证器 IfXxx 只能出现在验证规则的开头");
              let params = Validation.#parseIfXxxWith1Param1Long(p, validatorName);
              if (!params)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, params[0], params[1]];
              countOfIfs++;
              break;
            }
            case 'IfLongIn':
            case 'IfLongNotIn': {
              if (units.length > countOfIfs)
                throw new ValidationException("条件验证器 IfXxx 只能出现在验证规则的开头");
              let params = Validation.#parseIfXxxWith1ParamNLongs(p, validatorName);
              if (!params)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, params[0], params[1]];
              countOfIfs++;
              break;
            }
            case 'IfStrEq':
            case 'IfStrNe':
            case 'IfStrGt':
            case 'IfStrLt':
            case 'IfStrGe':
            case 'IfStrLe': {
              if (units.length > countOfIfs)
                throw new ValidationException("条件验证器 IfXxx 只能出现在验证规则的开头");
              let params = Validation.#parseIfXxxWith1Param1Str(p, validatorName);
              if (!params)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, params[0], params[1]];
              countOfIfs++;
              break;
            }
            case 'IfStrIn':
            case 'IfStrNotIn': {
              if (units.length > countOfIfs)
                throw new ValidationException("条件验证器 IfXxx 只能出现在验证规则的开头");
              let params = Validation.#parseIfXxxWith1ParamNStrs(p, validatorName);
              if (!params)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, params[0], params[1]];
              countOfIfs++;
              break;
            }
            case 'If':
            case 'IfNot':
            case 'IfExist':
            case 'IfNotExist':
            case 'IfTrue':
            case 'IfFalse': {
              if (units.length > countOfIfs)
                throw new ValidationException("条件验证器 IfXxx 只能出现在验证规则的开头");
              let params = p.split(',');
              if (params.length !== 1)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, params[0]];
              countOfIfs++;
              break;
            }
            case 'FloatGt':
            case 'FloatGe':
            case 'FloatLt':
            case 'FloatLe': {
              let v = Validation.#parseParamDouble(p);
              if (v === null || v === undefined)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, v];
              break;
            }
            case 'FloatGtLt':
            case 'FloatGeLe':
            case 'FloatGtLe':
            case 'FloatGeLt': {
              let strs = p.split(',');
              if (strs.length !== 2)
                Validation.#throwFormatError(validatorName);
              let d1 = Validation.#parseParamDouble(strs[0]);
              let d2 = Validation.#parseParamDouble(strs[1]);
              if (d1 === undefined || d2 === undefined || d1 === null || d2 === null)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, d1, d2];
              break;
            }
            case 'DateFrom':
            case 'DateTo': {
              let date = Validation.#parseParamDate(p);
              if (date === undefined)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, date];
              break;
            }
            case 'DateFromTo': {
              let strs = p.split(',');
              if (strs.length !== 2)
                Validation.#throwFormatError(validatorName);
              let date1 = Validation.#parseParamDate(strs[0]);
              let date2 = Validation.#parseParamDate(strs[1]);
              if (date1 === undefined || date2 === undefined)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, date1, date2];
              break;
            }
            case 'DateTimeFrom':
            case 'DateTimeTo': {
              let timestamp = Validation.#parseParamDateTimeToTimestamp(p);
              if (timestamp === undefined)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, timestamp];
              break;
            }
            case 'DateTimeFromTo': {
              let strs = p.split(',');
              if (strs.length !== 2)
                Validation.#throwFormatError(validatorName);
              let timestamp1 = Validation.#parseParamDateTimeToTimestamp(strs[0]);
              let timestamp2 = Validation.#parseParamDateTimeToTimestamp(strs[1]);
              if (timestamp1 === undefined || timestamp2 === undefined)
                Validation.#throwFormatError(validatorName);
              validatorUnit = [validatorName, timestamp1, timestamp2];
              break;
            }
            case 'FileMimes': {
              throw new ValidationException("暂不支付验证器 " + validatorName);
            }
            case 'FileMaxSize':
            case 'FileMinSize': {
              throw new ValidationException("暂不支付验证器 " + validatorName);
            }
            case '>>>': {
              customReason = p;
              // >>>:之后的所有字符都属于错误提示字符串, 即使其中包含'|'
              for (; i < segCount; i++) {
                customReason = customReason + '|' + segments[i];
              }
              validatorUnit = null;
              break;
            }
            case 'Alias': {
              if (p.length === 0)
                throw new ValidationException("\"Alias:\"后面必须有字符串");
              alias = p;
              validatorUnit = null;
              break;
            }
            default: {
              let methodName = 'validate' + validatorName;
              let method = this[methodName];
              if (validatorName.indexOf('Custom') === 0 && method !== undefined && method instanceof Function) {
                if (validatorName.length === 6)
                  throw new ValidationException('自定义验证器必须以"Custom"开头，但不能是"Custom"');
                let pCount = method.length - 3;
                if (pCount < 0) {
                  throw new ValidationException(`自定义验证器"${validatorName}"的实现方法 ${methodName}() 应该至少有3个参数`);
                } else if (pCount === 0) {
                  throw new ValidationException(`自定义验证器"${validatorName}"应该没有参数`);
                }
                let params = p.split(',');
                if (params.length !== pCount)
                  throw new ValidationException(`自定义验证器"${validatorName}"应该有 ${pCount} 个参数`);
                validatorUnit = [validatorName, ...params];
                break;
              }
              throw new ValidationException("无法识别的验证器“" + segment + "”");
            }
          }
          if (validatorUnit) // 如果是Alias或>>>验证器, validatorUnit==null
            units.push(validatorUnit);
        } // end if 有冒号:, 是带参数的验证器
      } // end else 不是Regexp
    } // end for segments

    validator.countOfIfs = countOfIfs;
    validator.required = required;
    validator.reason = customReason;
    validator.alias = alias;
    validator.units = units;

    Validation.#cachedRules[strValidator] = validator;
    return validator;
  }

  // endregion

  // region 国际化

  /*
   * 内置中英文两种语言。
   * 至少要调用一次 setLang() 方法
   * 内置的翻译表会自动加载到 #langToBuiltinTranslations 中
   * 其它语言的翻译表需要调用 setTranslations() 方法，保存在 _langToTranslations 中
   * 如果要覆盖内置语言的翻译表中的项，也是调用 setTranslations() 方法来设置
   * 翻译时的查找顺序是 _langToTranslations > #langToBuiltinTranslations
   */
  static #lang; // 当前语言
  static #defaultLang = 'en_US'; // 默认语言
  static #langToBuiltinTranslations = {}; // 内置的翻译表：key = lang, value = 内置翻译表builtinTranslations
  /**
   * 翻译表
   * 翻译表中的项会覆盖内置翻译表中的同名的项
   * 子类的翻译表中的项会覆盖父类的翻译表中的同名的项
   * key = lang, value = 翻译表translations
   * @protected
   */
  static _langToTranslations;

  /**
   * 设置默认语言
   * 建议在setLang()之前调用
   * 默认语言初始值为'en_US'
   * 如果当前语言的翻译表中没有找到翻译项，则会到默认语言的翻译表中查找。
   * @param lang
   */
  static setDefaultLang(lang) {
    if (!lang || Validation.#defaultLang === lang)
      return;
    if (lang !== 'zh_CN' && lang !== 'en_US') {
      console.warn(`Validation.setDefaultLang('${lang}'): 不支持默认语言${lang}, 忽略本次调用`);
      return;
    }
    Validation.#defaultLang = lang;
  }

  /**
   * 设置当前语言
   * 会自动动态异步加载内置的语言包
   * @param lang 语言代码，如: zh_CN, en_US等等
   */
  static setLang(lang) {
    if (lang === Validation.#lang)
      return;
    Validation.#lang = lang;

    Validation.#loadBuiltinTranslations();
  }

  static #loadBuiltinTranslations() {
    let loadingLang = Validation.#lang;
    if (loadingLang === undefined)
      return;

    if (loadingLang !== 'zh_CN' && loadingLang !== 'en_US')
      loadingLang = Validation.#defaultLang;

    if (Validation.#langToBuiltinTranslations[loadingLang] !== undefined) // 已加载
      return;

    let asyncErrorTemplates;
    if (loadingLang === 'zh_CN') {
      asyncErrorTemplates = () => import('./zh_CN.js');
    } else if (loadingLang === 'en_US') {
      asyncErrorTemplates = () => import('./en_US.js');
    }

    Validation.#langToBuiltinTranslations[loadingLang] = null; // null表示正在加载

    if (asyncErrorTemplates !== undefined) {
      asyncErrorTemplates().then((module) => {
        Validation.#langToBuiltinTranslations[loadingLang] = module.default;
      }).catch((reason) => {
        console.error(`Validation: 加载内置语言包${loadingLang}失败`, reason);
      })
    }
  }

  /**
   * 设置特定语言的翻译表
   * 如果是调用的Validation类的子类的对象的setTranslations()方法，翻译表会保存在子类的静态属性 _langToTranslations 中
   * 翻译表中的项可以覆盖内置翻译表中的同名项
   * 子类的翻译表中的项可以覆盖父类的翻译表中的同名项
   * @param lang 语言代码
   * @param translations 翻译表
   */
  static setTranslations(lang, translations) {
    if (!lang)
      return;

    if (!this.hasOwnProperty('_langToTranslations') || this._langToTranslations === undefined)
      this._langToTranslations = {};

    this._langToTranslations[lang] = translations;
  }

  /**
   * 从指定语言的翻译表中查找并翻译指定的文本
   * 优先在当前类的翻译表中查找，找不到就沿着继承链到superclass中查找，再找不到就到 Validation 中的内置翻译表中查找
   * @param lang 语言代码
   * @param text 要翻译的文本
   * @returns {string|undefined} 返回翻译后的文本；如果找不到，返回 undefined
   * @private 因为子类要间接调用此方法，所以不能真的设置为私有方法，只能打上 @private 标记
   */
  static __findInTranslationsByLang(lang, text) {
    let cls = this;
    do { // 沿着继承链向上查找
      if (cls.hasOwnProperty('_langToTranslations')) {
        const translationsMap = cls._langToTranslations ? cls._langToTranslations[lang] : undefined;
        if (translationsMap !== undefined) {
          const newText = translationsMap[text];
          if (newText !== undefined && newText.length > 0)
            return newText;
        }
      }
      if (cls === Validation)
        break;
    } while (cls = Object.getPrototypeOf(cls));

    // 从内置翻译表中查找
    let translations = Validation.#langToBuiltinTranslations[lang];
    if (translations !== undefined) {
      const newText = translations[text];
      if (newText !== undefined && newText.length > 0)
        return newText;
    }

    return undefined;
  }

  /**
   * 从当前语言的翻译表中查找并翻译指定的文本
   * 优先在当前类的翻译表中查找，找不到就沿着继承链到superclass中查找，再找不到就到 Validation 中的内置翻译表中查找
   * 如果无法翻译为当前语言（由setLang()方法设置），则尝试翻译为默认语言（由setDefaultLang()方法设置）
   * @param text 待翻译的文本
   * @returns {string|undefined} 返回翻译后的文本；如果在当前语言和默认语言的翻译表中都找不到待翻译的文本，则返回 undefined
   * @private 因为子类要间接调用此方法，所以不能真的设置为私有方法，只能打上 @private 标记
   */
  static __findInTranslations(text) {
    let newText = this.__findInTranslationsByLang(Validation.#lang, text);
    if (newText === undefined && Validation.#lang !== Validation.#defaultLang)
      return this.__findInTranslationsByLang(Validation.#defaultLang, text);
    return newText;
  }

  /**
   * 翻译文本
   * @param text 待翻译的文本
   * @returns {string}
   * @private 因为子类要间接调用此方法，所以不能真的设置为私有方法，只能打上 @private 标记
   */
  static __translateText(text) {
    let translated = this.__findInTranslations(text);
    if (translated === undefined)
      return text;
    return translated;
  }

  /**
   * 生成最终的(翻译后的)Alias
   * @param alias
   * @returns {*|string}
   * @protected
   */
  static _finalAlias(alias) {
    if (!alias || alias.length === 0)
      return "Parameter";
    else
      return this.__translateText(alias);
  }

  // endregion

  // region 错误提示

  // 所有验证器格式示例
  static #sampleFormats = {
    // 整型（不提供length检测,因为负数的符号位会让人混乱, 可以用大于小于比较来做到这一点）
    "Int": "Int",
    "IntEq": "IntEq:100",
    "IntNe": "IntNe:100",
    "IntGt": "IntGt:100",
    "IntGe": "IntGe:100",
    "IntLt": "IntLt:100",
    "IntLe": "IntLe:100",
    "IntGtLt": "IntGtLt:1,100",
    "IntGeLe": "IntGeLe:1,100",
    "IntGtLe": "IntGtLe:1,100",
    "IntGeLt": "IntGeLt:1,100",
    "IntIn": "IntIn:2,3,5,7,11",
    "IntNotIn": "IntNotIn:2,3,5,7,11",

    // 长整型
    "Long": "Long",
    "LongEq": "LongEq:100",
    "LongNe": "LongNe:100",
    "LongGt": "LongGt:100",
    "LongGe": "LongGe:100",
    "LongLt": "LongLt:100",
    "LongLe": "LongLe:100",
    "LongGtLt": "LongGtLt:1,100",
    "LongGeLe": "LongGeLe:1,100",
    "LongGtLe": "LongGtLe:1,100",
    "LongGeLt": "LongGeLt:1,100",
    "LongIn": "LongIn:2,3,5,7,11",
    "LongNotIn": "LongNotIn:2,3,5,7,11",

    // 浮点型（内部一律使用double来处理）
    "Float": "Float",
    "FloatGt": "FloatGt:1.0",
    "FloatGe": "FloatGe:1.0",
    "FloatLt": "FloatLt:1.0",
    "FloatLe": "FloatLe:1.0",
    "FloatGtLt": "FloatGtLt:0,1.0",
    "FloatGeLe": "FloatGeLe:0,1.0",
    "FloatGtLe": "FloatGtLe:0,1.0",
    "FloatGeLt": "FloatGeLt:0,1.0",

    // bool型
    "Bool": "Bool",
    "BoolSmart": "BoolSmart",
    "BoolTrue": "BoolTrue",
    "BoolFalse": "BoolFalse",
    "BoolSmartTrue": "BoolSmartTrue",
    "BoolSmartFalse": "BoolSmartFalse",

    // 字符串
    "Str": "Str",
    "StrEq": "StrEq:abc",
    "StrEqI": "StrEqI:abc",
    "StrNe": "StrNe:abc",
    "StrNeI": "StrNeI:abc",
    "StrIn": "StrIn:abc,def,g",
    "StrInI": "StrInI:abc,def,g",
    "StrNotIn": "StrNotIn:abc,def,g",
    "StrNotInI": "StrNotInI:abc,def,g",
    "StrLen": "StrLen:8",
    "StrLenGe": "StrLenGe:8",
    "StrLenLe": "StrLenLe:8",
    "StrLenGeLe": "StrLenGeLe:6,8",
    "ByteLen": "ByteLen:8",
    "ByteLenGe": "ByteLenGe:8",
    "ByteLenLe": "ByteLenLe:8",
    "ByteLenGeLe": "ByteLenGeLe:6,8",
    "Letters": "Letters",
    "Alphabet": "Alphabet", // 同Letters
    "Numbers": "Numbers",
    "Digits": "Digits", // 同Numbers
    "LettersNumbers": "LettersNumbers",
    "Numeric": "Numeric",
    "VarName": "VarName",
    "Email": "Email",
    "Url": "Url",
    "HttpUrl": "HttpUrl",
    "Ip": "Ip",
    "Ipv4": "Ipv4",
    "Ipv6": "Ipv6",
    "Mac": "Mac",
    "Regexp": "Regexp:/^abc$/", // Perl正则表达式匹配

    // 数组. 如何检测数组长度为0
    "List": "List",
    "ListLen": "ListLen:5",
    "ListLenGe": "ListLenGe:1",
    "ListLenLe": "ListLenLe:9",
    "ListLenGeLe": "ListLenGeLe:1,9",
    "Arr": "Arr",
    "ArrLen": "ArrLen:5",
    "ArrLenGe": "ArrLenGe:1",
    "ArrLenLe": "ArrLenLe:9",
    "ArrLenGeLe": "ArrLenGeLe:1,9",

    // 对象
    "Map": "Map",

    // 文件
    "File": "File",
    "FileMaxSize": "FileMaxSize:10mb",
    "FileMinSize": "FileMinSize:100kb",
    "FileImage": "FileImage",
    "FileVideo": "FileVideo",
    "FileAudio": "FileAudio",
    "FileMimes": "FileMimes:mpeg,jpeg,png",

    // Date & Time
    "Date": "Date",
    "DateFrom": "DateFrom:2017-04-13",
    "DateTo": "DateTo:2017-04-13",
    "DateFromTo": "DateFromTo:2017-04-13,2017-04-13",
    "DateTime": "DateTime",
    "DateTimeFrom": "DateTimeFrom:2017-04-13 12:00:00",
    "DateTimeTo": "DateTimeTo:2017-04-13 12:00:00",
    "DateTimeFromTo": "DateTimeFromTo:2017-04-13 12:00:00,2017-04-13 12:00:00",
    // "Time": "Time",
    // "TimeZone": "TimeZone:timezone_identifiers_list()",

    // 其它
    "Required": "Required",

    // 条件判断
    "If": "If:selected", // 如果参数"selected"值等于 1, true, "1", "true", "yes"或 "y"(字符串忽略大小写)
    "IfNot": "IfNot:selected", // 如果参数"selected"值等于 0, false, "0", "false", "no"或"n"(字符串忽略大小写)
    "IfTrue": "IfTrue:selected", // 如果参数"selected"值等于 true 或 "true"(忽略大小写)
    "IfFalse": "IfFalse:selected", // 如果参数"selected"值等于 false 或 "false"(忽略大小写)
    "IfExist": "IfExist:var", // 如果参数"var"存在
    "IfNotExist": "IfNotExist:var", // 如果参数"var"不存在
    "IfIntEq": "IfIntEq:var,1", // if (type == 1)
    "IfIntNe": "IfIntNe:var,2", // if (state != 2). 特别要注意的是如果条件参数var的数据类型不匹配, 那么If条件是成立的; 而其它几个IfIntXx当条件参数var的数据类型不匹配时, If条件不成立
    "IfIntGt": "IfIntGt:var,0", // if (var > 0)
    "IfIntLt": "IfIntLt:var,1", // if (var < 1)
    "IfIntGe": "IfIntGe:var,6", // if (var >= 6)
    "IfIntLe": "IfIntLe:var,8", // if (var <= 8)
    "IfIntIn": "IfIntIn:var,2,3,5,7", // 如果var的值等于2,3,5,7中的某一个
    "IfIntNotIn": "IfIntNotIn:var,2,3,5,7", // 如果var的值不等于2,3,5,7中的任何一个
    "IfLongEq": "IfLongEq:var,1", // if (type == 1L)
    "IfLongNe": "IfLongNe:var,2", // if (state != 2L). 特别要注意的是如果条件参数var的数据类型不匹配, 那么If条件是成立的; 而其它几个IfLongXx当条件参数var的数据类型不匹配时, If条件不成立
    "IfLongGt": "IfLongGt:var,0", // if (var > 0L)
    "IfLongLt": "IfLongLt:var,1", // if (var < 1L)
    "IfLongGe": "IfLongGe:var,6", // if (var >= 6L)
    "IfLongLe": "IfLongLe:var,8", // if (var <= 8L)
    "IfLongIn": "IfLongIn:var,2,3,5,7", // 如果var的值等于2L,3L,5L,7L中的某一个
    "IfLongNotIn": "IfLongNotIn:var,2,3,5,7", // 如果var的值不等于2L,3L,5L,7L中的任何一个
    "IfStrEq": "IfStrEq:var,waiting", // if ("waiting" === var)
    "IfStrNe": "IfStrNe:var,editing", // if (!"editing" === var). 特别要注意的是如果条件参数var的数据类型不匹配, 那么If条件是成立的; 而其它几个IfStrXx当条件参数var的数据类型不匹配时, If条件不成立
    "IfStrGt": "IfStrGt:var,a", // if (var.compareTo("a") > 0)
    "IfStrLt": "IfStrLt:var,z", // if (var.compareTo("z") < 0)
    "IfStrGe": "IfStrGe:var,A", // if (var.compareTo("A") >= 0)
    "IfStrLe": "IfStrLe:var,Z", // if (var.compareTo("Z") <= 0)
    "IfStrIn": "IfStrIn:var,normal,warning,error", // 如果var的值等于"normal", "warning", "error"中的某一个
    "IfStrNotIn": "IfStrNotIn:var,warning,error", // 如果var的值不等于"normal", "warning", "error"中的任何一个
    // "IfSame": "IfSame:AnotherParameter",
    // "IfNotSame": "IfNotSame:AnotherParameter",
    // "IfAny": "IfAny:type,1,type,2", //待定

    // // 预处理（只处理字符串类型, 如果是其它类型, 则原值返回）
    // "Trim": "Trim",
    // "Lowercase": "Lowercase",
    // "Uppercase": "Uppercase",
    // "ToInt": "ToInt",
    // "ToString": "ToString",
  }

  // 抛出异常提示验证器格式错误
  static #throwFormatError(validatorName) {
    let sampleFormat = Validation.#sampleFormats[validatorName];
    if (!sampleFormat)
      throw new ValidationException("验证器 " + validatorName + " 格式错误");
    throw new ValidationException("验证器 " + validatorName + " 格式错误. 正确的格式示例: "+ sampleFormat);
  }

  /**
   * 当规则验证失败时，此方法会被调用以抛出异常
   * 内部会根据验证器名称validatorName从翻译表中查找“错误提示模板”，然后替换其中的部分字符串，最后做为异常抛出
   * 比如规则"IntGeLe:0,100"，验证失败后，本函数会被调用: _throwWithErrorTemplate("IntGeLe", "{{min}}", 0, "{{max}}", 100])
   * @param validatorName 验证器名称，比如:"IntGt", "StrLenGeLe"等
   * @param replaces 替换字符串列表
   * @protected
   */
  static _throwWithErrorTemplate(validatorName, ...replaces) {
    let errorStr = this.__findInTranslations(validatorName);
    if (errorStr === undefined)
      throw new ValidationException(`验证器 ${validatorName} 验证失败，并且该验证器没有错误提示信息模版`);
    for (let i = 0; i < replaces.length; i += 2) {
      errorStr = errorStr.replace(replaces[i], replaces[i + 1]);
    }
    throw new ValidationException(errorStr);
  }

  /**
   * 如果提供了 reason, 则先翻译, 再抛出异常; 否则什么也不做
   * （当规则验证失败时，并且规则中有>>>伪验证器时，此方法会被调用以抛出异常）
   * @param reason
   * @protected
   */
  static _throwIfHasReason(reason) {
    if (typeof reason === 'string' && reason.length > 0) {
      const translatedReason = this.__translateText(reason);
      throw new ValidationException(translatedReason);
    }
  }

  /**
   * 抛出验证器关联的数据类型不匹配的异常
   * @param validatorName 验证器名称。如：IntGt, StrLen 等等
   * @param alias 参数别名。如果没有提供reason参数，当解析失败时，抛出的异常message中的参数名会被此别名替换。
   * @param reason 自定义失败的原因。如果提供此参数，当解析失败时，将此参数做为异常的message抛出
   * @protected 此方法不能是私有方法，因为子类需要访问
   */
  static _throwTypeException(validatorName, alias, reason) {
    this._throwIfHasReason(reason);

    alias = this._finalAlias(alias);
    this._throwWithErrorTemplate(validatorName, '{{param}}', alias);
  }

  /**
   * 抛出验证器关联的异常
   * @param validatorName 验证器名称。如：IntGt, StrLen 等等
   * @param alias 参数别名。如果没有提供reason参数，当解析失败时，抛出的异常message中的参数名会被此别名替换。
   * @param reason 自定义失败的原因。如果提供此参数，当解析失败时，将此参数做为异常的message抛出
   * @param replaces 替换文本的数组，用于替换错误信息模板中的占位符。数组个数必须是2的倍数，第1个是占位符，接着是替换文本；以此类推
   * @private
   */
  static _throwValidatorException(validatorName, alias, reason, ...replaces) {
    this._throwIfHasReason(reason);

    alias = this._finalAlias(alias);
    this._throwWithErrorTemplate(validatorName, '{{param}}', alias, ...replaces);
  }

  // endregion

  // region 参数解析 parsers

  // 解析Int型验证器的参数值. 如果参数值不合法, 抛出异常
  static #parseParamIntOrThrow(string, validatorName) {
    if (string === null || string.length === 0) {
      throw new ValidationException(`验证器 ${validatorName} 的参数必须是一个整数`);
    }
    for (let i = 0, len = string.length; i < len; i++) {
      const c = string.charAt(i);
      if (c < '0' || c > '9') {
        if (i !== 0 && (c !== '+' && c !== '-'))
          throw new ValidationException(`验证器 ${validatorName} 的参数必须是一个整数`);
      }
    }
    try {
      return checkAndParseInt(string);
    } catch (e) {
      throw new ValidationException(`验证器 ${validatorName} 的参数解析失败(${e})`);
    }
  }

  // 解析Long型验证器的参数值. 如果参数值不合法, 抛出异常
  static #parseParamLongOrThrow(string, validatorName) {
    if (string === null || string.length === 0) {
      throw new ValidationException(`验证器 ${validatorName} 的参数必须是一个长整数`);
    }
    for (let i = 0, len = string.length; i < len; i++) {
      const c = string.charAt(i);
      if (c < '0' || c > '9') {
        if (i !== 0 && (c !== '+' && c !== '-'))
          throw new ValidationException(`验证器 ${validatorName} 的参数必须是一个长整数`);
      }
    }
    try {
      return checkAndParseLong(string);
    } catch (e) {
      throw new ValidationException(`验证器 ${validatorName} 的参数解析失败(${e})`);
    }
  }

  // 解析(非负)Int型验证器的参数值. 如果参数值不合法, 抛出异常
  static #parseParamIntNonNegativeOrThrow(string, validatorName) {
    if (string === null || string.length === 0) {
      throw new ValidationException(`验证器 ${validatorName} 的参数必须是一个非负整数`);
    }
    for (let i = 0, len = string.length; i < len; i++) {
      const c = string.charAt(i);
      if (c < '0' || c > '9') {
        throw new ValidationException(`验证器 ${validatorName} 的参数必须是一个非负整数`);
      }
    }
    try {
      return checkAndParseInt(string);
    } catch (e) {
      throw new ValidationException(`验证器 ${validatorName} 的参数解析失败(${e})`);
    }
  }

  // 解析浮点型验证器的参数值. 如果参数值不合法, 返回null
  // todo 数值溢出的处理
  static #parseParamDouble(string) {
    if (string.length === 0) return null;
    if (string.indexOf(' ') >= 0) return null;

    try {
      return parseFloat(string);
    } catch (e) {
      return null;
    }
  }

  /**
   * 将包含int数组的字符串转为int数组
   *
   * @param string 待解析的字符串, 如: 1,2,3,123
   * @return 如果是合法的int数组, 并且至少有1个int, 返回Integer数组; 否则返回null
   */
  static #parseParamIntArray(string) {
    const strArray = string.split(',');

    let ints = [];
    for (let str of strArray) {
      try {
        const v = checkAndParseInt(str);
        ints.push(v);
      } catch (error) {
        return null;
      }
    }

    if (ints.length === 0)
      return null;

    const arr = new Array(ints.length);
    arr.fill(null);
    for (let i = 0; i < ints.length; i++) {
      arr[i] = ints[i];
    }
    return arr;
  }

  /**
   * 将包含long数组的字符串转为Long数组
   *
   * @param string 待解析的字符串, 如: 1,2,3,123
   * @return 如果是合法的long数组, 并且至少有1个long, 返回Long数组; 否则返回null
   */
  static #parseParamLongArray(string) {
    const strArray = string.split(',');

    let longs = [];
    for (let str of strArray) {
      try {
        const v = checkAndParseLong(str);
        longs.push(v);
      } catch (error) {
        return null;
      }
    }

    if (longs.length === 0)
      return null;

    const arr = new Array(longs.length);
    arr.fill(null);
    for (let i = 0; i < longs.length; i++) {
      arr[i] = longs[i];
    }
    return arr;
  }

  /**
   * 将（逗号分隔的）字符串转为字符串数组.
   *
   * 不去重, 因为string是程序员提供的, 可以认为他们不会写错; 即使出现重复, 也不影响最终的验证结果.
   *
   * @param string 待解析的字符串, 如: abc,d,efg,123
   * @return 返回字符串数组; 如果string是空串, 返回 [""]
   */
  static #parseParamStrArray(string) {
    if (string.length === 0) return [''];

    return string.split(',');
  }

  /**
   * 解析 IfIntXx:varname,123 中的冒号后面的部分（1个条件参数后面带1个Int值）
   * @param string 待解析的字符串, 如: "count,10"
   * @param validatorName 验证器名称 "IfIntXx"
   * @return 出错返回null, 否则返回 ["varname", 123]
   */
  static #parseIfXxxWith1Param1Int(string, validatorName) {
    if (string.length === 0)
      return null;
    const strs = string.split(',');
    if (strs.length !== 2)
      return null;
    const varName = strs[0];
    if (varName.length === 0)
      return null;
    const value = this.validateInt(strs[1], `“${validatorName}:${string}”中“${varName}”后面必须是整数`, null);
    return [varName, value];
  }

  /**
   * 解析 IfLongXx:varname,123 中的冒号后面的部分（1个条件参数后面带1个Long值）
   * @param string 待解析的字符串, 如: "count,10"
   * @param validatorName 验证器名称 "IfLongXx"
   * @return 出错返回null, 否则返回 ["varname", 123]
   */
  static #parseIfXxxWith1Param1Long(string, validatorName) {
    if (string.length === 0)
      return null;
    const strs = string.split(',');
    if (strs.length !== 2)
      return null;
    const varName = strs[0];
    if (varName.length === 0)
      return null;
    const value = this.validateLong(strs[1], `“${validatorName}:${string}”中“${varName}”后面必须是长整数`, null);
    return [varName, value];
  }

  /**
   * 解析 IfStrXx:varname,abc 中的冒号后面的部分（1个条件参数后面带1个String值）
   * @param string 待解析的字符串, 如: "sex,male"
   * @param validatorName 验证器名称 "IfStrXx"
   * @return 出错返回null, 否则返回 ["varname", "abc"]
   */
  static #parseIfXxxWith1Param1Str(
    string,
    // validatorName
  ) {
    if (string.length === 0)
      return null;
    const strs = string.split(',');
    if (strs.length !== 2)
      return null;
    const varName = strs[0];
    if (varName.length === 0)
      return null;
    return strs;
  }

  /**
   * 解析 IfIntInXxx:varname,1,2,3 中的冒号后面的部分（1个条件参数后面带多个整数）
   * @param string 待解析的字符串, 如: "states,1,2,3"
   * @param validatorName 验证器名称 "IfIntInXxx"
   * @return 出错返回null, 否则返回 ["varname", [1,2,3]]
   */
  static #parseIfXxxWith1ParamNInts(string, validatorName) {
    if (string.length === 0)
      return null;
    const strs = string.split(',');
    if (strs.length < 2)
      return null;
    const varName = strs[0];
    if (varName.length === 0)
      return null;
    const params = []
    for (let i = 1; i < strs.length; i++) {
      let str = strs[i];
      let value = this.validateInt(str, `“${validatorName}:${string}”中“${varName}”后面必须全部是整数，实际上却包含了"${str}"`, null);
      params.push(value);
    }
    return [varName, params];
  }

  /**
   * 解析 IfLongInXxx:varname,1,2,3 中的冒号后面的部分（1个条件参数后面带多个整数）
   * @param string 待解析的字符串, 如: "states,1,2,3"
   * @param validatorName 验证器名称 "IfLongInXxx"
   * @return 出错返回null, 否则返回 {"varname", List{1L,2L,3L}}
   */
  static #parseIfXxxWith1ParamNLongs(string, validatorName) {
    if (string.length === 0)
      return null;
    const strs = string.split(',');
    if (strs.length < 2)
      return null;
    const varName = strs[0];
    if (varName.length === 0)
      return null;
    const params = []
    for (let i = 1; i < strs.length; i++) {
      let str = strs[i];
      let value = this.validateLong(str, `“${validatorName}:${string}”中“${varName}”后面必须全部是整数，实际上却包含了"${str}"`, null);
      params.push(value);
    }
    return [varName, params.map(Number)];
  }

  /**
   * 解析 IfStrXxx:varname,a,b,abc 中的冒号后面的部分（1个条件参数后面带多个字符串）
   * @param string 待解析的字符串, 如: "state,pending,started"
   * @param validatorName 验证器名称 "IfStrXxx"
   * @return 出错返回null, 否则返回 ["varname", ["a","b","abc"]]
   */
  static #parseIfXxxWith1ParamNStrs(
    string,
    // validatorName,
  ) {
    if (string.length === 0)
      return null;
    const parts = string.split(',');
    if (parts.length < 2)
      return null;
    const varName = parts[0];
    if (varName.length === 0)
      return null;
    const params = parts.slice(1);
    return [varName, params];
  }

  // 解析DateXx验证器的参数值. 如果参数值不合法, 返回 undefined
  static #parseParamDate(string) {
    try {
      return checkAndParseDate(string);
    } catch (e) {
      return undefined;
    }
  }

  // 解析DateTimeXx验证器的参数值. 如果参数值不合法, 返回 undefined
  // todo 有些无效的日期需要排除
  static #parseParamDateTimeToTimestamp(string) {
    try {
      return checkAndParseDateTime(string);
    } catch (e) {
      return undefined;
    }
  }

  // endregion

  // region 工具
  static #formatDate(date) {
    let month = date.getMonth() + 1;
    if (month < 10)
      month = '0' + month;
    let day = date.getDate();
    if (day < 10)
      day = '0' + day;
    return `${date.getFullYear()}-${month}-${day}`;
  }

  static #formatDateTime(date) {
    let month = date.getMonth() + 1;
    if (month < 10)
      month = '0' + month;
    let day = date.getDate();
    if (day < 10)
      day = '0' + day;
    let hours = date.getHours();
    if (hours < 10)
      hours = '0' + hours;
    let minutes = date.getMinutes();
    if (minutes < 10)
      minutes = '0' + minutes;
    let seconds = date.getSeconds();
    if (seconds < 10)
      seconds = '0' + seconds;
    return `${date.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // endregion

  // region Bool

  /**
   * 尝试将 value 解析为 boolean
   * @param value 待解析的值
   * @param reason 解析失败的原因。如果提供此参数，当解析失败时，将此参数做为异常的message抛出
   * @param alias 参数别名。如果没有提供reason参数，当解析失败时，抛出的异常message中的参数名会被此别名替换。
   * @return {boolean}
   */
  static #parseBoolOrThrow(value, reason, alias) {
    let type = typeof value;
    if (type === 'string') {
      let v = value.toLowerCase();
      if (v === 'true')
        return true;
      else if (v === 'false')
        return false;
    } else if (type === 'boolean') {
      return value;
    }
    this._throwTypeException('Bool', alias, reason);
  }

  static #parseBoolSmart(value, reason, alias) {
    let type = typeof value;
    if (type === 'string') {
      let v = value.toLowerCase();
      if (['true', '1', 'yes', 'y'].indexOf(v) >= 0)
        return true;
      else if (['false', '0', 'no', 'n'].indexOf(v) >= 0)
        return false;
    } else if (type === 'boolean') {
      return value;
    } else if (type === 'number') {
      if (Number.isInteger(value)) {
        if (value === 1)
          return true;
        else if (value === 0)
          return false;
      }
    }
    return undefined;
  }

  static validateBool(value, reason, alias) {
    Validation.#parseBoolOrThrow(value);
    return value;
  }

  static validateBoolTrue(value, reason, alias) {
    let val = Validation.#parseBoolOrThrow(value);
    if (val)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('BoolTrue', alias, reason);
  }

  static validateBoolFalse(value, reason, alias) {
    let val = Validation.#parseBoolOrThrow(value);
    if (!val)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('BoolFalse', alias, reason);
  }

  static validateBoolSmart(value, reason, alias) {
    let val = Validation.#parseBoolSmart(value);
    if (val === undefined)
      this._throwValidatorException('BoolSmart', alias, reason);
    return value;
  }

  static validateBoolSmartTrue(value, reason, alias) {
    let val = Validation.#parseBoolSmart(value);
    if (val === true)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('BoolSmartTrue', alias, reason);
  }

  static validateBoolSmartFalse(value, reason, alias) {
    let val = Validation.#parseBoolSmart(value);
    if (val === false)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('BoolSmartFalse', alias, reason);
  }

  // endregion

  // region Int

  /**
   * 尝试将 value 解析为 integer
   * @param value 待解析的值
   * @param reason 解析失败的原因。如果提供此参数，当解析失败时，将此参数做为异常的message抛出
   * @param alias 参数别名。如果没有提供reason参数，当解析失败时，抛出的异常message中的参数名会被此别名替换。
   * @return {number}
   */
  static #parseIntOrThrow(value, reason, alias) {
    let type = typeof value;
    if (type === 'string') {
      if (!isNaN(value)) { // 是数值
        if (value.indexOf('.') === -1) {// 无小数点。("1.0"不是整数)
          let v;
          if (value.startsWith('0x') || value.startsWith('0X')) {
            v = parseInt(value.substring(2), 16);
          } else {
            v = parseFloat(value); // 没有小数点也可能是浮点数，比如"3e-5"
          }
          if (Number.isInteger(v)) {
            if (v > 2147483647 || v < -2147483648)
              this._throwValidatorException('IntGeLe', alias, reason, '{{min}}', -2147483648, '{{max}}', 2147483647);
            return v;
          }
        }
      }
    } else if (type === 'number') {
      if (Number.isInteger(value)) {
        if (value > 2147483647 || value < -2147483648)
          this._throwValidatorException('IntGeLe', alias, reason, '{{min}}', -2147483648, '{{max}}', 2147483647);
        return value;
      }
    }
    this._throwTypeException('Int', alias, reason);
  }

  static validateInt(value, reason, alias) {
    Validation.#parseIntOrThrow(value);
    return value;
  }

  static validateIntEq(value, equalVal, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val === equalVal)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntEq', alias, reason, '{{value}}', equalVal);
  }

  static validateIntNe(value, notEqualVal, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val !== notEqualVal)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntNe', alias, reason, '{{value}}', notEqualVal);
  }

  static validateIntGt(value, min, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val > min)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntGt', alias, reason, '{{min}}', min);
  }

  static validateIntGe(value, min, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val >= min)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntGe', alias, reason, '{{min}}', min);
  }

  static validateIntLt(value, max, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntLt', alias, reason, '{{max}}', max);
  }

  static validateIntLe(value, max, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntLe', alias, reason, '{{max}}', max);
  }

  static validateIntGtLt(value, min, max, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val > min && val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntGtLt', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateIntGeLe(value, min, max, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val >= min && val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntGeLe', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateIntGtLe(value, min, max, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val > min && val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntGtLe', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateIntGeLt(value, min, max, reason, alias) {
    let val = Validation.#parseIntOrThrow(value);
    if (val >= min && val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('IntGeLt', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateIntIn(value, inValues, reason, alias) {
    if (!inValues || inValues.length === 0)
      throw new ValidationException("必须提供可取值的列表");

    let val = Validation.#parseIntOrThrow(value);
    for (const v of inValues) {
      if (v === val)
        return value; // 注意这里返回的是原始的value
    }
    this._throwValidatorException('IntIn', alias, reason, '{{valueList}}', inValues.join(', '));
  }

  static validateIntNotIn(value, notInValues, reason, alias) {
    if (!notInValues || notInValues.length === 0)
      throw new ValidationException("必须提供不可取值的列表");

    let val = Validation.#parseIntOrThrow(value);
    let inList = false;
    for (const v of notInValues) {
      if (v === val) {
        inList = true;
        break;
      }
    }
    if (!inList)
      return value; // 注意这里返回的是原始的value

    this._throwValidatorException('IntNotIn', alias, reason, '{{valueList}}', notInValues.join(', '));
  }

  // endregion

  // region Long


  /**
   * 尝试将 value 解析为 long（因为js内部只有double类型，所以取值范围不能超过double所能表示的整数范围）
   * @param value 待解析的值
   * @param reason 解析失败的原因。如果提供此参数，当解析失败时，将此参数做为异常的message抛出
   * @param alias 参数别名。如果没有提供reason参数，当解析失败时，抛出的异常message中的参数名会被此别名替换。
   * @return {number}
   */
  static #parseLongOrThrow(value, reason, alias) {
    let type = typeof value;
    if (type === 'string') {
      if (!isNaN(value)) { // 是数值
        if (value.indexOf('.') === -1) {// 无小数点。("1.0"不是整数)
          let v;
          if (value.startsWith('0x') || value.startsWith('0X')) {
            v = parseInt(value.substring(2), 16);
          } else {
            v = parseFloat(value); // 没有小数点也可能是浮点数，比如"3e-5"
          }
          if (Number.isInteger(v)) {
            if (v > Number.MAX_SAFE_INTEGER || v < Number.MIN_SAFE_INTEGER)
              this._throwValidatorException('LongGeLe', alias, reason, '{{min}}', Number.MIN_SAFE_INTEGER, '{{max}}', Number.MAX_SAFE_INTEGER);
            return v;
          }
        }
      }
    } else if (type === 'number') {
      if (Number.isInteger(value)) {
        if (value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER)
          this._throwValidatorException('LongGeLe', alias, reason, '{{min}}', Number.MIN_SAFE_INTEGER, '{{max}}', Number.MAX_SAFE_INTEGER);
        return value;
      }
    }
    this._throwTypeException('Long', alias, reason);
  }

  static validateLong(value, reason, alias) {
    Validation.#parseLongOrThrow(value);
    return value;
  }

  static validateLongEq(value, equalVal, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val === equalVal)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongEq', alias, reason, '{{value}}', equalVal);
  }

  static validateLongNe(value, notEqualVal, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val !== notEqualVal)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongNe', alias, reason, '{{value}}', notEqualVal);
  }

  static validateLongGt(value, min, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val > min)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongGt', alias, reason, '{{min}}', min);
  }

  static validateLongGe(value, min, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val >= min)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongGe', alias, reason, '{{min}}', min);
  }

  static validateLongLt(value, max, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongLt', alias, reason, '{{max}}', max);
  }

  static validateLongLe(value, max, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongLe', alias, reason, '{{max}}', max);
  }

  static validateLongGtLt(value, min, max, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val > min && val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongGtLt', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateLongGeLe(value, min, max, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val >= min && val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongGeLe', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateLongGtLe(value, min, max, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val > min && val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongGtLe', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateLongGeLt(value, min, max, reason, alias) {
    let val = Validation.#parseLongOrThrow(value);
    if (val >= min && val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('LongGeLt', alias, reason, '{{min}}', min, '{{max}}', max);
  }

  static validateLongIn(value, inValues, reason, alias) {
    if (!inValues || inValues.length === 0)
      throw new ValidationException("必须提供可取值的列表");

    let val = Validation.#parseLongOrThrow(value);
    for (const v of inValues) {
      if (v === val)
        return value; // 注意这里返回的是原始的value
    }
    this._throwValidatorException('LongIn', alias, reason, '{{valueList}}', inValues.join(', '));
  }

  static validateLongNotIn(value, notInValues, reason, alias) {
    if (!notInValues || notInValues.length === 0)
      throw new ValidationException("必须提供不可取值的列表");

    let val = Validation.#parseLongOrThrow(value);
    let inList = false;
    for (const v of notInValues) {
      if (v === val) {
        inList = true;
        break;
      }
    }
    if (!inList)
      return value; // 注意这里返回的是原始的value

    this._throwValidatorException('LongNotIn', alias, reason, '{{valueList}}', notInValues.join(', '));
  }

  // endregion

  // region Float

  /**
   * 尝试将 value 解析为 float
   * 整型也算float
   * @param value 待解析的值
   * @param reason 解析失败的原因。如果提供此参数，当解析失败时，将此参数做为异常的message抛出
   * @param alias 参数别名。如果没有提供reason参数，当解析失败时，抛出的异常message中的参数名会被此别名替换。
   * @return {number}
   */
  static #parseFloatOrThrow(value, reason, alias) {
    let type = typeof value;
    if (type === 'string') {
      if (value.length > 0) { // 排除空串
        let v = parseFloat(value); // 会自动忽略空白符；支持科学计数法比如"3e-5"；"1.5a"=1.5；""=NaN；"Infinity"=Infinity；超出范围的超大数值=±Infinity
        if (!isNaN(v)) {
          if (Number.isFinite(v)) {
            if (/^[0-9eE.+-]+$/.test(value) // parseFloat()会忽略空白符，这里排除掉有空白符的情况
              && value[value.length - 1] !== 'e' && value[value.length - 1] !== 'E') // 排除以'e'结尾的情况
              return v;
          } else if (value.toLowerCase().indexOf('infinity') === -1) { // 数值过大超出了js能表示的数值上下限(排除"Infinity"和"-Infinity")
            this._throwValidatorException('FloatGeLe', alias, reason, '{{min}}', -Number.MAX_VALUE, '{{max}}', Number.MAX_VALUE);
          }
        }
      }
    } else if (type === 'number') {
      if (Number.isFinite(value))
        return value;
    }
    this._throwTypeException('Float', alias, reason);
  }

  // 将浮点数转换为字符串，如果没有小数点，会自动添加'.0'结尾
  static #floatToString(v) {
    v = '' + v;
    let i = v.indexOf('e');
    if (i === -1)
      i = v.indexOf('E');
    if (i >= 0) { // 科学计数法
      if (v.indexOf('.') === -1) // 没有小数点
        return v.splice(i, 0, '.0'); // 在'e'前面插入'.0'
    }
    if (v.indexOf('.') === -1) // 没有小数点
      v += '.0';
    return v;
  }

  static validateFloat(value, reason, alias) {
    Validation.#parseFloatOrThrow(value);
    return value;
  }

  static validateFloatGt(value, min, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val > min)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatGt', alias, reason, '{{min}}', this.#floatToString(min));
  }

  static validateFloatGe(value, min, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val >= min)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatGe', alias, reason, '{{min}}', this.#floatToString(min));
  }

  static validateFloatLt(value, max, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatLt', alias, reason, '{{max}}', this.#floatToString(max));
  }

  static validateFloatLe(value, max, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatLe', alias, reason, '{{max}}', this.#floatToString(max));
  }

  static validateFloatGtLt(value, min, max, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val > min && val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatGtLt', alias, reason, '{{min}}', this.#floatToString(min), '{{max}}', this.#floatToString(max));
  }

  static validateFloatGeLe(value, min, max, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val >= min && val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatGeLe', alias, reason, '{{min}}', this.#floatToString(min), '{{max}}', this.#floatToString(max));
  }

  static validateFloatGtLe(value, min, max, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val > min && val <= max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatGtLe', alias, reason, '{{min}}', this.#floatToString(min), '{{max}}', this.#floatToString(max));
  }

  static validateFloatGeLt(value, min, max, reason, alias) {
    let val = Validation.#parseFloatOrThrow(value);
    if (val >= min && val < max)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('FloatGeLt', alias, reason, '{{min}}', this.#floatToString(min), '{{max}}', this.#floatToString(max));
  }

  // endregion

  // region String

  static validateStr(value, reason, alias) {
    if (typeof value === 'string')
      return value;

    this._throwTypeException('Str', alias, reason);
  }

  static validateStrEq(value, equalsValue, reason, alias) {

    if (typeof value === 'string') {
      if (value === equalsValue)
        return value;
      this._throwValidatorException('StrEq', alias, reason, '{{value}}', equalsValue);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrEqI(value, equalsValue, reason, alias) {
    if (typeof value === 'string') {
      if (value.toUpperCase() === equalsValue.toUpperCase())
        return value;
      this._throwValidatorException('StrEqI', alias, reason, '{{value}}', equalsValue);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrNe(value, equalsValue, reason, alias) {
    if (typeof value === 'string') {
      if (value !== equalsValue)
        return value;
      this._throwValidatorException('StrNe', alias, reason, '{{value}}', equalsValue);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrNeI(value, equalsValue, reason, alias) {
    if (typeof value === 'string') {
      if (value.toUpperCase() !== equalsValue.toUpperCase())
        return value;
      this._throwValidatorException('StrNeI', alias, reason, '{{value}}', equalsValue);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrIn(value, inStrings, reason, alias) {
    if (!Array.isArray(inStrings) || inStrings.length === 0)
      throw new Error("必须提供可取值的列表");

    if (typeof value === 'string') {
      for (const inString of inStrings) {
        if (value === inString)
          return value;
      }
      this._throwValidatorException('StrIn', alias, reason, '{{valueList}}', '"' + inStrings.join('", "') + '"');
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrInI(value, inStrings, reason, alias) {
    if (!Array.isArray(inStrings) || inStrings.length === 0)
      throw new Error("必须提供可取值的列表");

    if (typeof value === 'string') {
      let val = value.toUpperCase();
      for (const inString of inStrings) {
        if (val === inString.toUpperCase())
          return value;
      }
      this._throwValidatorException('StrInI', alias, reason, '{{valueList}}', '"' + inStrings.join('", "') + '"');
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrNotIn(value, notInStrings, reason, alias) {
    if (!Array.isArray(notInStrings) || notInStrings.length === 0)
      throw new Error("必须提供不可取值的列表");

    if (typeof value === 'string') {
      let isIn = false;
      for (const string of notInStrings) {
        if (value === string) {
          isIn = true;
          break;
        }
      }
      if (!isIn)
        return value;
      this._throwValidatorException('StrNotIn', alias, reason, '{{valueList}}', '"' + notInStrings.join('", "') + '"');
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrNotInI(value, notInStrings, reason, alias) {
    if (!Array.isArray(notInStrings) || notInStrings.length === 0)
      throw new Error("必须提供不可取值的列表");

    if (typeof value === 'string') {
      let val = value.toUpperCase();
      let isIn = false;
      for (const string of notInStrings) {
        if (val === string.toUpperCase()) {
          isIn = true;
          break;
        }
      }
      if (!isIn)
        return value;
      this._throwValidatorException('StrNotInI', alias, reason, '{{valueList}}', '"' + notInStrings.join('", "') + '"');
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrLen(value, length, reason, alias) {
    if (value === undefined || value === null)
      throw new Error("参数 value 不可为 null");

    if (typeof value === 'string') {
      if (value.length === length)
        return value;
      this._throwValidatorException('StrLen', alias, reason, '{{length}}', length);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrLenGe(value, minLen, reason, alias) {
    if (value === undefined || value === null)
      throw new Error("参数 value 不可为 null");

    if (typeof value === 'string') {
      if (value.length >= minLen)
        return value;
      this._throwValidatorException('StrLenGe', alias, reason, '{{min}}', minLen);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrLenLe(value, maxLen, reason, alias) {
    if (value === undefined || value === null)
      throw new Error("参数 value 不可为 null");

    if (typeof value === 'string') {
      if (value.length <= maxLen)
        return value;
      this._throwValidatorException('StrLenLe', alias, reason, '{{max}}', maxLen);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateStrLenGeLe(value, minLen, maxLen, reason, alias) {
    if (value === null || value === undefined)
      throw new ValidationException("参数 value 不可为 null 或 undefined");

    if (typeof value === 'string') {
      const len = value.length;
      if (len >= minLen && len <= maxLen)
        return value;
      this._throwValidatorException('StrLenGeLe', alias, reason, "{{min}}", minLen, "{{max}}", maxLen);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateLetters(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[a-zA-Z]+$/.test(value))
        return value;
      this._throwValidatorException('Letters', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateAlphabet(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[a-zA-Z]+$/.test(value))
        return value;
      this._throwValidatorException('Alphabet', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateNumbers(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[0-9]+$/.test(value))
        return value;
      this._throwValidatorException('Numbers', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateDigits(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[0-9]+$/.test(value))
        return value;
      this._throwValidatorException('Digits', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateLettersNumbers(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[a-zA-Z0-9]+$/.test(value))
        return value;
      this._throwValidatorException('LettersNumbers', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateNumeric(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[+-]?(\d+\.\d+|\d+\.?|\.\d+)$/.test(value))
        return value;
      this._throwValidatorException('Numeric', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateVarName(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value))
        return value;
      this._throwValidatorException('VarName', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateEmail(value, reason, alias) {
    if (value === undefined || value === null)
      throw new ValidationException("参数 value 不可为 null");

    if (typeof value === 'string') {
      if (value.length <= 255) {
        const parts = value.split('@');
        if (parts.length === 2 && parts[0].length <= 64) {
          if (/^([a-z0-9A-Z]+[-_.]?)+[a-z0-9A-Z]$/.test(parts[0]) // verify email user name
            && /^([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/.test(parts[1])) { // verify email domain
            return value;
          }
        }
      }
      this._throwValidatorException('Email', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateUrl(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[a-zA-z]{1,100}:\/\/[^\s]+$/.test(value))
        return value;
      this._throwValidatorException('Url', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateHttpUrl(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[hH][tT][tT][pP][sS]?:\/\/[^\s]+$/.test(value))
        return value;
      this._throwValidatorException('HttpUrl', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateIp(value, reason, alias) {
    if (typeof value === 'string') {
      if (this.#ipv4RegExp.test(value) || this.#ipv6RegExp.test(value))
        return value;
      this._throwValidatorException('Ip', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static #ipv4RegExp = new RegExp('^((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5]|[*])$');

  static validateIpv4(value, reason, alias) {
    if (typeof value === 'string') {
      if (this.#ipv4RegExp.test(value))
        return value;
      this._throwValidatorException('Ipv4', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static #ipv6RegExp = new RegExp(
    "^((([0-9A-Fa-f]{1,4}:){7}(([0-9A-Fa-f]{1,4}){1}|:))"
    + "|(([0-9A-Fa-f]{1,4}:){6}((:[0-9A-Fa-f]{1,4}){1}|"
    + "((22[0-3]|2[0-1][0-9]|[0-1][0-9][0-9]|"
    + "([0-9]){1,2})([.](25[0-5]|2[0-4][0-9]|"
    + "[0-1][0-9][0-9]|([0-9]){1,2})){3})|:))|"
    + "(([0-9A-Fa-f]{1,4}:){5}((:[0-9A-Fa-f]{1,4}){1,2}|"
    + ":((22[0-3]|2[0-1][0-9]|[0-1][0-9][0-9]|"
    + "([0-9]){1,2})([.](25[0-5]|2[0-4][0-9]|"
    + "[0-1][0-9][0-9]|([0-9]){1,2})){3})|:))|"
    + "(([0-9A-Fa-f]{1,4}:){4}((:[0-9A-Fa-f]{1,4}){1,3}"
    + "|:((22[0-3]|2[0-1][0-9]|[0-1][0-9][0-9]|"
    + "([0-9]){1,2})([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|"
    + "([0-9]){1,2})){3})|:))|(([0-9A-Fa-f]{1,4}:){3}((:[0-9A-Fa-f]{1,4}){1,4}|"
    + ":((22[0-3]|2[0-1][0-9]|[0-1][0-9][0-9]|"
    + "([0-9]){1,2})([.](25[0-5]|2[0-4][0-9]|"
    + "[0-1][0-9][0-9]|([0-9]){1,2})){3})|:))|"
    + "(([0-9A-Fa-f]{1,4}:){2}((:[0-9A-Fa-f]{1,4}){1,5}|"
    + ":((22[0-3]|2[0-1][0-9]|[0-1][0-9][0-9]|"
    + "([0-9]){1,2})([.](25[0-5]|2[0-4][0-9]|"
    + "[0-1][0-9][0-9]|([0-9]){1,2})){3})|:))"
    + "|(([0-9A-Fa-f]{1,4}:){1}((:[0-9A-Fa-f]{1,4}){1,6}"
    + "|:((22[0-3]|2[0-1][0-9]|[0-1][0-9][0-9]|"
    + "([0-9]){1,2})([.](25[0-5]|2[0-4][0-9]|"
    + "[0-1][0-9][0-9]|([0-9]){1,2})){3})|:))|"
    + "(:((:[0-9A-Fa-f]{1,4}){1,7}|(:[fF]{4}){0,1}:((22[0-3]|2[0-1][0-9]|"
    + "[0-1][0-9][0-9]|([0-9]){1,2})"
    + "([.](25[0-5]|2[0-4][0-9]|[0-1][0-9][0-9]|([0-9]){1,2})){3})|:)))$"
  );

  static validateIpv6(value, reason, alias) {
    if (typeof value === 'string') {
      if (this.#ipv6RegExp.test(value))
        return value;
      this._throwValidatorException('Ipv6', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateMac(value, reason, alias) {
    if (typeof value === 'string') {
      if (/^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/.test(value))
        return value;
      this._throwValidatorException('Mac', alias, reason);
    }
    this._throwTypeException('Str', alias, reason);
  }

  static validateRegexp(value, pattern, reason, alias) {
    if (value === undefined || value === null)
      throw new ValidationException("参数 value 不可为 null");
    if (!pattern)
      throw new ValidationException("没有提供参数 pattern");

    if (typeof value === 'string') {
      if (pattern.test(value))
        return value;
      this._throwValidatorException('Regexp', alias, reason, "{{regexp}}", pattern.source);
    }
    this._throwTypeException('Str', alias, reason);
  }

  // endregion

  // region Date&Time

  /**
   * 将 value 解析为日期。如果解析失败，抛出异常
   * @param value
   * @param reason
   * @param alias
   * @return {Date}
   * @throws ValidationException
   */
  static #parseDateOrThrow(value, reason, alias) {
    let type = typeof value;
    if (type === 'string') {
      if (/^\d{4}-[0-1]?\d-[0-3]?\d$/.test(value)) {
        let [year, month, day] = value.split('-');
        year = parseInt(year);
        month = parseInt(month);
        day = parseInt(day);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          if (day === 31) {
            if ([2, 4, 6, 9, 11].indexOf(month) >= 0) // 小月没有31号
              this._throwTypeException('Date', alias, reason);
          } else if (day === 30) {
            if (month === 2) // 2月没有30号
              this._throwTypeException('Date', alias, reason);
          } else if (day === 29 && month === 2) {
            let isLeapYear = false; // 是否是闰年
            // 下面的闰年算法只在公元3200年之前有效
            if (year % 100 > 0) { // 不是100的倍数
              if (year % 4 === 0) // 是4的倍数
                isLeapYear = true; // 是闰年
            } else { // 是100的倍数
              if (year % 400 === 0) // 又是400的倍数
                isLeapYear = true; // 是闰年
            }
            if (!isLeapYear)
              this._throwTypeException('Date', alias, reason);
          }
          return new Date(year, month - 1, day);
        }
      }
    }
    this._throwTypeException('Date', alias, reason);
  }

  /**
   * 将 value 解析为日期时间。如果解析失败，抛出异常
   * @param value
   * @param reason
   * @param alias
   * @return {Date}
   * @throws ValidationException
   */
  static #parseDateTimeOrThrow(value, reason, alias) {
    let type = typeof value;
    if (type === 'string') {
      if (/^\d{4}-[0-1]?\d-[0-3]?\d \d\d:[0-5]\d:[0-5]\d$/.test(value)) {
        let [date, time] = value.split(' ');
        let [year, month, day] = date.split('-');
        let [hour, minute, second] = time.split(':');
        year = parseInt(year);
        month = parseInt(month);
        day = parseInt(day);
        hour = parseInt(hour);
        minute = parseInt(minute);
        second = parseInt(second);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          if (day === 31) {
            if ([2, 4, 6, 9, 11].indexOf(month) >= 0) // 小月没有31号
              this._throwTypeException('DateTime', alias, reason);
          } else if (day === 30) {
            if (month === 2) // 2月没有30号
              this._throwTypeException('DateTime', alias, reason);
          } else if (day === 29 && month === 2) {
            let isLeapYear = false; // 是否是闰年
            // 下面的闰年算法只在公元3200年之前有效
            if (year % 100 > 0) { // 不是100的倍数
              if (year % 4 === 0) // 是4的倍数
                isLeapYear = true; // 是闰年
            } else { // 是100的倍数
              if (year % 400 === 0) // 又是400的倍数
                isLeapYear = true; // 是闰年
            }
            if (!isLeapYear)
              this._throwTypeException('DateTime', alias, reason);
          }
          if (hour >= 24)
            this._throwTypeException('DateTime', alias, reason);
          return new Date(year, month - 1, day, hour, minute, second);
        }
      }
    }
    this._throwTypeException('DateTime', alias, reason);
  }

  static validateDate(value, reason, alias) {
    Validation.#parseDateOrThrow(value, reason, alias);
    return value;
  }

  static validateDateFrom(value, from, reason, alias) {
    let val = Validation.#parseDateOrThrow(value);
    if (val >= from)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('DateFrom', alias, reason, '{{from}}', Validation.#formatDate(from));
  }

  static validateDateTo(value, to, reason, alias) {
    let val = Validation.#parseDateOrThrow(value);
    if (val <= to)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('DateTo', alias, reason, '{{to}}', Validation.#formatDate(to));
  }

  static validateDateFromTo(value, from, to, reason, alias) {
    let val = Validation.#parseDateOrThrow(value);
    if (val >= from && val <= to)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('DateFromTo', alias, reason, '{{from}}', Validation.#formatDate(from), '{{to}}', Validation.#formatDate(to));
  }

  static validateDateTime(value, reason, alias) {
    Validation.#parseDateTimeOrThrow(value, reason, alias);
    return value;
  }

  static validateDateTimeFrom(value, from, reason, alias) {
    let val = Validation.#parseDateTimeOrThrow(value);
    if (val >= from)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('DateTimeFrom', alias, reason, '{{from}}', Validation.#formatDateTime(from));
  }

  static validateDateTimeTo(value, to, reason, alias) {
    let val = Validation.#parseDateTimeOrThrow(value);
    if (val < to)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('DateTimeTo', alias, reason, '{{to}}', Validation.#formatDateTime(to));
  }

  static validateDateTimeFromTo(value, from, to, reason, alias) {
    let val = Validation.#parseDateTimeOrThrow(value);
    if (val >= from && val < to)
      return value; // 注意这里返回的是原始的value
    this._throwValidatorException('DateTimeFromTo', alias, reason, '{{from}}', Validation.#formatDateTime(from), '{{to}}', Validation.#formatDateTime(to));
  }

  // endregion

  // region Arr|List & Map

  static validateArr(value, reason, alias) {
    if (Array.isArray(value))
      return value;

    this._throwTypeException('Arr', alias, reason);
  }

  static validateArrLen(value, length, reason, alias) {
    if (value === undefined || value === null)
      throw new Error("参数 value 不可为 null");

    if (Array.isArray(value)) {
      if (value.length === length)
        return value;
      this._throwValidatorException('ArrLen', alias, reason, '{{length}}', length);
    }
    this._throwTypeException('Arr', alias, reason);
  }

  static validateArrLenGe(value, minLen, reason, alias) {
    if (value === undefined || value === null)
      throw new Error("参数 value 不可为 null");

    if (Array.isArray(value)) {
      if (value.length >= minLen)
        return value;
      this._throwValidatorException('ArrLenGe', alias, reason, '{{min}}', minLen);
    }
    this._throwTypeException('Arr', alias, reason);
  }

  static validateArrLenLe(value, maxLen, reason, alias) {
    if (value === undefined || value === null)
      throw new Error("参数 value 不可为 null");

    if (Array.isArray(value)) {
      if (value.length <= maxLen)
        return value;
      this._throwValidatorException('ArrLenLe', alias, reason, '{{max}}', maxLen);
    }
    this._throwTypeException('Arr', alias, reason);
  }

  static validateArrLenGeLe(value, minLen, maxLen, reason, alias) {
    if (value === undefined || value === null)
      throw new Error("参数 value 不可为 null");

    if (Array.isArray(value)) {
      if (value.length >= minLen && value.length <= maxLen)
        return value;
      this._throwValidatorException('ArrLenGeLe', alias, reason, '{{min}}', minLen, '{{max}}', maxLen);
    }
    this._throwTypeException('Arr', alias, reason);
  }

  static validateMap(value, reason, alias) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value))
      return value;
    this._throwTypeException('Map', alias, reason);
  }

  // endregion

}

class Validator {
  countOfIfs;
  required;
  reason;
  alias;
  units;
}
