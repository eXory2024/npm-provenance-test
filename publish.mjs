import fs from "node:fs/promises"
import {spawnSync} from "node:child_process"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const workspaces = await fs.readdir(
	path.join(__dirname, "products")
)

/*
const currentPackageJSON = JSON.parse((await fs.readFile(
	path.join(__dirname, "package.json")
)).toString())

const patchedPackageJSON = JSON.stringify({
	...currentPackageJSON,
	"workspaces": workspaces.map(x => {
		return `products/${x}`
	})
}, null, 2)

await fs.writeFile(path.join(__dirname, "package.json"), patchedPackageJSON)
*/

for (const workspace of workspaces) {
	const child = spawnSync("npm", [
		"publish",
		"--provenance",
		"--access",
		"public"
	], {
		cwd: path.join(__dirname, "products", workspace),
		stdio: "inherit"
	})

	console.log(child.status)
}
