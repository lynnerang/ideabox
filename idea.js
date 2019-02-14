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

  updateContent(fieldId, updatedTxt) {
    if (fieldId === 'cardTitle') {
      this.title = updatedTxt;
    } else {
      this.body = updatedTxt;
    }
    this.saveToStorage(ideaCards);
  }

  deleteFromStorage(ideaCards) {
    localStorage.setItem("ideaCards", JSON.stringify(ideaCards));
  }
}

  //function updateQuality() {}



