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
    this.saveToStorage();
  }

  updateQuality(newQuality) {
    this.quality = newQuality;
    this.saveToStorage();
  }
}





