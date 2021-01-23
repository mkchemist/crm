(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/js/otc-rep/otc-rep"],{

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var buildFullPath = __webpack_require__(/*! ../core/buildFullPath */ "./node_modules/axios/lib/core/buildFullPath.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var mergeConfig = __webpack_require__(/*! ./core/mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var buildURL = __webpack_require__(/*! ../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");
var mergeConfig = __webpack_require__(/*! ./mergeConfig */ "./node_modules/axios/lib/core/mergeConfig.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/buildFullPath.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/buildFullPath.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(/*! ../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/mergeConfig.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/mergeConfig.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/BroadcastingMessages.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/BroadcastingMessages.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/http-service */ "./resources/js/helpers/http-service.js");
/* harmony import */ var _NoDataToShow_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NoDataToShow.vue */ "./resources/js/components/NoDataToShow.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    NoDataToShow: _NoDataToShow_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  mounted: function mounted() {
    this.getMessages();
  },
  data: function data() {
    return {
      messages: [],
      isFetched: false
    };
  },
  methods: {
    getMessages: function getMessages() {
      var _this = this;

      this.messages = [];
      this.isFetched = false;
      return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get('broadcasting').then(function (_ref) {
        var data = _ref.data;
        _this.messages = data.data;
        _this.isFetched = true;
      })["catch"](function (err) {
        console.log(err);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/CycleSelection.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/CycleSelection.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    onSelect: {
      required: true,
      type: Function
    },
    onReset: {
      type: Function,
      required: true
    }
  },
  methods: {
    selectCycle: function selectCycle() {
      this.onSelect();
    },
    resetCycle: function resetCycle() {
      this.onReset();
    }
  },
  computed: {
    activeCycle: {
      get: function get() {
        return this.$store.getters.activeCycle;
      },
      set: function set(cycle) {
        this.date = new Date(cycle.start);
        return this.$store.state.SettingModule.activeCycle = cycle;
      }
    },
    cycles: function cycles() {
      return this.$store.getters.cycles;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/DataFilterBox.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/helpers */ "./resources/js/helpers/helpers.js");
/* harmony import */ var _ModalFade_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ModalFade.vue */ "./resources/js/components/ModalFade.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ModalFade: _ModalFade_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    queryKeys: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    extraKeys: {
      type: Array
    },
    queryOnly: {
      type: Boolean,
      "default": true
    },
    show: {
      type: Boolean,
      required: true
    },
    onClose: {
      type: Function
    },
    onFilter: {
      type: Function,
      required: true
    },
    onReset: {
      type: Function,
      required: true
    }
  },
  computed: {
    filterFields: function filterFields() {
      var _this = this;

      var fields = {};
      this.queryKeys.map(function (key) {
        fields[key] = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["filterData"])(_this.data, key);
      });
      return fields;
    }
  },
  data: function data() {
    return {
      query: {}
    };
  },
  methods: {
    updateQuery: function updateQuery(e) {
      this.query[e.target.name] = e.target.value;
    },
    generateQuery: function generateQuery() {
      var query = {};

      for (var i in this.query) {
        if (this.query[i].trim() !== "" && this.query[i] !== null) {
          query[i] = this.query[i];
        }
      }

      return query;
    },
    filter: function filter() {
      var data = [];
      var query = this.generateQuery();

      if (!this.queryOnly) {
        data = this.data;

        var _loop = function _loop(i) {
          data = data.filter(function (item) {
            return item[i] == query[i];
          });
        };

        for (var i in query) {
          _loop(i);
        }
      }

      this.onFilter(query, data);
      this.onClose();
    },
    reset: function reset() {
      this.onReset();
      this.onClose();
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ErrorPage.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/ErrorPage.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
var base_url = document.getElementById('APP_BASE_URI').value.replace('api/', '');
/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      base_url: base_url
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/LoaderComponent.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/LoaderComponent.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ModalFade.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/ModalFade.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['show', 'data', 'centered', 'footer', 'id', 'headerStyle'],
  watch: {
    show: function show() {
      var _this = this;

      var id = this.id ? "#".concat(this.id) : '#modal_fade';
      var modal = $(id);
      modal.on('hide.bs.modal', function () {
        _this.$emit('onClose');
      });

      if (this.show === true) {
        modal.modal('show');
      } else {
        modal.modal('hide');
      }
    }
  },
  methods: {
    closeModal: function closeModal() {
      var _this2 = this;

      var id = this.id ? "#".concat(this.id) : '#modal_fade';
      var modal = $(id);
      modal.on('hide.bs.modal', function () {
        _this2.$emit('onClose');
      });
      modal.modal('hide');
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/NoDataToShow.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/NoDataToShow.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = (_defineProperty({
  props: ['title', 'bold']
}, "props", {
  title: {
    type: String
  },
  bold: {
    type: String
  },
  iconColor: {
    type: String,
    "default": function _default() {
      return 'text-success';
    }
  }
}));

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SidebarComponent.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SidebarComponent.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  props: ['links']
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/TableComponent.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/TableComponent.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers/http-service */ "./resources/js/helpers/http-service.js");
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  props: ["heads", "data", "headClass", "withFavorite", "withUnlink", "onUnlink", "orderBy", "notResponsive", "actionCell", "unselectable", "id"],
  data: function data() {
    return {
      table: null
    };
  },
  mounted: function mounted() {
    this.createTable();
  },
  computed: {
    rows: function rows() {
      return this.data;
    }
  },
  methods: {
    _notation: function _notation(container, key, $default) {
      return Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_1__["ObjectNotation"])(container, key, $default);
    },

    /**
     * create datatable instance
     *
     *
     */
    createTable: function createTable() {
      var buttons = [{
        extend: "excel",
        text: '<i class="fa fa-file-excel"></i> Excel'
      }, {
        extend: "pdf",
        text: '<i class="fa fa-file-pdf"></i> PDF'
      }];
      buttons = this.addFavoriteButton(buttons);
      buttons = this.addUnlinkButton(buttons);
      var select = this.unselectable ? false : {
        style: 'single'
      };
      this.table = $("#".concat(this.id ? this.id : 'data-table')).DataTable({
        order: this.ordering(),
        language: {
          searchPlaceholder: "Search..."
        },
        lengthMenu: [20, 50, 100],
        buttons: buttons,
        dom: "Bflirtp",
        select: select,
        fixedHeader: {
          header: true,
          footer: true
        }
      });
    },

    /**
     * add favorite button
     *
     * @param {array} buttons [buttons container]
     * @return {array}
     */
    addFavoriteButton: function addFavoriteButton(buttons) {
      /**
       * Vue component instance
       */
      var _this = this;
      /**
       * check if props of withFavorite is true
       * if true add favorite button
       * set button action to call favorite list api
       * and selected customer to favorite list
       *
       *
       */


      if (this.withFavorite) {
        buttons.push({
          text: '<i class="fa fa-star"></i> Favorite',
          action: function action(e, dt, node, config) {
            var index = _this.actionCell ? _this.actionCell : 0;
            /** get selected customer id from datatable api  */

            var cId = dt.row({
              selected: true
            }).data()[index];
            /** call favorite list api */

            _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].post("customers-favorite-list", {
              id: cId
            }).then(function (_ref) {
              var data = _ref.data;
              data.message = data.data;

              _this.handleResponse(data);
            });
          }
        });
      }

      return buttons;
    },
    addUnlinkButton: function addUnlinkButton(buttons) {
      /** vue component instance */
      var _this = this;
      /**
       * if withUnlink props is true
       *
       */


      if (this.withUnlink) {
        buttons.push({
          text: '<i class="fa fa-unlink"></i> unlink',
          action: function action(e, dt) {
            /** get selected customer id */
            var id = dt.row({
              selected: true
            }).data()[0];
            _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].post("customers-favorite-list/" + id, {
              _method: "DELETE"
            }).then(function (_ref2) {
              var data = _ref2.data;
              data.message = data.data;

              _this.handleResponse(data, function (data) {
                if (_this.onUnlink) {
                  if (typeof _this.onUnlink === "function") {
                    _this.onUnlink.call();
                  }
                }
              });
            });
          }
        });
      }

      return buttons;
    },

    /**
     * ordering table header
     *
     */
    ordering: function ordering() {
      var _this2 = this;

      if (!this.orderBy) {
        return [[1, "asc"]];
      }

      var $orderBy = this.orderBy;
      var order = [];
      $orderBy = $orderBy.split("|");
      $orderBy.forEach(function (item) {
        var parts = item.split(",");

        _this2.heads.forEach(function (head, i) {
          if (head.title === parts[0]) {
            var dir = parts[1] ? parts[1] : "asc";
            order.push([i, dir]);
          }
        });
      });
      return order;
    }
  },
  destroyed: function destroyed() {
    this.table.destroy();
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/App.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_Navbar_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/Navbar.vue */ "./resources/js/otc-rep/components/Navbar.vue");
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    Navbar: _components_Navbar_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {
    this.$store.dispatch('fetchingApplicationSettings');
    this.$store.dispatch('getAppUserLocations');
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/Navbar.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/http-service */ "./resources/js/helpers/http-service.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  data: function data() {
    return {
      baseUrl: _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["UrlHelper"].base(),
      logoUrl: _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["UrlHelper"].generate("images/Logo.png"),
      changePassword: _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["UrlHelper"].generate('change-password'),
      logout: _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["UrlHelper"].generate('logout'),
      links: [{
        title: "Home",
        path: "/"
      }, {
        title: "Pharmacies",
        path: "/pharmacies"
      }, {
        title: "Planner",
        path: "/planner"
      }, {
        title: "Reports",
        path: "/reports"
      }]
    };
  },
  computed: {
    user: function user() {
      return this.$store.getters.user;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/constants */ "./resources/js/helpers/constants.js");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    data: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    pharmacyProducts: {
      type: Boolean,
      "default": function _default() {
        return false;
      }
    }
  },
  computed: {
    laders: function laders() {
      return _helpers_constants__WEBPACK_IMPORTED_MODULE_0__["lader_of_adaption"];
    },
    actions: function actions() {
      return _helpers_constants__WEBPACK_IMPORTED_MODULE_0__["visit_actions"];
    },
    products: function products() {
      var products = [];
      this.$store.getters.line.map(function (item) {
        products = _toConsumableArray(item.products);
      });
      return products;
    },
    productData: function productData() {
      var data = this.data;
      data.map(function (item) {
        if (!item["competitors"]) {
          item["competitors"] = [{
            name: item.competitor,
            rate: item.competitor_rate || null
          }];
        }
      });
      return data;
    }
  },
  methods: {
    /* add product */
    addProduct: function addProduct() {
      if (this.data.length >= 4) {
        return;
      }

      var productScheme = {
        name: null,
        lader: null,
        actions: null,
        rate: null,
        stock: 0,
        order: 0,
        dist: null,
        competitors: [{
          name: null,
          rate: null,
          stock: 0
        }]
      };
      this.data.push(productScheme);
    },

    /**
     * Delete product
     *
     * @param {int} i [product index]
     */
    deleteProduct: function deleteProduct(_PI) {
      this.data.splice(_PI, 1);
    },

    /**
     * add competitor to the given product
     *
     * @param {int} i [product index]
     */
    addCompetitor: function addCompetitor(_PI) {
      if (this.data[_PI].competitors.length >= 3) {
        return;
      }

      this.data[_PI].competitors.push({
        name: null,
        rate: null
      });
    },

    /**
     * delete competitor of the given product
     *
     * @param {int} _PI [product index]
     * @param {int} _CI [competitor index]
     */
    deleteCompetitor: function deleteCompetitor(_PI, _CI) {
      this.data[_PI].competitors.splice(_CI, 1);
    },

    /**
     * get product competitors
     *
     * @param {String} competitor
     */
    getProductCompetitors: function getProductCompetitors(product) {
      var competitors = [];
      this.products.forEach(function (item) {
        if (item.name === product) {
          competitors = item.competitors;
        }
      });
      return competitors;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/PlannerActions.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/PlannerActions.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_ModalFade_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/ModalFade.vue */ "./resources/js/components/ModalFade.vue");
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/http-service */ "./resources/js/helpers/http-service.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    ModalFade: _components_ModalFade_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  props: {
    type: {
      type: String,
      required: true
    },
    store: {
      type: Array,
      required: true
    },
    update: {
      type: Array,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  data: function data() {
    return {
      showDuplicateModal: false,
      showEditModal: false,
      duplicate_date: null,
      edit_date: null
    };
  },
  methods: {
    /* open duplicate modal */
    openDuplicateModal: function openDuplicateModal() {
      this.showDuplicateModal = true;
    },

    /* close duplicate modal */
    closeDuplicateModal: function closeDuplicateModal() {
      this.showDuplicateModal = false;
    },

    /* open edit modal */
    openEditModal: function openEditModal() {
      this.showEditModal = true;
    },

    /* close edit modal */
    closeEditModal: function closeEditModal() {
      this.showEditModal = false;
    },

    /**
     * prepare add request
     *
     * @return {Object}
     */
    prepareRequest: function prepareRequest() {
      var request = {
        date: this.date,
        type: this.type,
        titles: JSON.stringify(this.store)
      };

      if (this.type === "health_day") {
        request.titles = JSON.stringify(["health day"]);
        request.pharmacy = this.store[0].id;
      }

      return request;
    },

    /* Adding plans */
    add: function add() {
      var _this = this;

      if (!this.store.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }

      var request = this.prepareRequest();
      return _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].post("otc-rep/v1/planner", request).then(function (_ref) {
        var data = _ref.data;

        _this.handleResponse(data, function (data) {
          _this.$store.dispatch("fetchPlans", {
            force: true
          });
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    },

    /* Delete Plans */
    deletePlans: function deletePlans() {
      var _this2 = this;

      if (!this.update.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }

      _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].post("otc-rep/v1/planner/group-delete", {
        ids: JSON.stringify(this.update)
      }).then(function (_ref2) {
        var data = _ref2.data;

        _this2.handleResponse(data, function (data) {
          _this2.$store.dispatch("fetchPlans", {
            force: true
          });
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    },

    /* update plans */
    updatePlans: function updatePlans() {
      var _this3 = this;

      if (!this.update.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }

      if (this.isWeekEndDay(this.edit_date)) {
        this.$toasted.error("You choose Friday of date ".concat(this.edit_date), {
          icon: "fa-exclamation"
        });
        return;
      }

      var request = {
        date: this.edit_date,
        ids: JSON.stringify(this.update),
        _method: "PUT"
      };
      _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].post("otc-rep/v1/planner/" + this.edit_date, request).then(function (_ref3) {
        var data = _ref3.data;

        _this3.handleResponse(data, function (data) {
          _this3.$store.dispatch("fetchPlans", {
            force: true
          });

          _this3.edit_date = null;

          _this3.closeEditModal();
        });
      })["catch"](function (err) {
        console.log(err);
      });
    },

    /* Duplicate plans */
    duplicate: function duplicate() {
      var _this4 = this;

      if (!this.update.length) {
        this.$toasted.error("No item selected", {
          icon: "fa-exclamation"
        });
        return;
      }

      if (this.isWeekEndDay(this.duplicate_date)) {
        this.$toasted.error("You choose Friday of date ".concat(this.duplicate_date), {
          icon: "fa-exclamation"
        });
        return;
      }

      var request = {
        date: this.duplicate_date,
        ids: JSON.stringify(this.update)
      };
      _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].post("otc-rep/v1/planner/duplicate", request).then(function (_ref4) {
        var data = _ref4.data;

        _this4.handleResponse(data, function (data) {
          _this4.$store.dispatch("fetchPlans", {
            force: true
          });

          _this4.duplicate_date = null;

          _this4.closeDuplicateModal();
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    },

    /**
     * check if the given date is weekend day
     *
     * @param {String} date
     * @return {Boolean}
     */
    isWeekEndDay: function isWeekEndDay(date) {
      date = new Date(date);

      if (date.getDay() === 5) {
        return true;
      }

      return false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Home.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Home.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_BroadcastingMessages_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/BroadcastingMessages.vue */ "./resources/js/components/BroadcastingMessages.vue");
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    BroadcastingMessages: _components_BroadcastingMessages_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Pharmacies.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Pharmacies.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_SidebarComponent_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/SidebarComponent.vue */ "./resources/js/components/SidebarComponent.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    SidebarComponent: _components_SidebarComponent_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  mounted: function mounted() {
    this.$store.dispatch('fetchPharmacies');
  },
  data: function data() {
    return {
      links: [{
        title: 'New Pharmacy',
        icon: 'fa-plus-circle',
        link: '/pharmacies/new'
      }, {
        title: 'Pharmacies List',
        icon: 'fa-list',
        link: '/pharmacies'
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Planner.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Planner.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_cal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-cal */ "./node_modules/vue-cal/dist/vuecal.common.js");
/* harmony import */ var vue_cal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue_cal__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_cal_dist_vuecal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-cal/dist/vuecal.css */ "./node_modules/vue-cal/dist/vuecal.css");
/* harmony import */ var vue_cal_dist_vuecal_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_cal_dist_vuecal_css__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_CycleSelection_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/CycleSelection.vue */ "./resources/js/components/CycleSelection.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {
    this.$store.dispatch('fetchPlans');
  },
  components: {
    VueCal: vue_cal__WEBPACK_IMPORTED_MODULE_0___default.a,
    CycleSelection: _components_CycleSelection_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  computed: {
    activeCycle: function activeCycle() {
      return this.$store.getters.activeCycle;
    }
  },
  data: function data() {
    return {
      date: new Date().format()
    };
  },
  methods: {
    onDayClick: function onDayClick(e) {
      this.date = new Date(e).format();
    },
    onSelectCycle: function onSelectCycle() {},
    onResetCycle: function onResetCycle() {
      this.$store.commit('resetActiveCycle');
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Report.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Report.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/http-service */ "./resources/js/helpers/http-service.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  computed: {
    locations: function locations() {
      return this.$store.getters.appUserLocations;
    },
    types: function types() {
      return this.$store.getters.pharmacyTypes;
    }
  },
  data: function data() {
    return {
      pharmacy: {
        name: null,
        key_person: null,
        type: null,
        address: null
      },
      brick: null
    };
  },
  methods: {
    savePharmacy: function savePharmacy() {
      var _this = this;

      var request = Object.assign({}, this.pharmacy, this.brick);
      _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].post('otc-rep/v1/pharmacies', request).then(function (_ref) {
        var data = _ref.data;

        _this.handleResponse(data, function (data) {
          _this.$router.push('/pharmacies');
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    },
    getSelectedBrickLocation: function getSelectedBrickLocation(brick) {}
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/http-service */ "./resources/js/helpers/http-service.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {
    this.fetchPharmacy();
  },
  computed: {
    locations: function locations() {
      return this.$store.getters.appUserLocations;
    },
    types: function types() {
      return this.$store.getters.pharmacyTypes;
    }
  },
  data: function data() {
    return {
      pharmacy: null,
      fetched: false
    };
  },
  methods: {
    id: function id() {
      return this.$route.params.id;
    },
    fetchPharmacy: function fetchPharmacy() {
      var _this = this;

      var id = this.id();
      return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get("otc-rep/v1/pharmacies/" + id).then(function (_ref) {
        var data = _ref.data;

        _this.handleResponse(data, function (data) {
          _this.pharmacy = data.data;
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    },
    savePharmacy: function savePharmacy() {
      var _this2 = this;

      var id = this.id();

      var request = _objectSpread(_objectSpread({}, this.pharmacy), {}, {
        _method: 'PUT'
      });

      return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].post('otc-rep/v1/pharmacies/' + id, request).then(function (_ref2) {
        var data = _ref2.data;

        _this2.handleResponse(data, function (data) {
          _this2.$store.dispatch('fetchPharmacies', {
            force: true
          });

          _this2.$router.push('/pharmacies');
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    },
    getSelectedBrickLocation: function getSelectedBrickLocation(brick) {}
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_DataFilterBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../components/DataFilterBox */ "./resources/js/components/DataFilterBox.vue");
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../helpers/http-service */ "./resources/js/helpers/http-service.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    DataFilterBox: _components_DataFilterBox__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  computed: {
    pharmacies: function pharmacies() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }

      return this.$store.getters.allPharmacies;
    },
    isPharmaciesFetched: function isPharmaciesFetched() {
      return this.$store.getters.isPharmaciesFetched;
    }
  },
  data: function data() {
    return {
      heads: [{
        title: "Pharmacy",
        name: "name"
      }, {
        title: "Type",
        name: "type"
      }, {
        title: "Key Person",
        name: "key_person"
      }, {
        title: "Visits",
        name: 'reports'
      }, {
        title: "Address",
        name: "address"
      }, {
        title: "Brick",
        name: "brick"
      }, {
        title: "Area",
        name: "area"
      }, {
        title: "District",
        name: "district"
      }, {
        title: "Territory",
        name: "territory"
      }],
      showFilterModal: false,
      shouldRenderFilter: false,
      filteredList: []
    };
  },
  methods: {
    openFilterModal: function openFilterModal() {
      this.showFilterModal = true;
    },
    closeFilterModal: function closeFilterModal() {
      this.showFilterModal = false;
    },
    onFilter: function onFilter(query, data) {
      var _this = this;

      this.shouldRenderFilter = true;
      this.filteredList = [];
      Object(_helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["asyncDataFlow"])(data, function (data) {
        _this.filteredList = data;
      });
    },
    onReset: function onReset() {
      var _this2 = this;

      this.filteredList = [];
      Object(_helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["asyncDataFlow"])(new Array(), function (d) {
        _this2.shouldRenderFilter = false;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/http-service */ "./resources/js/helpers/http-service.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {
    this.fetchPharmacy();
  },
  data: function data() {
    return {
      pharmacy: null,
      fetched: false
    };
  },
  methods: {
    id: function id() {
      return this.$route.params.id;
    },
    fetchPharmacy: function fetchPharmacy() {
      var _this = this;

      var id = this.id();
      return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get("otc-rep/v1/pharmacies/" + id).then(function (_ref) {
        var data = _ref.data;
        _this.pharmacy = data.data;
        _this.fetched = true;
      })["catch"](function (err) {
        return console.log(err);
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../helpers/helpers */ "./resources/js/helpers/helpers.js");
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../helpers/http-service */ "./resources/js/helpers/http-service.js");
/* harmony import */ var _components_PlannerActions_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/PlannerActions.vue */ "./resources/js/otc-rep/components/PlannerActions.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    PlannerActions: _components_PlannerActions_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  mounted: function mounted() {
    this.$store.dispatch("getAppUserLocations");
  },
  computed: {
    planned: function planned() {
      var _this = this;

      var plans = this.$store.getters.allPlans;
      return plans.filter(function (plan) {
        return plan.start === _this.$attrs.date;
      });
    },
    appUserLocations: function appUserLocations() {
      return this.$store.getters.appUserLocations;
    }
  },
  data: function data() {
    return {
      selected: [],
      updated: [],
      type: "regular"
    };
  },
  methods: {
    /**
     * add or delete brick from plan
     *
     * @param {String} brick
     */
    toggleBrickPlan: function toggleBrickPlan(brick) {
      this.selected = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["checkerSelect"])(this.selected, brick, event);
    },

    /**
     * add or remove planned visits
     * from plans
     *
     * @param {String} brick
     */
    togglePlannedVisits: function togglePlannedVisits(brick) {
      this.updated = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["checkerSelect"])(this.updated, brick, event);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_DataFilterBox_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../components/DataFilterBox.vue */ "./resources/js/components/DataFilterBox.vue");
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../helpers/helpers */ "./resources/js/helpers/helpers.js");
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../helpers/http-service */ "./resources/js/helpers/http-service.js");
/* harmony import */ var _components_PlannerActions_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/PlannerActions.vue */ "./resources/js/otc-rep/components/PlannerActions.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    DataFilterBox: _components_DataFilterBox_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    PlannerActions: _components_PlannerActions_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  mounted: function mounted() {
    this.$store.dispatch("fetchPharmacies");
  },
  computed: {
    planned: function planned() {
      var _this = this;

      this.resetUpdatedPlans();
      return this.$store.getters.allPlans.filter(function (plan) {
        return plan.start === _this.$attrs.date;
      });
    },
    pharmacies: function pharmacies() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }

      return this.$store.getters.allPharmacies;
    }
  },
  data: function data() {
    return {
      selected: [],
      updated: [],
      shouldRenderFilter: false,
      filteredList: [],
      showFilterBox: false,
      type: "health_day"
    };
  },
  methods: {
    /* open filter box */
    openFilterBox: function openFilterBox() {
      this.showFilterBox = true;
    },

    /**
     * close filter box
     */
    closeFilterBox: function closeFilterBox() {
      this.showFilterBox = false;
    },

    /**
     * filter list
     *
     * @param {Array} data [list of pharmacies]
     */
    onFilter: function onFilter(query, data) {
      var _this2 = this;

      Object(_helpers_http_service__WEBPACK_IMPORTED_MODULE_2__["asyncDataFlow"])(data, function (data) {
        _this2.shouldRenderFilter = true;
        _this2.filteredList = data;
      });
    },

    /**
     * Reset filter
     *
     *
     */
    onReset: function onReset() {
      var _this3 = this;

      Object(_helpers_http_service__WEBPACK_IMPORTED_MODULE_2__["asyncDataFlow"])([], function (data) {
        _this3.shouldRenderFilter = false;
        _this3.filteredList = [];
      });
    },

    /**
     * toggle plan
     *
     * @param {String} brick
     */
    togglePlan: function togglePlan(pharmacy) {
      var inputs = document.querySelectorAll('#pharmacy_list input[type="checkbox"]');

      if (event.target.checked) {
        inputs.forEach(function (input) {
          return input.checked = false;
        });
        event.target.checked = true;
        this.selected = [];
        this.selected.push(pharmacy);
      } else {
        this.selected = [];
      }
    },

    /**
     * add or remove plan to updated container
     *
     * @param {int} id
     */
    selectPlanToRemove: function selectPlanToRemove(id) {
      this.updated = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_1__["checkerSelect"])(this.updated, id, event);
    },
    resetUpdatedPlans: function resetUpdatedPlans() {
      this.updated = [];
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_cal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-cal */ "./node_modules/vue-cal/dist/vuecal.common.js");
/* harmony import */ var vue_cal__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue_cal__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_cal_dist_vuecal_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-cal/dist/vuecal.css */ "./node_modules/vue-cal/dist/vuecal.css");
/* harmony import */ var vue_cal_dist_vuecal_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue_cal_dist_vuecal_css__WEBPACK_IMPORTED_MODULE_1__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    VueCal: vue_cal__WEBPACK_IMPORTED_MODULE_0___default.a
  },
  computed: {
    plans: function plans() {
      return this.$store.getters.allPlans;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_DataFilterBox_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../components/DataFilterBox.vue */ "./resources/js/components/DataFilterBox.vue");
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../helpers/http-service */ "./resources/js/helpers/http-service.js");
/* harmony import */ var _components_OtcVisitProducts_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/OtcVisitProducts.vue */ "./resources/js/otc-rep/components/OtcVisitProducts.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    DataFilterBox: _components_DataFilterBox_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
    OtcVisitProducts: _components_OtcVisitProducts_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  mounted: function mounted() {
    this.$store.dispatch("fetchPharmacies");
  },
  computed: {
    pharmacies: function pharmacies() {
      if (this.shouldRenderFilter) {
        return this.filteredList;
      }

      return this.$store.getters.allPharmacies;
    },
    isFetched: function isFetched() {
      return this.$store.getters.isPharmaciesFetched;
    }
  },
  data: function data() {
    return {
      showFilterBox: false,
      shouldRenderFilter: false,
      filteredList: [],
      filterQueryKeys: ["area", "brick"],
      visit: {
        pharmacy: null,
        date: new Date().format(),
        products: [],
        general_feedback: null
      }
    };
  },
  methods: {
    /* save report */
    saveReport: function saveReport() {
      var _this = this;

      if (!this.visit.products.length) {
        this.$toasted.error("You must add one product at least", {
          icon: 'fa-exclamation'
        });
        return;
      }

      var request = Object.assign({}, this.visit);
      request.products = JSON.stringify(request.products);
      _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].post('otc-rep/v1/reports/pharmacy', request).then(function (_ref) {
        var data = _ref.data;

        _this.handleResponse(data, function (data) {
          _this.$store.dispatch('fetchPharmacyReports', {
            force: true
          });

          _this.$router.push("/reports/view/pharmacy");
        });
      })["catch"](function (err) {
        return console.log(err);
      });
    },

    /**
     * filter pharmacy list
     *
     * @param {Object} query [filter query result]
     * @param {Array} data [filtered list]
     */
    onFilter: function onFilter(query, data) {
      var _this2 = this;

      this.shouldRenderFilter = true;
      this.filteredList = [];
      Object(_helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["asyncDataFlow"])(data, function (data) {
        return _this2.filteredList = data;
      });
    },

    /* reset filter */
    onReset: function onReset() {
      var _this3 = this;

      this.filteredList = [];
      Object(_helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["asyncDataFlow"])([], function (data) {
        _this3.filteredList = [];
        _this3.shouldRenderFilter = false;
      });
    },

    /* open filter */
    openFilterBox: function openFilterBox() {
      this.showFilterBox = true;
    },

    /* close filter */
    closeFilterBox: function closeFilterBox() {
      this.showFilterBox = false;
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_SidebarComponent_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../components/SidebarComponent.vue */ "./resources/js/components/SidebarComponent.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  mounted: function mounted() {
    this.$store.dispatch('fetchPharmacyReports');
  },
  components: {
    SidebarComponent: _components_SidebarComponent_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      views: [{
        title: "Pharmacy View",
        icon: "fa-store",
        link: "/reports/view/pharmacy"
      }, {
        title: "Date View",
        icon: "fa-calendar-alt",
        link: "/reports/view/pharmacy/date"
      }, {
        title: "Product View",
        icon: "fa-gift",
        link: "/reports/view/pharmacy/product"
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_SidebarComponent_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../components/SidebarComponent.vue */ "./resources/js/components/SidebarComponent.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  components: {
    SidebarComponent: _components_SidebarComponent_vue__WEBPACK_IMPORTED_MODULE_0__["default"]
  },
  data: function data() {
    return {
      viewLinks: [{
        title: 'View Pharmacy Report',
        icon: 'fa-book-reader',
        link: '/reports/view/pharmacy'
      }, {
        title: 'View Health day Report',
        icon: 'fa-book-reader',
        link: '/reports/view/health-day'
      }, {
        title: 'View Pharmacy plan',
        icon: 'fa-book-reader',
        link: '/reports/view/plan/pharmacy'
      }, {
        title: 'View Health day Plan',
        icon: 'fa-book-reader',
        link: '/reports/view/plan/health-day'
      }, {
        title: 'View Orders',
        icon: 'fa-book-reader',
        link: '/reports/view/order'
      }],
      addLinks: [{
        title: 'Add Pharmacy report',
        icon: 'fa-plus-circle',
        link: '/reports/add/pharmacy'
      }, {
        title: 'Add health day report',
        icon: 'fa-plus-circle',
        link: '/reports/add/health-day'
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  computed: {
    reports: function reports() {
      return this.$store.getters.pharmacyReportsDateView;
    },
    isFetched: function isFetched() {
      return this.$store.getters.pharmacyReportsFetched;
    },
    totalReports: function totalReports() {
      return this.$store.getters.totalPharmacyReportsCount;
    }
  },
  methods: {
    exportToExcel: function exportToExcel() {
      var filename = "".concat(this.$store.getters.user.name, "_pharmacy_reports_").concat(new Date().format());
      var target = document.getElementById('pharmacy_reports').cloneNode();
      target.innerHTML = document.getElementById('pharmacy_reports').innerHTML;
      var removedRows = target.querySelectorAll('._removed__raw');
      removedRows.forEach(function (row) {
        row.remove();
      });
      Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["ExportToExcel"])(target, filename);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../helpers/helpers */ "./resources/js/helpers/helpers.js");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  computed: {
    reports: function reports() {
      return this.$store.getters.pharmacyReportsPharmacyView;
    },
    isFetched: function isFetched() {
      return this.$store.getters.pharmacyReportsFetched;
    },
    totalReports: function totalReports() {
      return this.$store.getters.totalPharmacyReportsCount;
    }
  },
  methods: {
    exportToExcel: function exportToExcel() {
      var filename = "".concat(this.$store.getters.user.name, "_pharmacy_reports_").concat(new Date().format());
      var target = document.getElementById('pharmacy_reports').cloneNode();
      target.innerHTML = document.getElementById('pharmacy_reports').innerHTML;
      var removedRows = target.querySelectorAll('._removed__raw');
      removedRows.forEach(function (row) {
        row.remove();
      });
      Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["ExportToExcel"])(target, filename);
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  computed: {
    reports: function reports() {
      return this.$store.getters.pharmacyReports;
    },
    isFetched: function isFetched() {
      return this.$store.getters.pharmacyReportsFetched;
    }
  },
  data: function data() {
    return {
      heads: [{
        title: 'Date',
        name: 'date'
      }, {
        title: 'Pharmacy',
        name: 'pharmacy'
      }, {
        title: 'Type',
        name: 'type'
      }, {
        title: 'Product',
        name: ' product'
      }, {
        title: 'Rate',
        name: 'rate'
      }, {
        title: 'Stock',
        name: 'stock'
      }, {
        title: 'Order',
        name: 'order'
      }, {
        title: 'Distributor',
        name: 'distributor'
      }, {
        title: 'Competitor 1',
        name: 'competitor1'
      }, {
        title: 'Competitor 1 Rate',
        name: 'competitor1_rate'
      }, {
        title: 'Competitor 1 Stock',
        name: "competitor1_stock"
      }, {
        title: 'Competitor 2',
        name: 'competitor2'
      }, {
        title: 'Competitor 2 Rate',
        name: 'competitor2_rate'
      }, {
        title: 'Competitor 2 Stock',
        name: "competitor2_stock"
      }, {
        title: 'Competitor 3',
        name: 'competitor3'
      }, {
        title: 'Competitor 3 Rate',
        name: 'competitor3_rate'
      }, {
        title: 'Competitor 3 Stock',
        name: "competitor3_stock"
      }, {
        title: 'Feedback',
        name: 'feedback'
      }]
    };
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-2!./node_modules/sass-loader/dist/cjs.js??ref--11-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".flex-item[data-v-4200b5ce] {\n  width: 50% !important;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-2!./node_modules/sass-loader/dist/cjs.js??ref--11-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "body {\n  background-color: #38c172 !important;\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-2!./node_modules/sass-loader/dist/cjs.js??ref--11-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".logo-img[data-v-7353425a] {\n  width: 100px;\n  transition: 0.5s;\n}\n@media (min-width: 992px) {\n.logo-img[data-v-7353425a] {\n    width: 200px;\n}\n}", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-2!./node_modules/sass-loader/dist/cjs.js??ref--11-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--11-2!../../../node_modules/sass-loader/dist/cjs.js??ref--11-3!../../../node_modules/vue-loader/lib??vue-loader-options!./DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-2!./node_modules/sass-loader/dist/cjs.js??ref--11-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--11-2!../../../node_modules/sass-loader/dist/cjs.js??ref--11-3!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--11-2!./node_modules/sass-loader/dist/cjs.js??ref--11-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--11-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--11-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/BroadcastingMessages.vue?vue&type=template&id=b7751b50&":
/*!***********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/BroadcastingMessages.vue?vue&type=template&id=b7751b50& ***!
  \***********************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 border rounded" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "p-2",
        staticStyle: { height: "150px", overflow: "auto" }
      },
      [
        _vm.messages.length
          ? _c(
              "div",
              {},
              _vm._l(_vm.messages, function(message) {
                return _c(
                  "div",
                  { key: message.id, class: "alert " + message.type },
                  [
                    _c("p", { staticClass: "alert-heading" }, [
                      _c("span", { staticClass: "lead" }, [
                        _vm._v(_vm._s(message.title))
                      ]),
                      _vm._v(" "),
                      _c("small", { staticClass: "text-muted float-right" }, [
                        _vm._v(_vm._s(message.created_at))
                      ])
                    ]),
                    _vm._v(" "),
                    _c("small", [
                      _c("span", {
                        domProps: { innerHTML: _vm._s(message.body) }
                      })
                    ])
                  ]
                )
              }),
              0
            )
          : _vm.isFetched
          ? _c(
              "div",
              [_c("no-data-to-show", { attrs: { title: "No new messages" } })],
              1
            )
          : _c("loader-component")
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "bg-success text-light p-2" }, [
      _c("span", { staticClass: "fa fa-bullhorn" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [
        _vm._v("Broadcasting messages")
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/CycleSelection.vue?vue&type=template&id=0d3a191e&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/CycleSelection.vue?vue&type=template&id=0d3a191e& ***!
  \*****************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "p-2 border rounded my-1 shadow" }, [
    _c(
      "label",
      { staticClass: "small text-muted", attrs: { for: "active_cycle" } },
      [_vm._v("Current Cycle")]
    ),
    _vm._v(" "),
    _c(
      "select",
      {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.activeCycle,
            expression: "activeCycle"
          }
        ],
        staticClass: "form-control form-control-sm",
        attrs: {
          name: "active_cycle",
          id: "active_cycle",
          disabled: !_vm.cycles.length || !_vm.activeCycle
        },
        on: {
          change: function($event) {
            var $$selectedVal = Array.prototype.filter
              .call($event.target.options, function(o) {
                return o.selected
              })
              .map(function(o) {
                var val = "_value" in o ? o._value : o.value
                return val
              })
            _vm.activeCycle = $event.target.multiple
              ? $$selectedVal
              : $$selectedVal[0]
          }
        }
      },
      _vm._l(_vm.cycles, function(cycle, i) {
        return _c("option", { key: "cycle_" + i, domProps: { value: cycle } }, [
          _vm._v(_vm._s(cycle.name))
        ])
      }),
      0
    ),
    _vm._v(" "),
    _c("div", { staticClass: "p-2 text-right" }, [
      _c(
        "button",
        {
          staticClass: "btn btn-sm btn-primary",
          on: { click: _vm.selectCycle }
        },
        [
          _c("span", { staticClass: "fa fa-check-circle" }),
          _vm._v(" "),
          _c("span", [_vm._v("select")])
        ]
      ),
      _vm._v(" "),
      _c(
        "button",
        { staticClass: "btn btn-sm btn-dark", on: { click: _vm.resetCycle } },
        [
          _c("span", { staticClass: "fa fa-redo" }),
          _vm._v(" "),
          _c("span", [_vm._v("reset")])
        ]
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("modal-fade", {
        attrs: { show: _vm.show, headerStyle: "bg-primary text-light" },
        on: { onClose: _vm.onClose },
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_c("span", [_vm._v("Data Filter")])]
            },
            proxy: true
          },
          {
            key: "body",
            fn: function() {
              return [
                _c(
                  "div",
                  { staticClass: "row mx-auto justify-content-between" },
                  [
                    _vm._l(Object.keys(_vm.filterFields), function(field) {
                      return _c(
                        "div",
                        {
                          key: "filter_" + field,
                          staticClass: "form-group flex-item px-2"
                        },
                        [
                          _c(
                            "label",
                            {
                              staticClass: "text-muted small",
                              attrs: { for: field }
                            },
                            [_vm._v(_vm._s(field.toUpperCase()))]
                          ),
                          _vm._v(" "),
                          _c(
                            "select",
                            {
                              staticClass: "form-control form-control-sm",
                              attrs: { name: field, id: field + "_selection" },
                              on: { change: _vm.updateQuery }
                            },
                            [
                              _c("option", { domProps: { value: null } }, [
                                _vm._v("Select " + _vm._s(field))
                              ]),
                              _vm._v(" "),
                              _vm._l(_vm.filterFields[field], function(
                                item,
                                index
                              ) {
                                return _c(
                                  "option",
                                  {
                                    key:
                                      "filter_selection_" + field + "_" + index,
                                    domProps: { value: index }
                                  },
                                  [
                                    _vm._v(
                                      _vm._s(index) +
                                        " (" +
                                        _vm._s(item.length) +
                                        ")"
                                    )
                                  ]
                                )
                              })
                            ],
                            2
                          )
                        ]
                      )
                    }),
                    _vm._v(" "),
                    _vm._l(_vm.extraKeys, function(field) {
                      return _c(
                        "div",
                        {
                          key: "extra_field_" + field.title,
                          staticClass: "form-group flex-item px-2"
                        },
                        [
                          _c(
                            "label",
                            { attrs: { for: field.title + "_" + field.key } },
                            [_vm._v(_vm._s(field.title))]
                          ),
                          _vm._v(" "),
                          _c(
                            "select",
                            {
                              staticClass: "form-control form-control-sm",
                              attrs: {
                                name: field.title + "_" + field.key,
                                id: field.title + "_" + field.key
                              },
                              on: { change: _vm.updateQuery }
                            },
                            [
                              _c("option", { domProps: { value: null } }, [
                                _vm._v(" select " + _vm._s(field.title))
                              ]),
                              _vm._v(" "),
                              _vm._l(field.data, function(item) {
                                return _c(
                                  "option",
                                  {
                                    key: item[field.key],
                                    domProps: { value: item[field.key] }
                                  },
                                  [_vm._v(_vm._s(item[field.label]))]
                                )
                              })
                            ],
                            2
                          )
                        ]
                      )
                    })
                  ],
                  2
                ),
                _vm._v(" "),
                _c("hr"),
                _vm._v(" "),
                _c("div", { staticClass: "form-group text-right" }, [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-primary btn-sm",
                      attrs: { type: "button" },
                      on: { click: _vm.filter }
                    },
                    [
                      _c("span", { staticClass: "fa fa-check-circle" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Apply")])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-secondary btn-sm",
                      attrs: { type: "button" },
                      on: { click: _vm.reset }
                    },
                    [
                      _c("span", { staticClass: "fa fa-redo" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Reset")])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-dark btn-sm",
                      attrs: { type: "button" },
                      on: { click: _vm.onClose }
                    },
                    [
                      _c("span", { staticClass: "fa fa-times" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Cancel")])
                    ]
                  )
                ])
              ]
            },
            proxy: true
          }
        ])
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ErrorPage.vue?vue&type=template&id=2bc5db5c&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/ErrorPage.vue?vue&type=template&id=2bc5db5c& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "col-lg-4 d-flex flex-column justify-content-center align-items-center mx-auto",
      staticStyle: { "min-height": "500px" }
    },
    [
      _c("p", { staticClass: "display-4 text-secondary" }, [_vm._v("Oops!")]),
      _vm._v(" "),
      _c("img", {
        staticClass: "img-fluid w-100",
        attrs: { src: _vm.base_url + "images/404-Error.png", alt: "" }
      })
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/LoaderComponent.vue?vue&type=template&id=0ccf4ce2&":
/*!******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/LoaderComponent.vue?vue&type=template&id=0ccf4ce2& ***!
  \******************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "div",
      {
        staticClass:
          "d-flex justify-content-center align-items-center flex-column",
        staticStyle: { "min-height": "100px" }
      },
      [
        _c("div", { staticClass: "spinner-border text-success" }),
        _vm._v(" "),
        _c("p", { staticClass: "my-2 small text-muted" }, [
          _vm._v("loading data..")
        ])
      ]
    )
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ModalFade.vue?vue&type=template&id=7abe446e&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/ModalFade.vue?vue&type=template&id=7abe446e& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "modal fade",
      attrs: { id: _vm.id ? _vm.id : "modal_fade" }
    },
    [
      _c(
        "div",
        {
          class:
            "modal-dialog " + (_vm.centered ? "modal-dialog-centered" : null)
        },
        [
          _c("div", { staticClass: "modal-content" }, [
            _c(
              "div",
              { class: "modal-header  " + _vm.headerStyle },
              [
                _vm._t("header", null, { data: _vm.data ? _vm.data : {} }),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "close",
                    attrs: { type: "button" },
                    on: { click: _vm.closeModal }
                  },
                  [_vm._v("×")]
                )
              ],
              2
            ),
            _vm._v(" "),
            _c(
              "div",
              { staticClass: "modal-body" },
              [_vm._t("body", null, { data: _vm.data ? _vm.data : {} })],
              2
            ),
            _vm._v(" "),
            _vm.footer
              ? _c(
                  "div",
                  { staticClass: "modal-footer" },
                  [
                    _vm._t("footer", null, { data: _vm.data ? _vm.data : {} }),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "btn btn-dark btn-sm",
                        on: { click: _vm.closeModal }
                      },
                      [_vm._v("cancel")]
                    )
                  ],
                  2
                )
              : _vm._e()
          ])
        ]
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/NoDataToShow.vue?vue&type=template&id=16817924&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/NoDataToShow.vue?vue&type=template&id=16817924& ***!
  \***************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "text-center" },
    [
      _c("p", [
        _c("span", { class: "fa fa-check-circle fa-4x " + _vm.iconColor })
      ]),
      _vm._v(" "),
      _c("p", { class: "" + (_vm.bold ? "font-weight-bold" : "text-muted") }, [
        _vm._v(_vm._s(_vm.title ? _vm.title : "No data to show"))
      ]),
      _vm._v(" "),
      _vm._t("default")
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SidebarComponent.vue?vue&type=template&id=54833a28&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/SidebarComponent.vue?vue&type=template&id=54833a28& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "list-group list-group-flush sidebar-list-group" },
    _vm._l(_vm.links, function(link, i) {
      return _c(
        "router-link",
        {
          key: i,
          staticClass: "list-group-item list-group-item-action p-2",
          attrs: {
            to: link.link,
            "active-class": "active-list-item",
            exact: ""
          }
        },
        [
          link.icon
            ? _c("span", [_c("i", { class: "fa " + link.icon })])
            : _vm._e(),
          _vm._v(" "),
          _c("span", [_vm._v(_vm._s(link.title ? link.title : "Link"))])
        ]
      )
    }),
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/TableComponent.vue?vue&type=template&id=8554570c&":
/*!*****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/components/TableComponent.vue?vue&type=template&id=8554570c& ***!
  \*****************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _vm.rows.length
      ? _c(
          "table",
          {
            class:
              "table table-striped table-sm small bg-white " +
              (_vm.notResponsive ? "" : "table-responsive"),
            attrs: { id: _vm.id ? _vm.id : "data-table" }
          },
          [
            _c("thead", [
              _c(
                "tr",
                { class: _vm.headClass },
                [
                  _vm._t("head:before"),
                  _vm._v(" "),
                  _vm._l(_vm.heads, function(head, i) {
                    return _c("th", { key: i }, [_vm._v(_vm._s(head.title))])
                  }),
                  _vm._v(" "),
                  _vm._t("head")
                ],
                2
              )
            ]),
            _vm._v(" "),
            _c(
              "tbody",
              _vm._l(_vm.rows, function(item, i) {
                return _c(
                  "tr",
                  { key: i },
                  [
                    _vm._t("body:before", null, { item: item }),
                    _vm._v(" "),
                    _vm._l(_vm.heads, function(head, i) {
                      return _c(
                        "td",
                        { key: i, class: "" + (head.style ? head.style : "") },
                        [
                          _vm._v(
                            "\n          " +
                              _vm._s(
                                _vm._notation(item, head.name, head.fallback)
                              ) +
                              "\n        "
                          )
                        ]
                      )
                    }),
                    _vm._v(" "),
                    _vm._t("body", null, { item: item })
                  ],
                  2
                )
              }),
              0
            )
          ]
        )
      : _vm._e()
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=template&id=41ebfed2&":
/*!***************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/App.vue?vue&type=template&id=41ebfed2& ***!
  \***************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("navbar"),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "my-2 bg-white shadow rounded ",
          staticStyle: { "min-height": "600px" }
        },
        [_c("router-view")],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=template&id=7353425a&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/Navbar.vue?vue&type=template&id=7353425a&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "bg-white shadow rounded" }, [
    _c(
      "nav",
      { staticClass: "navbar navbar-expand-lg navbar-light" },
      [
        _c("router-link", { staticClass: "navbar-brand", attrs: { to: "/" } }, [
          _c("img", {
            staticClass: "img-fluid logo-img",
            attrs: { src: _vm.logoUrl, alt: "NPMT logo" }
          }),
          _vm._v(" "),
          _c("br"),
          _vm._v(" "),
          _c("span", { staticClass: "small" }, [
            _vm._v("Welcome :\n        "),
            _c("span", { staticClass: "font-weight-bold text-success" }, [
              _vm._v(_vm._s(_vm.user.name))
            ])
          ]),
          _vm._v(" "),
          _c("br"),
          _vm._v(" "),
          _c("span", { staticClass: "small" }, [
            _vm._v("Line:\n        "),
            _c("span", { staticClass: "font-weight-bold text-success" }, [
              _vm._v(_vm._s(_vm.$store.getters.userLine))
            ])
          ])
        ]),
        _vm._v(" "),
        _vm._m(0),
        _vm._v(" "),
        _c(
          "div",
          {
            staticClass: "navbar-collapse collapse",
            attrs: { id: "otc_rep_navbar" }
          },
          [
            _c(
              "ul",
              { staticClass: "navbar-nav ml-auto" },
              [
                _vm._l(_vm.links, function(link, index) {
                  return _c(
                    "li",
                    { key: "link_" + index, staticClass: "nav-item" },
                    [
                      _c(
                        "router-link",
                        {
                          staticClass: "nav-link",
                          attrs: {
                            to: link.path,
                            "active-class": "active",
                            exact: ""
                          }
                        },
                        [_c("span", [_vm._v(_vm._s(link.title))])]
                      )
                    ],
                    1
                  )
                }),
                _vm._v(" "),
                _c("li", { staticClass: "nav-item dropdown" }, [
                  _c(
                    "a",
                    {
                      staticClass: "dropdown-toggle nav-link",
                      attrs: { href: "", "data-toggle": "dropdown" }
                    },
                    [_c("span", [_vm._v(_vm._s(_vm.user.name))])]
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "dropdown-menu dropdown-menu-right" },
                    [
                      _c(
                        "a",
                        {
                          staticClass: "small dropdown-item",
                          attrs: { href: _vm.changePassword }
                        },
                        [
                          _c("span", {
                            staticClass: "fa fa-lock mr-1",
                            staticStyle: { color: "purple" }
                          }),
                          _vm._v(" "),
                          _c("span", [_vm._v("Change password")])
                        ]
                      ),
                      _vm._v(" "),
                      _c("div", { staticClass: "dropdown-divider" }),
                      _vm._v(" "),
                      _c(
                        "a",
                        {
                          staticClass: "small dropdown-item",
                          attrs: { href: _vm.logout }
                        },
                        [
                          _c("span", {
                            staticClass: "fa fa-door-open text-danger"
                          }),
                          _vm._v(" "),
                          _c("span", [_vm._v("Logout")])
                        ]
                      )
                    ]
                  )
                ])
              ],
              2
            )
          ]
        )
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "button",
      {
        staticClass: "navbar-toggler",
        attrs: {
          type: "button",
          "data-toggle": "collapse",
          "data-target": "#otc_rep_navbar"
        }
      },
      [_c("span", { staticClass: "navbar-toggler-icon" })]
    )
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=template&id=5ee1b09b&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=template&id=5ee1b09b& ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("div", { staticClass: "form-group text-right mb-0" }, [
        _c(
          "button",
          {
            staticClass: "btn btn-sm btn-primary",
            attrs: { type: "button", disabled: _vm.productData.length >= 4 },
            on: { click: _vm.addProduct }
          },
          [
            _c("span", { staticClass: "fa fa-plus" }),
            _vm._v(" "),
            _c("span", [_vm._v("Product")])
          ]
        )
      ]),
      _vm._v(" "),
      _vm._l(_vm.productData, function(product, _PI) {
        return _c(
          "div",
          {
            key: "product_" + _PI,
            staticClass: "p-2 border border-dark rounded my-1"
          },
          [
            _c("div", { staticClass: "p-2 row mx-auto" }, [
              _c(
                "div",
                { staticClass: "form-group col-lg" },
                [
                  _c(
                    "label",
                    {
                      staticClass: " font-weight-bold text-primary",
                      attrs: { for: "" }
                    },
                    [_vm._v("Product " + _vm._s(_PI + 1))]
                  ),
                  _vm._v(" "),
                  _c("ValidationProvider", {
                    attrs: { name: "Product", rules: "required" },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "default",
                          fn: function(ref) {
                            var errors = ref.errors
                            return [
                              errors[0]
                                ? _c(
                                    "span",
                                    { staticClass: "text-danger small" },
                                    [_vm._v(_vm._s("* required"))]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _c(
                                "select",
                                {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.productData[_PI].name,
                                      expression: "productData[_PI].name"
                                    }
                                  ],
                                  class:
                                    "form-control form-control-sm " +
                                    (errors[0] ? "border border-danger" : ""),
                                  attrs: {
                                    name: "product_" + _PI + "_name",
                                    id: "product_" + _PI + "_name"
                                  },
                                  on: {
                                    change: function($event) {
                                      var $$selectedVal = Array.prototype.filter
                                        .call($event.target.options, function(
                                          o
                                        ) {
                                          return o.selected
                                        })
                                        .map(function(o) {
                                          var val =
                                            "_value" in o ? o._value : o.value
                                          return val
                                        })
                                      _vm.$set(
                                        _vm.productData[_PI],
                                        "name",
                                        $event.target.multiple
                                          ? $$selectedVal
                                          : $$selectedVal[0]
                                      )
                                    }
                                  }
                                },
                                [
                                  _c("option", { domProps: { value: null } }),
                                  _vm._v(" "),
                                  _vm._l(_vm.products, function(product, _LPI) {
                                    return _c(
                                      "option",
                                      {
                                        key:
                                          "product_" +
                                          _PI +
                                          "_line_product_" +
                                          _LPI,
                                        domProps: { value: product.name }
                                      },
                                      [_vm._v(_vm._s(product.name))]
                                    )
                                  })
                                ],
                                2
                              )
                            ]
                          }
                        }
                      ],
                      null,
                      true
                    )
                  })
                ],
                1
              ),
              _vm._v(" "),
              _vm.pharmacyProducts !== true
                ? _c(
                    "div",
                    { staticClass: "form-group col-lg" },
                    [
                      _c("label", { attrs: { for: "" } }, [
                        _vm._v("Lader of adaption")
                      ]),
                      _vm._v(" "),
                      _c("ValidationProvider", {
                        attrs: { name: "Lader of adaption", rules: "required" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(ref) {
                                var errors = ref.errors
                                return [
                                  errors[0]
                                    ? _c(
                                        "span",
                                        { staticClass: "text-danger small" },
                                        [_vm._v(_vm._s("* required"))]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "select",
                                    {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.productData[_PI].lader,
                                          expression: "productData[_PI].lader"
                                        }
                                      ],
                                      class:
                                        "form-control form-control-sm " +
                                        (errors[0]
                                          ? "border border-danger"
                                          : ""),
                                      attrs: {
                                        name: "product_" + _PI + "_lader",
                                        id: "product_" + _PI + "_lader"
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$selectedVal = Array.prototype.filter
                                            .call(
                                              $event.target.options,
                                              function(o) {
                                                return o.selected
                                              }
                                            )
                                            .map(function(o) {
                                              var val =
                                                "_value" in o
                                                  ? o._value
                                                  : o.value
                                              return val
                                            })
                                          _vm.$set(
                                            _vm.productData[_PI],
                                            "lader",
                                            $event.target.multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          )
                                        }
                                      }
                                    },
                                    [
                                      _c("option", {
                                        domProps: { value: null }
                                      }),
                                      _vm._v(" "),
                                      _vm._l(_vm.laders, function(lader, _LI) {
                                        return _c(
                                          "option",
                                          {
                                            key:
                                              "product_" +
                                              _PI +
                                              "_lader_" +
                                              _LI,
                                            domProps: { value: lader }
                                          },
                                          [_vm._v(_vm._s(lader))]
                                        )
                                      })
                                    ],
                                    2
                                  )
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      })
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _vm.pharmacyProducts !== true
                ? _c(
                    "div",
                    { staticClass: "form-group col-lg" },
                    [
                      _c("label", { attrs: { for: "" } }, [_vm._v("Action")]),
                      _vm._v(" "),
                      _c("ValidationProvider", {
                        attrs: { name: "Action", rules: "required" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(ref) {
                                var errors = ref.errors
                                return [
                                  errors[0]
                                    ? _c(
                                        "span",
                                        { staticClass: "text-danger small" },
                                        [_vm._v(_vm._s("* required"))]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "select",
                                    {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.productData[_PI].action,
                                          expression: "productData[_PI].action"
                                        }
                                      ],
                                      class:
                                        "form-control form-control-sm " +
                                        (errors[0]
                                          ? "border border-danger"
                                          : ""),
                                      attrs: {
                                        name: "product_" + _PI + "_action",
                                        id: "product_" + _PI + "_action"
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$selectedVal = Array.prototype.filter
                                            .call(
                                              $event.target.options,
                                              function(o) {
                                                return o.selected
                                              }
                                            )
                                            .map(function(o) {
                                              var val =
                                                "_value" in o
                                                  ? o._value
                                                  : o.value
                                              return val
                                            })
                                          _vm.$set(
                                            _vm.productData[_PI],
                                            "action",
                                            $event.target.multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          )
                                        }
                                      }
                                    },
                                    [
                                      _c("option", {
                                        domProps: { value: null }
                                      }),
                                      _vm._v(" "),
                                      _vm._l(_vm.actions, function(
                                        action,
                                        _AI
                                      ) {
                                        return _c(
                                          "option",
                                          {
                                            key:
                                              "product_" +
                                              _PI +
                                              "_action_" +
                                              _AI,
                                            domProps: { value: action }
                                          },
                                          [_vm._v(_vm._s(action))]
                                        )
                                      })
                                    ],
                                    2
                                  )
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      })
                    ],
                    1
                  )
                : _vm._e(),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "form-group col-lg" },
                [
                  _c("label", { attrs: { for: "" } }, [_vm._v("Rate")]),
                  _vm._v(" "),
                  _c("ValidationProvider", {
                    attrs: { name: "Rate", rules: "required" },
                    scopedSlots: _vm._u(
                      [
                        {
                          key: "default",
                          fn: function(ref) {
                            var errors = ref.errors
                            return [
                              errors[0]
                                ? _c(
                                    "span",
                                    { staticClass: "text-danger small" },
                                    [_vm._v(_vm._s("* required"))]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              _c(
                                "select",
                                {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: _vm.productData[_PI].rate,
                                      expression: "productData[_PI].rate"
                                    }
                                  ],
                                  class:
                                    "form-control form-control-sm " +
                                    (errors[0] ? "border border-danger" : ""),
                                  attrs: {
                                    name: "product_" + _PI + "_rate",
                                    id: "product_" + _PI + "_rate"
                                  },
                                  on: {
                                    change: function($event) {
                                      var $$selectedVal = Array.prototype.filter
                                        .call($event.target.options, function(
                                          o
                                        ) {
                                          return o.selected
                                        })
                                        .map(function(o) {
                                          var val =
                                            "_value" in o ? o._value : o.value
                                          return val
                                        })
                                      _vm.$set(
                                        _vm.productData[_PI],
                                        "rate",
                                        $event.target.multiple
                                          ? $$selectedVal
                                          : $$selectedVal[0]
                                      )
                                    }
                                  }
                                },
                                [
                                  _c("option", { domProps: { value: null } }),
                                  _vm._v(" "),
                                  _c("option", { attrs: { value: "high" } }, [
                                    _vm._v("high")
                                  ]),
                                  _vm._v(" "),
                                  _c("option", { attrs: { value: "medium" } }, [
                                    _vm._v("medium")
                                  ]),
                                  _vm._v(" "),
                                  _c("option", { attrs: { value: "low" } }, [
                                    _vm._v("low")
                                  ]),
                                  _vm._v(" "),
                                  _c("option", { attrs: { value: "weak" } }, [
                                    _vm._v("weak")
                                  ])
                                ]
                              )
                            ]
                          }
                        }
                      ],
                      null,
                      true
                    )
                  })
                ],
                1
              ),
              _vm._v(" "),
              _vm.pharmacyProducts
                ? _c("div", { staticClass: "form-group col-lg" }, [
                    _c("label", { attrs: { for: "" } }, [_vm._v("Stock")]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.productData[_PI].stock,
                          expression: "productData[_PI].stock"
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { type: "number", min: 0 },
                      domProps: { value: _vm.productData[_PI].stock },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.productData[_PI],
                            "stock",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.pharmacyProducts
                ? _c("div", { staticClass: "form-group col-lg" }, [
                    _c("label", { attrs: { for: "" } }, [_vm._v("Order")]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.productData[_PI].order,
                          expression: "productData[_PI].order"
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: { type: "number", min: 0 },
                      domProps: { value: _vm.productData[_PI].order },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.productData[_PI],
                            "order",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ])
                : _vm._e(),
              _vm._v(" "),
              _vm.pharmacyProducts
                ? _c("div", { staticClass: "form-group col-lg" }, [
                    _c("label", { attrs: { for: "" } }, [
                      _vm._v("Distributor")
                    ]),
                    _vm._v(" "),
                    _c(
                      "select",
                      {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model",
                            value: _vm.productData[_PI].dist,
                            expression: "productData[_PI].dist"
                          }
                        ],
                        staticClass: "form-control form-control-sm",
                        attrs: { required: _vm.productData[_PI].order > 0 },
                        on: {
                          change: function($event) {
                            var $$selectedVal = Array.prototype.filter
                              .call($event.target.options, function(o) {
                                return o.selected
                              })
                              .map(function(o) {
                                var val = "_value" in o ? o._value : o.value
                                return val
                              })
                            _vm.$set(
                              _vm.productData[_PI],
                              "dist",
                              $event.target.multiple
                                ? $$selectedVal
                                : $$selectedVal[0]
                            )
                          }
                        }
                      },
                      [
                        _c("option", { domProps: { value: null } }),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "UCP" } }, [
                          _vm._v("UCP")
                        ]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "PHARMA" } }, [
                          _vm._v("PHARMA")
                        ]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "IBN SINA" } }, [
                          _vm._v("IBN SINA")
                        ]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "MULTI PHARM" } }, [
                          _vm._v("MULTI PHARM")
                        ]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "EMIC" } }, [
                          _vm._v("EMIC")
                        ]),
                        _vm._v(" "),
                        _c("option", { attrs: { value: "DIRECT" } }, [
                          _vm._v("DIRECT")
                        ])
                      ]
                    )
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c("div", { staticClass: "col-lg-auto" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-sm btn-primary",
                    attrs: {
                      type: "button",
                      disabled: _vm.productData[_PI].competitors.length >= 3
                    },
                    on: {
                      click: function($event) {
                        return _vm.addCompetitor(_PI)
                      }
                    }
                  },
                  [
                    _c("span", { staticClass: "fa fa-plus" }),
                    _vm._v(" "),
                    _c("span", [_vm._v("competitor")])
                  ]
                ),
                _vm._v(" "),
                _c(
                  "button",
                  {
                    staticClass: "btn btn-sm btn-danger",
                    attrs: { type: "button" },
                    on: {
                      click: function($event) {
                        return _vm.deleteProduct(_PI)
                      }
                    }
                  },
                  [
                    _c("span", { staticClass: "fa fa-trash" }),
                    _vm._v(" "),
                    _c("span", [_vm._v("product")])
                  ]
                )
              ])
            ]),
            _vm._v(" "),
            _vm._l(product.competitors, function(competitor, _CI) {
              return _c(
                "div",
                {
                  key: "product_" + _PI + "_competitor_" + _CI,
                  staticClass:
                    "p-2 border row mx-auto rounded bg-light my-1 align-items-center"
                },
                [
                  _c("div", { staticClass: "col-lg" }, [
                    _c(
                      "span",
                      { staticClass: "text-danger font-weight-bold" },
                      [_vm._v("Competitor " + _vm._s(_CI + 1))]
                    )
                  ]),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "col-lg" },
                    [
                      _c("label", { attrs: { for: "" } }, [_vm._v("name")]),
                      _vm._v(" "),
                      _c("ValidationProvider", {
                        attrs: { name: "Competitor Name", rules: "required" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(ref) {
                                var errors = ref.errors
                                return [
                                  errors[0]
                                    ? _c(
                                        "span",
                                        { staticClass: "text-danger small" },
                                        [_vm._v(_vm._s("* required"))]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "select",
                                    {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.productData[_PI].competitors[
                                              _CI
                                            ].name,
                                          expression:
                                            "productData[_PI].competitors[_CI].name"
                                        }
                                      ],
                                      class:
                                        "form-control form-control-sm " +
                                        (errors[0]
                                          ? "border border-danger"
                                          : ""),
                                      attrs: {
                                        name:
                                          "competitor_" +
                                          _CI +
                                          "_name_product_" +
                                          _PI
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$selectedVal = Array.prototype.filter
                                            .call(
                                              $event.target.options,
                                              function(o) {
                                                return o.selected
                                              }
                                            )
                                            .map(function(o) {
                                              var val =
                                                "_value" in o
                                                  ? o._value
                                                  : o.value
                                              return val
                                            })
                                          _vm.$set(
                                            _vm.productData[_PI].competitors[
                                              _CI
                                            ],
                                            "name",
                                            $event.target.multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          )
                                        }
                                      }
                                    },
                                    [
                                      _c("option", {
                                        domProps: { value: null }
                                      }),
                                      _vm._v(" "),
                                      _vm._l(
                                        _vm.getProductCompetitors(
                                          _vm.productData[_PI].name
                                        ),
                                        function(c, i) {
                                          return _c(
                                            "option",
                                            {
                                              key:
                                                "product_" +
                                                _PI +
                                                "_competitor_" +
                                                _CI +
                                                "_name_" +
                                                i,
                                              domProps: { value: c }
                                            },
                                            [_vm._v(_vm._s(c))]
                                          )
                                        }
                                      )
                                    ],
                                    2
                                  )
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c(
                    "div",
                    { staticClass: "col-lg" },
                    [
                      _c("label", { attrs: { for: "" } }, [_vm._v("Rate")]),
                      _vm._v(" "),
                      _c("ValidationProvider", {
                        attrs: { name: "Competitor Rate", rules: "required" },
                        scopedSlots: _vm._u(
                          [
                            {
                              key: "default",
                              fn: function(ref) {
                                var errors = ref.errors
                                return [
                                  errors[0]
                                    ? _c(
                                        "span",
                                        { staticClass: "text-danger small" },
                                        [_vm._v(_vm._s("* required"))]
                                      )
                                    : _vm._e(),
                                  _vm._v(" "),
                                  _c(
                                    "select",
                                    {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value:
                                            _vm.productData[_PI].competitors[
                                              _CI
                                            ].rate,
                                          expression:
                                            "productData[_PI].competitors[_CI].rate"
                                        }
                                      ],
                                      class:
                                        "form-control form-control-sm " +
                                        (errors[0]
                                          ? "border border-danger"
                                          : ""),
                                      attrs: {
                                        name:
                                          "competitor_" +
                                          _CI +
                                          "_rate_product_" +
                                          _PI
                                      },
                                      on: {
                                        change: function($event) {
                                          var $$selectedVal = Array.prototype.filter
                                            .call(
                                              $event.target.options,
                                              function(o) {
                                                return o.selected
                                              }
                                            )
                                            .map(function(o) {
                                              var val =
                                                "_value" in o
                                                  ? o._value
                                                  : o.value
                                              return val
                                            })
                                          _vm.$set(
                                            _vm.productData[_PI].competitors[
                                              _CI
                                            ],
                                            "rate",
                                            $event.target.multiple
                                              ? $$selectedVal
                                              : $$selectedVal[0]
                                          )
                                        }
                                      }
                                    },
                                    [
                                      _c("option", {
                                        domProps: { value: null }
                                      }),
                                      _vm._v(" "),
                                      _c(
                                        "option",
                                        { attrs: { value: "high" } },
                                        [_vm._v("high")]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "option",
                                        { attrs: { value: "medium" } },
                                        [_vm._v("medium")]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "option",
                                        { attrs: { value: "low" } },
                                        [_vm._v("low")]
                                      ),
                                      _vm._v(" "),
                                      _c(
                                        "option",
                                        { attrs: { value: "weak" } },
                                        [_vm._v("weak")]
                                      )
                                    ]
                                  )
                                ]
                              }
                            }
                          ],
                          null,
                          true
                        )
                      })
                    ],
                    1
                  ),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg" }, [
                    _c("label", { attrs: { for: "" } }, [_vm._v("Stock")]),
                    _vm._v(" "),
                    _c("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model",
                          value: _vm.productData[_PI].competitors[_CI].stock,
                          expression: "productData[_PI].competitors[_CI].stock"
                        }
                      ],
                      staticClass: "form-control form-control-sm",
                      attrs: {
                        type: "number",
                        name: "stock",
                        id: "stock",
                        min: 0
                      },
                      domProps: {
                        value: _vm.productData[_PI].competitors[_CI].stock
                      },
                      on: {
                        input: function($event) {
                          if ($event.target.composing) {
                            return
                          }
                          _vm.$set(
                            _vm.productData[_PI].competitors[_CI],
                            "stock",
                            $event.target.value
                          )
                        }
                      }
                    })
                  ]),
                  _vm._v(" "),
                  _c("div", { staticClass: "col-lg-auto" }, [
                    _c(
                      "button",
                      {
                        staticClass: "btn btn-danger btn-sm",
                        attrs: { type: "button" },
                        on: {
                          click: function($event) {
                            return _vm.deleteCompetitor(_PI, _CI)
                          }
                        }
                      },
                      [
                        _c("span", { staticClass: "fa fa-trash" }),
                        _vm._v(" "),
                        _c("span", [_vm._v("Competitor")])
                      ]
                    )
                  ])
                ]
              )
            })
          ],
          2
        )
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/PlannerActions.vue?vue&type=template&id=4e5d2d95&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/components/PlannerActions.vue?vue&type=template&id=4e5d2d95& ***!
  \*************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "div",
        { staticClass: "form-group text-right" },
        [
          _c(
            "router-link",
            { staticClass: "btn btn-sm btn-dark", attrs: { to: "/planner" } },
            [
              _c("span", { staticClass: "fa fa-chevron-circle-left" }),
              _vm._v(" "),
              _c("span", [_vm._v("Back")])
            ]
          ),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-sm btn-success",
              attrs: { disabled: !_vm.store.length },
              on: { click: _vm.add }
            },
            [
              _c("span", { staticClass: "fa fa-plus-circle" }),
              _vm._v(" "),
              _c("span", [_vm._v("Add")])
            ]
          ),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-sm btn-primary",
              attrs: { disabled: !_vm.update.length },
              on: { click: _vm.openDuplicateModal }
            },
            [
              _c("span", { staticClass: "fa fa-redo" }),
              _vm._v(" "),
              _c("span", [_vm._v("Duplicate")])
            ]
          ),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-sm btn-warning",
              attrs: { disabled: !_vm.update.length },
              on: { click: _vm.openEditModal }
            },
            [
              _c("span", { staticClass: "fa fa-edit" }),
              _vm._v(" "),
              _c("span", [_vm._v("Edit")])
            ]
          ),
          _vm._v(" "),
          _c(
            "button",
            {
              staticClass: "btn btn-sm btn-danger",
              attrs: { disabled: !_vm.update.length },
              on: { click: _vm.deletePlans }
            },
            [
              _c("span", { staticClass: "fa fa-times-circle" }),
              _vm._v(" "),
              _c("span", [_vm._v("Delete")])
            ]
          )
        ],
        1
      ),
      _vm._v(" "),
      _c("modal-fade", {
        attrs: {
          show: _vm.showDuplicateModal,
          id: "Duplicate_modal",
          headerStyle: "bg-primary text-light"
        },
        on: { onClose: _vm.closeDuplicateModal },
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_c("span", [_vm._v("Duplicate Plans")])]
            },
            proxy: true
          },
          {
            key: "body",
            fn: function() {
              return [
                _c("div", { staticClass: "form-group" }, [
                  _c(
                    "label",
                    { staticClass: "text-muted small", attrs: { for: "" } },
                    [_vm._v("\n          Copy plans to date\n        ")]
                  ),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.duplicate_date,
                        expression: "duplicate_date"
                      }
                    ],
                    staticClass: "form-control form-control-sm",
                    attrs: {
                      type: "date",
                      name: "duplicate_date",
                      id: "duplicate_date"
                    },
                    domProps: { value: _vm.duplicate_date },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.duplicate_date = $event.target.value
                      }
                    }
                  })
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group text-right" }, [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-primary",
                      attrs: { type: "button" },
                      on: { click: _vm.duplicate }
                    },
                    [
                      _c("span", { staticClass: "fa fa-redo" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Duplicate")])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-dark",
                      attrs: { type: "button", "data-dismiss": "modal" }
                    },
                    [
                      _c("span", { staticClass: "fa fa-times" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Cancel")])
                    ]
                  )
                ])
              ]
            },
            proxy: true
          }
        ])
      }),
      _vm._v(" "),
      _c("modal-fade", {
        attrs: {
          show: _vm.showEditModal,
          id: "Edit_modal",
          headerStyle: "bg-primary text-light"
        },
        on: { onClose: _vm.closeEditModal },
        scopedSlots: _vm._u([
          {
            key: "header",
            fn: function() {
              return [_c("span", [_vm._v("Edit Plans")])]
            },
            proxy: true
          },
          {
            key: "body",
            fn: function() {
              return [
                _c("div", { staticClass: "form-group" }, [
                  _c(
                    "label",
                    { staticClass: "text-muted small", attrs: { for: "" } },
                    [_vm._v("\n          Move plans to date\n        ")]
                  ),
                  _vm._v(" "),
                  _c("input", {
                    directives: [
                      {
                        name: "model",
                        rawName: "v-model",
                        value: _vm.edit_date,
                        expression: "edit_date"
                      }
                    ],
                    staticClass: "form-control form-control-sm",
                    attrs: { type: "date", name: "edit_date", id: "edit_date" },
                    domProps: { value: _vm.edit_date },
                    on: {
                      input: function($event) {
                        if ($event.target.composing) {
                          return
                        }
                        _vm.edit_date = $event.target.value
                      }
                    }
                  })
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "form-group text-right" }, [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-primary",
                      attrs: { type: "button" },
                      on: { click: _vm.updatePlans }
                    },
                    [
                      _c("span", { staticClass: "fa fa-edit" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Move")])
                    ]
                  ),
                  _vm._v(" "),
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-dark",
                      attrs: { type: "button", "data-dismiss": "modal" }
                    },
                    [
                      _c("span", { staticClass: "fa fa-times" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Cancel")])
                    ]
                  )
                ])
              ]
            },
            proxy: true
          }
        ])
      })
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Home.vue?vue&type=template&id=5240a1bf&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Home.vue?vue&type=template&id=5240a1bf& ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "p-2" }, [
    _c("div", { staticClass: "row mx-auto" }, [
      _c("div", { staticClass: "col-lg-3" }),
      _vm._v(" "),
      _c("div", { staticClass: "col-lg-6" }, [_c("broadcasting-messages")], 1),
      _vm._v(" "),
      _c("div", { staticClass: "col-lg-3" })
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Pharmacies.vue?vue&type=template&id=622a7b1e&":
/*!****************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Pharmacies.vue?vue&type=template&id=622a7b1e& ***!
  \****************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "p-2" }, [
    _c("div", { staticClass: "row mx-auto" }, [
      _c(
        "div",
        { staticClass: "col-lg-3 p-2" },
        [_c("sidebar-component", { attrs: { links: _vm.links } })],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "col-lg-9 p-2" }, [_c("router-view")], 1)
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Planner.vue?vue&type=template&id=699024a2&":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Planner.vue?vue&type=template&id=699024a2& ***!
  \*************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "p-2 row mx-auto bg-light pb-5" }, [
    _c(
      "div",
      { staticClass: "col-lg-3 shadow p-2 rounded bg-white" },
      [
        _c("cycle-selection", {
          attrs: { onSelect: _vm.onSelectCycle, onReset: _vm.onResetCycle }
        }),
        _vm._v(" "),
        _c("vue-cal", {
          staticClass:
            "vuecal--rounded-theme vuecal--green-theme vuecal--date-picker bg-white",
          staticStyle: { "max-height": "300px" },
          attrs: {
            disableViews: ["year", "years", "day", "week"],
            activeView: "month",
            small: true,
            "selected-date": _vm.date,
            startWeekOnSunday: true,
            "hide-weekdays": [5],
            events: _vm.$store.getters.allPlans
          },
          on: { "cell-click": _vm.onDayClick }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "col-lg-9 bg-white" },
      [_c("router-view", { attrs: { date: _vm.date } })],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Report.vue?vue&type=template&id=41407d94&":
/*!************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/Report.vue?vue&type=template&id=41407d94& ***!
  \************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "p-2" }, [_c("router-view")], 1)
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=template&id=26cf229d&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=template&id=26cf229d& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        _c("ValidationObserver", {
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function(ref) {
                var handleSubmit = ref.handleSubmit
                return [
                  _c(
                    "form",
                    {
                      on: {
                        submit: function($event) {
                          $event.preventDefault()
                          return handleSubmit(_vm.savePharmacy)
                        }
                      }
                    },
                    [
                      _c("div", { staticClass: "row mx-auto" }, [
                        _c(
                          "div",
                          { staticClass: "col-lg form-group" },
                          [
                            _c(
                              "label",
                              {
                                staticClass: "text-muted",
                                attrs: { for: "name" }
                              },
                              [_vm._v("Name")]
                            ),
                            _vm._v(" "),
                            _c("ValidationProvider", {
                              attrs: { name: "name", rules: "required" },
                              scopedSlots: _vm._u(
                                [
                                  {
                                    key: "default",
                                    fn: function(ref) {
                                      var errors = ref.errors
                                      return [
                                        errors[0]
                                          ? _c(
                                              "span",
                                              {
                                                staticClass: "text-danger small"
                                              },
                                              [
                                                _vm._v(
                                                  "Pharmacy Name is missing"
                                                )
                                              ]
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.pharmacy.name,
                                              expression: "pharmacy.name"
                                            }
                                          ],
                                          class:
                                            "form-control form-control-sm " +
                                            (errors[0]
                                              ? "border border-danger"
                                              : ""),
                                          attrs: {
                                            type: "text",
                                            name: "name",
                                            id: "name",
                                            placeholder: "Write pharmacy name"
                                          },
                                          domProps: {
                                            value: _vm.pharmacy.name
                                          },
                                          on: {
                                            input: function($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                _vm.pharmacy,
                                                "name",
                                                $event.target.value
                                              )
                                            }
                                          }
                                        })
                                      ]
                                    }
                                  }
                                ],
                                null,
                                true
                              )
                            })
                          ],
                          1
                        )
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "row mx-auto" }, [
                        _c(
                          "div",
                          { staticClass: "col-lg form-group" },
                          [
                            _c(
                              "label",
                              {
                                staticClass: "text-muted",
                                attrs: { for: "type" }
                              },
                              [_vm._v("Type")]
                            ),
                            _vm._v(" "),
                            _c("ValidationProvider", {
                              attrs: { name: "type", rules: "required" },
                              scopedSlots: _vm._u(
                                [
                                  {
                                    key: "default",
                                    fn: function(ref) {
                                      var errors = ref.errors
                                      return [
                                        errors[0]
                                          ? _c(
                                              "span",
                                              {
                                                staticClass: "text-danger small"
                                              },
                                              [
                                                _vm._v(
                                                  "Pharmacy type is missing"
                                                )
                                              ]
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.pharmacy.type,
                                                expression: "pharmacy.type"
                                              }
                                            ],
                                            class:
                                              "form-control form-control-sm " +
                                              (errors[0]
                                                ? "border border-danger"
                                                : ""),
                                            attrs: { name: "type", id: "type" },
                                            on: {
                                              change: function($event) {
                                                var $$selectedVal = Array.prototype.filter
                                                  .call(
                                                    $event.target.options,
                                                    function(o) {
                                                      return o.selected
                                                    }
                                                  )
                                                  .map(function(o) {
                                                    var val =
                                                      "_value" in o
                                                        ? o._value
                                                        : o.value
                                                    return val
                                                  })
                                                _vm.$set(
                                                  _vm.pharmacy,
                                                  "type",
                                                  $event.target.multiple
                                                    ? $$selectedVal
                                                    : $$selectedVal[0]
                                                )
                                              }
                                            }
                                          },
                                          [
                                            _c(
                                              "option",
                                              { domProps: { value: null } },
                                              [_vm._v("Select Pharmacy Type")]
                                            ),
                                            _vm._v(" "),
                                            _vm._l(_vm.types, function(
                                              type,
                                              i
                                            ) {
                                              return _c(
                                                "option",
                                                {
                                                  key:
                                                    "pharmacy_type_" +
                                                    type +
                                                    "_" +
                                                    i,
                                                  domProps: { value: type }
                                                },
                                                [_vm._v(_vm._s(type))]
                                              )
                                            })
                                          ],
                                          2
                                        )
                                      ]
                                    }
                                  }
                                ],
                                null,
                                true
                              )
                            })
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c("div", { staticClass: "col-lg form-group" }, [
                          _c(
                            "label",
                            {
                              staticClass: "text-muted",
                              attrs: { for: "key_person" }
                            },
                            [_vm._v("Key Person")]
                          ),
                          _vm._v(" "),
                          _c("input", {
                            directives: [
                              {
                                name: "model",
                                rawName: "v-model",
                                value: _vm.pharmacy.key_person,
                                expression: "pharmacy.key_person"
                              }
                            ],
                            staticClass: "form-control form-control-sm",
                            attrs: {
                              type: "text",
                              name: "key_person",
                              id: "key_person",
                              placeholder: "write ket person name"
                            },
                            domProps: { value: _vm.pharmacy.key_person },
                            on: {
                              input: function($event) {
                                if ($event.target.composing) {
                                  return
                                }
                                _vm.$set(
                                  _vm.pharmacy,
                                  "key_person",
                                  $event.target.value
                                )
                              }
                            }
                          })
                        ])
                      ]),
                      _vm._v(" "),
                      _c("div", { staticClass: "row mx-auto" }, [
                        _c(
                          "div",
                          { staticClass: "col-lg form-group" },
                          [
                            _c(
                              "label",
                              {
                                staticClass: "text-muted",
                                attrs: { for: "address" }
                              },
                              [_vm._v("Address")]
                            ),
                            _vm._v(" "),
                            _c("ValidationProvider", {
                              attrs: { name: "address", rules: "required" },
                              scopedSlots: _vm._u(
                                [
                                  {
                                    key: "default",
                                    fn: function(ref) {
                                      var errors = ref.errors
                                      return [
                                        errors[0]
                                          ? _c(
                                              "span",
                                              {
                                                staticClass: "text-danger small"
                                              },
                                              [
                                                _vm._v(
                                                  "Pharmacy address is missing"
                                                )
                                              ]
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.pharmacy.address,
                                              expression: "pharmacy.address"
                                            }
                                          ],
                                          class:
                                            "form-control form-control-sm " +
                                            (errors[0]
                                              ? "border border-danger"
                                              : ""),
                                          attrs: {
                                            type: "text",
                                            name: "address",
                                            id: "address",
                                            placeholder:
                                              "write pharmacy address"
                                          },
                                          domProps: {
                                            value: _vm.pharmacy.address
                                          },
                                          on: {
                                            input: function($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                _vm.pharmacy,
                                                "address",
                                                $event.target.value
                                              )
                                            }
                                          }
                                        })
                                      ]
                                    }
                                  }
                                ],
                                null,
                                true
                              )
                            })
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          { staticClass: "col-lg form-group" },
                          [
                            _c(
                              "label",
                              {
                                staticClass: "text-muted",
                                attrs: { for: "brick" }
                              },
                              [_vm._v("Brick")]
                            ),
                            _vm._v(" "),
                            _c("ValidationProvider", {
                              attrs: { name: "brick", rules: "required" },
                              scopedSlots: _vm._u(
                                [
                                  {
                                    key: "default",
                                    fn: function(ref) {
                                      var errors = ref.errors
                                      return [
                                        errors[0]
                                          ? _c(
                                              "span",
                                              {
                                                staticClass: "text-danger small"
                                              },
                                              [_vm._v("you must a brick")]
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _c(
                                          "select",
                                          {
                                            directives: [
                                              {
                                                name: "model",
                                                rawName: "v-model",
                                                value: _vm.brick,
                                                expression: "brick"
                                              }
                                            ],
                                            class:
                                              "form-control form-control-sm " +
                                              (errors[0]
                                                ? "border border-danger"
                                                : ""),
                                            attrs: {
                                              name: "brick",
                                              id: "brick",
                                              disabled: !_vm.locations.length
                                            },
                                            on: {
                                              change: function($event) {
                                                var $$selectedVal = Array.prototype.filter
                                                  .call(
                                                    $event.target.options,
                                                    function(o) {
                                                      return o.selected
                                                    }
                                                  )
                                                  .map(function(o) {
                                                    var val =
                                                      "_value" in o
                                                        ? o._value
                                                        : o.value
                                                    return val
                                                  })
                                                _vm.brick = $event.target
                                                  .multiple
                                                  ? $$selectedVal
                                                  : $$selectedVal[0]
                                              }
                                            }
                                          },
                                          [
                                            _c(
                                              "option",
                                              { domProps: { value: null } },
                                              [_vm._v("Select Brick")]
                                            ),
                                            _vm._v(" "),
                                            _vm._l(_vm.locations, function(
                                              location,
                                              i
                                            ) {
                                              return _c(
                                                "option",
                                                {
                                                  key:
                                                    "location_" +
                                                    location.brick +
                                                    "_" +
                                                    i,
                                                  domProps: { value: location }
                                                },
                                                [_vm._v(_vm._s(location.brick))]
                                              )
                                            })
                                          ],
                                          2
                                        )
                                      ]
                                    }
                                  }
                                ],
                                null,
                                true
                              )
                            })
                          ],
                          1
                        )
                      ]),
                      _vm._v(" "),
                      _c("hr"),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "form-group text-right" },
                        [
                          _c(
                            "router-link",
                            {
                              staticClass: "btn btn-sm btn-dark",
                              attrs: { to: "/pharmacies" }
                            },
                            [
                              _c("span", {
                                staticClass: "fa fa-chevron-circle-left"
                              }),
                              _vm._v(" "),
                              _c("span", [_vm._v("Back")])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-sm btn-secondary",
                              attrs: { type: "reset" }
                            },
                            [
                              _c("span", { staticClass: "fa fa-redo" }),
                              _vm._v(" "),
                              _c("span", [_vm._v("Reset")])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-sm btn-success",
                              attrs: { type: "submit" }
                            },
                            [
                              _c("span", { staticClass: "fa fa-save" }),
                              _vm._v(" "),
                              _c("span", [_vm._v("Save")])
                            ]
                          )
                        ],
                        1
                      )
                    ]
                  )
                ]
              }
            }
          ])
        })
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-plus-circle" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [_vm._v("New Pharmacy")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=template&id=64b0c02b&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=template&id=64b0c02b& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5" }, [
    _c("p", { staticClass: "alert alert-warning" }, [
      _c("span", { staticClass: "fa fa-plus-circle" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [
        _vm._v("Edit Pharmacy " + _vm._s(_vm.pharmacy ? _vm.pharmacy.name : ""))
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "p-2" }, [
      _vm.pharmacy
        ? _c(
            "div",
            [
              _c("ValidationObserver", {
                scopedSlots: _vm._u(
                  [
                    {
                      key: "default",
                      fn: function(ref) {
                        var handleSubmit = ref.handleSubmit
                        return [
                          _c(
                            "form",
                            {
                              on: {
                                submit: function($event) {
                                  $event.preventDefault()
                                  return handleSubmit(_vm.savePharmacy)
                                }
                              }
                            },
                            [
                              _c("div", { staticClass: "row mx-auto" }, [
                                _c(
                                  "div",
                                  { staticClass: "col-lg form-group" },
                                  [
                                    _c(
                                      "label",
                                      {
                                        staticClass: "text-muted",
                                        attrs: { for: "name" }
                                      },
                                      [_vm._v("Name")]
                                    ),
                                    _vm._v(" "),
                                    _c("input", {
                                      class: "form-control form-control-sm",
                                      attrs: {
                                        type: "text",
                                        name: "name",
                                        id: "name",
                                        placeholder: "Write pharmacy name",
                                        readonly: "",
                                        disabled: true
                                      },
                                      domProps: { value: _vm.pharmacy.name }
                                    })
                                  ]
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "row mx-auto" }, [
                                _c(
                                  "div",
                                  { staticClass: "col-lg form-group" },
                                  [
                                    _c(
                                      "label",
                                      {
                                        staticClass: "text-muted",
                                        attrs: { for: "type" }
                                      },
                                      [_vm._v("Type")]
                                    ),
                                    _vm._v(" "),
                                    _c("ValidationProvider", {
                                      attrs: {
                                        name: "type",
                                        rules: "required"
                                      },
                                      scopedSlots: _vm._u(
                                        [
                                          {
                                            key: "default",
                                            fn: function(ref) {
                                              var errors = ref.errors
                                              return [
                                                errors[0]
                                                  ? _c(
                                                      "span",
                                                      {
                                                        staticClass:
                                                          "text-danger small"
                                                      },
                                                      [
                                                        _vm._v(
                                                          "Pharmacy type is missing"
                                                        )
                                                      ]
                                                    )
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                _c(
                                                  "select",
                                                  {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model",
                                                        value:
                                                          _vm.pharmacy.type,
                                                        expression:
                                                          "pharmacy.type"
                                                      }
                                                    ],
                                                    class:
                                                      "form-control form-control-sm " +
                                                      (errors[0]
                                                        ? "border border-danger"
                                                        : ""),
                                                    attrs: {
                                                      name: "type",
                                                      id: "type"
                                                    },
                                                    on: {
                                                      change: function($event) {
                                                        var $$selectedVal = Array.prototype.filter
                                                          .call(
                                                            $event.target
                                                              .options,
                                                            function(o) {
                                                              return o.selected
                                                            }
                                                          )
                                                          .map(function(o) {
                                                            var val =
                                                              "_value" in o
                                                                ? o._value
                                                                : o.value
                                                            return val
                                                          })
                                                        _vm.$set(
                                                          _vm.pharmacy,
                                                          "type",
                                                          $event.target.multiple
                                                            ? $$selectedVal
                                                            : $$selectedVal[0]
                                                        )
                                                      }
                                                    }
                                                  },
                                                  [
                                                    _c(
                                                      "option",
                                                      {
                                                        domProps: {
                                                          value: null
                                                        }
                                                      },
                                                      [
                                                        _vm._v(
                                                          "Select Pharmacy Type"
                                                        )
                                                      ]
                                                    ),
                                                    _vm._v(" "),
                                                    _vm._l(_vm.types, function(
                                                      type,
                                                      i
                                                    ) {
                                                      return _c(
                                                        "option",
                                                        {
                                                          key:
                                                            "pharmacy_type_" +
                                                            type +
                                                            "_" +
                                                            i,
                                                          domProps: {
                                                            value: type
                                                          }
                                                        },
                                                        [_vm._v(_vm._s(type))]
                                                      )
                                                    })
                                                  ],
                                                  2
                                                )
                                              ]
                                            }
                                          }
                                        ],
                                        null,
                                        true
                                      )
                                    })
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "col-lg form-group" },
                                  [
                                    _c(
                                      "label",
                                      {
                                        staticClass: "text-muted",
                                        attrs: { for: "key_person" }
                                      },
                                      [_vm._v("Key Person")]
                                    ),
                                    _vm._v(" "),
                                    _c("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: _vm.pharmacy.key_person,
                                          expression: "pharmacy.key_person"
                                        }
                                      ],
                                      staticClass:
                                        "form-control form-control-sm",
                                      attrs: {
                                        type: "text",
                                        name: "key_person",
                                        id: "key_person",
                                        placeholder: "write ket person name"
                                      },
                                      domProps: {
                                        value: _vm.pharmacy.key_person
                                      },
                                      on: {
                                        input: function($event) {
                                          if ($event.target.composing) {
                                            return
                                          }
                                          _vm.$set(
                                            _vm.pharmacy,
                                            "key_person",
                                            $event.target.value
                                          )
                                        }
                                      }
                                    })
                                  ]
                                )
                              ]),
                              _vm._v(" "),
                              _c("div", { staticClass: "row mx-auto" }, [
                                _c(
                                  "div",
                                  { staticClass: "col-lg form-group" },
                                  [
                                    _c(
                                      "label",
                                      {
                                        staticClass: "text-muted",
                                        attrs: { for: "address" }
                                      },
                                      [_vm._v("Address")]
                                    ),
                                    _vm._v(" "),
                                    _c("ValidationProvider", {
                                      attrs: {
                                        name: "address",
                                        rules: "required"
                                      },
                                      scopedSlots: _vm._u(
                                        [
                                          {
                                            key: "default",
                                            fn: function(ref) {
                                              var errors = ref.errors
                                              return [
                                                errors[0]
                                                  ? _c(
                                                      "span",
                                                      {
                                                        staticClass:
                                                          "text-danger small"
                                                      },
                                                      [
                                                        _vm._v(
                                                          "Pharmacy address is missing"
                                                        )
                                                      ]
                                                    )
                                                  : _vm._e(),
                                                _vm._v(" "),
                                                _c("input", {
                                                  directives: [
                                                    {
                                                      name: "model",
                                                      rawName: "v-model",
                                                      value:
                                                        _vm.pharmacy.address,
                                                      expression:
                                                        "pharmacy.address"
                                                    }
                                                  ],
                                                  class:
                                                    "form-control form-control-sm " +
                                                    (errors[0]
                                                      ? "border border-danger"
                                                      : ""),
                                                  attrs: {
                                                    type: "text",
                                                    name: "address",
                                                    id: "address",
                                                    placeholder:
                                                      "write pharmacy address"
                                                  },
                                                  domProps: {
                                                    value: _vm.pharmacy.address
                                                  },
                                                  on: {
                                                    input: function($event) {
                                                      if (
                                                        $event.target.composing
                                                      ) {
                                                        return
                                                      }
                                                      _vm.$set(
                                                        _vm.pharmacy,
                                                        "address",
                                                        $event.target.value
                                                      )
                                                    }
                                                  }
                                                })
                                              ]
                                            }
                                          }
                                        ],
                                        null,
                                        true
                                      )
                                    })
                                  ],
                                  1
                                ),
                                _vm._v(" "),
                                _c(
                                  "div",
                                  { staticClass: "col-lg form-group" },
                                  [
                                    _c(
                                      "label",
                                      {
                                        staticClass: "text-muted",
                                        attrs: { for: "brick" }
                                      },
                                      [_vm._v("Brick")]
                                    ),
                                    _vm._v(" "),
                                    _c("input", {
                                      staticClass:
                                        "form-control form-control-sm",
                                      attrs: {
                                        type: "text",
                                        name: "brick",
                                        id: "brick",
                                        disabled: true,
                                        readonly: ""
                                      },
                                      domProps: { value: _vm.pharmacy.brick }
                                    })
                                  ]
                                )
                              ]),
                              _vm._v(" "),
                              _c("hr"),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "form-group text-right" },
                                [
                                  _c(
                                    "router-link",
                                    {
                                      staticClass: "btn btn-sm btn-dark",
                                      attrs: { to: "/pharmacies" }
                                    },
                                    [
                                      _c("span", {
                                        staticClass: "fa fa-chevron-circle-left"
                                      }),
                                      _vm._v(" "),
                                      _c("span", [_vm._v("Back")])
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "button",
                                    { staticClass: "btn btn-sm btn-secondary" },
                                    [
                                      _c("span", { staticClass: "fa fa-redo" }),
                                      _vm._v(" "),
                                      _c("span", [_vm._v("Reset")])
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c(
                                    "button",
                                    { staticClass: "btn btn-sm btn-success" },
                                    [
                                      _c("span", { staticClass: "fa fa-save" }),
                                      _vm._v(" "),
                                      _c("span", [_vm._v("Save")])
                                    ]
                                  )
                                ],
                                1
                              )
                            ]
                          )
                        ]
                      }
                    }
                  ],
                  null,
                  false,
                  386623283
                )
              })
            ],
            1
          )
        : _c("div", [_c("no-data-to-show")], 1)
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=template&id=70733d9d&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=template&id=70733d9d& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        _c(
          "button",
          {
            staticClass: "btn btn-sm btn-primary",
            attrs: { type: "button" },
            on: { click: _vm.openFilterModal }
          },
          [
            _c("span", { staticClass: "fa fa-filter" }),
            _vm._v(" "),
            _c("span", [_vm._v("Filter")])
          ]
        ),
        _vm._v(" "),
        _c(
          "router-link",
          {
            staticClass: "btn btn-sm btn-success",
            attrs: { to: "/pharmacies/new", exact: "" }
          },
          [
            _c("span", { staticClass: "fa fa-plus-circle" }),
            _vm._v(" "),
            _c("span", [_vm._v("New Pharmacy")])
          ]
        ),
        _vm._v(" "),
        _c("data-filter-box", {
          attrs: {
            data: _vm.pharmacies,
            queryKeys: ["area", "brick"],
            show: _vm.showFilterModal,
            onClose: _vm.closeFilterModal,
            onFilter: _vm.onFilter,
            onReset: _vm.onReset,
            queryOnly: false
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        _vm.pharmacies.length
          ? _c(
              "div",
              [
                _c("table-component", {
                  attrs: {
                    data: _vm.pharmacies,
                    heads: _vm.heads,
                    unselectable: true,
                    headClass: "bg-success text-light",
                    orderBy: "Pharmacy"
                  },
                  scopedSlots: _vm._u(
                    [
                      {
                        key: "head:before",
                        fn: function() {
                          return [_c("th", [_vm._v("Actions")])]
                        },
                        proxy: true
                      },
                      {
                        key: "body:before",
                        fn: function(ref) {
                          var item = ref.item
                          return [
                            _c(
                              "td",
                              [
                                _c(
                                  "router-link",
                                  {
                                    staticClass: "btn btn-sm btn-primary",
                                    attrs: { to: "/pharmacies/view/" + item.id }
                                  },
                                  [
                                    _c("span", {
                                      staticClass: "fa fa-book-reader"
                                    })
                                  ]
                                ),
                                _vm._v(" "),
                                _c(
                                  "router-link",
                                  {
                                    staticClass: "btn btn-sm btn-warning",
                                    attrs: {
                                      to: {
                                        path: "/pharmacies/edit/" + item.id,
                                        query: { pid: "1" }
                                      },
                                      exact: ""
                                    }
                                  },
                                  [_c("span", { staticClass: "fa fa-edit" })]
                                )
                              ],
                              1
                            )
                          ]
                        }
                      }
                    ],
                    null,
                    false,
                    2910104600
                  )
                })
              ],
              1
            )
          : _vm.isPharmaciesFetched
          ? _c("div", [_c("no-data-to-show")], 1)
          : _c("loader-component")
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-list" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [
        _vm._v("Pharmacies list")
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=template&id=64bb7c46&":
/*!*****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=template&id=64bb7c46& ***!
  \*****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5" }, [
    _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-list" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [
        _vm._v("View Pharmacy " + _vm._s(_vm.pharmacy ? _vm.pharmacy.name : ""))
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "p-2" }, [
      _vm.pharmacy
        ? _c("div", [
            _c("div", { staticClass: "my-2 px-0  rounded shadow-sm" }, [
              _c("p", { staticClass: "bg-primary text-light p-2 mb-0 lead" }, [
                _vm._v("Pharmacy Info.")
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "p-2 row mx-auto small" }, [
                _c("div", { staticClass: "col-lg" }, [
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("Pharmacy Name : "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.name))]
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("Pharmacy Type : "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.type))]
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("Key Person : "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.key_person || "--------"))]
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("No. of visits : "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.reports))]
                    )
                  ])
                ]),
                _vm._v(" "),
                _c("div", { staticClass: "col-lg" }, [
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("Address : "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.address))]
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("Brick: "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.brick))]
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("Area : "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.area))]
                    )
                  ]),
                  _vm._v(" "),
                  _c("p", { staticClass: "mb-0 border-bottom" }, [
                    _vm._v("District : "),
                    _c(
                      "span",
                      { staticClass: "font-weight-bold text-primary" },
                      [_vm._v(_vm._s(_vm.pharmacy.district))]
                    )
                  ])
                ])
              ])
            ])
          ])
        : _c("div", [_c("no-data-to-show")], 1)
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=template&id=47b79d06&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=template&id=47b79d06& ***!
  \*********************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5 my-2 bg-light" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        _c("div", { staticClass: "row mx-auto" }, [
          _c("div", { staticClass: "col-lg-6 px-2" }, [
            _c("div", { staticClass: "px-0 shadow-sm" }, [
              _c("div", { staticClass: "bg-primary text-light p-2" }, [
                _c("p", { staticClass: "mb-0" }, [
                  _c("span", [_vm._v(" Date : " + _vm._s(_vm.$attrs.date))]),
                  _vm._v(" "),
                  _c("span", { staticClass: "float-right badge badge-light" }, [
                    _vm._v(
                      "\n                selected: " +
                        _vm._s(_vm.selected.length)
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "bg-white p-2",
                  staticStyle: { height: "200px", overflow: "auto" }
                },
                [
                  _vm.appUserLocations.length
                    ? _c(
                        "ul",
                        { staticClass: "nav" },
                        _vm._l(_vm.appUserLocations, function(location, i) {
                          return _c(
                            "li",
                            {
                              key: "location_" + i,
                              staticClass: "nav-item col-12 border-bottom"
                            },
                            [
                              _c("input", {
                                attrs: { type: "checkbox" },
                                on: {
                                  click: function($event) {
                                    return _vm.toggleBrickPlan(location.brick)
                                  }
                                }
                              }),
                              _vm._v(" "),
                              _c(
                                "span",
                                { staticClass: "form-check-label text-muted" },
                                [_vm._v(_vm._s(location.brick))]
                              )
                            ]
                          )
                        }),
                        0
                      )
                    : _c("loader-component")
                ],
                1
              )
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-lg-6 px-0 px-2" }, [
            _c("div", { staticClass: "px-0 shadow-sm" }, [
              _c("div", { staticClass: "bg-primary text-light p-2" }, [
                _c("p", { staticClass: "mb-0" }, [
                  _c("span", [_vm._v(" Date : " + _vm._s(_vm.$attrs.date))]),
                  _vm._v(" "),
                  _c("span", { staticClass: "float-right badge badge-light" }, [
                    _vm._v(
                      "\n                Planned: " + _vm._s(_vm.updated.length)
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "bg-white p-2",
                  staticStyle: { height: "200px", overflow: "auto" }
                },
                [
                  _vm.planned.length
                    ? _c(
                        "ul",
                        { staticClass: "nav" },
                        _vm._l(_vm.planned, function(plan, i) {
                          return _c(
                            "li",
                            {
                              key: "plan_" + i,
                              staticClass:
                                "nav-item col-12 border-bottom clearfix"
                            },
                            [
                              _c("input", {
                                attrs: { type: "checkbox" },
                                on: {
                                  click: function($event) {
                                    return _vm.togglePlannedVisits(plan.id)
                                  }
                                }
                              }),
                              _vm._v(" "),
                              _c("span", {
                                staticClass:
                                  "form-check-label text-muted small",
                                domProps: { innerHTML: _vm._s(plan.title) }
                              }),
                              _vm._v(" "),
                              _c(
                                "span",
                                { staticClass: "float-right badge badge-info" },
                                [
                                  _vm._v(
                                    _vm._s(
                                      plan.type === "regular"
                                        ? "Brick"
                                        : "Health Day"
                                    )
                                  )
                                ]
                              )
                            ]
                          )
                        }),
                        0
                      )
                    : _c(
                        "div",
                        { staticClass: "pt-2" },
                        [
                          _c("no-data-to-show", {
                            attrs: { iconColor: "text-primary" }
                          })
                        ],
                        1
                      )
                ]
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c("hr"),
        _vm._v(" "),
        _c("planner-actions", {
          attrs: {
            date: _vm.$attrs.date,
            store: _vm.selected,
            update: _vm.updated,
            type: _vm.type
          }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-calendar-plus" }),
      _vm._v(" "),
      _c("span", [_vm._v("Plan a day")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=template&id=dbd54588&":
/*!***************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=template&id=dbd54588& ***!
  \***************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5 my-2 bg-light" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        _c("div", { staticClass: "row mx-auto" }, [
          _c("div", { staticClass: "col-lg-6 px-2" }, [
            _c("div", { staticClass: "px-0 shadow-sm" }, [
              _c("div", { staticClass: "bg-primary text-light p-2" }, [
                _c("p", { staticClass: "mb-0" }, [
                  _c("span", [_vm._v(" Date : " + _vm._s(_vm.$attrs.date))]),
                  _vm._v(" "),
                  _c("span", { staticClass: "float-right badge badge-light" }, [
                    _vm._v("\n                selected\n                "),
                    _vm.selected.length
                      ? _c("span", { staticClass: "fa fa-check" })
                      : _c("span", { staticClass: "fa fa-times" })
                  ])
                ])
              ]),
              _vm._v(" "),
              _c(
                "div",
                { staticClass: "p-2 bg-white" },
                [
                  _c(
                    "button",
                    {
                      staticClass: "btn btn-sm btn-primary",
                      attrs: { type: "button" },
                      on: { click: _vm.openFilterBox }
                    },
                    [
                      _c("span", { staticClass: "fa fa-filter" }),
                      _vm._v(" "),
                      _c("span", [_vm._v("Filter")])
                    ]
                  ),
                  _vm._v(" "),
                  _c("data-filter-box", {
                    attrs: {
                      show: _vm.showFilterBox,
                      onClose: _vm.closeFilterBox,
                      onReset: _vm.onReset,
                      onFilter: _vm.onFilter,
                      data: _vm.pharmacies,
                      queryOnly: false,
                      queryKeys: ["area", "brick", "type"]
                    }
                  })
                ],
                1
              ),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "bg-white p-2",
                  staticStyle: { height: "200px", overflow: "auto" }
                },
                [
                  _vm.pharmacies.length
                    ? _c(
                        "ul",
                        { staticClass: "nav", attrs: { id: "pharmacy_list" } },
                        _vm._l(_vm.pharmacies, function(pharmacy, i) {
                          return _c(
                            "li",
                            {
                              key: "location_" + i,
                              staticClass: "nav-item col-12 border-bottom"
                            },
                            [
                              _c("input", {
                                attrs: { type: "checkbox" },
                                on: {
                                  click: function($event) {
                                    return _vm.togglePlan(pharmacy)
                                  }
                                }
                              }),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "form-check-label text-muted small"
                                },
                                [_vm._v(_vm._s(pharmacy.name))]
                              )
                            ]
                          )
                        }),
                        0
                      )
                    : _c("loader-component")
                ],
                1
              )
            ])
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "col-lg-6 px-0 px-2" }, [
            _c("div", { staticClass: "px-0 shadow-sm" }, [
              _c("div", { staticClass: "bg-primary text-light p-2" }, [
                _c("p", { staticClass: "mb-0" }, [
                  _c("span", [_vm._v(" Date : " + _vm._s(_vm.$attrs.date))]),
                  _vm._v(" "),
                  _c("span", { staticClass: "float-right badge badge-light" }, [
                    _vm._v(
                      "\n                Planned: " + _vm._s(_vm.updated.length)
                    )
                  ])
                ])
              ]),
              _vm._v(" "),
              _c(
                "div",
                {
                  staticClass: "bg-white p-2",
                  staticStyle: { height: "200px", overflow: "auto" }
                },
                [
                  _vm.planned.length
                    ? _c(
                        "ul",
                        { staticClass: "nav" },
                        _vm._l(_vm.planned, function(plan) {
                          return _c(
                            "li",
                            {
                              key: plan.id,
                              staticClass:
                                "nav-item col-12 border-bottom clearfix"
                            },
                            [
                              _c("input", {
                                attrs: { type: "checkbox" },
                                on: {
                                  click: function($event) {
                                    return _vm.selectPlanToRemove(plan.id)
                                  }
                                }
                              }),
                              _vm._v(" "),
                              _c(
                                "span",
                                {
                                  staticClass:
                                    "form-check-label text-muted small"
                                },
                                [
                                  _c("span", {
                                    domProps: { innerHTML: _vm._s(plan.title) }
                                  })
                                ]
                              ),
                              _vm._v(" "),
                              _c(
                                "span",
                                { staticClass: "float-right badge badge-info" },
                                [
                                  _vm._v(
                                    _vm._s(
                                      plan.type === "regular"
                                        ? "Brick"
                                        : "Health Day"
                                    )
                                  )
                                ]
                              )
                            ]
                          )
                        }),
                        0
                      )
                    : _c(
                        "div",
                        { staticClass: "py-5" },
                        [_c("no-data-to-show")],
                        1
                      )
                ]
              )
            ])
          ])
        ]),
        _vm._v(" "),
        _c("hr"),
        _vm._v(" "),
        _c("planner-actions", {
          attrs: {
            date: _vm.$attrs.date,
            type: _vm.type,
            store: _vm.selected,
            update: _vm.updated
          }
        })
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-warning" }, [
      _c("span", { staticClass: "fa fa-calendar-plus" }),
      _vm._v(" "),
      _c("span", [_vm._v("Plan a health day")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=template&id=aaca7a38&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=template&id=aaca7a38& ***!
  \*************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "shadow px-0 rounded pb-5" }, [
    _vm._m(0),
    _vm._v(" "),
    _c("div", { staticClass: "p-2" }, [
      _c(
        "div",
        { staticClass: "p-2 text-center shadow-sm rounded my-2" },
        [
          _c(
            "router-link",
            {
              staticClass: "btn btn-sm btn-primary",
              attrs: { to: "/planner/add/day" }
            },
            [
              _c("span", { staticClass: "fa fa-plus-circle" }),
              _vm._v(" "),
              _c("span", [_vm._v("Plan a day")])
            ]
          ),
          _vm._v(" "),
          _c(
            "router-link",
            {
              staticClass: "btn btn-sm btn-warning",
              attrs: { to: "/planner/add/health-day" }
            },
            [
              _c("span", { staticClass: "fa fa-plus-circle" }),
              _vm._v(" "),
              _c("span", [_vm._v("Plan a health day")])
            ]
          ),
          _vm._v(" "),
          _vm._m(1)
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        [
          _vm.plans.length
            ? _c("vue-cal", {
                staticClass: "vuecal--green-theme",
                staticStyle: { "max-height": "400px", overflow: "auto" },
                attrs: {
                  selectedDate: _vm.$attrs.date,
                  activeView: "week",
                  disableViews: ["years", "year"],
                  startWeekOnSunday: true,
                  events: _vm.plans,
                  time: false,
                  "hide-weekdays": [5]
                }
              })
            : _c("div", { staticClass: "py-5" }, [_c("no-data-to-show")], 1)
        ],
        1
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-calendar-check" }),
      _vm._v(" "),
      _c("span", [_vm._v("Planner")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("button", { staticClass: "btn btn-sm btn-success" }, [
      _c("span", { staticClass: "fa fa-check-circle" }),
      _vm._v(" "),
      _c("span", [_vm._v("Submit")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=template&id=4525df70&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=template&id=4525df70& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        _c("ValidationObserver", {
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function(ref) {
                var handleSubmit = ref.handleSubmit
                return [
                  _c(
                    "form",
                    {
                      on: {
                        submit: function($event) {
                          $event.preventDefault()
                          return handleSubmit(_vm.saveReport)
                        }
                      }
                    },
                    [
                      _c("div", { staticClass: "row mx-auto" }, [
                        _c(
                          "div",
                          {
                            staticClass:
                              "col-lg  mx-1 rounded form-group border p-2"
                          },
                          [
                            _c(
                              "label",
                              {
                                staticClass: "text-muted",
                                attrs: { for: "date" }
                              },
                              [_vm._v("Date")]
                            ),
                            _vm._v(" "),
                            _c("ValidationProvider", {
                              attrs: { name: "date", rules: "required" },
                              scopedSlots: _vm._u(
                                [
                                  {
                                    key: "default",
                                    fn: function(ref) {
                                      var errors = ref.errors
                                      return [
                                        errors[0]
                                          ? _c(
                                              "span",
                                              {
                                                staticClass: "text-danger small"
                                              },
                                              [_vm._v("you must select date")]
                                            )
                                          : _vm._e(),
                                        _vm._v(" "),
                                        _c("input", {
                                          directives: [
                                            {
                                              name: "model",
                                              rawName: "v-model",
                                              value: _vm.visit.date,
                                              expression: "visit.date"
                                            }
                                          ],
                                          class:
                                            "form-control form-control-sm " +
                                            (errors[0]
                                              ? "border border-danger"
                                              : ""),
                                          attrs: {
                                            type: "date",
                                            name: "date",
                                            id: "date",
                                            max: new Date().format(),
                                            min:
                                              _vm.$store.getters
                                                .reportIntervalMin
                                          },
                                          domProps: { value: _vm.visit.date },
                                          on: {
                                            input: function($event) {
                                              if ($event.target.composing) {
                                                return
                                              }
                                              _vm.$set(
                                                _vm.visit,
                                                "date",
                                                $event.target.value
                                              )
                                            }
                                          }
                                        })
                                      ]
                                    }
                                  }
                                ],
                                null,
                                true
                              )
                            })
                          ],
                          1
                        ),
                        _vm._v(" "),
                        _c(
                          "div",
                          {
                            staticClass:
                              "col-lg  mx-1 rounded form-group border p-2"
                          },
                          [
                            _c("div", { staticClass: "row mx-auto" }, [
                              _c(
                                "div",
                                { staticClass: "col-lg" },
                                [
                                  _c(
                                    "label",
                                    {
                                      staticClass: "text-muted",
                                      attrs: { for: "pharmacy" }
                                    },
                                    [_vm._v("Pharmacy")]
                                  ),
                                  _vm._v(" "),
                                  _c("ValidationProvider", {
                                    attrs: {
                                      name: "pharmacy",
                                      rules: "required"
                                    },
                                    scopedSlots: _vm._u(
                                      [
                                        {
                                          key: "default",
                                          fn: function(ref) {
                                            var errors = ref.errors
                                            return [
                                              errors[0]
                                                ? _c(
                                                    "span",
                                                    {
                                                      staticClass:
                                                        "text-danger small"
                                                    },
                                                    [
                                                      _vm._v(
                                                        "you must select pharmacy"
                                                      )
                                                    ]
                                                  )
                                                : _vm._e(),
                                              _vm._v(" "),
                                              _c(
                                                "select",
                                                {
                                                  directives: [
                                                    {
                                                      name: "model",
                                                      rawName: "v-model",
                                                      value: _vm.visit.pharmacy,
                                                      expression:
                                                        "visit.pharmacy"
                                                    }
                                                  ],
                                                  class:
                                                    "form-control form-control-sm " +
                                                    (errors[0]
                                                      ? "border border-danger"
                                                      : ""),
                                                  attrs: {
                                                    name: "pharmacy",
                                                    id: "pharmacy",
                                                    disabled: !_vm.isFetched
                                                  },
                                                  on: {
                                                    change: function($event) {
                                                      var $$selectedVal = Array.prototype.filter
                                                        .call(
                                                          $event.target.options,
                                                          function(o) {
                                                            return o.selected
                                                          }
                                                        )
                                                        .map(function(o) {
                                                          var val =
                                                            "_value" in o
                                                              ? o._value
                                                              : o.value
                                                          return val
                                                        })
                                                      _vm.$set(
                                                        _vm.visit,
                                                        "pharmacy",
                                                        $event.target.multiple
                                                          ? $$selectedVal
                                                          : $$selectedVal[0]
                                                      )
                                                    }
                                                  }
                                                },
                                                [
                                                  _c(
                                                    "option",
                                                    {
                                                      domProps: { value: null }
                                                    },
                                                    [_vm._v("Select Pharmacy")]
                                                  ),
                                                  _vm._v(" "),
                                                  _vm._l(
                                                    _vm.pharmacies,
                                                    function(pharmacy) {
                                                      return _c(
                                                        "option",
                                                        {
                                                          key: pharmacy.id,
                                                          domProps: {
                                                            value: pharmacy.id
                                                          }
                                                        },
                                                        [
                                                          _vm._v(
                                                            _vm._s(
                                                              pharmacy.name
                                                            )
                                                          )
                                                        ]
                                                      )
                                                    }
                                                  )
                                                ],
                                                2
                                              )
                                            ]
                                          }
                                        }
                                      ],
                                      null,
                                      true
                                    )
                                  })
                                ],
                                1
                              ),
                              _vm._v(" "),
                              _c(
                                "div",
                                { staticClass: "col-lg-auto" },
                                [
                                  _c(
                                    "button",
                                    {
                                      staticClass: "btn btn-sm btn-primary",
                                      attrs: { type: "button" },
                                      on: { click: _vm.openFilterBox }
                                    },
                                    [
                                      _c("span", {
                                        staticClass: "fa fa-filter"
                                      }),
                                      _vm._v(" "),
                                      _c("span", [_vm._v("Filter")])
                                    ]
                                  ),
                                  _vm._v(" "),
                                  _c("data-filter-box", {
                                    attrs: {
                                      show: _vm.showFilterBox,
                                      queryOnly: false,
                                      onClose: _vm.closeFilterBox,
                                      onReset: _vm.onReset,
                                      onFilter: _vm.onFilter,
                                      queryKeys: _vm.filterQueryKeys,
                                      data: _vm.pharmacies
                                    }
                                  })
                                ],
                                1
                              )
                            ])
                          ]
                        )
                      ]),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "form-group border p-2" },
                        [
                          _c("otc-visit-products", {
                            attrs: {
                              data: _vm.visit.products,
                              pharmacyProducts: true
                            }
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "form-group p-2" },
                        [
                          _c(
                            "label",
                            {
                              staticClass: "text-muted",
                              attrs: { for: "feedback" }
                            },
                            [_vm._v("Feedback")]
                          ),
                          _vm._v(" "),
                          _c("ValidationProvider", {
                            attrs: { name: "Feedback", rules: "required" },
                            scopedSlots: _vm._u(
                              [
                                {
                                  key: "default",
                                  fn: function(ref) {
                                    var errors = ref.errors
                                    return [
                                      _c(
                                        "span",
                                        { staticClass: "text-danger small" },
                                        [_vm._v(_vm._s(errors[0]))]
                                      ),
                                      _vm._v(" "),
                                      _c("textarea", {
                                        directives: [
                                          {
                                            name: "model",
                                            rawName: "v-model",
                                            value: _vm.visit.general_feedback,
                                            expression: "visit.general_feedback"
                                          }
                                        ],
                                        class:
                                          "form-control form-control-sm " +
                                          (errors[0]
                                            ? "border border-danger"
                                            : ""),
                                        attrs: {
                                          name: "feedback",
                                          id: "feedback",
                                          cols: "30",
                                          rows: "5",
                                          placeholder: "write general feedback"
                                        },
                                        domProps: {
                                          value: _vm.visit.general_feedback
                                        },
                                        on: {
                                          input: function($event) {
                                            if ($event.target.composing) {
                                              return
                                            }
                                            _vm.$set(
                                              _vm.visit,
                                              "general_feedback",
                                              $event.target.value
                                            )
                                          }
                                        }
                                      })
                                    ]
                                  }
                                }
                              ],
                              null,
                              true
                            )
                          })
                        ],
                        1
                      ),
                      _vm._v(" "),
                      _c("hr"),
                      _vm._v(" "),
                      _c(
                        "div",
                        { staticClass: "form-group text-right" },
                        [
                          _c(
                            "router-link",
                            {
                              staticClass: "btn btn-sm btn-dark",
                              attrs: { to: "/reports" }
                            },
                            [
                              _c("span", {
                                staticClass: "fa fa-chevron-circle-left"
                              }),
                              _vm._v(" "),
                              _c("span", [_vm._v("back")])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-sm btn-secondary",
                              attrs: { type: "reset" }
                            },
                            [
                              _c("span", { staticClass: "fa fa-redo" }),
                              _vm._v(" "),
                              _c("span", [_vm._v("Reset")])
                            ]
                          ),
                          _vm._v(" "),
                          _c(
                            "button",
                            {
                              staticClass: "btn btn-sm btn-success",
                              attrs: { type: "submit" }
                            },
                            [
                              _c("span", { staticClass: "fa fa-save" }),
                              _vm._v(" "),
                              _c("span", [_vm._v("Save")])
                            ]
                          )
                        ],
                        1
                      )
                    ]
                  )
                ]
              }
            }
          ])
        })
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-plus-circle" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [
        _vm._v("Add new Pharmacy Report")
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=template&id=38616b35&":
/*!********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=template&id=38616b35& ***!
  \********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0 shadow rounded pb-5" }, [
    _vm._m(0),
    _vm._v(" "),
    _c("div", { staticClass: "row mx-auto p-2" }, [
      _c(
        "div",
        { staticClass: "col-lg-3" },
        [
          _c("sidebar-component", { attrs: { links: _vm.views } }),
          _vm._v(" "),
          _c(
            "div",
            { staticClass: "my-2" },
            [
              _c(
                "router-link",
                {
                  staticClass: "btn btn-sm btn-block btn-primary",
                  attrs: { to: "/reports/add/pharmacy" }
                },
                [
                  _c("span", { staticClass: "fa fa-plus-circle" }),
                  _vm._v(" "),
                  _c("span", [_vm._v("Add Report")])
                ]
              ),
              _vm._v(" "),
              _c(
                "router-link",
                {
                  staticClass: "btn btn-sm btn-block btn-dark",
                  attrs: { to: "/reports" }
                },
                [
                  _c("span", { staticClass: "fa fa-chevron-circle-left" }),
                  _vm._v(" "),
                  _c("span", [_vm._v("back")])
                ]
              )
            ],
            1
          )
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "col-lg-9 px-0 shadow rounded pb-5" },
        [_c("router-view")],
        1
      )
    ])
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-book-reader" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [
        _vm._v("Pharmacy Report List")
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=template&id=4b22393a&":
/*!************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=template&id=4b22393a& ***!
  \************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "p-2" }, [
    _c("div", { staticClass: "row mx-auto" }, [
      _c(
        "div",
        { staticClass: "col-lg-6" },
        [_c("sidebar-component", { attrs: { links: _vm.addLinks } })],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "col-lg-6" },
        [_c("sidebar-component", { attrs: { links: _vm.viewLinks } })],
        1
      )
    ]),
    _vm._v(" "),
    _vm._m(0)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "row mx-auto" }, [
      _c("div", { staticClass: "col-lg-6" }),
      _vm._v(" "),
      _c("div", { staticClass: "col-lg-6" })
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=template&id=7c333b8f&":
/*!*******************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=template&id=7c333b8f& ***!
  \*******************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        Object.keys(_vm.reports).length
          ? _c("div", { staticClass: "p-2" }, [
              _c("div", { staticClass: "p-2" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-sm btn-success",
                    on: { click: _vm.exportToExcel }
                  },
                  [
                    _c("span", { staticClass: "fa fa-file-excel" }),
                    _vm._v(" "),
                    _c("span", [_vm._v("Export")])
                  ]
                )
              ]),
              _vm._v(" "),
              _c(
                "table",
                {
                  staticClass:
                    "table table-sm small table-responsive table-bordered table-striped",
                  attrs: { id: "pharmacy_reports" }
                },
                [
                  _vm._m(1),
                  _vm._v(" "),
                  _vm._l(Object.keys(_vm.reports), function(key, i) {
                    return [
                      _c("tbody", { staticClass: "_removed__raw" }, [
                        _c("tr", { staticClass: "bg-dark text-light" }, [
                          _c("td", { attrs: { colspan: "18" } }, [
                            _c(
                              "a",
                              {
                                staticClass: "text-decoration-none text-light",
                                attrs: {
                                  href: "",
                                  "data-toggle": "collapse",
                                  "data-target": "#pharmacy_report_" + i
                                }
                              },
                              [_vm._v("Date : " + _vm._s(key))]
                            )
                          ])
                        ])
                      ]),
                      _vm._v(" "),
                      _c(
                        "tbody",
                        {
                          staticClass: "collapse",
                          attrs: { id: "pharmacy_report_" + i }
                        },
                        _vm._l(_vm.reports[key], function(row, index) {
                          return _c(
                            "tr",
                            {
                              key:
                                "pharmacy_report_" + key + "_" + i + "_" + index
                            },
                            [
                              _c("td", [_vm._v(_vm._s(row.pharmacy))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.date))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.type))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.product))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.order))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.distributor))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor1))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor1_rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor1_stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor2))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor2_rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor2_stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor3))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor3_rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor3_stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.feedback))])
                            ]
                          )
                        }),
                        0
                      )
                    ]
                  })
                ],
                2
              )
            ])
          : _vm.isFetched
          ? _c("div", [_c("no-data-to-show")], 1)
          : _c("loader-component")
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-store" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [_vm._v("Date View")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", { staticClass: "bg-success text-light" }, [
        _c("th", [_vm._v("Pharmacy")]),
        _vm._v(" "),
        _c("th", [_vm._v("Date")]),
        _vm._v(" "),
        _c("th", [_vm._v("Type")]),
        _vm._v(" "),
        _c("th", [_vm._v("Product")]),
        _vm._v(" "),
        _c("th", [_vm._v("Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Order")]),
        _vm._v(" "),
        _c("th", [_vm._v("Distributor")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 1")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 1 Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 1 Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 2")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 2 Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 2 Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 3")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 3 Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 3 Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Feedback")])
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=template&id=e3e0ccd8&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=template&id=e3e0ccd8& ***!
  \***********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        Object.keys(_vm.reports).length
          ? _c("div", { staticClass: "p-2" }, [
              _c("div", { staticClass: "p-2" }, [
                _c(
                  "button",
                  {
                    staticClass: "btn btn-sm btn-success",
                    on: { click: _vm.exportToExcel }
                  },
                  [
                    _c("span", { staticClass: "fa fa-file-excel" }),
                    _vm._v(" "),
                    _c("span", [_vm._v("Export")])
                  ]
                )
              ]),
              _vm._v(" "),
              _c(
                "table",
                {
                  staticClass:
                    "table table-sm small table-responsive table-bordered table-striped",
                  attrs: { id: "pharmacy_reports" }
                },
                [
                  _vm._m(1),
                  _vm._v(" "),
                  _vm._l(Object.keys(_vm.reports), function(key, i) {
                    return [
                      _c("tbody", { staticClass: "_removed__raw" }, [
                        _c("tr", { staticClass: "bg-dark text-light" }, [
                          _c("td", { attrs: { colspan: "18" } }, [
                            _c(
                              "a",
                              {
                                staticClass: "text-decoration-none text-light",
                                attrs: {
                                  href: "",
                                  "data-toggle": "collapse",
                                  "data-target": "#pharmacy_report_" + i
                                }
                              },
                              [_vm._v("Pharmacy : " + _vm._s(key))]
                            )
                          ])
                        ])
                      ]),
                      _vm._v(" "),
                      _c(
                        "tbody",
                        {
                          staticClass: "collapse",
                          attrs: { id: "pharmacy_report_" + i }
                        },
                        _vm._l(_vm.reports[key], function(row, index) {
                          return _c(
                            "tr",
                            {
                              key:
                                "pharmacy_report_" + key + "_" + i + "_" + index
                            },
                            [
                              _c("td", [_vm._v(_vm._s(row.pharmacy))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.date))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.type))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.product))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.order))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.distributor))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor1))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor1_rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor1_stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor2))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor2_rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor2_stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor3))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor3_rate))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.competitor3_stock))]),
                              _vm._v(" "),
                              _c("td", [_vm._v(_vm._s(row.feedback))])
                            ]
                          )
                        }),
                        0
                      )
                    ]
                  })
                ],
                2
              )
            ])
          : _vm.isFetched
          ? _c("div", [_c("no-data-to-show")], 1)
          : _c("loader-component")
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-store" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [_vm._v("Pharmacy View")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("thead", [
      _c("tr", { staticClass: "bg-success text-light" }, [
        _c("th", [_vm._v("Pharmacy")]),
        _vm._v(" "),
        _c("th", [_vm._v("Date")]),
        _vm._v(" "),
        _c("th", [_vm._v("Type")]),
        _vm._v(" "),
        _c("th", [_vm._v("Product")]),
        _vm._v(" "),
        _c("th", [_vm._v("Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Order")]),
        _vm._v(" "),
        _c("th", [_vm._v("Distributor")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 1")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 1 Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 1 Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 2")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 2 Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 2 Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 3")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 3 Rate")]),
        _vm._v(" "),
        _c("th", [_vm._v("Competitor 3 Stock")]),
        _vm._v(" "),
        _c("th", [_vm._v("Feedback")])
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=template&id=fc6d1970&":
/*!**********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=template&id=fc6d1970& ***!
  \**********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "px-0" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "p-2" },
      [
        _vm.reports.length
          ? _c(
              "div",
              { staticClass: "p-2" },
              [
                _c("table-component", {
                  attrs: {
                    heads: _vm.heads,
                    data: _vm.reports,
                    unselectable: true,
                    headClass: "bg-success text-light"
                  }
                })
              ],
              1
            )
          : _vm.isFetched
          ? _c("div", [_c("no-data-to-show")], 1)
          : _c("loader-component")
      ],
      1
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("p", { staticClass: "alert alert-success" }, [
      _c("span", { staticClass: "fa fa-gift" }),
      _vm._v(" "),
      _c("span", { staticClass: "font-weight-bold" }, [_vm._v("Product View")])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue-toasted/dist/vue-toasted.min.js":
/*!**********************************************************!*\
  !*** ./node_modules/vue-toasted/dist/vue-toasted.min.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){if(true)module.exports=e();else { var r, n; }}(this,function(){return function(t){function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};return e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="/dist/",e(e.s=6)}([function(t,e,n){"use strict";function r(){d=!1}function i(t){if(!t)return void(f!==m&&(f=m,r()));if(t!==f){if(t.length!==m.length)throw new Error("Custom alphabet for shortid must be "+m.length+" unique characters. You submitted "+t.length+" characters: "+t);var e=t.split("").filter(function(t,e,n){return e!==n.lastIndexOf(t)});if(e.length)throw new Error("Custom alphabet for shortid must be "+m.length+" unique characters. These characters were not unique: "+e.join(", "));f=t,r()}}function o(t){return i(t),f}function a(t){h.seed(t),p!==t&&(r(),p=t)}function s(){f||i(m);for(var t,e=f.split(""),n=[],r=h.nextValue();e.length>0;)r=h.nextValue(),t=Math.floor(r*e.length),n.push(e.splice(t,1)[0]);return n.join("")}function c(){return d||(d=s())}function u(t){return c()[t]}function l(){return f||m}var f,p,d,h=n(19),m="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";t.exports={get:l,characters:o,seed:a,lookup:u,shuffled:c}},function(t,e,n){"use strict";var r=n(5),i=n.n(r);e.a={animateIn:function(t){i()({targets:t,translateY:"-35px",opacity:1,duration:300,easing:"easeOutCubic"})},animateOut:function(t,e){i()({targets:t,opacity:0,marginTop:"-40px",duration:300,easing:"easeOutExpo",complete:e})},animateOutBottom:function(t,e){i()({targets:t,opacity:0,marginBottom:"-40px",duration:300,easing:"easeOutExpo",complete:e})},animateReset:function(t){i()({targets:t,left:0,opacity:1,duration:300,easing:"easeOutExpo"})},animatePanning:function(t,e,n){i()({targets:t,duration:10,easing:"easeOutQuad",left:e,opacity:n})},animatePanEnd:function(t,e){i()({targets:t,opacity:0,duration:300,easing:"easeOutExpo",complete:e})},clearAnimation:function(t){var e=i.a.timeline();t.forEach(function(t){e.add({targets:t.el,opacity:0,right:"-40px",duration:300,offset:"-=150",easing:"easeOutExpo",complete:function(){t.remove()}})})}}},function(t,e,n){"use strict";t.exports=n(16)},function(t,e,n){"use strict";n.d(e,"a",function(){return s});var r=n(8),i=n(1),o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a=n(2);n(11).polyfill();var s=function t(e){var n=this;return this.id=a.generate(),this.options=e,this.cached_options={},this.global={},this.groups=[],this.toasts=[],this.container=null,l(this),u(this),this.group=function(e){e||(e={}),e.globalToasts||(e.globalToasts={}),Object.assign(e.globalToasts,n.global);var r=new t(e);return n.groups.push(r),r},this.register=function(t,e,r){return r=r||{},f(n,t,e,r)},this.show=function(t,e){return c(n,t,e)},this.success=function(t,e){return e=e||{},e.type="success",c(n,t,e)},this.info=function(t,e){return e=e||{},e.type="info",c(n,t,e)},this.error=function(t,e){return e=e||{},e.type="error",c(n,t,e)},this.remove=function(t){n.toasts=n.toasts.filter(function(e){return e.el.hash!==t.hash}),t.parentNode&&t.parentNode.removeChild(t)},this.clear=function(t){return i.a.clearAnimation(n.toasts,function(){t&&t()}),n.toasts=[],!0},this},c=function(t,e,i){i=i||{};var a=null;if("object"!==(void 0===i?"undefined":o(i)))return console.error("Options should be a type of object. given : "+i),null;t.options.singleton&&t.toasts.length>0&&(t.cached_options=i,t.toasts[t.toasts.length-1].goAway(0));var s=Object.assign({},t.options);return Object.assign(s,i),a=n.i(r.a)(t,e,s),t.toasts.push(a),a},u=function(t){var e=t.options.globalToasts,n=function(e,n){return"string"==typeof n&&t[n]?t[n].apply(t,[e,{}]):c(t,e,n)};e&&(t.global={},Object.keys(e).forEach(function(r){t.global[r]=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return e[r].apply(null,[t,n])}}))},l=function(t){var e=document.createElement("div");e.id=t.id,e.setAttribute("role","status"),e.setAttribute("aria-live","polite"),e.setAttribute("aria-atomic","false"),document.body.appendChild(e),t.container=e},f=function(t,e,n,r){t.options.globalToasts||(t.options.globalToasts={}),t.options.globalToasts[e]=function(t,e){var i=null;return"string"==typeof n&&(i=n),"function"==typeof n&&(i=n(t)),e(i,r)},u(t)}},function(t,e,n){n(22);var r=n(21)(null,null,null,null);t.exports=r.exports},function(t,e,n){(function(n){var r,i,o,a={scope:{}};a.defineProperty="function"==typeof Object.defineProperties?Object.defineProperty:function(t,e,n){if(n.get||n.set)throw new TypeError("ES3 does not support getters and setters.");t!=Array.prototype&&t!=Object.prototype&&(t[e]=n.value)},a.getGlobal=function(t){return"undefined"!=typeof window&&window===t?t:void 0!==n&&null!=n?n:t},a.global=a.getGlobal(this),a.SYMBOL_PREFIX="jscomp_symbol_",a.initSymbol=function(){a.initSymbol=function(){},a.global.Symbol||(a.global.Symbol=a.Symbol)},a.symbolCounter_=0,a.Symbol=function(t){return a.SYMBOL_PREFIX+(t||"")+a.symbolCounter_++},a.initSymbolIterator=function(){a.initSymbol();var t=a.global.Symbol.iterator;t||(t=a.global.Symbol.iterator=a.global.Symbol("iterator")),"function"!=typeof Array.prototype[t]&&a.defineProperty(Array.prototype,t,{configurable:!0,writable:!0,value:function(){return a.arrayIterator(this)}}),a.initSymbolIterator=function(){}},a.arrayIterator=function(t){var e=0;return a.iteratorPrototype(function(){return e<t.length?{done:!1,value:t[e++]}:{done:!0}})},a.iteratorPrototype=function(t){return a.initSymbolIterator(),t={next:t},t[a.global.Symbol.iterator]=function(){return this},t},a.array=a.array||{},a.iteratorFromArray=function(t,e){a.initSymbolIterator(),t instanceof String&&(t+="");var n=0,r={next:function(){if(n<t.length){var i=n++;return{value:e(i,t[i]),done:!1}}return r.next=function(){return{done:!0,value:void 0}},r.next()}};return r[Symbol.iterator]=function(){return r},r},a.polyfill=function(t,e,n,r){if(e){for(n=a.global,t=t.split("."),r=0;r<t.length-1;r++){var i=t[r];i in n||(n[i]={}),n=n[i]}t=t[t.length-1],r=n[t],e=e(r),e!=r&&null!=e&&a.defineProperty(n,t,{configurable:!0,writable:!0,value:e})}},a.polyfill("Array.prototype.keys",function(t){return t||function(){return a.iteratorFromArray(this,function(t){return t})}},"es6-impl","es3");var s=this;!function(n,a){i=[],r=a,void 0!==(o="function"==typeof r?r.apply(e,i):r)&&(t.exports=o)}(0,function(){function t(t){if(!R.col(t))try{return document.querySelectorAll(t)}catch(t){}}function e(t,e){for(var n=t.length,r=2<=arguments.length?arguments[1]:void 0,i=[],o=0;o<n;o++)if(o in t){var a=t[o];e.call(r,a,o,t)&&i.push(a)}return i}function n(t){return t.reduce(function(t,e){return t.concat(R.arr(e)?n(e):e)},[])}function r(e){return R.arr(e)?e:(R.str(e)&&(e=t(e)||e),e instanceof NodeList||e instanceof HTMLCollection?[].slice.call(e):[e])}function i(t,e){return t.some(function(t){return t===e})}function o(t){var e,n={};for(e in t)n[e]=t[e];return n}function a(t,e){var n,r=o(t);for(n in t)r[n]=e.hasOwnProperty(n)?e[n]:t[n];return r}function c(t,e){var n,r=o(t);for(n in e)r[n]=R.und(t[n])?e[n]:t[n];return r}function u(t){t=t.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i,function(t,e,n,r){return e+e+n+n+r+r});var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);t=parseInt(e[1],16);var n=parseInt(e[2],16),e=parseInt(e[3],16);return"rgba("+t+","+n+","+e+",1)"}function l(t){function e(t,e,n){return 0>n&&(n+=1),1<n&&--n,n<1/6?t+6*(e-t)*n:.5>n?e:n<2/3?t+(e-t)*(2/3-n)*6:t}var n=/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(t)||/hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(t);t=parseInt(n[1])/360;var r=parseInt(n[2])/100,i=parseInt(n[3])/100,n=n[4]||1;if(0==r)i=r=t=i;else{var o=.5>i?i*(1+r):i+r-i*r,a=2*i-o,i=e(a,o,t+1/3),r=e(a,o,t);t=e(a,o,t-1/3)}return"rgba("+255*i+","+255*r+","+255*t+","+n+")"}function f(t){if(t=/([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(t))return t[2]}function p(t){return-1<t.indexOf("translate")||"perspective"===t?"px":-1<t.indexOf("rotate")||-1<t.indexOf("skew")?"deg":void 0}function d(t,e){return R.fnc(t)?t(e.target,e.id,e.total):t}function h(t,e){if(e in t.style)return getComputedStyle(t).getPropertyValue(e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase())||"0"}function m(t,e){return R.dom(t)&&i(D,e)?"transform":R.dom(t)&&(t.getAttribute(e)||R.svg(t)&&t[e])?"attribute":R.dom(t)&&"transform"!==e&&h(t,e)?"css":null!=t[e]?"object":void 0}function v(t,n){var r=p(n),r=-1<n.indexOf("scale")?1:0+r;if(!(t=t.style.transform))return r;for(var i=[],o=[],a=[],s=/(\w+)\((.+?)\)/g;i=s.exec(t);)o.push(i[1]),a.push(i[2]);return t=e(a,function(t,e){return o[e]===n}),t.length?t[0]:r}function g(t,e){switch(m(t,e)){case"transform":return v(t,e);case"css":return h(t,e);case"attribute":return t.getAttribute(e)}return t[e]||0}function y(t,e){var n=/^(\*=|\+=|-=)/.exec(t);if(!n)return t;var r=f(t)||0;switch(e=parseFloat(e),t=parseFloat(t.replace(n[0],"")),n[0][0]){case"+":return e+t+r;case"-":return e-t+r;case"*":return e*t+r}}function b(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function x(t){t=t.points;for(var e,n=0,r=0;r<t.numberOfItems;r++){var i=t.getItem(r);0<r&&(n+=b(e,i)),e=i}return n}function T(t){if(t.getTotalLength)return t.getTotalLength();switch(t.tagName.toLowerCase()){case"circle":return 2*Math.PI*t.getAttribute("r");case"rect":return 2*t.getAttribute("width")+2*t.getAttribute("height");case"line":return b({x:t.getAttribute("x1"),y:t.getAttribute("y1")},{x:t.getAttribute("x2"),y:t.getAttribute("y2")});case"polyline":return x(t);case"polygon":var e=t.points;return x(t)+b(e.getItem(e.numberOfItems-1),e.getItem(0))}}function w(t,e){function n(n){return n=void 0===n?0:n,t.el.getPointAtLength(1<=e+n?e+n:0)}var r=n(),i=n(-1),o=n(1);switch(t.property){case"x":return r.x;case"y":return r.y;case"angle":return 180*Math.atan2(o.y-i.y,o.x-i.x)/Math.PI}}function E(t,e){var n,r=/-?\d*\.?\d+/g;if(n=R.pth(t)?t.totalLength:t,R.col(n))if(R.rgb(n)){var i=/rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(n);n=i?"rgba("+i[1]+",1)":n}else n=R.hex(n)?u(n):R.hsl(n)?l(n):void 0;else i=(i=f(n))?n.substr(0,n.length-i.length):n,n=e&&!/\s/g.test(n)?i+e:i;return n+="",{original:n,numbers:n.match(r)?n.match(r).map(Number):[0],strings:R.str(t)||e?n.split(r):[]}}function C(t){return t=t?n(R.arr(t)?t.map(r):r(t)):[],e(t,function(t,e,n){return n.indexOf(t)===e})}function S(t){var e=C(t);return e.map(function(t,n){return{target:t,id:n,total:e.length}})}function O(t,e){var n=o(e);if(R.arr(t)){var i=t.length;2!==i||R.obj(t[0])?R.fnc(e.duration)||(n.duration=e.duration/i):t={value:t}}return r(t).map(function(t,n){return n=n?0:e.delay,t=R.obj(t)&&!R.pth(t)?t:{value:t},R.und(t.delay)&&(t.delay=n),t}).map(function(t){return c(t,n)})}function A(t,e){var n,r={};for(n in t){var i=d(t[n],e);R.arr(i)&&(i=i.map(function(t){return d(t,e)}),1===i.length&&(i=i[0])),r[n]=i}return r.duration=parseFloat(r.duration),r.delay=parseFloat(r.delay),r}function I(t){return R.arr(t)?F.apply(this,t):z[t]}function M(t,e){var n;return t.tweens.map(function(r){r=A(r,e);var i=r.value,o=g(e.target,t.name),a=n?n.to.original:o,a=R.arr(i)?i[0]:a,s=y(R.arr(i)?i[1]:i,a),o=f(s)||f(a)||f(o);return r.from=E(a,o),r.to=E(s,o),r.start=n?n.end:t.offset,r.end=r.start+r.delay+r.duration,r.easing=I(r.easing),r.elasticity=(1e3-Math.min(Math.max(r.elasticity,1),999))/1e3,r.isPath=R.pth(i),r.isColor=R.col(r.from.original),r.isColor&&(r.round=1),n=r})}function k(t,r){return e(n(t.map(function(t){return r.map(function(e){var n=m(t.target,e.name);if(n){var r=M(e,t);e={type:n,property:e.name,animatable:t,tweens:r,duration:r[r.length-1].end,delay:r[0].delay}}else e=void 0;return e})})),function(t){return!R.und(t)})}function P(t,e,n,r){var i="delay"===t;return e.length?(i?Math.min:Math.max).apply(Math,e.map(function(e){return e[t]})):i?r.delay:n.offset+r.delay+r.duration}function L(t){var e,n=a(_,t),r=a(X,t),i=S(t.targets),o=[],s=c(n,r);for(e in t)s.hasOwnProperty(e)||"targets"===e||o.push({name:e,offset:s.offset,tweens:O(t[e],r)});return t=k(i,o),c(n,{children:[],animatables:i,animations:t,duration:P("duration",t,n,r),delay:P("delay",t,n,r)})}function j(t){function n(){return window.Promise&&new Promise(function(t){return f=t})}function r(t){return d.reversed?d.duration-t:t}function i(t){for(var n=0,r={},i=d.animations,o=i.length;n<o;){var a=i[n],s=a.animatable,c=a.tweens,u=c.length-1,l=c[u];u&&(l=e(c,function(e){return t<e.end})[0]||l);for(var c=Math.min(Math.max(t-l.start-l.delay,0),l.duration)/l.duration,f=isNaN(c)?1:l.easing(c,l.elasticity),c=l.to.strings,p=l.round,u=[],m=void 0,m=l.to.numbers.length,v=0;v<m;v++){var g=void 0,g=l.to.numbers[v],y=l.from.numbers[v],g=l.isPath?w(l.value,f*g):y+f*(g-y);p&&(l.isColor&&2<v||(g=Math.round(g*p)/p)),u.push(g)}if(l=c.length)for(m=c[0],f=0;f<l;f++)p=c[f+1],v=u[f],isNaN(v)||(m=p?m+(v+p):m+(v+" "));else m=u[0];Y[a.type](s.target,a.property,m,r,s.id),a.currentValue=m,n++}if(n=Object.keys(r).length)for(i=0;i<n;i++)N||(N=h(document.body,"transform")?"transform":"-webkit-transform"),d.animatables[i].target.style[N]=r[i].join(" ");d.currentTime=t,d.progress=t/d.duration*100}function o(t){d[t]&&d[t](d)}function a(){d.remaining&&!0!==d.remaining&&d.remaining--}function s(t){var e=d.duration,s=d.offset,h=s+d.delay,m=d.currentTime,v=d.reversed,g=r(t);if(d.children.length){var y=d.children,b=y.length;if(g>=d.currentTime)for(var x=0;x<b;x++)y[x].seek(g);else for(;b--;)y[b].seek(g)}(g>=h||!e)&&(d.began||(d.began=!0,o("begin")),o("run")),g>s&&g<e?i(g):(g<=s&&0!==m&&(i(0),v&&a()),(g>=e&&m!==e||!e)&&(i(e),v||a())),o("update"),t>=e&&(d.remaining?(u=c,"alternate"===d.direction&&(d.reversed=!d.reversed)):(d.pause(),d.completed||(d.completed=!0,o("complete"),"Promise"in window&&(f(),p=n()))),l=0)}t=void 0===t?{}:t;var c,u,l=0,f=null,p=n(),d=L(t);return d.reset=function(){var t=d.direction,e=d.loop;for(d.currentTime=0,d.progress=0,d.paused=!0,d.began=!1,d.completed=!1,d.reversed="reverse"===t,d.remaining="alternate"===t&&1===e?2:e,i(0),t=d.children.length;t--;)d.children[t].reset()},d.tick=function(t){c=t,u||(u=c),s((l+c-u)*j.speed)},d.seek=function(t){s(r(t))},d.pause=function(){var t=H.indexOf(d);-1<t&&H.splice(t,1),d.paused=!0},d.play=function(){d.paused&&(d.paused=!1,u=0,l=r(d.currentTime),H.push(d),q||V())},d.reverse=function(){d.reversed=!d.reversed,u=0,l=r(d.currentTime)},d.restart=function(){d.pause(),d.reset(),d.play()},d.finished=p,d.reset(),d.autoplay&&d.play(),d}var N,_={update:void 0,begin:void 0,run:void 0,complete:void 0,loop:1,direction:"normal",autoplay:!0,offset:0},X={duration:1e3,delay:0,easing:"easeOutElastic",elasticity:500,round:0},D="translateX translateY translateZ rotate rotateX rotateY rotateZ scale scaleX scaleY scaleZ skewX skewY perspective".split(" "),R={arr:function(t){return Array.isArray(t)},obj:function(t){return-1<Object.prototype.toString.call(t).indexOf("Object")},pth:function(t){return R.obj(t)&&t.hasOwnProperty("totalLength")},svg:function(t){return t instanceof SVGElement},dom:function(t){return t.nodeType||R.svg(t)},str:function(t){return"string"==typeof t},fnc:function(t){return"function"==typeof t},und:function(t){return void 0===t},hex:function(t){return/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(t)},rgb:function(t){return/^rgb/.test(t)},hsl:function(t){return/^hsl/.test(t)},col:function(t){return R.hex(t)||R.rgb(t)||R.hsl(t)}},F=function(){function t(t,e,n){return(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t}return function(e,n,r,i){if(0<=e&&1>=e&&0<=r&&1>=r){var o=new Float32Array(11);if(e!==n||r!==i)for(var a=0;11>a;++a)o[a]=t(.1*a,e,r);return function(a){if(e===n&&r===i)return a;if(0===a)return 0;if(1===a)return 1;for(var s=0,c=1;10!==c&&o[c]<=a;++c)s+=.1;--c;var c=s+(a-o[c])/(o[c+1]-o[c])*.1,u=3*(1-3*r+3*e)*c*c+2*(3*r-6*e)*c+3*e;if(.001<=u){for(s=0;4>s&&0!==(u=3*(1-3*r+3*e)*c*c+2*(3*r-6*e)*c+3*e);++s)var l=t(c,e,r)-a,c=c-l/u;a=c}else if(0===u)a=c;else{var c=s,s=s+.1,f=0;do{l=c+(s-c)/2,u=t(l,e,r)-a,0<u?s=l:c=l}while(1e-7<Math.abs(u)&&10>++f);a=l}return t(a,n,i)}}}}(),z=function(){function t(t,e){return 0===t||1===t?t:-Math.pow(2,10*(t-1))*Math.sin(2*(t-1-e/(2*Math.PI)*Math.asin(1))*Math.PI/e)}var e,n="Quad Cubic Quart Quint Sine Expo Circ Back Elastic".split(" "),r={In:[[.55,.085,.68,.53],[.55,.055,.675,.19],[.895,.03,.685,.22],[.755,.05,.855,.06],[.47,0,.745,.715],[.95,.05,.795,.035],[.6,.04,.98,.335],[.6,-.28,.735,.045],t],Out:[[.25,.46,.45,.94],[.215,.61,.355,1],[.165,.84,.44,1],[.23,1,.32,1],[.39,.575,.565,1],[.19,1,.22,1],[.075,.82,.165,1],[.175,.885,.32,1.275],function(e,n){return 1-t(1-e,n)}],InOut:[[.455,.03,.515,.955],[.645,.045,.355,1],[.77,0,.175,1],[.86,0,.07,1],[.445,.05,.55,.95],[1,0,0,1],[.785,.135,.15,.86],[.68,-.55,.265,1.55],function(e,n){return.5>e?t(2*e,n)/2:1-t(-2*e+2,n)/2}]},i={linear:F(.25,.25,.75,.75)},o={};for(e in r)o.type=e,r[o.type].forEach(function(t){return function(e,r){i["ease"+t.type+n[r]]=R.fnc(e)?e:F.apply(s,e)}}(o)),o={type:o.type};return i}(),Y={css:function(t,e,n){return t.style[e]=n},attribute:function(t,e,n){return t.setAttribute(e,n)},object:function(t,e,n){return t[e]=n},transform:function(t,e,n,r,i){r[i]||(r[i]=[]),r[i].push(e+"("+n+")")}},H=[],q=0,V=function(){function t(){q=requestAnimationFrame(e)}function e(e){var n=H.length;if(n){for(var r=0;r<n;)H[r]&&H[r].tick(e),r++;t()}else cancelAnimationFrame(q),q=0}return t}();return j.version="2.2.0",j.speed=1,j.running=H,j.remove=function(t){t=C(t);for(var e=H.length;e--;)for(var n=H[e],r=n.animations,o=r.length;o--;)i(t,r[o].animatable.target)&&(r.splice(o,1),r.length||n.pause())},j.getValue=g,j.path=function(e,n){var r=R.str(e)?t(e)[0]:e,i=n||100;return function(t){return{el:r,property:t,totalLength:T(r)*(i/100)}}},j.setDashoffset=function(t){var e=T(t);return t.setAttribute("stroke-dasharray",e),e},j.bezier=F,j.easings=z,j.timeline=function(t){var e=j(t);return e.pause(),e.duration=0,e.add=function(n){return e.children.forEach(function(t){t.began=!0,t.completed=!0}),r(n).forEach(function(n){var r=c(n,a(X,t||{}));r.targets=r.targets||t.targets,n=e.duration;var i=r.offset;r.autoplay=!1,r.direction=e.direction,r.offset=R.und(i)?n:y(i,n),e.began=!0,e.completed=!0,e.seek(r.offset),r=j(r),r.began=!0,r.completed=!0,r.duration>n&&(e.duration=r.duration),e.children.push(r)}),e.seek(0),e.reset(),e.autoplay&&e.restart(),e},e},j.random=function(t,e){return Math.floor(Math.random()*(e-t+1))+t},j})}).call(e,n(25))},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(3),i=n(4),o=n.n(i),a={install:function(t,e){e||(e={});var n=new r.a(e);t.component("toasted",o.a),t.toasted=t.prototype.$toasted=n}};"undefined"!=typeof window&&window.Vue&&(window.Toasted=a),e.default=a},function(t,e,n){"use strict";n.d(e,"a",function(){return c});var r=n(1),i=this,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},a=function(t,e,n){return setTimeout(function(){if(n.cached_options.position&&n.cached_options.position.includes("bottom"))return void r.a.animateOutBottom(t,function(){n.remove(t)});r.a.animateOut(t,function(){n.remove(t)})},e),!0},s=function(t,e){return("object"===("undefined"==typeof HTMLElement?"undefined":o(HTMLElement))?e instanceof HTMLElement:e&&"object"===(void 0===e?"undefined":o(e))&&null!==e&&1===e.nodeType&&"string"==typeof e.nodeName)?t.appendChild(e):t.innerHTML=e,i},c=function(t,e){var n=!1;return{el:t,text:function(e){return s(t,e),this},goAway:function(){var r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:800;return n=!0,a(t,r,e)},remove:function(){e.remove(t)},disposed:function(){return n}}}},function(t,e,n){"use strict";var r=n(12),i=n.n(r),o=n(1),a=n(7),s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},c=n(2);String.prototype.includes||Object.defineProperty(String.prototype,"includes",{value:function(t,e){return"number"!=typeof e&&(e=0),!(e+t.length>this.length)&&-1!==this.indexOf(t,e)}});var u={},l=null,f=function(t){return t.className=t.className||null,t.onComplete=t.onComplete||null,t.position=t.position||"top-right",t.duration=t.duration||null,t.keepOnHover=t.keepOnHover||!1,t.theme=t.theme||"toasted-primary",t.type=t.type||"default",t.containerClass=t.containerClass||null,t.fullWidth=t.fullWidth||!1,t.icon=t.icon||null,t.action=t.action||null,t.fitToScreen=t.fitToScreen||null,t.closeOnSwipe=void 0===t.closeOnSwipe||t.closeOnSwipe,t.iconPack=t.iconPack||"material",t.className&&"string"==typeof t.className&&(t.className=t.className.split(" ")),t.className||(t.className=[]),t.theme&&t.className.push(t.theme.trim()),t.type&&t.className.push(t.type),t.containerClass&&"string"==typeof t.containerClass&&(t.containerClass=t.containerClass.split(" ")),t.containerClass||(t.containerClass=[]),t.position&&t.containerClass.push(t.position.trim()),t.fullWidth&&t.containerClass.push("full-width"),t.fitToScreen&&t.containerClass.push("fit-to-screen"),u=t,t},p=function(t,e){var r=document.createElement("div");if(r.classList.add("toasted"),r.hash=c.generate(),e.className&&e.className.forEach(function(t){r.classList.add(t)}),("object"===("undefined"==typeof HTMLElement?"undefined":s(HTMLElement))?t instanceof HTMLElement:t&&"object"===(void 0===t?"undefined":s(t))&&null!==t&&1===t.nodeType&&"string"==typeof t.nodeName)?r.appendChild(t):r.innerHTML=t,d(e,r),e.closeOnSwipe){var u=new i.a(r,{prevent_default:!1});u.on("pan",function(t){var e=t.deltaX;r.classList.contains("panning")||r.classList.add("panning");var n=1-Math.abs(e/80);n<0&&(n=0),o.a.animatePanning(r,e,n)}),u.on("panend",function(t){var n=t.deltaX;Math.abs(n)>80?o.a.animatePanEnd(r,function(){"function"==typeof e.onComplete&&e.onComplete(),r.parentNode&&l.remove(r)}):(r.classList.remove("panning"),o.a.animateReset(r))})}if(Array.isArray(e.action))e.action.forEach(function(t){var e=m(t,n.i(a.a)(r,l));e&&r.appendChild(e)});else if("object"===s(e.action)){var f=m(e.action,n.i(a.a)(r,l));f&&r.appendChild(f)}return r},d=function(t,e){if(t.icon){var n=document.createElement("i");switch(n.setAttribute("aria-hidden","true"),t.iconPack){case"fontawesome":n.classList.add("fa");var r=t.icon.name?t.icon.name:t.icon;r.includes("fa-")?n.classList.add(r.trim()):n.classList.add("fa-"+r.trim());break;case"mdi":n.classList.add("mdi");var i=t.icon.name?t.icon.name:t.icon;i.includes("mdi-")?n.classList.add(i.trim()):n.classList.add("mdi-"+i.trim());break;case"custom-class":var o=t.icon.name?t.icon.name:t.icon;"string"==typeof o?o.split(" ").forEach(function(t){n.classList.add(t)}):Array.isArray(o)&&o.forEach(function(t){n.classList.add(t.trim())});break;case"callback":var a=t.icon&&t.icon instanceof Function?t.icon:null;a&&(n=a(n));break;default:n.classList.add("material-icons"),n.textContent=t.icon.name?t.icon.name:t.icon}t.icon.after&&n.classList.add("after"),h(t,n,e)}},h=function(t,e,n){t.icon&&(t.icon.after&&t.icon.name?n.appendChild(e):(t.icon.name,n.insertBefore(e,n.firstChild)))},m=function(t,e){if(!t)return null;var n=document.createElement("a");if(n.classList.add("action"),n.classList.add("ripple"),t.text&&(n.text=t.text),t.href&&(n.href=t.href),t.target&&(n.target=t.target),t.icon){n.classList.add("icon");var r=document.createElement("i");switch(u.iconPack){case"fontawesome":r.classList.add("fa"),t.icon.includes("fa-")?r.classList.add(t.icon.trim()):r.classList.add("fa-"+t.icon.trim());break;case"mdi":r.classList.add("mdi"),t.icon.includes("mdi-")?r.classList.add(t.icon.trim()):r.classList.add("mdi-"+t.icon.trim());break;case"custom-class":"string"==typeof t.icon?t.icon.split(" ").forEach(function(t){n.classList.add(t)}):Array.isArray(t.icon)&&t.icon.forEach(function(t){n.classList.add(t.trim())});break;default:r.classList.add("material-icons"),r.textContent=t.icon}n.appendChild(r)}return t.class&&("string"==typeof t.class?t.class.split(" ").forEach(function(t){n.classList.add(t)}):Array.isArray(t.class)&&t.class.forEach(function(t){n.classList.add(t.trim())})),t.push&&n.addEventListener("click",function(n){if(n.preventDefault(),!u.router)return void console.warn("[vue-toasted] : Vue Router instance is not attached. please check the docs");u.router.push(t.push),t.push.dontClose||e.goAway(0)}),t.onClick&&"function"==typeof t.onClick&&n.addEventListener("click",function(n){t.onClick&&(n.preventDefault(),t.onClick(n,e))}),n};e.a=function(t,e,r){l=t,r=f(r);var i=l.container;r.containerClass.unshift("toasted-container"),i.className!==r.containerClass.join(" ")&&(i.className="",r.containerClass.forEach(function(t){i.classList.add(t)}));var s=p(e,r);e&&i.appendChild(s),s.style.opacity=0,o.a.animateIn(s);var c=r.duration,u=void 0;if(null!==c){var d=function(){return setInterval(function(){null===s.parentNode&&window.clearInterval(u),s.classList.contains("panning")||(c-=20),c<=0&&(o.a.animateOut(s,function(){"function"==typeof r.onComplete&&r.onComplete(),s.parentNode&&l.remove(s)}),window.clearInterval(u))},20)};u=d(),r.keepOnHover&&(s.addEventListener("mouseover",function(){window.clearInterval(u)}),s.addEventListener("mouseout",function(){u=d()}))}return n.i(a.a)(s,l)}},function(t,e,n){e=t.exports=n(10)(),e.push([t.i,".toasted{padding:0 20px}.toasted.rounded{border-radius:24px}.toasted .primary,.toasted.toasted-primary{border-radius:2px;min-height:38px;line-height:1.1em;background-color:#353535;padding:6px 20px;font-size:15px;font-weight:300;color:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24)}.toasted .primary.success,.toasted.toasted-primary.success{background:#4caf50}.toasted .primary.error,.toasted.toasted-primary.error{background:#f44336}.toasted .primary.info,.toasted.toasted-primary.info{background:#3f51b5}.toasted .primary .action,.toasted.toasted-primary .action{color:#a1c2fa}.toasted.bubble{border-radius:30px;min-height:38px;line-height:1.1em;background-color:#ff7043;padding:0 20px;font-size:15px;font-weight:300;color:#fff;box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24)}.toasted.bubble.success{background:#4caf50}.toasted.bubble.error{background:#f44336}.toasted.bubble.info{background:#3f51b5}.toasted.bubble .action{color:#8e2b0c}.toasted.outline{border-radius:30px;min-height:38px;line-height:1.1em;background-color:#fff;border:1px solid #676767;padding:0 20px;font-size:15px;color:#676767;box-shadow:0 1px 3px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.24);font-weight:700}.toasted.outline.success{color:#4caf50;border-color:#4caf50}.toasted.outline.error{color:#f44336;border-color:#f44336}.toasted.outline.info{color:#3f51b5;border-color:#3f51b5}.toasted.outline .action{color:#607d8b}.toasted-container{position:fixed;z-index:10000}.toasted-container,.toasted-container.full-width{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column}.toasted-container.full-width{max-width:86%;width:100%}.toasted-container.full-width.fit-to-screen{min-width:100%}.toasted-container.full-width.fit-to-screen .toasted:first-child{margin-top:0}.toasted-container.full-width.fit-to-screen.top-right{top:0;right:0}.toasted-container.full-width.fit-to-screen.top-left{top:0;left:0}.toasted-container.full-width.fit-to-screen.top-center{top:0;left:0;-webkit-transform:translateX(0);transform:translateX(0)}.toasted-container.full-width.fit-to-screen.bottom-right{right:0;bottom:0}.toasted-container.full-width.fit-to-screen.bottom-left{left:0;bottom:0}.toasted-container.full-width.fit-to-screen.bottom-center{left:0;bottom:0;-webkit-transform:translateX(0);transform:translateX(0)}.toasted-container.top-right{top:10%;right:7%}.toasted-container.top-left{top:10%;left:7%}.toasted-container.top-center{top:10%;left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.toasted-container.bottom-right{right:5%;bottom:7%}.toasted-container.bottom-left{left:5%;bottom:7%}.toasted-container.bottom-center{left:50%;-webkit-transform:translateX(-50%);transform:translateX(-50%);bottom:7%}.toasted-container.bottom-left .toasted,.toasted-container.top-left .toasted{float:left}.toasted-container.bottom-right .toasted,.toasted-container.top-right .toasted{float:right}.toasted-container .toasted{top:35px;width:auto;clear:both;margin-top:10px;position:relative;max-width:100%;height:auto;word-break:normal;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:justify;justify-content:space-between;box-sizing:inherit}.toasted-container .toasted .fa,.toasted-container .toasted .fab,.toasted-container .toasted .far,.toasted-container .toasted .fas,.toasted-container .toasted .material-icons,.toasted-container .toasted .mdi{margin-right:.5rem;margin-left:-.4rem}.toasted-container .toasted .fa.after,.toasted-container .toasted .fab.after,.toasted-container .toasted .far.after,.toasted-container .toasted .fas.after,.toasted-container .toasted .material-icons.after,.toasted-container .toasted .mdi.after{margin-left:.5rem;margin-right:-.4rem}.toasted-container .toasted .action{text-decoration:none;font-size:.8rem;padding:8px;margin:5px -7px 5px 7px;border-radius:3px;text-transform:uppercase;letter-spacing:.03em;font-weight:600;cursor:pointer}.toasted-container .toasted .action.icon{padding:4px;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center}.toasted-container .toasted .action.icon .fa,.toasted-container .toasted .action.icon .material-icons,.toasted-container .toasted .action.icon .mdi{margin-right:0;margin-left:4px}.toasted-container .toasted .action.icon:hover{text-decoration:none}.toasted-container .toasted .action:hover{text-decoration:underline}@media only screen and (max-width:600px){.toasted-container{min-width:100%}.toasted-container .toasted:first-child{margin-top:0}.toasted-container.top-right{top:0;right:0}.toasted-container.top-left{top:0;left:0}.toasted-container.top-center{top:0;left:0;-webkit-transform:translateX(0);transform:translateX(0)}.toasted-container.bottom-right{right:0;bottom:0}.toasted-container.bottom-left{left:0;bottom:0}.toasted-container.bottom-center{left:0;bottom:0;-webkit-transform:translateX(0);transform:translateX(0)}.toasted-container.bottom-center,.toasted-container.top-center{-ms-flex-align:stretch!important;align-items:stretch!important}.toasted-container.bottom-left .toasted,.toasted-container.bottom-right .toasted,.toasted-container.top-left .toasted,.toasted-container.top-right .toasted{float:none}.toasted-container .toasted{border-radius:0}}",""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var n=this[e];n[2]?t.push("@media "+n[2]+"{"+n[1]+"}"):t.push(n[1])}return t.join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},i=0;i<this.length;i++){var o=this[i][0];"number"==typeof o&&(r[o]=!0)}for(i=0;i<e.length;i++){var a=e[i];"number"==typeof a[0]&&r[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),t.push(a))}},t}},function(t,e,n){"use strict";function r(t,e){if(void 0===t||null===t)throw new TypeError("Cannot convert first argument to object");for(var n=Object(t),r=1;r<arguments.length;r++){var i=arguments[r];if(void 0!==i&&null!==i)for(var o=Object.keys(Object(i)),a=0,s=o.length;a<s;a++){var c=o[a],u=Object.getOwnPropertyDescriptor(i,c);void 0!==u&&u.enumerable&&(n[c]=i[c])}}return n}function i(){Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:r})}t.exports={assign:r,polyfill:i}},function(t,e,n){var r;!function(i,o,a,s){"use strict";function c(t,e,n){return setTimeout(d(t,n),e)}function u(t,e,n){return!!Array.isArray(t)&&(l(t,n[e],n),!0)}function l(t,e,n){var r;if(t)if(t.forEach)t.forEach(e,n);else if(t.length!==s)for(r=0;r<t.length;)e.call(n,t[r],r,t),r++;else for(r in t)t.hasOwnProperty(r)&&e.call(n,t[r],r,t)}function f(t,e,n){var r="DEPRECATED METHOD: "+e+"\n"+n+" AT \n";return function(){var e=new Error("get-stack-trace"),n=e&&e.stack?e.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",o=i.console&&(i.console.warn||i.console.log);return o&&o.call(i.console,r,n),t.apply(this,arguments)}}function p(t,e,n){var r,i=e.prototype;r=t.prototype=Object.create(i),r.constructor=t,r._super=i,n&&ht(r,n)}function d(t,e){return function(){return t.apply(e,arguments)}}function h(t,e){return typeof t==gt?t.apply(e?e[0]||s:s,e):t}function m(t,e){return t===s?e:t}function v(t,e,n){l(x(e),function(e){t.addEventListener(e,n,!1)})}function g(t,e,n){l(x(e),function(e){t.removeEventListener(e,n,!1)})}function y(t,e){for(;t;){if(t==e)return!0;t=t.parentNode}return!1}function b(t,e){return t.indexOf(e)>-1}function x(t){return t.trim().split(/\s+/g)}function T(t,e,n){if(t.indexOf&&!n)return t.indexOf(e);for(var r=0;r<t.length;){if(n&&t[r][n]==e||!n&&t[r]===e)return r;r++}return-1}function w(t){return Array.prototype.slice.call(t,0)}function E(t,e,n){for(var r=[],i=[],o=0;o<t.length;){var a=e?t[o][e]:t[o];T(i,a)<0&&r.push(t[o]),i[o]=a,o++}return n&&(r=e?r.sort(function(t,n){return t[e]>n[e]}):r.sort()),r}function C(t,e){for(var n,r,i=e[0].toUpperCase()+e.slice(1),o=0;o<mt.length;){if(n=mt[o],(r=n?n+i:e)in t)return r;o++}return s}function S(){return Et++}function O(t){var e=t.ownerDocument||t;return e.defaultView||e.parentWindow||i}function A(t,e){var n=this;this.manager=t,this.callback=e,this.element=t.element,this.target=t.options.inputTarget,this.domHandler=function(e){h(t.options.enable,[t])&&n.handler(e)},this.init()}function I(t){var e=t.options.inputClass;return new(e||(Ot?H:At?W:St?B:Y))(t,M)}function M(t,e,n){var r=n.pointers.length,i=n.changedPointers.length,o=e&Mt&&r-i==0,a=e&(Pt|Lt)&&r-i==0;n.isFirst=!!o,n.isFinal=!!a,o&&(t.session={}),n.eventType=e,k(t,n),t.emit("hammer.input",n),t.recognize(n),t.session.prevInput=n}function k(t,e){var n=t.session,r=e.pointers,i=r.length;n.firstInput||(n.firstInput=j(e)),i>1&&!n.firstMultiple?n.firstMultiple=j(e):1===i&&(n.firstMultiple=!1);var o=n.firstInput,a=n.firstMultiple,s=a?a.center:o.center,c=e.center=N(r);e.timeStamp=xt(),e.deltaTime=e.timeStamp-o.timeStamp,e.angle=R(s,c),e.distance=D(s,c),P(n,e),e.offsetDirection=X(e.deltaX,e.deltaY);var u=_(e.deltaTime,e.deltaX,e.deltaY);e.overallVelocityX=u.x,e.overallVelocityY=u.y,e.overallVelocity=bt(u.x)>bt(u.y)?u.x:u.y,e.scale=a?z(a.pointers,r):1,e.rotation=a?F(a.pointers,r):0,e.maxPointers=n.prevInput?e.pointers.length>n.prevInput.maxPointers?e.pointers.length:n.prevInput.maxPointers:e.pointers.length,L(n,e);var l=t.element;y(e.srcEvent.target,l)&&(l=e.srcEvent.target),e.target=l}function P(t,e){var n=e.center,r=t.offsetDelta||{},i=t.prevDelta||{},o=t.prevInput||{};e.eventType!==Mt&&o.eventType!==Pt||(i=t.prevDelta={x:o.deltaX||0,y:o.deltaY||0},r=t.offsetDelta={x:n.x,y:n.y}),e.deltaX=i.x+(n.x-r.x),e.deltaY=i.y+(n.y-r.y)}function L(t,e){var n,r,i,o,a=t.lastInterval||e,c=e.timeStamp-a.timeStamp;if(e.eventType!=Lt&&(c>It||a.velocity===s)){var u=e.deltaX-a.deltaX,l=e.deltaY-a.deltaY,f=_(c,u,l);r=f.x,i=f.y,n=bt(f.x)>bt(f.y)?f.x:f.y,o=X(u,l),t.lastInterval=e}else n=a.velocity,r=a.velocityX,i=a.velocityY,o=a.direction;e.velocity=n,e.velocityX=r,e.velocityY=i,e.direction=o}function j(t){for(var e=[],n=0;n<t.pointers.length;)e[n]={clientX:yt(t.pointers[n].clientX),clientY:yt(t.pointers[n].clientY)},n++;return{timeStamp:xt(),pointers:e,center:N(e),deltaX:t.deltaX,deltaY:t.deltaY}}function N(t){var e=t.length;if(1===e)return{x:yt(t[0].clientX),y:yt(t[0].clientY)};for(var n=0,r=0,i=0;i<e;)n+=t[i].clientX,r+=t[i].clientY,i++;return{x:yt(n/e),y:yt(r/e)}}function _(t,e,n){return{x:e/t||0,y:n/t||0}}function X(t,e){return t===e?jt:bt(t)>=bt(e)?t<0?Nt:_t:e<0?Xt:Dt}function D(t,e,n){n||(n=Yt);var r=e[n[0]]-t[n[0]],i=e[n[1]]-t[n[1]];return Math.sqrt(r*r+i*i)}function R(t,e,n){n||(n=Yt);var r=e[n[0]]-t[n[0]],i=e[n[1]]-t[n[1]];return 180*Math.atan2(i,r)/Math.PI}function F(t,e){return R(e[1],e[0],Ht)+R(t[1],t[0],Ht)}function z(t,e){return D(e[0],e[1],Ht)/D(t[0],t[1],Ht)}function Y(){this.evEl=Vt,this.evWin=Wt,this.pressed=!1,A.apply(this,arguments)}function H(){this.evEl=$t,this.evWin=Gt,A.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function q(){this.evTarget=Qt,this.evWin=Jt,this.started=!1,A.apply(this,arguments)}function V(t,e){var n=w(t.touches),r=w(t.changedTouches);return e&(Pt|Lt)&&(n=E(n.concat(r),"identifier",!0)),[n,r]}function W(){this.evTarget=te,this.targetIds={},A.apply(this,arguments)}function U(t,e){var n=w(t.touches),r=this.targetIds;if(e&(Mt|kt)&&1===n.length)return r[n[0].identifier]=!0,[n,n];var i,o,a=w(t.changedTouches),s=[],c=this.target;if(o=n.filter(function(t){return y(t.target,c)}),e===Mt)for(i=0;i<o.length;)r[o[i].identifier]=!0,i++;for(i=0;i<a.length;)r[a[i].identifier]&&s.push(a[i]),e&(Pt|Lt)&&delete r[a[i].identifier],i++;return s.length?[E(o.concat(s),"identifier",!0),s]:void 0}function B(){A.apply(this,arguments);var t=d(this.handler,this);this.touch=new W(this.manager,t),this.mouse=new Y(this.manager,t),this.primaryTouch=null,this.lastTouches=[]}function $(t,e){t&Mt?(this.primaryTouch=e.changedPointers[0].identifier,G.call(this,e)):t&(Pt|Lt)&&G.call(this,e)}function G(t){var e=t.changedPointers[0];if(e.identifier===this.primaryTouch){var n={x:e.clientX,y:e.clientY};this.lastTouches.push(n);var r=this.lastTouches,i=function(){var t=r.indexOf(n);t>-1&&r.splice(t,1)};setTimeout(i,ee)}}function Z(t){for(var e=t.srcEvent.clientX,n=t.srcEvent.clientY,r=0;r<this.lastTouches.length;r++){var i=this.lastTouches[r],o=Math.abs(e-i.x),a=Math.abs(n-i.y);if(o<=ne&&a<=ne)return!0}return!1}function Q(t,e){this.manager=t,this.set(e)}function J(t){if(b(t,se))return se;var e=b(t,ce),n=b(t,ue);return e&&n?se:e||n?e?ce:ue:b(t,ae)?ae:oe}function K(t){this.options=ht({},this.defaults,t||{}),this.id=S(),this.manager=null,this.options.enable=m(this.options.enable,!0),this.state=fe,this.simultaneous={},this.requireFail=[]}function tt(t){return t&ve?"cancel":t&he?"end":t&de?"move":t&pe?"start":""}function et(t){return t==Dt?"down":t==Xt?"up":t==Nt?"left":t==_t?"right":""}function nt(t,e){var n=e.manager;return n?n.get(t):t}function rt(){K.apply(this,arguments)}function it(){rt.apply(this,arguments),this.pX=null,this.pY=null}function ot(){rt.apply(this,arguments)}function at(){K.apply(this,arguments),this._timer=null,this._input=null}function st(){rt.apply(this,arguments)}function ct(){rt.apply(this,arguments)}function ut(){K.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function lt(t,e){return e=e||{},e.recognizers=m(e.recognizers,lt.defaults.preset),new ft(t,e)}function ft(t,e){this.options=ht({},lt.defaults,e||{}),this.options.inputTarget=this.options.inputTarget||t,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=t,this.input=I(this),this.touchAction=new Q(this,this.options.touchAction),pt(this,!0),l(this.options.recognizers,function(t){var e=this.add(new t[0](t[1]));t[2]&&e.recognizeWith(t[2]),t[3]&&e.requireFailure(t[3])},this)}function pt(t,e){var n=t.element;if(n.style){var r;l(t.options.cssProps,function(i,o){r=C(n.style,o),e?(t.oldCssProps[r]=n.style[r],n.style[r]=i):n.style[r]=t.oldCssProps[r]||""}),e||(t.oldCssProps={})}}function dt(t,e){var n=o.createEvent("Event");n.initEvent(t,!0,!0),n.gesture=e,e.target.dispatchEvent(n)}var ht,mt=["","webkit","Moz","MS","ms","o"],vt=o.createElement("div"),gt="function",yt=Math.round,bt=Math.abs,xt=Date.now;ht="function"!=typeof Object.assign?function(t){if(t===s||null===t)throw new TypeError("Cannot convert undefined or null to object");for(var e=Object(t),n=1;n<arguments.length;n++){var r=arguments[n];if(r!==s&&null!==r)for(var i in r)r.hasOwnProperty(i)&&(e[i]=r[i])}return e}:Object.assign;var Tt=f(function(t,e,n){for(var r=Object.keys(e),i=0;i<r.length;)(!n||n&&t[r[i]]===s)&&(t[r[i]]=e[r[i]]),i++;return t},"extend","Use `assign`."),wt=f(function(t,e){return Tt(t,e,!0)},"merge","Use `assign`."),Et=1,Ct=/mobile|tablet|ip(ad|hone|od)|android/i,St="ontouchstart"in i,Ot=C(i,"PointerEvent")!==s,At=St&&Ct.test(navigator.userAgent),It=25,Mt=1,kt=2,Pt=4,Lt=8,jt=1,Nt=2,_t=4,Xt=8,Dt=16,Rt=Nt|_t,Ft=Xt|Dt,zt=Rt|Ft,Yt=["x","y"],Ht=["clientX","clientY"];A.prototype={handler:function(){},init:function(){this.evEl&&v(this.element,this.evEl,this.domHandler),this.evTarget&&v(this.target,this.evTarget,this.domHandler),this.evWin&&v(O(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&g(this.element,this.evEl,this.domHandler),this.evTarget&&g(this.target,this.evTarget,this.domHandler),this.evWin&&g(O(this.element),this.evWin,this.domHandler)}};var qt={mousedown:Mt,mousemove:kt,mouseup:Pt},Vt="mousedown",Wt="mousemove mouseup";p(Y,A,{handler:function(t){var e=qt[t.type];e&Mt&&0===t.button&&(this.pressed=!0),e&kt&&1!==t.which&&(e=Pt),this.pressed&&(e&Pt&&(this.pressed=!1),this.callback(this.manager,e,{pointers:[t],changedPointers:[t],pointerType:"mouse",srcEvent:t}))}});var Ut={pointerdown:Mt,pointermove:kt,pointerup:Pt,pointercancel:Lt,pointerout:Lt},Bt={2:"touch",3:"pen",4:"mouse",5:"kinect"},$t="pointerdown",Gt="pointermove pointerup pointercancel";i.MSPointerEvent&&!i.PointerEvent&&($t="MSPointerDown",Gt="MSPointerMove MSPointerUp MSPointerCancel"),p(H,A,{handler:function(t){var e=this.store,n=!1,r=t.type.toLowerCase().replace("ms",""),i=Ut[r],o=Bt[t.pointerType]||t.pointerType,a="touch"==o,s=T(e,t.pointerId,"pointerId");i&Mt&&(0===t.button||a)?s<0&&(e.push(t),s=e.length-1):i&(Pt|Lt)&&(n=!0),s<0||(e[s]=t,this.callback(this.manager,i,{pointers:e,changedPointers:[t],pointerType:o,srcEvent:t}),n&&e.splice(s,1))}});var Zt={touchstart:Mt,touchmove:kt,touchend:Pt,touchcancel:Lt},Qt="touchstart",Jt="touchstart touchmove touchend touchcancel";p(q,A,{handler:function(t){var e=Zt[t.type];if(e===Mt&&(this.started=!0),this.started){var n=V.call(this,t,e);e&(Pt|Lt)&&n[0].length-n[1].length==0&&(this.started=!1),this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t})}}});var Kt={touchstart:Mt,touchmove:kt,touchend:Pt,touchcancel:Lt},te="touchstart touchmove touchend touchcancel";p(W,A,{handler:function(t){var e=Kt[t.type],n=U.call(this,t,e);n&&this.callback(this.manager,e,{pointers:n[0],changedPointers:n[1],pointerType:"touch",srcEvent:t})}});var ee=2500,ne=25;p(B,A,{handler:function(t,e,n){var r="touch"==n.pointerType,i="mouse"==n.pointerType;if(!(i&&n.sourceCapabilities&&n.sourceCapabilities.firesTouchEvents)){if(r)$.call(this,e,n);else if(i&&Z.call(this,n))return;this.callback(t,e,n)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var re=C(vt.style,"touchAction"),ie=re!==s,oe="auto",ae="manipulation",se="none",ce="pan-x",ue="pan-y",le=function(){if(!ie)return!1;var t={},e=i.CSS&&i.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(n){t[n]=!e||i.CSS.supports("touch-action",n)}),t}();Q.prototype={set:function(t){"compute"==t&&(t=this.compute()),ie&&this.manager.element.style&&le[t]&&(this.manager.element.style[re]=t),this.actions=t.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var t=[];return l(this.manager.recognizers,function(e){h(e.options.enable,[e])&&(t=t.concat(e.getTouchAction()))}),J(t.join(" "))},preventDefaults:function(t){var e=t.srcEvent,n=t.offsetDirection;if(this.manager.session.prevented)return void e.preventDefault();var r=this.actions,i=b(r,se)&&!le[se],o=b(r,ue)&&!le[ue],a=b(r,ce)&&!le[ce];if(i){var s=1===t.pointers.length,c=t.distance<2,u=t.deltaTime<250;if(s&&c&&u)return}return a&&o?void 0:i||o&&n&Rt||a&&n&Ft?this.preventSrc(e):void 0},preventSrc:function(t){this.manager.session.prevented=!0,t.preventDefault()}};var fe=1,pe=2,de=4,he=8,me=he,ve=16;K.prototype={defaults:{},set:function(t){return ht(this.options,t),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(t){if(u(t,"recognizeWith",this))return this;var e=this.simultaneous;return t=nt(t,this),e[t.id]||(e[t.id]=t,t.recognizeWith(this)),this},dropRecognizeWith:function(t){return u(t,"dropRecognizeWith",this)?this:(t=nt(t,this),delete this.simultaneous[t.id],this)},requireFailure:function(t){if(u(t,"requireFailure",this))return this;var e=this.requireFail;return t=nt(t,this),-1===T(e,t)&&(e.push(t),t.requireFailure(this)),this},dropRequireFailure:function(t){if(u(t,"dropRequireFailure",this))return this;t=nt(t,this);var e=T(this.requireFail,t);return e>-1&&this.requireFail.splice(e,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(t){return!!this.simultaneous[t.id]},emit:function(t){function e(e){n.manager.emit(e,t)}var n=this,r=this.state;r<he&&e(n.options.event+tt(r)),e(n.options.event),t.additionalEvent&&e(t.additionalEvent),r>=he&&e(n.options.event+tt(r))},tryEmit:function(t){if(this.canEmit())return this.emit(t);this.state=32},canEmit:function(){for(var t=0;t<this.requireFail.length;){if(!(this.requireFail[t].state&(32|fe)))return!1;t++}return!0},recognize:function(t){var e=ht({},t);if(!h(this.options.enable,[this,e]))return this.reset(),void(this.state=32);this.state&(me|ve|32)&&(this.state=fe),this.state=this.process(e),this.state&(pe|de|he|ve)&&this.tryEmit(e)},process:function(t){},getTouchAction:function(){},reset:function(){}},p(rt,K,{defaults:{pointers:1},attrTest:function(t){var e=this.options.pointers;return 0===e||t.pointers.length===e},process:function(t){var e=this.state,n=t.eventType,r=e&(pe|de),i=this.attrTest(t);return r&&(n&Lt||!i)?e|ve:r||i?n&Pt?e|he:e&pe?e|de:pe:32}}),p(it,rt,{defaults:{event:"pan",threshold:10,pointers:1,direction:zt},getTouchAction:function(){var t=this.options.direction,e=[];return t&Rt&&e.push(ue),t&Ft&&e.push(ce),e},directionTest:function(t){var e=this.options,n=!0,r=t.distance,i=t.direction,o=t.deltaX,a=t.deltaY;return i&e.direction||(e.direction&Rt?(i=0===o?jt:o<0?Nt:_t,n=o!=this.pX,r=Math.abs(t.deltaX)):(i=0===a?jt:a<0?Xt:Dt,n=a!=this.pY,r=Math.abs(t.deltaY))),t.direction=i,n&&r>e.threshold&&i&e.direction},attrTest:function(t){return rt.prototype.attrTest.call(this,t)&&(this.state&pe||!(this.state&pe)&&this.directionTest(t))},emit:function(t){this.pX=t.deltaX,this.pY=t.deltaY;var e=et(t.direction);e&&(t.additionalEvent=this.options.event+e),this._super.emit.call(this,t)}}),p(ot,rt,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[se]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.scale-1)>this.options.threshold||this.state&pe)},emit:function(t){if(1!==t.scale){var e=t.scale<1?"in":"out";t.additionalEvent=this.options.event+e}this._super.emit.call(this,t)}}),p(at,K,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[oe]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,r=t.distance<e.threshold,i=t.deltaTime>e.time;if(this._input=t,!r||!n||t.eventType&(Pt|Lt)&&!i)this.reset();else if(t.eventType&Mt)this.reset(),this._timer=c(function(){this.state=me,this.tryEmit()},e.time,this);else if(t.eventType&Pt)return me;return 32},reset:function(){clearTimeout(this._timer)},emit:function(t){this.state===me&&(t&&t.eventType&Pt?this.manager.emit(this.options.event+"up",t):(this._input.timeStamp=xt(),this.manager.emit(this.options.event,this._input)))}}),p(st,rt,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[se]},attrTest:function(t){return this._super.attrTest.call(this,t)&&(Math.abs(t.rotation)>this.options.threshold||this.state&pe)}}),p(ct,rt,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Rt|Ft,pointers:1},getTouchAction:function(){return it.prototype.getTouchAction.call(this)},attrTest:function(t){var e,n=this.options.direction;return n&(Rt|Ft)?e=t.overallVelocity:n&Rt?e=t.overallVelocityX:n&Ft&&(e=t.overallVelocityY),this._super.attrTest.call(this,t)&&n&t.offsetDirection&&t.distance>this.options.threshold&&t.maxPointers==this.options.pointers&&bt(e)>this.options.velocity&&t.eventType&Pt},emit:function(t){var e=et(t.offsetDirection);e&&this.manager.emit(this.options.event+e,t),this.manager.emit(this.options.event,t)}}),p(ut,K,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ae]},process:function(t){var e=this.options,n=t.pointers.length===e.pointers,r=t.distance<e.threshold,i=t.deltaTime<e.time;if(this.reset(),t.eventType&Mt&&0===this.count)return this.failTimeout();if(r&&i&&n){if(t.eventType!=Pt)return this.failTimeout();var o=!this.pTime||t.timeStamp-this.pTime<e.interval,a=!this.pCenter||D(this.pCenter,t.center)<e.posThreshold;this.pTime=t.timeStamp,this.pCenter=t.center,a&&o?this.count+=1:this.count=1,this._input=t;if(0===this.count%e.taps)return this.hasRequireFailures()?(this._timer=c(function(){this.state=me,this.tryEmit()},e.interval,this),pe):me}return 32},failTimeout:function(){return this._timer=c(function(){this.state=32},this.options.interval,this),32},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==me&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),lt.VERSION="2.0.7",lt.defaults={domEvents:!1,touchAction:"compute",enable:!0,inputTarget:null,inputClass:null,preset:[[st,{enable:!1}],[ot,{enable:!1},["rotate"]],[ct,{direction:Rt}],[it,{direction:Rt},["swipe"]],[ut],[ut,{event:"doubletap",taps:2},["tap"]],[at]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};ft.prototype={set:function(t){return ht(this.options,t),t.touchAction&&this.touchAction.update(),t.inputTarget&&(this.input.destroy(),this.input.target=t.inputTarget,this.input.init()),this},stop:function(t){this.session.stopped=t?2:1},recognize:function(t){var e=this.session;if(!e.stopped){this.touchAction.preventDefaults(t);var n,r=this.recognizers,i=e.curRecognizer;(!i||i&&i.state&me)&&(i=e.curRecognizer=null);for(var o=0;o<r.length;)n=r[o],2===e.stopped||i&&n!=i&&!n.canRecognizeWith(i)?n.reset():n.recognize(t),!i&&n.state&(pe|de|he)&&(i=e.curRecognizer=n),o++}},get:function(t){if(t instanceof K)return t;for(var e=this.recognizers,n=0;n<e.length;n++)if(e[n].options.event==t)return e[n];return null},add:function(t){if(u(t,"add",this))return this;var e=this.get(t.options.event);return e&&this.remove(e),this.recognizers.push(t),t.manager=this,this.touchAction.update(),t},remove:function(t){if(u(t,"remove",this))return this;if(t=this.get(t)){var e=this.recognizers,n=T(e,t);-1!==n&&(e.splice(n,1),this.touchAction.update())}return this},on:function(t,e){if(t!==s&&e!==s){var n=this.handlers;return l(x(t),function(t){n[t]=n[t]||[],n[t].push(e)}),this}},off:function(t,e){if(t!==s){var n=this.handlers;return l(x(t),function(t){e?n[t]&&n[t].splice(T(n[t],e),1):delete n[t]}),this}},emit:function(t,e){this.options.domEvents&&dt(t,e);var n=this.handlers[t]&&this.handlers[t].slice();if(n&&n.length){e.type=t,e.preventDefault=function(){e.srcEvent.preventDefault()};for(var r=0;r<n.length;)n[r](e),r++}},destroy:function(){this.element&&pt(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},ht(lt,{INPUT_START:Mt,INPUT_MOVE:kt,INPUT_END:Pt,INPUT_CANCEL:Lt,STATE_POSSIBLE:fe,STATE_BEGAN:pe,STATE_CHANGED:de,STATE_ENDED:he,STATE_RECOGNIZED:me,STATE_CANCELLED:ve,STATE_FAILED:32,DIRECTION_NONE:jt,DIRECTION_LEFT:Nt,DIRECTION_RIGHT:_t,DIRECTION_UP:Xt,DIRECTION_DOWN:Dt,DIRECTION_HORIZONTAL:Rt,DIRECTION_VERTICAL:Ft,DIRECTION_ALL:zt,Manager:ft,Input:A,TouchAction:Q,TouchInput:W,MouseInput:Y,PointerEventInput:H,TouchMouseInput:B,SingleTouchInput:q,Recognizer:K,AttrRecognizer:rt,Tap:ut,Pan:it,Swipe:ct,Pinch:ot,Rotate:st,Press:at,on:v,off:g,each:l,merge:wt,extend:Tt,assign:ht,inherit:p,bindFn:d,prefixed:C}),(void 0!==i?i:"undefined"!=typeof self?self:{}).Hammer=lt,(r=function(){return lt}.call(e,n,e,t))!==s&&(t.exports=r)}(window,document)},function(t,e){t.exports=function(t,e,n){for(var r=(2<<Math.log(e.length-1)/Math.LN2)-1,i=-~(1.6*r*n/e.length),o="";;)for(var a=t(i),s=i;s--;)if(o+=e[a[s]&r]||"",o.length===+n)return o}},function(t,e,n){"use strict";function r(t){var e="",n=Math.floor(.001*(Date.now()-s));return n===o?i++:(i=0,o=n),e+=a(c),e+=a(t),i>0&&(e+=a(i)),e+=a(n)}var i,o,a=n(15),s=(n(0),1567752802062),c=7;t.exports=r},function(t,e,n){"use strict";function r(t){for(var e,n=0,r="";!e;)r+=a(o,i.get(),1),e=t<Math.pow(16,n+1),n++;return r}var i=n(0),o=n(18),a=n(13);t.exports=r},function(t,e,n){"use strict";function r(e){return s.seed(e),t.exports}function i(e){return l=e,t.exports}function o(t){return void 0!==t&&s.characters(t),s.shuffled()}function a(){return c(l)}var s=n(0),c=n(14),u=n(17),l=n(20)||0;t.exports=a,t.exports.generate=a,t.exports.seed=r,t.exports.worker=i,t.exports.characters=o,t.exports.isValid=u},function(t,e,n){"use strict";function r(t){return!(!t||"string"!=typeof t||t.length<6)&&!new RegExp("[^"+i.get().replace(/[|\\{}()[\]^$+*?.-]/g,"\\$&")+"]").test(t)}var i=n(0);t.exports=r},function(t,e,n){"use strict";var r,i="object"==typeof window&&(window.crypto||window.msCrypto);r=i&&i.getRandomValues?function(t){return i.getRandomValues(new Uint8Array(t))}:function(t){for(var e=[],n=0;n<t;n++)e.push(Math.floor(256*Math.random()));return e},t.exports=r},function(t,e,n){"use strict";function r(){return(o=(9301*o+49297)%233280)/233280}function i(t){o=t}var o=1;t.exports={nextValue:r,seed:i}},function(t,e,n){"use strict";t.exports=0},function(t,e){t.exports=function(t,e,n,r){var i,o=t=t||{},a=typeof t.default;"object"!==a&&"function"!==a||(i=t,o=t.default);var s="function"==typeof o?o.options:o;if(e&&(s.render=e.render,s.staticRenderFns=e.staticRenderFns),n&&(s._scopeId=n),r){var c=Object.create(s.computed||null);Object.keys(r).forEach(function(t){var e=r[t];c[t]=function(){return e}}),s.computed=c}return{esModule:i,exports:o,options:s}}},function(t,e,n){var r=n(9);"string"==typeof r&&(r=[[t.i,r,""]]),r.locals&&(t.exports=r.locals);n(23)("df0682cc",r,!0,{})},function(t,e,n){function r(t){for(var e=0;e<t.length;e++){var n=t[e],r=l[n.id];if(r){r.refs++;for(var i=0;i<r.parts.length;i++)r.parts[i](n.parts[i]);for(;i<n.parts.length;i++)r.parts.push(o(n.parts[i]));r.parts.length>n.parts.length&&(r.parts.length=n.parts.length)}else{for(var a=[],i=0;i<n.parts.length;i++)a.push(o(n.parts[i]));l[n.id]={id:n.id,refs:1,parts:a}}}}function i(){var t=document.createElement("style");return t.type="text/css",f.appendChild(t),t}function o(t){var e,n,r=document.querySelector("style["+g+'~="'+t.id+'"]');if(r){if(h)return m;r.parentNode.removeChild(r)}if(y){var o=d++;r=p||(p=i()),e=a.bind(null,r,o,!1),n=a.bind(null,r,o,!0)}else r=i(),e=s.bind(null,r),n=function(){r.parentNode.removeChild(r)};return e(t),function(r){if(r){if(r.css===t.css&&r.media===t.media&&r.sourceMap===t.sourceMap)return;e(t=r)}else n()}}function a(t,e,n,r){var i=n?"":r.css;if(t.styleSheet)t.styleSheet.cssText=b(e,i);else{var o=document.createTextNode(i),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(o,a[e]):t.appendChild(o)}}function s(t,e){var n=e.css,r=e.media,i=e.sourceMap;if(r&&t.setAttribute("media",r),v.ssrId&&t.setAttribute(g,e.id),i&&(n+="\n/*# sourceURL="+i.sources[0]+" */",n+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(i))))+" */"),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}var c="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!c)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var u=n(24),l={},f=c&&(document.head||document.getElementsByTagName("head")[0]),p=null,d=0,h=!1,m=function(){},v=null,g="data-vue-ssr-id",y="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());t.exports=function(t,e,n,i){h=n,v=i||{};var o=u(t,e);return r(o),function(e){for(var n=[],i=0;i<o.length;i++){var a=o[i],s=l[a.id];s.refs--,n.push(s)}e?(o=u(t,e),r(o)):o=[];for(var i=0;i<n.length;i++){var s=n[i];if(0===s.refs){for(var c=0;c<s.parts.length;c++)s.parts[c]();delete l[s.id]}}}};var b=function(){var t=[];return function(e,n){return t[e]=n,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t,e){for(var n=[],r={},i=0;i<e.length;i++){var o=e[i],a=o[0],s=o[1],c=o[2],u=o[3],l={id:t+":"+i,css:s,media:c,sourceMap:u};r[a]?r[a].parts.push(l):n.push(r[a]={id:a,parts:[l]})}return n}},function(t,e){var n;n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(n=window)}t.exports=n}])});

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./resources/js/components/BroadcastingMessages.vue":
/*!**********************************************************!*\
  !*** ./resources/js/components/BroadcastingMessages.vue ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BroadcastingMessages_vue_vue_type_template_id_b7751b50___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BroadcastingMessages.vue?vue&type=template&id=b7751b50& */ "./resources/js/components/BroadcastingMessages.vue?vue&type=template&id=b7751b50&");
/* harmony import */ var _BroadcastingMessages_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BroadcastingMessages.vue?vue&type=script&lang=js& */ "./resources/js/components/BroadcastingMessages.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _BroadcastingMessages_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _BroadcastingMessages_vue_vue_type_template_id_b7751b50___WEBPACK_IMPORTED_MODULE_0__["render"],
  _BroadcastingMessages_vue_vue_type_template_id_b7751b50___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/BroadcastingMessages.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/BroadcastingMessages.vue?vue&type=script&lang=js&":
/*!***********************************************************************************!*\
  !*** ./resources/js/components/BroadcastingMessages.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BroadcastingMessages_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./BroadcastingMessages.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/BroadcastingMessages.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_BroadcastingMessages_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/BroadcastingMessages.vue?vue&type=template&id=b7751b50&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/components/BroadcastingMessages.vue?vue&type=template&id=b7751b50& ***!
  \*****************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BroadcastingMessages_vue_vue_type_template_id_b7751b50___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./BroadcastingMessages.vue?vue&type=template&id=b7751b50& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/BroadcastingMessages.vue?vue&type=template&id=b7751b50&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BroadcastingMessages_vue_vue_type_template_id_b7751b50___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_BroadcastingMessages_vue_vue_type_template_id_b7751b50___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/CycleSelection.vue":
/*!****************************************************!*\
  !*** ./resources/js/components/CycleSelection.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CycleSelection_vue_vue_type_template_id_0d3a191e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CycleSelection.vue?vue&type=template&id=0d3a191e& */ "./resources/js/components/CycleSelection.vue?vue&type=template&id=0d3a191e&");
/* harmony import */ var _CycleSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CycleSelection.vue?vue&type=script&lang=js& */ "./resources/js/components/CycleSelection.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _CycleSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CycleSelection_vue_vue_type_template_id_0d3a191e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CycleSelection_vue_vue_type_template_id_0d3a191e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/CycleSelection.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/CycleSelection.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/CycleSelection.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CycleSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./CycleSelection.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/CycleSelection.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CycleSelection_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/CycleSelection.vue?vue&type=template&id=0d3a191e&":
/*!***********************************************************************************!*\
  !*** ./resources/js/components/CycleSelection.vue?vue&type=template&id=0d3a191e& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CycleSelection_vue_vue_type_template_id_0d3a191e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./CycleSelection.vue?vue&type=template&id=0d3a191e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/CycleSelection.vue?vue&type=template&id=0d3a191e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CycleSelection_vue_vue_type_template_id_0d3a191e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CycleSelection_vue_vue_type_template_id_0d3a191e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/DataFilterBox.vue":
/*!***************************************************!*\
  !*** ./resources/js/components/DataFilterBox.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DataFilterBox_vue_vue_type_template_id_4200b5ce_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true& */ "./resources/js/components/DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true&");
/* harmony import */ var _DataFilterBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DataFilterBox.vue?vue&type=script&lang=js& */ "./resources/js/components/DataFilterBox.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _DataFilterBox_vue_vue_type_style_index_0_id_4200b5ce_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true& */ "./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _DataFilterBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DataFilterBox_vue_vue_type_template_id_4200b5ce_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DataFilterBox_vue_vue_type_template_id_4200b5ce_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "4200b5ce",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/DataFilterBox.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/DataFilterBox.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/components/DataFilterBox.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./DataFilterBox.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true&":
/*!*************************************************************************************************************!*\
  !*** ./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true& ***!
  \*************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_style_index_0_id_4200b5ce_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--11-2!../../../node_modules/sass-loader/dist/cjs.js??ref--11-3!../../../node_modules/vue-loader/lib??vue-loader-options!./DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=style&index=0&id=4200b5ce&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_style_index_0_id_4200b5ce_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_style_index_0_id_4200b5ce_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_style_index_0_id_4200b5ce_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_style_index_0_id_4200b5ce_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_style_index_0_id_4200b5ce_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/components/DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/components/DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_template_id_4200b5ce_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/DataFilterBox.vue?vue&type=template&id=4200b5ce&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_template_id_4200b5ce_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DataFilterBox_vue_vue_type_template_id_4200b5ce_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/ErrorPage.vue":
/*!***********************************************!*\
  !*** ./resources/js/components/ErrorPage.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ErrorPage_vue_vue_type_template_id_2bc5db5c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ErrorPage.vue?vue&type=template&id=2bc5db5c& */ "./resources/js/components/ErrorPage.vue?vue&type=template&id=2bc5db5c&");
/* harmony import */ var _ErrorPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ErrorPage.vue?vue&type=script&lang=js& */ "./resources/js/components/ErrorPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ErrorPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ErrorPage_vue_vue_type_template_id_2bc5db5c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ErrorPage_vue_vue_type_template_id_2bc5db5c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/ErrorPage.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/ErrorPage.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/components/ErrorPage.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ErrorPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ErrorPage.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ErrorPage.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ErrorPage_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/ErrorPage.vue?vue&type=template&id=2bc5db5c&":
/*!******************************************************************************!*\
  !*** ./resources/js/components/ErrorPage.vue?vue&type=template&id=2bc5db5c& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ErrorPage_vue_vue_type_template_id_2bc5db5c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./ErrorPage.vue?vue&type=template&id=2bc5db5c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ErrorPage.vue?vue&type=template&id=2bc5db5c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ErrorPage_vue_vue_type_template_id_2bc5db5c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ErrorPage_vue_vue_type_template_id_2bc5db5c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/LoaderComponent.vue":
/*!*****************************************************!*\
  !*** ./resources/js/components/LoaderComponent.vue ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LoaderComponent_vue_vue_type_template_id_0ccf4ce2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LoaderComponent.vue?vue&type=template&id=0ccf4ce2& */ "./resources/js/components/LoaderComponent.vue?vue&type=template&id=0ccf4ce2&");
/* harmony import */ var _LoaderComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./LoaderComponent.vue?vue&type=script&lang=js& */ "./resources/js/components/LoaderComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _LoaderComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _LoaderComponent_vue_vue_type_template_id_0ccf4ce2___WEBPACK_IMPORTED_MODULE_0__["render"],
  _LoaderComponent_vue_vue_type_template_id_0ccf4ce2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/LoaderComponent.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/LoaderComponent.vue?vue&type=script&lang=js&":
/*!******************************************************************************!*\
  !*** ./resources/js/components/LoaderComponent.vue?vue&type=script&lang=js& ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoaderComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./LoaderComponent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/LoaderComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_LoaderComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/LoaderComponent.vue?vue&type=template&id=0ccf4ce2&":
/*!************************************************************************************!*\
  !*** ./resources/js/components/LoaderComponent.vue?vue&type=template&id=0ccf4ce2& ***!
  \************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LoaderComponent_vue_vue_type_template_id_0ccf4ce2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./LoaderComponent.vue?vue&type=template&id=0ccf4ce2& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/LoaderComponent.vue?vue&type=template&id=0ccf4ce2&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LoaderComponent_vue_vue_type_template_id_0ccf4ce2___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_LoaderComponent_vue_vue_type_template_id_0ccf4ce2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/ModalFade.vue":
/*!***********************************************!*\
  !*** ./resources/js/components/ModalFade.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ModalFade_vue_vue_type_template_id_7abe446e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ModalFade.vue?vue&type=template&id=7abe446e& */ "./resources/js/components/ModalFade.vue?vue&type=template&id=7abe446e&");
/* harmony import */ var _ModalFade_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ModalFade.vue?vue&type=script&lang=js& */ "./resources/js/components/ModalFade.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ModalFade_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ModalFade_vue_vue_type_template_id_7abe446e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ModalFade_vue_vue_type_template_id_7abe446e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/ModalFade.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/ModalFade.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/components/ModalFade.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalFade_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./ModalFade.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ModalFade.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalFade_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/ModalFade.vue?vue&type=template&id=7abe446e&":
/*!******************************************************************************!*\
  !*** ./resources/js/components/ModalFade.vue?vue&type=template&id=7abe446e& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalFade_vue_vue_type_template_id_7abe446e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./ModalFade.vue?vue&type=template&id=7abe446e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/ModalFade.vue?vue&type=template&id=7abe446e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalFade_vue_vue_type_template_id_7abe446e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ModalFade_vue_vue_type_template_id_7abe446e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/NoDataToShow.vue":
/*!**************************************************!*\
  !*** ./resources/js/components/NoDataToShow.vue ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _NoDataToShow_vue_vue_type_template_id_16817924___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NoDataToShow.vue?vue&type=template&id=16817924& */ "./resources/js/components/NoDataToShow.vue?vue&type=template&id=16817924&");
/* harmony import */ var _NoDataToShow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NoDataToShow.vue?vue&type=script&lang=js& */ "./resources/js/components/NoDataToShow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _NoDataToShow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _NoDataToShow_vue_vue_type_template_id_16817924___WEBPACK_IMPORTED_MODULE_0__["render"],
  _NoDataToShow_vue_vue_type_template_id_16817924___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/NoDataToShow.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/NoDataToShow.vue?vue&type=script&lang=js&":
/*!***************************************************************************!*\
  !*** ./resources/js/components/NoDataToShow.vue?vue&type=script&lang=js& ***!
  \***************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NoDataToShow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./NoDataToShow.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/NoDataToShow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NoDataToShow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/NoDataToShow.vue?vue&type=template&id=16817924&":
/*!*********************************************************************************!*\
  !*** ./resources/js/components/NoDataToShow.vue?vue&type=template&id=16817924& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NoDataToShow_vue_vue_type_template_id_16817924___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./NoDataToShow.vue?vue&type=template&id=16817924& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/NoDataToShow.vue?vue&type=template&id=16817924&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NoDataToShow_vue_vue_type_template_id_16817924___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_NoDataToShow_vue_vue_type_template_id_16817924___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/SidebarComponent.vue":
/*!******************************************************!*\
  !*** ./resources/js/components/SidebarComponent.vue ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _SidebarComponent_vue_vue_type_template_id_54833a28___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SidebarComponent.vue?vue&type=template&id=54833a28& */ "./resources/js/components/SidebarComponent.vue?vue&type=template&id=54833a28&");
/* harmony import */ var _SidebarComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./SidebarComponent.vue?vue&type=script&lang=js& */ "./resources/js/components/SidebarComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _SidebarComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _SidebarComponent_vue_vue_type_template_id_54833a28___WEBPACK_IMPORTED_MODULE_0__["render"],
  _SidebarComponent_vue_vue_type_template_id_54833a28___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/SidebarComponent.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/SidebarComponent.vue?vue&type=script&lang=js&":
/*!*******************************************************************************!*\
  !*** ./resources/js/components/SidebarComponent.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SidebarComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./SidebarComponent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SidebarComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SidebarComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/SidebarComponent.vue?vue&type=template&id=54833a28&":
/*!*************************************************************************************!*\
  !*** ./resources/js/components/SidebarComponent.vue?vue&type=template&id=54833a28& ***!
  \*************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SidebarComponent_vue_vue_type_template_id_54833a28___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./SidebarComponent.vue?vue&type=template&id=54833a28& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/SidebarComponent.vue?vue&type=template&id=54833a28&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SidebarComponent_vue_vue_type_template_id_54833a28___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_SidebarComponent_vue_vue_type_template_id_54833a28___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/components/TableComponent.vue":
/*!****************************************************!*\
  !*** ./resources/js/components/TableComponent.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TableComponent_vue_vue_type_template_id_8554570c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TableComponent.vue?vue&type=template&id=8554570c& */ "./resources/js/components/TableComponent.vue?vue&type=template&id=8554570c&");
/* harmony import */ var _TableComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TableComponent.vue?vue&type=script&lang=js& */ "./resources/js/components/TableComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _TableComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _TableComponent_vue_vue_type_template_id_8554570c___WEBPACK_IMPORTED_MODULE_0__["render"],
  _TableComponent_vue_vue_type_template_id_8554570c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/components/TableComponent.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/components/TableComponent.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/components/TableComponent.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TableComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./TableComponent.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/TableComponent.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_TableComponent_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/components/TableComponent.vue?vue&type=template&id=8554570c&":
/*!***********************************************************************************!*\
  !*** ./resources/js/components/TableComponent.vue?vue&type=template&id=8554570c& ***!
  \***********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TableComponent_vue_vue_type_template_id_8554570c___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./TableComponent.vue?vue&type=template&id=8554570c& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/components/TableComponent.vue?vue&type=template&id=8554570c&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TableComponent_vue_vue_type_template_id_8554570c___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TableComponent_vue_vue_type_template_id_8554570c___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/helpers/constants.js":
/*!*******************************************!*\
  !*** ./resources/js/helpers/constants.js ***!
  \*******************************************/
/*! exports provided: CUSTOMERS_TABLE_HEADS, DM_CUSTOMERS_HEADS, COACH_REPORT, ProductWithLader, ProductWithRate, lader_of_adaption, visit_actions, visitTypes */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CUSTOMERS_TABLE_HEADS", function() { return CUSTOMERS_TABLE_HEADS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DM_CUSTOMERS_HEADS", function() { return DM_CUSTOMERS_HEADS; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "COACH_REPORT", function() { return COACH_REPORT; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProductWithLader", function() { return ProductWithLader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProductWithRate", function() { return ProductWithRate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lader_of_adaption", function() { return lader_of_adaption; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "visit_actions", function() { return visit_actions; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "visitTypes", function() { return visitTypes; });
/**
 * customers table heads scheme
 *
 *
 */
var CUSTOMERS_TABLE_HEADS = [{
  title: "Name",
  name: "name"
}, {
  title: "Specialty",
  name: "specialty"
}, {
  title: "Title",
  name: "title"
}, {
  title: "Workplace",
  name: "workplace"
}, {
  title: "Param",
  name: "parameter"
}, {
  title: "Current Freq.",
  name: "current_freq"
}, {
  title: "Next Freq.",
  name: "next_freq"
}, {
  title: "Plans",
  name: "plans"
}, {
  title: "Visits",
  name: "reports"
}];
var DM_CUSTOMERS_HEADS = [{
  title: "ID",
  name: "id"
}, {
  title: "Area",
  name: "area"
}, {
  title: "Brick",
  name: "brick"
}, {
  title: "Name",
  name: "name"
}, {
  title: "Specialty",
  name: "specialty"
}, {
  title: "Parameters",
  name: "parameter"
}, {
  title: "Current Freq.",
  name: "current_freq"
}, {
  title: "Next Freq.",
  name: "next_freq"
}, {
  title: 'Plans',
  name: 'plans'
}, {
  title: "Reports",
  name: "reports"
}];
var COACH_REPORT = {
  "Pre-call Planning": {
    "Review notes, call history,prescribing information and the profile for each Customer prior": "",
    "Sets pre-call objectives per product per customer": "",
    "Pre-plans a customized opening, prob responses for expected objection and close for the call": ""
  },
  "Opening": {
    "Results in the customer giving full and undivided attention for FSR": "",
    "Is less than one minute": "",
    "Applies information from pervious call": ""
  },
  "Initial Probe": {
    "Uses direct and indirect questions to verify customer needs,concerns and buying habits": "",
    "Selects the right questions for the customer at the proper time during the call": "",
    "Engages customer in dialogue and understands non verbal communications skills": ""
  },
  "Promotional Plan": {
    "Communicates product knowledge in response to customer cue": "",
    "Delivers key product messages according to market strategy": "",
    "Reinforce product message using references and visual": "",
    "Uses knowledge of competitive product information to compare": ""
  },
  "Handling of Objections": {
    "Listens actively to customer objection with no interruptions": "",
    "Understands the type of objection and clarifies the customer need": "",
    "Responds smartly, covers the customer need and check for understand": ""
  },
  "Close": {
    "Reviews uses information and summarizes with agreed upon points": "",
    "Asks for action-oriented commitment": ""
  },
  "Post Call Analysis": {
    "Analyzes new information to determine next objective": "",
    "provides all information on time and in a legible manner": ""
  }
};
var ProductWithLader = [{
  title: 'Product 1',
  name: 'products.0.name'
}, {
  title: 'Product 1 lader of adaption',
  name: 'products.0.lader'
}, {
  title: 'Product 1 action',
  name: 'products.0.action'
}, {
  title: 'Product 1 competitor',
  name: 'products.0.competitor'
}, {
  title: 'Product 2',
  name: 'products.1.name'
}, {
  title: 'Product 2 lader of adaption',
  name: 'products.1.lader'
}, {
  title: 'Product 2 action',
  name: 'products.1.action'
}, {
  title: 'Product 2 competitor',
  name: 'products.1.competitor'
}, {
  title: 'Product 3',
  name: 'products.2.name'
}, {
  title: 'Product 3 lader of adaption',
  name: 'products.2.lader'
}, {
  title: 'Product 3 action',
  name: 'products.2.action'
}, {
  title: 'Product 3 competitor',
  name: 'products.2.competitor'
}, {
  title: 'Product 4',
  name: 'products.3.name'
}, {
  title: 'Product 4 lader of adaption',
  name: 'products.3.lader'
}, {
  title: 'Product 4 action',
  name: 'products.3.action'
}, {
  title: 'Product 4 competitor',
  name: 'products.3.competitor'
}];
var ProductWithRate = [{
  title: 'Product 1',
  name: 'products.0.name'
}, {
  title: 'Product 1 Rate',
  name: 'products.0.rate'
}, {
  title: 'Product 1 competitor',
  name: 'products.0.competitor'
}, {
  title: 'Product 1 competitor_rate',
  name: 'products.0.competitor_rate'
}, {
  title: 'Product 2',
  name: 'products.1.name'
}, {
  title: 'Product 2 Rate',
  name: 'products.1.rate'
}, {
  title: 'Product 2 competitor',
  name: 'products.1.competitor'
}, {
  title: 'Product 2 competitor_rate',
  name: 'products.1.competitor_rate'
}, {
  title: 'Product 3',
  name: 'products.2.name'
}, {
  title: 'Product 3 Rate',
  name: 'products.2.rate'
}, {
  title: 'Product 3 competitor',
  name: 'products.2.competitor'
}, {
  title: 'Product 3 competitor_rate',
  name: 'products.2.competitor_rate'
}, {
  title: 'Product 4',
  name: 'products.3.name'
}, {
  title: 'Product 4 Rate',
  name: 'products.3.rate'
}, {
  title: 'Product 4 competitor',
  name: 'products.3.competitor'
}, {
  title: 'Product 4 competitor_rate',
  name: 'products.3.competitor_rate'
}];
var lader_of_adaption = ["Never heard", "Aware and not use", "Tried in a few Rx", "Sharing with competitor", "2nd line Rx", "1st line Rx", "1st in all Rx", "Advocator"];
var visit_actions = ["Remind message", "Finding new indication", "Competitor attack", "Thanking visit", "Sharpen Commitment", "Demonstrate a new message", "Handle Objections", "Make a deal", "Finding new needs"];
var visitTypes = ["pm face to face", "am face to face", "sample visit", "double visit"];

/***/ }),

/***/ "./resources/js/helpers/date-helpers.js":
/*!**********************************************!*\
  !*** ./resources/js/helpers/date-helpers.js ***!
  \**********************************************/
/*! exports provided: Calendar */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Calendar", function() { return Calendar; });
var Calendar = function Calendar(date) {
  if (undefined === date) {
    date = new Date();
  }

  this.date = new Date(date);
  this.day = this.date.getDate();
  this.month = this.date.getMonth() + 1;
  this.year = this.date.getFullYear();

  var createCalendarInstance = function createCalendarInstance(year, month, day) {
    var date = new Date(year, month, day);
    return new Calendar(date);
  };

  this.subtract = function (v) {
    var diff = this.day - v;
    return createCalendarInstance(this.year, this.month - 1, diff);
  };

  this.toString = function () {
    return "".concat(this.year, "-").concat(this.month.toString().padStart(2, 0), "-").concat(this.day.toString().padStart(2, 0));
  };
};

/***/ }),

/***/ "./resources/js/helpers/helpers.js":
/*!*****************************************!*\
  !*** ./resources/js/helpers/helpers.js ***!
  \*****************************************/
/*! exports provided: ObjectNotation, filterData, sortBy, sortDates, ExportToExcel, filterByDate, filterBy, checkerSelect */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ObjectNotation", function() { return ObjectNotation; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterData", function() { return filterData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortBy", function() { return sortBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "sortDates", function() { return sortDates; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ExportToExcel", function() { return ExportToExcel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterByDate", function() { return filterByDate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "filterBy", function() { return filterBy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "checkerSelect", function() { return checkerSelect; });
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
var ObjectNotation = function ObjectNotation(container, key) {
  var $default = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  /** regular expression test */
  var test = /\./gm;
  /** matches in key */

  var matches = key.match(test);
  /**
   * if not matches
   * it will return container.key if is not equal
   * to undefined
   * else it will return null
   */

  if (!matches) {
    if (container[key] !== undefined) {
      if (container[key] === null || container[key] === '') {
        return $default;
      }

      return container[key];
    }

    return $default;
  }
  /**
   * splitting key
   *
   * forming array of notation levels
   */


  var parts = key.split(".");
  /**
   * set key at position 0 as a parent item
   */

  var parentItem = container[parts[0]];
  /**
   * shifting to next position
   */

  parts.shift();
  /**
   * if parent item exists
   */

  if (parentItem !== undefined && parentItem !== null) {
    var _joined = parts.join(".");

    return ObjectNotation(parentItem, _joined, $default);
  }

  return $default;
};
/**
 * filter data the given data by the given parameter|s
 *
 *
 *
 * @param {array} data
 * @param {string|array} param [parameter of filter]
 * @param {CallableFunction} check [conditional function that return boolean]
 */

function filterData(data, param) {
  var check = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var res = {};

  var checkQuery = function checkQuery() {
    return true;
  };

  if (typeof check === "function") {
    checkQuery = check;
  }

  for (var i in data) {
    var item = data[i];

    if (checkQuery(item)) {
      if (typeof param === "string") {
        var key = ObjectNotation(item, param);

        if (!res[key]) {
          res[key] = [];
        }

        res[key].push(item);
      } else if (param instanceof Array) {
        for (var index in param) {
          var paramName = param[index];

          if (!res[paramName]) {
            res[paramName] = {};
          }

          var _key = ObjectNotation(item, paramName);

          if (!res[paramName][_key]) {
            res[paramName][_key] = [];
          }

          res[paramName][_key].push(item);
        }
      }
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

var isString = function isString(v) {
  return "string" === typeof v;
};
/**
 * check if the given type is object
 *
 * @param {mixed} v
 * @return {boolean}
 */


var isObject = function isObject(v) {
  return "object" === _typeof(v);
};
/**
 * check if the given type is number
 *
 * @param {mixed} v
 * @return {boolean}
 */


var isNumber = function isNumber(v) {
  return "number" === typeof v;
};
/**
 * check if the given type is null
 *
 * @param {mixed} v
 * @return {boolean}
 */


var isNull = function isNull(v) {
  return v === null || v === "";
};
/**
 * Exceptions
 */


var INVALID_OBJECT_TYPE_ERROR = "sortBy method used with array of objects only";
var INVALID_ITEM_TYPE_ERROR = "sortBy method compare only String and Number types";
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

  var val1 = a[item];
  var val2 = b[item];

  if (!isString(val1) && !isString(val2) && !isNumber(val1) && !isNumber(val2)) {
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


function sortBy(arr, item) {
  var dir = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "asc";
  var res = Array.from(arr);
  var factor = dir.toUpperCase() === "ASC" ? 1 : -1;
  return res.sort(function (a, b) {
    return compare(a, b, item, factor);
  });
}

function compareDates(a, b, factor) {
  a = new Date(a);
  b = new Date(b);
  var result = 0;

  if (a > b) {
    result = 1 * factor;
  }

  if (a < b) {
    result = -1 * factor;
  }

  return result;
}
/**
 * sort the given data
 *
 * @param {array} arr [data container]
 * @param {string} dir [sort direction : asc|desc]
 */


function sortDates(arr) {
  var dir = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "asc";
  var factor = 1;

  if (dir !== "asc") {
    factor = -1;
  }

  var res = arr.sort(function (a, b) {
    return compareDates(a, b, factor);
  });
  return res;
}
/**
 * Export Table to Excel
 *
 * @param {string} target
 * @param {string} filename
 * @return {void}
 */

function ExportToExcel(target) {
  var filename = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "download-file";

  var uri = "data:application/vnd.ms-excel;base64,",
      template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64 = function base64(s) {
    return window.btoa(unescape(encodeURIComponent(s)));
  },
      format = function format(s, c) {
    return s.replace(/{(\w+)}/g, function (m, p) {
      return c[p];
    });
  };

  if (target instanceof HTMLElement === false && typeof target === "string") {
    target = document.querySelector(target);
  }

  var ctx = {
    worksheet: filename + ".xls" || false,
    table: target.innerHTML
  };
  var link = document.createElement("a");
  link.download = filename + new Date().toLocaleDateString("en-gb") + ".xls";
  link.href = uri + base64(format(template, ctx));
  link.click(); //window.location.href = uri + base64(format(template, ctx))
}
var initialDateRange = {
  start: null,
  end: null
};
/**
 * filter data by the given date interval
 *
 * @param {array} data
 * @param {string} prop
 * @param {object} range
 * @return {Promise}
 */

function filterByDate(data, prop) {
  var range = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : initialDateRange;
  var start = range.start,
      end = range.end;

  if (!start && !end) {
    return data;
  }

  var result = data;

  if (start) {
    start = new Date(start).getTime();
    result = result.filter(function (item) {
      return new Date(item[prop]).getTime() >= start;
    });
  }

  if (end) {
    end = new Date(end).getTime();
    result = result.filter(function (item) {
      return new Date(item[prop]) <= end;
    });
  }

  return result;
}
/**
 * filter data by the given condition
 *
 * @param {object} data
 * @param {string} prop
 * @param {mixed} condition
 * @return {Promise}
 */

function filterBy(data, prop, condition) {
  try {
    if (condition === null) {
      return data;
    }

    return data.filter(function (item) {
      return item[prop] === condition;
    });
  } catch (e) {
    throw new Error(e.message);
  }
}
var checkerSelect = function checkerSelect() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var item = arguments.length > 1 ? arguments[1] : undefined;
  var event = arguments.length > 2 ? arguments[2] : undefined;

  if (event.target.checked) {
    if (!data.includes(item)) {
      data.push(item);
    }
  } else {
    if (data.includes(item)) {
      var index = data.indexOf(item);
      data.splice(index, 1);
    }
  }

  return data;
};

/***/ }),

/***/ "./resources/js/helpers/http-service.js":
/*!**********************************************!*\
  !*** ./resources/js/helpers/http-service.js ***!
  \**********************************************/
/*! exports provided: Api, Token, httpCall, UrlHelper, asyncDataFlow */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Api", function() { return Api; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Token", function() { return Token; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "httpCall", function() { return httpCall; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UrlHelper", function() { return UrlHelper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "asyncDataFlow", function() { return asyncDataFlow; });
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/**
 * Http service helper file
 *
 *
 */

var Api = document.getElementById('APP_API_URL').value;
var Token = document.getElementById('token').value;

var generateApiUrl = function generateApiUrl(path) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var queryString = Object.keys(query).map(function (key) {
    return "".concat(key, "=").concat(query[key]);
  }).join('&');
  return Api + path + '?api_token=' + Token + '&' + queryString;
};

var httpCall = {};
axios__WEBPACK_IMPORTED_MODULE_0___default.a;

httpCall.get = function (path, query) {
  return axios__WEBPACK_IMPORTED_MODULE_0___default.a.get(generateApiUrl(path, query));
};

httpCall.post = function (path, data) {
  data = new URLSearchParams(data);
  return axios__WEBPACK_IMPORTED_MODULE_0___default.a.post(generateApiUrl(path), data);
};

var UrlHelper = {
  base: function base() {
    var base = document.getElementById('APP_API_URL');
    base = base.value.replace('api/', '');
    return base;
  },
  generate: function generate() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    return this.base() + url;
  }
};
var asyncDataFlow = function asyncDataFlow(data, cb) {
  var promise = function promise() {
    return Promise.resolve(data);
  };

  promise().then(function (data) {
    return cb(data);
  });
};

/***/ }),

/***/ "./resources/js/helpers/response-handler.js":
/*!**************************************************!*\
  !*** ./resources/js/helpers/response-handler.js ***!
  \**************************************************/
/*! exports provided: ResponseHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ResponseHandler", function() { return ResponseHandler; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);

var ResponseHandler = {
  methods: {
    /**
     * handle ajax calls response
     *
     *
     * @param {object} data
     * @param {CallableFunction} onSuccess
     * @param {CallableFunction} onErr
     */
    handleResponse: function handleResponse(data) {
      var onSuccess = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var onErr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (data.code === 400 || data.code === 204 || data.code === 409) {
        Object.keys(data.data).forEach(function (key) {
          var errors = data.data[key];
          errors.forEach(function (err) {
            vue__WEBPACK_IMPORTED_MODULE_0___default.a.toasted.show(err, {
              icon: 'exclamation',
              duration: 5000,
              type: 'error'
            });

            if (onErr && typeof onErr === 'function') {
              onErr(data);
            }
          });
        });
      } else {
        vue__WEBPACK_IMPORTED_MODULE_0___default.a.toasted.show(data.message, {
          type: 'success',
          icon: 'check'
        });

        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(data);
        }
      }
    }
  }
};

/***/ }),

/***/ "./resources/js/otc-rep/App.vue":
/*!**************************************!*\
  !*** ./resources/js/otc-rep/App.vue ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _App_vue_vue_type_template_id_41ebfed2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./App.vue?vue&type=template&id=41ebfed2& */ "./resources/js/otc-rep/App.vue?vue&type=template&id=41ebfed2&");
/* harmony import */ var _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./App.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/App.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./App.vue?vue&type=style&index=0&lang=scss& */ "./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _App_vue_vue_type_template_id_41ebfed2___WEBPACK_IMPORTED_MODULE_0__["render"],
  _App_vue_vue_type_template_id_41ebfed2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/App.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/App.vue?vue&type=script&lang=js&":
/*!***************************************************************!*\
  !*** ./resources/js/otc-rep/App.vue?vue&type=script&lang=js& ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss&":
/*!************************************************************************!*\
  !*** ./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss& ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--11-2!../../../node_modules/sass-loader/dist/cjs.js??ref--11-3!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=style&index=0&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=style&index=0&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_style_index_0_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/otc-rep/App.vue?vue&type=template&id=41ebfed2&":
/*!*********************************************************************!*\
  !*** ./resources/js/otc-rep/App.vue?vue&type=template&id=41ebfed2& ***!
  \*********************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_41ebfed2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./App.vue?vue&type=template&id=41ebfed2& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/App.vue?vue&type=template&id=41ebfed2&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_41ebfed2___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_App_vue_vue_type_template_id_41ebfed2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/components/Navbar.vue":
/*!****************************************************!*\
  !*** ./resources/js/otc-rep/components/Navbar.vue ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Navbar_vue_vue_type_template_id_7353425a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Navbar.vue?vue&type=template&id=7353425a&scoped=true& */ "./resources/js/otc-rep/components/Navbar.vue?vue&type=template&id=7353425a&scoped=true&");
/* harmony import */ var _Navbar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Navbar.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/components/Navbar.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _Navbar_vue_vue_type_style_index_0_id_7353425a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss& */ "./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _Navbar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Navbar_vue_vue_type_template_id_7353425a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Navbar_vue_vue_type_template_id_7353425a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "7353425a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/components/Navbar.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/components/Navbar.vue?vue&type=script&lang=js&":
/*!*****************************************************************************!*\
  !*** ./resources/js/otc-rep/components/Navbar.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Navbar.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss&":
/*!**************************************************************************************************************!*\
  !*** ./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss& ***!
  \**************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_style_index_0_id_7353425a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/style-loader!../../../../node_modules/css-loader!../../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../../node_modules/postcss-loader/src??ref--11-2!../../../../node_modules/sass-loader/dist/cjs.js??ref--11-3!../../../../node_modules/vue-loader/lib??vue-loader-options!./Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=style&index=0&id=7353425a&scoped=true&lang=scss&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_style_index_0_id_7353425a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_style_index_0_id_7353425a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_style_index_0_id_7353425a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_style_index_0_id_7353425a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_11_2_node_modules_sass_loader_dist_cjs_js_ref_11_3_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_style_index_0_id_7353425a_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/otc-rep/components/Navbar.vue?vue&type=template&id=7353425a&scoped=true&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/otc-rep/components/Navbar.vue?vue&type=template&id=7353425a&scoped=true& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_template_id_7353425a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Navbar.vue?vue&type=template&id=7353425a&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/Navbar.vue?vue&type=template&id=7353425a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_template_id_7353425a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Navbar_vue_vue_type_template_id_7353425a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/components/OtcVisitProducts.vue":
/*!**************************************************************!*\
  !*** ./resources/js/otc-rep/components/OtcVisitProducts.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _OtcVisitProducts_vue_vue_type_template_id_5ee1b09b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./OtcVisitProducts.vue?vue&type=template&id=5ee1b09b& */ "./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=template&id=5ee1b09b&");
/* harmony import */ var _OtcVisitProducts_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./OtcVisitProducts.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _OtcVisitProducts_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _OtcVisitProducts_vue_vue_type_template_id_5ee1b09b___WEBPACK_IMPORTED_MODULE_0__["render"],
  _OtcVisitProducts_vue_vue_type_template_id_5ee1b09b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/components/OtcVisitProducts.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_OtcVisitProducts_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./OtcVisitProducts.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_OtcVisitProducts_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=template&id=5ee1b09b&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=template&id=5ee1b09b& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_OtcVisitProducts_vue_vue_type_template_id_5ee1b09b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./OtcVisitProducts.vue?vue&type=template&id=5ee1b09b& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/OtcVisitProducts.vue?vue&type=template&id=5ee1b09b&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_OtcVisitProducts_vue_vue_type_template_id_5ee1b09b___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_OtcVisitProducts_vue_vue_type_template_id_5ee1b09b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/components/PlannerActions.vue":
/*!************************************************************!*\
  !*** ./resources/js/otc-rep/components/PlannerActions.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PlannerActions_vue_vue_type_template_id_4e5d2d95___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PlannerActions.vue?vue&type=template&id=4e5d2d95& */ "./resources/js/otc-rep/components/PlannerActions.vue?vue&type=template&id=4e5d2d95&");
/* harmony import */ var _PlannerActions_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PlannerActions.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/components/PlannerActions.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PlannerActions_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PlannerActions_vue_vue_type_template_id_4e5d2d95___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PlannerActions_vue_vue_type_template_id_4e5d2d95___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/components/PlannerActions.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/components/PlannerActions.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/otc-rep/components/PlannerActions.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerActions_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./PlannerActions.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/PlannerActions.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerActions_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/components/PlannerActions.vue?vue&type=template&id=4e5d2d95&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/otc-rep/components/PlannerActions.vue?vue&type=template&id=4e5d2d95& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerActions_vue_vue_type_template_id_4e5d2d95___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./PlannerActions.vue?vue&type=template&id=4e5d2d95& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/components/PlannerActions.vue?vue&type=template&id=4e5d2d95&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerActions_vue_vue_type_template_id_4e5d2d95___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerActions_vue_vue_type_template_id_4e5d2d95___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/otc-rep.js":
/*!*****************************************!*\
  !*** ./resources/js/otc-rep/otc-rep.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_LoaderComponent_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/LoaderComponent.vue */ "./resources/js/components/LoaderComponent.vue");
/* harmony import */ var _components_TableComponent_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/TableComponent.vue */ "./resources/js/components/TableComponent.vue");
/* harmony import */ var _components_NoDataToShow_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/NoDataToShow.vue */ "./resources/js/components/NoDataToShow.vue");
/* harmony import */ var _router_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./router/index */ "./resources/js/otc-rep/router/index.js");
/* harmony import */ var _store_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./store/index */ "./resources/js/otc-rep/store/index.js");
/* harmony import */ var _App_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./App.vue */ "./resources/js/otc-rep/App.vue");
/* harmony import */ var vee_validate__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vee-validate */ "./node_modules/vee-validate/dist/vee-validate.esm.js");
/* harmony import */ var vee_validate_dist_rules__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vee-validate/dist/rules */ "./node_modules/vee-validate/dist/rules.js");
/* harmony import */ var vee_validate_dist_locale_en_json__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! vee-validate/dist/locale/en.json */ "./node_modules/vee-validate/dist/locale/en.json");
var vee_validate_dist_locale_en_json__WEBPACK_IMPORTED_MODULE_9___namespace = /*#__PURE__*/__webpack_require__.t(/*! vee-validate/dist/locale/en.json */ "./node_modules/vee-validate/dist/locale/en.json", 1);
/* harmony import */ var _helpers_response_handler__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../helpers/response-handler */ "./resources/js/helpers/response-handler.js");
/* harmony import */ var vue_toasted__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! vue-toasted */ "./node_modules/vue-toasted/dist/vue-toasted.min.js");
/* harmony import */ var vue_toasted__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(vue_toasted__WEBPACK_IMPORTED_MODULE_11__);












vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(vue_toasted__WEBPACK_IMPORTED_MODULE_11___default.a, {
  duration: 4000,
  iconPack: 'fontawesome',
  action: {
    onClick: function onClick(e, toastObject) {
      toastObject.goAway(0);
    },
    "class": 'small text-light',
    icon: 'times'
  },
  position: 'top-left'
});
Object.keys(vee_validate_dist_rules__WEBPACK_IMPORTED_MODULE_8__).forEach(function (rule) {
  Object(vee_validate__WEBPACK_IMPORTED_MODULE_7__["extend"])(rule, vee_validate_dist_rules__WEBPACK_IMPORTED_MODULE_8__[rule]);
});
Object(vee_validate__WEBPACK_IMPORTED_MODULE_7__["localize"])(vee_validate_dist_locale_en_json__WEBPACK_IMPORTED_MODULE_9__);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.mixin(_helpers_response_handler__WEBPACK_IMPORTED_MODULE_10__["ResponseHandler"]);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.component('ValidationObserver', vee_validate__WEBPACK_IMPORTED_MODULE_7__["ValidationObserver"]);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.component('ValidationProvider', vee_validate__WEBPACK_IMPORTED_MODULE_7__["ValidationProvider"]);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.component('loader-component', _components_LoaderComponent_vue__WEBPACK_IMPORTED_MODULE_1__["default"]);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.component('table-component', _components_TableComponent_vue__WEBPACK_IMPORTED_MODULE_2__["default"]);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.component('no-data-to-show', _components_NoDataToShow_vue__WEBPACK_IMPORTED_MODULE_3__["default"]);
new vue__WEBPACK_IMPORTED_MODULE_0___default.a({
  router: _router_index__WEBPACK_IMPORTED_MODULE_4__["default"],
  store: _store_index__WEBPACK_IMPORTED_MODULE_5__["default"],
  render: function render(h) {
    return h(_App_vue__WEBPACK_IMPORTED_MODULE_6__["default"]);
  }
}).$mount('#app');

