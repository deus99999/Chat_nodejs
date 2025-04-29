const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')
const db = require('./database')
const cookie = require('cookie')


const { Server } = require("socket.io")

const validAuthTokens = []

const pathToIndex = path.join(__dirname, 'static', 'index.html')
const indexHtmlFile = fs.readFileSync(pathToIndex)

const pathToStyle = path.join(__dirname, 'static', 'style.css')
const StyleFile = fs.readFileSync(pathToStyle)

const pathToScript = path.join(__dirname, 'static', 'script.js')
const ScriptlFile = fs.readFileSync(pathToScript)

const pathToRegister = path.join(__dirname, 'static', 'register.html')
const RegisterFile = fs.readFileSync(pathToRegister)

const pathToAuth = path.join(__dirname, 'static', 'auth.js')
const AuthFile = fs.readFileSync(pathToAuth)

const pathToLogin = path.join(__dirname, 'static', 'login.html')
const loginFile = fs.readFileSync(pathToLogin)

const pathToLoginJS = path.join(__dirname, 'static', 'login.js')
const loginJSFile = fs.readFileSync(pathToLoginJS)

let server = http.createServer(function(req, res) {
	// res.setHeader('Access-Control-Allow-Origin', '*')
	if (req.method === 'GET') {
		switch (req.url) {
			// case '/':
			// 	return res.end(indexHtmlFile)
			case '/style.css':
				return res.end(StyleFile)
			// case '/script.js':
			// 	return res.end(ScriptlFile)
			case '/register':
				return res.end(RegisterFile)
			case '/auth.js':
				return res.end(AuthFile)
			case '/login':
				return res.end(loginFile)
			case '/login.js':
				return res.end(loginJSFile)
			default: return guarded(req, res)
		}
	}
	if (req.method === 'POST') {
		switch (req.url) {
			case '/api/register':
				return registerUser(req, res)
			case '/api/login': 
				return login(req, res)
			default: return guarded(req, res)
		}
	}
	res.statusCode = 404
	return res.end('Error 404')
})

function registerUser(req, res) {
	let data = ''
	req.on('data', function(chunk) {
		data += chunk
	})
	req.on('end', async function() {
		try {
			const user = JSON.parse(data) 
			if (!user.login || !user.password)	{
				return res.end('empty login or password')
			}
			if (await db.isUserExist(user.login)) {
				return res.end('User already exist')
			}
			await db.addUser(user)
			return res.end("Registration is successfull")
		} catch (e) {
			return res.end('Error: ' + e)
		}
	console.log(data)
	})
}

function login(req, res) {
	let data = ''
	req.on('data', function(chunk) {
		data += chunk
	})
	console.log(data)
	req.on('end', async function() {
		console.log(data)
		try {
			const user = JSON.parse(data)
			const token = await db.getAuthToken(user)
			validAuthTokens.push(token)
			res.writeHead(200)
			res.end(token)
		}
		catch(e) {
			res.writeHead(500)
			return res.end('Error: ' + e)
		}
	})
}

server.listen(3000)

// connection.end()
const io = new Server(server);

io.on('connection', async (socket) => {
	console.log('a user connected. id - ' + socket.id)
	let userNickname = 'user'

	let messages = await db.getMessages()

	socket.on('set_nickname', (nickname) => {
		userNickname = nickname
	})

	socket.on('new_message', (message) => {
		console.log(message)
		db.addMessage(message, 1)
		io.emit('message', userNickname + ':' + message)
	})
})

function guarded(req, res) {
	const credentionals = getCredentionals(req.headers?.cookie)
	if (!credentionals) {
		res.writeHead(302, {'Location': '/register'})
		return res.end()
	}
	if (req.method === 'GET') {
		switch (req.url) {
			case '/': return res.end(indexHtmlFile)
			case '/script.js': return res.end(ScriptlFile)
		}
	}
	res.writeHead(404)
	return res.end("Error 404")
	
}
	

function getCredentionals(c = '') {
	const cookies = cookie.parse(c)
	const token = cookies?.token
	if (!token || !validAuthTokens.includes(token)) return null
	const [user_id, login] = token.split('.')
	if (!user_id || !login) return null
	return {user_id, login}
}
