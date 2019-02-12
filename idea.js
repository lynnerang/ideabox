class ideaCard {
  constructor(title, body, id) {
    this.title = title;
    this.body = body;
    this.quality = 'swill';
    this.id = id;
  }
  saveToStorage () {
    localStorage.setItem("ideaCards", JSON.stringify(ideaCards));
  }
}

//function updateContent() {}

//function deleteFromStorage() {}

//function saveToStorage() {}

//function updateQuality() {}
