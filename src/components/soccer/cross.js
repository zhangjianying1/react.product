import React from 'react';
import {connect} from 'react-redux';


import {setSoccer, setError} from '../../config/action.js';
import soccerUtil from '../../utils/soccerutil.js';


/**
 * 串关方式选择
 */
class Cross extends React.Component{
	constructor(porps){
		super(porps);
		this.state = {
			crossPass: {
				data: []
			}
		}
	}
	componentWillMount(){

		this.componentWillReceiveProps();
	}
	componentWillReceiveProps(){

		let {soccerData} = this.props,
			{crossPass} = this.state,
			len = soccerUtil.programmeData.length;


		if (!soccerData.active || soccerData.cross.active) return;


		crossPass.data[0] = soccerUtil.crossData[0].slice(0, len);

		// 多串数据
		if (len > 2) crossPass.data[1] = soccerUtil.crossData[len-2]

		if (!soccerUtil.isPass()) {
			crossPass.data[0].splice(0, 1);
		}
		// 默认选中的高亮
		crossPass.data.map(function(cross){
			soccerUtil.listMap(cross, false);

			soccerData.cross.name.map(function(n){
				soccerUtil.listMap(cross, false, n);

			})
		})
		this.setState({
			crossPass: crossPass
		});


	}
	closeView(){
		let {dispatch, soccerData} = this.props;

		dispatch(setSoccer({
			active: true,
			len: soccerData.len,
			data: soccerData.data,
			multiple: soccerData.multiple,
			cross: {
				active: false,
				name: soccerData.cross.name
			},
			bonus: soccerData.bonus
		}))

	}
	touchMoveHandle(e){
		e.preventDefault();
	}
	selectCross(name, wrapIndex, index){

		let {crossPass} = this.state,
			{dispatch, soccerData} = this.props,
			crossArray = [], bBtn = true;

		crossArray = soccerUtil.foundName(crossPass.data);

		// 不能取消全部选择
		//if (crossPass.data[wrapIndex][index].active && crossArray.length == 1) return;
		//

		// 单选
		if (wrapIndex == 1) {

			// 当前已经是选中(则是取消)
			if (crossPass.data[wrapIndex][index].active) {
				bBtn = false;
			} else {
				soccerUtil.listMap(crossPass.data[wrapIndex], false);
			}
		}  else {
			crossArray = soccerUtil.foundName(crossPass.data[wrapIndex]);

			// 多选串关最多选3个
			if (crossArray.length == 3 && !crossPass.data[wrapIndex][index].active) {

				dispatch(setError({
					prompt: true,
					msg: '串关方式不能大于3个'
				}))
				return;
			};
		}
		crossPass.data[wrapIndex][index].active = bBtn ? !crossPass.data[wrapIndex][index].active : bBtn;


		crossArray = soccerUtil.foundName(crossPass.data);


		// 计算奖金
		let bonus = soccerUtil.getPrice(crossArray, soccerData.multiple.name);



		this.setState({
			crossPass: {
				data: crossPass.data
			}
		})

		dispatch(setSoccer({
			active: true,
			len: soccerData.len,
			data: soccerData.data,
			multiple: soccerData.multiple,
			cross: {
				active: true,
				name: crossArray
			},
			bonus: bonus
		}))

	}
	render(){
		let {soccerData} = this.props,
			{crossPass} = this.state;

		if (crossPass.data.length == 0) return null;

		return (
			<div style={{position: 'relative'}} hidden={!soccerData.cross.active}>
				<div className="bottom-mark" onTouchMove={(e) => this.touchMoveHandle(e)} onClick={() => this.closeView()}></div>
				<div className="fixed-bottom-shut" >
					<div className="icon-bottom"></div>
					<div className="shut-cont">
						<div>
							<div className="shut-tit">过关方式</div>
							<div className="shut-list">

								{
									crossPass.data[0].map((item, index) => {

										return (
											<div key={index} className={item.active ? 'middle-btn ' : 'middle-btn  btn-default'}
											     onClick={() => this.selectCross(item.name, 0, index)} >{item.name}</div>
										)
									})
								}


							</div>
						</div>
						{
							crossPass.data.length > 1 ?
								<div>
									<div className="shut-tit">多串过关</div>
									<div className="shut-list">
										{
											crossPass.data[1].map((item, index) => {

												return (
													<div key={index} className={item.active ? 'middle-btn ' : 'middle-btn  btn-default'}
													     onClick={() => this.selectCross(item.name, 1, index)} >{item.name}</div>
												)
											})
										}
									</div>
								</div>
								: null
						}


					</div>
				</div>
			</div>
		)
	}

}
//Cross.propTypes = {
//
//	data: React.PropTypes.object,
//}
let init = (state) => {
	return {
		soccerData: state.soccerData
	}
}
export default connect(init)(Cross);