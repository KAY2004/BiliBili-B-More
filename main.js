const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const { Notification } = require('electron');
// const template = [
//     {
//         label: '菜单',
//         submenu: [
//             {
//                 label: '前往网页版'
//             }
//         ]
//     }
// ];
function createWindow() {
    const win = new BrowserWindow({
        webPreferences: { webSecurity: false },
        width: 800,
        height: 600//,
        // webPreferences: {
        //     preload: path.join(__dirname, 'preload.js')
        // }
    });

    win.loadFile('web/index.html');
}
app.whenReady().then(() => {
    createWindow();
});
app.on('ready', () => {
    // const appMenu = Menu.buildFromTemplate(template);
    // Menu.setApplicationMenu(appMenu);
    Menu.setApplicationMenu(null);
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
app.whenReady().then(() => {
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

