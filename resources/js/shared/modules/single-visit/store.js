import { singlePharmacyVisitCollectionService, singleVisitCollectionService } from "./services"

export default {
  namespaced: true,
  actions: {
    PMCollection(module, payload){
      return singleVisitCollectionService(null, payload)
    },
    PharmacyCollection(module, payload){
      return  singlePharmacyVisitCollectionService();
    }
  }
}
