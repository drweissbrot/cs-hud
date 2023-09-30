import { readFile, writeFile } from 'fs/promises'
import { builtinRootDirectory } from './helpers/paths.js'

export const registerLicensesRoutes = (router) => {
	router.get('/licenses', async (context) => {
		context.type = 'text/plain'

		context.body = [
			'The source code of this software is available at https://github.com/drweissbrot/cs-hud.\n',
			'This software is licensed under:',
			await readFile(`${builtinRootDirectory}/license.txt`, 'utf-8'),
			'-----\n',
			await readFile(`${builtinRootDirectory}/assets/licenses.txt`, 'utf-8'),
		].join('\n')
	})
}
