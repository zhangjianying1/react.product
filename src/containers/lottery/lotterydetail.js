import React from 'react';
import {connect} from 'react-redux';

import {
	Link
} from 'react-router-dom';
import {setLottery} from '../../config/action.js';
import Loading from '../../components/loading/Loading';
import BonusNumber from '../../components/bonus/bonusnumber';
import BonusHeader   from '../../components/bonus/bonusheader';
import NumberBall from '../../components/bonus/numberball';
import Header from '../../components/header/header'
import Prize from '../../components/bonus/prize';
import Football from '../../components/bonus/football'
import publicUtil from '../../utils/publicUtil.js';

import Request from '../../utils/request.js';
require('./lotterydetail.scss');
/**
 * 拍彩
 */
class LotteryDetail extends React.Component{
	constructor(props){
		super(props);
		this.request = new Request(this.props);
	}

	componentWillMount(match){

		let oSearch = publicUtil.locationHandle.searchHandle(),
			{dispatch, lotteryData} = this.props;

		this.request.serialPost({
			cmd: '3200',
			func: 'detail',
			data: {
				orderId: oSearch.orderId
			},
			success: (res) => {

				dispatch(setLottery(publicUtil.serializeData(res)))

			}
		});
	}
	goLottery(){

		let {history} = this.props;
		history.push('/lottery');
	}
	goTicket(){
		"use strict";
		let {history, lotteryData} = this.props;

		publicUtil.store.setData('ticket', lotteryData);
		history.push('/ticketList');
	}
	render() {
		
		let {lotteryData, history} = this.props;

		return(
			
			<div className="lottery-detail open-lottery" style={{'paddingBottom': lotteryData.orderType == 'self' ? '60px' : ''}}>
				<Header title="彩票详情" />
				<Loading />
				{
					lotteryData.lotteryCode ? <section>
						<BonusHeader data={lotteryData} />
						<div className="lottery-status">
							<BonusNumber data={lotteryData} />
						</div>

						<div className="bonus-number">
							<div className="bonus-tit">
								<span>彩票信息</span>
								<div className="play-name">
									<div>
										<span hidden="{lotteryData.lotteryCode != '001'}">{lotteryData.playName}</span>
										<span hidden="{lotteryData.lotteryCode == '200'}"> {lotteryData.passModel}</span>
										<span>{lotteryData.multiple}倍</span>
									</div>
								</div>
							</div>
							<div className="bonus-content">
								{
									(lotteryData.lotteryCode == '001' || lotteryData.lotteryCode == '113') ?
										<NumberBall ticketList={lotteryData.ticketList} lotteryStatus={lotteryData.bonusStatus} lotteryCode={lotteryData.lotteryCode} >
											<Price />
										</NumberBall>

										: lotteryData.lotteryCode == '200' ?

										<Football data={lotteryData.matchList} />
										: null

								}

								<div className="price">投入金额{lotteryData.orderAmount}元</div>
								<Prize data={lotteryData} />
							</div>
						</div>
						<div className="back-btns" hidden={lotteryData.orderType == 'self'}>
							<div onClick={() => this.goLottery()}>
								<button className="edit-btn">返回彩票夹</button>
							</div>
						</div>
						<div className="btns" hidden={lotteryData.orderType != 'self'}>
							<div className="btns-content">
								<div onClick={() => this.goLottery()}>
									<button  className="edit-btn" >返回彩票夹</button>
								</div>
								<div>
									<button className="confirm-btn" onClick={() => this.goTicket()}>投注单</button>
								</div>
							</div>
						</div>

					</section>
						: null
				}

			</div>
		
		
		)
	}
}

const Price = (props) => {
	let {bonus} = props;

	return (
		<div className="bonus-price">
			{
				bonus.bonusStatus == 1 ?
					<span>¥{bonus.bonusAmount}</span>
					: bonus.bonusStatus == 2 ?<i className="icon-no-prize" ></i> : null
			}
		</div>
	)
}

let init = (state) => {
	"use strict";
	return {
		lotteryData: state.lotteryData
	}
}

export default connect(init)(LotteryDetail);
