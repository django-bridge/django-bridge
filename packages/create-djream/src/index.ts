import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import minimist from "minimist";
import { red } from "kolorist";

// Avoids autoconversion to number of the project name by defining that the args
// non associated with an option ( _ ) needs to be parsed as a string.
const argv = minimist<{
  t?: string;
  template?: string;
}>(process.argv.slice(2), { string: ["_"] });
const cwd = process.cwd();

const defaultTargetDir = "djream-project";

async function init() {
  const argTargetDir = formatTargetDir(argv._[0]);

  let targetDir = argTargetDir || defaultTargetDir;
  let projectName =
    targetDir === "." ? path.basename(path.resolve()) : targetDir;

  const root = path.join(cwd, targetDir);

  if (fs.existsSync(root)) {
    if (isEmpty(root)) {
      // If the directory is empty, we can just delete it
      fs.rmdirSync(root);
    } else {
      console.log(
        `Failed to create project in ${red(
          root
        )} because the directory is not empty.`
      );
      return;
    }
  }

  fs.mkdirSync(root, { recursive: true });

  console.log(`\nScaffolding project in ${root}...`);

  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../../template"
  );

  const renderFile = (file: string) => {
    const targetPath = path
      .join(root, file)
      .replace(/__projectname__/g, projectName);

    // Ensure the destination directory exists
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = fs
      .readFileSync(path.join(templateDir, file), "utf-8")
      .replace(/__projectname__/g, projectName);
    fs.writeFileSync(targetPath, content, "utf-8");
  };

  const files = fs.readdirSync(templateDir, { recursive: true }) as string[];
  for (const file of files) {
    // Ignore directories
    if (fs.lstatSync(path.join(templateDir, file)).isDirectory()) {
      continue;
    }

    renderFile(file);
  }

  const cdProjectName = path.relative(cwd, root);
  console.log(`\nDone. Now run:\n`);
  if (root !== cwd) {
    console.log(
      `  cd ${
        cdProjectName.includes(" ") ? `"${cdProjectName}"` : cdProjectName
      }`
    );
  }
  console.log(`  npm install`);
  console.log(`  npm run dev`);
  console.log();
}

function formatTargetDir(targetDir: string | undefined) {
  return targetDir?.trim().replace(/\/+$/g, "");
}

function isEmpty(path: string) {
  const files = fs.readdirSync(path);
  return files.length === 0 || (files.length === 1 && files[0] === ".git");
}

init().catch((e) => {
  console.error(e);
});
