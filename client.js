const BASE_URL = "https://da-demo.github.io/api/futurama/";

const API_URLS = {
  characters: `${BASE_URL}characters`,
  episodes: `${BASE_URL}episodes`,
};

// Base function for all Json API calls
async function getJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Could not get ${url}.\nStatus: ${response.status}`);
  }

  return await response.json();
}

// API calls
const API = {
  async getCharacters() {
    return await getJson(API_URLS.characters);
  },

  async getEpisodes() {
    return await getJson(API_URLS.episodes);
  },
};
