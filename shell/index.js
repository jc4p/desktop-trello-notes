import electron, { ipcMain, shell } from 'electron';
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu
const dialog = electron.dialog

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let setupWindow
let cardWindows = {}

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Close All Notes',
        accelerator: 'CmdOrCtrl+Shift+W',
        click (item, focusedWindow) { closeCardWindows(); }
      },
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {
        role: 'undo'
      },
      {
        role: 'redo'
      },
      {
        type: 'separator'
      },
      {
        role: 'cut'
      },
      {
        role: 'copy'
      },
      {
        role: 'paste'
      },
      {
        role: 'delete'
      },
      {
        role: 'selectall'
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.reload()
        }
      },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
        click (item, focusedWindow) {
          if (focusedWindow) focusedWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        role: 'resetzoom'
      },
      {
        role: 'zoomin'
      },
      {
        role: 'zoomout'
      },
      {
        type: 'separator'
      },
      {
        role: 'togglefullscreen'
      }
    ]
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize'
      },
      {
        role: 'close'
      }
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click () { require('electron').shell.openExternal('http://electron.atom.io') }
      }
    ]
  }
]

if (process.platform === 'darwin') {
  const name = app.getName()
  menuTemplate.unshift({
    label: name,
    submenu: [
      {
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        role: 'hide'
      },
      {
        role: 'hideothers'
      },
      {
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        role: 'quit'
      }
    ]
  })
  // Edit menu.
  menuTemplate[1].submenu.push(
    {
      type: 'separator'
    },
    {
      label: 'Speech',
      submenu: [
        {
          role: 'startspeaking'
        },
        {
          role: 'stopspeaking'
        }
      ]
    }
  )
  // Window menu.
  menuTemplate[3].submenu = [
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Zoom',
      role: 'zoom'
    },
    {
      type: 'separator'
    },
    {
      label: 'Bring All to Front',
      role: 'front'
    }
  ]
}

ipcMain.on('open-url', (event, arg) => {
  console.log('open-url: ' + arg);
  shell.openExternal(arg, { activate: true });
  event.returnValue = true;
})

ipcMain.on('open-card', (event, arg) => {
  createCardWindow(arg);
  event.returnValue = true;
});

function createWindow() {
  // Create the browser window.
  setupWindow = new BrowserWindow({width: 800, height: 600, titleBarStyle: 'hidden', show: false})

  // and load the index.html of the app.
  setupWindow.loadURL(`file://${__dirname}/index.html`)

  // Emitted when the window is closed.
  setupWindow.on('closed', () => { setupWindow = null })
  setupWindow.once('ready-to-show', () => { setupWindow.show() })

  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function createCardWindow(cardId) {
  if (cardWindows.hasOwnProperty('cardId'))
    return;
  let cardWindow = new BrowserWindow({width: 200, height: 400, frame: true,
    alwaysOnTop: true, skipTaskbar: true})
  cardWindows[cardId] = cardWindow

  cardWindow.loadURL(`file://${__dirname}/note.html?${cardId}`)

  cardWindow.on('closed', () => { delete cardWindows[cardId] })

  cardWindow.once('ready-to-show', () => { cardWindow.show() });
}

function closeCardWindows() {
  for(var cardId in cardWindows) {
    cardWindows[cardId].close();
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (setupWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.