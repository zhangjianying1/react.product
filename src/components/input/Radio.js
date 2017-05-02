import React from 'react';
require('./radio.scss');

/**
 * 性别radio
 */
export default class Radio extends React.Component{


    clickHandle(val){
        this.props.setValue(val);
    }
    render(){
        let {name, checked} = this.props;
        return(
            <div className="radio"  onClick={() => this.clickHandle(name)}>
                <i
                   className={checked ? 'radio-active' : 'radio-default'}>
                </i>
                <span className={checked? 'c-red' : ''} >{name}</span>


            </div>
        )
    }
}