/***/ }),

/***/ "./resources/js/otc-rep/router/index.js":
/*!**********************************************!*\
  !*** ./resources/js/otc-rep/router/index.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-router */ "./node_modules/vue-router/dist/vue-router.esm.js");
/* harmony import */ var _views_Home_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/Home.vue */ "./resources/js/otc-rep/views/Home.vue");
/* harmony import */ var _pharmacies_routes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pharmacies-routes */ "./resources/js/otc-rep/router/pharmacies-routes.js");
/* harmony import */ var _planner_routes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./planner-routes */ "./resources/js/otc-rep/router/planner-routes.js");
/* harmony import */ var _report_routes__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./report-routes */ "./resources/js/otc-rep/router/report-routes.js");
/* harmony import */ var _components_ErrorPage_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../components/ErrorPage.vue */ "./resources/js/components/ErrorPage.vue");







vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(vue_router__WEBPACK_IMPORTED_MODULE_1__["default"]);
var base = document.getElementById('APP_BASE_URI').value + 'otc-rep';
/* harmony default export */ __webpack_exports__["default"] = (new vue_router__WEBPACK_IMPORTED_MODULE_1__["default"]({
  mode: 'history',
  base: base,
  routes: [{
    path: '/',
    component: _views_Home_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  }, _pharmacies_routes__WEBPACK_IMPORTED_MODULE_3__["default"], _planner_routes__WEBPACK_IMPORTED_MODULE_4__["default"], _report_routes__WEBPACK_IMPORTED_MODULE_5__["default"], {
    path: '*',
    component: _components_ErrorPage_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
  }]
}));

