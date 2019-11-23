const {ipcRenderer} = require('electron')
const {BREAK_TIME} = require('../config')

const ONE_SECOND = 1000
const $app = document.getElementById('app')
const $tip = document.getElementById('tip')
const $startBtn = document.getElementById('start')
const $dismiss = document.getElementById('dismiss')
const $add5 = document.getElementById('add5')
let timerId
let countDownTime = BREAK_TIME

function startCountDown() {
    if (countDownTime <= 0) {
        $app.classList.add('done')
        $tip.innerHTML = '可以继续了'
        $startBtn.innerHTML = 'Go on😀'
        clearTimeout(timerId)
        return;
    }

    $startBtn.innerHTML = convert2TimeString(countDownTime--)
    timerId = setTimeout(startCountDown, ONE_SECOND)
}

function convert2TimeString(time) {
    return `${String(Math.floor(time / 60)).padStart(2, '0')} ${String(time % 60).padStart(2, '0')}`
}

function startTomatoTimer(time = 0) {
    clearTimeout(timerId)
    ipcRenderer.send('start-tomato-timer', time)
}

$startBtn.onclick = () => {
    if ($app.classList.contains('done')) {
        startTomatoTimer()
    }
}

$dismiss.onclick = () => {
    startTomatoTimer()
}

$add5.onclick = () => {
    startTomatoTimer(5)
}

startCountDown()

