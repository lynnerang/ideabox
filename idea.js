class ideaCard {
  constructor(title, body, cardId) {
    this.title = title;
    this.body = body;
    this.quality = 'swill';
    this.cardId = cardId;
  }
  saveToStorage(ideaCards) {
    localStorage.setItem("ideaCards", JSON.stringify(ideaCards));
  }
  updateContent(update) {
    console.log('update content ' + update);
  }
}


//function updateContent() {}

//function deleteFromStorage() {}

//function saveToStorage() {}

//function updateQuality() {}
