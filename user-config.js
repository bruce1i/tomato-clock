const Store = require('./store')

const defaultUserConfig = {
    "version": 1,
    "system": {
        "startup": false
    },
    "preference": {}
}

const userConfig = new Store('user-config', defaultUserConfig)

const system = (key, value) => {
    if (value === undefined) return userConfig.data.system[key]

    userConfig.data.system[key] = value
    userConfig.save()
}

const preference = (key, value) => {
    if (value === undefined) return userConfig.data.preference[key]

    userConfig.data.preference[key] = value
    userConfig.save()
}

module.exports = {
    system,
    preference
}
