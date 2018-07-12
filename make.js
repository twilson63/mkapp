#!/usr/bin/env node
const shell = require('shelljs');
const fs = require('fs');

const project = process.argv[2] || 'app';

shell.echo('Installing code extensions...');
shell.exec('code --install-extension esbenp.prettier-vscode');
shell.exec('code --install-extension dbaeumer.vscode-eslint');

shell.echo('Create React Project ' + project);

shell.mkdir(project);
shell.cd(project);

shell.echo('Initializing React Project...');
shell.exec('npm init -y');
shell.exec('npm install react react-dom prop-types');
shell.exec('npm install --save-dev parcel-bundler');
shell.exec('npm install --save-dev babel-preset-env babel-preset-react');
shell.exec('npm install --save-dev babel-plugin-transform-class-properties');
shell.exec('npm install --save-dev babel-plugin-transform-class-properties');
shell.exec('npm install --save-dev babel-plugin-transform-runtime');
fs.writeFileSync(
  '.babelrc',
  `{
  "presets": ["env", "react"],
  "plugins": [
    "transform-class-properties",
    [
      "transform-runtime",
      {
        "polyfill": false,
        "regenerator": true
      }
    ]
  ]
}`,
  'utf-8'
);

shell.exec('npm install @reactions/component');
shell.exec('npm install ramda');
shell.exec(
  `npx json -I -f package.json -e 'this.scripts.start = "parcel public/index.html"'`
);

shell.echo('Installing Prettier...');

shell.exec('npm install --save-dev prettier');
// setup prettier
shell.exec('echo \'{ "singleQuote": true, "semi": false }\' > .prettierrc');
shell.exec(
  `json -I -f package.json -e 'this.scripts.format = "prettier --write src/**/*.js"'`
);

shell.echo('Installing EsLint...');

shell.exec('npm install --save-dev eslint');
shell.exec(
  `npm info "eslint-config-airbnb@latest" peerDependencies --json | command sed 's/[\{\},]//g ; s/: /@/g' | xargs npm install --save-dev "eslint-config-airbnb@latest"`
);
shell.exec(
  `npx json -I -f package.json -e 'this.scripts.lint = "eslint src/**/*.js --quiet"'`
);
shell.exec(`npm install --save-dev eslint-config-prettier`);

fs.writeFileSync(
  '.eslintrc.json',
  `{ 
  "extends": ["airbnb","prettier","prettier/react"], 
  "rules": {
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }]
  }
}`,
  'utf-8'
);

shell.echo('Setting up Project...');
// setup project
shell.mkdir(['public', 'src']);

fs.writeFileSync(
  'public/index.html',
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>${project}</title>
</head>
<body>
  <div id="app"></div>
  <script src="../src/index.js"></script>
</body>
</html>

`,
  'utf-8'
);

fs.writeFileSync(
  'src/app.js',
  `import React from 'react'

const App = (props) => {
  const {state, setState} = props
  return (
    <div style={style.centerContent}>
      <h1>${project} App</h1>
      <p>Count: {state.count}</p>
      <div>
      <button onClick={() => setState(p => ({count: p.count + 1}))}>+</button>
      <button onClick={() => setState(p => ({count: p.count - 1}))}>-</button>
      </div>
    </div>
  )
}

const style = {
  centerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
}

export default App
`,
  'utf-8'
);

fs.writeFileSync(
  'src/index.js',
  `import React from 'react'
import ReactDOM from 'react-dom'
import Component from '@reactions/component'
import App from './app'

ReactDOM.render(
  <Component initialState={{count: 0}}>
    {App}
  </Component>, document.getElementById('app'))
`,
  'utf-8'
);

shell.echo(`
Project is setup:

cd ${project}
code .
npm start
`);
