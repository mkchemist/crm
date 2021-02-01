/**
 * customers table heads scheme
 *
 *
 */
export const CUSTOMERS_TABLE_HEADS = [
  {
    title: "Name",
    name: "name"
  },
  {
    title: "Specialty",
    name: "specialty"
  },
  {
    title: "Title",
    name: "title"
  },
  {
    title: "Workplace",
    name: "workplace"
  },
  {
    title: "Param",
    name: "parameter"
  },
  {
    title: "Current Freq.",
    name: "current_freq"
  },
  {
    title: "Next Freq.",
    name: "next_freq"
  },
  {
    title: "Plans",
    name: "plans"
  },
  {
    title: "Visits",
    name: "reports"
  },

];

export const DM_CUSTOMERS_HEADS = [
  {
    title: "ID",
    name: "id"
  },
  {
    title: "Area",
    name: "area"
  },
  {
    title: "Brick",
    name: "brick"
  },
  {
    title: "Name",
    name: "name"
  },
  {
    title: "Specialty",
    name: "specialty"
  },
  {
    title: "Parameters",
    name: "parameter"
  },
  {
    title: "Current Freq.",
    name: "current_freq"
  },
  {
    title: "Next Freq.",
    name: "next_freq"
  },
  {
    title: 'Plans',
    name: 'plans'
  },
  {
    title: "Reports",
    name: "reports"
  }
];

export const COACH_REPORT = {
  "Pre-call Planning" : {
    "Review notes, call history,prescribing information and the profile for each Customer prior" : "",
    "Sets pre-call objectives per product per customer" : "",
    "Pre-plans a customized opening, prob responses for expected objection and close for the call": "",
  },
  "Opening": {
    "Results in the customer giving full and undivided attention for FSR": "",
    "Is less than one minute" : "",
    "Applies information from pervious call": ""
  },
  "Initial Probe": {
    "Uses direct and indirect questions to verify customer needs,concerns and buying habits": "",
    "Selects the right questions for the customer at the proper time during the call": "",
    "Engages customer in dialogue and understands non verbal communications skills": "",
  },
  "Promotional Plan": {
    "Communicates product knowledge in response to customer cue": "",
    "Delivers key product messages according to market strategy": "",
    "Reinforce product message using references and visual": "",
    "Uses knowledge of competitive product information to compare": ""
  },
  "Handling of Objections": {
    "Listens actively to customer objection with no interruptions": "",
    "Understands the type of objection and clarifies the customer need" : "",
    "Responds smartly, covers the customer need and check for understand": "",
  },
  "Close": {
    "Reviews uses information and summarizes with agreed upon points": "",
    "Asks for action-oriented commitment": "",
  },
  "Post Call Analysis": {
    "Analyzes new information to determine next objective": "",
    "provides all information on time and in a legible manner": ""
  }
}


export const ProductWithLader = [
  {
    title: 'Product 1',
    name: 'products.0.name'
  },
  {
    title: 'Product 1 lader of adaption',
    name: 'products.0.lader'
  },
  {
    title: 'Product 1 action',
    name: 'products.0.action'
  },
  {
    title: 'Product 1 competitor',
    name: 'products.0.competitor'
  },
  {
    title: 'Product 2',
    name: 'products.1.name'
  },
  {
    title: 'Product 2 lader of adaption',
    name: 'products.1.lader'
  },
  {
    title: 'Product 2 action',
    name: 'products.1.action'
  },
  {
    title: 'Product 2 competitor',
    name: 'products.1.competitor'
  },
  {
    title: 'Product 3',
    name: 'products.2.name'
  },
  {
    title: 'Product 3 lader of adaption',
    name: 'products.2.lader'
  },
  {
    title: 'Product 3 action',
    name: 'products.2.action'
  },
  {
    title: 'Product 3 competitor',
    name: 'products.2.competitor'
  },
  {
    title: 'Product 4',
    name: 'products.3.name'
  },
  {
    title: 'Product 4 lader of adaption',
    name: 'products.3.lader'
  },
  {
    title: 'Product 4 action',
    name: 'products.3.action'
  },
  {
    title: 'Product 4 competitor',
    name: 'products.3.competitor'
  },
]

export const ProductWithRate = [
  {
    title: 'Product 1',
    name: 'products.0.name'
  },
  {
    title: 'Product 1 Rate',
    name: 'products.0.rate'
  },
  {
    title: 'Product 1 competitor',
    name: 'products.0.competitor'
  },
  {
    title: 'Product 1 competitor_rate',
    name: 'products.0.competitor_rate'
  },
  {
    title: 'Product 2',
    name: 'products.1.name'
  },
  {
    title: 'Product 2 Rate',
    name: 'products.1.rate'
  },
  {
    title: 'Product 2 competitor',
    name: 'products.1.competitor'
  },
  {
    title: 'Product 2 competitor_rate',
    name: 'products.1.competitor_rate'
  },
  {
    title: 'Product 3',
    name: 'products.2.name'
  },
  {
    title: 'Product 3 Rate',
    name: 'products.2.rate'
  },
  {
    title: 'Product 3 competitor',
    name: 'products.2.competitor'
  },
  {
    title: 'Product 3 competitor_rate',
    name: 'products.2.competitor_rate'
  },
  {
    title: 'Product 4',
    name: 'products.3.name'
  },
  {
    title: 'Product 4 Rate',
    name: 'products.3.rate'
  },
  {
    title: 'Product 4 competitor',
    name: 'products.3.competitor'
  },
  {
    title: 'Product 4 competitor_rate',
    name: 'products.3.competitor_rate'
  },
];


export const lader_of_adaption = [
  "Never heard",
  "Aware and not use",
  "Tried in a few Rx",
  "Sharing with competitor",
  "2nd line Rx",
  "1st line Rx",
  "1st in all Rx",
  "Advocator"
];

export const visit_actions = [
  "Remind message",
  "Finding new indication",
  "Competitor attack",
  "Thanking visit",
  "Sharpen Commitment",
  "Demonstrate a new message",
  "Handle Objections",
  "Make a deal",
  "Finding new needs"
];

export const visitTypes = [
  "pm face to face",
  "am face to face",
  "sample visit",
  "double visit"
];




export const CHART_COLOR_LIST = [
  '#ff5722',
  '#9e9e9e',
  '#009688',
  '#38c172',
  '#00bcd4',
  '#3f51b5',
  '#673ab7',
  '#9c27b0',
  '#e91e63',
  '#ff9800',
  '#ffc107',
  '#f44336',
  '#ffeb3b',
  '#cddc39',
  '#8bc34a',
  '#4caf50',
  '#607d8b',
  '#795548',
  '#1e7d18'
]
