let registerUserModalBtn = document.querySelector('#registerUser-modal');
let loginUserModalBtn = document.querySelector('#loginUser-modal');
let registerUserModalBlock = document.querySelector('#registerUser-block');
let loginUserModalBlock = document.querySelector('#loginUser-block');
let registerUserBtn = document.querySelector('#registerUser-btn');
let loginUserBtn = document.querySelector('#loginUser-btn');
let logoutUserBtn = document.querySelector('#logoutUser-btn');
let closeModalBtn = document.querySelector('.btn-close');
let showUsername = document.querySelector('#showUsername');
let adminPanel = document.querySelector('#admin-panel');  
let addMovieBtn = document.querySelector('.add-movie-btn');
let SwiperMovieList = document.querySelector('#swiper_movie_list');
let moviesList = document.querySelector('#movie-list');
let movieSwiperImage = document.querySelector('#movie-swiper-image');
let addMovieListBtn = document.querySelector('.add-movielist-btn');
let saveChangesBtn = document.querySelector('.save-changes-btn');
let janrsList = document.querySelector('.dropdown_menu_janr');
let dateList = document.querySelector('.dropdown_menu_date');
let searchForm = document.querySelector('form');
let prevPageBtn = document.querySelector('#prev-page-btn');
let nextPageBtn = document.querySelector('#next-page-btn');




//* inputs group
let usernameInp = document.querySelector('#reg-username');
let ageInp = document.querySelector('#reg-age');
let passwordInp = document.querySelector('#reg-password');
let passwordConfirmInp = document.querySelector('#reg-passwordConfirm');
let isAdminInp = document.querySelector('#isAdmin');
let loginUsernameInp = document.querySelector('#login-username');
let loginPasswordInp = document.querySelector('#login-password');

let movieImage = document.querySelector('#movie-image');
let movieTitle = document.querySelector('#movie-title');
let movieJanr = document.querySelector('#movie-janr');
let movieDate = document.querySelector('#movie-date');
let searchInp = document.querySelector('.search_inp');




//* account logic
registerUserModalBtn.addEventListener('click', () => {
  registerUserModalBlock.setAttribute('style', 'display: flex !important;');
  registerUserBtn.setAttribute('style', 'display: block !important;');
  loginUserModalBlock.setAttribute('style', 'display: none !important;');
  loginUserBtn.setAttribute('style', 'display: none !important;');
});

loginUserModalBtn.addEventListener('click', () => {
  registerUserModalBlock.setAttribute('style', 'display: none !important;');
  registerUserBtn.setAttribute('style', 'display: none !important;');
  loginUserModalBlock.setAttribute('style', 'display: flex !important;');
  loginUserBtn.setAttribute('style', 'display: block !important;');
});


//* register
const USERS_API = 'http://localhost:8000/users';

async function checkUniqueUsername(username) {
    let res = await fetch(USERS_API);
    let users = await res.json();
    return users.some(user => user.username === username);
};

async function registerUser() {
  if(
      !usernameInp.value.trim() ||
      !ageInp.value.trim() ||
      !passwordInp.value.trim() ||
      !passwordConfirmInp.value.trim()
  ) {
      alert('Some inputs are empty!');
      return;
  };

  let uniqueUsername = await checkUniqueUsername(usernameInp.value);

  if(uniqueUsername) {
      alert('User with this username already exists!');
      return;
  };

  if(passwordInp.value !== passwordConfirmInp.value) {
      alert('Passwords don\'t match!');
      return;
  };

  let userObj = {
      username: usernameInp.value,
      age: ageInp.value,
      password: passwordInp.value,
      isAdmin: isAdmin.checked
  };

  fetch(USERS_API, {
      method: 'POST',
      body: JSON.stringify(userObj),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
  });

  usernameInp.value = '';
  ageInp.value = '';
  passwordInp.value = '';
  passwordConfirmInp.value = '';
  isAdminInp.checked = false;

  closeModalBtn.click();
};

registerUserBtn.addEventListener('click', registerUser);


