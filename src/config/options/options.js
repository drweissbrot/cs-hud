import Update from '/config/options/update/update.vue'

export default {
	components: {
		Update,
	},

	data() {
		return {
			initialTheme: null,
			optionValues: {},
			sections: [],
		}
	},

	mounted() {
		document.addEventListener('keydown', this.onKeydown)
		this.initOptions()
	},

	beforeUnmount() {
		document.removeEventListener('keydown', this.onKeydown)
	},

	methods: {
		async initOptions() {
			const res = await fetch('/config/options')
			const json = await res.json()

			const optionValues = {}
			const sections = {}

			for (const option of json) {
				if (! sections[option.section]) {
					sections[option.section] = {
						description: option.sectionDescription,
						name: option.section,
						options: [],
					}
				}

				optionValues[option.key] = option.value

				sections[option.section].options.push({
					...option,
					inputType: this.getInputType(option.type),
					keySegments: option.key.split('.'),
				})

				if (sections[option.section].description) {
					sections[option.section].description = option.sectionDescription
				}
			}

			this.initialTheme = optionValues.theme
			this.optionValues = optionValues
			this.sections = Object.values(sections)
		},

		getInputType(type) {
			switch (type) {
				case 'boolean': return 'checkbox'
				case 'color': return 'color'
				case 'number': return 'number'
				case 'text': return 'textarea'
				default: return 'text'
			}
		},

		onKeydown(e) {
			// on Ctrl+S, save changes
			if (
				e.key.toLowerCase() === 's'
				&& ! e.altKey
				&& e.ctrlKey
				&& ! e.metaKey
				&& ! e.shiftKey
			) {
				e.preventDefault()
				e.stopImmediatePropagation()
				return this.save()
			}
		},

		async save() {
			await fetch('/config/options', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(this.optionValues),
			})

			if (this.optionValues.theme !== this.initialTheme) {
				window.location.reload()
			}
		},

		async forceHudRefresh() {
			await fetch('/config/force-hud-refresh', { method: 'POST' })
		},

		resetValue(key) {
			this.optionValues[key] = null
		},
	},
}
