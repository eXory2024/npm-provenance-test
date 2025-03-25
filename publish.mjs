import fs from "node:fs/promises"
import {spawnSync} from "node:child_process"
import {fileURLToPath} from "node:url"
import path from "node:path"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const workspaces = await fs.readdir(
	path.join(__dirname, "products")
)

const currentPackageJSON = JSON.parse((await fs.readFile(
	path.join(__dirname, "package.json")
)).toString())

const patchedPackageJSON = JSON.stringify({
	...currentPackageJSON,
	"workspaces": workspaces.map(x => {
		return `products/${x}`
	})
}, null, 4)

await fs.writeFile(path.join(__dirname, "package.json"), patchedPackageJSON)

const child = spawnSync("npm", [
	"publish",
	"--workspaces",
	"--provenance",
	"--access",
	"public"
], {
	cwd: __dirname,
	stdio: "inherit"
})

console.log(child.status)
