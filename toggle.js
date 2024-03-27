DOM_ELEMENT.charactersStart.addEventListener("click", () => {
  DOM_ELEMENT.firstPage.style.display = "flex";
  DOM_ELEMENT.secondPage.style.display = "none";
});

DOM_ELEMENT.episodesStart.addEventListener("click", () => {
  DOM_ELEMENT.firstPage.style.display = "none";
  DOM_ELEMENT.secondPage.style.display = "flex";
});
