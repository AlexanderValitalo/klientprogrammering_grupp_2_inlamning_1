let characters;

(async () => {
  if (localStorage.getItem("characters") === null) {
    localStorage.setItem("characters", JSON.stringify(await API.getCharacters()));
  }

  characters = await JSON.parse(localStorage.getItem("characters"));
  characters.forEach(addCharacterToTable);
  console.log(characters);
})();

const DOM_ELEMENT = {
  characterContainer: document.getElementById("characters-table"),
  characterPage: document.getElementById("character-page"),
  firstPage: document.getElementById("first-page"),
  
  createCharacterButton: document.getElementById("create-character-btn"),
  createCharacterPage: document.getElementById("create-character-page"),
  characterFirstName: document.getElementById("character-first-name"),
  characterMiddleName: document.getElementById("character-middle-name"),
  characterLastName: document.getElementById("character-last-name"),
  characterHomePlanet: document.getElementById("character-homePlanet"),
  characterCreateBackButton: document.getElementById("character-create-back-button"),
  characterCreateForm: document.getElementById("create-character-form"),
  
  updateCharacterPage: document.getElementById("update-character-page"),
  updateCharacterForm: document.getElementById("update-character-form"),
  updateFirstName: document.getElementById("update-first-name"),
  updateMiddleName: document.getElementById("update-middle-name"),
  updateLastName: document.getElementById("update-last-name"),
  updateHomePlanet: document.getElementById("update-homePlanet"),
  updateCharacterBackButton: document.getElementById("update-character-back-button"), 

  deleteCharacterPage: document.getElementById("delete-character-page"),
  deleteCharacterButton: document.getElementById("delete-character-button"),
  deleteCharacterBackButton: document.getElementById("delete-character-back-button"),
};

DOM_ELEMENT.createCharacterButton.addEventListener("click", () => {
  hideFirstPage();
  DOM_ELEMENT.createCharacterPage.style.display = "block";
});


DOM_ELEMENT.characterCreateForm.addEventListener("submit", async () => {
  const newFirstName = DOM_ELEMENT.characterFirstName.value; //lägg till eventuell säkerhet här senare
  const newMiddleName = DOM_ELEMENT.characterMiddleName.value;
  const newLastName = DOM_ELEMENT.characterLastName.value;
  const newHomePlanet = DOM_ELEMENT.characterHomePlanet.value; //lägg till eventuell säkerhet här senare
  
  const newCharacter = { //******************************************************************************************************** */
    age: "",
    gender: "",
    homePlanet: newHomePlanet,
    id: (characters[characters.length - 1].id + 1),
    images: {},
    name: {first: newFirstName, middle: newMiddleName, last: newLastName},
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



function addCharacterToTable(character) {
  const rowElement = document.createElement("tr");

  const displayName = fullName(character);

  rowElement.innerHTML = `
                        <td>${displayName}</td>
                        <td>${character.homePlanet}</td>
                        <td>${character.occupation}</td>
                        <td><button id="characterButton${character.id}">More info</button></td>
                        `;

  DOM_ELEMENT.characterContainer.appendChild(rowElement);

  const tempButton = document.getElementById(`characterButton${character.id}`);

  tempButton.addEventListener("click", () => {
    displayCharacter(character);
  });
}



function fullName(character) {
  return `${character.name.first} ${character.name.middle} ${character.name.last}`;
}



function displayCharacter(character) {
  hideFirstPage();

  const displayName = fullName(character);
  
  DOM_ELEMENT.characterPage.innerHTML = `
  <h2>${displayName}</h2>
  <img src="${character.images.main}" alt="A picture of ${displayName}" style="${character.images.main === undefined ? "display: none;" : "display: block;"}">
  <p>Home planet: ${character.homePlanet}</p>
  <p>Occupation: ${character.occupation === "" ? "Unknown" : character.occupation}</p>
  `;
  
  getRandomSayings(character);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit Character";
  editButton.classList.add("edit-button");
  editButton.addEventListener("click", () => {
    DOM_ELEMENT.characterPage.style.display = "none";
    DOM_ELEMENT.updateCharacterPage.style.display = "block";
    DOM_ELEMENT.updateFirstName.value = character.name.first;
    DOM_ELEMENT.updateMiddleName.value = character.name.middle;
    DOM_ELEMENT.updateLastName.value = character.name.last;
    DOM_ELEMENT.updateHomePlanet.value = character.homePlanet;
  });

  DOM_ELEMENT.characterPage.appendChild(editButton);

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
  });

  DOM_ELEMENT.characterPage.appendChild(deleteButton);

  DOM_ELEMENT.deleteCharacterButton.addEventListener("click", () => {
    let indexToDelete = characters.findIndex(c => c.id === character.id);
    characters.splice(indexToDelete, 1);
    
    localStorage.setItem("characters", JSON.stringify(characters));
    location.reload();
  });

  const backButton = document.createElement("button");
  backButton.textContent = "Back to main page";
  backButton.classList.add("back-button");
  backButton.addEventListener("click", () => {
    showFirstPage();
  });

  DOM_ELEMENT.characterPage.appendChild(backButton);
}



function hideFirstPage() {
  DOM_ELEMENT.firstPage.style.display = "none";
}



function getRandomSayings(character) {
  const numberOfSayings = character.sayings.length;

  let characterSayings;

  if (numberOfSayings === 0) {
    return;
  } else if (numberOfSayings <= 5) {
    let sayingText;
    numberOfSayings === 1 ? (sayingText = "Saying:") : (sayingText = "Sayings:");
    characterSayings = `
                        <p>${sayingText}</p>
                        <ul>`;
    character.sayings.forEach((saying) => (characterSayings += `<li>${saying}</li>`));
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



function randomizeArray(array) {
  let currentIndex = array.length;

  while (currentIndex != 0) {
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}



function showFirstPage(){
  DOM_ELEMENT.firstPage.style.display = "block";
  DOM_ELEMENT.createCharacterPage.style.display = "none";
  DOM_ELEMENT.characterPage.innerHTML = "";
}