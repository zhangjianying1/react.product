export let setToken = function (val){
	return {type: 'TOKEN', val};
}


export let loading = function (val){
	return {type: 'LOADING', val};
}
export let setAlert = function (val){
	return {type: 'ALERT', val};
}
export let setConfirm = function (val){
	return {type: 'CONFIRM', val};
}
export let setError = function (val){
	return {type: 'ERROR', val};
}

export let setPrompt = function (val){
	return {type: 'PROMPT', val};
}
/**
 * 竞彩足球编辑数据
 * @param val
 * @returns {{type: string, val: *}}
 */
export let setFBData = function (val){
	return {type: 'FBDATA', val};
}

/**
 * 自助做单
 * @param val
 * @returns {{type: string, val: *}}
 */
export let setSoccer = function (val){
	return {type: 'SOCCER', val};
}

/**
 * 彩票夹
 * @param val
 * @returns {{type: string, val: *}}
 */
export let setLotteryList = function (val){
	return {type: 'LOTTERYLIST', val};
}

/**
 * 彩票详情
 * @param val
 * @returns {{type: string, val: *}}
 */
export let setLottery = function (val){
	return {type: 'LOTTERY', val};
}



/*
 * action types
 */

//export const ADD_TODO = 'ADD_TODO'
//export const TOGGLE_TODO = 'TOGGLE_TODO'
//export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
//
///*
// * other constants
// */
//
//export const VisibilityFilters = {
//	SHOW_ALL: 'SHOW_ALL',
//	SHOW_COMPLETED: 'SHOW_COMPLETED',
//	SHOW_ACTIVE: 'SHOW_ACTIVE'
//}
//
///*
// * action creators
// */
//
//export function addTodo(value) {
//	return { type: ADD_TODO, value }
//}
//
//export function toggleTodo(index) {
//	return { type: TOGGLE_TODO, index }
//}
//
//export function setVisibilityFilter(filter) {
//	return { type: SET_VISIBILITY_FILTER, filter }
//}