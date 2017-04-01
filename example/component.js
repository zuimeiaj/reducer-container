/**
 *  created by yaojun on 17/2/7
 *
 */

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