/***/ }),

/***/ "./resources/js/otc-rep/router/pharmacies-routes.js":
/*!**********************************************************!*\
  !*** ./resources/js/otc-rep/router/pharmacies-routes.js ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _views_Pharmacies_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/Pharmacies.vue */ "./resources/js/otc-rep/views/Pharmacies.vue");
/* harmony import */ var _views_pharmacies_PharmaciesList_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/pharmacies/PharmaciesList.vue */ "./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue");
/* harmony import */ var _views_pharmacies_CreatePharmacy_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/pharmacies/CreatePharmacy.vue */ "./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue");
/* harmony import */ var _views_pharmacies_EditPharmacy_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/pharmacies/EditPharmacy.vue */ "./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue");
/* harmony import */ var _views_pharmacies_ViewPharmacy_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../views/pharmacies/ViewPharmacy.vue */ "./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue");





/* harmony default export */ __webpack_exports__["default"] = ({
  path: '/pharmacies',
  component: _views_Pharmacies_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
  children: [{
    path: '',
    component: _views_pharmacies_PharmaciesList_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  }, {
    path: 'new',
    component: _views_pharmacies_CreatePharmacy_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  }, {
    path: 'edit/:id',
    component: _views_pharmacies_EditPharmacy_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
  }, {
    path: "view/:id",
    component: _views_pharmacies_ViewPharmacy_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
  }]
});

