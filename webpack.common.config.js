const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
	resolve: {
		extensions: ['.js', '.json', '.vue'],
		alias: {
			'vue$': 'vue/dist/vue.esm.js',
			'~src': path.resolve(__dirname, 'src'),
			'~renderer': path.resolve(__dirname, 'src/renderer/'),
			'~Components': path.resolve(__dirname, 'src/renderer/Components/')
		},
	},

	module: {
		rules: [
			{
				test: /\.vue$/,
				exclude: /node_modules/,
				use: [ { loader: 'vue-loader' } ],
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

			{
				test: /\.svg$/,
				use: [ { loader: 'svg-url-loader' } ],
			},

			{
				test: /\.(png|jpe?g|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							publicPath: '..',
						},
					},
				],
			},
		],
	},

	plugins: [
		new VueLoaderPlugin(),
	],
}
