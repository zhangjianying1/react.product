import React from 'react';
import {connect} from 'react-redux';

import {setSoccer, setError} from '../../config/action.js';
import publicUtil from '../../utils/publicUtil.js';
import soccerUtil from '../../utils/soccerutil.js';
import Radio from '../../components/input/Radio.js';

/**
 * 设置标题和加载数据
 */
class SoccerTab extends React.Component{
	constructor(porps){
		super(porps);
		this.state = {
			matchList: [],
			showMark: false,

			// 单选
			radioData: [{name: '全选',checked: true}, {name: '反选',checked: false}, {name: '五大联赛',checked: false}],
			playData: [{name: '全部玩法', active: true}, {name: '单关', active: false}],
			// 玩法切换标志
			showPlay: {active: -1},
			matchName: '全部联赛',
			playName: '全部玩法',
		}
	}
	componentDidMount(){



	}
	showPlay(index){

		let tempData = {
			showPlay: {active: index}
		}

		if (this.state.matchList.length == 0) {
			let soccerList = publicUtil.store.getData('soccerList');
			Object.assign(tempData, {
				matchList: soccerUtil.filterPlay(soccerList)
			})
		}

		this.setState(tempData);
	}
	redioChnage(value, index){
		let This = this,
			eare = [],
			matchList = this.state.matchList,
			radioData = this.state.radioData,
			tempList;

		// 五大联赛


		if (value == '全选') {
			soccerUtil.listMap(matchList, true);

		} else if (value == '反选'){
			soccerUtil.reverseMap(matchList);
			index = 1;

		} else {

			// 五大联赛
			soccerUtil.listMap(matchList, false);

			soccerUtil.fiveTeam.map(function(val){

				soccerUtil.listMap(matchList, false, val);
			})
			index = 2;
		}
		eare = soccerUtil.foundName(matchList);
		soccerUtil.setFilterData(eare);

		radioData.map(function(ra){
			ra.checked = false;
		})
		radioData[index].checked = true;

		this.setState({
			matchList: this.state.matchList,
			radioData: radioData
		})
	}

	// 对阵选择
	filterMatch(eare, index){

		let {matchList, radioData} = this.state,
			date = new Date().getTime();


		matchList[index].active = !matchList[index].active;
		// 组合过滤标签
		soccerUtil.setFilterData(eare);

		// 全部选中则为全选
		if (soccerUtil.filterData.length == matchList.length) {
			radioData[0].checked = true;
		} else {
			radioData[0].checked = false;
		}

		// 五大联赛是否选中
		radioData[2].checked = soccerUtil.isfiveTeamAll();

		this.setState({
			matchList: matchList,
			radioData: radioData
		})
	}

	// 筛选比赛
	getShut(eare, index){
		let {soccerData, dispatch} = this.props,
			{ matchList, playData} = this.state,
			matchName;




		// 全部玩法 or 单关
		if (eare) {
			soccerUtil.listMap(playData, false);
			playData[index].active = true;

			this.setState({
				playData: playData,
				playName: eare
			});
		}


		let soccerList = publicUtil.store.getData('soccerList');
		let tempData = soccerUtil.filterShutData(soccerList, soccerUtil.filterData, eare || this.state.playName);


		// 没有相关比赛
		if (tempData.length < 1) {

			dispatch(setError({prompt: true, msg: '没有相关比赛'}));
		} else {


			// 五大联赛
			if (soccerUtil.isfiveTeamAll()) {
				matchName = '五大联赛';
			} else {
				// 选择一种联赛
				if (soccerUtil.filterData.length == 1) {
					matchName = soccerUtil.filterData.toString();
				} else {
					matchName = '全部联赛';
				}

			}

			// 清空方案里面的数据
			soccerUtil.programmeData = [];
			this.setState({
				matchName: matchName,
				showPlay: {active: 0}
			})
			dispatch(setSoccer({
				active: false,
				data: tempData,
				multiple: {name: 1},
				cross: {name: ''}
			}))

		}

	}
	closeView(){
		let {showPlay} = this.state;
		showPlay.active = 0;
		this.setState(showPlay)
	}
	touchMoveHandle(e){
		"use strict";
		e.preventDefault();
	}
	render() {
		let {matchList, matchName, showPlay, playName, playData, radioData, showMark} = this.state;
		return (
			<section>

			<div className="tab">
				<div className={showPlay.active == 1 ? 'tab-tit tag-box  active' : 'tab-tit tag-box '}
				     onClick={() => this.showPlay(1)}>{matchName}
					<div className="icon-tag"></div>
				</div>
				<div className={showPlay.active == 2 ? 'tab-tit tag-box  active' : 'tab-tit tag-box '}
				     onClick={() => this.showPlay(2)}>{playName}
					<div className="icon-tag"></div>
				</div>
				<div className="nav-cont" hidden={showPlay.active == 0 || showPlay.active != 1 }>
					<div className="icon-up"></div>
					<div className="nav-body">
						{
							matchList.map((item, index) => {
								return (
									<div key={index} className={item.active ? 'middle-btn' : 'middle-btn btn-default'}
									     onClick={() => this.filterMatch(item.name, index)}>{item.name}</div>
								)
							})
						}
					</div>
					<div className="nav-control">
						{
							radioData.map((item, index) => {

								return (
									<Radio key={index} name={item.name} checked={item.checked}
									       setValue={() => this.redioChnage(item.name, index)}/>
								)
							})
						}

						<button className="middle-btn btn-primary" onClick={() => this.getShut()}>确定</button>
					</div>
				</div>
				<div className="nav-cont second-nav" hidden={showPlay.active == 0 || showPlay.active != 2}>
					<div className="icon-up"></div>
					<div className="nav-body">

						{
							playData.map((item, index) => {
								"use strict";
								return (
									<div key={index}
									     className={item.active ? 'middle-btn ' : 'middle-btn  btn-default'}
									     onClick={() => this.getShut(item.name, index)}>{item.name}</div>
								)
							})
						}
					</div>
				</div>

			</div>
			<div className="tab-mark" onTouchMove={(e) => this.touchMoveHandle(e)} onClick={() => this.closeView()} hidden={showPlay.active < 1}></div>
			</section>
		)
	}
}

let init = (state) => {
	return {
		soccerData: state.soccerData
	}
}

export default connect(init)(SoccerTab);