/***/ }),

/***/ "./resources/js/otc-rep/router/planner-routes.js":
/*!*******************************************************!*\
  !*** ./resources/js/otc-rep/router/planner-routes.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _views_Planner_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/Planner.vue */ "./resources/js/otc-rep/views/Planner.vue");
/* harmony import */ var _views_planner_PlannerHome_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/planner/PlannerHome.vue */ "./resources/js/otc-rep/views/planner/PlannerHome.vue");
/* harmony import */ var _views_planner_AddPlan_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/planner/AddPlan.vue */ "./resources/js/otc-rep/views/planner/AddPlan.vue");
/* harmony import */ var _views_planner_HealthDayPlan_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/planner/HealthDayPlan.vue */ "./resources/js/otc-rep/views/planner/HealthDayPlan.vue");




/* harmony default export */ __webpack_exports__["default"] = ({
  path: '/planner',
  component: _views_Planner_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
  children: [{
    path: '',
    component: _views_planner_PlannerHome_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  }, {
    path: 'add/day',
    component: _views_planner_AddPlan_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  }, {
    path: 'add/health-day',
    component: _views_planner_HealthDayPlan_vue__WEBPACK_IMPORTED_MODULE_3__["default"]
  }]
});

/***/ }),

/***/ "./resources/js/otc-rep/router/report-routes.js":
/*!******************************************************!*\
  !*** ./resources/js/otc-rep/router/report-routes.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _views_Report_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../views/Report.vue */ "./resources/js/otc-rep/views/Report.vue");
