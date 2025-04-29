const registerForm = document.getElementById('form')

registerForm.addEventListener('submit', function(e) {
	e.preventDefault()

	const {login, password, passwordRepeat} = registerForm
	if (password.value != passwordRepeat.value) {
		return alert('паролі не співпавдають!')
	}
	
	let user = JSON.stringify({
		login: login.value,
		password: password.value
	})

		const xhr = new XMLHttpRequest()
		xhr.open('POST', '/api/register')
		xhr.send(user)
		xhr.onload = () => alert(xhr.response)
})
