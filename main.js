var ideaCards = JSON.parse(localStorage.getItem("ideaCards")) || [];
var searchInput = document.getElementById('search-input');
var saveBtn = document.querySelector('.save-btn');
var cardArea = document.querySelector('.card-area');
var newTitle = document.getElementById('j-new-title');
var newBody = document.getElementById('j-new-body');

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
  var newCard = new ideaCard(newTitle.value, newBody.value, Date.now(), 'Swill');
  
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
  event.target.parentNode.querySelector('.quality-txt').innerText = match.quality;
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
      var html = `<article class="idea-card" id="${idea.cardId}">
     <div class="card-main">
       <h2 class="title-txt" id="cardTitle" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})">${idea.title}</h2>
       <p class="body-txt" id="cardBody" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})">${idea.body}</p>
     </div>
     <div class="card-bottom">
       <div class="card-btns">
         <img class="btn-image downvote-btn" onclick="onVote(${idea.cardId})" src="images/downvote.svg">
         <img class="btn-image upvote-btn" onclick="onVote(${idea.cardId})" src="images/upvote.svg">
         <h3 class="idea-quality">Quality: <span class="quality-txt">${idea.quality}</span></h3>
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
  if (direction === 'increase') {
    if (obj.quality === 'Swill') {
      return 'Plausible';
    }
    return 'Genius';
  }
  if (obj.quality === 'Genius') {
    return 'Plausible';
  }
  return 'Swill';
}

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



