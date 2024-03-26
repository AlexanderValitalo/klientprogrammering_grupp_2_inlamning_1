let characters;

(async () => {
  if (localStorage.getItem("characters") === null) {
    localStorage.setItem("characters", JSON.stringify(await API.getCharacters()));
  }

  characters = await JSON.parse(localStorage.getItem("characters"));
  //let characters = localStorage.getItem("characters");
  //console.log(characters);
  characters.forEach(addCharacterToTable);

  // const charactersFetch = await API.getCharacters();
  // charactersFetch.forEach(addCharacterToTable);
  // characters = charactersFetch;
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
