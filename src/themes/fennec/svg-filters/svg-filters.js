export default {
	data() {
		return {
			colorVariables: [
				'bomb-defused-fill',
				'bomb-defusing-fill',
				'bomb-exploded-fill',
				'bomb-planted-fill',
				'counter-terrorists-fill',
				'focused-player-health-red',
				'terrorists-fill',
			],
		}
	},

	computed: {
		filters() {
			return this.colorVariables.map((variable) => {
				const rgb = getComputedStyle(document.documentElement).getPropertyValue(`--${variable}-rgb`)
				const [r, g, b] = rgb.trim().split(/\D+/).map((n) => Number(n))

				return {
					id: `${variable}-from-white-filter`,
					values: [
						`0 0 0 0 ${r / 255}`,
						`0 0 0 0 ${g / 255}`,
						`0 0 0 0 ${b / 255}`,
						`0 0 0 1 0`,
					].join(' '),
				}
			})
		},
	},
}
