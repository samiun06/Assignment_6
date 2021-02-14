const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  toggleSpinner();
  if (images.length > 0) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
      div.innerHTML = ` <img id="thumbnail-image" class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
      gallery.appendChild(div)
    })

    document.getElementById("search").value = "";
    document.getElementById("duration").value = "";

    //One bonus feature below. It checks whether the searched keyword is valid.
  } else {
    imagesArea.style.display = "none";
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerHTML = "";
    const h1 = document.createElement("h3");
    const img = document.createElement("img");
    img.setAttribute("src", "error-search.png");
    h1.innerText = "Sorry. Searched image not found. Please provide a valid keyword";
    h1.className = "error-text";
    errorMessage.appendChild(h1);
    errorMessage.appendChild(img);
    errorMessage.style.display = "block";
    document.getElementById("search").value = "";

  }
  //One bonus feature above. It checks whether the searched keyword is valid.
}
const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  toggle(element);

  let item = sliders.indexOf(img);
  if (item === -1 && element.classList.contains("added")) {
    sliders.push(img);
  }
  if (!element.classList.contains("added")) {
    const index = sliders.indexOf(element);
    sliders.splice(index, 1);
  }
}
var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  // One mini bonus feature. It takes you to the beginning of the page.

  const button = document.createElement("button");
  button.innerText = "Back";
  button.className = "back-btn"
  button.addEventListener("click", () => {
    document.querySelector('.main').style.display = 'none';
    document.getElementById("search-div").style.display = "block";
  })

  sliderContainer.appendChild(prevNext);
  sliderContainer.appendChild(button);
  document.querySelector('.main').style.display = 'block';
  document.getElementById("search-div").style.display = "none";


  // hide image aria
  imagesArea.style.display = 'none';
  const duration = document.getElementById('duration').value || 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  timer = setInterval(function () {
    slideIndex++;
    changeSlide(slideIndex);
  }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
  toggleSpinner();
})

sliderBtn.addEventListener('click', function () {
  const duration = document.getElementById("duration").value;
  if (duration >= 1000 || duration == "") {
    createSlider();
  } else {
    alert("You can't choose a negative value or a value less then 1000");
  }

})

document.getElementById("search").addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.key === "Enter") {
    searchBtn.click();
  }
})

// One mini bonus feature below. It makes the duration search box clickable by enter.

document.getElementById("duration").addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.key === "Enter") {
    sliderBtn.click();
  }
})

// Toggler. It toggles thumbnail images.

const toggle = (element) => {
  element.classList.toggle("added");

}

// One bonus feature below. It creates a spinner while the data is loading.

const toggleSpinner = () => {
  const spinner = document.getElementById("loading");
  spinner.classList.toggle("d-none");
}