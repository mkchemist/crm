/**
 * object notation method
 *
 * that take string like 'products.0.cost'
 * and return products->0->cost value
 *
 * @param {object} container
 * @param {string} key
 * @return {mixed}
 */
export const ObjectNotation = function(container, key, $default = null) {
  /** regular expression test */
  let test = /\./gm;
  /** matches in key */
  let matches = key.match(test);
  /**
   * if not matches
   * it will return container.key if is not equal
   * to undefined
   * else it will return null
   */
  if (!matches) {
    if (container[key] !== undefined) {
      return container[key];
    }
    return $default;
  }
  /**
   * splitting key
   *
   * forming array of notation levels
   */
  let parts = key.split(".");
  /**
   * set key at position 0 as a parent item
   */
  let parentItem = container[parts[0]];
  /**
   * shifting to next position
   */
  parts.shift();
  /**
   * if parent item exists
   */
  if (parentItem !== undefined && parentItem !== null) {
    let _joined = parts.join(".");
    return ObjectNotation(parentItem, _joined, $default);
  }
  return $default;
};

/**
 * filter data
 *
 *
 *
 * @param {*} data
 * @param {*} condition
 */
export function filterData(data, param, check = true) {
  let res = {};
  let checkQuery = () => true;
  if (typeof check === "function") {
    checkQuery = check;
  }
  data.forEach(item => {
    if (checkQuery(item)) {
      let key = ObjectNotation(item, param);
      if (!res[key]) {
        res[key] = [];
      }
      res[key].push(item);
    }
  });
  return res;
}

/**
 * check if the given type is string
 *
 * @param {mixed} v
 * @return {boolean}
 */
const isString = v => "string" === typeof v;

/**
 * check if the given type is object
 *
 * @param {mixed} v
 * @return {boolean}
 */
const isObject = v => "object" === typeof v;

/**
 * check if the given type is number
 *
 * @param {mixed} v
 * @return {boolean}
 */
const isNumber = v => "number" === typeof v;

/**
 * check if the given type is null
 *
 * @param {mixed} v
 * @return {boolean}
 */
const isNull = v => v === null || v === "";

/**
 * Exceptions
 */
var INVALID_OBJECT_TYPE_ERROR = "sortBy method used with array of objects only";
var INVALID_ITEM_TYPE_ERROR =
  "sortBy method compare only String and Number types";

/**
 * compare between the given values
 *
 *
 * @param {object} a
 * @param {object} b
 * @param {string} item
 * @param {string} factor
 * @return {int}
 */
function compare(a, b, item, factor) {
  if (!isObject(a) || !isObject(b)) {
    throw new Error(INVALID_OBJECT_TYPE_ERROR);
  }

  let val1 = a[item];
  let val2 = b[item];

  if (
    !isString(val1) &&
    !isString(val2) &&
    !isNumber(val1) &&
    !isNumber(val2)
  ) {
    throw new Error(INVALID_ITEM_TYPE_ERROR);
  }

  if (isString(val1)) {
    val1 = val1.toUpperCase();
  }
  if (isString(val2)) {
    val2 = val2.toUpperCase();
  }

  var result = 0;
  if (val1 > val2) {
    result = 1 * factor;
  }

  if (val1 < val2) {
    result = -1 * factor;
  }

  return result;
}

/**
 * Sorting array of objects
 * @param {array} arr       Array<Object>
 * @param {string} item     [key of sorting]
 * @param {string} dir      [Asc|Desc]
 */
export function sortBy(arr, item, dir = "asc") {
  let res = Array.from(arr);
  let factor = dir.toUpperCase() === "ASC" ? 1 : -1;
  return res.sort((a, b) => {
    return compare(a, b, item, factor);
  });
}

/**
 *
 * @param {string} target
 * @param {string} filename
 * @return {void}
 */
export function ExportToExcel(target, filename = "download-file") {
  let table = document.querySelector(target);
  let content = table.outerHTML;
  let blob = new Blob([content]);
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename+'.xlsx';
  link.click();
}


