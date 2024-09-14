import Validation from "./ValidationInNode.js";

/**
 * （本类用于测试）
 * 当前项目的验证器类
 * 在类中可以添加自定义验证规则及自定义翻译表
 */
export class MyValidation extends Validation {

  /**
   * 翻译表。key = 语言代码, value = 该语言的翻译表
   * @private 因为子类要间接访问此属性，所以不能真的设置为私有，只能打上 @private 标记
   * @protected
   */
  static _langToTranslations = {
    en_US: {
      CustomStartWith: '{{param}} must start with "{{prefix}}"',
      CustomPhoneCN: '{{param}} must be a valid 11-digit mobile phone number',
    }
  }

  static validateCustomStartWith(value, prefix, reason, alias)
  {
    let isTypeError = false;
    if (typeof value === 'string') {
      if (value.indexOf(prefix) === 0)
        return value;
    } else {
      isTypeError = true;
    }

    this._throwIfHasReason(reason);

    alias = this._finalAlias(alias);
    if (isTypeError)
      this._throwWithErrorTemplate("Str", '{{param}}', alias);
    else
      this._throwWithErrorTemplate("CustomStartWith", '{{param}}', alias, '{{prefix}}', prefix);
  }

  static validateCustomPhoneCN(value, reason, alias)
  {
    let isTypeError = false;
    if (typeof value === 'string') {
      if (/^1[3-9]\d{9}$/.test(value))
        return value;
    } else {
      isTypeError = true;
    }

    this._throwIfHasReason(reason);

    alias = this._finalAlias(alias);
    if (isTypeError)
      this._throwWithErrorTemplate("Str", '{{param}}', alias);
    else
      this._throwWithErrorTemplate("CustomPhoneCN", '{{param}}', alias);
  }
}

MyValidation.setTranslations('zh_CN', {
  CustomStartWith: '{{param}}必须以“{{prefix}}”开头',
  CustomPhoneCN: '{{param}}必须合法的11位手机号',
});
