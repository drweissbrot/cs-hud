require('electron').ipcRenderer.on('gsi', (event, message) => {
	console.log(message)
})
