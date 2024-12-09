// Constructor Function for Product Objects
function Product(name, imgPath) {
  this.name = name;          // Product name (should match the image file name)
  this.imgPath = imgPath;    // File path to the product image
  this.timesShown = 0;       // Tracks how many times the product has been shown
  this.timesClicked = 0;     // Tracks how many times the product has been clicked
}

// Array of all products
const allProducts = [
  new Product('product1','images/assets/bag.jpg'),
  new Product('product2', 'images/assets/banana.jpg'),
  new Product('product3', 'images/assets/bathroom.jpg'),
  new Product('product4', 'images/assets/boots.jpg'),
  new Product('product5', 'images/assets/breakfast.jpg'),
  new Product('product6', 'images/assets/bubblegum.jpg'),
];

// Variables to track rounds and max rounds
let totalRounds = 25;
let currentRound = 0;

// Function to randomly select three unique products
function getRandomProducts() {
  // Randomly pick 3 products without repetition
  const randomProducts = [];
  while (randomProducts.length < 3) {
    const randomIndex = Math.floor(Math.random() * allProducts.length);
    const randomProduct = allProducts[randomIndex];
    if (!randomProducts.includes(randomProduct)) {
      randomProducts.push(randomProduct);
    }
  }
  return randomProducts;
}

// Function to render the products on the page
function renderProducts(products) {
  const productDisplay = document.getElementById('product-display');
  productDisplay.innerHTML = '';  // Clear previous images

  products.forEach(product => {
    const img = document.createElement('img');
    img.src = product.imgPath;
    img.alt = product.name;
    img.title = product.name; // Tooltip for the product name
    img.addEventListener('click', () => handleVote(product));
    productDisplay.appendChild(img);
  });
}

// Function to handle the vote when an image is clicked
function handleVote(product) {
  product.timesClicked++;
  product.timesShown++;

  currentRound++;

  // After 25 rounds, show results
  if (currentRound >= totalRounds) {
    endVotingSession();
  } else {
    const newProducts = getRandomProducts();
    renderProducts(newProducts);
  }
}

// Function to end the voting session and show the results
function endVotingSession() {
  const resultsButton = document.getElementById('results-button');
  resultsButton.style.display = 'block';  // Show results button after voting ends
  resultsButton.addEventListener('click', showResults);
}

// Function to display the results
function showResults() {
  const resultsSection = document.getElementById('results-section');
  const resultsList = document.getElementById('results-list');
  
  resultsList.innerHTML = ''; // Clear previous results
  
  allProducts.forEach(product => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `${product.name} had ${product.timesClicked} votes, and was shown ${product.timesShown} times.`;
    resultsList.appendChild(listItem);
  });
  
  resultsSection.style.display = 'block';  // Show the results section
}

// Initialize the app by starting the voting process
function startVoting() {
  const initialProducts = getRandomProducts();
  renderProducts(initialProducts);
}

startVoting();