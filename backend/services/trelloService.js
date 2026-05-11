const BASE_URL = 'https://api.trello.com/1';
const API_KEY = process.env.TRELLO_API_KEY;
const TOKEN = process.env.TRELLO_TOKEN;

if (!API_KEY || !TOKEN) {
  console.warn('⚠️  Falta TRELLO_API_KEY o TRELLO_TOKEN en el backend/.env');
}

const authParams = () => `key=${encodeURIComponent(API_KEY)}&token=${encodeURIComponent(TOKEN)}`;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}${path.includes('?') ? '&' : '?'}${authParams()}`;
  const response = await fetch(url, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Trello API error ${response.status}: ${text}`);
  }

  return response.json();
}

async function getBoards() {
  return request('/members/me/boards');
}

async function getCards(idList) {
  return request(`/lists/${encodeURIComponent(idList)}/cards`);
}

async function createCard({ name, desc = '', idList, due }) {
  const params = new URLSearchParams({
    name,
    desc,
    idList,
    due: due || '',
  });

  return request(`/cards?${params.toString()}`);
}

module.exports = {
  getBoards,
  getCards,
  createCard,
};
