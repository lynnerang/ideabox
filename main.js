var ideaCards = JSON.parse(localStorage.getItem("ideaCards")) || [];
var searchInput = document.querySelector('.search-input');
var saveBtn = document.querySelector('.save-btn');
var cardArea = document.querySelector('.card-area');
var newTitle = document.getElementById('j-new-title');
var newBody = document.getElementById('j-new-body');
var qualityTerms = ['Mehhh', 'Swill', 'Plausible', 'Genius', 'Bestest'];


searchInput.addEventListener('keyup', onSearch);  
saveBtn.addEventListener('click', onSave);
cardArea.addEventListener('click', onDelete);
cardArea.addEventListener('keypress', function(e) {
  var key = e.which || e.keyCode;
  if (key === 13) {
    e.preventDefault();
    var fieldId = e.target.id;
    var cardId = parseInt(e.target.parentNode.parentNode.id);
    var updatedTxt = e.target.textContent;
    findObjectById(cardId).updateContent(fieldId, updatedTxt);
  }
});

onPageLoad(ideaCards);

function onPageLoad(array) {
  ideaCards = [];
  array.forEach(function(idea){
    var newCard = new ideaCard(idea.title, idea.body, idea.cardId, idea.quality);
    ideaCards.push(newCard);
    displayCard(newCard);
  });
}

function onSave() {
  var newCard = new ideaCard(newTitle.value, newBody.value, Date.now(), 0);
  
  ideaCards.push(newCard);
  displayCard(newCard);
  newCard.saveToStorage();
  newTitle.value = "";
  newBody.value = "";
}

function onFocusout(cardId) {
  var updatedTxt = event.target.textContent;
  var fieldId = event.target.id;
  findObjectById(cardId).updateContent(fieldId, updatedTxt);
}

function onVote(cardId) {
  var match = findObjectById(parseInt(cardId));
  var newQuality;
  
  if (event.target.classList.contains('upvote-btn')) {
    newQuality = changeQuality(match, 'increase');
  } else {
    newQuality = changeQuality(match);
  }
  match.updateQuality(newQuality);  
  event.target.parentNode.querySelector('.quality-txt').innerText = qualityTerms[newQuality];
}

function onSearch() {
    cardArea.innerHTML = "";
    var filteredCards = ideaCards.filter(function(idea) {
      return idea.body.toLowerCase().includes(searchInput.value.toLowerCase()) || idea.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });
    filteredCards.forEach(function(idea) {
    displayCard(idea);
  })
}

function onDelete(e) {
  if (e.target.classList.contains('delete-card-btn')) {
    var cardElement = e.target.closest('.idea-card');
    var match = findObjectById(parseInt(cardElement.id));
    
    match.deleteFromStorage();
    cardElement.remove();
  }
}

//add data attribute instead of ID for card
function displayCard(idea) {
  var qualityTxt = qualityTerms[idea.quality];
  var html = `<article class="idea-card" id="${idea.cardId}">
   <div class="card-main">
     <h2 class="title-txt" id="cardTitle" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})">${idea.title}</h2>
     <p class="body-txt" id="cardBody" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})">${idea.body}</p>
   </div>
   <div class="card-bottom">
     <div class="card-btns">
       <img class="btn-image downvote-btn" onclick="onVote(${idea.cardId})" src="images/downvote.svg">
       <img class="btn-image upvote-btn" onclick="onVote(${idea.cardId})" src="images/upvote.svg">
       <h3 class="idea-quality">Quality: <span class="quality-txt">${qualityTxt}</span></h3>
     </div>
     <div class="delete-btn">
       <img class="btn-image delete-card-btn" src="images/delete.svg">
     </div>
   </div>
   </article>`;
 cardArea.innerHTML += html;
}

function findObjectById(id) {
  return ideaCards.find(function(idea){return idea.cardId === id;});
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
  var totalChars = event.target.value.length;
  var charLimit = parseInt(event.target.nextElementSibling.querySelector('.char-limit').innerText);
  var charCounter = event.target.nextElementSibling.querySelector('.char-count');
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

var searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', searchToggle);

function searchToggle() {
  var header = document.querySelector('header');
  var searchDiv = document.querySelector('.search');
  var searchIcon = document.querySelector('.fa-lg');
  var closeIcon = document.querySelector('.fa-minus-circle');

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



