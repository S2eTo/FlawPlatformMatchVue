/**
 *
 * @param url 目标url
 * @param arg 需要替换的参数名称
 * @param arg_val 替换后的参数的值
 * @returns {string|*|string}
 */
export function changeURLArg(url, arg, arg_val) {
  let pattern = arg + '=([^&]*)';
  let replaceText = arg + '=' + arg_val;
  if (url.match(pattern)) {
    let tmp = '/(' + arg + '=)([^&]*)/gi';
    tmp = url.replace(eval(tmp), replaceText);
    return tmp;
  }

  if (url.match('[\?]')) {
    return url + '&' + replaceText;
  } else {
    return url + '?' + replaceText;
  }

  // return url + '\n' + arg + '\n' + arg_val;
}
