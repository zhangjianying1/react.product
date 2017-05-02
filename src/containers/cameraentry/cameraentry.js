import React from 'react';
import {connect} from 'react-redux';

import Header from '../../components/header/header';

require('./camera.scss');
/**
 * 拍彩
 */
class Cameraentry extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			verticalData: 33
		}

	}
	componentWillMount(){

		this.setState((prevState) => ({
			verticalData: prevState.verticalData + 1
		}));


	}
	fileChange(e){
		var file = e.target.files[0];
		var fileReader = new FileReader();
		var {history} = this.props;
		var This = this;

		fileReader.onload = function(e){
			let result = e.target.result;

			history.push('/upload', {b: 2})

		}
		fileReader.readAsDataURL(file);
	}
	render(){


		return(

			<div className="container" >
				<Header title="拍彩" />
				<div className="img-box no-border">
					
					<div className="camera">
						<div >
							<i className="icon-camera"></i>
							<div className="camera-tit">拍彩票</div>
							<input type="file" className="event" onChange={this.fileChange.bind(this)} />
						</div>
					</div>
					<div  className="entry-cont">
						<div className="album auto-btn">
							<i className="icon-auto"></i>
							<div className="album-tit">自助做单</div>
						</div>
						<div className="album">
							<i className="icon-album"></i>
							<div className="album-tit">相册选择</div>
							<input type="file" className="event" />
						</div>
					</div>
				</div>
				
				<div className="upload-btns" >
					<div>
						<div>
							<button disabled="true" className="upload-botton" >开始识别</button>
						</div>
						<div className="upload-tips" >
							<div>说明：</div>
							<div >
								1、拍彩是使用手机拍摄彩票，通过识别彩票的票面信息，来提供开奖通知、奖金计算等在线服务的工具。【服务所依据的信息均来自于中国福彩网（www.cwl.gov.cn）、竞彩网（www.sporttery.cn）发布的公开信息】
							</div>
							<div >
								2、自助做单仅供彩民进行模拟投注使用，<text className="c-red">不提供售彩服务</text>
							</div>
							<div className="go-help" >使用帮助</div>
						</div>
					</div>
				
				
				</div>
			</div>
		
		
		)
	}
}


export default connect()(Cameraentry);