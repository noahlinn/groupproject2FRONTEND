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
const createBusinessForm = document.querySelector('.create-form')

//SECTIONS
const signupScreen = document.querySelector('#signup-screen')
const loginScreen = document.querySelector('#login-screen')
const sections = document.querySelectorAll('section')
const homeScreen = document.querySelector('#home-screen')
const allBusinessesScreen = document.querySelector('#all-businesses-section')
const createBusinessSection = document.querySelector('#create-business-section')
let nameDiv = document.createElement('div')

let businessId = null

//BUTTON EVENT LISTENERS
signupButton.addEventListener("click", () => {
    buttonController(signupScreen)
})

loginButton.addEventListener("click", () => {
    buttonController(loginScreen)
})

listBusinessButton.addEventListener("click", () => {
    buttonController(createBusinessSection)
})

homeButton.addEventListener('click', () => {
    buttonController(homeScreen)
})

allBusinessesButton.addEventListener("click", () => {
    buttonController(allBusinessesScreen)
    displayAllBusinesses()
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

createBusinessForm.addEventListener('submit', (e) => {
    e.preventDefault()
    createBusiness()
    buttonController(allBusinessesScreen)
    
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

//DISPLAY ALL BUSINESSES
displayAllBusinesses = async () => {
    clearResults(nameDiv)
    try {
        let res = await axios.get('http://localhost:3001/businesses')
        res.data.forEach(i => {
            let name = i.name
            let businessId = i.id
            displayName(name, businessId)
        })
    } catch (error) {
        
    }
}

displayName = (eachName, id) => { 
    let name = document.createElement('h3')
    name.innerText = eachName
    allBusinessesScreen.append(nameDiv)
    nameDiv.append(name)
    name.addEventListener('click', () => {
        console.log(id)
    })
}

displaySingle = () => {

}

//CREATE BUSINESS 
createBusiness = async () => {
    const name = document.querySelector('#create-name').value
    const address = document.querySelector('#create-address').value
    const description = document.querySelector('#create-description').value
    const type = document.querySelector('#create-type').value
    try {
        let userId = localStorage.getItem('userId')
        let res = await axios.post('http://localhost:3001/businesses', {
            userId: userId,
            name: name,
            address: address,
            description: description,
            type: type
        })
         console.log(res.data)
         alert('New Business Created')
         displayAllBusinesses()
    } catch (error) {
        error('Business failed to create')
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

clearResults = (result) => {
    while (result.firstChild) {
        result.firstChild.remove()
    }
}

if (localStorage.getItem('userId')) {
    loginStateButtons()

}
else {
    logoutStateButtons()
}