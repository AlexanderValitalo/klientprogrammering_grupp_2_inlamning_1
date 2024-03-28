let episodes; // Holds all current episodes locally

// If there is no episodes stored locally we GET the episodes
// from the API (https://da-demo.github.io/api/futurama/episodes) and save them in local storage.$
// After that we build the table and populate it with the episodes
(async () => {
  if (localStorage.getItem("episodes") === null) {
    localStorage.setItem("episodes", JSON.stringify(await API.getEpisodes()));

    episodes = await JSON.parse(localStorage.getItem("episodes"));

    // Because the API numbers and order of episodes are weird, we need to calc over all episode number, sort the episodes and calc season number
    calcOverAllNumber();
    sortEpisodes();
    calcSeasonNumber();
    calcEpisodeNumber();
  } else {
    episodes = await JSON.parse(localStorage.getItem("episodes"));
  }

  episodes.forEach(addEpisodeToTable);
})();

//Split out the overall episode number from episode.number and assign it its own property
function calcOverAllNumber() {
  for (const episode of episodes) {
    episode.overAllEpisodeNumber = Number(episode.number.split(" - ")[0]);
  }
}

//Sort episodes by overall episode number
function sortEpisodes() {
  let currentIndex = episodes.length;

  while (currentIndex != 1) {
    currentIndex--;

    if (
      episodes[currentIndex].overAllEpisodeNumber <
      episodes[currentIndex - 1].overAllEpisodeNumber
    ) {
      [episodes[currentIndex], episodes[currentIndex - 1]] = [
        episodes[currentIndex - 1],
        episodes[currentIndex],
      ];
    }
  }
}

//Calculate season number on each episode and assign it its own property
function calcSeasonNumber() {
  let season = 0;
  for (const episode of episodes) {
    const lastNumber = Number(episode.number.split(" - ")[1]);

    if (lastNumber === 1 || lastNumber === 76) {
      season++;
    }
    episode.season = season;
  }
}

//Split out the episode number from the "number" property on the episodes
//and assign it to the seasonEpisode property
function calcEpisodeNumber() {
  for (const episode of episodes) {
    episode.seasonEpisode = Number(episode.number.split(" - ")[1]);
  }
}

//Create a new episode table row
function addEpisodeToTable(episode) {
  const episodeRow = document.createElement("tr");

  episodeRow.innerHTML = `
                        <td>${episode.title}</td>
                        <td>${episode.season}</td>
                        <td>${episode.seasonEpisode}</td>
                        <td><button id="episodeButton${episode.id}" class="episode-info-btn">More info</button></td>
                        `;

  DOM_ELEMENT.episodeContainer.appendChild(episodeRow);

  const infoButton = document.getElementById(`episodeButton${episode.id}`);

  infoButton.addEventListener("click", () => {
    displayEpisode(episode);
  });
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
  DOM_ELEMENT.toggleButtonDiv.style.display = "none";
}

//Create buttons and CRUD functions on episode
function episodeCRUDButtons(episode) {
  const buttonDiv = document.createElement("div");
  DOM_ELEMENT.episodePage.appendChild(buttonDiv);

  const editEpisodeButton = createEditEpisodeButton(episode);
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
    updateEpisode(episode);
    goBackToEpisodePageFromUpdateEpisode();
  });

  return editEpisodeButton;
}

// Updates episode when "Edit episode" form is submitted
function updateEpisode(episode) {
  DOM_ELEMENT.updateEpisodeForm.addEventListener("submit", () => {
    episode.title = DOM_ELEMENT.updateTitle.value;
    episode.season = DOM_ELEMENT.updateSeason.value;
    episode.seasonEpisode = DOM_ELEMENT.updateEpisodeNumber.value;

    localStorage.setItem("episodes", JSON.stringify(episodes));
  });
}