/* harmony import */ var _views_reports_ReportHome_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../views/reports/ReportHome.vue */ "./resources/js/otc-rep/views/reports/ReportHome.vue");
/* harmony import */ var _views_reports_AddPharmacyReport_vue__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../views/reports/AddPharmacyReport.vue */ "./resources/js/otc-rep/views/reports/AddPharmacyReport.vue");
/* harmony import */ var _views_reports_PharmacyReportList_vue__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../views/reports/PharmacyReportList.vue */ "./resources/js/otc-rep/views/reports/PharmacyReportList.vue");
/* harmony import */ var _views_reports_pharmacy_PharmacyView_vue__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../views/reports/pharmacy/PharmacyView.vue */ "./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue");
/* harmony import */ var _views_reports_pharmacy_DateView_vue__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../views/reports/pharmacy/DateView.vue */ "./resources/js/otc-rep/views/reports/pharmacy/DateView.vue");
/* harmony import */ var _views_reports_pharmacy_ProductView_vue__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../views/reports/pharmacy/ProductView.vue */ "./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue");







/* harmony default export */ __webpack_exports__["default"] = ({
  path: '/reports',
  component: _views_Report_vue__WEBPACK_IMPORTED_MODULE_0__["default"],
  children: [{
    path: '',
    component: _views_reports_ReportHome_vue__WEBPACK_IMPORTED_MODULE_1__["default"]
  }, {
    path: 'add/pharmacy',
    component: _views_reports_AddPharmacyReport_vue__WEBPACK_IMPORTED_MODULE_2__["default"]
  }, {
    path: 'view/pharmacy',
    component: _views_reports_PharmacyReportList_vue__WEBPACK_IMPORTED_MODULE_3__["default"],
    children: [{
      path: '',
      component: _views_reports_pharmacy_PharmacyView_vue__WEBPACK_IMPORTED_MODULE_4__["default"]
    }, {
      path: 'date',
      component: _views_reports_pharmacy_DateView_vue__WEBPACK_IMPORTED_MODULE_5__["default"]
    }, {
      path: 'product',
      component: _views_reports_pharmacy_ProductView_vue__WEBPACK_IMPORTED_MODULE_6__["default"]
    }]
  }]
});

