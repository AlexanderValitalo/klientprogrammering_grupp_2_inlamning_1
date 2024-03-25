let characters;

(async () => {
  const charactersFetch = await API.getCharacters();
  charactersFetch.forEach(addCharacterToTable);
  characters = charactersFetch;
})();

const characterContainer = document.getElementById("characters-table");

function addCharacterToTable(character) {
  const rowElement = document.createElement("tr");

  const fullName = `${character.name.first} ${character.name.middle} ${character.name.last}`;

  rowElement.innerHTML = `
                        <td>${fullName}</td>
                        <td>${character.homePlanet}</td>
                        <td>${character.occupation}</td>
                        <td><button>More info</button></td>
                        `;

  characterContainer.appendChild(rowElement);
}
