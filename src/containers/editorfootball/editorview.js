import React from 'react';
import {connect} from 'react-redux';
import {setError, setFBData} from '../../config/action.js';

import footballUtil from '../../utils/footballutil.js';
import Checkbox from '../../components/input/Checkbox.js';
import PickerFootball from './pickerfootball.js';
import {
	NavLink
} from 'react-router-dom';

let globalIndex = 0;
/*
 * 修改弹窗层
 */
class EditorView extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			show: false,
			defaultData: {},
			smallView: ''
		}

	}

	/**
	 * 关闭编辑弹窗
	 */
	closedHandle(){
		let {dispatch} = this.props;
		dispatch(setFBData({
			show: false
		}))
	}
	addHandle(){
		this.delHandle()
	}
	delHandle(index){
		let {dispatch, FBData} = this.props;


		if (index) {
			FBData.data.PList.splice(index, 1);
		} else {
			FBData.data.PList.push({})
		}

		dispatch(setFBData({
			data: FBData.data,
			isShow: true,
			playCode: FBData.playCode
		}))

	}
	changeHandle(e, j){
		let {dispatch, FBData} = this.props;

		FBData.data.PList[j].sp = e.target.value;
		FBData.isShow = false;

		dispatch(setFBData({
			data: FBData.data,
			isShow: true,
			playCode: FBData.playCode
		}))
	}

	/**
	 * 胜平负修改
	 * @param term {String}
	 */
	checkHandle(term){
		let {defaultData} = this.state;
		let {dispatch, FBData} = this.props;


		FBData.data.PList.map((item) => {

			if (item.term == term) {
				item.checked = !item.checked;
			}

		})
		dispatch(setFBData({
			data: FBData.data,
			isShow: true,
			playCode: FBData.playCode
		}))
	}

	/**
	 * 显示选择层
	 * @param e
	 */
	selectPlay(index, name){

		let {dispatch, FBData} = this.props;

		dispatch(setFBData({
			data: FBData.data,
			isShow: true,
			playCode: FBData.playCode,
			childData: {
				name: name,
				data: footballUtil.changeData(footballUtil.getInitData(FBData.playCode), name),
				index: index,
				isShow: true
			}
		}))
	}
	confirmEdit(){
		let {dispatch, FBData, fn} = this.props;

		FBData.isShow = false;

		dispatch(setFBData(FBData))
		fn();
	}
	render(){

		let {smallView} = this.state,
			{FBData} = this.props;

		if (!FBData.isShow) return null;


		return(

			<div className="model-view">

				<div className="model-box">
					<div className="close-btn" onClick={() => this.closedHandle()}><i className="icon-close"></i></div>
					{
						FBData.playCode == '04' || FBData.playCode == '02' || FBData.playCode == '03' ?


							<div className="model-content">
								<div className="soccer-name">
									<span>{FBData.data.mainTeam}</span><span>VS</span><span>{FBData.data.guestTeam}</span>
								</div>
								{
									FBData.data.PList.map((item, j) => {
										return (
											<div className="soccer-score" key={j}>
												<div className="input score-number"
												     onClick={() => this.selectPlay(j, item.termName, FBData.playCode)}>{item.termName}</div>
												<div className="persentage">
													赔率<input type="digit" className="input" value={item.sp}
													         onChange={(e) => this.changeHandle(e, j)}/>
												</div>
												{
													j == 0 ?
														null
														: <i className="icon-del" onClick={() => this.delHandle(j)} ></i>
												}
											</div>
										)
									})
								}
								<i className="icon-add" onClick={() => this.addHandle()}>
								</i>
							</div>
							: FBData.playCode == '01' || FBData.playCode == '05' ?
							<div className="model-content" style={{paddingBottom: '40rpx'}}>
								<div className="soccer-name">
									<span>{FBData.data.mainTeam}</span>
									<span
										className={FBData.data.playList[0].letBall < 0 ? 'c-green' : 'c-red'}>{FBData.data.playList[0].letBall}</span>
									<span>VS</span>
									<span>{FBData.data.guestTeam}</span>
								</div>
								{
									FBData.data.PList.map((item, j) => {
										return (
											<div className="soccer-score" key={j}>
												<Checkbox checked={item.checked} setValue={this.checkHandle.bind(this)} val={item.term} name={FBData.playCode == '01' ? ('让球' + item.name) : item.name}/>

												<div className="persentage">
													赔率<input type="digit" className="input"
													         onChange={(e) => this.changeHandle(e, j)}
													         value={item.checked ? item.sp : ''}/></div>
											</div>
										)
									})
								}
							</div>
							: null
					}
					<div className="edit-confirm" ><button className="upload-botton"  onClick={() => this.confirmEdit()}>提交</button></div>
				</div>
				<PickerFootball />
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
export default connect(init)(EditorView);
