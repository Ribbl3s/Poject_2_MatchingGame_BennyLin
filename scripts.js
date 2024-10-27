const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard; 
let lockBoard = false;
let score = 0;

document.querySelector(".score").textContent = score;

fetch("./data/cards.json") // Fetches the contents of cards.json file
  .then((res) => res.json()) //res represents the response object returned by the fetch request. res.json() is a method that converts the response body to a JavaScript object using JSON parsing.
  .then((data) => { //data represents the array of card objects retrieved from the cards.json file.
    cards = [...data, ...data]; // The code spreads the data array twice using the spread operator `...`, creating a new array that duplicates the original data.
    shuffleCards();
    generateCards();
  });

function shuffleCards() {
  let currentIndex = cards.length, //currentIndex is initialized to the length of the cards array. It represents the index of the element currently being shuffled.
    randomIndex, //randomIndex will be used to store a random index within the range of the remaining unshuffled elements.
    temporaryValue; //temporaryValue is a temporary variable for swapping elements during the shuffle process.
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card"); //Adds the CSS class "card" to the cardElement, allowing it to be styled according to the .card class defined in the CSS.
    cardElement.setAttribute("data-name", card.name); //Sets a custom data attribute data-name on the cardElement to the value of card.name.    This attribute will be used later to identify the card when checking for matches
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement); //Adds the newly created cardElement to the gridContainer, which is a reference to the main container for all the cards on the board.
    cardElement.addEventListener("click", flipCard); //Adds a click event listener to the cardElement, so that when it is clicked, the flipCard function is called.
  }
}

function flipCard() {
  if (lockBoard) return; //If lockBoard is true, the function returns early, preventing any further actions from occurring.
  if (this === firstCard) return; //Checks if the clicked card (this) is the same as the firstCard.   If it is, the function returns early, meaning no action is taken.

  this.classList.add("flipped"); //Adds the "flipped" class to the clicked card (this), which triggers a CSS transformation to visually flip the card.

  if (!firstCard) { //Checks if firstCard is null or undefined, which means no card has been flipped yet.
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true; // locks board so no cards can be flippped while checkForMatch is running.

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;  //This line checks if the data-name attribute of the firstCard is equal to the data-name attribute of the secondCard.

  isMatch ? disableCards() : unflipCards();
}

const disableCards = () => {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
};

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}
