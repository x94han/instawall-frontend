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
