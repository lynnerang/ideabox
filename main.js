var ideaCards = JSON.parse(localStorage.getItem("ideaCards")) || [];
var searchInput = document.getElementById('search-term');
var searchBtn = document.querySelector('.search-btn');
var title = document.getElementById('title');
var body = document.getElementById('body');
var saveBtn = document.querySelector('.save-btn');
var cardArea = document.querySelector('.card-section');
var cardTitle = document.querySelector('.title-text');
var cardBody = document.querySelector('.idea-body-text');

window.onload = onPageLoad(ideaCards);

saveBtn.addEventListener('click', onSave);
cardArea.addEventListener('keypress', function(e) {
  var key = e.which || e.keyCode;

  if (key === 13) {
    e.preventDefault();
    console.log(e.target.parentNode.parentNode);
    var cardId = e.target.parentNode.parentNode.id;
    console.log(e.target.parentNode.parentNode.id);
    var updatedInput = e.target.value;
    console.log(updatedInput);
    var match = findObjectById(cardId);
    console.log(match);
    match.updateContent(updatedInput);
  }
});

function onPageLoad (array) {
  ideaCards = [];
  array.forEach(function(idea){
    var newCard = new ideaCard(idea.title, idea.body, idea.cardId);
    ideaCards.push(newCard);
    displayCards(newCard);
  });
}

function onSave () {
  var newCard = new ideaCard(title.value, body.value, Date.now());
  ideaCards.push(newCard);
  newCard.saveToStorage(ideaCards);
  displayCards(newCard);
}

function displayCards(idea) {
      var html = `<article class="idea-card" id="${idea.cardId}">
     <div class="card-body">
       <h2 class="title-text" contenteditable="true">${idea.title}</h2>
       <p class="idea-body-text" contenteditable="true">${idea.body}</p>
     </div>
     <div class="card-bottom">
       <div class="adjust-buttons">
         <span class="quality-down-btn"><img src="images/downvote.svg" class="button-image"></span>
         <span class="quality-up-btn"><img src="images/upvote.svg" class="button-image"></span>
       <h3 class="idea-quality">Quality: ${idea.quality}</h3>
       </div>
       <div class="delete-button">
         <span class="delete-card-btn"><img onclick="deleteIdea" src="images/delete.svg" class="button-image"></span>
       </div>
     </div>
     </article>`;
     cardArea.innerHTML += html;
  };

function findObjectById(id) {
  // for(var i = 0; i < ideaCards.length; i++){
  //   if (ideaCards[i].cardId === id) {
  //     console.log(ideaCard[i]);
  //     return ideaCards[i];
  //   } 
  // }
  return ideaCards.find(function(idea){
    return idea.cardId === id;
  });
}