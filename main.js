let ideaCards = JSON.parse(localStorage.getItem("ideaCards")) || [];
let displayedCards;
let cardsHidden = false;
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const saveBtn = document.querySelector('.save-btn');
const cardArea = document.querySelector('.card-area');
const newTitle = document.getElementById('j-new-title');
const newBody = document.getElementById('j-new-body');
const qualityTerms = ['Mehhh', 'Swill', 'Plausible', 'Genius', 'Bestest'];
const showBtn = document.querySelector('.show-btn');

searchBtn.addEventListener('click', onSearchToggle);
searchInput.addEventListener('keyup', onSearchKeyup);  
saveBtn.addEventListener('click', onSave);
cardArea.addEventListener('click', onDelete);
showBtn.addEventListener('click', onShow);
cardArea.addEventListener('keypress', function(e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    e.preventDefault();
    let fieldId = e.target.id;
    let cardId = parseInt(e.target.closest('.idea-card').dataset.identifier);
    let updatedTxt = e.target.textContent;
    findObjectById(cardId).updateContent(fieldId, updatedTxt);
  }
});

onPageLoad(ideaCards);

function onPageLoad(array) {
  ideaCards = [];
  array.forEach(idea => {
    const newCard = new ideaCard(idea.title, idea.body, idea.cardId, idea.quality);
    ideaCards.push(newCard);
    displayCard(newCard);
  });
  updateList();
  onShow();
}

function onSave() {
  const newCard = new ideaCard(newTitle.value, newBody.value, Date.now(), 0);
  
  ideaCards.push(newCard);
  displayCard(newCard);
  newCard.saveToStorage();
  checkForMrPB(newTitle.value, newBody.value);
  resetForm();
  updateList();
}

function onFocusout(cardId) {
  const updatedTxt = event.target.textContent;
  const fieldId = event.target.id;
  findObjectById(cardId).updateContent(fieldId, updatedTxt);
}

function onVote(cardId) {
  const match = findObjectById(parseInt(cardId));
  let newQuality;
  
  if (event.target.classList.contains('upvote-btn')) {
    newQuality = changeQuality(match, 'increase');
  } else {
    newQuality = changeQuality(match);
  }
  match.updateQuality(newQuality);  
  event.target.parentNode.querySelector('.quality-txt').innerText = qualityTerms[newQuality];
}

function onSearchKeyup() {
    cardArea.innerHTML = "";
    const filteredCards = ideaCards.filter(function(idea) {
      return idea.body.toLowerCase().includes(searchInput.value.toLowerCase()) || 
      idea.title.toLowerCase().includes(searchInput.value.toLowerCase());
    });
    filteredCards.forEach(function(idea) {displayCard(idea)});
    updateList();
}

function onDelete(e) {
  if (e.target.classList.contains('delete-card-btn')) {
    const cardElement = e.target.closest('.idea-card');
    const match = findObjectById(parseInt(cardElement.dataset.identifier));
    
    match.deleteFromStorage();
    cardElement.remove();
    updateList();
  }
}

//add data attribute instead of ID for card
function displayCard(idea) {
  const qualityTxt = qualityTerms[idea.quality];
  const html = `<article class="idea-card" data-identifier="${idea.cardId}">
   <div class="card-main">
     <h2 class="title-txt" id="cardTitle" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})" aria-live="polite" aria-label="Add text or type / to add or edit idea title" role="textbox">${idea.title}</h2>
     <p class="body-txt" id="cardBody" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})" aria-live="polite" aria-label="Add text or type / to add or edit idea body">${idea.body}</p>
   </div>
   <div class="card-bottom">
     <div class="card-btns">
       <img class="btn-image downvote-btn" onclick="onVote(${idea.cardId})" aria-role="button" aria-label="Downvote this idea" aria-controls="quality-txt" src="images/downvote.svg">
       <img class="btn-image upvote-btn" onclick="onVote(${idea.cardId})" aria-role="button" aria-label="Upvote this idea" aria-controls="quality-txt" src="images/upvote.svg">
       <h3 class="idea-quality" aria-label="idea quality">Quality: <span class="quality-txt" aria-live="polite">${qualityTxt}</span></h3>
     </div>
     <div class="delete-btn">
       <img class="btn-image delete-card-btn" aria-role="button" aria-label="Delete idea" aria-controls="${idea.cardId}" src="images/delete.svg">
     </div>
   </div>
   </article>`;
 cardArea.innerHTML += html;
}

function findObjectById(id) {
  return ideaCards.find(idea => idea.cardId === id);
} 

