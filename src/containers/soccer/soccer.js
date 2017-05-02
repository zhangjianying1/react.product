import React from 'react';

import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import {setSoccer, setError, setConfirm} from '../../config/action.js';
import Header from '../../components/header/header';
import Loading from '../../components/loading/Loading';
import publicUtil from '../../utils/publicUtil.js';
import soccerUtil from '../../utils/soccerutil.js';
import SoccerTemp from '../../components/soccer/soccerTemp.js';
import SoccerTab from '../../containers/soccer/soccertab.js';
import Cross from '../../components/soccer/cross.js';
import Keybroad from '../../components/soccer/keyboard.js';

import Request from '../../utils/request.js';
require('./soccer.scss');

/**
 * 健康状况详情
 */
class Soccer extends React.Component{
	constructor(props){
		super(props);

		this.goMore = this.goMore.bind(this);
		this.request = new Request(this.props);
	}

	componentWillMount(){
		let {soccerData} = this.props;

		if (soccerData) {
			this.calcuatorCount();
			return;
		}
		this.request.serialPost({
			cmd: '3202',
			func: 'open',
			data: {
				lotteryCode: 200
			},
			success: (res) => {


				soccerUtil.serializeSoccerData(res.matchList);


				// 缓存数据
				publicUtil.store.setData('soccerList', res.matchList);


				let {dispatch} = this.props;

				dispatch(setSoccer({
					data: res.matchList,
					multiple: {name: 1},
					cross: {active: false},
					active: false
				}));
			}
		});


	}
	/**
	 * 场次切换
	 */
	toggleShow(index){
		let {dispatch, soccerData} = this.props;

		soccerData.data[index].active = !soccerData.data[index].active
		dispatch(setSoccer({
			data: soccerData.data,
			cross: soccerData.cross,
			multiple: soccerData.multiple,
			active: soccerData.active,
			bonus: soccerData.bonus
		}))

	}

