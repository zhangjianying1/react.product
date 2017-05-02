var util = {



	/**
	 * 生成标记用户已选择的号码
	 * @params arrRule {Array} 生成的规则 双色球 =》[33, 16] 大乐透 =》[35, 12]
	 * @params nums {Array}
	 * @returns {Object}
	 */
	setDefaultNumber: function(arrRule, nums){
		var tempData = {
				red: [],
				blue: []
			}, ele, key = 'red',
			bollNum,
			numbers = new Array(arrRule[0]);


		nums.map(function(val, index){

			// 蓝球
			if (index == 1) {
				numbers = new Array(arrRule[1]);
				key = 'blue';
			}
			for (var i = 0; i < numbers.length; i++) {
				bollNum = ((i + 1) < 10) ? ('0' + (i + 1)) : i + 1;

				if (isexist(val, i+1)) {
					tempData[key].push({active: true, number: bollNum});
				} else {
					tempData[key].push({active: false, number: bollNum});
				}

			}

		});
		this.setSelectedBall(tempData);
		return tempData;
		/**
		 * 是否有匹配
		 */
		function isexist(nums, num){
			var result = false;
			if (Array.isArray(nums)) {
				nums.map(function(val){

					if (num == val.number) {
						result = true
					}
				});
			}
			return result;
		}
	},

	/**
	 * 选号
	 * @param key {String} 红or蓝 （球）
	 * @param num {String} 点击的号码
	 * @tempBoll {Object}
	 * @returns {Object}
	 */
	selectBall: function(key, num, tempBall){
		tempBall.defaultNumber[key][num-1].active = !tempBall.defaultNumber[key][num-1].active
		this.setSelectedBall(tempBall.defaultNumber);
		return tempBall

	},
	boll: {},
	/**
	 * 设置选中的号码
	 */
	setSelectedBall: function(defaultNumber){
		var This = this;
		this.boll = {};
		pushBoll('red');
		pushBoll('blue');

		/**
		 * 获取选中的号码
		 * @param key {String}
		 * @param {Array};
		 */
		function pushBoll(key){
			var bollNum;

			defaultNumber[key].map(function(val){
				if (val.active) {
					bollNum = val.number + '';

					if (bollNum.length < 1) {
						bollNum = '0' + bollNum;
					}

					if (!Array.isArray(This.boll[key])) {
						This.boll[key] = [bollNum];
					} else {
						This.boll[key].push(bollNum);
					}
				}
			})
		}
	},

}
export default util;