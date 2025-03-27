const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')
// const mysql = require('mysql2')

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

let sever = http.createServer(function(req, res) {
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

// connection.end()


// const dataPath = path.join(__dirname, 'data')

	
sever.listen(3000)


// response.end()
