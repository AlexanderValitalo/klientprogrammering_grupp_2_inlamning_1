let characters; // Holds all current characters localy

// If there is no characters stored locally we GET the characters
// from the API (https://da-demo.github.io/api/futurama/characters) and save them in local storage.$
// After that we build the table and populate it with the characters
(async () => {
  if (localStorage.getItem("characters") === null) {
    localStorage.setItem(
      "characters",
      JSON.stringify(await API.getCharacters())
    );
  }

  characters = await JSON.parse(localStorage.getItem("characters"));
  characters.forEach(addCharacterToTable);
})();

//Create a new character table row
function addCharacterToTable(character) {
  const characterRow = document.createElement("tr");

  const displayName = fullName(character);

  characterRow.innerHTML = `
                        <td>${displayName}</td>
                        <td>${character.homePlanet}</td>
                        <td>${character.occupation}</td>
                        <td><button id="characterButton${character.id}">More info</button></td>
                        `;

  DOM_ELEMENT.characterContainer.appendChild(characterRow);

  const tempButton = document.getElementById(`characterButton${character.id}`);

  tempButton.addEventListener("click", () => {
    displayCharacter(character);
  });
}

//Builds character display name
function fullName(character) {
  return `${character.name.first} ${character.name.middle} ${character.name.last}`;
}

// Displays character page
function displayCharacter(character) {
  hideFirstPage();

  const displayName = fullName(character);

  DOM_ELEMENT.characterPage.innerHTML = `
  <h2>${displayName}</h2>
  <img src="${
    character.images.main
  }" alt="A picture of ${displayName}" style="${
    character.images.main === undefined ? "display: none;" : "display: block;"
  }">
  <p>Home planet: ${character.homePlanet}</p>
  <p>Occupation: ${
    character.occupation === "" ? "Unknown" : character.occupation
  }</p>
  `;

  getRandomSayings(character);

  characterCRUDButtons(character);
}

// Hide first page
function hideFirstPage() {
  DOM_ELEMENT.firstPage.style.display = "none";
}

// If character sayings is 0 then return,
//else if character sayings is 5 or lower return all sayings,
//else if character sayings is greater than 5 randomize the sayings order and display the first 5 sayings
function getRandomSayings(character) {
  const numberOfSayings = character.sayings.length;

  let characterSayings;

  if (numberOfSayings === 0) {
    return;
  } else if (numberOfSayings <= 5) {
    let sayingText;
    numberOfSayings === 1
      ? (sayingText = "Saying:")
      : (sayingText = "Sayings:");
    characterSayings = `
                        <p>${sayingText}</p>
                        <ul>`;
    character.sayings.forEach(
      (saying) => (characterSayings += `<li>${saying}</li>`)
    );
  } else if (numberOfSayings > 5) {
    let randomizedSayings = randomizeArray(character.sayings);

    characterSayings = `
                       <p>Sayings:</p>
                       <ul>`;
    for (let i = 0; i < 5; i++) {
      characterSayings += `<li>${randomizedSayings[i]}</li>`;
    }
  }
  characterSayings += `</ul>`;
  DOM_ELEMENT.characterPage.innerHTML += characterSayings;
}

// Randomize elements in the array (in this case the sayings of a character)
function randomizeArray(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

//
function characterCRUDButtons(character) {
  const buttonDiv = document.createElement("div");
  DOM_ELEMENT.characterPage.appendChild(buttonDiv);

  const editCharacterButton = document.createElement("button");
  editCharacterButton.textContent = "Edit Character";
  editCharacterButton.classList.add("edit-button");
  editCharacterButton.addEventListener("click", () => {
    DOM_ELEMENT.characterPage.style.display = "none";
    DOM_ELEMENT.updateCharacterPage.style.display = "block";
    DOM_ELEMENT.updateFirstName.value = character.name.first;
    DOM_ELEMENT.updateMiddleName.value = character.name.middle;
    DOM_ELEMENT.updateLastName.value = character.name.last;
    DOM_ELEMENT.updateHomePlanet.value = character.homePlanet;
  });

  buttonDiv.appendChild(editCharacterButton);

  DOM_ELEMENT.updateCharacterForm.addEventListener("submit", () => {
    character.name.first = DOM_ELEMENT.updateFirstName.value;
    character.name.middle = DOM_ELEMENT.updateMiddleName.value;
    character.name.last = DOM_ELEMENT.updateLastName.value;
    character.homePlanet = DOM_ELEMENT.updateHomePlanet.value;

    localStorage.setItem("characters", JSON.stringify(characters));
  });

  DOM_ELEMENT.updateCharacterBackButton.addEventListener("click", () => {
    DOM_ELEMENT.updateCharacterPage.style.display = "none";
    DOM_ELEMENT.characterPage.style.display = "block";
  });

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Character";
  deleteButton.classList.add("delete-button");
  deleteButton.addEventListener("click", () => {
    DOM_ELEMENT.deleteCharacterPage.style.display = "block";
    buttonDiv.style.display = "none";
  });

  buttonDiv.appendChild(deleteButton);

  DOM_ELEMENT.deleteCharacterButton.addEventListener("click", () => {
    let indexToDelete = characters.findIndex((c) => c.id === character.id);
    characters.splice(indexToDelete, 1);

    localStorage.setItem("characters", JSON.stringify(characters));
    location.reload();
  });

  DOM_ELEMENT.deleteCharacterBackButton.addEventListener("click", () => {
    DOM_ELEMENT.deleteCharacterPage.style.display = "none";
    buttonDiv.style.display = "block";
  });

  const backButton = document.createElement("button");
  backButton.textContent = "Back to main page";
  backButton.classList.add("back-button");
  backButton.addEventListener("click", () => {
    showFirstPage();
  });

  buttonDiv.appendChild(backButton);
}

function createEditCharacterButton() {
  //**************************************************************************************** */
}

function showFirstPage() {
  DOM_ELEMENT.firstPage.style.display = "block";
  DOM_ELEMENT.createCharacterPage.style.display = "none";
  DOM_ELEMENT.characterPage.innerHTML = "";
}

//******************************************************Global character event listeners*************************************************************************/
DOM_ELEMENT.createCharacterButton.addEventListener("click", () => {
  hideFirstPage();
  DOM_ELEMENT.createCharacterPage.style.display = "block";
});

DOM_ELEMENT.characterCreateForm.addEventListener("submit", async () => {
  const newFirstName = DOM_ELEMENT.characterFirstName.value; //lägg till eventuell säkerhet här senare
  const newMiddleName = DOM_ELEMENT.characterMiddleName.value;
  const newLastName = DOM_ELEMENT.characterLastName.value;
  const newHomePlanet = DOM_ELEMENT.characterHomePlanet.value; //lägg till eventuell säkerhet här senare

  const newCharacter = {
    age: "",
    gender: "",
    homePlanet: newHomePlanet,
    id: characters[characters.length - 1].id + 1,
    images: {},
    name: { first: newFirstName, middle: newMiddleName, last: newLastName },
    occupation: "",
    sayings: [],
    species: "",
  };
  characters.push(newCharacter);
  localStorage.setItem("characters", JSON.stringify(characters));
});

DOM_ELEMENT.characterCreateBackButton.addEventListener("click", () => {
  showFirstPage();
});
//******************************************************/Global character event listeners************************************************************************/
