// BUTTONS
const logoutButton = document.querySelector('#logout-button')
const signupButton = document.querySelector('#signup-button')
const loginButton = document.querySelector('#login-button')
const allBusinessesButton = document.querySelector('#all-businesses-button')
const homeButton = document.querySelector('#home-button')
const listBusinessButton = document.querySelector('#list-businesses-button')
const ownerButtons = document.querySelector('.edit-delete')
const editButton = document.querySelector('#edit')
const deletebutton = document.querySelector('#delete')
const cancel = document.querySelector('.cancel')

// FORMS
const signupForm = document.querySelector('.signup-form')
const loginForm = document.querySelector('.login-form')
const createBusinessForm = document.querySelector('.create-form')
const createReviewForm = document.querySelector('.create-review-div')
const searchByTypeForm = document.querySelector('.search-by-type')
const category = document.querySelector('#search-type')
const searchByNameForm = document.querySelector('.search-by-name')
const businessName = document.querySelector('#business-name')
const editBusinessForm = document.querySelector('.edit-business-form')

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
const reviewSection = document.querySelector('.all-reviews')
let averageHeader = document.createElement('p')
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
    reviewSection.classList.remove('hidden')
})

logoutButton.addEventListener('click', () => [
    localStorage.clear(),
    logoutStateButtons(),
    buttonController(homeScreen)

])

editButton.addEventListener('click', () => {
    editBusinessForm.classList.remove('hidden')
    reviewSection.classList.add('hidden')
    ownerButtons.classList.add('hidden')

})

cancel.addEventListener('click', (e) => {
    e.preventDefault()
    editBusinessForm.classList.add('hidden')
    reviewSection.classList.remove('hidden')
    ownerButtons.classList.remove('hidden')
})

deletebutton.addEventListener('click', () => {
    deleteBusiness()
    buttonController(allBusinessesScreen)
})



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

editBusinessForm.addEventListener('submit', (e) => {
    e.preventDefault()
    editBusiness()
    buttonController(allBusinessesScreen)
    editBusinessForm.classList.add('hidden')
    reviewSection.classList.remove('hidden')
})

createReviewForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let id = localStorage.getItem('businessId')
    clearResults(allReviewsDiv)
    createReview(id)
    getAllReviews(id)

})

searchByTypeForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let type = `/byType/${category.value}`
    displayBy(type)
})

searchByNameForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let name = `/byName/${businessName.value}`
    displayBy(name)
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
        let userEmail = res.data.userEmail
        localStorage.setItem('userEmail', userEmail)
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
        let userEmail = res.data.userEmail
        localStorage.setItem('userId', userId)
        localStorage.setItem('userName', userName)
        localStorage.setItem('userEmail', userEmail)
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
        let res = await axios.get(`http://localhost:3001/businesses`)
        res.data.forEach(i => {
            let name = i.name
            let businessId = i.id
            displayName(name, businessId)
        })
    } catch (error) {

    }
}

displayBy = async (type) => {
    clearResults(nameDiv)
    try {
        const res = await axios.get(`http://localhost:3001/businesses/${type}`)
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
        clearResults(allReviewsDiv)
        getSingle(id)
        // getAllReviews(id)
    })
}

//GETS INFO FOR ONE BUSINESS
getSingle = async (id) => {
    
    try {
        clearResults(busiessInfoDiv)
        buttonController(singleBusinessSection)
        let res = await axios.get(`http://localhost:3001/businesses/${id}`)
        localStorage.setItem('businessId', id)
        diplayOneBusiness(res.data.business.name, res.data.business.address,
            res.data.business.type, res.data.business.description, res.data.owner.name, res.data.owner.email)
        getAllReviews(id)
    } catch (error) {

    }
}

