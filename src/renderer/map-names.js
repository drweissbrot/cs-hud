const mapNames = {
	de_cbble: 'Cobblestone',
	de_dust2: 'Dust 2',
}

export const formatMapName = (mapName) => {
	return (mapNames.hasOwnProperty(mapName))
		? mapNames[mapName]
		: mapName.split('/').pop().split('_', 2).pop()
}

export default formatMapName
