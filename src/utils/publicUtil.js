import footballUtil from './footballutil.js';
import fcUtil from './fcutil.js';
import Request from './request.js';
import {setError} from '../config/action.js';

// 全局  
var publicUtil = {
	/**
	 * 缓存数据
	 */
	store: {
		setData: function(key, data){


			if (typeof data != 'string') {
				try {
					data = JSON.stringify(data);

				} catch (e) {

				}
			}
			localStorage.setItem(key, data);
		},
		getData: function(key){

			let result = localStorage.getItem(key);

			if (!result) return ''

			try {
				result = JSON.parse(result);

			} catch (e) {

			} finally{
				return result;
			}


		}
	},
	/**
	 * 处理url search
	 */
	locationHandle: {
		searchHandle: function() {

			let result = {};
			let str = location.href.substring(location.href.indexOf('?') + 1);
			str = str.replace(/[\?\#]/g, '&');
			let tempArr = str.split('&');
			tempArr.map((item) => {
				let index = item.indexOf('=');

				if (index > -1) {
					result[item.substring(0, index)] = item.substring(index+1)
				}
			})

			return result;
		}
	},
	/**
	 * 开奖兑奖时间处理
	 * @param bonusMsg{Object}
	 */
	timeHandle: function(bonusMsg){
		var date = null, day, result = {}

		// 待开奖
		if (bonusMsg.openTime) {


			date = new Date(bonusMsg.openTime);

			switch (date.getDay()) {
				case 1:
					day = '周一';
					break;
				case 2:
					day = '周二';
					break;
				case 3:
					day = '周三';
					break;
				case 4:
					day = '周四';
					break;
				case 5:
					day = '周五';
					break;
				case 6:
					day = '周六';
					break;
				case 0:
					day = '周日';
					break;
				//default;
			}
			result.date =  (date.getMonth() + 1) + '月' + date.getDate() + '日';
			result.hours =  repair(date.getHours()) +':'+ repair(date.getMinutes());
			result.day =  day;

		}
		if (bonusMsg.awardTime){

			date = new Date(bonusMsg.awardTime);

			result.awardTime =  date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'

		}
		if (bonusMsg.buyTime){
			date = new Date(bonusMsg.buyTime);

			result.buyTime = date.getFullYear() + '-' + repair(date.getMonth() + 1) + '-'
				+ repair(date.getDate()) + ' ' + repair(date.getHours()) +':'+ repair(date.getMinutes()) + ':' + repair(date.getSeconds())


		}
		return result;

		function repair(str){
			str = Number(str);


			if (str < 10) {
				return '0' + str;
			}
			return str;
		}
	},
	/**
	 * 生成好识别的数字 例：（23,333,333元）
	 * @param num {Number}
	 * @return
	 */
	filterNumber: function(num){

		var num = num + '';
		var index = num.indexOf('.');

		var endStr = num.substring(index);
		var result = '';

		if (index > -1) {
			num = num.substring(0, index);
		}

		var tempArr = num.split('');
		tempArr = tempArr.reverse();
		var i = tempArr.length;
		while (i--) {
			result += tempArr[i];
			if ((i % 3 == 0 && i != 0)) {
				result += ','
			}

		}
		if (index > -1) {
			result = result + endStr;
		}
		return result;
	},
	/**
	 * 解析并重构成页面可用的渲染数据
	 * @param data {Object} 源数据
	 */
	serializeData: function(data){
		var This = this;

		if (data.lotteryCode == '200') {
			footballUtil.serializeFootball(data);
		} else {
			data.bonusNumbers = fcUtil.splitBoll(data.issue.bonusNumber, data.issue.bonusNumber);

			data.ticketList.map(function(val){
				val.numbers = fcUtil.splitBoll(val.number, data.issue.bonusNumber);
				val.bonusAmount = This.filterNumber(val.bonusAmount);
			})
		}



		try {
			Array.isArray(data.bonusClass) && data.bonusClass.map(function(val){
				val.totalAmount = This.filterNumber(val.totalAmount);
			});
			data.bonusAmount = This.filterNumber(data.bonusAmount);
			data.issue.time = This.timeHandle({status: data.bonusStatus, awardTime: data.issue.awardTime, openTime: data.issue.openTime, buyTime: data.buyTime});
		} catch (e) {

		}

		return data;

	},
	serializeOrderList: function(orderList){

		orderList.map(function(val){

			if (val.lotteryCode == '200') {
				footballUtil.serializeFootball(val);
			}

			val.time = publicUtil.timeHandle({status: val.bonusStatus, awardTime: val.awardTime, openTime: val.openTime, buyTime: val.buyTime});

			val.bonusAmount = publicUtil.filterNumber(val.bonusAmount);
			val.numberInfo && val.numberInfo.map(function(number){
				number.numbers = fcUtil.splitBoll(number.number, val.bonusNumber) ;
			})

		});

		return orderList;
	},

	/**
	 * 投注倍数修改
	 * @param key {String} 判断加减 0 => 减 1 =》 加
	 * @param num {Number}
	 */
	changeMultiple: function(key, num){
		var result = {
			reduce: true,
			plus: true
		};

		if (key) {
			// 减
			if (key == '0') {
				num --;
			} else {
				num ++;
			}
		}

		if (num < 2) {
			result.reduce = false;
		}

		if (num > 98) {
			result.plus = false;
		}
		result.num = num < 1 ? 1 : num > 98 ? 99 : num;

		return result;
	},



	/**
	 * 获取投注号码
	 */
	getNumberList: function(data){
		var result;
		switch (data.lotteryCode) {
			case '001':
				result = fcUtil.getNumberList(data.ticketList, data.multiple, data.lotteryCode);
				break;
			case '113':
				result = fcUtil.getNumberList(data.ticketList, data.multiple, data.lotteryCode);
				break;
			case '200':
				result = footballUtil.getNumberList(data.ticketList[0])
				break;
			// default
		}

		return result;
	},
	validateNumber: function(data){
		var result;

		switch (data.lotteryCode) {
			case '001':
				result = fcUtil.validataNumber(data, {issue: {msg: '期次不能为空'}, multiple: {msg: '倍数不能为空'}, orderAmount: {msg: '订单金额不能为空'}, ticketList: {}});
				break;

			case '200':
				result = footballUtil.validateFootball(data.ticketList[0].matchList);
				break;

			// default
		}
		return result;

	},
	isexits: function(arr, val){
		var bBtn = -1;

		arr.map(function(o, index){

			if (val == o) {
				bBtn = index;
			}
		})

		return bBtn;
	},
	/**
	 * 是不是对象
	 */
	isObject: function(obj){
		return obj.toString() == "[object Object]"
	},
	// 深拷贝
	extend: function(oA, oB){


		// 数组
		if (Array.isArray(oA)) {
			for (var i = 0; i < oB.length; i ++) {

				if (Array.isArray(oB[i])) {

					if (!oA[i]) {
						oA[i] = [];
					}
					publicUtil.extend(oA[i], oB[i]);
				} else {
					oA[i] = oB[i];
				}
			}
		} else {
			for (var o in oB) {

				if (publicUtil.isObject(oB[o])) {
					if (!oA[o]) {
						oA[o] = {};
					}

					publicUtil.extend(oA[o], oB[o]);
				} else {
					oA[o] = oB[o];
				}
			}
		}
		return oA;
	},
	/**
	 * 获取二维数组最小的数组
	 * @params arr{Array} 纯Number类型元素
	 * @param sign {String} 是找最小数组还是最大数组 'min' =》 最小数组 'max' => 最大数组
	 * @returns result {Number} 所在位置的索引
	 */
	getArrayIndex: function(arr, sign){
		var result = 0;
		var num = (sign === 'min') ? 100000000 : -1;


		arr.map(function(val, i){

			if ((sign == 'min' && val < num) || (sign == 'max' && val > num)) {
				num = val;
				result = i;
			}
		})

		return result;
	},
	/**
	 * 组合
	 */
	combination: function(arr, n, z) { // z is max count
		z=1000000;
		var r = [];

		fn([], arr, n);
		return r;
		function fn(t, a, n) {
			if (n === 0 || z && r.length == z) {
				return r[r.length] = t;
			}
			for (var i = 0, l = a.length - n; i <= l; i++) {
				if (!z || r.length < z) {
					var b = t.slice();
					b.push(a[i]);
					fn(b, a.slice(i + 1), n - 1);
				}
			}
		}
	}
}
export default publicUtil;
