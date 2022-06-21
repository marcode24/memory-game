let cards = [
  { id: 1, image: "./images/1.jpg" },
  { id: 2, image: "./images/2.jpg" },
  { id: 3, image: "./images/3.jpg" },
  { id: 5, image: "./images/5.jpg" },
  { id: 6, image: "./images/6.jpg" },
  { id: 7, image: "./images/7.jpg" },
  { id: 8, image: "./images/8.jpg" },
  { id: 9, image: "./images/9.jpg" },
  { id: 10, image: "./images/10.jpg" },
  { id: 11, image: "./images/11.jpg" },
  { id: 12, image: "./images/12.jpg" },
  { id: 13, image: "./images/13.jpg" },
  { id: 14, image: "./images/14.jpg" },
  { id: 15, image: "./images/15.jpg" },
  { id: 16, image: "./images/16.jpg" },
];

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const difficultyParam = urlParams.get("d");

// 1 - easy, 2 - medium, 3 - hard
const container = document.getElementById("cards-container");
let difficulty = getDifficulty(difficultyParam);

function getDifficulty(difficulty) {
  if (difficulty === "medium") {
    container.classList.add("medium");
    return 2;
  }
  if (difficulty === "hard") {
    container.classList.add("hard");
    return 3;
  }
  return 1;
}

cards.length = difficulty === 1 ? 10 : difficulty === 2 ? 12 : 15;

// mix cards
function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

let newCards = [...cards, ...JSON.parse(JSON.stringify(cards))];
newCards.forEach((card, index) => (card.idUnique = index + 1));
newCards = shuffle(newCards);

const difficultyText = document.getElementById("difficulty");
difficultyText.innerHTML = `Difficulty: ${
  difficulty === 1 ? "easy" : difficulty === 2 ? "medium" : "hard"
}`;

let template = "";
newCards.forEach((card) => {
  template += `
  <div class="card-box" id="${card.idUnique}">
    <div class="card">
      <div class="face face-front">
        <div class="coverage">
          <div class="coverage-inside"></div>
        </div>
      </div>
      <div class="face face-back">
        <img src="${card.image}" >
      </div>
    </div>
  </div>`;
});
container.innerHTML = template;

const timer = document.getElementById("timer");
const modal = document.getElementById("result");
const titleModal = document.querySelector(".title-modal");

let hundredth = 0;
let seconds = 60;

function run() {
  if (hundredth === 0 && seconds === 0) {
    timer.classList.add("danger");
    modal.classList.add("show");
    titleModal.innerHTML = "Oh no! you lost :(";
  } else {
    if (hundredth == 0) {
      --seconds;
      hundredth = 99;
    } else {
      --hundredth;
    }
    if (seconds < 10) {
      timer.classList.add("danger");
    }
    timer.innerHTML = "Time: " + seconds + "s";
  }
}

const timerTemp = setInterval(run, 10);

let countMovements = 0;
let right = 0;
let statusWon = cards.length;

let movements = document.getElementById("movements");
movements.textContent = `Movements: ${countMovements}`;
let remaining = document.getElementById("remaining");
remaining.textContent = `Remaining: ${statusWon - right}`;

let cardOneSelected, cardOneSelectedID, cardOneSelectedIndex;
let cardTwoSelected, cardTwoSelectedID, cardTwoSelectedIndex;

const cardBox = document.querySelectorAll(".card-box");

cardBox.forEach((card) => {
  card.addEventListener("click", function (e) {
    if (card.classList.contains("disabled")) {
      return;
    }
    if (cardOneSelected === undefined || cardTwoSelected === undefined) {
      if (cardOneSelected === undefined) {
        // save id to compare if click again in the same card
        cardOneSelected = card;
        cardOneSelectedIndex = newCards.findIndex(
          (card) => card.idUnique === Number(cardOneSelected.id)
        );
        cardOneSelectedID = newCards.find(
          (card) => card.idUnique === Number(cardOneSelected.id)
        ).id;
        return cardBox[cardOneSelectedIndex].children[0].classList.add(
          "rotate-card"
        );
      }
      // verify if clicked in the same card
      if (+card.id !== +cardOneSelected.id) {
        cardTwoSelected = card;
        cardTwoSelectedIndex = newCards.findIndex(
          (card) => card.idUnique === Number(cardTwoSelected.id)
        );
        cardTwoSelectedID = newCards.find(
          (card) => card.idUnique === Number(cardTwoSelected.id)
        ).id;
        cardBox[cardTwoSelectedIndex].children[0].classList.add("rotate-card");
        countMovements++;
        movements.textContent = `Movements: ${countMovements}`;

        if (cardOneSelected !== undefined && cardTwoSelected !== undefined) {
          if (cardOneSelectedID === cardTwoSelectedID) {
            cardBox[cardOneSelectedIndex].classList.add("disabled");
            cardBox[cardTwoSelectedIndex].classList.add("disabled");
            cardBox[cardOneSelectedIndex].children[0].classList.add(
              "rotate-card"
            );
            cardBox[cardTwoSelectedIndex].children[0].classList.add(
              "rotate-card"
            );
            resetCards();
            right++;
            remaining.textContent = `Remaining: ${statusWon - right}`;
            if (right === statusWon) {
              const tryAButton = document.getElementById("try-again");
              clearInterval(timerTemp);
              modal.classList.add("show");
              titleModal.innerHTML = "Nice, you won!";
              tryAButton.style.display = "none";
            }
          } else {
            setTimeout(() => {
              cardBox[cardOneSelectedIndex].children[0].classList.remove(
                "rotate-card"
              );
              cardBox[cardTwoSelectedIndex].children[0].classList.remove(
                "rotate-card"
              );
              resetCards();
            }, 800);
          }
        }
      }
    }
  });
});

function resetGame() {
  cardBox.forEach((card) => {
    card.classList.remove("disabled");
    card.children[0].classList.remove("rotate-card");
  });
  modal.classList.remove("show");
  seconds = 60;
  hundredth = 0;
  countMovements = 0;
  right = 0;
  movements.textContent = `Movements: ${countMovements}`;
  remaining.textContent = `Remaining: ${statusWon - right}`;
}

function resetCards() {
  cardOneSelected = undefined;
  cardTwoSelected = undefined;
}
