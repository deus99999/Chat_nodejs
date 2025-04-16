const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

const db = require('./database')

// const mysql = require('mysql2')
const { Server } = require("socket.io")


const pathToIndex = path.join(__dirname, 'static', 'index.html')
const indexHtmlFile = fs.readFileSync(pathToIndex)

const pathToStyle = path.join(__dirname, 'static', 'style.css')
const StyleFile = fs.readFileSync(pathToStyle)

const pathToScript = path.join(__dirname, 'static', 'script.js')
const ScriptlFile = fs.readFileSync(pathToScript)


// const connection = mysql.createConnection({
// 	host: 'localhost',
// 	user: 'root',
// 	password: 'root',
// 	database: 'chat'
// })

let server = http.createServer(function(req, res) {
	switch (req.url) {
		case '/':
			return res.end(indexHtmlFile)
		case '/style.css':
			return res.end(StyleFile)
		case '/script.js':
			return res.end(ScriptlFile)
	}
	res.statusCode = 404
	return res.end('Error 404')
}
)

server.listen(3000)

// connection.end()
const io = new Server(server);

io.on('connection', async (socket) => {
	console.log('a user connected. id - ' + socket.id)
	let userNickname = 'user'

	let messages = db.getMessages()

	socket.on('set_nickname', (username) => {
		userNickname = nickname
	})

	socket.on('new_message', (message) => {
		console.log(message)
		db.addMessage(message, 1)
		io.emit('message', userNickname + ':' + message)
	})
})


	


