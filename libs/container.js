var immutable =require ("immutable")
var ReducerHooks =require( "./hook");
/**
 *
 * @constructor
 *
 * 一开始用react-redux 会这么用:
 * login.js:
 * const SHOW_ACTION_NAME="NAMESPACE_SHOW_ACTION_NAME";
 * export const showActionName=(name)=>({name,type:SHOW_ACTION_NAME});
 * export const initialState=()=>({name:""});
 * export const reducer (action,state){
 *  switch(action.type){
 *      case SHOW_ACTION_NAME:
 *                      // do sth..
 *                      return newState;
 *  }
 *
 * }
 *
 * mapDispatchToProps({showActionName,...})
 * mapStateToProps({...initialState()});
 *
 * 如果你觉得使用其他编译器生成该代码模板，或者 copy&paste，
 * 你也可能会单独建一个action 文件用于存放所有的常量
 * 或者你认为该代码更清晰，更容易组织程序结构，方便维护，或者......
 * 但是这都很麻烦，本来只是一个更新页面一个状态，就要写三个玩意~~
 *
 * 那么现在：
 *  class LoginReducer extends ReducerContainer{
 *      store={
 *          name:""
 *      }
 *      showActionName(name){
 *          return this.getState().set("name",name);
 *      }
 *
 *  }
 * export default new LoginReducer();
 *
 * 事情还没有这么简单，你还需要自己实现store 和 reducer的连接，componet 和 reducer的连接
 *  通常在加载路由时来做这些事情
 *
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
ReducerContainer.prototype.update=function(...params) {
    let state;
    if (params.length >= 2 && params.length % 2 === 0) {
        state = this.getState();
        for (let i = 0; i < params.length; i += 2) {
            let path  = params[i];
            let value = params[i + 1];
            path      = Array.isArray(path) ? path : [path]
            if (typeof value === "function") {
                state = state.updateIn(path, value);
            } else {
                state = state.updateIn(path, () => value);
            }
        }
    } else {
        state = params[0];
    }
    this.globalStore.dispatch({type: this.uniqueKey, state})
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
 * @returns {T|any|*}
 */
ReducerContainer.prototype.getIn=function (pathArray) {
    return this.getState().getIn(pathArray);
}
/**
 * 拦截派生类所有的函数
 */
ReducerContainer.prototype.extendsMethods=function() {
    let methods   = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    for (let i = 0; i < methods.length; i++) {
        let method = methods[i];
        if (method === "constructor" || method.indexOf(this.config.unneedUpdatePrefix) === 0) {
            continue;
        }
        if(!this.hooks[method]){
            this.hooks[method]= new ReducerHooks(this, method);
        }
    }
}


module.exports=ReducerContainer;