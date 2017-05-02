import React from 'react';


require('./bonusnumber.scss');

import {
	Link,
	NavLink
} from 'react-router-dom'
/**
 * 竞彩足球
 */
class Football extends React.Component{
	constructor(porps){
		super(porps);
	}
	componentDidMount(){



	}
	render(){
		let {data} = this.props;
		return (
			<div>
				<div className="football-options column-football">
					<div>场次</div>
					<div></div>
					<div>主队</div>
					<div></div>
					<div>客队</div>
					<div><text>赛果</text></div>
				</div>
				{
					data.map((match, index) => {
						return (
							<div className="football" key={index}>
								<div className="column-football">
									<div>{match.week + match.sn}</div>
									<div  className={match.letBall < 0 ? 'c-green' : 'c-red'}>
										{match.letBall}
									</div>
									<div>{match.mainTeam}</div>
									<div>VS</div>
									<div>{match.guestTeam}</div>
									<div></div>
									<div className="football-result" hidden={match.mainTeamScore === ''}>
										<div className="f-r-score">{match.mainTeamScore} - {match.guestTeamScore}</div>
										<div className="f-r-half-score">半 {match.mainTeamHalfScore}-{match.guestTeamHalfScore}</div>
									</div>
								</div>
								<div className="football-label small-distance">
									{
										match.playList.map((play) => {
											return play.termList.map((item, i) => {
												return (
													<div key={i} className={item.checked == 1 ? 'active' : item.checked == 0 ? 'disabled' : ''}>
														{item.termName}<text> {item.sp}</text>
													</div>
												)
											})
										})
									}
								</div>
							</div>
						)
					})
				}

			</div>
		)
	}

}
//Football.propTypes = {
//	data: React.PropTypes.Func,
//}
export default Football;