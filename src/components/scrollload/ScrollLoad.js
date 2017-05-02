import React from 'react';
import ReactDOM from 'react-dom';

import {getParentScroll} from '../../utils/dom';
import {extend} from '../../utils/object';

class ScrollLoad extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isMore: true
        }
    }
    loadImg(){
        let imgs = document.querySelectorAll('.img'),
            winH = document.documentElement.clientHeight;

        for (var i = 0; i < imgs.length; i ++){
            let img = imgs[i];

            if (img.getBoundingClientRect().top < winH) {
                let imgUrl = img.getAttribute('id');

                if (imgUrl) {
                    let oImg = new Image();
                    oImg.onload = function(){
                        if (img.tagName.toLowerCase() == 'img')
                            img.src = imgUrl;
                        else
                        img.style.backgroundImage = 'url(' + imgUrl + ')';
                        oImg = null;
                    }
                    oImg.src = imgUrl;
                    img.setAttribute('id', '');
                }
            }
        }
    }


    scrollLoad(){
        let {loadMoreFN} = this.props;
        loadMoreFN();
    }
    componentDidMount(){

        let oLoad = ReactDOM.findDOMNode(this.refs.load),
            This = this,
            winH = document.documentElement.clientHeight,
            body = getParentScroll(oLoad);

        body.onscroll = window.onscroll = null;
        body.onscroll = window.onscroll = function(){

            setTimeout(function(){
                This.loadImg();
                if (This.state.page != 'not') {
                    let oLoadOffsetTop =  oLoad.getBoundingClientRect().top;

                    if (oLoadOffsetTop < winH) {
                        This.setState({
                            isMore : true
                        })
                        This.scrollLoad();
                    }
                }
            }, 100)

        }
    }
    componentWillUnmount(){

        let oLoad = ReactDOM.findDOMNode(this.refs.load),
            body = getParentScroll(oLoad);

        body.onscroll = window.onscroll = null;
    }

    render(){
        let {isMore, isShow} = this.props;

        if (isMore){
            return (<div ref="load" className="loading" hidden={!isMore}>加载中...</div>)
        } else if (isShow) {
            return(
                <div  className="no-more">
                    <img src={require('../../images/Group6.png')}></img>
                    <div>没有更多了</div>
                </div>

            )
        } else {
            return null;
        }


    }
}


export default ScrollLoad;