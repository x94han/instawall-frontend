/**
 * validator 以 cdn 方式引入
 */

export function validEmail(val) {
  return validator.isEmail(val);
}

export function validPassword(val) {
  return (
    val.length >= 8 && !validator.isNumeric(val) && !validator.isAlpha(val)
  );
}

export function validScreenName(val) {
  return val && val.length >= 2;
}

export function validObjectId(val) {
  return new RegExp(/^[0-9a-fA-F]{24}$/).test(val);
}
