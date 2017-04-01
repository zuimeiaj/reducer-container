> 该插件不能直接使用，只是提供了在reducer中更新状态的一些规范，主要目的是减少redux的 action 常量模板冗余问题，使用函数名称替代常量。达到直接调用reducer中的函数完成状态更新，或其他异步操作

你需要自己实现container和component的连接。container是连接component 和reducer的桥梁，并在合适的时候初始化。在contianer加载之前实例化reducer，并调用initialize，传入全局store和唯一的key

>reducer,所有的reducer都必须继承ReducerContainer
```javascript
"use strict";
const {ReducerContainer} =require("../index")
const immutable = require('immutable');
// 基本使用方法，自定义reudcer需要继承自ReducerContainer
// 可以使用三种方式来更新视图
// 1.直接调用update函数
// 2.直接返回一个新的状态
// 3.返回一个promise ，在resolve 或者reject 后更新
// 4. 加前缀的函数不会被拦截，只是一个普通的函数，其他的函数都会被封装成一个ReducerHook对象
// 5. ReducerHook 只是在函数数被执行的时候添加一些额外逻辑，一般用于打印当前函数名称，防重复点击，自动更新状态
class Reducer extends ReducerContainer {
    store = {
        isClick: false
    }
    // 1. 直接调用 update 函数 ，如果只有一个参数，该参数必须是一个immutable.Map对象
    // 2.如果update 有多个参数，偶数参数表示 状态中的某个属性字段名，基数参数为 新值，参数必须成对
    toggleStatus(clicked) {
        this.update('isClick', clicked);
    }

    // 直接return 新的状态，该状态必须是一个immutable.Map的实例
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
```

import React from "react";
import reducer from "./reducer";
export default class Component extends React.Component{
    render(){

        let store = reducer.getState();
        let isClick =store.get("isClick");
        return (
            <div>
            {isClick?"clicked":"click me"}
            <button onClick={()=>reducer.toggleStatus(!isClick)}>call update</button>
        <button onClick={()=>reducer.autoUpdate(!isClick)}>return new state</button>
        <button onClick={()=>reducer.updateWithPromise(!isClick)}>(async) wait for 5s</button>
        </div>
    )
    }
}
```