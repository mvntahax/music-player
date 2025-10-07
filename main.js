const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

function createWindow () {
  const win = new BrowserWindow({
    width: 300,
    height: 480,
    frame: false,
    //transparent: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
} 

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// const { app, BrowserWindow } = require('electron/main')
// const path = require('node:path')

// function createWindow () {
//   const win = new BrowserWindow({
//     width: 380, // Slightly increased width to match max-width in CSS
//     height: 580, // Increased height to accommodate the padding and new elements
//     // Configuration for a borderless, "Mac-like" aesthetic:
//     frame: false,             // REMOVES the standard cross, minimize, and maximize buttons/frame.
//     transparent: true,        // Allows the window background to be transparent for CSS shadows/rounding.
//     resizable: false,         // Locks the window size for consistent aesthetic.
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js')
//     }
//   })

//   // Note: Since 'frame: false' is set, you will need to implement a custom
//   // drag area (using CSS `-webkit-app-region: drag;`) on the window to allow
//   // the user to move it.

//   win.loadFile('index.html')
// } 

// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', () => {
//     // On macOS, re-create a window when the dock icon is clicked
//     if (BrowserWindow.getAllWindows().length === 0) {
//       createWindow()
//     }
//   })
// })

// app.on('window-all-closed', () => {
//   // Quit the application unless on macOS (darwin)
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
