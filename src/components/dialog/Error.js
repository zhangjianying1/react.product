import React from 'react';
import {connect} from 'react-redux';
import {setError} from '../../config/action';

class Prompt extends React.Component{

    componentWillReceiveProps(nextProps){

        if (nextProps.error.prompt == true) {
            let {dispatch} = nextProps;
            setTimeout(() => {
                dispatch(setError({prompt: false, msg: 'fdfd'}))
            }, 1000)
        }
    }
    render(){
        let {error} = this.props;
        return (
            <div style={{display: error.prompt ? 'block' : 'none'}}>
                <div className="view-error" style={{
                    padding: '10px 30px',
                    position: 'fixed', 'zIndex': 99,
                    background: 'rgba(0,0,0,.6)', 'fontSize': '14px',
                    'lineHeight': '40px',
                    left: '50%',
                    top: '50%',
                    borderRadius: '40px',
                    color: '#fff',
                    'WebkitTransform': 'translate(-50%, -50%)',
                    transform: 'translate(-50%, -50%)',
                    'whiteSpace': 'nowrap'
                }}>{error.msg}</div>

            </div>
            )
    }
}
let init = (state) => {
    "use strict";
    return{
        error: state.error
    }
}
export default connect(init)(Prompt)