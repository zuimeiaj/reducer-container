var immutable = require("immutable");
function ReducerHooks(reducer, method) {
    this.reducer    = reducer;
    this.method     = method;
    this.processing = false;
    let proto       = reducer.constructor.prototype
    this.originFunc = proto [this.method];
    proto[method]   = this.hooks.bind(this);
}
ReducerHooks.prototype._updateIfImmutableOnly = function (state) {
    if (state instanceof immutable.Map) {
        this.reducer.update(state);
    }
    this.processing = false;
}
ReducerHooks.prototype.hooks = function (...params) {
    this.onPerformBefore(...params);
    if (this.processing) return console.warn(`[ Action (${this.method}) in processing]`);
    this.processing = true;
    this.onPerformAfter(this.originFunc.apply(this.reducer, params));
}
ReducerHooks.prototype.onPerformAfter = function (state) {
    if (state && state.then && state.catch) {
        state.then((state) => this._updateIfImmutableOnly(state))
             .catch((state) => this._updateIfImmutableOnly(state))
        return;
    }
    this._updateIfImmutableOnly(state);
    return state;
}
ReducerHooks.prototype.onPerformBefore = function (...params) {
    console.info(`Dispatch Action :${this.method}`, params);
}

module.exports  = ReducerHooks;