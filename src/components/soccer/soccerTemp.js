import React from 'react'
const SoccerTemp = (props, fns) => {

	let {matchList, toggleShow, selectResult, goMore} = props;


	return (
		<section>
		{
			matchList.map((match, index) => {
				return (
					<div key={index} hidden={match.matchTotal == 0}>

						<div className="soccer-header" onClick={() => toggleShow(index)}>
							{match.date}
							<text>共{match.matchTotal}场</text>
							<div className={match.active ? 'icon-more open' : 'icon-more'}><img src={require('../../images/order/shouqi.png')}></img></div>
						</div>
						<div className="soccer-body" hidden={!match.active}>
							{
								match.match.map((match, i) => {
									return(
										<div key={i} hidden={match.isHide}>
										<div className="soccer-number"><img src={require('../../images/ic-changci.png')} ></img>
											{match.key} {match.matchName}<text className="pl-15">{match.endTime} 截止</text></div>

										<div className="soccer-team">
											<div className="column">
												<div className="soccer-name">{match.mainTeam}</div>
												<div className="soccer-name">VS</div>
												<div className="soccer-name">{match.guestTeam}</div>
											</div>
											<div className="column">
												{
													match.spfSp.map((item, j) => {

														return (
															<div key={j}
															     onClick={() => selectResult(index, i, j, match.issue, match.spfSingle, item.sp, '', match.sn, 'spfSp')}
															     className={item.active ? 'soccer-btn active' : 'soccer-btn' }>
																{item.name}<text> {item.sp}</text></div>
														)
													})
												}
												{
													match.spfSingle == 1 ?
													<img className="soccer-shut" src={require('../../images/order/danguan.png')}></img>
														: null
												}

											</div>
											{
												match.spfSingle != -1 ?
													<div className="column" >
														{
															match.rqspfSp.map((item, j) => {
																return (
																	<div key={j}
																	     onClick={() => selectResult(index, i, j, match.issue, match.rqspfSingle, item.sp, match.letBall, match.sn, 'rqspfSp')}
																	     className={item.active ? 'soccer-btn  active' : 'soccer-btn ' }>
																		{item.name} <text> {item.sp}</text></div>
																)
															})
														}

														<div className={match.letBall < 0 ? 'soccer-let-boll c-green' : 'soccer-let-boll c-red'}>{match.letBall}</div>
													</div>
													: null
											}

										</div>
										<div className={match.otherResult ? 'middle-btn more btn-active' : 'middle-btn more '}  hidden={match.spfSingle <= -1}
										     onClick={() => goMore(index, i)}>{match.otherResult ? match.otherResult : '更多玩法'}</div>
									</div>
									)
								})
							}
						</div>
					</div>
				)
			})
		}
	</section>

	)
}

export default  SoccerTemp