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
const cancelBusinessEdit = document.querySelector('.cancel')
const cancelReviewEdit = document.querySelector('.cancel-review-edit')
const editReviewButtons = document.querySelector('.editReviewButtons')
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
const editReviewForm = document.querySelector('.edit-review-form')

//SECTIONS
const signupScreen = document.querySelector('#signup-screen')
const loginScreen = document.querySelector('#login-screen')
const sections = document.querySelectorAll('section')
const homeScreen = document.querySelector('#home-screen')
const allBusinessesScreen = document.querySelector('#all-businesses-section')
const allBusinessesDiv = document.querySelector('#all-businesses-div')
const createBusinessSection = document.querySelector('#create-business-section')
const singleBusinessSection = document.querySelector('#single-business-section')
const editReviewSection = document.querySelector('.edit-review-section')
let nameDiv = document.createElement('div')
let busiessInfoDiv = document.querySelector('.business-info-div')
let allReviewsDiv = document.querySelector('.display-reviews-div')
let reviewFormDiv = document.querySelector('.create-review-div')
const reviewSection = document.querySelector('.all-reviews')
let averageHeader = document.createElement('p')
let helloUser = document.querySelector('.hello')
let businessId = null

const thanksScreen = document.querySelector('.thanks-screen')
let allUserEmails = []


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
    reviewFormController()
    // reviewSection.classList.remove('hidden')

})

logoutButton.addEventListener('click', () => [
    localStorage.clear(),
    logoutStateButtons(),
    helloController(),
    buttonController(homeScreen)
])

editButton.addEventListener('click', () => {
    editBusinessForm.classList.remove('hidden')
    reviewSection.classList.add('hidden')
    ownerButtons.classList.add('hidden')

})

cancelBusinessEdit.addEventListener('click', (e) => {
    e.preventDefault()
    editBusinessForm.classList.add('hidden')
    reviewSection.classList.remove('hidden')
    ownerButtons.classList.remove('hidden')
})

deletebutton.addEventListener('click', () => {
    deleteBusiness()
    removeHidden(reviewFormDiv, createReviewForm)
    buttonController(allBusinessesScreen)
})


cancelReviewEdit.addEventListener('click', () => {
    editReviewSection.classList.add('hidden')
    reviewSection.classList.remove('hidden')
})



//FORM EVENT LISTENERS
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    signupFunction()
})

loginForm.addEventListener('submit', (e) => {
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
})

editReviewForm.addEventListener('submit', (e) => {
    e.preventDefault()
    editReview()

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
        // console.log(res.data)
        let userId = res.data.userId
        localStorage.setItem('userId', userId)
        let userName = res.data.userName
        localStorage.setItem('userName', userName)
        let userEmail = res.data.userEmail
        localStorage.setItem('userEmail', userEmail)

        buttonController(homeScreen)
        loginStateButtons()
        helloController()
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
        helloController()
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
    name.classList.add('businessNames')
    name.innerText = eachName
    allBusinessesDiv.append(nameDiv)
    nameDiv.append(name)
    name.addEventListener('click', () => {
        // addHidden(thanksScreen)
        allUserEmails = []
        getSingle(id)
        clearResults(allReviewsDiv)
    })
}

//GETS INFO FOR ONE BUSINESS
getSingle = async (id) => {

    try {
        clearResults(busiessInfoDiv)
        buttonController(singleBusinessSection)
        let res = await axios.get(`http://localhost:3001/businesses/${id}`)
        localStorage.setItem('businessId', id)
        getAllReviews(id)
        diplayOneBusiness(res.data.business.name, res.data.business.address,
            res.data.business.type, res.data.business.description, res.data.owner.name, res.data.owner.email)


    } catch (error) {

    }
}

//DISPLAYS BUSINESS INFO ON SINGLE BUSINESS PAGE 
diplayOneBusiness = (name, address, type, description, owner, email) => {
    if (localStorage.getItem('userEmail') === email) {
        console.log(email)
        removeHidden(ownerButtons)
        addHidden(createReviewForm)
        addHidden(thanksScreen)
        fillEditDeleteForm(name, address, type, description)
        console.log("HIDE REVIEW FORM YOU OWN IT")
    }
    else {
        ownerButtons.classList.add('hidden')
        createReviewForm.classList.remove('hidden')
        editBusinessForm.classList.add('hidden')
        reviewFormController()
    }

    let nameHeader = document.createElement('h2')
    let displayAddress = document.createElement('p')
    displayAddress.classList.add("show-info")
    let displayType = document.createElement('p')
    displayType.classList.add("show-info")
    let displayDescription = document.createElement('p')
    displayDescription.classList.add("show-info")
    let createdBy = document.createElement('p')
    createdBy.classList.add("show-info")
    nameHeader.innerText = name
    displayAddress.innerText = `Address: ${address}`
    displayType.innerText = `Type: ${type}`
    displayDescription.innerText = `Description: ${description}`
    createdBy.innerText = `Listed by ${owner}`
    averageHeader.innerText = "Average review: "
    busiessInfoDiv.append(nameHeader, displayType, displayAddress,
        displayDescription, createdBy, averageHeader)

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
        // clearResults(allReviewsDiv)
        getAllReviews(id)
    } catch (error) {
        error('nope')
    }
}

