import { httpCall } from "../../../helpers/http-service";

/**
 * fetch all single visits
 *
 *
 * @param {string} type  [visit type : pm|pharmacy]
 * @param {Object} query [request optional query]
 * @return {Promise}
 */
export function singleVisitCollectionService(type = null, query = {}) {
  let url = "v1/single/customer";
  query['collection_type'] = type;
  return httpCall.get(url, query);
}


export function singlePharmacyVisitCollectionService(query = {}) {
  let url = "v1/single/pharmacy";
  return httpCall.get(url, query);
}
