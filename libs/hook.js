var immutable = require("immutable");
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