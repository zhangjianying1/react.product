import React from 'react';

require('./bonusheader.scss');

import {
	Link,
	NavLink
} from 'react-router-dom'
/**
 * 设置标题和加载数据
 */
class Prize extends React.Component{
	constructor(porps){
		super(porps);
	}
	componentDidMount(){



	}
	render(){
		let {data} = this.props;
console.log(data)
		if (!Array.isArray(data.bonusClass)) {
			return null;
		}
		return (
			<div >
				<div className="prize-amount"  hidden={data.bonusStatus != 1}>
					{
						data.lotteryCode != 200 ?
							<div className="amount">
								<img src={require('../../images/jiangjin.png')}></img>
								<div className={data.bonusClass.length == 1 ? 'show-amount align-center': 'show-amount'} >
									{
										data.bonusClass.map((item, index) => {
											return (
												<div key={index}>{item.name + '' + item.num}注，奖金<span className="c-red"> {item.totalAmount} </span>元
												</div>
											)
										})
									}

								</div>
							</div>
							: null
					}

					<div className="count-amount" hidden={data.lotteryCode != '001' && data.lotteryCode != '113'}>奖金共<span className="c-orange"> {data.bonusAmount} </span>元</div>
					<div className="count-amount" hidden={data.lotteryCode != '200'}>奖金<span className="c-orange"> {data.bonusAmount} </span>元</div>
				</div>
				
				{
					data.lotteryCode == '200' && data.bonusStatus != 1 ?
						<div className="count-amount">理论奖金<span className="c-orange"> {data.theoryBonus} </span>元</div>
						: null

				}
			</div>
		)
	}

}
Prize.propTypes = {

	data: React.PropTypes.object,
}
export default Prize;