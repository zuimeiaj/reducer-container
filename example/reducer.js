/**
 *  created by yaojun on 17/2/7
 *
 */



"use strict";
const ReducerContainer =require("../index")
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
