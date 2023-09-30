export default {
	data() {
		return {
			errorOccuredWhileCheckingForUpdates: false,
			installedVersionString: null,
			isCheckingForInstalledVersion: true,
			isCheckingForUpdates: false,
			latestVersionReleaseUrl: null,
			latestVersionString: null,
		}
	},

	async mounted() {
		await this.checkForInstalledVersion()
	},

	computed: {
		isInstalledVersionOutdated() {
			if (! this.installedVersionString || ! this.latestVersionString) return null

			const installed = this.parseVersionString(this.installedVersionString)
			const latest = this.parseVersionString(this.latestVersionString)
			if (! installed || ! latest) return null

			const maxSegmentLength = Math.max(installed.length, latest.length)

			for (let i = 0; i < maxSegmentLength; i++) {
				if ((latest[i] || 0) > (installed[i] || 0)) return true
				if ((installed[i] || 0) > (latest[i] || 0)) return false
			}

			return false
		},
	},

	methods: {
		async checkForInstalledVersion() {
			try {
				const response = await fetch('/version')
				if (! response.ok) return

				this.installedVersionString = (await response.text())?.trim() || null
			} finally {
				this.isCheckingForInstalledVersion = false
			}
		},

		async checkForUpdates() {
			this.isCheckingForUpdates = true
			this.errorOccuredWhileCheckingForUpdates = false

			try {
				const response = await fetch('https://api.github.com/repos/drweissbrot/cs-hud/releases/latest')
				if (! response.ok) throw response

				const release = await response.json()

				this.latestVersionString = release.tag_name
				this.latestVersionReleaseUrl = release.html_url
			} catch (err) {
				this.errorOccuredWhileCheckingForUpdates = true
				this.latestVersionReleaseUrl = null
				this.latestVersionString = null

				console.error(err)
			} finally {
				this.isCheckingForUpdates = false
			}
		},

		parseVersionString(str) {
			const isValid = typeof str === 'string' && /^v?\d+(\.\d+)+(-.+)?$/i.test(str)
			if (! isValid) return

			return str.toLowerCase()
				.replace(/^v/i, '')
				.replace(/-.+$/, '')
				.split('.')
				.map((segment) => Number(segment))
		},
	},
}
