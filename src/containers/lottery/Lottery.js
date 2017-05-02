import React from 'react';

import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import Header from '../../components/header/header';
import publicUtil from '../../utils/publicUtil.js';
import {setLotteryList} from '../../config/action.js';
import NumberBall from '../../components/bonus/numberball';
import Football from '../../components/bonus/football';
import DorpDown from '../../components/dorpdown/DorpDown.js';

import {getParent} from '../../utils/dom.js';
import ScrollLoad from '../../components/scrollload/ScrollLoad';
import Request from '../../utils/request.js';
require('./lottery.scss');
let bBtn = true,
	globalPage = 1,
    options =  {x: '', y: '', time: ''},
    isTransform = true,
	currPos = 0;
/**
 * 健康状况详情
 */
class Lottery extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isMore: true,
		}
		this.request = new Request(this.props);
	}
	loadData (fn, page){

		if (!bBtn) return;
		bBtn = false;

		// 下拉刷新
		if (page) {
			globalPage = 1;
			this.state.isMore = true;
		}

		if (!this.state.isMore) return;

		this.request.serialPost({
			cmd: '3200',
			func: 'list',
			data: {
				page: globalPage,
				pageSize: 10,
			},
			success: (res) => {

				let {dispatch, lotteryList} = this.props;

				if (globalPage > 1) {
					lotteryList = lotteryList.concat(publicUtil.serializeOrderList(res.orderList));

				} else {
					lotteryList = publicUtil.serializeOrderList(res.orderList);
				}

				// 没有更多数据
				if (res.orderList.length < 10) {
					this.state.isMore = false;
				}
				globalPage ++;

				this.setState({
					isMore: this.state.isMore
				})



				dispatch(setLotteryList(lotteryList));
				if (fn) fn();
				bBtn = true;

			}

		})
	}
	deleteHandle(e, index, orderId){



		this.request.postOnce({
			cmd: '3200',
			func: 'delete',
			data: {
				orderId: orderId

			},
			success: (res) => {
				let {dispatch, lotteryList} = this.props;

				lotteryList[index].isHide = true;

				dispatch(setLotteryList(lotteryList));
				this.setState({
					isMore: this.state.isMore
				})


			}
		})
		e.preventDefault();
	}
	componentWillMount(){

		if (this.props.lotteryList.length > 0) return;
		this.loadData();
	}
	render(){
		const {isMore} = this.state,
			{lotteryList} = this.props;
		console.log(lotteryList)

		return(
			<div className="lottery">
				<Header title="彩票夹" />
				<DorpDown refreshFN={(fn, elem) => this.loadData(fn, elem)}>
					<div>
						{
							lotteryList.length == 0 && !isMore ?
							<div className="nothing">
								<div className="nothing-img">
									<img src={require('../../images/blank.png')}></img>
									<div>
										您还没有彩票信息哦！</div>
								</div>
							</div>
							: null
						}

						{
							lotteryList.map((programme, index) => {
								return (

										<div className="show-msg"  key={index}  hidden={programme.isHide} >
											<Link to={`/lotterydetail?orderId=${programme.orderId }`}>
											<div className="show-msg-cont" ref={`box${index}`}
											     data-orderid="{programme.orderId}" >
												<img hidden={programme.orderType != 'self'} src={require('../../images/order/biaoqian.png')}></img>
												<div className={programme.showNumber == 1 ? 'msg-header show-detail': 'msg-header'}>
													<img src={require('../../images/' + programme.lotteryCode + '.png')}></img>
													<div className="msg-info">
														<div className="info-name">
															{programme.lotteryName}
															<span hidden={programme.lotteryCode != '200'}>第 {programme.issue} 期</span>
															<span hidden={programme.lotteryCode == '200'}>{programme.time.buyTime}</span>

														</div>
														<div className="info-strong c-blue" hidden={programme.bonusStatus != 0 }>待开奖</div>
														<div className="info-strong " hidden={programme.bonusStatus != 1}>
															<div>恭喜您！您的彩票已中奖</div>
																{
																	programme.bonusClass.map((bonus, i) => {

																		return (
																			<span className="c-orange" key={i}>{bonus.name + bonus.num}注,</span>
																		)

																	})
																}

															奖金共 <span className="c-orange">{programme.bonusAmount} </span>元
														</div>

														<div className="info-strong " hidden={programme.bonusStatus != 2}>很遗憾，您的彩票未中奖</div>
													</div>
												</div>
												<div className="bonus-number" hidden={programme.showNumber != 1 }>
													<div className="bonus-tit">
														<div></div>
														<div className="play-name">
															<div >
																<span hidden={programme.lotteryCode == '001'}>{programme.playName}</span>
																<span hidden={programme.lotteryCode != '200'}> {programme.passModel}</span>
																<span>{programme.multiple}倍</span>
															</div>
														</div>
													</div>
													<div className={programme.lotteryCode == '200' ? 'bonus-content  football-bonus-content' : 'bonus-content '}>
														{
															(programme.lotteryCode == '001' || programme.lotteryCode == '113') ?
																<NumberBall ticketList={programme.numberInfo} lotteryStatus={programme.bonusStatus} lotteryCode={programme.lotteryCode} />

																:

																<Football data={programme.matchList} />

														}

													</div>

												</div>
												{
													programme.bonusStatus == 0 && programme.lotteryCode == '200' ?
													<div className="theory-amount" hidden={programme.bonusStatus != 0 && programme.lotteryCode != '200'}>
														理论奖金 <span className="c-red">{programme.theoryBonus}</span> 元
													</div>
													: null
												}

												<div className="lottery-price">
													<div>
														投入金额{programme.orderAmount}元
													</div>
													<div  hidden={programme.bonusStatus != 1}>兑奖截止：{programme.time.awardTime}</div>
													<div  hidden={programme.bonusStatus != 0}>{programme.time.date + ' ' +programme.time.day + ' ' + programme.time.hours}开奖</div>
												</div>
											</div>
											<div className="delete-btn"  onClick={(e) => this.deleteHandle(e, index, programme.orderId)}><img src={require('../../images/order/delete-recycle.png')}></img> </div>
											</Link>
										</div>

								)
							})

						}

						<ScrollLoad loadMoreFN={() => this.loadData()} isMore={isMore} isShow={lotteryList.length}/>
					</div>
				</DorpDown>
			</div>
		)
	}
	componentDidMount(){
		document.addEventListener('touchstart', this.touchStart, false);
		document.addEventListener('touchmove', this.touchMove, false);
		document.addEventListener('touchend', this.touchEnd, false);
	}
	componentWillUnmount(){
		document.removeEventListener('touchstart', this.touchStart, false);
		document.removeEventListener('touchmove', this.touchMove, false);
		document.removeEventListener('touchend', this.touchEnd, false);
	}
	touchStart(e){

		var touches = e.touches, date = new Date(), box = getParent(e.target, 'show-msg-cont');

		if (!box) return;
		// 单指触摸
		if (touches.length == 1) {
			options.x = touches[0].clientX;
			options.y = touches[0].clientY;
			options.time = date.getTime();
			currPos = getPosX(box)
		}
		function getPosX(obj){

			let re = /d\(([-,0-9]*)px/g;


			let result = re.exec(obj.style.transform) || [];

			return Number(result.length ? result[1] : 0)
		}

	}
	touchMove(e){
		var touches = e.touches[0], iX = 0, tempVar = '', box = getParent(e.target, 'show-msg-cont');

		if (!box) return;
			
		options.iX = touches.clientX - options.x;
		options.iY = touches.clientY - options.y;


		if (Math.abs(options.iY) > Math.abs(options.iX)) {
			isTransform = false;
			// options.iX = 0;
			return;
		}
		if (Math.abs(options.iX) > 60) {
			return;
		};
		isTransform = true;


		// 禁止向右偏移
		if (currPos == 0 && options.iX > 0) return;


		box.style.transform =  'translate3d('+ ( currPos + options.iX) +'px, 0, 0)';


	}
	touchEnd(e){

		var date = new Date(), iDirection = null,
			iX = Math.abs(options.iX), tempVar = '',
			time = (date.getTime() - options.time) < 250, box = getParent(e.target, 'show-msg-cont');

		if (!isTransform || !box) return;

		// 向左
		if (options.iX < 0) {
			if (iX > 10 || time) {
				iDirection = -60;

			} else {
				iDirection = 0;
			}
		} else {
			if (iX > 10 || time) {
				iDirection = 0;

			} else {
				iDirection = -60;
			}
		}

		options.iX = 0;
		options.iY = 0;

		if (iDirection == null) return;

		box.style.transform = 'translate3d('+ iDirection +'px, 0, 0)';
		box.style.transition = '.01s all ease-in';

	}
}

let init = (state) => {
	"use strict";
	return {
		lotteryList: state.lotteryList
	}
}

export default connect(init)(Lottery);