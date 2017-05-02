import React from 'react';

require('./bonusheader.scss');

import {
	Link,
	NavLink
} from 'react-router-dom'
/**
 * 设置标题和加载数据
 */
class BonusHeader extends React.Component{
	constructor(porps){
		super(porps);
	}
	componentDidMount(){



	}
	render(){
		let {data} = this.props;

		return (
			<div className="lottery-msg">
				<div className="image-box">
					<img src={require(`../../images/${data.lotteryCode}.png`)} />
				</div>
				<div className={data.bonusStatus == 2 ? 'lottery-issue align-center' : 'lottery-issue'}>
					<div className="issue-number">
						<div className="lottery-name">{data.lotteryName}</div>
						<div hidden="{data.lotteryCode == '200'}">第{data.issue.issue}期</div>
						<div className="fs-14 c-888" hidden={data.lotteryCode != '200'}>{data.issue.time.buyTime}</div>
					</div>
					<div className="time" hidden={data.bonusStatus != 0}>
						{data.issue.time.date + data.issue.time.day + data.issue.time.hours}开奖
					</div>
					<div className="time" hidden={data.bonusStatus != 1}>兑奖截止日期：{data.issue.time.awardTime}</div>
					{
						data.bonusStatus == 2 && !data.show ?
							<div className="time" >很遗憾，您的彩票未中奖</div>
							: null
					}

				</div>
			</div>
		)
	}

}
BonusHeader.propTypes = {

	data: React.PropTypes.object,
}
export default BonusHeader;