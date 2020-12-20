const { merge } = require('webpack-merge')
const common = require('./webpack.common.config')

module.exports = merge(common, {
	entry: [
		'./src/renderer/app.js',
		'./src/stylus/app.styl',
	],
})
