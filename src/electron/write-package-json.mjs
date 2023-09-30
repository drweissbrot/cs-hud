import { readFile, writeFile } from 'fs/promises'

const name = process.argv[2]
const main = process.argv[3]

const run = async () => {
	const conf = JSON.parse(await readFile('package.json'))

	conf.productName = name
	conf.name = name
	conf.main = main

	await writeFile('package.json', JSON.stringify(conf, null, '\t'))
}

run().then(() => {})
