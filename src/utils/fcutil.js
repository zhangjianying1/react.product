

var fcUtil = {
	/**
	 * 是否有匹配
	 */
	isexist: function (nums, num){
		var result = false;
		Array.isArray(nums) && nums.map(function(val){

			if (num == val) {
				result = true
			}
		});

		return result;
	},
	/**
	 * 验证号码
	 * @params data {Object}
	 * @param obj {Object} 例：{issue: {'msg: '期次不能为空', pattern: /\w/}, numbers: {}}
	 */
	validataNumber: function (data, obj){

		var msg='';
		Object.keys(obj).map(function(val, key){

			// 没有值
			if (!data[val]) {
				msg = data[val].msg;
			}
			if (val == 'issue') {
				if (!data[val].issue) {
					msg = '彩期不能为空'
				}
			}
			if (val == 'ticketList') {
				if (!validataNumber(data[val], data.lotteryCode)) {
					msg = '投注号码不完整';
				}
			}

		})

		return msg;

		/**
		 * 验证号码
		 */
		function validataNumber(list, lotteryCode){
			var result = true;
			list.map(function(val){

				switch (lotteryCode) {

					// 双色球
					case '001':
						if (!val.numbers[0] || (val.numbers[0].length < 6) || !val.numbers[1] || (val.numbers[1].length < 1)) {
							result = false;
						}
						break;
					// 大乐透
					case '113':
						if (!val.numbers[0] || (val.numbers[0].length < 5) || !val.numbers[1] || (val.numbers[1].length < 2)) {
							result = false;
						}
						break;
					// 排列三
					case '108':
						if (!val.numbers[0] || (val.numbers[0].length < 3)) {
							result = false;
						}
						break;
					// 排列五
					case '109':
						if (!val.numbers[0] || (val.numbers[0].length < 5)) {
							result = false;
						}
						break;
				}

			})

			return result;
		}
	},
	/**
	 * 处理投注号码生成后台制定的格式
	 * @param list {Array}  选号数组
	 * @param multiple {Number} 倍数
	 * @param lotteryCode {String} 彩种
	 */
	getNumberList: function (list, multiple, lotteryCode){
		var result = [],
			This = this,
			item,
			numFirst, numSeconde, pollCode;


		list.map(function(val){
			numFirst = val.numbers[0].length;
			numSeconde = Array.isArray(val.numbers[1]) && (val.numbers[1].length || 1)
			item = This.getGroup(numFirst, numSeconde, lotteryCode);

			// 双色球
			if (lotteryCode == '001') {
				pollCode = val.numbers[0].length > 6 || val.numbers[1].length > 1 ? '02' : '01';
			} else if (lotteryCode == '113') {
				pollCode = val.numbers[0].length > 5 || val.numbers[1].length > 2 ? '02' : '01'
			}
			console.log(playCode)
			result.push({
				number: getNumber(val.numbers),
				playCode: val.playCode || '01',
				pollCode: pollCode,
				multiple: val.multiple || '',
				amount: val.amount || item * 2 * multiple,
				item: val.item || item
			})

		})

		return result;


		function getNumber(numbers){
			var result = [];

			if (Array.isArray(numbers)) {
				result = numbers.map(function(val){

					if (Array.isArray(val)) {
						return val.map(function(v){
							return v.number
						}).join(',');
					}

				})
			}
			return result[0] + '#' + result[1];
		}
	},
	/**
	 * @params red {number} 红球数量
	 * @params blue {number} 篮球数量
	 * @param  number{限定组合的位数}
	 * @param lotteryCode{String} 彩种
	 */

	getGroup: function(red, blue, lotteryCode){
		var result;

		switch (lotteryCode) {

			case '001':
				result = (recursion(red) / (recursion(6) * recursion(red-6))) * blue;
				break;
			case '113':
				result = (recursion(red) / (recursion(5) * recursion(red-5))) * (recursion(blue) / (recursion(2) * recursion(blue-2)));
				break;
			// default
		}

		return result;
		function recursion(num){
			if (num <= 1) {
				return 1;
			} else {
				return recursion(num - 1) * num;
			}
		}
	},
	/**
	 * 截取号码
	 * @param bollStr {String} 带#号的彩票号码
	 * @param original {String} 开奖号码
	 */
	splitBoll: function(ballStr, originalBall){
		var This = this;
		if (!ballStr) ballStr = '';
		if (!originalBall) originalBall = '';

		var tempBalls = ballStr.split('#'),
			originalBall = originalBall.split('#'),
			newOriginalBall = [],
			result = [], bBtn;

		// 开奖号码
		originalBall.map(function(val, index){
			newOriginalBall[index] = val.split(',');
		})

		tempBalls.map(function(val, index){

			val.split(',').map(function(num){

				if (This.isexist(newOriginalBall[index], num)) {
					bBtn = true;
				} else {
					bBtn = false;
				}
				if (!Array.isArray(result[index])) {
					result[index] = [{
						number: num,
						active: bBtn
					}];
				} else {
					result[index].push({
						number: num,
						active: bBtn
					})
				}

			})
		})

		return result;
	}
}


export default fcUtil;
