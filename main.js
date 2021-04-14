const signupButton = document.querySelector('#signup-button')
const loginButton = document.querySelector('#login-button')
const signupScreen = document.querySelector('#signup-screen')
const loginScreen = document.querySelector('#login-screen')
const sections = document.querySelectorAll('section')
const signupForm = document.querySelector('.signup-form')
const loginForm = document.querySelector('.login-form')
const logoutButton = document.querySelector('#logout-button')


signupButton.addEventListener("click", () => {
    buttonController(signupScreen)
})

loginButton.addEventListener("click", () => {
    buttonController(loginScreen)
})

signupForm.addEventListener('submit', (e) => {
    console.log("signup")
    e.preventDefault()
    signupFunction()
})

loginForm.addEventListener('submit', (e) => {
    console.log("login")
    e.preventDefault()
    loginFunction()
})

signupFunction = async () => {
    const name = document.querySelector('#signup-name').value
    const email = document.querySelector('#signup-email').value
    const password = document.querySelector('#signup-password').value
    try {
        let res = await axios.post('http://localhost:3001/users', {
            name: name,
            email: email,
            password: password,
        })
        let userId = res.data.user.id
        localStorage.setItem('userId', userId)
        let userName = res.data.user.name
        localStorage.setItem('userName', userName)
        loginStateButtons()
        
    } catch (error) {
        alert('email already exists or invalid')
    }
}

loginFunction = async () => {
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    try {
        let res = await axios.post('http://localhost:3001/users/login', {
            email: email,
            password: password
        })
        let userId = res.data.user.id
        let userName = res.data.user.name
        localStorage.setItem('userName', userName)
        localStorage.setItem('userId', userId)
        loginStateButtons()

    } catch (error) {
        alert('login failed')
    }
}

loginStateButtons = () => {
    addHidden(loginButton)
    addHidden(signupButton)

}

buttonController = (thing) => {
    hideSections()
    removeHidden(thing)
}

hideSections = () => {
    sections.forEach(section => section.classList.add('hidden'))
}

removeHidden = (thing) => {
    thing.classList.remove('hidden')
}

addHidden = (thing) => {
    thing.classList.add('hidden')
}