/***/ }),

/***/ "./resources/js/otc-rep/store/index.js":
/*!*********************************************!*\
  !*** ./resources/js/otc-rep/store/index.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vuex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vuex */ "./node_modules/vuex/dist/vuex.esm.js");
/* harmony import */ var _shared_store_setting_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/store/setting-module */ "./resources/js/shared/store/setting-module.js");
/* harmony import */ var _shared_store_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/store/app-module */ "./resources/js/shared/store/app-module.js");
/* harmony import */ var _shared_store_user_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/store/user-module */ "./resources/js/shared/store/user-module.js");
/* harmony import */ var _pharmacy_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./pharmacy-module */ "./resources/js/otc-rep/store/pharmacy-module.js");
/* harmony import */ var _report_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./report-module */ "./resources/js/otc-rep/store/report-module.js");
/* harmony import */ var _planner_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./planner-module */ "./resources/js/otc-rep/store/planner-module.js");








vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(vuex__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (new vuex__WEBPACK_IMPORTED_MODULE_1__["default"].Store({
  modules: {
    AppModule: _shared_store_app_module__WEBPACK_IMPORTED_MODULE_3__["default"],
    UserModule: _shared_store_user_module__WEBPACK_IMPORTED_MODULE_4__["default"],
    SettingModule: _shared_store_setting_module__WEBPACK_IMPORTED_MODULE_2__["default"],
    PharmacyModule: _pharmacy_module__WEBPACK_IMPORTED_MODULE_5__["default"],
    ReportModule: _report_module__WEBPACK_IMPORTED_MODULE_6__["default"],
    PlannerModule: _planner_module__WEBPACK_IMPORTED_MODULE_7__["default"]
  }
}));

/***/ }),

