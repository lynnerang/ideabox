var ideaCards = JSON.parse(localStorage.getItem("ideaCards")) || [];
var searchInput = document.getElementById('search-term');
var searchBtn = document.querySelector('.search-btn');
var newTitle = document.getElementById('j-new-title');
var newBody = document.getElementById('j-new-body');
var saveBtn = document.querySelector('.save-btn');
var cardArea = document.querySelector('.card-area');
var cardTitle = document.querySelector('.title-text');
var cardBody = document.querySelector('.body-text');

onPageLoad(ideaCards);

searchInput.addEventListener('keyup', onSearchKeyup);
    
saveBtn.addEventListener('click', onSave);

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

function onPageLoad(array) {
  ideaCards = [];
  array.forEach(function(idea){
    var newCard = new ideaCard(idea.title, idea.body, idea.cardId);
    ideaCards.push(newCard);
    displayCard(newCard);
  });
}

function onSave() {
  var newCard = new ideaCard(newTitle.value, newBody.value, Date.now());
  ideaCards.push(newCard);
  newCard.saveToStorage(ideaCards);
  displayCard(newCard);
}

function onFocusOut(cardId) {
  var updatedTxt = event.target.textContent;
  var fieldId = event.target.id;
  findObjectById(cardId).updateContent(fieldId, updatedTxt);
}

function displayCard(idea) {
      var html = `<article class="idea-card" id="${idea.cardId}">
     <div class="card-main">
       <h2 class="title-text" id="cardTitle" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})">${idea.title}</h2>
       <p class="body-text" id="cardBody" contenteditable="true" onfocusout="onFocusOut(${idea.cardId})">${idea.body}</p>
     </div>
     <div class="card-bottom">
       <div class="adjust-buttons">
         <span class="quality-down-btn" onclick="onDownvote"><img src="images/downvote.svg" class="button-image"></span>
         <span class="quality-up-btn" onclick="onUpvote"><img src="images/upvote.svg" class="button-image"></span>
       <h3 class="idea-quality">Quality: ${idea.quality}</h3>
       </div>
       <div class="delete-button">
         <span class="delete-card-btn"><img onclick="onRemoveCard" src="images/delete.svg" class="button-image"></span>
       </div>
     </div>
     </article>`;
     cardArea.innerHTML += html;
  }


function findObjectById(id) {
  return ideaCards.find(function(idea){return idea.cardId === id;});
}

function onSearchKeyup() {
    cardArea.innerHTML = "";
    var filteredCards = ideaCards.filter(function(idea) {
      return idea.body.toLowerCase().includes(searchInput.value.toLowerCase()) || idea.title.toLowerCase().includes(searchInput.value.toLowerCase());
  });
    filteredCards.forEach(function(idea) {
    displayCard(idea);
  })
}