//* login
function checkLoginLogoutStatus() {
  let user = localStorage.getItem('user');
  if(!user) {
      loginUserModalBtn.parentNode.style.display = 'block';
      logoutUserBtn.parentNode.style.display = 'none';
      showUsername.innerText = 'No user';
  } else {
      loginUserModalBtn.parentNode.style.display = 'none';
      logoutUserBtn.parentNode.style.display = 'block';
      showUsername.innerText = JSON.parse(user).username;
  };

  showAdminPanel();
};
checkLoginLogoutStatus();


function checkUserInUsers(username, users) {
  return users.some(item => item.username === username);
};

function checkUserPassword(user, password) {
  return user.password === password;
};

function setUserToStorage(username, isAdmin) {
  localStorage.setItem('user', JSON.stringify({
      username,
      isAdmin
  }));
};

async function loginUser() {
  if(
      !loginUsernameInp.value.trim() ||
      !loginPasswordInp.value.trim()
  ) {
      alert('Some inpits are empty!');
      return;
  };

  let res = await fetch(USERS_API);
  let users = await res.json();

  if(!checkUserInUsers(loginUsernameInp.value, users)) {
      alert('User not found!');
      return;
  };

  let userObj = users.find(user => user.username === loginUsernameInp.value);

  if(!checkUserPassword(userObj, loginPasswordInp.value)) {
      alert('Wrong password!');
      return;
  };

  setUserToStorage(userObj.username, userObj.isAdmin);

  loginUsernameInp.value = '';
  loginPasswordInp.value = '';

  checkLoginLogoutStatus();

  closeModalBtn.click();

  render();
};

loginUserBtn.addEventListener('click', loginUser);


//* logout
logoutUserBtn.addEventListener('click', () => {
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  checkLoginLogoutStatus();
  render();
});



//* product logic
function checkUserForMovieCreate() {
  let user = JSON.parse(localStorage.getItem('user'));
  if(user) return user.isAdmin;
  return false;
};

function showAdminPanel() {
  if(!checkUserForMovieCreate()) {
      adminPanel.setAttribute('style', 'display: none !important;');
  } else {
      adminPanel.setAttribute('style', 'display: flex !important;');
  };
};


//* create movie
const MOVIES_SWIPER_API = 'http://localhost:8000/moviesSwiper';

function cleanAdminForm() {
  movieSwiperImage.value = '';
};

async function createSwiperMovie() {
  if(
      !movieSwiperImage.value.trim()
  ) {
      alert('Some inputs are empty!');
      return;
  };

  let movieSwiperObj = {
      image: movieSwiperImage.value,
  };

  await fetch(MOVIES_SWIPER_API, {
      method: 'POST',
      body: JSON.stringify(movieSwiperObj),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
  });

  cleanAdminForm();

  render();
};

addMovieBtn.addEventListener('click', createSwiperMovie);



//* read 
let swiper; 

async function render() {
  let requestAPI = `${MOVIES_SWIPER_API}`;
  SwiperMovieList.innerHTML = ''; // Заменить SwiperMovieList на swiper_movie_list
  let res = await fetch(requestAPI);
  let swiperMovies = await res.json();
  swiperMovies.forEach(movie => {
    const newMovieSwiper = `
    <div class="carousel__card swiper-slide">
      <img class="card__img" src="${movie.image}" alt="error">  
    ${checkUserForMovieCreate() ? 
      `<a href="" class="btn btn-danger btn-delete" id="del-${movie.id}">DELETE</a>`
      :
      ''
      }
      </div>

    `;
    SwiperMovieList.insertAdjacentHTML('beforeend', newMovieSwiper); // Заменить SwiperMovieList на swiper_movie_list
  });

  //if(products.length === 0) return;
  addDeleteEvent();
  //addEditEvent();

  if(swiper) {
    swiper.destroy();
  }

  swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: false
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      1024: {
        slidesPerView: 2
      },
      1560: {
        slidesPerView: 3
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  swiper = new Swiper(".swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    coverflowEffect: {
      rotate: 0,  
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: false
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true
    },
    breakpoints: {
      1024: {
        slidesPerView: 2
      },
      1560: {
        slidesPerView: 3
      }
    }
  });
});

render()


