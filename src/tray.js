const {Tray, Menu} = require('electron')
const path = require('path')
const {version, description} = require('../package')

const contextMenu = [
    {
        label: `v${version}`
    },
    {
        id: 'time',
        icon: path.join(__dirname, 'assets', 'stopwatch.png'),
        label: '-'
    },
    {
        type: 'separator'
    },
    {
        id: 'allDay',
        label: 'All day',
        type: 'checkbox',
        checked: false
    },
    {
        id: 'workingTime',
        label: 'Working time',
        type: 'checkbox',
        checked: true
    },
    {
        type: 'separator'
    },
    {
        id: 'startup',
        label: 'Run at startup',
        type: 'checkbox',
        checked: false
    },
    {
        type: 'separator'
    },
    {
        id: 'break',
        icon: path.join(__dirname, 'assets', 'coffee-cup.png'),
        label: 'Break'
    },
    {
        id: 'quit',
        label: 'Quit'
    }
]

let tray

const create = () => {
    tray = new Tray(path.join(__dirname,'', 'assets', 'tray-icon-dev.png'))
    tray.setToolTip(description)
    tray.setContextMenu(Menu.buildFromTemplate(contextMenu))
}

const item = (id) => {
    return contextMenu.find(item => item.id === id)
}

const refresh = () => {
    tray.setContextMenu(Menu.buildFromTemplate(contextMenu))
}

module.exports = {
    item,
    create,
    refresh
}
