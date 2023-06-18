export const sanitizeMapName = (name = '') => {
	return name.replace(/^.*\//, '')
}

export const formatMapName = (name = '') => {
	name = name.replace(/^.*_/, '')
	name = name.substring(0, 1).toUpperCase() + name.substring(1)

	switch (name) {
		case 'Cbble': return 'Cobblestone'
		case 'Dust2': return 'Dust 2'
		default: return name
	}
}
