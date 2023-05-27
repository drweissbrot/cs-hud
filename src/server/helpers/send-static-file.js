import send from 'koa-send'

import { rootDirectory } from './paths.js'

// NB! Do _not_ use this with user-supplied values for localFile!
export const sendStaticFile = (localFile) => async (context) => {
	await send(context, localFile, { root: rootDirectory })
}
