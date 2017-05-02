import React from 'react';


require('./bonusnumber.scss');

import {
	Link,
} from 'react-router-dom'
/**
 * 设置标题和加载数据
 */
class BonusNumber extends React.Component{
	constructor(porps){
		super(porps);
	}
	componentDidMount(){

	

	}
	render(){
		let {data, isHide} = this.props;

		return (
			<div className="bonus-number">
				<div className="bonus-tit">
					<span hidden={data.lotteryCode == '200'}>开奖号码</span>
					<span hidden={data.lotteryCode != '200'}>开奖状态</span>
					{
						data.lotteryCode == '200' && !isHide ?
							<Link className="icon-live"
							      to={`/livescore?orderId=${data.orderId}`}>
								<img src={require('../../images/order/live.png')} ></img>
								<div>比分直播</div>
							</Link>
							: null
					}

				</div>
				<div className="boll-number">
					{
						data.lotteryCode != '200' ?
							<div  hidden={data.bonusStatus == 0} className={(data.lotteryCode == '108' || data.lotteryCode == '109') ? 'boll distance-40' : 'boll'}>

								{
									data.bonusNumbers.map((nums, i) => {

										return nums.map((num, index) => {

											return (
												<div key={index}  className="active">{num.number}</div>

											)
										})


									})
								}


							</div>
							: null
					}
					{
						data.bonusStatus == 0 ?
							<div className="wait-text" >待开奖</div>
							: data.bonusStatus == 2 && data.lotteryCode == '200' ?
							<div className="wait-text c-353535" >未中奖</div>
							: data.lotteryCode == '200' && data.bonusStatus == 1 ?
							<div className="wait-text c-red" >已中奖</div>
							: null

					}


				</div>
			</div>
		)
	}

}
BonusNumber.propTypes = {

	data: React.PropTypes.object,
}
export default BonusNumber;