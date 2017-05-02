import React from 'react';

import {connect} from 'react-redux';

import {Link} from 'react-router-dom';

import Header from '../../components/header/header';
import publicUtil from '../../utils/publicUtil.js';


import request from '../../utils/request.js';

require('./ticketlist.scss');
/**
 * 健康状况详情
 */
class TicketList extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			ticketData: []

		}
		this.serializeData = function(list){
			list.map(function(data){

				data.bonusAmount = Number(data.bonusAmount).toFixed(2);
			})
			return list;
		}


	}

	componentWillMount(){
		let storeData = publicUtil.store.getData("ticket");
		this.setState({
			ticketData: this.serializeData(storeData.ticketList)
		})
	}
	render(){
		const {ticketData} = this.state,
			{history} = this.props;


		return(
			<div className="ticket-list">
				<Header title="投注单" />
				{
					ticketData.map((ticket, index) => {
						return (
							<div key={index} className="order">
								<div className="icon-sign">{index+1}</div>
								<div className="tit">{ticket.playName}</div>
								<div className="column">
									<div className="label">
										<div>场</div>
										<div>次</div>
									</div>
									<div className="order-msg">
										{
											ticket.matchList.map((match, index) => {
												"use strict";
												return (
													<div key={index} className="game">
														<div className="">{match.week + match.sn}</div>
														{
															match.playList.map((play, j) =>{
																return (
																	<div key={j} className="column">
																		<div>
																			<div className=" play-label">{play.playName}</div>
																		</div>
																		{
																			play.termList.map((item, h) => {
																				return (
																					<div key={h} className={item.checked==1 ? 'active' : item.checked==0 ? 'disabled' : ''}>
																						{item.termName} {play.termList.length-1 > index ? ', ' : ';'}
																					</div>
																				)
																			})
																		}
																	</div>
																)
															})
														}
													</div>
												)
											})
										}
									</div>
								</div>
								<div className="column">
									<div className="label">过关方式</div>
									<div className="order-msg">{ticket.passModel}</div>
								</div>
								<div className="column">
									<div className="label">
										<div>倍</div>
										<div>数</div>
									</div>
									<div className="order-msg">
										{ticket.multiple}倍
									</div>
								</div>
								<div className="column">
									<div className="label">
										<div>奖</div>
										<div>金</div>
									</div>
									<div className="order-msg" hidden="{ticket.bonusStatus == 2}">未中奖</div>
									<div className="order-msg" hidden="{ticket.bonusStatus == 1}">{ticket.bonusAmount}</div>
								</div>
							</div>
						)
					})
				}
				
				<button onClick={history.goBack} className="big-btn" hidden={ticketData.length}>返回详情</button>
			</div>
		)
	}

}


export default connect()(TicketList);