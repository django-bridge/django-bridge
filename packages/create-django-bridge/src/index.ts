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

const defaultTargetDir = "django-bridge-project";

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

  const renderFile = (file: string, targetFile: string) => {
    const content = fs
      .readFileSync(file, "utf-8")
      .replace(/__projectname__/g, projectName);
    fs.writeFileSync(targetFile, content, "utf-8");
  };

  const renderDirectory = (dir: string, targetDir: string) => {
    // Ensure the destination directory exists
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = fs.readdirSync(dir) as string[];
    for (const file of files) {
      const targetFile = file.replace(/__projectname__/g, projectName);

      if (fs.lstatSync(path.join(dir, file)).isDirectory()) {
        renderDirectory(path.join(dir, file), path.join(targetDir, targetFile));
      } else {
        renderFile(path.join(dir, file), path.join(targetDir, targetFile));
      }
    }
  };

  renderDirectory(templateDir, root);
  console.log(`\nDone.\n`);

  console.log(`To run your app:`);
  const cdClient = path.relative(cwd, path.join(root, "client"));
  if (cdClient !== cwd) {
    console.log(`  cd ${cdClient.includes(" ") ? `"${cdClient}"` : cdClient}`);
  }
  console.log(`  npm install`);
  console.log(`  npm run dev\n`);

  console.log(`And in a separate terminal:`);
  const cdServer = path.relative(cwd, path.join(root, "server"));
  if (cdServer !== cwd) {
    console.log(`  cd ${cdServer.includes(" ") ? `"${cdServer}"` : cdServer}`);
  }
  console.log(`  poetry install`);
  console.log(`  poetry run python manage.py runserver`);
  console.log();
  console.log(`Then visit your new Django Bridge app on http://localhost:8000`);
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
