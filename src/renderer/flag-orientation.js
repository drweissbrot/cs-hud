const orientations = {
	de: 'horizontal',
	dk: 'vertical',
	mx: 'vertical',
	ru: 'horizontal',
	se: 'vertical',
	eu: 'unusual',
	cc: 'unusual',
}

export default (countryCode) => {
	return (countryCode)
		? `--${orientations[countryCode.toLowerCase()] || 'horizontal'}-flag`
		: null
}
