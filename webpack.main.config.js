const { merge } = require('webpack-merge')
const common = require('./webpack.common.config')

module.exports = merge(common, {
	entry: './src/index.js',
	target: 'electron-main',
})
