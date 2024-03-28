// Toggle buttons that switch between character and episode page and saves it to local storage
const showingCharacterPage = localStorage.getItem("showingCharacterPage");

if (showingCharacterPage === "false") {
  DOM_ELEMENT.firstPage.style.display = "none";
  DOM_ELEMENT.secondPage.style.display = "flex";
}

DOM_ELEMENT.charactersStart.addEventListener("click", () => {
  DOM_ELEMENT.firstPage.style.display = "flex";
  DOM_ELEMENT.secondPage.style.display = "none";
  localStorage.setItem("showingCharacterPage", "true");
});

DOM_ELEMENT.episodesStart.addEventListener("click", () => {
  DOM_ELEMENT.firstPage.style.display = "none";
  DOM_ELEMENT.secondPage.style.display = "flex";
  localStorage.setItem("showingCharacterPage", "false");
});
