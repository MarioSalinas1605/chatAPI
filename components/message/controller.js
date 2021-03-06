const store = require('./store')
const { socket } = require('../../socket')

function addMessage(chat, user, message, file) {
    return new Promise((resolve, reject) => {
        if (!user || !message || !chat) {
            console.log("[messageController] We don't have user or message");
            return reject('Incorrect data')
        }

        let fileUrl = file ? `http://localhost:3000/app/files/${file.filename}` : ''

        const fullMessage = {
            chat,
            user,
            message,
            file: fileUrl,
            date: new Date()
        }

        try {
            store.add(fullMessage)
            socket.io.emit('message', fullMessage)
            resolve(fullMessage)
        } catch (error) {
            reject(error)    
        }
    })
}

function getMessages(filterUser) {
    return new Promise( (resolve, reject) => {
        try {
            resolve(store.list(filterUser))
        } catch (error) {
            reject(error)
        }
        
    })
}

function updateMessage(id, message) {
    return new Promise((resolve, reject) => {

        if (!id || !message) {
            reject('Invalid data')
            return false
        }

        try {
            const result = store.updateText(id, message)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    })
}

async function deleteMessage(id) { 
    return new Promise((resolve, reject) => {
        if (!id) {
            reject('Invalid ID')
            return false
        }

        try {
            resolve(store.remove(id))
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = {
    addMessage,
    getMessages,
    updateMessage,
    deleteMessage
}