//* delete
async function deleteSwiperMovie(e) {
  let moviesSwiperId = e.target.id.split('-')[1];

  await fetch(`${MOVIES_SWIPER_API}/${moviesSwiperId}`, {
      method: 'DELETE'
  });

  render();
};

function addDeleteEvent() {
  let deleteMovieBtns = document.querySelectorAll('.btn-delete');
  deleteMovieBtns.forEach(btn => btn.addEventListener('click', deleteSwiperMovie));
};





//* create Movie in List
const MOVIE_LIST_API = 'http://localhost:8000/moviesList';

function cleanAdminForm2() {
    movieImage.value = '';
    movieTitle.value = '';
    movieJanr.value = '';
    movieDate.value = '';
};

async function createMovie() {
  if(
      !movieImage.value.trim() ||
      !movieTitle.value.trim() ||
      !movieJanr.value.trim() ||
      !movieDate.value.trim() 
  ) {
      alert('Some inputs are empty!');
      return;
  };

  let movieListObj = {
      image: movieImage.value,
      title: movieTitle.value,
      janr: movieJanr.value,
      date: movieDate.value
  };

  await fetch(MOVIE_LIST_API, {
      method: 'POST',
      body: JSON.stringify(movieListObj),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
  });

  cleanAdminForm2();

  render2();
};

addMovieListBtn.addEventListener('click', createMovie);


////* read
let janr = '';
let date = ''; 
let search = '';
let currentPage = 1;


async function render2() {
  let requestAPI = `${MOVIE_LIST_API}?q=${search}&janr=${janr}&date=${date}&_page=${currentPage}&_limit=10`;
  if (!janr) {
    requestAPI = `${MOVIE_LIST_API}?q=${search}&date=${date}&_page=${currentPage}&_limit=10`;
  }
  if (!date) {
    requestAPI = `${MOVIE_LIST_API}?q=${search}&janr=${janr}&_page=${currentPage}&_limit=10`;
  }
  if (!janr && !date) {
    requestAPI = `${MOVIE_LIST_API}?q=${search}&_page=${currentPage}&_limit=10`;
  }
  moviesList.innerHTML = '';
  let res = await fetch(requestAPI);
  let movies = await res.json();
  movies.forEach(movie => {
    moviesList.innerHTML += `
    <div class="movie_card">
    <div class="movie__image">
          <img src="${movie.image}" alt="">
        </div>
    <div class="cart__content">
      <h4 class="cart__title">
        ${movie.title}
      </h4>
      <div class="subtitles__wrapper">
        <p class="card__janr">
          ${movie.janr}
        </p>
        <p class="card__date">
          ${movie.date}
        </p>
      </div>
      ${checkUserForMovieCreate() ? 
        `<a href="#admin-panel" class="btn btn-dark btn-movie-edit" id="edit-${movie.id}">EDIT</a>
        <a href="#admin-panel" class="btn btn-danger btn-movie-delete" id="del-${movie.id}">DELETE</a>`
        :
        ''
        }
    </div>
  </div>
    `;
  });

  //if(products.length === 0) return;
  addDeleteSecondEvent();
  addEditEvent();
  addJanrToDropdownMenu();
  addDateToDropdownMenu();
  //addCartEvent();
};
render2();

//* delete2
async function deleteMovie(e) {
  let movieId = e.target.id.split('-')[1];

  await fetch(`${MOVIE_LIST_API}/${movieId}`, {
      method: 'DELETE'
  });

  render2();
};

function addDeleteSecondEvent() {
  let deleteMovieBtns = document.querySelectorAll('.btn-movie-delete');
  deleteMovieBtns.forEach(btn => btn.addEventListener('click', deleteMovie));
};


//* update
function checkCreateAndSaveBtn() {
  if(saveChangesBtn.id) {
      addMovieListBtn.setAttribute('style', 'display: none;');
      saveChangesBtn.setAttribute('style', 'display: block;');
  } else {
      addMovieListBtn.setAttribute('style', 'display: block;');
      saveChangesBtn.setAttribute('style', 'display: none;');
  };
};
checkCreateAndSaveBtn();

