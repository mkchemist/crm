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
  for(let i in data) {
    let item = data[i];
    if (checkQuery(item)) {
      let key = ObjectNotation(item, param);
      if (!res[key]) {
        res[key] = [];
      }
      res[key].push(item);
    }
  }

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
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    target = document.querySelector(target)
    var ctx = {worksheet: filename+'.xls' || 'Worksheet', table: target.innerHTML}
    window.location.href = uri + base64(format(template, ctx))

}

const initialDateRange = {
  start: null,
  end: null
};

/**
 *
 * @param {array} data
 * @param {string} prop
 * @param {object} range
 * @return {Promise}
 */
export function filterByDate(data, prop, range = initialDateRange) {
  return new Promise((res, err) => {
    let { start, end } = range;
    if (!start && !end) {
      return err("Start and End date is undefined");
    }
    let result = data;
    if (start) {
      start = new Date(start).getTime();
      result = result.filter(item => new Date(item[prop]).getTime() >= start);
    }

    if (end) {
      end = new Date(end).getTime();
      result = result.filter(item => new Date(item[prop]) <= end);
    }
    res(result);
  });
}

/**
 *
 * @param {object} data
 * @param {string} prop
 * @param {mixed} condition
 * @return {Promise}
 */
export function filterBy(data, prop, condition) {
  return new Promise((res, err) => {
    if(condition === null) {
      res(data);
    }
    let result= data.filter(item => item[prop] === condition);
    res(result);
  });
}
