import React from 'react';
import {connect} from 'react-redux';

import {
	NavLink
} from 'react-router-dom';

import {setError, setFBData} from '../../config/action.js';

import publicUtil from '../../utils/publicUtil.js';
import footballUtil from '../../utils/footballutil.js';
import Header from '../../components/header/header';

import Request from '../../utils/request.js';
import EditorView from './editorview.js';

let globalIndex = 0;
require('./editorfootball.scss');
/**
 * 修改
 */
class EditorFootball extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			lotteryData: {
			},
			multiple: {},
		}

	}
	componentWillMount(){
		let lotteryData = publicUtil.store.getData('LOTTERY', this.state.data);
		this.setState({
			lotteryData: lotteryData,
			multiple: publicUtil.changeMultiple('', lotteryData.multiple)
		})
	}

	/**
	 * 显示编辑弹出层
	 */
	showModel(e, index, playCode){

		var data = this.state.lotteryData;

		var tempData = data.matchList[index],
			termList = tempData.playList[0].termList,
			assignData;
		globalIndex = index;

		termList.map(function(term){
			term.active = true;
		});

		// 胜平负
		if (playCode == '01' || playCode == '05') {
			footballUtil.initSPFData();
			assignData = Object.assign([], footballUtil.SPFData);
			// trem 0 =》 负 ； 1 =》 平 ； 3 =》 胜
			termList.map(function(val){

				if (val.term == 0) {
					assignData[2].checked = true;
					assignData[2].sp = val.sp;
					assignData[2].term = 0;
					assignData[2].termName = val.termName;
				} else if (val.term == 1) {
					assignData[1].checked = true;
					assignData[1].sp = val.sp;
					assignData[1].term = 1;
					assignData[1].termName = val.termName;
				} else if (val.term == 3) {
					assignData[0].checked = true;
					assignData[0].sp = val.sp;
					assignData[0].term = 3;
					assignData[0].termName = val.termName;
				}

			});


			tempData.PList = assignData;

		} else {
			tempData.PList = termList;
		}

		let {dispatch} = this.props;
		dispatch(setFBData({
			data: tempData,
			isShow: true,
			playCode: playCode
		}))
	}

	
	/**
	 * 投注倍数输入
	 */
	inputMultipleHandle(e){

		this.changeMultiple(e.target.value);
	}
	/**
	 * 投注倍数修改
	 *
	 */
	changeMultiple(e, key){
		var key, num;

		if (e.target) {
			key = key;
			num = this.state.lotteryData.multiple || 0;
		} else {
			num = e;
		}

		var result = publicUtil.changeMultiple(key, num);


		this.setMultiple(result);

	}

	/**
	 * 设置投注倍数
	 */
	setMultiple(result){
		var lotteryData = this.state.lotteryData;
		lotteryData.multiple = result.num;
		this.setState({
			lotteryData: lotteryData,
			multiple: result
		})

	}

	/**
	 * 确定修改
	 * @param defaultData {Object} 修改过的数据
	 */
	confirmEdit(){
		let {FBData} = this.props;

		var This = this,termName = '', result,
			termList = [];

		// 胜平负
		if (FBData.playCode == '01' || FBData.playCode == '05') {

			FBData.data.PList.map(function(val, index){

				if (val.checked) {


					// 让球胜平负
					if (FBData.playCode == '01' ) {
						termName = '让球';
					}
					if (index == 2) {
						termName += '负';
					} else if (index == 1) {
						termName += '平';
					} else {
						termName += '胜';
					}
					val.termName = termName;


					termList.push(val);
				}
			})
		} else {
			termList = FBData.data.playList[0].termList;
		}


		this.state.lotteryData.matchList[globalIndex].playList[0].termList = termList;

		this.setState({
			lotteryData: this.state.lotteryData
		})


	}



	/** 撤销修改 */
	cancel(){

		this.componentWillMount();
	}

	/**
	 * 计算选择结果
	 */
	calculate(){
		var {lotteryData, multiple} = this.state,
			{dispatch, history} = this.props;

		var result = footballUtil.validateFootball(lotteryData.matchList);

		// 不能提交
		if (result) {

			dispatch(setError({prompt: true, msg: result}));
			return;
		}

		let request = new Request(this.props);


		// 请求服务器
		request.postOnce({
			cmd: '3200',
			func: 'recalculate',
			data: {
				lotteryCode: lotteryData.lotteryCode,
				issue: lotteryData.issue.issue,
				playCode: lotteryData.playCode || '01',
				multiple: multiple.num,
				stationCode: lotteryData.stationCode,
				buyTime: lotteryData.buyTime,
				ticketIdCode: lotteryData.ticketIdCode,
				number: footballUtil.getNumberList(lotteryData)
			},
			success: function(res){


				publicUtil.store.setData('LOTTERY', publicUtil.serializeData(res));
				history.goBack();
			}
		})


	}
	render(){

		let {lotteryData, multiple, defaultData, showModel} = this.state;


		return(

			<div className="editor-football">
				<section>
				<Header title="彩票详情" />
					<div className="edit-box">
					<div className="edit-label">投注倍数</div>
					<div className="multiple" >
						<i className={multiple.reduce ? 'icon-reduce' : 'icon-reduce disabled'} onClick={(e) => this.changeMultiple(e, '0')}>
						</i>
						<input type="number" value={this.state.value} value={lotteryData.multiple} onChange={(e) => this.inputMultipleHandle(e)} maxLength="2"/>
						<i className={multiple.plus ? 'icon-plus' : 'icon-plus disabled'}  onClick={(e) => this.changeMultiple(e, '1')}></i>
					</div>
				</div>
				<div className="betting" >
					<div className="edit-label">比赛场次</div>
					<div className="bouns-content">
						{
							lotteryData.matchList.map((match, index) => {

								return (
									<div className="football-edit" key={index} onClick={(e) => this.showModel(e, index, match.playList[0].playCode)}>
										<img src={require('../../images/xiugai.png')} className="icon-editor"></img>
										<div className="football-issue">
											<img src={require('../../images/ic-changci.png')}></img>
											{match.week} {match.sn}<span className={match.playList[0].letBall < 0 ? 'c-green' : 'c-red'}>{match.playList[0].letBall}</span>
										</div>
										<div className="football-team">
											<div>{match.mainTeam}</div>
											<div>VS</div>
											<div>{match.guestTeam}</div>
										</div>
										<div className="football-label">
											{
												match.playList[0].termList.map((item, j) => {
													return(
														<div className="disabled" key={j}>
															{item.termName}<text> {item.sp}</text>
														</div>
														)
												})
											}

										</div>
									</div>
								)
							})
						}
					</div>
					<div className="edit-tips">
						点击要修改的区域即可修改
					</div>
				</div>
				<div className="btns">
					<div className="btns-content">
						<div>
							<button onClick={(e) => this.cancel()} type="default"   className="edit-btn">撤销修改</button>
						</div>
						<div>
							<button className="confirm-btn"  onClick={(e) => this.calculate(e)}>提交修改</button>
						</div>
					</div>

				</div>
				<EditorView fn={this.confirmEdit.bind(this)} />

				</section>
			</div>
		)
	}
}

let init = (state) => {
	"use strict";
	return {
		FBData: state.FBData
	}
};

export default connect(init)(EditorFootball);
