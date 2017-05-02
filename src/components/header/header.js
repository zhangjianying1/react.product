import React from 'react';

import {
    Link
} from 'react-router-dom';
/**
 * 设置标题和加载数据
 */
class Header extends React.Component{
    constructor(porps){
        super(porps);
    }
    componentDidMount(){

        if (this.props.initFN) {
            let {dispatch , url , sendData, initFN , reset} = this.props;
            post({
                dispatch: dispatch,
                url: url,
                sendData: sendData,
                callback: (data) => {
                    initFN(data);

                    // 下拉刷新
                    if (reset) {
                        reset();
                    }
                }
            })

        }

    }
    shouldComponentUpdate(){
        return false;
    }
    render(){

        document.title = this.props.title;
        return null
    }

}

Header.propTypes = {
    title: React.PropTypes.string,  //当前网页的title
}
export default Header;