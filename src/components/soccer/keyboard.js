import React from 'react';
import {connect} from 'react-redux';
import {setSoccer, setError} from '../../config/action.js';
import soccerUtil from '../../utils/soccerutil.js';

/**
 * 数组键盘
 */
class Keyborad extends React.Component{
	constructor(porps){
		super(porps);
		this.state = {
			multiple: [{name: '10', active: false}, {name: '20', active: false}, {name: '30', active: false}, {name: '50', active: false}]
		}
		this.multipleArray = [];
	}
	closeView(){
		let {dispatch, soccerData} = this.props;

		dispatch(setSoccer({
			active: true,
			len: soccerData.len,
			data: soccerData.data,
			multiple: {
				name: soccerData.multiple.name,
				active: false
			},
			cross: soccerData.cross,
			bonus: soccerData.bonus
		}))

	}
	touchMoveHandle(e){
		e.preventDefault();
	}
	selectMultiple(name, index) {

		let tempMultiple = [];

		// 确定按钮
		if (name === undefined) {
			this.closeView();
			return;
		} else {
			name = name.toString().split('');

			// 最大倍数99倍
			if (name.length < 2 && this.multipleArray.length == 2) return;

			// 小键盘
			this.multipleArray = name.length > 1 ? name : this.multipleArray.concat(name);
		}

		this.changeMultiple(this.multipleArray);
	}
	/**
	 * 改变倍数
	 */
	changeMultiple(arr){

		let {soccerData, dispatch} = this.props,
			{multiple} = this.state,
			tempName = Number(arr.join(''));

		soccerUtil.listMap(multiple, false);
		soccerUtil.listMap(multiple, false, tempName);

		// 计算奖金
		let bonus = soccerUtil.getPrice(soccerData.cross.name, tempName);


		this.setState({
			multiple: multiple
		})
		dispatch(setSoccer({
			active: true,
			len: soccerData.len,
			data: soccerData.data,
			multiple: {
				name: tempName,
				active: true
			},
			cross: soccerData.cross,
			bonus: bonus
		}))
	}
	/**
	 * 小键盘删除
	 */
	deleteNumber(){

		// 再次确定数据 （按钮点击时候产生二位的数字）
		// this.multipleArray = this.data.multiple.name.toString().split('');
		this.multipleArray.splice(this.multipleArray.length - 1, 1);
		// !this.multipleArray.length && (this.multipleArray = [1]);
		this.changeMultiple(this.multipleArray);
	}
	render(){
		let {soccerData} = this.props,
			{multiple} = this.state;


		return (
			<div hidden={!soccerData.multiple.active}>
				<div className="bottom-mark" onTouchMove={(e) => this.touchMoveHandle(e)} onClick={() => this.closeView()}></div>
				<div className="fixed-bottom-multiple" >
					<div className="multiple-list">
						{
							multiple.map((item, index) => {
								return (
									<div key={index} className={item.active ? 'small-btn' : 'small-btn btn-default'}
									     onClick={() => this.selectMultiple(item.name, index)} >{item.name}倍</div>
								)
							})
						}
					</div>
					<div className="number-keyboard">
						{
							[1,2,3,4,5,6,7,8,9].map((item, index) => {
								"use strict";
								return (
									<div key={index} onClick={() => this.selectMultiple(item)}>{item}</div>
								)
							})
						}
						<div className="icon-del-back" onClick={() => this.deleteNumber()}>
							<img src={require('../../images/order/delete.png')}></img>
						</div>
						<div onClick={() => this.selectMultiple(0)}>0</div>
						<div className="fs-20" onClick={() => this.selectMultiple()}>确认</div>
					</div>
				</div>
			</div>
		)
	}

}
//Keyborad.propTypes = {
//
//	data: React.PropTypes.object,
//}
let init = (state) => {
	return {
		soccerData: state.soccerData
	}
}

export default connect(init)(Keyborad);