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
const createReviewForm = document.querySelector('.create-review-div')

//SECTIONS
const signupScreen = document.querySelector('#signup-screen')
const loginScreen = document.querySelector('#login-screen')
const sections = document.querySelectorAll('section')
const homeScreen = document.querySelector('#home-screen')
const allBusinessesScreen = document.querySelector('#all-businesses-section')
const createBusinessSection = document.querySelector('#create-business-section')
const singleBusinessSection = document.querySelector('#single-business-section')
let nameDiv = document.createElement('div')
let busiessInfoDiv = document.querySelector('.business-info-div')
let allReviewsDiv = document.querySelector('.display-reviews-div')
let reviewFormDiv = document.querySelector('.create-review-div')

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

createReviewForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let id = localStorage.getItem('businessId')
    clearResults(allReviewsDiv)
    createReview(id)
    getAllReviews(id)

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
        let userId = res.data.userId
        localStorage.setItem('userId', userId)
        let userName = res.data.userName
        localStorage.setItem('userName', userName)
        buttonController(homeScreen)
        loginStateButtons()
    } catch (error) {
        console.log(error);
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
        let userId = res.data.userId
        let userName = res.data.userName
        localStorage.setItem('userId', userId)
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

//CREATES BUSINESS NAMES
displayName = (eachName, id) => {
    let name = document.createElement('h3')
    name.innerText = eachName
    allBusinessesScreen.append(nameDiv)
    nameDiv.append(name)
    name.addEventListener('click', () => {
        console.log(id)
        clearResults(allReviewsDiv)
        getSingle(id)
        getAllReviews(id)
    })
}

//GETS INFO FOR ONE BUSINESS
getSingle = async (id) => {
    try {
        clearResults(busiessInfoDiv)
        buttonController(singleBusinessSection)
        let res = await axios.get(`http://localhost:3001/businesses/${id}`)
        console.log(res.data)
        localStorage.setItem('businessId', id)
        diplayOneBusiness(res.data.business.name, res.data.business.address,
            res.data.business.type, res.data.business.description, res.data.owner.name)
    } catch (error) {

    }
}

//DISPLAYS BUSINESS INFO ON SINGLE BUSINESS PAGE 
diplayOneBusiness = (name, address, type, description, owner) => {
    reviewFormController()
    let nameHeader = document.createElement('h2')
    let displayAddress = document.createElement('p')
    let displayType = document.createElement('p')
    let displayDescription = document.createElement('p')
    let createdBy = document.createElement('p')
    nameHeader.innerText = name
    displayAddress.innerText = address
    displayType.innerText = type
    displayDescription.innerText = description
    createdBy.innerText = `Listed by ${owner}`
    busiessInfoDiv.append(nameHeader, displayType, displayAddress,
        displayDescription, createdBy)

}

//CREATE REVIEW
createReview = async (id) => {
    let userId = localStorage.getItem('userId')
    let businessId = id
    const rating = document.querySelector('#review-score').value
    const title = document.querySelector('#review-title').value
    const description = document.querySelector('#review-description').value
    try {

        let res = await axios.post('http://localhost:3001/reviews', {
            userId: userId,
            businessId: businessId,
            rating: rating,
            title: title,
            description: description
        })
        console.log(res.data)
    } catch (error) {
        error('nope')
    }
}

//GET ALL REVIEWS FOR EACH BUSINESS 
getAllReviews = async (id) => {
    try {
        clearResults(allReviewsDiv)
        let res = await axios.get(`http://localhost:3001/businesses/${id}/reviews`)
        let ratingArr = []
        res.data.reviews.forEach(i => {
            let rating = i.review.rating
            ratingArr.push(rating)
        })
        let avg = arr => arr.reduce((a, b) => a + b) / arr.length
        averageRating = avg(ratingArr)
        displayAverageRating(averageRating)
        res.data.reviews.forEach(i => {
            let userName = i.name
            let reviewTitle = i.review.title
            let reviewDescription = i.review.description
            let reviewRating = i.review.rating
            displayReviews(userName, reviewTitle, reviewDescription, reviewRating)
        }) 
    } catch (error) {

    }
}
displayAverageRating = (avg) => {
    let averageHeader = document.createElement('h4')
    averageHeader.innerText = `Average Rating: ${avg}`
    busiessInfoDiv.append(averageHeader)
}

//DISPLAY ALL THE REVIEWS
displayReviews = (name, title, description, rating) => {

    let createdBy = document.createElement('p')
    let reviewTitle = document.createElement('h3')
    let reviewDescription = document.createElement('p')
    let reviewRating = document.createElement('p')
    createdBy.innerText = `Left by ${name}`
    reviewTitle.innerText = title
    reviewDescription.innerText = description
    reviewRating.innerText = `${rating} out of 5`
    allReviewsDiv.prepend(reviewTitle, reviewRating, createdBy, reviewDescription)


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
reviewFormController = () => {
    if (localStorage.getItem('userId')) {
        removeHidden(reviewFormDiv)
    }
    else {
        addHidden(reviewFormDiv)
    }
}

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



