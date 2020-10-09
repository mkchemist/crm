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
export const ObjectNotation = function (container, key) {
  /** regaular expression test */
  let test = /\./gm;
  /** matches in key */
  let matches = key.match(test);
  /**
   * if not matches
   * it will return container.key if is not equal
   * to undefined
   * else it will return null
   */
  if(!matches) {
    if(container[key] !== undefined) {
      return container[key];
    }
    return null;
  }
  /**
   * splitting key
   *
   * forming array of notation levels
   */
  let parts = key.split('.');
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
  if(parentItem !== undefined) {
    let _joined = parts.join('.');
    return ObjectNotation(parentItem, _joined);
  }
  return null;
}

// TODO need to be refactored
/**
 * filter data
 *
 *
 *
 * @param {*} data
 * @param {*} condition
 */
export function filterData(data, condition){
  let res = {};
  data.forEach((item) => {
    let key = ObjectNotation(item, condition);
    if (!res[key]) {
      res[key] = [];
    }
    res[key].push(item);
  });
  return res;
}
