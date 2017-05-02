import React from 'react';
import {connect} from 'react-redux';

import {
	NavLink
} from 'react-router-dom';

import {setLottery} from '../../config/action.js';

import BonusNumber from '../../components/bonus/bonusnumber';
import Loading from '../../components/loading/Loading';
import BonusHeader   from '../../components/bonus/bonusheader';
import NumberBall from '../../components/bonus/numberball';
import Header from '../../components/header/header'
import Prize from '../../components/bonus/prize';
import Football from '../../components/bonus/football'
import publicUtil from '../../utils/publicUtil.js';
import Request from '../../utils/request.js';
require('./cameraresult.scss');
/**
 * 拍彩
 */
class Cameraresult extends React.Component{
	constructor(props){
		super(props);
		this.request = new Request(this.props);

	}
	componentWillMount(){
		let oSearch = publicUtil.locationHandle.searchHandle(),
			{dispatch} = this.props;
		
		this.request.postOnce({
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

	toEditor(lotteryCode) {

		let {history, lotteryData} = this.props;
		publicUtil.store.setData('LOTTERY', lotteryData);
		history.push(lotteryCode == '200' ? '/editorfootball' : '/editorlottery');
	}
	render(){

		let {lotteryData} = this.props;

		return(

			<div className="camera-result">
				<Header title="彩票详情" />
				<Loading />
				{
					lotteryData.lotteryCode ? <section>
						<BonusHeader data={lotteryData} />
						<div className="lottery-status">
							<BonusNumber data={lotteryData} isHide={true}/>
						</div>

						<div className="bonus-number">
							<div className="bonus-tit">
								<span>彩票信息</span>
								<div className="play-name">
									<div>
										<span hidden={lotteryData.lotteryCode != '113'}>{lotteryData.playCode == '02' ? '追加' : '普通'}</span>
										<span hidden={lotteryData.lotteryCode != '200'}> {lotteryData.passModel}</span>
										<span>{lotteryData.multiple}倍</span>
									</div>
								</div>
							</div>
							<div className="bonus-content">
								{
									(lotteryData.lotteryCode == '001' || lotteryData.lotteryCode == '113') ?
										<NumberBall ticketList={lotteryData.ticketList} lotteryStatus={lotteryData.bonusStatus} lotteryCode={lotteryData.lotteryCode} />

										:

										<Football data={lotteryData.matchList} />

								}

								<div className="price">投入金额{lotteryData.orderAmount}元</div>
								<Prize data={lotteryData} />
							</div>
						</div>
						<div className="btns" hidden={lotteryData.lotteryCode != '200' && lotteryData.lotteryCode != '001' && lotteryData.lotteryCode != '113'}>
							<div className="btns-content">
								<div onClick={() => this.toEditor(lotteryData.lotteryCode )}>

									<button type="default" className="edit-btn" >修改</button>
								</div>
								<div>
									<button className="confirm-btn" >确认</button>
								</div>
							</div>
						</div>
					</section>
						:  null
				}

			</div>
		)
	}
}

let init = (state) => {
	"use strict";
	return {
		lotteryData: state.lotteryData
	}
}

export default connect(init)(Cameraresult);
