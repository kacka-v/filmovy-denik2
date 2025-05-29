const binId = '6830cef38a456b7966a487db';
const apiKey = '$2a$10$LZN36onOi89Sk2f8utU/1eTCQzArXTncqIw8fujmsjflHNh./6.O.';
const url = `https://api.jsonbin.io/v3/b/${binId}/latest`;

fetch(url, {
  headers: {
    'X-Master-Key': apiKey
  }
})
  .then(response => response.json())
  .then(data => {
    const films = data.record;
    const filmList = document.getElementById('film-list');

    films.forEach(film => {
      const card = document.createElement('div');
      card.className = 'film-card';
      if (film.seen) card.classList.add('seen');

      const img = document.createElement('img');
      img.src = film.image;
      img.alt = film.title;

      const overlay = document.createElement('div');
      overlay.className = 'overlay';

      const link = document.createElement('a');
      link.href = film.csfd;
      link.target = '_blank';
      link.textContent = film.title;

      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = film.seen;

      checkbox.addEventListener('change', () => {
        film.seen = checkbox.checked;
        card.classList.toggle('seen', checkbox.checked);
        updateData(films);
      });

      label.appendChild(checkbox);
      label.appendChild(document.createTextNode('Viděno'));

      card.appendChild(img);
      card.appendChild(overlay);
      card.appendChild(link);
      card.appendChild(label);
      filmList.appendChild(card);
    });
  })
  .catch(error => console.error('Chyba při načítání dat:', error));

function updateData(films) {
  fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': apiKey,
      'X-Bin-Versioning': 'false'
    },
    body: JSON.stringify(films)
  })
    .then(response => response.json())
    .then(data => console.log('Data byla aktualizována:', data))
    .catch(error => console.error('Chyba při aktualizaci dat:', error));
}
