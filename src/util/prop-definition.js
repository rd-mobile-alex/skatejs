import dashCase from './dash-case';
import empty from './empty';
import error from './error';
import { isFunction, isObject } from './is-type';

/**
 * @internal
 * Property Definition
 *
 * Internal meta data and strategies for a property.
 * Created from the options of a PropOptions config object.
 *
 * Once created a PropDefinition should be treated as immutable and final.
 * 'getPropsMap' function memoizes PropDefinitions by Component's Class.
 *
 * The 'attribute' option is normalized to 'attrSource' and 'attrTarget' properties.
 */
export default class PropDefinition {

  constructor (nameOrSymbol, propOptions) {
    this._name = nameOrSymbol;

    propOptions = propOptions || {};

    // default 'attrSource': no observed source attribute (name)
    this.attrSource = null;

    // default 'attrTarget': no reflected target attribute (name)
    this.attrTarget = null;

    // default 'coerce': identity function
    this.coerce = value => value;

    // default 'default': set prop to 'null'
    this.default = null;

    // default 'deserialize': return attribute's value (string or null)
    this.deserialize = value => value;

    // default 'get': no function
    this.get = null;

    // 'initial' default: unspecified
    // 'initial' option is truly optional and it cannot be initialized.
    // Its presence is tested using: ('initial' in propDef)

    // 'serialize' default: return string value or null
    this.serialize = value => (empty(value) ? null : String(value));

    // default 'set': no function
    this.set = null;

    // Note: option key is always a string (no symbols here)
    Object.keys(propOptions).forEach(option => {
      const optVal = propOptions[option];

      // Only accept documented options and perform minimal input validation.
      switch (option) {
        case 'attribute':
          if (isObject(optVal)) {
            this.attrSource = resolveAttrName(optVal.source, nameOrSymbol);
            this.attrTarget = resolveAttrName(optVal.target, nameOrSymbol);
          } else {
            this.attrSource = resolveAttrName(optVal, nameOrSymbol);
            this.attrTarget = this.attrSource;
          }
          break;
        case 'coerce':
        case 'deserialize':
        case 'get':
        case 'serialize':
        case 'set':
          if (isFunction(optVal)) {
            this[option] = optVal;
          } else {
            error(`${option} must be a function.`);
          }
          break;
        case 'default':
        case 'initial':
          this[option] = optVal;
          break;
        default:
          error(`${option} is not a valid option. Options are: attribute, initial, default, coerce, deserialize, serialize.`);
          break;
      }
    });

    this.attrTargetIsSource = this.attrTarget && (this.attrTarget === this.attrSource);
  }

  get name () {
    return this._name;
  }

}

function resolveAttrName (attrOption, nameOrSymbol) {
  if (typeof nameOrSymbol === 'symbol') {
    error(`${nameOrSymbol.toString()} symbol property cannot have an attribute.`);
  } else {
    if (attrOption === true) {
      return dashCase(String(nameOrSymbol));
    }
    if (typeof attrOption === 'string') {
      return attrOption;
    }
  }
  return null;
}
