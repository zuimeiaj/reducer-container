var immutable =require ("immutable")
var ReducerHooks =require( "./hook");
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

ReducerContainer.prototype.initialize=function(store, uniqueKey) {
    this.globalStore = store;
    this.uniqueKey   = uniqueKey;
    if (this.config.autoUpdate) {
        this.extendsMethods();
    }
}

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

ReducerContainer.prototype.getState=function() {
    return this.globalStore.getState()[this.uniqueKey];
}

ReducerContainer.prototype.getValue=function(key) {
    return this.getState().get(key);
}

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