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

    films.forEach((film, index) => {
      const card = document.createElement('div');
      card.className = 'film-card';

      const img = document.createElement('img');
      img.src = film.image;
      img.alt = film.title;

      const overlay = document.createElement('div');
      overlay.className = 'overlay';
      overlay.textContent = '✓';

      const link = document.createElement('a');
      link.href = film.csfd;
      link.target = '_blank';
      link.textContent = film.title;

      const list = document.createElement('ul');
      list.className = 'seen-list';

      (film.seenBy || []).forEach(entry => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = entry.seen;
        checkbox.disabled = true;

        li.textContent = entry.name + ' ';
        li.prepend(checkbox);
        list.appendChild(li);
      });

      const nameInput = document.createElement('input');
      nameInput.placeholder = 'Tvé jméno';
      nameInput.className = 'name-input';

      const seenCheckbox = document.createElement('input');
      seenCheckbox.type = 'checkbox';

      const submitBtn = document.createElement('button');
      submitBtn.textContent = 'Přidat';

      submitBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (!name) return;

        const newEntry = { name: name, seen: seenCheckbox.checked };
        film.seenBy = film.seenBy || [];
        film.seenBy.push(newEntry);

        updateData(films);
      });

      card.appendChild(img);
      card.appendChild(overlay);
      card.appendChild(link);
      card.appendChild(list);
      card.appendChild(nameInput);
      card.appendChild(seenCheckbox);
      card.appendChild(submitBtn);
      filmList.appendChild(card);

      // Zobraz overlay pokud někdo viděl
      if ((film.seenBy || []).some(e => e.seen)) {
        card.classList.add('seen');
      }
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
    .then(data => location.reload()) // Obnoví stránku, aby se nový záznam zobrazil
    .catch(error => console.error('Chyba při aktualizaci dat:', error));
}
