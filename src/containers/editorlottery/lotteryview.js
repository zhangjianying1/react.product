import React from 'react';
import {connect} from 'react-redux';
import util from './util.js';
import {
	NavLink
} from 'react-router-dom';

/*
 * 修改弹窗层
 */
class LotteryView extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			boll: {
				show: false,
				defaultNumber: {}
			}
		}

	}
	componentWillMount(){


	}
	componentWillReceiveProps(nextProps){

		if (nextProps.defaultNumber) {
			this.setDefaultNumber(nextProps.defaultNumber);
		}
	}
	/**
	 * 关闭编辑弹窗
	 */
	closedHandle(){

		var tempIssue = this.state.boll;
		tempIssue.show = false;

		this.setState({
			boll: tempIssue
		})
	}

	/**
	 * 设置初始状态
	 * @param numbers
	 * @param showModel
	 */
	setDefaultNumber(numbers){

		let {lotteryCode} = this.props,
			tempBoll = this.state.boll,
			arrRule = [];


		Object.assign(tempBoll, {show: !tempBoll.show});

		if (tempBoll.show) {

			// 双色球
			if (lotteryCode == '001') {
				arrRule = [33, 16];
			} else if (lotteryCode == '113') {
				arrRule = [35, 12];
			}
			// 标记用户已选择的号码
			tempBoll.defaultNumber = util.setDefaultNumber(arrRule, numbers);
		}


		this.setState({
			boll: tempBoll
		})
	}

	/**
	 * 选号
	 */
	selectBall(e, key, num){
		var tempBoll = this.state.boll,
			playBtns = {}

		var resultTempBoll = util.selectBall(key, num, tempBoll);

		this.setState({
			boll: resultTempBoll
		})

	}


	/**
	 * 确定选号
	 */
	submitBall(){
		let {fn} = this.props;

		fn();
		this.closedHandle();
	}

	render(){

		let {boll} = this.state,
			{lotteryCode} = this.props;

		if (!boll.show || !boll.defaultNumber.red) return null;

		return(

			<div className="model-view" >

				<div className="model-box">
					<div className="close-btn" onClick={() => this.closedHandle()}><i className="icon-close"></i></div>
					<div className="select-boll-content">
						<div className="red-boll">
							<div className="tit">{lotteryCode == '001' ? '红球' : '前区'}</div>
							<div className="boll-list">
								<div className="boll">
									{
										boll.defaultNumber.red.map((item, index) => {
											return (
												<div className={item.active ? 'active' : ''} key={index} onClick={(e) => this.selectBall(e, 'red', item.number)}>
													{item.number}
												</div>
											)
										})
									}

								</div>
							</div>
						</div>
						<div className="blue-boll">
							<div className="tit">{lotteryCode == '001' ? '蓝球' : '后区'}</div>
							<div className="boll-list">
								<div className="boll">
									{
										boll.defaultNumber.blue.map((item, index) => {
											return (
												<div className={item.active ? 'blue active' : 'blue'} key={index} onClick={(e) => this.selectBall(e, 'blue', item.number)}>
													{item.number}
												</div>
											)
										})
									}
								</div>
							</div>
						</div>
					</div>
					<div className="edit-confirm" ><button className="upload-botton"  onClick={() => this.submitBall()}>提交</button></div>
				</div>
			</div>



		)
	}
}


export default connect()(LotteryView);