//GET ALL REVIEWS FOR EACH BUSINESS 
getAllReviews = async (id) => {
    try {
        clearAddReviewForm()
        let res = await axios.get(`http://localhost:3001/businesses/${id}/reviews`)
        let reviews = res.data.reviews
 
        calculateAvg(reviews)
        reviews.forEach(i => {
            let userId = i.userId
            let reviewTitle = i.title
            let reviewDescription = i.description
            let reviewRating = i.rating
            clearResults(allReviewsDiv)
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
    displayAverageRating(Math.round(averageRating * 10) / 10)
}

displayAverageRating = (avg) => {
    busiessInfoDiv.removeChild(busiessInfoDiv.lastElementChild)
    averageHeader.innerText = `Average Rating: ${avg}`
    busiessInfoDiv.append(averageHeader)

}

//DISPLAY ALL THE REVIEWS
displayReviews = async (name, title, description, rating) => {
    // clearResults(allReviewsDiv)
    
    let res = await axios.get(`http://localhost:3001/users/${name}`)
    let userName = res.data.userName
    let userEmail = res.data.userEmail
    allUserEmails.push(userEmail)
    console.log(allUserEmails)
    // if (userEmail === localStorage.getItem('userEmail')) {
    //     createReviewerButtons()
    //     fillEditReviewForm(title, description, rating)
    //     reviewFormDiv.classList.add('hidden')
    //     thanksScreen.classList.remove('hidden')
    //     console.log(userEmail)
    //     console.log("DISPLAY THANKS SCREEN")
    // } else {
    //     // reviewFormDiv.classList.remove('hidden')
    //     thanksScreen.classList.add('hidden')
    //     reviewFormController()
    //     console.log("HIDE THANKS")
    // }
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
    // createEditReviewButtons(userEmail, title, description, rating)
    testFunction(title, description, rating)

}

testFunction = (title, description, rating) => {
    if(allUserEmails.includes(localStorage.getItem('userEmail'))){
        createReviewerButtons()
        fillEditReviewForm(title, description, rating)
        reviewFormDiv.classList.add('hidden')
        thanksScreen.classList.remove('hidden')
        console.log("DISPLAY THANKS SCREEN")
    }
    else{
        thanksScreen.classList.add('hidden')
        reviewFormController()
        console.log("HIDE THANKS")
    }
}


createReviewerButtons = () => {
    clearResults(editReviewButtons)
    const buttonsDiv = document.createElement('div')
    buttonsDiv.classList.add('edit-review-buttons')
    const editReview = document.createElement('button')
    const deleteReview = document.createElement('button')
    editReview.innerHTML = 'Update My Review'
    deleteReview.innerHTML = 'Delete My Review'
    editReviewButtons.append(buttonsDiv)
    buttonsDiv.append(editReview, deleteReview)
    handleReviewButtons(editReview, deleteReview)
}

handleReviewButtons = (edit, deleted) => {
    edit.addEventListener('click', () => {
        reviewSection.classList.add('hidden')
        editReviewSection.classList.remove('hidden')

    })

    deleted.addEventListener('click', async () => {
        let userId = localStorage.getItem('userId')
        let businessId = localStorage.getItem('businessId')
        const deleteReview = await axios.delete(`http://localhost:3001/reviews/${userId}/${businessId}/delete`)
        console.log(deleteReview);
        let id = localStorage.getItem('businessId')
        deleteReviewActions(id)
    })
}

editReview = async () => {
    const title = document.querySelector('#edit-review-title').value
    const description = document.querySelector('#edit-review-description').value
    const score = document.querySelector('#edit-review-score').value
    try {
        let userId = localStorage.getItem('userId')
        let businessId = localStorage.getItem('businessId')
        let res = await axios.put(`http://localhost:3001/reviews/${userId}/${businessId}/update`, {
            title: title,
            description: description,
            rating: score
        })
        alert('Review Updated')
        editReviewSection.classList.add('hidden')
        reviewSection.classList.remove('hidden')
        reviewFormDiv.classList.add('hidden')
        getAllReviews(businessId)
    } catch (error) {
        error('Review failed to update')
    }
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


helloController = () => {
    if (localStorage.getItem('userName')) {
        helloUser.innerHTML = `Welcome Back ${localStorage.getItem('userName')}!`
    } else {
        helloUser.innerHTML = ``
    }
}



reviewFormController = () => {
    if (localStorage.getItem('userId') === null) {
        addHidden(createReviewForm, reviewFormDiv)
    }
}

deleteReviewActions = (id) => {
    clearResults(allReviewsDiv)
   
    removeHidden(reviewFormDiv, createReviewForm)
    addHidden(thanksScreen)
    getAllReviews(id)
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


fillEditDeleteForm = (name, address, type, description) => {
    document.querySelector('#edit-business-name').value = name
    document.querySelector('#edit-business-address').value = address
    document.querySelector('#edit-business-type').value = type
    document.querySelector('#edit-business-description').value = description
}

fillEditReviewForm = (title, description, rating) => {
    document.querySelector('#edit-review-title').value = title
    document.querySelector('#edit-review-description').value = description
    document.querySelector('#edit-review-score').value = rating
}


helloController()


clearAddReviewForm = () => {
    document.querySelector('#review-score').value = ""
    document.querySelector('#review-title').value = ""
    document.querySelector('#review-description').value = ""
}
