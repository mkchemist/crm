import Validation from "../views/Validation.vue";
import CustomerValidation from "../views/validation/CustomerValidation.vue";
import NewCustomerValidation from "../views/validation/NewCustomerValidation.vue";
import PharmaciesValidation from "../views/validation/PharmacyValidation";
import ParameterValidation from "../views/validation/ParameterValidation";
import FrequencyValidation from "../views/validation/FrequencyValidation.vue";
import NewWorkplaceValidation from "../views/validation/NewWorkplaceValidation.vue"
export default {
  path: '/validation',
  component: Validation,
  children: [
    {
      path: "",
      component: NewCustomerValidation
    },
    {
      path:"customers",
      component: CustomerValidation
    },
    {
      path: "frequency",
      component: FrequencyValidation
    },
    {
      path: "parameters",
      component: ParameterValidation
    },
    {
      path: "workplaces",
      component: NewWorkplaceValidation,

    },
    {
      path: "pharmacies",
      component: PharmaciesValidation
    }
  ]
}
