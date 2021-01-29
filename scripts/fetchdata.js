const fs = require("fs/promises");
const path = require("path");

const github = require("repo-lint");

const repos = require("../src/_data/repos");

main();

async function main() {
  const baseOutputDir = path.join(__dirname, "..", "src", "_data", "_repos");
  for (const $repo of repos) {
    const {owner, repo} = $repo;
    const outputDir = path.join(baseOutputDir, owner);
    const outputFile = path.join(outputDir,`${repo}.json`);
    const res = await github.getRepo({ owner, repo });
    await fs.mkdir(outputDir, {recursive: true});
    await fs.writeFile(outputFile, JSON.stringify(res, null, 2));
  }
}
