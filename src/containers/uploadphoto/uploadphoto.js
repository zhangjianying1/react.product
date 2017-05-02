import React from 'react';
import {connect} from 'react-redux';

import {resetTitle} from '../../utils/publicUtil.js';

require('./uploadphoto.scss');
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
		console.log(this)
		resetTitle.bind(this)('拍彩');
		this.setState((prevState) => ({
			verticalData: prevState.verticalData + 1
		}));
		console.log(this.props)

	}
	fileChange(e){
		var file = e.target.files[0];
		var fileReader = new FileReader();

		fileReader.onload = function(e){
			let result = e.target.result;
			console.log(result);

		}
		fileReader.readAsDataURL(file);
	}
	render(){


		return(

			<div className="container" >
				<Header title="拍彩" />
			upload
			</div>
		
		
		)
	}
}

const init = (state) => {
	"use strict";
	return {
		confirmData: state.todos
	}
}
export default connect(init)(Cameraentry);