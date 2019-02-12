var ideaCards = [];
var searchInput = document.getElementById('search-term');
var searchBtn = document.querySelector('.search-btn');
var title = document.getElementById('title');
var body = document.getElementById('body');
var saveBtn = document.querySelector('.save-btn');
var cardArea = document.querySelector('.card-section');
// window.onload = function () {
//   var ideasArray = JSON.parse (localStorage.getItem )
// }

saveBtn.addEventListener('click', onSave);

function onSave () {
  var newCard = new ideaCard(title.value, body.value, Date.now());
  var html = `<article class=“idea-card” data-index=>
     <div class=“card-body”>
       <h2 contenteditable=“true”>${newCard.title}</h2>
       <p class=“idea-body-text” contenteditable=“true”>${newCard.body}</p>
     </div>
     <div class=“card-bottom”>
       <div class=“adjust-buttons”>
         <span class=“quality-down-btn”><img src=“images/downvote.svg” class=“button-image”></span>
         <span class=“quality-up-btn”><img src=“images/upvote.svg” class=“button-image”></span>
       <h3 class=“idea-quality”>Quality: ${newCard.quality}</h3>
       </div>
       <div class=“delete-button”>
         <span class=“delete-card-btn”><img onclick=“deleteIdea” src=“images/delete.svg” class=“button-image”></span>
       </div>
     </div>
     </article>`;
     cardArea.innerHTML += html;
}