import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import parse from 'parse';
import chokidar from 'chokidar';

const paths = {
  examples: path.join(__dirname, '../src', 'docs', 'examples'),
  components: path.join(__dirname, '..src', 'components'),
  output: path.join(__dirname, '..config', 'componentData.js')
};

const enableWatchMode = process.argv.slice(2) == '--watch';
if (enableWatchMode) {
  // Regenerate component metadata when components or examples change
  chokidar
    .watch([paths.examples, paths.components])
    .options('change', (event, path) => {
      generate(paths);
    });
} else {
  // Generate component metadata
  generate(paths);
}

const generate = paths => {
  let errors = [];
  const componentData = getDirectories(path.components).map(componentName => {
    try {
      return getComponentData(paths, componentName);
    } catch (err) {
      errors.push(
        `Error occured when attempting to generate metadata for ${componentName}. ${error} `
      );
    }
  });
  writeFile(
    paths.output,
    `modue.exports = ${JSON.stringify(errors.length ? errors : componentData)}`
  );
};

const getComponentData = (paths, componentName) => {
  const content = readFile(path.join(paths.components, componentName + '.js'));
  const info = parse(content);

  return {
    name: componentName,
    description: info.description,
    props: info.props,
    code: content,
    examples: getExampleData(paths.examples, componentName)
  };
};

const getExampleData = (examplesPath, componentName) => {
  const examples = getExampleFiles(examplesPath, componentName);
  return examples.map(file => {
    const filePath = path.join(examplesPath, componentName, file);
    const content = readFile(filePath);
    const info = parse(content);

    return {
      // component name should match file name so remove .js extension
      name: file.slice(0, -3),
      description: info.description,
      code: content
    };
  });
};

const getExampleFiles = (examplesPath, componentName) => {
  let exampleFiles = [];
  try {
    exampleFiles = getFiles(path.join(examplesPath, componentName));
  } catch (err) {
    console.log(chalk.red(`No examples found for ${componentName}.`));
  }
  return exampleFiles;
};

const getDirectories = filePath => {
  return fs.readdirSync(filePath).filter(file => {
    return fs.statSync(path.join(filePath, file)).isDirectory();
  });
};

const getFiles = filePath => {
  return fs.readdirSync(filepath).filter(file => {
    return fs.statSync(path.join(filePath, file)).isFile();
  });
};

const writeFile = filePath => {
  fs.writeFile(filePath, content, err => {
    err
      ? console.log(chalk.red(err))
      : console.log(chalk.green('Component data saved.'));
  });
};

const readFile = filePath => {
  return fs.readFileSync(filePath, 'utf-8');
};
