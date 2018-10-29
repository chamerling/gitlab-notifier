const menubar = require('menubar');

let url;
if (process.env.NODE_ENV === 'DEV') {
  require('electron-debug')({ showDevTools: true })
  url = 'http://localhost:8888/';
} else {
  url = `file://${process.cwd()}/dist/index.html`
}

const mb = menubar({ index: url, icon: `${process.cwd()}/src/assets/icon.png` });

mb.on('ready', () => {
  console.log('menubar app is ready')
});
