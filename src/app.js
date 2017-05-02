
import React from 'react'
import ReactDOM from 'react-dom'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createHashHistory'

//import {browserHistory, Route, Router} from 'react-router';
import {
	HashRouter,
	BrowserRouter,
	Router,
	Route,
} from 'react-router-dom'
//
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import reduces from './config/reducer';
//import { renderRoutes } from 'react-router-config'
//
//const history = createHistory()
//import { BrowserRouter as Router , Route} from 'react-router-dom';

const middleware = routerMiddleware(history);

//const store = createStore(
//	combineReducers({
//		...combineReducer,
//		router: routerReducer
//	}),
//	applyMiddleware(middleware)
//)
const store = createStore(
	combineReducers(reduces),
	applyMiddleware(middleware)
)
import Main from './containers/main.js';
//const getConfirmation = (message, callback) => {
//	const allowTransition = window.confirm(message)
//	callback(allowTransition)
//}
//history={history}
ReactDOM.render(
	<Provider store={store}>
		<HashRouter>
			<Route pattren="/" component={Main} />
		</HashRouter>
	</Provider>,
	document.getElementById('app')
)



