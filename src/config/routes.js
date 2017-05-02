//const getComponentLazily = (importor, name = 'default') => {
//	return (location, cb) => {
//		importor.then((module) => {
//			//如果是默认模块，则是 module.default
//			cb(null, module[name]);
//		})
//			.catch((err) => {
//				console.error(`动态路由加载失败：${err}`)
//			});
//	}
//};
////
//export default {
//	component: require('../containers/Main').default,
//	childRoutes: [
//
//		{ path: '/camera',
//			getComponents: (location, cb) => {
//				return getComponentLazily(System.import('../containers/cameraentry/Cameraentry'), 'Main')
//				//return require.ensure([], (require) => {
//				//	cb(null, require('../containers/cameraentry/Cameraentry').default)
//				//})
//			}
//		}
//	]
//}
import Cameraentry from '../containers/cameraentry/cameraentry.js';
import Uploadphoto from '../containers/uploadphoto/uploadphoto.js';
import Lottery from '../containers/lottery/Lottery.js';
export const routes = [
	{
		path: '/camera',
		component: Cameraentry
	},
	{
		path: '/upload',
		component: Uploadphoto
	},
	{
		path: '/cameraresult',
		component: require('../containers/cameraresult/cameraresult').default,

	},
	{
		path: '/editorlottery',
		component: require('../containers/editorlottery/editorlottery').default
	},
	{
		path: '/editorfootball',
		component: require('../containers/editorfootball/editorfootball').default
	},
	{
		path: '/lottery',
		component: Lottery
	},
	{
		path: '/lotterydetail',
		component: require('../containers/lottery/lotterydetail').default
	},
	{
		path: '/livescore',
		component: require('../containers/livescore/livescore').default
	},
	{
		path: '/ticketlist',
		component: require('../containers/ticketlist/ticketlist').default
	},
	{
		path: '/soccer',
		component: require('../containers/soccer/soccer').default
	},
	{
		path: '/soccerother',
		component: require('../containers/soccer/soccerother').default
	}


]

//export const routes = [
//	{ component: Main,
//		routes: [
//			{ path: '/camera',
//				exact: true,
//				component: require('../containers/cameraentry/Cameraentry').default
//			},
//			{ path: '/lottery',
//				component: require('../containers/lottery/Lottery').default,
//				//routes: [
//				//	{ path: '/child/:id/grand-child',
//				//		component: GrandChild
//				//	}
//				//]
//			}
//		]
//	}
//]
//export default  {
//	path: '/',
//	indexRoute: {
//		component: require('../containers/cameraentry/Cameraentry')
//	},
//	getComponent(nextState, cb) {
//		require.ensure([], (require) => {
//			cb(null, require('../containers/lottery/Lottery'))
//		})
//	},
//	childRoutes: [
//
//	]
//}