// Go back from update episode to episode page
function goBackToEpisodePageFromUpdateEpisode() {
  DOM_ELEMENT.updateEpisodeBackButton.addEventListener("click", () => {
    DOM_ELEMENT.updateEpisodePage.style.display = "none";
    DOM_ELEMENT.episodePage.style.display = "flex";
  });
}

// Create episode delete button that opens delete page
function createEpisodeDeleteButton(episode, buttonDiv) {
  const deleteEpisodeButton = document.createElement("button");
  deleteEpisodeButton.textContent = "Delete episode";
  deleteEpisodeButton.classList.add("delete-button");
  deleteEpisodeButton.addEventListener("click", () => {
    DOM_ELEMENT.deleteEpisodePage.style.display = "flex";
    buttonDiv.style.display = "none";
    deleteEpisode(episode);
    goBackToEpisodePageFromDeleteEpisode(buttonDiv);
  });

  return deleteEpisodeButton;
}

//Deletes episode when "Delete" button is clicked
function deleteEpisode(episode) {
  DOM_ELEMENT.deleteEpisodeButton.addEventListener("click", () => {
    let indexToDelete = episodes.findIndex((e) => e.id === episode.id);
    episodes.splice(indexToDelete, 1);

    localStorage.setItem("episodes", JSON.stringify(episodes));
    location.reload();
  });
}

//"Back to episode" button on delete popup: returns to episode page
function goBackToEpisodePageFromDeleteEpisode(buttonDiv) {
  DOM_ELEMENT.deleteEpisodeBackButton.addEventListener("click", () => {
    DOM_ELEMENT.deleteEpisodePage.style.display = "none";
    buttonDiv.style.display = "block";
  });
}

//"Back to main page" button on episode page: returns user to first page when clicked
function goBackToMainPageFromEpisodePage() {
  const backButton = document.createElement("button");
  backButton.textContent = "Back to main page";
  backButton.classList.add("back-button");
  backButton.addEventListener("click", () => {
    showSecondPage();
  });

  return backButton;
}

//Display main page
function showSecondPage() {
  DOM_ELEMENT.secondPage.style.display = "flex";
  DOM_ELEMENT.createEpisodePage.style.display = "none";
  DOM_ELEMENT.episodePage.innerHTML = "";
  DOM_ELEMENT.episodePage.style.display = "none";
  DOM_ELEMENT.toggleButtonDiv.style.display = "flex";
}

//******************************************************Create new episode********************************************************************/

//"Create episode" button: displays form
DOM_ELEMENT.createEpisodeButton.addEventListener("click", () => {
  hideSecondPage();
  DOM_ELEMENT.createEpisodePage.style.display = "flex";
  createEpisode();
  goBackToMainPageFromCreateEpisode();
});

//"Create episode" form: creates a new episode
function createEpisode() {
  DOM_ELEMENT.episodeCreateForm.addEventListener("submit", async () => {
    const newTitle = DOM_ELEMENT.episodeTitle.value; //lägg till eventuell säkerhet här senare
    const newSeason = DOM_ELEMENT.episodeSeason.value;
    const newEpisodeNumber = DOM_ELEMENT.episodeNumber.value;
    const newOverAllEpisodeNumber =
      episodes[episodes.length - 1].overAllEpisodeNumber + 1;

    const newEpisode = {
      desc: "",
      id: episodes[episodes.length - 1].id + 1,
      number: `${newOverAllEpisodeNumber} - ${newEpisodeNumber}`,
      originalAirDate: "",
      overAllEpisodeNumber: newOverAllEpisodeNumber,
      season: newSeason,
      seasonEpisode: newEpisodeNumber,
      title: newTitle,
      writers: "",
    };
    episodes.push(newEpisode);
    localStorage.setItem("episodes", JSON.stringify(episodes));
  });
}

//"Back to main page" button on "Create new episode" page: displays first page
function goBackToMainPageFromCreateEpisode() {
  DOM_ELEMENT.episodeCreateBackButton.addEventListener("click", () => {
    showSecondPage();
  });
}
