


>Reducer
```javascript
"use strict";
const ReducerContainer =require("../index")

// 前提是已经使用了redux的connect方法将 component 和 reducer 绑定，
class Reducer extends ReducerContainer {
    store = {
        isClick: false
    }
    // 直接调用父类的update函数更新页面
    toggleStatus(clicked) {
        this.update('isClick', clicked);
    }

    // 返回一个immutable对象可以自动更新
    autoUpdate(click) {
        return this.getState().set("isClick", click);
    }

    // 返回promise  在resolve或者 reject 后更新状态，前提是传入的参数必须是immtuable.Map 对象
    updateWithPromise(click) {
        return new Promise((resolve, reject) => {
            setTimeout(
                () => resolve(this.getState().set("isClick", click)), 5000);
        })
    }

    // 如果返回的不是一个immutable 对象，那么不会触发更新
    simpleReturn() {
        console.log(1)
        return "simple";
    }

    // 有前缀的函数不会被拦截
    _normal() {
    }
}
export default new Reducer();

```

>Componet
````javascript

import React from "react";
import reducer from "./reducer";
export default class Component extends React.Component{
    render(){
        // 在任何地方调用该方法会返回当前component对应的store，避免数据层层透传所带来的麻烦
        // 方便在跨组件中共享数据
        let store = reducer.getState();
        let isClick =store.get("isClick");
        return (
            <div>
            {isClick?"clicked":"click me"}
            {/* 直接调用 update 更新状态 */}
            <button onClick={()=>reducer.toggleStatus(!isClick)}>call update</button>
             {/* 返回一个新的状态后，reducerContainer会拦截返回值，如果该返回值是Immutable.Map那么就更新状态,否则什么也不做 */}
        <button onClick={()=>reducer.autoUpdate(!isClick)}>return new state</button>
         {/* 异步更新，你的action 返回一个promise对象，知道该promise resolve 或者reject的时候，会更新状态，常常用于异步加载数据，该操作方式默认支持防重复点击，上一个promise 没有被解决，那么永远不会有任何反应 */}
        <button onClick={()=>reducer.updateWithPromise(!isClick)}>(async) wait for 5s</button>
        </div>
    )
    }
}
```