/***/ "./resources/js/otc-rep/store/pharmacy-module.js":
/*!*******************************************************!*\
  !*** ./resources/js/otc-rep/store/pharmacy-module.js ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/http-service */ "./resources/js/helpers/http-service.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  state: {
    pharmacies: [],
    fetched: false
  },
  getters: {
    allPharmacies: function allPharmacies(state) {
      return state.pharmacies;
    },
    isPharmaciesFetched: function isPharmaciesFetched(state) {
      return state.fetched;
    }
  },
  mutations: {},
  actions: {
    fetchPharmacies: function fetchPharmacies(module, payload) {
      if (!module.state.pharmacies.length || payload) {
        module.state.pharmacies = [];
        module.state.fetched = false;
        return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get("otc-rep/v1/pharmacies").then(function (_ref) {
          var data = _ref.data;
          module.state.pharmacies = data.data;
          module.state.fetched = true;
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    }
  }
});

/***/ }),

/***/ "./resources/js/otc-rep/store/planner-module.js":
/*!******************************************************!*\
  !*** ./resources/js/otc-rep/store/planner-module.js ***!
  \******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/http-service */ "./resources/js/helpers/http-service.js");

/* harmony default export */ __webpack_exports__["default"] = ({
  state: {
    plans: [],
    fetched: false
  },
  getters: {
    allPlans: function allPlans(state) {
      return state.plans;
    },
    isPlannerFetched: function isPlannerFetched(state) {
      return state.fetched;
    },
    regularPlans: function regularPlans(state) {
      return state.plans.filter(function (plan) {
        return plan.type === "regular";
      });
    },
    healthDayPlans: function healthDayPlans(state) {
      return state.plans.filter(function (plan) {
        return plan.type !== "regular";
      });
    }
  },
  mutations: {},
  actions: {
    fetchPlans: function fetchPlans(module, payload) {
      if (!module.state.plans.length || payload.force) {
        module.state.fetched = false;
        module.state.plans = [];
        return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get('otc-rep/v1/planner').then(function (_ref) {
          var data = _ref.data;
          module.state.fetched = true;
          module.state.plans = data.data;
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    }
  }
});

/***/ }),

/***/ "./resources/js/otc-rep/store/report-module.js":
/*!*****************************************************!*\
  !*** ./resources/js/otc-rep/store/report-module.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/helpers */ "./resources/js/helpers/helpers.js");
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/http-service */ "./resources/js/helpers/http-service.js");


/* harmony default export */ __webpack_exports__["default"] = ({
  state: {
    pharmacyReports: [],
    pharmacyReportsFetched: false
  },
  getters: {
    pharmacyReports: function pharmacyReports(state) {
      return state.pharmacyReports;
    },
    pharmacyReportsFetched: function pharmacyReportsFetched(state) {
      return state.pharmacyReportsFetched;
    },
    pharmacyReportsDateView: function pharmacyReportsDateView(state) {
      var reports = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["filterData"])(state.pharmacyReports, 'date');
      return reports;
    },
    pharmacyReportsPharmacyView: function pharmacyReportsPharmacyView(state) {
      var reports = Object(_helpers_helpers__WEBPACK_IMPORTED_MODULE_0__["filterData"])(state.pharmacyReports, 'pharmacy');
      return reports;
    },
    totalPharmacyReportsCount: function totalPharmacyReportsCount(state) {
      return state.pharmacyReports.length;
    }
  },
  mutations: {},
  actions: {
    fetchPharmacyReports: function fetchPharmacyReports(module, payload) {
      module.state.pharmacyReports = [];
      module.state.pharmacyReportsFetched = false;

      if (!module.state.pharmacyReports.length || payload.force) {
        return _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].get('otc-rep/v1/reports/pharmacy').then(function (_ref) {
          var data = _ref.data;
          module.state.pharmacyReports = data.data;
          module.state.pharmacyReportsFetched = true;
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    }
  }
});

/***/ }),

/***/ "./resources/js/otc-rep/views/Home.vue":
/*!*********************************************!*\
  !*** ./resources/js/otc-rep/views/Home.vue ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Home_vue_vue_type_template_id_5240a1bf___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Home.vue?vue&type=template&id=5240a1bf& */ "./resources/js/otc-rep/views/Home.vue?vue&type=template&id=5240a1bf&");
/* harmony import */ var _Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Home.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/Home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Home_vue_vue_type_template_id_5240a1bf___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Home_vue_vue_type_template_id_5240a1bf___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/Home.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/Home.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./resources/js/otc-rep/views/Home.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Home.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/Home.vue?vue&type=template&id=5240a1bf&":
/*!****************************************************************************!*\
  !*** ./resources/js/otc-rep/views/Home.vue?vue&type=template&id=5240a1bf& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_5240a1bf___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Home.vue?vue&type=template&id=5240a1bf& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Home.vue?vue&type=template&id=5240a1bf&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_5240a1bf___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Home_vue_vue_type_template_id_5240a1bf___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/Pharmacies.vue":
/*!***************************************************!*\
  !*** ./resources/js/otc-rep/views/Pharmacies.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Pharmacies_vue_vue_type_template_id_622a7b1e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Pharmacies.vue?vue&type=template&id=622a7b1e& */ "./resources/js/otc-rep/views/Pharmacies.vue?vue&type=template&id=622a7b1e&");
/* harmony import */ var _Pharmacies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Pharmacies.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/Pharmacies.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Pharmacies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Pharmacies_vue_vue_type_template_id_622a7b1e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Pharmacies_vue_vue_type_template_id_622a7b1e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/Pharmacies.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/Pharmacies.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/js/otc-rep/views/Pharmacies.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Pharmacies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Pharmacies.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Pharmacies.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Pharmacies_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/Pharmacies.vue?vue&type=template&id=622a7b1e&":
/*!**********************************************************************************!*\
  !*** ./resources/js/otc-rep/views/Pharmacies.vue?vue&type=template&id=622a7b1e& ***!
  \**********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Pharmacies_vue_vue_type_template_id_622a7b1e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Pharmacies.vue?vue&type=template&id=622a7b1e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Pharmacies.vue?vue&type=template&id=622a7b1e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Pharmacies_vue_vue_type_template_id_622a7b1e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Pharmacies_vue_vue_type_template_id_622a7b1e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/Planner.vue":
/*!************************************************!*\
  !*** ./resources/js/otc-rep/views/Planner.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Planner_vue_vue_type_template_id_699024a2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Planner.vue?vue&type=template&id=699024a2& */ "./resources/js/otc-rep/views/Planner.vue?vue&type=template&id=699024a2&");
/* harmony import */ var _Planner_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Planner.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/Planner.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Planner_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Planner_vue_vue_type_template_id_699024a2___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Planner_vue_vue_type_template_id_699024a2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/Planner.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/Planner.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/js/otc-rep/views/Planner.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Planner_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Planner.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Planner.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Planner_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/Planner.vue?vue&type=template&id=699024a2&":
/*!*******************************************************************************!*\
  !*** ./resources/js/otc-rep/views/Planner.vue?vue&type=template&id=699024a2& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Planner_vue_vue_type_template_id_699024a2___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Planner.vue?vue&type=template&id=699024a2& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Planner.vue?vue&type=template&id=699024a2&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Planner_vue_vue_type_template_id_699024a2___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Planner_vue_vue_type_template_id_699024a2___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/Report.vue":
/*!***********************************************!*\
  !*** ./resources/js/otc-rep/views/Report.vue ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Report_vue_vue_type_template_id_41407d94___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Report.vue?vue&type=template&id=41407d94& */ "./resources/js/otc-rep/views/Report.vue?vue&type=template&id=41407d94&");
/* harmony import */ var _Report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Report.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/Report.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Report_vue_vue_type_template_id_41407d94___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Report_vue_vue_type_template_id_41407d94___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/Report.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/Report.vue?vue&type=script&lang=js&":
/*!************************************************************************!*\
  !*** ./resources/js/otc-rep/views/Report.vue?vue&type=script&lang=js& ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/babel-loader/lib??ref--4-0!../../../../node_modules/vue-loader/lib??vue-loader-options!./Report.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Report.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Report_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/Report.vue?vue&type=template&id=41407d94&":
/*!******************************************************************************!*\
  !*** ./resources/js/otc-rep/views/Report.vue?vue&type=template&id=41407d94& ***!
  \******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Report_vue_vue_type_template_id_41407d94___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../node_modules/vue-loader/lib??vue-loader-options!./Report.vue?vue&type=template&id=41407d94& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/Report.vue?vue&type=template&id=41407d94&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Report_vue_vue_type_template_id_41407d94___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Report_vue_vue_type_template_id_41407d94___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue":
/*!******************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CreatePharmacy_vue_vue_type_template_id_26cf229d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CreatePharmacy.vue?vue&type=template&id=26cf229d& */ "./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=template&id=26cf229d&");
/* harmony import */ var _CreatePharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CreatePharmacy.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _CreatePharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _CreatePharmacy_vue_vue_type_template_id_26cf229d___WEBPACK_IMPORTED_MODULE_0__["render"],
  _CreatePharmacy_vue_vue_type_template_id_26cf229d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreatePharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreatePharmacy.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_CreatePharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=template&id=26cf229d&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=template&id=26cf229d& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreatePharmacy_vue_vue_type_template_id_26cf229d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./CreatePharmacy.vue?vue&type=template&id=26cf229d& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/CreatePharmacy.vue?vue&type=template&id=26cf229d&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreatePharmacy_vue_vue_type_template_id_26cf229d___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_CreatePharmacy_vue_vue_type_template_id_26cf229d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue":
/*!****************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _EditPharmacy_vue_vue_type_template_id_64b0c02b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EditPharmacy.vue?vue&type=template&id=64b0c02b& */ "./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=template&id=64b0c02b&");
/* harmony import */ var _EditPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EditPharmacy.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _EditPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _EditPharmacy_vue_vue_type_template_id_64b0c02b___WEBPACK_IMPORTED_MODULE_0__["render"],
  _EditPharmacy_vue_vue_type_template_id_64b0c02b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/pharmacies/EditPharmacy.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./EditPharmacy.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_EditPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=template&id=64b0c02b&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=template&id=64b0c02b& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditPharmacy_vue_vue_type_template_id_64b0c02b___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./EditPharmacy.vue?vue&type=template&id=64b0c02b& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/EditPharmacy.vue?vue&type=template&id=64b0c02b&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditPharmacy_vue_vue_type_template_id_64b0c02b___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_EditPharmacy_vue_vue_type_template_id_64b0c02b___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue":
/*!******************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PharmaciesList_vue_vue_type_template_id_70733d9d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PharmaciesList.vue?vue&type=template&id=70733d9d& */ "./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=template&id=70733d9d&");
/* harmony import */ var _PharmaciesList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PharmaciesList.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PharmaciesList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PharmaciesList_vue_vue_type_template_id_70733d9d___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PharmaciesList_vue_vue_type_template_id_70733d9d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/pharmacies/PharmaciesList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmaciesList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PharmaciesList.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmaciesList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=template&id=70733d9d&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=template&id=70733d9d& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmaciesList_vue_vue_type_template_id_70733d9d___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PharmaciesList.vue?vue&type=template&id=70733d9d& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/PharmaciesList.vue?vue&type=template&id=70733d9d&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmaciesList_vue_vue_type_template_id_70733d9d___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmaciesList_vue_vue_type_template_id_70733d9d___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue":
/*!****************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ViewPharmacy_vue_vue_type_template_id_64bb7c46___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ViewPharmacy.vue?vue&type=template&id=64bb7c46& */ "./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=template&id=64bb7c46&");
/* harmony import */ var _ViewPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ViewPharmacy.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ViewPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ViewPharmacy_vue_vue_type_template_id_64bb7c46___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ViewPharmacy_vue_vue_type_template_id_64bb7c46___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./ViewPharmacy.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewPharmacy_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=template&id=64bb7c46&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=template&id=64bb7c46& ***!
  \***********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewPharmacy_vue_vue_type_template_id_64bb7c46___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./ViewPharmacy.vue?vue&type=template&id=64bb7c46& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/pharmacies/ViewPharmacy.vue?vue&type=template&id=64bb7c46&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewPharmacy_vue_vue_type_template_id_64bb7c46___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ViewPharmacy_vue_vue_type_template_id_64bb7c46___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/planner/AddPlan.vue":
/*!********************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/AddPlan.vue ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AddPlan_vue_vue_type_template_id_47b79d06___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddPlan.vue?vue&type=template&id=47b79d06& */ "./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=template&id=47b79d06&");
/* harmony import */ var _AddPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AddPlan.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AddPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AddPlan_vue_vue_type_template_id_47b79d06___WEBPACK_IMPORTED_MODULE_0__["render"],
  _AddPlan_vue_vue_type_template_id_47b79d06___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/planner/AddPlan.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=script&lang=js&":
/*!*********************************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./AddPlan.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=template&id=47b79d06&":
/*!***************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=template&id=47b79d06& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPlan_vue_vue_type_template_id_47b79d06___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./AddPlan.vue?vue&type=template&id=47b79d06& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/AddPlan.vue?vue&type=template&id=47b79d06&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPlan_vue_vue_type_template_id_47b79d06___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPlan_vue_vue_type_template_id_47b79d06___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/planner/HealthDayPlan.vue":
/*!**************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/HealthDayPlan.vue ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _HealthDayPlan_vue_vue_type_template_id_dbd54588___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./HealthDayPlan.vue?vue&type=template&id=dbd54588& */ "./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=template&id=dbd54588&");
/* harmony import */ var _HealthDayPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./HealthDayPlan.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _HealthDayPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _HealthDayPlan_vue_vue_type_template_id_dbd54588___WEBPACK_IMPORTED_MODULE_0__["render"],
  _HealthDayPlan_vue_vue_type_template_id_dbd54588___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/planner/HealthDayPlan.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=script&lang=js&":
/*!***************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HealthDayPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./HealthDayPlan.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_HealthDayPlan_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=template&id=dbd54588&":
/*!*********************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=template&id=dbd54588& ***!
  \*********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HealthDayPlan_vue_vue_type_template_id_dbd54588___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./HealthDayPlan.vue?vue&type=template&id=dbd54588& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/HealthDayPlan.vue?vue&type=template&id=dbd54588&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HealthDayPlan_vue_vue_type_template_id_dbd54588___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_HealthDayPlan_vue_vue_type_template_id_dbd54588___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/planner/PlannerHome.vue":
/*!************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/PlannerHome.vue ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PlannerHome_vue_vue_type_template_id_aaca7a38___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PlannerHome.vue?vue&type=template&id=aaca7a38& */ "./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=template&id=aaca7a38&");
/* harmony import */ var _PlannerHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PlannerHome.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PlannerHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PlannerHome_vue_vue_type_template_id_aaca7a38___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PlannerHome_vue_vue_type_template_id_aaca7a38___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/planner/PlannerHome.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=script&lang=js&":
/*!*************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PlannerHome.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=template&id=aaca7a38&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=template&id=aaca7a38& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerHome_vue_vue_type_template_id_aaca7a38___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PlannerHome.vue?vue&type=template&id=aaca7a38& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/planner/PlannerHome.vue?vue&type=template&id=aaca7a38&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerHome_vue_vue_type_template_id_aaca7a38___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PlannerHome_vue_vue_type_template_id_aaca7a38___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/reports/AddPharmacyReport.vue":
/*!******************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/AddPharmacyReport.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AddPharmacyReport_vue_vue_type_template_id_4525df70___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AddPharmacyReport.vue?vue&type=template&id=4525df70& */ "./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=template&id=4525df70&");
/* harmony import */ var _AddPharmacyReport_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./AddPharmacyReport.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _AddPharmacyReport_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _AddPharmacyReport_vue_vue_type_template_id_4525df70___WEBPACK_IMPORTED_MODULE_0__["render"],
  _AddPharmacyReport_vue_vue_type_template_id_4525df70___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/reports/AddPharmacyReport.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPharmacyReport_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./AddPharmacyReport.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPharmacyReport_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=template&id=4525df70&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=template&id=4525df70& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPharmacyReport_vue_vue_type_template_id_4525df70___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./AddPharmacyReport.vue?vue&type=template&id=4525df70& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/AddPharmacyReport.vue?vue&type=template&id=4525df70&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPharmacyReport_vue_vue_type_template_id_4525df70___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_AddPharmacyReport_vue_vue_type_template_id_4525df70___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/reports/PharmacyReportList.vue":
/*!*******************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/PharmacyReportList.vue ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PharmacyReportList_vue_vue_type_template_id_38616b35___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PharmacyReportList.vue?vue&type=template&id=38616b35& */ "./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=template&id=38616b35&");
/* harmony import */ var _PharmacyReportList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PharmacyReportList.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PharmacyReportList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PharmacyReportList_vue_vue_type_template_id_38616b35___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PharmacyReportList_vue_vue_type_template_id_38616b35___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/reports/PharmacyReportList.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=script&lang=js&":
/*!********************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyReportList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PharmacyReportList.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyReportList_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=template&id=38616b35&":
/*!**************************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=template&id=38616b35& ***!
  \**************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyReportList_vue_vue_type_template_id_38616b35___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./PharmacyReportList.vue?vue&type=template&id=38616b35& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/PharmacyReportList.vue?vue&type=template&id=38616b35&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyReportList_vue_vue_type_template_id_38616b35___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyReportList_vue_vue_type_template_id_38616b35___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/reports/ReportHome.vue":
/*!***********************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/ReportHome.vue ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ReportHome_vue_vue_type_template_id_4b22393a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ReportHome.vue?vue&type=template&id=4b22393a& */ "./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=template&id=4b22393a&");
/* harmony import */ var _ReportHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ReportHome.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ReportHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ReportHome_vue_vue_type_template_id_4b22393a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ReportHome_vue_vue_type_template_id_4b22393a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/reports/ReportHome.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=script&lang=js&":
/*!************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=script&lang=js& ***!
  \************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ReportHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../node_modules/vue-loader/lib??vue-loader-options!./ReportHome.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ReportHome_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=template&id=4b22393a&":
/*!******************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=template&id=4b22393a& ***!
  \******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReportHome_vue_vue_type_template_id_4b22393a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../node_modules/vue-loader/lib??vue-loader-options!./ReportHome.vue?vue&type=template&id=4b22393a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/ReportHome.vue?vue&type=template&id=4b22393a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReportHome_vue_vue_type_template_id_4b22393a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ReportHome_vue_vue_type_template_id_4b22393a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/DateView.vue":
/*!******************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/DateView.vue ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DateView_vue_vue_type_template_id_7c333b8f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DateView.vue?vue&type=template&id=7c333b8f& */ "./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=template&id=7c333b8f&");
/* harmony import */ var _DateView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DateView.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _DateView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _DateView_vue_vue_type_template_id_7c333b8f___WEBPACK_IMPORTED_MODULE_0__["render"],
  _DateView_vue_vue_type_template_id_7c333b8f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/reports/pharmacy/DateView.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DateView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./DateView.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_DateView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=template&id=7c333b8f&":
/*!*************************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=template&id=7c333b8f& ***!
  \*************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DateView_vue_vue_type_template_id_7c333b8f___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./DateView.vue?vue&type=template&id=7c333b8f& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/DateView.vue?vue&type=template&id=7c333b8f&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DateView_vue_vue_type_template_id_7c333b8f___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_DateView_vue_vue_type_template_id_7c333b8f___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue":
/*!**********************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _PharmacyView_vue_vue_type_template_id_e3e0ccd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./PharmacyView.vue?vue&type=template&id=e3e0ccd8& */ "./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=template&id=e3e0ccd8&");
/* harmony import */ var _PharmacyView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./PharmacyView.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _PharmacyView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _PharmacyView_vue_vue_type_template_id_e3e0ccd8___WEBPACK_IMPORTED_MODULE_0__["render"],
  _PharmacyView_vue_vue_type_template_id_e3e0ccd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./PharmacyView.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=template&id=e3e0ccd8&":
/*!*****************************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=template&id=e3e0ccd8& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyView_vue_vue_type_template_id_e3e0ccd8___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./PharmacyView.vue?vue&type=template&id=e3e0ccd8& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/PharmacyView.vue?vue&type=template&id=e3e0ccd8&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyView_vue_vue_type_template_id_e3e0ccd8___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_PharmacyView_vue_vue_type_template_id_e3e0ccd8___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue":
/*!*********************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ProductView_vue_vue_type_template_id_fc6d1970___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ProductView.vue?vue&type=template&id=fc6d1970& */ "./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=template&id=fc6d1970&");
/* harmony import */ var _ProductView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ProductView.vue?vue&type=script&lang=js& */ "./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _ProductView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ProductView_vue_vue_type_template_id_fc6d1970___WEBPACK_IMPORTED_MODULE_0__["render"],
  _ProductView_vue_vue_type_template_id_fc6d1970___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/otc-rep/views/reports/pharmacy/ProductView.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/babel-loader/lib??ref--4-0!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductView.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductView_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=template&id=fc6d1970&":
/*!****************************************************************************************************!*\
  !*** ./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=template&id=fc6d1970& ***!
  \****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductView_vue_vue_type_template_id_fc6d1970___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../../../../node_modules/vue-loader/lib??vue-loader-options!./ProductView.vue?vue&type=template&id=fc6d1970& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/otc-rep/views/reports/pharmacy/ProductView.vue?vue&type=template&id=fc6d1970&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductView_vue_vue_type_template_id_fc6d1970___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_ProductView_vue_vue_type_template_id_fc6d1970___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/shared/store/app-module.js":
/*!*************************************************!*\
  !*** ./resources/js/shared/store/app-module.js ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/http-service */ "./resources/js/helpers/http-service.js");
/**
 * App Module
 *
 * this module container all general settings and states of
 * the whole application
 *
 */

var user = document.getElementById("user");

if (user) {
  user = JSON.parse(user.value);
} else {
  user: null;
}

/* harmony default export */ __webpack_exports__["default"] = ({
  state: {
    // customers specialty
    specialties: ["Gynaecology", "Asthma", "Cardiology", "Cardiothoracic/Thoracic Surger", "Dermatology", "Diabetology", "Endocrinology", "ENT", "Family Medicine", "Gastroenterological Surgery", "Gastroenterology", "General Practice", "General Surgery", "Gyna", "Gynaecology", "Haematology", "Hepatology", "Infectious Diseases", "Internal Medicine", "Neonatology", "Nephrology", "Neurology", "Neuropsychiatry", "Neurosurgery", "Nutrition Medicine", "Oncology", "Ophthalmology", "Orthopaedics", "Otorhinolaryngology", "Paediatrics", "Physiotherapy", "Pneumology", "Rheumatology", "Surgical Oncology", "Tropical Medicine"],
    // customer titles
    titles: ["Assistant", "Resident", "Specialist", "Physician", "Prof"],
    // customer parameters
    params: ["HH", "HM", "HL", "MH", "MM", "ML", "LH", "LM", "LL", "NN", "XX"],
    user: user,

    /**
     * workplace hospitals type
     *
     * i.e MOH hospital, polyclinic, Family healthcare unit
     */
    hospitalTypes: ["MOH hospital", "PolyClinic", "Health unit", "Company", "Private hospital", "Tender", "Military hospital"],

    /**
     * pharmacy types
     *
     *
     */
    pharmacyTypes: ["Private", "Company", "Tender", "Chain"],

    /**
     * Visit types
     *
     *
     */
    visitTypes: ["pm face to face", "am face to face", "sample visit", "double visit"],

    /**
     * products
     */
    products: ["Ferrotron", "Calcitron", "Ferrotron Sachets", "Calcitron Sachets", "Octatron", "Chromitron", "Zinctron", "Trib Gold", "After Meals", "Hi-potency", "Syno", "Rocha", "Ivoreen", "herbolin", "Peopospan", "Peopobruf tablets", "Peopobruf drops", "Chemicetrizine", "Quinofloxachem", "Aceliofenaz"],

    /**
     * lader of adaption
     *
     */
    lader_of_adaption: ["Never heared", "Aware and not use", "Tried in a few Rx", "Sharing with competitor", "2nd line Rx", "1st line Rx", "1st in all Rx", "Advocator"],

    /**
     * visit actions
     *
     */
    visit_actions: ["Remind message", "Finding new indication", "Competitor attack", "Thanking visit", "Sharpen Commitment", "Demonstrate a new message", "Handle Objections", "Make a deal", "Finding new needs"],
    userLocations: [],
    isUserLocationsFetched: false,
    cycles: [],
    activeCycle: null,
    canEditReportDate: false,
    reportInterval: 30
  },
  getters: {
    specialty: function specialty(state) {
      return state.specialties;
    },
    title: function title(state) {
      return state.titles;
    },
    param: function param(state) {
      return state.params;
    },
    hospitalTypes: function hospitalTypes(state) {
      return state.hospitalTypes;
    },
    pharmacyTypes: function pharmacyTypes(state) {
      return state.pharmacyTypes;
    },
    visitTypes: function visitTypes(state) {
      return state.visitTypes;
    },
    products: function products(state) {
      return state.products;
    },
    lader: function lader(state) {
      return state.lader_of_adaption;
    },
    visitActions: function visitActions(state) {
      return state.visit_actions;
    },
    userLocations: function userLocations(state) {
      return state.userLocations;
    },
    isUserLocationsFetched: function isUserLocationsFetched(state) {
      return state.isUserLocationsFetched;
    }
    /*  repCycles : state => state.cycles,
     repActiveCycle: state => state.activeCycle,
     canEditReportDate: state=> state.canEditReportDate,
     reportInterval: state => state.reportInterval */

  },
  mutations: {},
  actions: {
    /**
     * get user locations
     *
     * @param {object} Module.State
     * @param {boolean} force
     */
    getUserLocations: function getUserLocations(_ref, force) {
      var state = _ref.state;

      if (!state.userLocations.length || force) {
        state.userLocations = [];
        state.isUserLocationsFetched = false;
        return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get('rep/v1/locations').then(function (_ref2) {
          var data = _ref2.data;
          state.userLocations = data.data;
          state.isUserLocationsFetched = true;
        })["catch"](function (err) {
          console.log(err);
        });
      }
    },

    /**
     * get user cycles
     */
    getCycles: function getCycles(_ref3, force) {
      var state = _ref3.state;

      if (!state.cycles.length || force) {
        state.cycles = [];
        return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get('rep/v1/cycles').then(function (_ref4) {
          var data = _ref4.data;
          return state.cycles = data.data;
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    },

    /** get active cycle */
    getActiveCycle: function getActiveCycle(_ref5, force) {
      var state = _ref5.state;

      if (!state.activeCycle || force) {
        state.activeCycle = null;
        return _helpers_http_service__WEBPACK_IMPORTED_MODULE_0__["httpCall"].get('rep/v1/active-cycle').then(function (_ref6) {
          var data = _ref6.data;
          state.activeCycle = data.data;
          state.canEditReportDate = data.can_edit_report_date === 'true' ? true : false;
          state.reportInterval = data.report_interval;
        })["catch"](function (err) {
          return console.log(err);
        });
      }
    }
  }
});

/***/ }),

/***/ "./resources/js/shared/store/setting-module.js":
/*!*****************************************************!*\
  !*** ./resources/js/shared/store/setting-module.js ***!
  \*****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _helpers_date_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../helpers/date-helpers */ "./resources/js/helpers/date-helpers.js");
/* harmony import */ var _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../helpers/http-service */ "./resources/js/helpers/http-service.js");


/* harmony default export */ __webpack_exports__["default"] = ({
  state: {
    /** current active cycle of plans and reports */
    activeCycle: {},

    /** report interval between report date and today */
    reportInterval: null,

    /** user can edit report date */
    canEditReportDate: null,

    /** all registered cycle plans */
    cycles: [],

    /** current cycle of view */
    currentViewCycle: {},

    /** user line */
    line: null,

    /** report Interval min date */
    reportIntervalMin: null,

    /* user locations */
    appUserLocations: []
  },
  getters: {
    /** current active cycle of plans and reports */
    activeCycle: function activeCycle(state) {
      return state.activeCycle;
    },

    /** report interval between report date and today */
    reportInterval: function reportInterval(state) {
      return state.reportInterval;
    },

    /** user can edit report date */
    canEditReportDate: function canEditReportDate(state) {
      return state.canEditReportDate;
    },

    /** all registered cycle plans */
    cycles: function cycles(state) {
      return state.cycles;
    },

    /** current cycle of view */
    currentViewCycle: function currentViewCycle(state) {
      return state.currentViewCycle;
    },

    /* user line */
    line: function line(state) {
      return state.line;
    },

    /** report Interval Min date */
    reportIntervalMin: function reportIntervalMin(state) {
      return state.reportIntervalMin;
    },

    /* user locations */
    appUserLocations: function appUserLocations(state) {
      return state.appUserLocations;
    }
  },
  mutations: {
    /**
     * update current view cycle
     * @param {object} state
     * @param {object} payload
     */
    setCurrentViewCycle: function setCurrentViewCycle(state, payload) {
      state.currentViewCycle = payload;
    },
    setMinReportInterval: function setMinReportInterval(state) {
      var interval = state.reportInterval;
      var calendar = new _helpers_date_helpers__WEBPACK_IMPORTED_MODULE_0__["Calendar"]();
      state.reportIntervalMin = calendar.subtract(interval).toString();
    },
    resetActiveCycle: function resetActiveCycle(state) {
      state.activeCycle = state.currentViewCycle;
    }
  },
  actions: {
    /**
     * fetching all application settings
     *
     * @return void
     */
    fetchingApplicationSettings: function fetchingApplicationSettings(module) {
      module.state.activeCycle = {};
      module.state.currentViewCycle = {};
      module.state.cycles = [];
      module.state.reportInterval = null;
      module.state.canEditReportDate = null;
      module.state.line = [];
      module.state.currentViewCycle = null;
      return _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].get('app-setting').then(function (_ref) {
        var data = _ref.data;
        module.state.activeCycle = data.data.activeCycle;
        module.state.currentViewCycle = data.data.activeCycle;
        module.state.cycles = data.data.cycles;
        module.state.reportInterval = data.data.reportInterval;
        module.state.canEditReportDate = data.data.canEditReportDate === 'true' ? true : false;
        module.state.line = data.data.line;
        module.state.currentViewCycle = data.data.activeCycle;
        module.commit('setMinReportInterval');
      })["catch"](function (err) {
        return console.log(err);
      });
    },
    getAppUserLocations: function getAppUserLocations(module) {
      return _helpers_http_service__WEBPACK_IMPORTED_MODULE_1__["httpCall"].get('user-locations').then(function (_ref2) {
        var data = _ref2.data;
        module.state.appUserLocations = data.data;
      })["catch"](function (err) {
        return console.log(err);
      });
    }
  }
});

/***/ }),

/***/ "./resources/js/shared/store/user-module.js":
/*!**************************************************!*\
  !*** ./resources/js/shared/store/user-module.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var user = JSON.parse(document.getElementById('user').value);
/* harmony default export */ __webpack_exports__["default"] = ({
  state: {
    /** user data */
    user: user
  },
  getters: {
    /* user data */
    user: function user(state) {
      return state.user;
    },

    /* user reps */
    reps: function reps(state) {
      return JSON.parse(state.user.user_relations).reps;
    },

    /* user district manager */
    districtManager: function districtManager(state) {
      return JSON.parse(state.user.user_relations).dm;
    },

    /* area managers */
    areaManager: function areaManager(state) {
      return JSON.parse(state.user.user_relations).am;
    },

    /* Regional Manager */
    regionalManager: function regionalManager(state) {
      return JSON.parse(state.user.user_relations).rm;
    },

    /* user title */
    userTitle: function userTitle(state) {
      return state.user.role;
    },

    /** user line  */
    userLine: function userLine(state) {
      return JSON.parse(state.user.line).join(' | ');
    }
  },
  mutations: {},
  actions: {}
});

/***/ }),

/***/ 3:
/*!***********************************************!*\
  !*** multi ./resources/js/otc-rep/otc-rep.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\php7\htdocs\projects\crm\resources\js\otc-rep\otc-rep.js */"./resources/js/otc-rep/otc-rep.js");


/***/ })

},[[3,"/js/dm/manifest","/js/dm/vendor"]]]);