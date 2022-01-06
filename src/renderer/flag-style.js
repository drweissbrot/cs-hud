const style = {
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
		? `--${style[countryCode.toLowerCase()] || 'horizontal'}-flag`
		: null
}
