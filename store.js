const electron = require('electron')
const path = require('path')
const fs = require('fs')

function copy(obj) {
    return JSON.parse(JSON.stringify(obj))
}

function readFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath))
    } catch (e) {
        return null
    }
}

function writeFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data))
}

function initFile(filePath, initData) {
    if (!fs.existsSync(filePath)) {
        writeFile(filePath, initData)
    }
}

class Store {
    constructor(fileName, defaultData) {
        // Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
        // app.getPath('userData') will return a string of the user's app data directory path.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData')
        const filePath = path.join(userDataPath, fileName + '.json')

        initFile(filePath, defaultData)

        this.path = filePath
        this.data = readFile(filePath)
    }

    save() {
        console.log('> this',this)
        writeFile(this.path, this.data)
    }
}

// expose the class
module.exports = Store
