var TransferWebpackPlugin = require('transfer-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require('webpack');
var path = require('path');
var buildPath = path.resolve(__dirname,"dist");
module.exports = {  //这是commonJS的导出语法
	entry: {
		app: './src/app.js',
		vendors: ['react-router', 'react-dom', 'react']
	},
	output: {
		path: false ? 'src/__build' : path.resolve(__dirname + '/dist/'),
		publicPath: '/',
		filename: 'js/[name].js',
		chunkFilename: 'js/[chunkhash:8].chunk.min.js'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: 'style-loader!autoprefixer-loader!css-loader'
			},
			{
				test: /\.scss$/,
				loader: "style-loader!css-loader!autoprefixer-loader!sass-loader"
			},
			{
				test: /\.js[x]?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			},
			{
				test: /\.png|\.jpg$/,
				loader: "url-loader?mimetype=image/png"
			}
		]
	},
	plugins: [
		//压缩打包的文件
		//new webpack.optimize.UglifyJsPlugin({
		//	compress: {
		//		//supresses warnings, usually from module minification
		//		warnings: false
		//	}
		//}),
		//允许错误不打断程序
		//new webpack.NoErrorsPlugin(),
		//把指定文件夹xia的文件复制到指定的目录
		//new TransferWebpackPlugin([
		//	{from: 'www'}
		//], path.resolve(__dirname,"src"))
		new ExtractTextPlugin("css/[name].css")
	]

	//webpack-dev-server --progress --colors 启动webpack-server
}