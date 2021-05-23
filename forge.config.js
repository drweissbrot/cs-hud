module.exports = {
	packagerConfig: {
		executableName: 'csgo-hud',
	},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				exe: 'csgo-hud.exe',
				name: 'csgo_hud',
			},
		},
		{
			name: '@electron-forge/maker-deb',
			config: {},
		},
	],
	plugins: [
		['@electron-forge/plugin-webpack', {
			mainConfig: './webpack.main.config.js',
			renderer: {
				config: './webpack.renderer.config.js',
				entryPoints: [{
					html: './src/index.html',
					js: './src/renderer/app.js',
					name: 'main',
				}],
			},
		}],
	],
}
