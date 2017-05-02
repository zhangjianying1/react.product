import React from 'react';
import {connect} from 'react-redux';
import {setError, setFBData} from '../../config/action.js';

import footballUtil from '../../utils/footballutil.js';
import publicUtil from '../../utils/publicUtil.js';
let termName = '';
/*
 * 修改弹窗层
 */
class PickerFootball extends React.Component{
	constructor(props){
		super(props);

	}


	smallViewSelectHandle(name, term){

		let {dispatch, FBData} = this.props;

		// 点击相同不做处理
		if (name == FBData.childData.name) return;
		dispatch(setFBData({
			data: FBData.data,
			isShow: true,
			playCode: FBData.playCode,
			childData: {
				term: term,
				name: name,
				index: FBData.childData.index,
				data: footballUtil.changeData(FBData.childData.data, name),
				playCode: FBData.playCode,
				isShow: true
			}
		}))



	}
	/* 确定编辑并关闭底部弹出层 */
	confirmSamllView(){

		let {dispatch, FBData} = this.props;


		let result = hasTrem(FBData.data.PList, FBData.childData.name);

		if (result) {

			dispatch(setError({prompt: true, msg: '赛果不能重复'}));
			return;
		}



		FBData.data.PList[FBData.childData.index].termName = FBData.childData.name;
		FBData.data.PList[FBData.childData.index].term = FBData.childData.term;

		dispatch(setFBData({
			data: FBData.data,
			isShow: true,
			playCode: FBData.playCode,
			childData: ''
		}))
		/**
		 * 是否存在
		 * @param arr {Array}
		 * @param key {String} 如果有key 就是要去除数组中对象的"key"相同的数组元素
		 */
		function hasTrem(arr, termName) {

			var result = false;

			if (!termName) return result;
			arr.map(function (item) {

				if (Array.isArray(item)){
					result = publicUtil.removeRepeat(item, termName);
				}
				if (item.termName == termName) {
					result = true;
				}
			})
			return result;
		}
	}
	/* 关闭底部弹出层*/
	closedHandle(){
		let {dispatch, FBData, fn} = this.props;

		dispatch(setFBData({
			data: FBData.data,
			isShow: true,
			playCode: FBData.playCode,
			childData: ''
			//	data: FBData.childData.data,
			//	playCode: FBData.playCode,
			//	isShow: false
			//}
		}))

	}
	render(){

		let {FBData} = this.props;
console.log(FBData.childData)

		if (!FBData.childData) return null;
		return(
			<div className="model-view-transup" >
				<div className="model-box">
					<div className="view-header">
						<div className="small-btn " onClick={() => this.closedHandle()}>取消</div>
						<div className="small-btn btn-primary" onClick={() => this.confirmSamllView()}>确定</div>
					</div>
					<div className="model-select-content">
						{
							FBData.playCode == '02' || FBData.playCode == '03' ?
								<div className="three-list">

									{
										FBData.childData.data.map((item, index) => {
											return (
												<div key={index}>
													<div onClick={() => this.smallViewSelectHandle(item.name, item.value, index)}  className={!item.active ? 'middle-btn btn-default' : 'middle-btn'}>{item.name}</div>
												</div>
											)
										})
									}


								</div>
								:
								//wx:if="{{defaultData.playCode == '04'}}"
								<div className="many-options" >
									{
										['主胜', '平', '主负'].map((val, index) => {

											return (
												<div key={index}>
													<div className="list-label">{val}</div>
													<div className="five-list">

															{
																FBData.childData.data[index].map((item, j) => {

																	return (
																		<div key={j} onClick={() => this.smallViewSelectHandle(item.name, item.value, j)} className={!item.active ? 'middle-btn btn-default' : 'middle-btn'}>{item.name}</div>
																	)
																})
															}



													</div>
												</div>
											)
										})
									}
								</div>
						}
					</div>
				</div>
			</div>
		)
	}
}

let init = (state) => {
	"use strict";
	return {
		FBData: state.FBData
	}
}

export default connect(init)(PickerFootball);
