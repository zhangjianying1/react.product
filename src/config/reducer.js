

// 用户信息
let token = (state='', action) => {
	switch(action.type) {
		case 'TOKEN':
			return action.val
			break;
		default:
			return state;
	}
};

// 彩票详情信息
let lotteryData = (state={}, action) => {
	switch(action.type) {
		case 'LOTTERY':
			return action.val
			break;
		default:
			return state;
	}
};

// 微信的个人信息
let WEIXINData = (state='', action) => {
	switch(action.type) {
		case 'WEIXIN':
			return action.val
			break;
		default:
			return state;
	}
};
//加载状态
let loadingData = (state='', action) => {
	switch(action.type) {
		case 'LOADING':
			return action.val
			break;
		default:
			return state;
	}
};
//确定提示框
let confirmData = (state={}, action) => {
	switch(action.type) {
		case 'CONFIRM':
			return action.val
			break;
		default:
			return state;
	}
};
//alert提示
let alert = (state='', action) => {
	switch(action.type) {
		case 'ALERT':
			return action.val
			break;
		default:
			return state;
	}
};
//error
let error = (state='', action) => {
	switch(action.type) {
		case 'ERROR':
			return action.val
			break;
		default:
			return state;
	}
};

//信息填写不完整的提示
let prompt = (state='', action) => {
	switch(action.type) {
		case 'PROMPT':
			return action.val
			break;
		default:
			return state;
	}
};

//自助做单
let soccerData = (state='', action) => {
	switch(action.type) {
		case 'SOCCER':
			return action.val
			break;
		default:
			return state;
	}
};



//竞彩足球
let FBData = (state='', action) => {
	switch(action.type) {
		case 'FBDATA':
			return action.val
			break;
		default:
			return state;
	}
};

//彩票夹
let lotteryList = (state=[], action) => {
	switch(action.type) {
		case 'LOTTERYLIST':
			return action.val
			break;
		default:
			return state;
	}
};



export default {
	lotteryList,
	token,
	loadingData,
	confirmData,
	alert,
	error,
	lotteryData,
	soccerData,
	FBData,
	prompt
}