/* Globals */
const productNames = [
  'bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum',
  'chair', 'cthulhu',
  'dog-duck', 'dragon',
  'pen', 'pet-sweep',
  'scissors', 'shark', 'sweep',
  'tauntaun',
  'unicorn',
  'water-can', 'wine-glass',
];

const maxRounds = 25;
let roundCtr = 0;

const leftImgElem = document.getElementById('img-left');
const centerImgElem = document.getElementById('img-center');
const rightImgElem = document.getElementById('img-right');
const imagesContainerElem = document.getElementById('images');
const viewResultsButtonElem = document.getElementById('view-results-btn');
const resetButtonElem = document.getElementById('reset-btn');

let productLeft = null;
let productCenter = null;
let productRight = null;

let chart = null;

// State object holds the current state of the application (all existing Products)
const state = {
  allProducts: [],
};

/* Product constructor */
function Product(title, path) {
  this.title = title;
  this.path = path;
  this.tally = 0;
  this.views = 0;
}

// Function to create products if not already in localStorage
function createProducts() {
  const len = productNames.length;
  for (let index = 0; index < len; index++) {
    const name = productNames[index];
    const path = 'imgs/assets/' + name + '.jpg';
    let newProduct = new Product(name, path);
    state.allProducts.push(newProduct);
  }
}

// Function to retrieve products from localStorage and initialize them
function initializeProductsFromStorage() {
  const storedData = localStorage.getItem('products');
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    state.allProducts = parsedData.map((prod) => {
      const newProduct = new Product(prod.title, prod.path);
      newProduct.tally = prod.tally;
      newProduct.views = prod.views;
      return newProduct;
    });
  } else {
    createProducts(); // If no data in localStorage, create fresh products
  }
}

function pickProducts() {
  const productsToShuffle = [...state.allProducts];
  shuffle(productsToShuffle);

  const newProducts = [];

  for (let index = 0; index < productsToShuffle.length; index++) {
    const candidateProduct = productsToShuffle[index];

    if (candidateProduct !== productLeft && candidateProduct !== productCenter && candidateProduct !== productRight) {
      newProducts.push(candidateProduct);
      if (newProducts.length === 3) {
        break;
      }
    }
  }

  productLeft = newProducts[0];
  productCenter = newProducts[1];
  productRight = newProducts[2];
}

function renderProducts() {
  leftImgElem.src = productLeft.path;
  centerImgElem.src = productCenter.path;
  rightImgElem.src = productRight.path;

  productLeft.views += 1;
  productCenter.views += 1;
  productRight.views += 1;

  // Save products data to localStorage after every update
  saveProductsToStorage();
}

/* fisher yates style shuffle */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function productClickHandler(event) {
  const productId = event.target.id;

  switch (productId) {
    case leftImgElem.id:
      productLeft.tally += 1;
      break;
    case centerImgElem.id:
      productCenter.tally += 1;
      break;
    case rightImgElem.id:
      productRight.tally += 1;
      break;
    default:
      alert('click a product, silly');
      return;
  }

  roundCtr += 1;

  // Save updated product data to localStorage after each vote
  saveProductsToStorage();

  if (roundCtr === maxRounds) {
    votingDone();
  } else {
    pickProducts();
    renderProducts();
  }
}

function saveProductsToStorage() {
  // Store the products array into localStorage as a JSON string
  localStorage.setItem('products', JSON.stringify(state.allProducts));
}

function votingDone() {
  imagesContainerElem.removeEventListener('click', productClickHandler);
  renderChart();
}

function votingDoneStretch() {
  imagesContainerElem.removeEventListener('click', productClickHandler);
  viewResultsButtonElem.hidden = false;
  viewResultsButtonElem.addEventListener('click', showResultsClickHandler);
}

function showResultsClickHandler() {
  viewResultsButtonElem.removeEventListener('click', productClickHandler);
  viewResultsButtonElem.hidden = true;

  resetButtonElem.addEventListener('click', resetClickHandler);
  resetButtonElem.hidden = false;

  renderChart();
}

/* global Chart */
function renderChart() {
  const ctx = document.getElementById('canvas').getContext('2d');

  const productVotes = [];
  const productTitles = [];
  const productViews = [];

  for (let index = 0; index < state.allProducts.length; index++) {
    const product = state.allProducts[index];
    productVotes.push(product.tally);
    productTitles.push(product.title);
    productViews.push(product.views);
  }

  chart = new Chart(ctx, {
    type: 'horizontalBar',
    data: {
      labels: productTitles,
      datasets: [
        {
          label: '# of Votes',
          data: productVotes,
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
        {
          label: '# of views',
          data: productViews,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      scales: {
        xAxes: [{
          ticks: {
            stepSize: 1,
          },
          gridLines: {
            display: false,
          },
        }]
      }
    }
  });
}

function resetClickHandler() {
  resetButtonElem.hidden = true;
  resetButtonElem.removeEventListener('click', resetClickHandler);
  
  cleanUp();
  
  // Reset localStorage to ensure fresh start
  localStorage.removeItem('products');
  start();
}

function cleanUp() {
  roundCtr = 0;
  chart.destroy();
}

function start() {
  imagesContainerElem.addEventListener('click', productClickHandler);

  initializeProductsFromStorage(); // Initialize products from localStorage

  pickProducts();
  renderProducts();
}

start();