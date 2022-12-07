module.exports = {
	packagerConfig: {
		executableName: 'csgo-hud',
	},
	makers: [
		{
			name: '@electron-forge/maker-squirrel',
			config: {
				authors: ['drweissbrot'],
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
		{
			name: '@electron-forge/plugin-webpack',
			config: {
				mainConfig: './webpack.main.config.js',
				renderer: {
					config: './webpack.renderer.config.js',
					entryPoints: [{
						html: './src/index.html',
						js: './src/renderer/app.js',
						name: 'main'
					}]
				}
			}
		}
	]
}
