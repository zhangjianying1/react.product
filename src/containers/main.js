import React from 'react'

import {connect} from 'react-redux';
import publicUtil from '../utils/publicUtil.js';
import Confirm from '../components/dialog/Confirm';
import Error from '../components/dialog/Error';
import {setToken} from '../config/action.js';
import Request from '../utils/request.js';
require('./main.scss');
import {
	BrowserRouter as Router,
	Route,
	Link,
	NavLink,
	HashRouter
} from 'react-router-dom'

import {routes} from '../config/routes.js';




// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = (route) => (
	<Route path={route.path} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
)


class Main extends React.Component{
	constructor(props){
		super(props);
		this.request = new Request(this.props);
	}
	componentWillMount(){


		let {dispatch} = this.props,
			oSearch = publicUtil.locationHandle.searchHandle(),
			authCode = oSearch.code,
			token = publicUtil.store.getData('token');

		// 需要用户信息的页面
		if (authCode && !token) {

			// 注册用户,并返回该用户的相关信息
			this.request.serialPost({
				func: 'weixin',
				cmd: '3101',
				data: {
					authCode: authCode
				},
				success: (res) => {

					// authCode码 错误
					if (res == '0999') {

						window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3b428b4b935fa86b&redirect_uri=" + encodeURIComponent('http://' +
								window.location.host + location.hash) + "&response_type=code&scope=snsapi_userinfo&state=STATE&connect_redirect=1#wechat_redirect";
						return;
					} else {
						//dispatch(setToken(res.token));
						publicUtil.store.setData('token', res.token);
					}
				}
			})
		} else {

		}


		//const {dispatch}  = this.props;
		//

//<footer>
		//	<ul>
		//		<li><NavLink to="/camera" activeClassName="active">
		//			<i className="icon-camera"></i>拍彩
		//		</NavLink></li>
		//		<li><NavLink to="/lottery" activeClassName="active">
		//			<i className="icon-lottery"></i>彩票夹
		//		</NavLink></li>
		//		<li><NavLink to="/cameraresult" activeClassName="active">
		//			<i className="icon-lottery"></i>彩票夹
		//		</NavLink></li>
		//	</ul>
		//</footer>



	}
	render(){

		return (<HashRouter>

				<section>

					{routes.map((route, i) => (
						<RouteWithSubRoutes key={i} {...route}/>
					))}
					<Confirm />
					<Error />
				</section>
			</HashRouter>
		)
	}
}

let init  = (state) => {
	return {
		token: state.token
	}
}


export default connect()(Main);