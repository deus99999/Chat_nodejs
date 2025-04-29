
let loginForm = document.getElementById('loginform')

loginForm.addEventListener('submit', function(e) {
	e.preventDefault()

	const {login, password} = loginForm
	
	let user = JSON.stringify({
		login: login.value,
		password: password.value
	})

		const xhr = new XMLHttpRequest()
		xhr.open('POST', '/api/login')
		xhr.send(user)
		xhr.onload = () => {
			if (xhr.status === 200) {
				const token = xhr.response
				document.cookie = `token=${token}`
				window.location.assign('/')
			} 
			else {
				alert(xhr.response)
			}
		}
})