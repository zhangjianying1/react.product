import React from 'react';


require('./bonusnumber.scss');

import {
	Link,
	NavLink
} from 'react-router-dom'
/**
 * 数字彩
 */
class NumberBall extends React.Component{
	constructor(porps){
		super(porps);
	}
	componentDidMount(){
	}
	fnHandle(e, index){
		let {fn} = this.props;

		if (fn) fn(e, index);
	}
	render(){
		let {lotteryCode, ticketList, lotteryStatus, children} = this.props;

		let renderPrice = (children, list) => {

			if (!children) return null;

			return React.cloneElement(children, {
				bonus: list
			})
		}
		return (
			<div>
				<div className="bonus-options">
					<div >选号</div>
					<div className="b-options-price"></div>
				</div>
				{
					ticketList.map((list, index) => {
						"use strict";
						return (
							<div className="boll-box" key={index} onClick={(e) => this.fnHandle(e, index)}>
								{
									lotteryCode == '113' && list.numbers[0].length <= 5 && list.numbers[1].length <= 2 || lotteryCode == '001' && list.numbers[0].length <= 6 && list.numbers[1].length <= 1 ?


										<div className="boll one-boll">
											{
												list.numbers.map((nums, i) => {

													return nums.map((num, j) => {

														return (
															<div key={j}  className={num.active && lotteryStatus != 0 ? i == 0 ? 'active' : 'blue active' : i == 0 ? '' : 'blue'}>{num.number}</div>

														)
													})


												})
											}

										</div>
										: lotteryCode == '113' && list.numbers[0].length > 5 || lotteryCode == '113' && list.numbers[1].length > 2 || lotteryCode == '001' && list.numbers[0].length > 6 || lotteryCode == '001' && list.numbers[1].length > 1 ?
										<div className="multiple-boll" onClick={(e) => this.fnHandle(e, index)}>
											{
												list.numbers.map((nums, i) => {
													return (
														<div className="boll-item" key={i}>
															<div className="tit">{lotteryCode == '001'  ? i == 0 ? '红球' : '篮球' : i== 0 ? '前区' :  '后区'}</div>
															<div className="boll">
																{
																	nums.map((num, j) => {

																		return (
																			<div key={j}  className={num.active && lotteryStatus != 0 ? i == 0 ? 'active' : 'blue active' : i == 0 ? '' : 'blue'}>{num.number}</div>

																		)
																	})
																}
															</div>
														</div>
													)
												})
											}

										</div>
										: ''
								}
								{renderPrice(children, list)}
							</div>
						)
					})
				}



			</div>
		)
	}

}
NumberBall.propTypes = {

	data: React.PropTypes.object,
}
export default NumberBall;