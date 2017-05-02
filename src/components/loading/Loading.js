import React from 'react';

import {connect} from 'react-redux';

require('./loading.scss');
class Loading extends React.Component{
    render(){
        // 0 => 加载中 1 => 加载完成 2 => 连接超时 11 => 浮层加载效果
        const {loadingData} = this.props;

        let toggleDisplay = () => {
            return {display: loadingData != 1 ? 'block' : 'none'}
        }

        if (loadingData === '00') {
            return (
                <div className="dialog-loading"><i className="icon-loading"></i>加载中...</div>
            )
        } else if (loadingData === '22'){
            return (
                <div className="dialog-loading">网络错误</div>
            )
        }

        return (

            <div className="loading" style={toggleDisplay()}>
                {
                    loadingData == 0 ? '加载中...'
                        : loadingData == 2 ? <a href="">连接超时... ,点击重试</a>
                        : ''
                }
            </div>
            )
    }
}
let init = function (state) {
    return {
        loadingData: state.loadingData
    }
}


export default connect(init)(Loading);