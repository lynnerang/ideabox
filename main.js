let ideaCards = JSON.parse(localStorage.getItem("ideaCards")) || [];
let currentCardList = document.querySelectorAll('.idea-card');
const qualityTerms = Array.from(document.querySelectorAll('.filter-btn')).map(btn => btn.innerText);
const searchInput = document.querySelector('.search-input');
const newTitle = document.getElementById('j-new-title');
const newBody = document.getElementById('j-new-body');
const saveBtn = document.querySelector('.save-btn');
const filters = document.querySelector('.filter-btns');
const cardArea = document.querySelector('.card-area');
const showBtn = document.querySelector('.show-btn');
let cardsHidden = false;

const displayAllCards = () => {
  ideaCards = ideaCards.map(idea => new IdeaCard(idea.title, idea.body, idea.cardId, idea.quality));
  ideaCards.forEach(idea => displayCard(idea));
  updateCurrentCardList();
}

const onSave = () => {
  const newCard = new IdeaCard(newTitle.value, newBody.value, Date.now(), 0);
  ideaCards.push(newCard);
  displayCard(newCard);
  newCard.saveToStorage();
  checkForMrPB(newTitle.value, newBody.value);
  resetForm();
  updateCurrentCardList();
}

const onFocusout = (e) => {
  const cardId = parseInt(e.target.closest('.idea-card').id);
  if (e.target.classList.contains('card-txt')) {
    let updatedTxt = e.target.textContent;
    findObjectById(cardId).updateContent(e.target.id, updatedTxt);
  }
}

const onAreaClick = (e) => {
  const obj = findObjectById(parseInt(e.target.closest('.idea-card').id));
  if (e.target.classList.contains('delete-card-btn')) {
    e.target.closest('.idea-card').remove();
    obj.deleteFromStorage();
  } else if (e.target.classList.contains('btn-image')) {
    voteCard(e.target, obj);
  }
}

const onSearchKeyup = () => {
  const searchTerms = searchInput.value.toLowerCase();
  clearFilterStyles();
  const matchingCards = ideaCards.filter(idea => {
    return idea.body.toLowerCase().includes(searchTerms) || 
    idea.title.toLowerCase().includes(searchTerms);
  });
  cardArea.innerHTML = '';
  matchingCards.forEach(idea => displayCard(idea));
  updateCurrentCardList();
}

const onFilter = e => {
  if (e.target.classList.contains('filter-btn')) {
    clearIdeasAndSearch();
    const filterName = qualityTerms.find(term => term === e.target.innerText);
    runFilter(qualityTerms.indexOf(filterName));
  }
}

const onShow = () => !cardsHidden ? hideCards() : showCards();

const onFormKeyup = (e) => {
  let charLimit;
  e.target.id === 'newTitle' ? charLimit = 70 : charLimit = 120;
  const charCounter = e.target.nextElementSibling.querySelector('.char-count');
  charCounter.innerText = e.target.value.length;
  showErrs(e.target, charLimit)
  saveBtn.disabled = !validLength(newTitle, 70) || !validLength(newBody, 120);
}

const displayCard = idea => {
  const qualityTxt = qualityTerms[idea.quality];
  const html = `<article class="idea-card animated flash" id="${idea.cardId}">
   <div class="card-main">
     <h2 class="card-txt title-txt" id="cardTitle" contenteditable="true" aria-live="polite" aria-label="Add text or type / to add or edit idea title" role="textbox">${idea.title}</h2>
     <p class="card-txt body-txt" id="cardBody" contenteditable="true" aria-live="polite" aria-label="Add text or type / to add or edit idea body">${idea.body}</p>
   </div>
   <div class="card-bottom">
     <div class="card-btns">
       <img class="btn-image downvote-btn" aria-role="button" aria-label="Downvote this idea" aria-controls="quality-txt" src="images/downvote.svg">
       <img class="btn-image upvote-btn" aria-role="button" aria-label="Upvote this idea" aria-controls="quality-txt" src="images/upvote.svg">
       <h3 class="idea-quality" aria-label="idea quality">Quality: <span class="quality-txt" aria-live="polite">${qualityTxt}</span></h3>
     </div>
     <div class="delete-btn">
       <img class="btn-image delete-card-btn" aria-role="button" aria-label="Delete idea" aria-controls="${idea.cardId}" src="images/delete.svg">
     </div>
   </div>
   </article>`;
  cardArea.insertAdjacentHTML('beforeend', html);
}

