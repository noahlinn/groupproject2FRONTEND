// BUTTONS
const logoutButton = document.querySelector('#logout-button')
const signupButton = document.querySelector('#signup-button')
const loginButton = document.querySelector('#login-button')
const allBusinessesButton = document.querySelector('#all-businesses-button')
const homeButton = document.querySelector('#home-button')
const listBusinessButton = document.querySelector('#list-businesses-button')

// FORMS
const signupForm = document.querySelector('.signup-form')
const loginForm = document.querySelector('.login-form')

//SECTIONS
const signupScreen = document.querySelector('#signup-screen')
const loginScreen = document.querySelector('#login-screen')
const sections = document.querySelectorAll('section')
const homeScreen = document.querySelector('#home-screen')
const allBusinessesScreen = document.querySelector('#all-businesses-section')


//BUTTON EVENT LISTENERS
signupButton.addEventListener("click", () => {
    buttonController(signupScreen)
})

loginButton.addEventListener("click", () => {
    buttonController(loginScreen)
})

homeButton.addEventListener('click', () => {
    buttonController(homeScreen)
})

allBusinessesButton.addEventListener("click", () => {
    buttonController(allBusinessesScreen)
})

logoutButton.addEventListener('click', () => [
    localStorage.clear(),
    logoutStateButtons(),
    buttonController(homeScreen)
])

//FORM EVENT LISTENERS
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

//REQUEST FUNCTIONS

//SIGN UP
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
        console.log(res.data)
        let userId = res.data.newUser.id
        localStorage.setItem('userId', userId)
        let userName = res.data.newUser.name
        localStorage.setItem('userName', userName)
        buttonController(homeScreen)
        loginStateButtons()
    } catch (error) {
        alert('email already exists or invalid')
    }
}

//LOGIN
loginFunction = async () => {
    const email = document.querySelector('#login-email').value
    const password = document.querySelector('#login-password').value
    try {
        let res = await axios.post('http://localhost:3001/users/login', {
            email: email,
            password: password
        })
        let userId = res.data.user.id
        localStorage.setItem('userId', userId)
        let userName = res.data.user.name
        localStorage.setItem('userName', userName)
        loginStateButtons()
        buttonController(homeScreen)
    } catch (error) {
        alert('login failed')
    }
}

//UTILITY FUNCTIONS

logoutStateButtons = () => {
    removeHidden(loginButton)
    removeHidden(signupButton)
    addHidden(logoutButton)
    addHidden(listBusinessButton)
}

loginStateButtons = () => {
    addHidden(loginButton)
    addHidden(signupButton)
    removeHidden(logoutButton)
    removeHidden(listBusinessButton)
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

if (localStorage.getItem('userId')) {
    loginStateButtons()

}
else {
    logoutStateButtons()
}