var immutable =require ("immutable")
var ReducerHooks =require( "./hook");
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