const path = require('path')
const {
    app,
    BrowserWindow,
    Tray,
    Menu,
    ipcMain,
    screen
} = require('electron')
const {
    MAX_WORKING_TIME,
    WORKDAYS,
    WORKING_TIME_RANGE,
    BREAKFAST_TIME_RAGE,
    LUNCH_TIME_RANGE,
    DINNER_TIME_RANGE
} = require('./config')

const ONE_SECOND = 1000
const LOOP_TIME = 60 * ONE_SECOND
const [startWorkingTime, endWorkingTime] = WORKING_TIME_RANGE
const [startBreakfastTime, endBreakfastTime] = BREAKFAST_TIME_RAGE
const [startLunchTime, endLunchTime] = LUNCH_TIME_RANGE
const [startDinnerTime, endDinnerTime] = DINNER_TIME_RANGE

let indexWin
let timeWin // 给第二屏用的
let tray
let timerId
let duration = 0 // 分钟，-1表示暂停

function createTray() {
    tray = new Tray(path.join(__dirname, '/assets/tray-icon.png'))

    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'v1.0.0 beta'
        },
        {
            label: 'Quit',
            click: () => {
                quitApp()
            }
        }
    ])

    tray.setToolTip('Tomato Clock')
    tray.setContextMenu(contextMenu)
}

function createIndexWin() {
    indexWin = new BrowserWindow({
        x: 0,
        y: 0,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })

    indexWin.on('minimize', () => {
        setTimeout(() => {
            indexWin.show()
        }, 0)
    })

    indexWin.maximize()
    indexWin.loadFile('index.html')
    // indexWin.webContents.openDevTools() // 关闭开发者工具窗口才可以窗体透明
}

function createTimeWin() {
    const displays = screen.getAllDisplays()
    const externalDisplay = displays.find((display) => {
        return display.bounds.x !== 0 || display.bounds.y !== 0
    })

    if (externalDisplay) {
        timeWin = new BrowserWindow({
            x: externalDisplay.bounds.x,
            y: externalDisplay.bounds.y,
            fullscreen: true,
            frame: false,
            alwaysOnTop: true,
            transparent: true,
            skipTaskbar: true,
            webPreferences: {
                nodeIntegration: true
            }
        })

        timeWin.on('minimize', () => {
            setTimeout(() => {
                timeWin.show()
            }, 0)
        })

        timeWin.loadFile('time.html')
        // timeWin.webContents.openDevTools()
    }
}

function destroyIndexWin() {
    if (indexWin) {
        indexWin.destroy()
        indexWin = null
    }
}

function destroyTimeWin() {
    if (timeWin) {
        timeWin.destroy()
        timeWin = null
    }
}

function showTomatoWin() {
    createIndexWin()
    createTimeWin()
}

function closeTomatoWin() {
    destroyIndexWin()
    destroyTimeWin()
}

function startWorkingTimer() {
    timerId = setInterval(() => {
        const currDate = new Date()
        const currDay = currDate.getDay() === 0 ? 7 : currDate.getDay()
        const currHours = currDate.getHours()
        const isWorkday = WORKDAYS.includes(currDay)
        const isWorkingTime = currHours >= startWorkingTime && currHours < endWorkingTime
        const isBreakfastTime = currHours >= startBreakfastTime && currHours < endBreakfastTime
        const isLunchTime = currHours >= startLunchTime && currHours < endLunchTime
        const isDinnerTime = currHours >= startDinnerTime && currHours < endDinnerTime
        const isBreak = duration === -1

        if (isWorkday
            && isWorkingTime
            && !isBreakfastTime && !isLunchTime && !isDinnerTime) {

            if (!isBreak) {
                duration += 1

                if (duration >= MAX_WORKING_TIME) {
                    duration = -1
                    showTomatoWin()
                }
            }
        } else {
            duration = 0
        }
    }, LOOP_TIME)
}

function handleMainProcess() {
    createTray()
    startWorkingTimer()

    ipcMain.on('close-index-win', () => {
        duration = 0
        closeTomatoWin()
    })
}

function quitApp() {
    clearInterval(timerId)
    closeTomatoWin()
    app.quit()
}

app.on('ready', handleMainProcess)

app.on('window-all-closed', () => {
    // 如果你没有监听此事件并且所有窗口都关闭了，默认的行为是控制退出程序
})
