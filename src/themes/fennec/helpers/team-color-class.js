export const teamColorClass = (team) => {
	switch (team?.side) {
		case 2: return '--t'
		case 3: return '--ct'
	}
}
