import React from 'react';

import {connect} from 'react-redux';



import {setSoccer, setError, setConfirm} from '../../config/action.js';
import Header from '../../components/header/header';

import publicUtil from '../../utils/publicUtil.js';
import soccerUtil from '../../utils/soccerutil.js';
import footballUtil from '../../utils/footballutil.js';

import request from '../../utils/request.js';
require('./soccerother.scss');

/**
 * 健康状况详情
 */
class SoccerOther extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			soccerResult: {}

		}
		this.pos = [];
		this.nameArray = [];
		let {location} = this.props;

		this.indexObj = publicUtil.locationHandle.searchHandle(location.search);


	}

	componentWillMount(){
		let storeData = publicUtil.store.getData('soccerResult');

		if (storeData.otherResult) {
			this.nameArray = storeData.otherResult.split(',');
		}

		this.setState({
			soccerResult: this.serializeData(storeData, this.nameArray)
		})

	}
	setDefaultActive(data, nameArray){

		if (!Array.isArray(data) || !Array.isArray(nameArray)) return data;
		soccerUtil.listMap(data, false);
		nameArray.map(function(name){

			soccerUtil.listMap(data, '', name);
		})
		return data;
	}
	/**
	 * 序列化数据
	 */
	serializeData(sourceData, nameArray){
		var tempData = {}, tempArray = [], tempArray2 = [], tempArray3 = [], count = 0;

		sourceData.dataList = [];
		tempData = publicUtil.extend([], footballUtil['04']);

		tempData.map((val, index) => {

			val.map(function(o, i){
				o.sp = sourceData.scoreSp.slice(count, (count + val.length))[i];
			})
			this.setDefaultActive(val, nameArray);
			count = val.length;
			tempArray.push(val);
		})
		sourceData.dataList.push({data: tempArray, name: '比分', value: 'scoreSp', active: true});


		// 总进球
		sourceData.totalGoalsSp.map((o, index) => {
			tempData = publicUtil.extend({}, footballUtil['02'][index]);
			tempData.sp = o;
			tempArray2.push(tempData);
		})

		sourceData.dataList.push({data: this.setDefaultActive(tempArray2, nameArray), name: '总进球', value: 'totalGoalsSp', active: false});

		// 半全场
		sourceData.halfFullSp.map((o, index) => {
			tempData = publicUtil.extend({}, footballUtil['03'][index]);
			tempData.sp = o;
			tempArray3.push(tempData);
		})
		sourceData.dataList.push({data: this.setDefaultActive(tempArray3, nameArray), name: '半全场', value: 'halfFullSp', active: false});

		return sourceData;
	}
	toggleShow(index){
		let {soccerResult} = this.state,
			soccerList = soccerResult.dataList;

		soccerList[index].active = !soccerList[index].active
		this.setState({
			soccerResult: soccerResult
		});

	}
	/**
	 * 对阵赛果选择
	 */
	selectResult(wrapIndex, matchIndex, index, issue, single, sp, letBall, sn, sign, name, term){
		let {dispatch, soccerData} = this.props,
			{soccerResult} = this.state,
			soccerList = soccerResult.dataList,
			tempData, len;
		
		console.log(sn)
		// 0 =》 负 ； 1 =》 平 ； 3 =》 胜
		
		tempData = {
			single: single,
			issue: issue,
			sn: sn,
			name: name,
			letBall: letBall,
			sign: sign,
			term: term,
			sp: sp,
			index: index
		}
		
		soccerUtil.setProgrammeData(tempData);
		
		// 比分
		if (matchIndex > -1) {
			tempData = soccerList[wrapIndex].data[matchIndex];
		} else {
			tempData = soccerList[wrapIndex].data;
		}
		
		tempData[index].active = !tempData[index].active;
		
		// 添加
		if (tempData[index].active) {
			this.nameArray.push(name);
			
		} else {
			this.nameArray.splice(publicUtil.isexits(this.nameArray, name), 1);
		}
		this.setState({
			soccerResult: soccerResult
		})

		this.pos = [this.indexObj.wrapIndex, this.indexObj.index];


	}

	/**
	 * 确定赛果选择
	 */
	confirm(){

		let {history, soccerData} = this.props;

		if (this.pos.length > 0 ) {
			soccerData.data[this.pos[0]].match[this.pos[1]].otherResult = this.nameArray.toString();
		}


		history.goBack()
	}
	render(){
		let {soccerResult} = this.state,
			{history} = this.props;
console.log(soccerResult)
		return(
			<div className="soccer-other">
				<Header title="自助做单" />
				<div className="header column">
					<div className="">{soccerResult.mainTeam}</div>
					<div className="">VS</div>
					<div className="">{soccerResult.guestTeam}</div>
				</div>
				<div className="play-cont">
					{
						soccerResult.dataList.map((list, index) => {
							return (
								<div key={index}>
									<div className="play-header" onClick={() => this.toggleShow(index)} >
										{list.name}<span>（可投单关）</span>
										<div className={!list.active ? 'icon-more  open' : 'icon-more '}>
										<img src={require('../../images/order/shouqi.png')} />
										</div>
										</div>
									<div className="play-body" hidden={!list.active}>

											{
												index == 0 && list.data.map((score, j) => {

													return (
														<div key={j}>
															<div className="one-tit">{j == 0 ? '胜' : j == 1 ? '平' : j == 2 ? '负' : ''}</div>
															<div className="play-list">
																{
																	score.map((item, h) => {
																		return (
																			<div key={h} className={item.active ? 'play-btn active' : 'play-btn '}
																			     onClick={() => this.selectResult(index, j, h, soccerResult.issue, soccerResult.totalGoalsSingle, item.sp, '', soccerResult.sn, 'scoreSp', item.name, item.value)} >
																				{item.name}
																				<div>{item.sp}</div>
																			</div>
																		)
																	})
																}
															</div>
														</div>
													)
												})
											}

										<div className="play-list" >
											
											{
												index == 1 && list.data.map((item, j) => {
													return (
														<div key={j} className={item.active ? 'play-btn active' : 'play-btn '}
														     onClick={() => this.selectResult(index, -1, j, soccerResult.issue, soccerResult.totalGoalsSingle, item.sp, '', soccerResult.sn, 'totalGoalsSp',item.name, item.value)}>
															{item.name}
															<div>{item.sp}</div>
														</div>
													)		
												})
											}			
											
										</div>
										<div className="play-list" >
											{
												index == 2 && list.data.map((item, j) => {
													return (
														<div key={j} className={item.active ? 'play-btn active' : 'play-btn '}
														     onClick={() => this.selectResult(index, -1, j, soccerResult.issue, soccerResult.halfFullSingle, item.sp, '', soccerResult.sn, 'halfFullSp', item.name, item.value)}>
															{item.name}
															<div>{item.sp}</div>
														</div>
													)
												})
											}
										</div>
									</div>
								</div>
							)
						})
					}
					
				</div>
				<div className="btns">
					<div className="btns-content">
						<div>
							<button onClick={history.goBack} className="edit-btn">取消</button>
						</div>
						<div>
							<button className="confirm-btn" onClick={() => this.confirm()}>确定</button>
						</div>
					</div>
				
				</div>
			</div>
		)
	}

}

let init = (state) => {
	return {
		soccerData: state.soccerData
	}
}


export default connect(init)(SoccerOther);