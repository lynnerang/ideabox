class ideaCard {
  constructor(title, body, cardId, quality) {
    this.title = title;
    this.body = body;
    this.quality = quality;
    this.cardId = cardId;
  }

  saveToStorage() {
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

  deleteFromStorage() {
    var matchIndex = ideaCards.indexOf(this);

    ideaCards.splice(matchIndex, 1);
    this.saveToStorage();
  }

  updateQuality(newQuality) {
    this.quality = newQuality;
    this.saveToStorage();
  }
}








