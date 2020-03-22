(function () {

  const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
  const INDEX_API = BASE_URL + "/api/v1/users"
  const container = document.querySelector('#userList')
  const data = []


  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 16

  //get all user

  axios.get(INDEX_API).then(response => {
    data.push(...response.data.results)
    //console.log(data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch(err => { console.log(err) })


  let showingData = data
  // card, list type transform
  const renderSelection = document.getElementById('renderSelection')
  let currentEvent = "cardType"
  let sortOrnot = false
  renderSelection.addEventListener('click', event => {
    currentEvent = event.target.id
    //console.log(currentEvent)
    getTotalPages(showingData)
    getPageData(currentPage, showingData)
  })

  // 1. card type
  function showCardType(data) {

    let htmlContent = ""
    data.forEach(elem => {

      htmlContent += `
      <div class="card">
  <img class="card-img-top" src="${elem.avatar}" alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">
    <i class="card-heart"></i>${elem.name} ${elem.surname}</h5>
    <button type="button" class="btn btn-outline-secondary btn-sm btn-showUserinfo" data-toggle="modal" data-target="#userData" data-id="${elem.id}">more about me..</button>

  </div>
</div>
    `
    })
    container.innerHTML = htmlContent;


  }

  // 2. list type
  function showListType(data) {
    //console.log("list")
    let htmlContentStart = `<ul class="list-group list-group-flush col-sm-12">`
    let htmlContentEnd = `</ul>`
    let htmlContent = ''
    data.forEach(elem => {
      htmlContent += `
      <li class="list-group-item d-flex flex-row">
      <div class="col-1"></div>
      <div class="col-4">
        <img class="list-img mx-auto img-fluid"src="${elem.avatar}" alt="avatar">
      </div>
      <div class="col-4">${elem.name} ${elem.surname}</div>
      
      <div class="col-3">
        <button type="button" class="btn btn-outline-secondary btn-sm btn-showUserinfo" data-toggle="modal" data-target="#userData" data-id="${elem.id}">more about me..</button>
      </div>

      </li>
      `
    })

    container.innerHTML = htmlContentStart + htmlContent + htmlContentEnd

  }

  // 3. sort by update
  // function sortUser(data) {
  //   let sortData = data.sort(function (a, b) {
  //     return a.created_at > b.created_at ? 1 : -1
  //   });
  //   return sortData;
  // }


  //display on web
  function showUser(data) {
    if (currentEvent === "cardType") {
      showCardType(data)
    } else if (currentEvent === "listType") {
      console.log("listtype show!")
      showListType(data)
    }

  }
  // favorite
  const favoritebtn = document.getElementById('btn-addTofavo')
  favoritebtn.addEventListener('click', e => {
    //console.log(e.id)
    addFavoriteUser(e.target.dataset.id, data)
  })


  function addFavoriteUser(id, data) {
    const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
    const user = data.find(e => e.id === Number(id))
    console.log(user)
    if (list.some(e => e.id === Number(id))) {
      alert(`${user.name} ${user.surname} is already in your favorite list.`)
    } else {
      list.push(user)
      alert(`Added ${user.name} ${user.surname} to your favorite list!`)
    }
    localStorage.setItem('favoriteUsers', JSON.stringify(list))
  }

  // search and filter

  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  let genderfilter = "All"

  searchForm.addEventListener('submit', e => {
    e.preventDefault()
    let input = searchInput.value

    showingData = data.filter(user => (user.name + user.surname).toLowerCase().includes(input.toLowerCase()))

    if (genderfilter !== "All") {
      showingData = showingData.filter(user => user.gender === genderfilter.toLowerCase())
    }

    getTotalPages(showingData)
    getPageData(currentPage, showingData)
  })

  const genderFilter = document.querySelector('.dropdown-menu')

  genderFilter.addEventListener('click', e => {
    genderfilter = e.target.innerText
    const genderButton = document.getElementById('dropdownMenuButton')
    genderButton.innerText = genderfilter

    //console.log(genderfilter.toLowerCase())
    showingData = data
    if (genderfilter !== "All") {
      showingData = data.filter(user => user.gender === genderfilter.toLowerCase())
      //console.log(results)
    }
    searchInput.value = ""

    getTotalPages(showingData)
    getPageData(currentPage, showingData)

  })

  // listen event handler - pop up modal
  container.addEventListener('click', e => {
    if (e.target.matches('.btn-showUserinfo')) {
      //console.log(e.target.dataset.id)
      showUserinfo(e.target.dataset.id)

    }
  })

  // listen event handler - emailModal
  let user = ""
  let email = ""

  // show spicific user info on pop-up model

  function showUserinfo(id) {
    const Id = document.getElementById('show-user-id')
    const Title = document.getElementById('show-user-name')
    const Image = document.getElementById('show-user-photo')
    const Date = document.getElementById('show-user-date')
    const Age = document.getElementById('show-user-age')
    const Region = document.getElementById('show-user-region')
    const userURL = INDEX_API + '/' + id;
    const favoritebtn = document.getElementById('btn-addTofavo')
    axios.get(userURL)
      .then(response => {
        const data = response.data
        Id.innerText = data.id
        if (response.data.gender == "female") {
          Title.innerHTML = `<i class="fas fa-female mr-2"></i>${data.name} ${data.surname}`
        } else {
          Title.innerHTML = `<i class="fas fa-male mr-2"></i>${data.name} ${data.surname}`
        }
        Image.innerHTML = `<img src = "${data.avatar}" class="img-fluid" alt = "Responsive image" >`
        Date.innerHTML = `<i class="fas fa-baby mr-2"></i>${data.birthday}`
        Region.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${data.region}`
        Age.innerHTML = `<i class="fas fa-user mr-2"></i>${data.age} years old`
        favoritebtn.dataset.id = data.id
        // get the email address and name then set to email modal
        user = Title.innerText
        email = data.email

      })
      .catch(err => { console.log(err) })

  }

  // show contact information

  const contactbtn = document.getElementById('btn-contact')
  contactbtn.addEventListener('click', e => {
    const emailName = document.getElementById('staticName')
    const emailAddress = document.getElementById('email')
    console.log(emailName.value)
    emailName.value = user
    emailAddress.value = email
  })

  // pagination

  function getTotalPages(data) {
    //console.log(data.length)
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    //console.log(totalPages)
    let pageItemContent = ''
    for (let i = 1; !(i > totalPages); i++) {
      pageItemContent += `
    <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i}">${i}</a>
        </li>
    `
      //console.log(i)
    }
    pagination.innerHTML = pageItemContent;
  }

  let currentPage = 1
  pagination.addEventListener('click', event => {
    //console.log(event.target.dataset.page)
    if (event.target.tagName === "A") {
      currentPage = event.target.dataset.page
      getPageData(currentPage)
    }
  })

  let paginationData = []
  function getPageData(page, data) {
    paginationData = data || paginationData
    //console.log(paginationData)

    let dataStart = (page - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(dataStart, dataStart + ITEM_PER_PAGE)

    showUser(pageData)
  }

})()
