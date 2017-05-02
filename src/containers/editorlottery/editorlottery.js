import React from 'react';
import {connect} from 'react-redux';

import {
	NavLink
} from 'react-router-dom';

import {setError} from '../../config/action.js';
import NumberBall from '../../components/bonus/numberball';
import publicUtil from '../../utils/publicUtil.js';
import Header from '../../components/header/header';
import LotteryView from './lotteryview.js';
import Request from '../../utils/request.js';
import util from './util.js';
import fcUtil from '../../utils/fcutil.js';
let globalIndex = 0;
require('./editorlottery.scss');
/**
 * 修改
 */
class EditorLottery extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			showModel: false,
			lotteryData: {
			},
			issue: {
				dorpShow: "hidden",
				issueList: [],
			},
			multiple: {},
			defaultNumber: ''
		}
		this.request = new Request(this.props);
	}
	componentWillMount(){
		let lotteryData = publicUtil.store.getData('LOTTERY', this.state.data);
		this.setState({
			lotteryData: lotteryData,
			multiple: publicUtil.changeMultiple('', lotteryData.multiple)
		})
	}
	/**
	 * 选择期次
	 */
	selectedHandle(e, val){

		let {lotteryData, issue} = this.state;
		lotteryData.issue.issue =  val;
		issue.dorpShow =  'hidden';
		//e.target.value = val;
		this.setState({
			lotteryData: lotteryData,
			issue : issue
		});

		e.stopPropagation();

	}


	/**
	 * 显示编辑弹出层
	 */
	showModel(e, index){


		let {lotteryData} = this.state;
		globalIndex = index;

		this.setState({
			defaultNumber: lotteryData.ticketList[index].numbers,
			showModel: true
		})
	}

	/**
	 * 期次输入更改
	 */
	issueBlueHandle(e){
		let {lotteryData} = this.state;
		lotteryData.issue.issue = e.target.value;
		this.setData({
			lotteryData: lotteryData
		})

		
	}
	issueValidate(e){
		"use strict";
		var This = this;
		var tempIssue = this.state.issue;
		var lotteryData = this.state.lotteryData;

		// 用户点击选取的不进行验证
		if (tempIssue.dorpShow == 'hidden') {
			return
		}
		tempIssue.dorpShow = 'hidden';

		validataIssue(e.target.value);

		/**
		 * 是否是正确的期次
		 */
		function validataIssue(issue){

			lotteryData.issue.issue = issue;


			if (issue.length == 7) {
				Request.post({
					data: {
						cmd: '3201',
						func: 'check',
						data: {
							lotteryCode: This.state.lotteryData.lotteryCode,
							issue: issue
						},
						success: function(res){
							if (res.isExists == 0) {

								dispatch(setError({prompt: true, msg: '期次不正确'}));
							} else {

							}
						}
					}
				})
			} else {
				let {dispatch} = This.props;

				dispatch(setError({prompt: true, msg: '期次不正确'}));

			}

		}
	}
	/**
	 * 期次下拉
	 */
	showIssue(e){
		var tempIssue = this.state.issue,
			This = this;
		tempIssue.dorpShow = 'visible';

		// 取期次列表
		this.request.post({

			cmd: '3201',
			func: 'newly',
			data: {lotteryCode: this.state.lotteryData.lotteryCode},

			success: function (res) {
				tempIssue.issueList = res.issueList;
				This.setState({
					issue: tempIssue
				});
			}
		})
		e.preventDefault();
		
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
	 * 选号
	 */
	selectBoll(e){
		var key = e.currentTarget.dataset.key,
			num = e.currentTarget.dataset.num,
			tempBoll = this.data.boll,
			playBtns = {}
		
		var resultTempBoll = util.selectBoll(key, num, play, tempBoll);
		
		this.setState({
			boll: resultTempBoll
		})
		
	}
	
	

	/** 撤销修改 */
	cancel(){

		this.componentWillMount();
	}

	/**
	 * 确定选号
	 */
	confirmEdit(e){
		var {lotteryData} = this.state;
		lotteryData.ticketList[globalIndex].numbers = changeArr([util.boll.red, util.boll.blue]);


		this.setState({
			lotteryData: lotteryData,
			defaultNumber: ''
		})

		/**
		 * 改变数据结构
		 * @param arr{Array}
		 * @returns {Array}
		 */
		function changeArr(arr){
			if (Array.isArray(arr)) {
				return arr.map(function(val){
					if (Array.isArray(val)) {
						return val.map(function(boll){
							return {number: boll};
						})
					}

				})
			}

		}
	}
	/**
	 * 计算选择结果
	 */
	calculate(){
		let {lotteryData} = this.state,
			result = fcUtil.validataNumber(lotteryData, {issue: {msg: '期次不能为空'}, multiple: {msg: '倍数不能为空'}, ticketList: {}}),
			{history, dispatch} = this.props;

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
				multiple: lotteryData.multiple,
				stationCode: lotteryData.stationCode,
				number: fcUtil.getNumberList(lotteryData.ticketList, lotteryData.multiple, lotteryData.lotteryCode)
			},
			success: function(res){


				publicUtil.store.setData('LOTTERY', publicUtil.serializeData(res));
				history.goBack();
			}
		})
	}
	render(){

		let {issue, lotteryData, multiple, defaultNumber, showModel} = this.state;


		return(
			
			<div className="editor-lottery" >
				<Header title="彩票选号" />
				<div className="edit-cont">
					<div className="edit-box">
						<div className="edit-label">彩票期次</div>
						<div  style={{overflow: issue.dorpShow}}>
							<div className="issue" onClick={(e) => this.showIssue(e)}>
								第<input value={lotteryData.issue.issue}  onBlur={(e) => this.issueValidate(e)} onChange={(e) => this.issueBlueHandle(e)}  type="number" maxLength="7" />期
								<i className={issue.dorpShow == 'visible' ? 'icon-select trans-down' : 'icon-select'}></i>
								<div className="issue-list" >
									{
										issue.issueList.map((item, index) => {
											return (
												<div key={index}  onClick={(e) => this.selectedHandle(e, item)}>{item}</div>
											)
										})
									}
								</div>
							</div>
						</div>
					</div>
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
						<div className="edit-label">彩票选号</div>
						<div className="bouns-content">
							<NumberBall ticketList={lotteryData.ticketList} lotteryStatus={lotteryData.bonusStatus} lotteryCode={lotteryData.lotteryCode} fn={this.showModel.bind(this)}>
								<i className="icon-edit"></i>
							</NumberBall>

						
						</div>
						<div className="edit-tips">
							点击要修改的区域即可修改
						</div>
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
				<LotteryView defaultNumber={defaultNumber} lotteryCode={lotteryData.lotteryCode} showModel={showModel} fn={this.confirmEdit.bind(this)} />
			</div>
		)
	}
}


export default connect()(EditorLottery);
