let ideaCards = JSON.parse(localStorage.getItem("ideaCards")) || [];
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const saveBtn = document.querySelector('.save-btn');
const cardArea = document.querySelector('.card-area');
const newTitle = document.getElementById('j-new-title');
const newBody = document.getElementById('j-new-body');
const qualityTerms = ['Mehhh', 'Swill', 'Plausible', 'Genius', 'Bestest'];

searchBtn.addEventListener('click', onSearchToggle);
searchInput.addEventListener('keyup', onSearchKeyup);  
saveBtn.addEventListener('click', onSave);
cardArea.addEventListener('click', onDelete);
cardArea.addEventListener('keypress', function(e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    e.preventDefault();
    let fieldId = e.target.id;
    let cardId = parseInt(e.target.parentNode.parentNode.id);
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
}

function onSave() {
  const newCard = new ideaCard(newTitle.value, newBody.value, Date.now(), 0);
  
  ideaCards.push(newCard);
  displayCard(newCard);
  newCard.saveToStorage();
  newTitle.value = "";
  newBody.value = "";
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
      return idea.body.toLowerCase().includes(searchInput.value.toLowerCase()) || idea.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });
    filteredCards.forEach(function(idea) {
    displayCard(idea);
  })
}

function onDelete(e) {
  if (e.target.classList.contains('delete-card-btn')) {
    const cardElement = e.target.closest('.idea-card');
    const match = findObjectById(parseInt(cardElement.id));
    
    match.deleteFromStorage();
    cardElement.remove();
  }
}

//add data attribute instead of ID for card
function displayCard(idea) {
  const qualityTxt = qualityTerms[idea.quality];
  const html = `<article class="idea-card" id="${idea.cardId}">
   <div class="card-main">
     <h2 class="title-txt" id="cardTitle" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})" aria-live="polite" aria-label="Add text or type / to add or edit idea title" role="textbox">${idea.title}</h2>
     <p class="body-txt" id="cardBody" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})" aria-live="polite" aria-label="Add text or type / to add or edit idea body">${idea.body}</p>
   </div>
   <div class="card-bottom">
     <div class="card-btns">
       <img class="btn-image downvote-btn" onclick="onVote(${idea.cardId}) aria-role="button" aria-label="Upvote idea" aria-controls="quality-txt" src="images/downvote.svg">
       <img class="btn-image upvote-btn" onclick="onVote(${idea.cardId})" aria-role="button" aria-label="Downvote idea" aria-controls="quality-txt" src="images/upvote.svg">
       <h3 class="idea-quality" aria-label="idea quality">Quality: <span class="quality-txt" aria-live="polite">${qualityTxt}</span></h3>
     </div>
     <div class="delete-btn">
       <img class="btn-image delete-card-btn" aria-role="button" aria-label="Delete idea" aria-controls="idea-card" src="images/delete.svg">
     </div>
   </div>
   </article>`;
 cardArea.innerHTML += html;
}

function findObjectById(id) {
  return ideaCards.find(idea => idea.cardId === id);
}

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


// function changeQuality(obj, direction) {
//   if (direction === 'increase') {
//     if (obj.quality === 'Swill') {
//       return 'Plausible';
//     }
//     return 'Genius';
//   }
//   if (obj.quality === 'Genius') {
//     return 'Plausible';
//   }
//   return 'Swill';
// }

// function onVote(cardId) {
//   var match = findObjectById(parseInt(cardId));
//   var newQuality;
  
//   if (event.target.classList.contains('upvote-btn')) {
//     newQuality = changeQuality(match, 'increase');
//   } else {
//     newQuality = changeQuality(match);
//   }
//   match.updateQuality(newQuality);  
//   event.target.parentNode.querySelector('.quality-txt').innerText = match.quality;
// }

// function increaseQuality(obj) {
//  if (obj.quality === 'Swill') {
//     return 'Plausible';
//   } else if(obj.quality === 'Plausible') {
//     return 'Genius';
//   } else {
//     return 'Genius';
//   }
// }

// function decreaseQuality(obj) {
//   if (obj.quality === 'Genius') {
//     return 'Plausible';
//   } else if(obj.quality === 'Plausible') {
//     return 'Swill';
//   } else {
//     return 'Swill';
//   }
// }

// function onUpvote(cardId) {
//   if (event.target.classList.contains('upvote-btn')) {
//     var match = findObjectById(parseInt(cardId));
//     var newQuality = increaseQuality(match);
//     match.updateQuality(newQuality);
//     event.target.parentNode.querySelector('.idea-quality').innerText = `Quality: ${match.quality}`;
//   }
// }

// function onDownvote(cardId) {
//   if (event.target.classList.contains('downvote-btn')) {
//     var match = findObjectById(parseInt(cardId));
//     var newQuality = decreaseQuality(match);
//     match.updateQuality(newQuality);
//     event.target.parentNode.querySelector('.idea-quality').innerText = `Quality: ${match.quality}`;
//   }
// }



