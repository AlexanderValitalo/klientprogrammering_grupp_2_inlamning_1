let characters; // Holds all current characters locally

// If there is no characters stored locally we GET the characters
// from the API (https://da-demo.github.io/api/futurama/characters) and save them in local storage.$
// After that we build the table and populate it with the characters
(async () => {
  if (localStorage.getItem("characters") === null) {
    localStorage.setItem("characters", JSON.stringify(await API.getCharacters()));
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
  DOM_ELEMENT.characterPage.style.display = "flex";

  const displayName = fullName(character);

  DOM_ELEMENT.characterPage.innerHTML = `
  <h2>${displayName}</h2>
  <img src="${character.images.main}" alt="A picture of ${displayName}" style="${
    character.images.main === undefined ? "display: none;" : "display: flex;"
  }">
  <p>Home planet: ${character.homePlanet}</p>
  <p>Occupation: ${character.occupation === "" ? "Unknown" : character.occupation}</p>
  `;

  getRandomSayings(character);

  characterCRUDButtons(character);
}

// Hide first page
function hideFirstPage() {
  DOM_ELEMENT.firstPage.style.display = "none";
  DOM_ELEMENT.toggleButtonDiv.style.display = "none";
}

//Randomize and display 5 character sayings (or all sayings, if there are fewer than 5)
function getRandomSayings(character) {
  const numberOfSayingsOnCharacter = character.sayings.length;

  let characterSayings;
  const sayingsToDisplay = 5;

  // If character sayings is 0 then return,
  //else if character sayings is 5 or lower display all sayings,
  //else if character sayings is greater than 5 randomize the sayings order and display the first 5 sayings
  if (numberOfSayingsOnCharacter === 0) {
    return;
  } else if (numberOfSayingsOnCharacter <= sayingsToDisplay) {
    let sayingText;
    numberOfSayingsOnCharacter === 1 ? (sayingText = "Saying:") : (sayingText = "Sayings:");
    characterSayings = `
                        <p>${sayingText}</p>
                        <ul>`;
    character.sayings.forEach((saying) => (characterSayings += `<li>${saying}</li>`));
  } else if (numberOfSayingsOnCharacter > sayingsToDisplay) {
    let randomizedSayings = randomizeArray(character.sayings);

    characterSayings = `
                       <p>Sayings:</p>
                       <ul>`;
    for (let i = 0; i < sayingsToDisplay; i++) {
      characterSayings += `<li>${randomizedSayings[i]}</li>`;
    }
  }
  characterSayings += `</ul>`;
  DOM_ELEMENT.characterPage.innerHTML += characterSayings;
}

// Randomize elements in the array (in this case the sayings of a character)
function randomizeArray(array) {
  let currentIndex = array.length;

  // start from the last element to the first element
  // the randomized index element swaps place with the current index element
  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

//Create buttons and CRUD functions on character
function characterCRUDButtons(character) {
  const buttonDiv = document.createElement("div");
  DOM_ELEMENT.characterPage.appendChild(buttonDiv);

  const editCharacterButton = createEditCharacterButton(character);
  buttonDiv.appendChild(editCharacterButton);

  const characterDeleteButton = createCharacterDeleteButton(character, buttonDiv);
  buttonDiv.appendChild(characterDeleteButton);

  const backButton = goBackToMainPageFromCharacterPage();
  buttonDiv.appendChild(backButton);
}

//******************************************************Character Button functions*************************************************************************/
//Creates the "Edit character" button that displays the update form
function createEditCharacterButton(character) {
  const editCharacterButton = document.createElement("button");
  editCharacterButton.textContent = "Edit Character";
  editCharacterButton.classList.add("edit-button");
  editCharacterButton.addEventListener("click", () => {
    DOM_ELEMENT.characterPage.style.display = "none";
    DOM_ELEMENT.updateCharacterPage.style.display = "flex";
    DOM_ELEMENT.updateFirstName.value = character.name.first;
    DOM_ELEMENT.updateMiddleName.value = character.name.middle;
    DOM_ELEMENT.updateLastName.value = character.name.last;
    DOM_ELEMENT.updateHomePlanet.value = character.homePlanet;
    updateCharacter(character);
    goBackToCharacterPageFromUpdateCharacter();
  });

  return editCharacterButton;
}

// Updates character when "Edit character" form is submitted
function updateCharacter(character) {
  DOM_ELEMENT.updateCharacterForm.addEventListener("submit", () => {
    character.name.first = DOM_ELEMENT.updateFirstName.value;
    character.name.middle = DOM_ELEMENT.updateMiddleName.value;
    character.name.last = DOM_ELEMENT.updateLastName.value;
    character.homePlanet = DOM_ELEMENT.updateHomePlanet.value;

    localStorage.setItem("characters", JSON.stringify(characters));
  });
}

// Go back from update character to character page
function goBackToCharacterPageFromUpdateCharacter() {
  DOM_ELEMENT.updateCharacterBackButton.addEventListener("click", () => {
    DOM_ELEMENT.updateCharacterPage.style.display = "none";
    DOM_ELEMENT.characterPage.style.display = "flex";
  });
}

// Create character delete button that opens delete page
function createCharacterDeleteButton(character, buttonDiv) {
  const deleteCharacterButton = document.createElement("button");
  deleteCharacterButton.textContent = "Delete Character";
  deleteCharacterButton.classList.add("delete-button");
  deleteCharacterButton.addEventListener("click", () => {
    DOM_ELEMENT.deleteCharacterPage.style.display = "flex";
    buttonDiv.style.display = "none";
    deleteCharacter(character);
    goBackToCharacterPageFromDeleteCharacter(buttonDiv);
  });

  return deleteCharacterButton;
}

//Deletes character when "Delete" button is clicked
function deleteCharacter(character) {
  DOM_ELEMENT.deleteCharacterButton.addEventListener("click", () => {
    let indexToDelete = characters.findIndex((c) => c.id === character.id);
    characters.splice(indexToDelete, 1);

    localStorage.setItem("characters", JSON.stringify(characters));
    location.reload();
  });
}

//"Back to character" button on delete popup: returns to character page
function goBackToCharacterPageFromDeleteCharacter(buttonDiv) {
  DOM_ELEMENT.deleteCharacterBackButton.addEventListener("click", () => {
    DOM_ELEMENT.deleteCharacterPage.style.display = "none";
    buttonDiv.style.display = "block";
  });
}

//"Back to main page" button on character page: returns user to first page when clicked
function goBackToMainPageFromCharacterPage() {
  const backButton = document.createElement("button");
  backButton.textContent = "Back to main page";
  backButton.classList.add("back-button");
  backButton.addEventListener("click", () => {
    showFirstPage();
  });

  return backButton;
}
//******************************************************/Character Button functions*************************************************************************/

//Display main page
function showFirstPage() {
  DOM_ELEMENT.firstPage.style.display = "flex";
  DOM_ELEMENT.createCharacterPage.style.display = "none";
  DOM_ELEMENT.characterPage.innerHTML = "";
  DOM_ELEMENT.characterPage.style.display = "none";
  DOM_ELEMENT.toggleButtonDiv.style.display = "flex";
}

//******************************************************Create new character********************************************************************/
//"Create character" button: displays form
DOM_ELEMENT.createCharacterButton.addEventListener("click", () => {
  hideFirstPage();
  DOM_ELEMENT.createCharacterPage.style.display = "flex";
  createCharacter();
  goBackToMainPageFromCreateCharacter();
});

//"Create character" form: creates a new character
function createCharacter() {
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
}

//"Back to main page" button on "Create new character" page: displays first page
function goBackToMainPageFromCreateCharacter() {
  DOM_ELEMENT.characterCreateBackButton.addEventListener("click", () => {
    showFirstPage();
  });
}
//******************************************************/Create new character*******************************************************************/
