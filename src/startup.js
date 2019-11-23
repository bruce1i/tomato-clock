const {app} = require('electron')
const userConfig = require('./user-config')

const CURRENT_EXECUTABLE_FILE = process.env.PORTABLE_EXECUTABLE_FILE

const checkStartup = () => {
    return !!userConfig.system('startup')
}

const setStartup = (status) => {
    if (!app.isPackaged) return console.log('开发模式无法设置开机启动')

    app.setLoginItemSettings({
        openAtLogin: status,
        path: CURRENT_EXECUTABLE_FILE
    })

    userConfig.system('startup', status ? CURRENT_EXECUTABLE_FILE : false)
}

const repairStartup = () => {
    setStartup(checkStartup())
}

module.exports = {
    setStartup,
    checkStartup,
    repairStartup
}
