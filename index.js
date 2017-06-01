(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("immutable"));
	else if(typeof define === 'function' && define.amd)
		define(["immutable"], factory);
	else if(typeof exports === 'object')
		exports["reducerContainer"] = factory(require("immutable"));
	else
		root["reducerContainer"] = factory(root["immutable"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var immutable =__webpack_require__ (0)
var ReducerHooks =__webpack_require__( 2);
/**
 * @example
 *  class LoginReducer extends ReducerContainer{
 *      store={
 *          name:""
 *      }
 *      setName(name){
 *          return this.getState().set("name",name);
 *      }
 *
 *  }
 * export default new LoginReducer();
 */
function ReducerContainer(){
    this.globalStore = null;
    this.uniqueKey   = null;
    this.hooks={}
    this.config      = {
        debug             : false,
        autoUpdate        : true,
        unneedUpdatePrefix: "_"
    }
}
/**
 *
 * @param store
 * @param uniqueKey
 */
ReducerContainer.prototype.initialize=function(store, uniqueKey) {
    this.globalStore = store;
    this.uniqueKey   = uniqueKey;
    if (this.config.autoUpdate) {
        this.extendsMethods();
    }
}
/**
 * 初始化component store
 * @returns {immutable.Map}
 */
ReducerContainer.prototype.initialState=function() {
    return immutable.fromJS(this.store);
}

/**
 *
 * @param params [key1,value1,key2,value2,...]
 */
ReducerContainer.prototype.update=function() {
    var params =Array.prototype.slice.call(arguments);
    var state;
    if (params.length >= 2 && params.length % 2 === 0) {
        state = this.getState();
        for (var i = 0; i < params.length; i += 2) {
            var path  = params[i];
            var value = params[i + 1];
            path      = Array.isArray(path) ? path : [path]
            if (typeof value === "function") {
                state = state.updateIn(path, value);
            } else {
                state = state.updateIn(path, function(){ return value} );
            }
        }
    } else {
        state = params[0];
    }
    this.globalStore.dispatch({type: this.uniqueKey, state:state})
}
// 真正的reducer 是这样的
ReducerContainer.prototype.performUpdate=function(state, action) {
    if (action.type === this.uniqueKey) {
        return action.state
    }
    return state;
}
/**
 * 返回当前component的store
 */
ReducerContainer.prototype.getState=function() {
    return this.globalStore.getState()[this.uniqueKey];
}

ReducerContainer.prototype.getValue=function(key) {
    return this.getState().get(key);
}
/**
 *
 * @param pathArray {Array} see immutable.Map#getIn
 * @returns {immutable.Map|immutable.List}
 */
ReducerContainer.prototype.getIn=function (pathArray) {
    return this.getState().getIn(pathArray);
}
/**
 * 拦截派生类所有的函数
 */
ReducerContainer.prototype.extendsMethods=function() {
    var methods   = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        if (method === "constructor" || method.indexOf(this.config.unneedUpdatePrefix) === 0) {
            continue;
        }
        if(!this.hooks[method]){
            this.hooks[method]= new ReducerHooks(this, method);
        }
    }
}


module.exports=ReducerContainer;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var immutable = __webpack_require__(0);
function ReducerHooks(reducer, method) {
    this.reducer    = reducer;
    this.method     = method;
    this.processing = false;
    var proto       = reducer.constructor.prototype
    this.originFunc = proto [this.method];
    proto[method]   = this.hooks.bind(this);
}
ReducerHooks.prototype._updateIfImmutableOnly = function (state) {
    if (state instanceof immutable.Map) {
        this.reducer.update(state);
    }
    this.processing = false;
}
ReducerHooks.prototype.hooks = function () {
    var params =Array.prototype.slice.call(arguments);
    this.onPerformBefore.apply(this,params);
    if (this.processing) return console.warn("[ Action "+(this.method)+" in processing]");
    this.processing = true;
    this.onPerformAfter(this.originFunc.apply(this.reducer, params));
}
ReducerHooks.prototype.onPerformAfter = function (state) {
    var that =this;
    if (state && state.then && state.catch) {
        state.then(function(state) {return  that._updateIfImmutableOnly(state)})
             .catch(function(state){return  that._updateIfImmutableOnly(state)})
        return;
    }
    this._updateIfImmutableOnly(state);
    return state;
}
ReducerHooks.prototype.onPerformBefore = function () {
    console.info("Dispatch Action :",this.method, arguments);
}

module.exports  = ReducerHooks;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


module.exports=__webpack_require__(1);

/***/ })
/******/ ]);
});