// function findObjectsByQuality(qual) {
//   return ideaCards.filter(idea => idea.quality === qual);
// }

function changeQuality(obj, direction) {
  if (direction === 'increase' && obj.quality < 4) {
    return obj.quality + 1;
  } else if (direction !== 'increase' && obj.quality > 0) {
    return obj.quality - 1;
  } else {
    return obj.quality;
  }
}

function onKeyup() {
  const totalChars = event.target.value.length;
  const charLimit = parseInt(event.target.nextElementSibling.querySelector('.char-limit').innerText);
  const charCounter = event.target.nextElementSibling.querySelector('.char-count');
  charCounter.innerText = totalChars;

  showErrs(event.target, charLimit)

  if (validLength(newTitle, 70) && validLength(newBody, 120)) {
    saveBtn.disabled = false;
  } else {
    saveBtn.disabled = true;
  }
}

function validLength(input, limit) {
  return input.value.length > 0 && input.value.length <= limit;
}

function showErrs(input, limit) {
  if (input.value.length > 0 && input.value.length <= limit) {
    input.nextElementSibling.classList.remove('error');
    input.classList.remove('error-border');
  } else {
    input.nextElementSibling.classList.add('error');
    input.classList.add('error-border');
  }
}

function resetForm() {
  newTitle.value = "";
  newBody.value = "";
  saveBtn.disabled = true;
  const counts = Array.from(document.querySelectorAll('.char-count'));
  counts.forEach(count => count.innerText = "0");
}

function onSearchToggle() {
  const header = document.querySelector('header');
  const searchDiv = document.querySelector('.search-box');
  const searchIcon = document.querySelector('.fa-lg');
  const closeIcon = document.querySelector('.fa-minus-circle');

  if (searchBtn.classList.contains('search-btn-open')) {
    searchDiv.classList.remove('search-open');
    searchIcon.classList.remove('fa-lg-open');
    closeIcon.classList.remove('fa-minus-circle-open');
    header.classList.remove('header-open');
    searchInput.classList.remove('search-input-open');
    searchBtn.classList.remove('search-btn-open');
  } else {
    searchDiv.classList.add('search-open');
    searchIcon.classList.add('fa-lg-open');
    closeIcon.classList.add('fa-minus-circle-open');
    header.classList.add('header-open');
    searchInput.classList.add('search-input-open');
    searchBtn.classList.add('search-btn-open');
  }
}

// function showMoreLess() {
//   const hiddenCards = document.querySelectorAll('.hide-card');
//   if (hiddenCards.length > 0) {
//     showCards(hiddenCards);
//     showMoreBtn.innerText = "Show Less...";
//   } else {
//     hideCards();
//   }
// }

// function hideCards() {
//   const allCards = document.querySelectorAll('.idea-card');
//   for(var i = 0; i < allCards.length; i++) {
//     if (i >= 10) {
//       allCards[i - 10].classList.add('hide-card');
//       showMoreBtn.innerText = "Show More...";
//     }
//   }
// }

// function showCards(hiddenCards) {
//   hiddenCards.forEach(function(card) {
//     card.classList.remove('hide-card');
//   });
//   showMoreBtn.innerText = "Show Less...";
// }


function onShow() {
  if (cardsHidden === false) {
    hideCards();
  } else {
    showCards();
  }
  updateList();
}

function hideCards() {
  for (var i = 0; i < (displayedCards.length - 10); i++) {
    displayedCards[i].classList.add('hide-card');
  }
  showBtn.innerText = "Show More...";
  cardsHidden = true;
}

function showCards() {
  displayedCards.forEach(function(card) {
    card.classList.remove('hide-card')
  });
  showBtn.innerText = "Show Less...";
  cardsHidden = false;
}

function setShowBtnVisibility() {
  if (overTenCards() === false) {
    showBtn.classList.add('hidden');
  } else if (overTenCards() === true && cardsHidden === true) {
    showBtn.classList.remove('hidden');
  } else if (overTenCards() === true && cardsHidden === false) {
    showBtn.classList.remove('hidden');
  }
}

function overTenCards() {
  return displayedCards.length > 10;
}

function updateList() {
  displayedCards = document.querySelectorAll('.idea-card');
  setShowBtnVisibility();
}

function checkForMrPB(title, body) {
  if (title.toLowerCase().includes("poopy", "butthole") || body.toLowerCase().includes("poopy", "butthole")) {
    document.querySelector('.pb-animation').classList.add('mr-pb');
  }
}



