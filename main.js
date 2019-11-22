// const path = require('path')
const {
    app,
    BrowserWindow,
    ipcMain,
    screen,
    dialog
} = require('electron')
const {
    MAX_TOMATO_TIME,
    WORKDAYS,
    WORKING_TIME_RANGE,
    BREAKFAST_TIME_RAGE,
    LUNCH_TIME_RANGE,
    DINNER_TIME_RANGE
} = require('./config')
const startup = require('./startup')
const tray = require('./tray')

const ONE_SECOND = 1000
const LOOP_TIME = 60 * ONE_SECOND
const [startWorkingTime, endWorkingTime] = WORKING_TIME_RANGE
const [startBreakfastTime, endBreakfastTime] = BREAKFAST_TIME_RAGE
const [startLunchTime, endLunchTime] = LUNCH_TIME_RANGE
const [startDinnerTime, endDinnerTime] = DINNER_TIME_RANGE

let indexWin
let timeWin // 给第二屏用的
let timerId
let duration = 0 // 分钟
let isAllDayRunning = false


function createTray() {
    tray.item('allDay').click = (item) => {
        if (item.checked) {
            isAllDayRunning = true
            tray.item('allDay').checked = true
            tray.item('workingTime').checked = false
        }
        tray.refresh()
    }
    tray.item('workingTime').click = (item) => {
        if (item.checked) {
            isAllDayRunning = false
            tray.item('allDay').checked = false
            tray.item('workingTime').checked = true
        }
        tray.refresh()
    }
    tray.item('startup').checked = startup.checkStartup()
    tray.item('startup').click = (item) => {
        startup.setStartup(item.checked)
    }
    tray.item('break').click = () => {
        haveBreak()
    }
    tray.item('quit').click = () => {
        quitApp()
    }
    tray.create()
}

function updateTrayTime() {
    const nonWorkingTimeLabel = 'Non-working time'
    const currLabel = tray.item('time').label
    const isTomatoTime = checkTomatoTime()

    if (!isTomatoTime && currLabel === nonWorkingTimeLabel) {
        return
    }

    tray.item('time').label = isTomatoTime ? `${String(duration)}'` : nonWorkingTimeLabel
    tray.refresh()
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
    indexWin.loadFile('./wins/index.html')
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

        timeWin.loadFile('./wins/time.html')
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

function checkTomatoTime() {
    if (isAllDayRunning) {
        return true
    }

    const currDate = new Date()
    const currDay = currDate.getDay() === 0 ? 7 : currDate.getDay()
    const currHours = currDate.getHours()
    const isWorkday = WORKDAYS.includes(currDay)
    const isWorkingTime = currHours >= startWorkingTime && currHours < endWorkingTime
    const isBreakfastTime = currHours >= startBreakfastTime && currHours < endBreakfastTime
    const isLunchTime = currHours >= startLunchTime && currHours < endLunchTime
    const isDinnerTime = currHours >= startDinnerTime && currHours < endDinnerTime

    if (isWorkday
        && isWorkingTime
        && !isBreakfastTime && !isLunchTime && !isDinnerTime) {
        return true
    }

    return false
}

function startTomatoTimer(time = 0) {
    duration = time == null || time <= 0 || time >= MAX_TOMATO_TIME ? 0 : MAX_TOMATO_TIME - time
    clearInterval(timerId)
    updateTrayTime()
    closeTomatoWin()

    timerId = setInterval(() => {
        if (checkTomatoTime()) {
            duration++

            if (duration >= MAX_TOMATO_TIME) {
                haveBreak()
            }
        } else {
            duration = 0
        }

        updateTrayTime()
    }, LOOP_TIME)
}

function haveBreak() {
    clearInterval(timerId)
    showTomatoWin()
}

function safetyCheck() {
    startup.repairStartup()
}

function handleMainProcess() {
    safetyCheck()
    createTray()
    startTomatoTimer()

    ipcMain.on('start-tomato-timer', (e, time) => {
        startTomatoTimer(time)
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

function alert(msg) {
    dialog.showMessageBox({
        message: msg + ''
    })
}

// app.getPath("appData")
// app.getPath('userData')
// app.getAppPath()
// __dirname
// require.main.filename
// app-root-path
// process.execPath
// process.env.INIT_CWD
// process.env.PORTABLE_EXECUTABLE_FILE
// process.env.PORTABLE_EXECUTABLE_DIR
