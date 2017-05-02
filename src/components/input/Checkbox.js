import React from 'react';
require('./radio.scss');

/**
 * 性别radio
 */
export default class Checkbox extends React.Component{


    clickHandle(){

        this.props.setValue(this.props.val);
    }
    render(){
        let {name, checked} = this.props;
        return(
            <div className="checkbox"  onClick={() => this.clickHandle()}>
                <i
                    className={checked ? 'radio-active' : 'radio-default'}>
                </i>
                <span>{name}</span>


            </div>
        )
    }
}