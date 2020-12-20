const path = require('path')

module.exports = {
	resolve: {
		extensions: ['.js', '.json'],
		// alias: {
		// 	'@src': path.resolve(__dirname, 'src'),
		// 	'@assets': path.resolve(__dirname, 'src/assets/'),
		// 	'@main': path.resolve(__dirname, 'src/main/'),
		// 	'@renderer': path.resolve(__dirname, 'src/renderer/'),
		// 	'@shared': path.resolve(__dirname, 'src/shared/')
		// },
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [ { loader: 'vue-loader' } ],
			},

			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [ { loader: 'babel-loader' } ],
			},

			{
				test: /\.styl$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].css',
						},
					},
					{ loader: 'stylus-loader' },
				],
			},
		],
	},
}
