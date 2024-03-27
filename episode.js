let episodes; // Holds all current episodes locally

// If there is no episodes stored locally we GET the episodes
// from the API (https://da-demo.github.io/api/futurama/episodes) and save them in local storage.$
// After that we build the table and populate it with the episodes
(async () => {
  if (localStorage.getItem("episodes") === null) {
    localStorage.setItem("episodes", JSON.stringify(await API.getEpisodes()));
  }

  episodes = await JSON.parse(localStorage.getItem("episodes"));
  episodes.forEach(addEpisodeToTable);
})();

//Create a new episode table row
function addEpisodeToTable(episode) {
  const episodeRow = document.createElement("tr");

  episode = calcSeasonNumber(episode);
  episode = calcEpisodeNumber(episode);

  episodeRow.innerHTML = `
                        <td>${episode.title}</td>
                        <td>${episode.season}</td>
                        <td>${episode.seasonEpisode}</td>
                        <td><button id="episodeButton${episode.id}">More info</button></td>
                        `;

  DOM_ELEMENT.episodeContainer.appendChild(episodeRow);

  const tempButton = document.getElementById(`episodeButton${episode.id}`);

  tempButton.addEventListener("click", () => {
    displayEpisode(episode);
  });
}

//Calculates the season number based on episode number
function calcSeasonNumber(episode) {
  const firstNumber = Number(episode.number.split(" - ")[0]);
  const season = Math.ceil(firstNumber / 10);
  episode.season = season;

  return episode;
}

//Split out the episode number
function calcEpisodeNumber(episode) {
  episode.seasonEpisode = Number(episode.number.split(" - ")[1]);

  return episode;
}

// Displays episode page
function displayEpisode(episode) {
  hideSecondPage();
  DOM_ELEMENT.episodePage.style.display = "flex";

  DOM_ELEMENT.episodePage.innerHTML = `
  <h2>${episode.title}</h2>
  <p>Season: ${episode.season}</p>
  <p>Episode: ${episode.seasonEpisode}</p>
  <p>Story: ${episode.desc}</p>
  <p>Original air date: ${episode.originalAirDate}</p>
  `;

  episodeCRUDButtons(episode);
}

// Hide second page (episodes table)
function hideSecondPage() {
  DOM_ELEMENT.secondPage.style.display = "none";
}

//Create buttons and CRUD functions on episode
function episodeCRUDButtons(episode) {
  const buttonDiv = document.createElement("div");
  DOM_ELEMENT.episodePage.appendChild(buttonDiv);

  const editEpisodeButton = createEditEpisodeButton(episode); //************************************** */
  buttonDiv.appendChild(editEpisodeButton);

  const episodeDeleteButton = createEpisodeDeleteButton(episode, buttonDiv);
  buttonDiv.appendChild(episodeDeleteButton);

  const backButton = goBackToMainPageFromEpisodePage();
  buttonDiv.appendChild(backButton);
}

//Creates the "Edit episode" button that displays the update form
function createEditEpisodeButton(episode) {
  const editEpisodeButton = document.createElement("button");
  editEpisodeButton.textContent = "Edit Episode";
  editEpisodeButton.classList.add("edit-button");
  editEpisodeButton.addEventListener("click", () => {
    DOM_ELEMENT.episodePage.style.display = "none";
    DOM_ELEMENT.updateEpisodePage.style.display = "flex";
    DOM_ELEMENT.updateTitle.value = episode.title;
    DOM_ELEMENT.updateSeason.value = episode.season;
    DOM_ELEMENT.updateEpisodeNumber.value = episode.seasonEpisode;
    updateEpisode(episode); //*************************************************************** */
    goBackToEpisodePageFromUpdateEpisode();
  });

  return editEpisodeButton;
}