	/**
	 * 对阵赛果选择
	 */
	selectResult (wrapIndex, matchIndex, index, issue, single, sp, letBall, sn, sign){


		let {dispatch, soccerData} = this.props;
		// 0 =》 负 ； 1 =》 平 ； 3 =》 胜
		let tempData = {

			single: single,
			issue: issue,
			sn: sn,
			letBall: letBall,
			sign: sign,
			term: index == 0 ? 3 : index == 2 ? 0 : index,
			sp: sp,
			index: index

		}
		let isOver = soccerUtil.setProgrammeData(tempData, 8);

		// 不能添加
		if (isOver == -1) {

			dispatch(setError({prompt: true,
				msg: '最多能选8场比赛',
			}))
			return;
		}
		soccerData.data[wrapIndex].match[matchIndex][sign][index].active = !soccerData.data[wrapIndex].match[matchIndex][sign][index].active;

		this.calcuatorCount();
	}
	calcuatorCount(crossArray, multiple){

		let {dispatch, soccerData} = this.props, len = 0;


		let isShowButtonView = this.isShowProgramme(soccerUtil.programmeData),
			bonus = {};
		if (isShowButtonView) {

			len = soccerUtil.programmeData.length;
			soccerData.cross.name = [len > 1 ? len + ' 串 1' : '单关'];
			bonus = soccerUtil.getPrice(soccerData.multiple.name);
		}

		dispatch(setSoccer({
			len: len,
			active: isShowButtonView,
			data: soccerData.data,
			multiple: {
				name: soccerData.multiple.name
			},
			bonus: bonus,
			cross: soccerData.cross
		}))
	}
	/**
	 * 是否显示
	 */
	isShowProgramme(programmeData){

		var result = false;

		if (programmeData.length > 1) {
			result = true;
		} else {
			result = soccerUtil.isPass()
		}
		return result;
	}
	/**
	 * 显示串关弹层
	 */
	showPassView(){
		let {dispatch, soccerData} = this.props;
		soccerData.multiple.active = false;


		dispatch(setSoccer({
			active: true,
			len: soccerData.len,
			data: soccerData.data,
			multiple: soccerData.multiple,
			cross: {
				active: true,
				name: soccerData.cross.name
			},
			bonus: soccerData.bonus
		}))

	}
	/**
	 * 显示数字键盘弹层
	 */
	showMutiple(){
		let {dispatch, soccerData} = this.props;

		soccerData.cross.active = false;

		dispatch(setSoccer({
			active: true,
			len: soccerData.len,
			data: soccerData.data,
			multiple: {
				name: soccerData.multiple.name,
				active: true
			},
			cross: soccerData.cross,
			bonus: soccerData.bonus
		}))

	}
	/**
	 * 保存方案
	 */
	commit(){

		let {soccerData, dispatch} = this.props,
		crossName = soccerData.cross.name.toString().replace(/单关/g, '1*1').replace(/\s[\u4e00-\u9fa5]\s/g, '*');

		// 倍数为零
		if (soccerData.multiple.name == 0) {
			dispatch(setError({
				prompt: true,
				msg: '倍数不能为零'
			}));
			return;
		}

		dispatch(setConfirm({
			bBtn: true,
			msg: '是否保存当前的方案？',
			strongTips: '方案保存后将显示在彩票夹列表中',
			confirmFN: (res) => {

				confirmCommit.bind(this)();

			}
		}))

		function confirmCommit(){
			var result = [];

			result.push({
				number: getNumber(),
				playCode: '10',
				pollCode: crossName == '1*1' ? '01' : '02',
				multiple: 1,
				amount: soccerData.bonus.amount/soccerData.multiple.name,
				item: soccerData.bonus.amount/2/soccerData.multiple.name,
			})

			this.request.serialPost({
				cmd: '3200',
				func: 'self',
				data: {
					formId: Math.random(),
					lotteryCode: '200',
					playCode: '10',
					multiple: soccerData.multiple.name,
					orderAmount: soccerData.bonus.amount,
					item: soccerData.bonus.amount/2/ soccerData.multiple.name,
					number: result
				},
				success: (res) => {


					let {history} = this.props;
					history.push('/lotterydetail?orderId=' + res.orderId)
				}
			})

		}

		function getNumber() {
			var result = '', count = 0;

			soccerUtil.sortProgrammeData(soccerUtil.programmeData).map(function (programme) {

				// 遍历resultList
				programme.resultList.map(function(val){
					result += ','
					result += val.issue + val.sn + ':';

					if (val.sign == 'spfSp') {
						result += '05'
					} else if (val.sign == 'rqspfSp') {
						result += '01(' + val.letBall + ')'
					} else if (val.sign == 'halfFullSp') {
						result += '03'
					} else  if (val.sign == 'totalGoalsSp') {
						result += '02'
					} else if (val.sign == 'scoreSp') {
						result += '04'
					}
					result += '=';
					// 遍历对阵的多种赛果
					val.termList.map(function(term){
						result += term.term + '(' + term.sp + ')/';
					})
					result = result.slice(0, -1);
				})
			})
			result = result.substring(1);
			result += '|' + crossName;

			return result;
		}
		//20170306001:01(+1)=1(3.60)/0(5.30),20170306002:05=3(5.80)|2*1

	}
	goMore(wrapIndex, index){
		let {soccerData} = this.props,
			tempData = soccerData.data[wrapIndex].match[index],
			{history} = this.props;

		publicUtil.store.setData('soccerResult',tempData);
		history.push('/soccerother?wrapIndex=' + wrapIndex +'&index='+ index);
	}
	render(){
		let {soccerData} = this.props;


		return(
			<div className="soccer" style={{paddingBottom: soccerData.active ? '100px' : ''}} >
				<Header title="自助做单" />

				<SoccerTab />
				<div className="soccer-cont">
					<Loading />
					{
					soccerData.data ? <SoccerTemp matchList={soccerData.data} toggleShow={this.toggleShow.bind(this)} selectResult={this.selectResult.bind(this)} goMore={this.goMore}/>
						: null
					}

				</div>
				

				{
					soccerData.active ?
						<div className="fixed-bottom-view">
							<div className="bottom-view-header column">
								<div>已选 {soccerData.len} 场</div>
								<div onClick={() => this.showPassView()}>
									<div className={soccerData.cross.active ? 'tag-box  active' : 'tag-box '}>
										{soccerData.cross.name}<div className="icon-tag"></div>
									</div>
								</div>

								<div onClick={() => this.showMutiple()}>
									<div className={soccerData.multiple.active ? 'tag-box  active' : 'tag-box '}>
										{soccerData.multiple.name}倍
										<div className="icon-tag"></div>
									</div>
								</div>
							</div>
							<div className="bottom-view-body column">
								<div className="price">
									<div>金额: {soccerData.bonus.amount} 元</div>
									<div>最高理论奖金: <text className="fs-16 c-orange">{soccerData.bonus.bonus}</text>元</div>
								</div>
								<div>
									<button onClick={() => this.commit()} className="big-btn btn-primary">保存</button>
								</div>
							</div>

						</div>

						: null
				}
				{
					soccerData.active ?
						<div>
							<Cross/>
							<Keybroad />
						</div>
						: null
				}
			</div>
		)
	}

}

//const mapStateToProps = (state, ownProps) => {
//	return {
//		soccerData: state.soccer
//	}
//}
//
//const mapDispatchToProps = (dispatch, ownProps) => {
//	return {
//		onClick: () => {
//			dispatch(setVisibilityFilter(ownProps.filter))
//		}
//	}
//}

//connect(
//	mapStateToProps,
//	mapDispatchToProps
//)(SoccerTemp)
let init = (state) => {
	return {
		soccerData: state.soccerData
	}
}


export default connect(init)(Soccer);