const findObjectById = id => ideaCards.find(idea => idea.cardId === id);

const voteCard = (target, obj) => {
  let newQuality;
  target.classList.contains('upvote-btn') ? newQuality = changeQuality(obj, 'inc')
    : newQuality = changeQuality(obj);
  obj.updateQuality(newQuality);  
  target.parentNode.querySelector('.quality-txt').innerText = qualityTerms[newQuality];
}

const changeQuality = (obj, direction) => {
  if (direction === 'inc' && obj.quality < 4) {
    return obj.quality + 1;
  } else if (direction !== 'inc' && obj.quality > 0) {
    return obj.quality - 1;
  } else {
    return obj.quality;
  }
}

const runFilter = qual => {
  clearIdeasAndSearch();
  if (!event.target.classList.contains('active-btn')) {
    clearFilterStyles();
    ideaCards.filter(card => card.quality === qual).forEach(card => displayCard(card));
    event.target.classList.add('active-btn');
  } else {
    clearFilterStyles();
    displayAllCards();
  }
  updateCurrentCardList();
}

const validLength = (input, limit) => input.value.length > 0 && input.value.length <= limit;

const showErrs = (input, limit) => {
  if (input.value.length > 0 && input.value.length <= limit) {
    input.nextElementSibling.classList.remove('error');
    input.classList.remove('error-border');
  } else {
    input.nextElementSibling.classList.add('error');
    input.classList.add('error-border');
  }
}

const resetForm = () => {
  newTitle.value = '';
  newBody.value = '';
  saveBtn.disabled = true;
  const counts = Array.from(document.querySelectorAll('.char-count'));
  counts.forEach(count => count.innerText = '0');
}

const clearFilterStyles = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => btn.classList.remove('active-btn'));
}

const clearIdeasAndSearch = () => {
  cardArea.innerHTML = '';
  searchInput.value = '';
}

const hideCards = () => {
  for (let i = 0; i < (currentCardList.length - 10); i++) {
    currentCardList[i].classList.add('hide-card');
  }
  showBtn.innerText = 'Show More...';
  cardsHidden = true;
}

const showCards = () => {
  currentCardList.forEach(card => card.classList.remove('hide-card'));
  showBtn.innerText = 'Show Less...';
  cardsHidden = false;
}

const overTenCards = () => currentCardList.length > 10;

const updateCurrentCardList = () => {
  currentCardList = document.querySelectorAll('.idea-card');
  hideCards();
  !overTenCards() ? showBtn.classList.add('hidden') : showBtn.classList.remove('hidden');
}

const checkForMrPB = (title, body) => {
  if (title.toLowerCase().includes('poopy', 'butthole') || 
    body.toLowerCase().includes('poopy', 'butthole')) {
    document.querySelector('.pb-animation').classList.add('mr-pb');
  }
}

displayAllCards();

searchInput.addEventListener('keyup', onSearchKeyup);  
newTitle.addEventListener('keyup', onFormKeyup);
newBody.addEventListener('keyup', onFormKeyup);
saveBtn.addEventListener('click', onSave);
showBtn.addEventListener('click', onShow);
filters.addEventListener('click', onFilter);
cardArea.addEventListener('click', onAreaClick);
cardArea.addEventListener('focusout', onFocusout);
cardArea.addEventListener('keypress', function(e) {
  const key = e.which || e.keyCode;
  if (key === 13) {
    e.preventDefault();
    let cardId = parseInt(e.target.closest('.idea-card').id);
    let updatedTxt = e.target.textContent;
    findObjectById(cardId).updateContent(e.target.id, updatedTxt);
  } 
});



