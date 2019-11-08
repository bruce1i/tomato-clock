const {ipcRenderer} = require('electron')
const {BREAK_TIME} = require('./config')

const ONE_SECOND = 1000
const $app = document.getElementById('app')
const $tip = document.getElementById('tip')
const $startBtn = document.getElementById('start')
const $dismissBtn = document.getElementById('dismiss')
let timerId
let countDownTime = BREAK_TIME

function startCountDown() {
    if (countDownTime === 0) {
        $app.classList.add('done')
        $tip.innerHTML = '可以继续了'
    }

    $startBtn.innerHTML = convert2TimeString(countDownTime--)
    timerId = setTimeout(startCountDown, ONE_SECOND)
}

function convert2TimeString(time) {
    const t = Math.abs(time)
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`
}

function closeWin() {
    clearTimeout(timerId)
    ipcRenderer.send('close-index-win')
}

$startBtn.onclick = () => {
    if ($app.classList.contains('done')) {
        closeWin()
    }
}

$dismissBtn.onclick = () => {
    closeWin()
}

startCountDown()

