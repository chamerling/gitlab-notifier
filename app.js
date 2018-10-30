const menubar = require('menubar');
const { shell } = require('electron');
const localUrl = 'http://localhost:8888';

let url;
if (process.env.NODE_ENV === 'DEV') {
  require('electron-debug')({ showDevTools: true })
  url = localUrl;
} else {
  url = `file://${process.cwd()}/dist/index.html`
}

const mb = menubar({ index: url, icon: `${process.cwd()}/src/assets/icon.png` });

mb.on('ready', () => {
  mb.on('after-create-window', () => {
    mb.window.webContents.on('new-window', (event, url) => {
      if (!url.startsWith(localUrl)) {
        event.preventDefault();
        shell.openExternal(url);
      }
    });
  });
});
