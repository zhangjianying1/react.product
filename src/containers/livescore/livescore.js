import React from 'react';
import publicUtil from '../../utils/publicUtil.js';
import Header from '../../components/header/header';

import Request from '../../utils/request.js';

require('./livescore.scss');

let timeOut = null, bBtn = true;

/**
 * 修改
 */
class LiveScore extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			matchList: [],
			allEnd: 0
		}
		this.request = new Request(this.props);
		console.log('live')
	}
	componentWillMount(){

		if (!bBtn) return;
		bBtn = false;

		let This = this,
			oSearch = publicUtil.locationHandle.searchHandle();

		this.request.serialPost({
			cmd: '3202',
			func: 'live',
			data: {orderId: oSearch.orderId},

			success:  (res) => {

				var tempData = res.liveList;
				tempData.map(function (live) {
					live.matchTime = formatTime(live.matchTime);
					live.realMatchTime = formatTime(live.realMatchTime);
				})

				this.setState({
					matchList: res.liveList,
					allEnd: res.allEnd
				})

				// 比赛进行中
				if (this.state.allEnd == 0) {

					timeOut = setTimeout(this.componentWillMount.bind(this), 30000)
				}
				bBtn = true;
			}

		});
		function formatTime (timeLong) {
			var date = new Date(timeLong);
			return repair(date.getHours()) + ':' + repair(date.getMinutes());
			function repair(str) {
				str = Number(str);


				if (str < 10) {
					return '0' + str;
				}
				return str;
			}
		}
	}
	componentWillUnmount(){
		clearTimeout(timeOut);
	}
	refresh () {
		clearTimeout(timeOut);
		this.componentWillMount();
	}
	render(){

		let {matchList, allEnd} = this.state,
			{history} = this.props;

		return(
			<div className="live-score">
				<Header title="比分直播" />
				<div>
					{
						matchList.map((match, index) => {
							return (
								<div className="live-team" key={index}>
									<div className="team-header">

										<i className={
											match.status == 0 ? 'icon-football wait' : (match.status == 1 || match.status == 11) ? ' icon-football in '
											: 'icon-football'

										}>
										</i>
										<div className="issue-label">{match.week + '' +match.sn + ' ' +match.matchName}</div>
									</div>
									<div hidden={match.status != 0}>
										<div className="team-body">
											<div className="column">
												<div>{match.mainTeam}</div>
												<div className="c-blue">{match.matchTime} 比赛</div>
												<div>{match.guestTeam}</div>
											</div>
										</div>
										<div className="hr"></div>
										<div className="left-hr"></div>
									</div>
									<div hidden={match.status == 0}>
										<div className="team-body">
											{
												match.status == 2 ?
													<div className="team-start-time" >{match.realMatchTime}</div>
													:
													<div className="team-start-time">
														<image src="../../images/order/time.png"></image>
														{match.status == 1 ? match.startTimes : '中场'}
													</div>
											}

											<div className="column">
												<div>{match.mainTeam}</div>
												<div className="score-number">{match.mainTeamScore} - {match.guestTeamScore}</div>
												<div>{match.guestTeam}</div>
											</div>
											<div className="half-socre">半 {match.mainTeamHalfScore} - {match.guestTeamHalfScore}</div>
										</div>
										<div className="hr"></div>
										<div className="left-hr"></div>
									</div>
								</div>
							)
						})
					}

				</div>
				{
					matchList.length ?
						<button className="big-btn" onClick={history.goBack} hidden={matchList.length}>返回详情</button>
						: null
				}
				{
					matchList.length && !allEnd ?
						<i onClick={() => this.refresh()} className="icon-refresh">
						</i>
						: null
				}

			</div>
		)
	}
}


export default LiveScore;
