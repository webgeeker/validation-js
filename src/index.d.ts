export default class Validation {
  /**
   * 设置默认语言
   * 如果当前语言的翻译表中没有找到翻译项，则会到默认语言的翻译表中查找。
   * 建议在setLang()之前调用
   * 默认语言初始值为'en_US'
   * @param lang 语言代码
   */
  static setDefaultLang(lang: string): void;
  static setLang(lang: string): void;
  static setTranslations(lang: string, translations: object): void;

  /**
   * 参数验证
   * 此方法主要用于后端API接口的参数验证
   * @param params 包含待验证参数的Map
   * @param validations 包含验证规则的Map。格式示例: {   *   "name": "Required|StrLenGeLe:2,50",
   *   "sex": "Required|StrIn:male,female",
   *   "age": "Required|IntGeLe:18,60",
   *   "height": {
   *     "IfStrEq:male|IntGe:180",
   *     "IfStrEq:female|IntGe:170",
   *   }
   * }
   * @param ignoreRequired 是否忽略验证规则中的"Required"验证器
   */
  static validate(params: object, validations: object, ignoreRequired: boolean | undefined): void;

  /**
   * 验证一个值是否符合规则
   * @param value 待验证的值
   * @param rules 规则。可以是一条规则；也可以是多条规则的数组，任何一条规则验证通过即可
   * @param alias 如果验证规则中包含'Alias:xxx'，则这个参数可以不传；否则一定要传
   * @return 返回value原值
   */
  static validateValue(value: any, rules: string | string[], alias: string | undefined): any;
}