let characters;

(async () => {
  const charactersFetch = await API.getCharacters();
  charactersFetch.forEach(addCharacterToTable);
  characters = charactersFetch;
})();

const DOM_ELEMENT = {
  characterContainer: document.getElementById("characters-table"),
  characterPage: document.getElementById("character-page"),
};

function addCharacterToTable(character) {
  const rowElement = document.createElement("tr");

  //const fullName = `${character.name.first} ${character.name.middle} ${character.name.last}`;
  character.name = `${character.name.first} ${character.name.middle} ${character.name.last}`;

  rowElement.innerHTML = `
                        <td>${character.name}</td>
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

function displayCharacter(character) {
  hideFirstPage();

  DOM_ELEMENT.characterPage.innerHTML = `
                            <h2>${character.name}</h2>
                            <img src="${character.images.main}" alt="A picture of ${character.name}">
                            <p>Home planet: ${character.homePlanet}</p>
                            <p>Occupation: ${character.occupation}</p>
                            `;

  getRandomSayings(character);
}

function hideFirstPage() {
  const firstPage = document.getElementById("first-page");
  firstPage.style.display = "none";
}

function getRandomSayings(character) {
  const numberOfSayings = character.sayings.length;

  if (numberOfSayings <= 5) {
    let characterSayings = ""; //`<ul>`;
    character.sayings.forEach((saying) => (characterSayings += `<p>${saying}</p>`));
    //characterSayings += `</ul>`;
    DOM_ELEMENT.characterPage.innerHTML += characterSayings;
  }
}
