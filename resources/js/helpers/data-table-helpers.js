export function createDataTableButton(app, config) {
  return {
    text: `<span class="fa ${config.icon}"></span><span class="ml-1">${config.title}</span>`,
    action: config.action,
    className:config.className
  };
}

/**
 * default edit button configurations
 */
const DEFAULT_EDIT_BUTTON_CONFIG = {
  title: "Edit",
  icon: "fa-edit",
  onError: () => null,
  className:''
};

/**
 * create edit button to be used in data table component
 *
 *
 * @param {Vue} app
 * @param {Object} config
 */
export function createEditButton(app, config) {
  config = {
    ...DEFAULT_EDIT_BUTTON_CONFIG,
    ...config
  };
  config.action = function(e, dt) {
    let row = dt.rows({ selected: true }).data()[0];
    if(!row) {
      config.onError();
      return;
    } else {

      app.$router.push(config.url+row[config.field]);
    }
  };
  return createDataTableButton(app, config);
}

const DEFAULT_VIEW_BUTTON_CONFIG = {
  title: "View",
  icon: "fa-book-reader",
  onError: () => null,
  className:''
};
/**
 * Create view button
 *
 *
 * @param {Vue} app
 * @param {Object} config
 */
export function createViewButton(app, config) {
  config = {
    ...DEFAULT_VIEW_BUTTON_CONFIG,
    ...config
  };
  config.action = function(e, dt) {
    let row = dt.rows({ selected: true }).data()[0];
    if(!row) {
      config.onError();
      return;
    } else {

      app.$router.push(config.url+row[config.field]);
    }
  };
  return createDataTableButton(app, config);
}