//DISPLAYS BUSINESS INFO ON SINGLE BUSINESS PAGE 
diplayOneBusiness = (name, address, type, description, owner, email) => {
   
    if(localStorage.getItem('userEmail') === email ){
        
        ownerButtons.classList.remove('hidden')
        createReviewForm.classList.add('hidden')
        fillEditForm(name, address, type, description)
    }else{
        ownerButtons.classList.add('hidden')
        createReviewForm.classList.remove('hidden')
        editBusinessForm.classList.add('hidden')
        reviewFormController()
    }
    
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
    averageHeader.innerText = "Average review: "
    busiessInfoDiv.append(nameHeader, displayType, displayAddress,
        displayDescription, createdBy,averageHeader)

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
        
    } catch (error) {
        error('nope')
    }
}

//GET ALL REVIEWS FOR EACH BUSINESS 
getAllReviews = async (id) => {
    console.log(id);
    try {
        // clearResults(allReviewsDiv)

        let res = await axios.get(`http://localhost:3001/businesses/${id}/reviews`)
        console.log(res.data)
        let reviews = res.data.reviews
        calculateAvg(reviews)
        reviews.forEach(i => {
            let userId = i.userId
            let reviewTitle = i.title
            let reviewDescription = i.description
            let reviewRating = i.rating
            console.log(userId, reviewTitle, reviewDescription, reviewRating)
            displayReviews(userId, reviewTitle, reviewDescription, reviewRating)
        }) 
    } catch (error) {

    }
}

calculateAvg = (reviews) => {
    let ratingArr = []
    reviews.forEach(i => {
        let rating = i.rating
        ratingArr.push(rating)
    })
    let avg = arr => arr.reduce((a, b) => a + b) / arr.length
    averageRating = avg(ratingArr)
    displayAverageRating(averageRating)
}

displayAverageRating = (avg) => {
    busiessInfoDiv.removeChild(busiessInfoDiv.lastElementChild)
    
    averageHeader.innerText = `Average Rating: ${avg}`
    busiessInfoDiv.append(averageHeader)
    
}

//DISPLAY ALL THE REVIEWS
displayReviews = async (name, title, description, rating) => {    
    let res = await axios.get(`http://localhost:3001/users/${name}`)
    let userName = res.data.userName
    let eachReviewDiv = document.createElement('div')
    let createdBy = document.createElement('p')
    let reviewTitle = document.createElement('h3')
    let reviewDescription = document.createElement('p')
    let reviewRating = document.createElement('p')
    createdBy.innerText = `Left by ${userName}`
    reviewTitle.innerText = title
    reviewDescription.innerText = description
    reviewRating.innerText = `${rating} out of 5`
    eachReviewDiv.append(reviewTitle, reviewRating, createdBy, reviewDescription)
    allReviewsDiv.prepend(eachReviewDiv)
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
       clearResults(nameDiv)
        displayAllBusinesses()
    } catch (error) {
        error('Business failed to create')
    }
}

//EDIT BUSINESS
editBusiness = async () => {
    const name = document.querySelector('#edit-business-name').value
    const address = document.querySelector('#edit-business-address').value
    const description = document.querySelector('#edit-business-description').value
    const type = document.querySelector('#edit-business-type').value
    try {
        let businessId = localStorage.getItem('businessId')
        let res = await axios.put(`http://localhost:3001/businesses/${businessId}/update`, {
            name: name,
            address: address,
            description: description,
            type: type
        })
        alert('Business Updated')
        displayAllBusinesses()
    } catch (error) {
        error('Business failed to update')
    }
}

deleteBusiness = async () => {
    try {
        let businessId = localStorage.getItem('businessId')
        const deleted = await axios.delete(`http://localhost:3001/businesses/${businessId}/delete`)
        displayAllBusinesses()
    } catch (error) {
        console.log(error);
    }
}



//UTILITY FUNCTIONS
reviewFormController = () => {
    if (localStorage.getItem('userId')) {
        removeHidden(reviewFormDiv)
        console.log('im logged in')
    }
    else {
        
        addHidden(reviewFormDiv)
        console.log('im logged out ')
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

fillEditForm = (name, address, type, description) => {
    document.querySelector('#edit-business-name').value = name
    document.querySelector('#edit-business-address').value = address
    document.querySelector('#edit-business-type').value = type
    document.querySelector('#edit-business-description').value = description
}