async function addMovieDataToForm(e) {
  let movieId = e.target.id.split('-')[1];
  let res = await fetch(`${MOVIE_LIST_API}/${movieId}`);
  let movieObj = await res.json();
  
  movieImage.value = movieObj.image;
  movieTitle.value = movieObj.title;
  movieJanr.value = movieObj.janr;
  movieDate.value = movieObj.date;

  saveChangesBtn.setAttribute('id', movieObj.id);

  checkCreateAndSaveBtn();
};

function addEditEvent() {
  let editMovieBtns = document.querySelectorAll('.btn-movie-edit');
  editMovieBtns.forEach(btn => btn.addEventListener('click', addMovieDataToForm));
};


async function saveChanges(e) {
  let updatedMovieObj = {
      id: e.target.id,
      image: movieImage.value,
      title: movieTitle.value,
      janr: movieJanr.value,
      date: movieDate.value,
  };

  await fetch(`${MOVIE_LIST_API}/${e.target.id}`, {
      method: 'PUT',
      body: JSON.stringify(updatedMovieObj),
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }
  });

  cleanAdminForm();

  saveChangesBtn.removeAttribute('id');

  checkCreateAndSaveBtn();

  render2();
};

saveChangesBtn.addEventListener('click', saveChanges);


//* filtering janr
async function addJanrToDropdownMenu() {
  let res = await fetch(MOVIE_LIST_API);
  let data = await res.json();
  let janrs = new Set(data.map(movie => movie.janr));
  janrsList.innerHTML = '<li><a class="dropdown-item" href="#">all</a></li>';
  janrs.forEach(janr => {
      janrsList.innerHTML += `
          <li><a class="dropdown-item" href="#">${janr}</a></li>
      `;
  });
  addClickEventOnDropdownItem();
};

function filterOnJanr(e) {
  let janrText = e.target.innerText;
  if (janrText === 'all') {
    janr = '';
  } else {
    janr = janrText;
  }
  render2();
}

function addClickEventOnDropdownItem() {
  let janrItems = document.querySelectorAll('.dropdown-item');
  janrItems.forEach(item => item.addEventListener('click', filterOnJanr));
};

//* filtering date
async function addDateToDropdownMenu() {
  let res = await fetch(MOVIE_LIST_API);
  let data = await res.json();
  let dates = new Set(data.map(movie => movie.date));
  dateList.innerHTML = '<li><a class="dropdown-item dropdown-item-date text-black" href="#">all</a></li>';
  dates.forEach(date => {
      dateList.innerHTML += `
          <li><a class="dropdown-item dropdown-item-date text-black" href="#">${date}</a></li>
      `;
  });
  addClickEventOnDropdownItem2();
};

function filterOnDate(e) {
  let dateText = e.target.innerText;
  if (dateText === 'all') {
    date = '';
  } else {
    date = dateText;
  }
  render2();
}

function addClickEventOnDropdownItem2() {
  let dateItems = document.querySelectorAll('.dropdown-item-date');
  dateItems.forEach(item => item.addEventListener('click', filterOnDate));
};


//* search
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  search = searchInp.value;
  render2();
});


//* pagination
async function getPagesCount() {
  let res = await fetch(MOVIE_LIST_API);
  let movies = await res.json();
  let pagesCount = Math.ceil(movies.length / 2);
  return pagesCount;
};

async function checkPages() {
  let maxPagesNum = await getPagesCount();
  if(currentPage === 1) {
      prevPageBtn.setAttribute('style', 'display: none;');
      nextPageBtn.setAttribute('style', 'display: block;');
  } else if(currentPage === maxPagesNum) {
      prevPageBtn.setAttribute('style', 'display: block;');
      nextPageBtn.setAttribute('style', 'display: none;');
  } else {
      prevPageBtn.setAttribute('style', 'display: block;');
      nextPageBtn.setAttribute('style', 'display: block;');
  };
};
checkPages();

prevPageBtn.addEventListener('click', () => {
  currentPage--;
  checkPages();
  render2();
});

nextPageBtn.addEventListener('click', () => {
  currentPage++;
  checkPages();
  render2();
});