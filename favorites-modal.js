// Personal favorites modal logic
let openFavoritesBtn = document.getElementById('openFavoritesBtn');
let favoritesModal = document.getElementById('favoritesModal');
let closeFavoritesModal = document.getElementById('closeFavoritesModal');
let favoritesList = document.getElementById('favoritesList');
let favoriteDetails = document.getElementById('favoriteDetails');
let copyFavoriteBtn = document.getElementById('copyFavoriteBtn');
let favModalDataInput = document.getElementById('dataInput');
let favModalCodeInput = document.getElementById('codeInput');
let favModalPromptInput = document.getElementById('promptInput');
let favModalPromptTitle = document.getElementById('promptTitle');
let favModalPromptTitleBar = document.getElementById('promptTitleBar');

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('personalFavorites') || '[]');
  } catch {
    return [];
  }
}

openFavoritesBtn.addEventListener('click', () => {
  renderFavoritesList();
  favoritesModal.style.display = 'block';
});

closeFavoritesModal.addEventListener('click', () => {
  favoritesModal.style.display = 'none';
  favoriteDetails.innerHTML = '';
  copyFavoriteBtn.style.display = 'none';
});

// Close modal when clicking outside modal content
favoritesModal.addEventListener('mousedown', function(e) {
  if (e.target === favoritesModal) {
    favoritesModal.style.display = 'none';
    favoriteDetails.innerHTML = '';
    Array.from(favoritesList.children).forEach(child => child.classList.remove('active'));
  }
});

function renderFavoritesList() {
  favoritesList.innerHTML = '';
  const favorites = getFavorites();
  favorites.forEach((fav, idx) => {
    const row = document.createElement('div');
    row.className = 'sample-title-row';
    const item = document.createElement('div');
    item.textContent = fav.title;
    item.className = 'sample-title';
    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.className = 'copy-inline-btn';
    copyBtn.onclick = (e) => {
      e.stopPropagation();
      favModalDataInput.value = fav.data || '';
      favModalCodeInput.value = fav.code || '';
      favModalPromptInput.value = fav.prompt || '';
      favModalPromptTitle.textContent = fav.title || 'Prompt';
      favModalPromptTitleBar.dataset.desc = fav.description || '';
      favoritesModal.style.display = 'none';
    };
    row.appendChild(item);
    row.appendChild(copyBtn);
    let active = false;
    let removeBtn = null;
    item.addEventListener('mouseenter', () => {
      favoriteDetails.innerHTML = `<strong>Description:</strong> ${fav.description}`;
    });
    item.addEventListener('mouseleave', () => {
      if (!active) favoriteDetails.innerHTML = '';
    });
    item.addEventListener('click', () => {
      Array.from(favoritesList.children).forEach(child => {
        child.classList.remove('active');
        // Remove any existing remove button from other rows
        if (child.removeBtn) {
          child.removeChild(child.removeBtn);
          child.removeBtn = null;
        }
      });
      row.classList.add('active');
      active = true;
      let html = `<strong>Title:</strong> ${fav.title}<br><strong>Description:</strong> ${fav.description}`;
      if (fav.prompt) {
        html += `<br><strong>Prompt:</strong><br><pre>${fav.prompt}</pre>`;
      }
      favoriteDetails.innerHTML = html;
      copyFavoriteBtn.style.display = 'inline-block';
      copyFavoriteBtn.onclick = () => {
        favModalDataInput.value = fav.data || '';
        favModalCodeInput.value = fav.code || '';
        favModalPromptInput.value = fav.prompt || '';
        favModalPromptTitle.textContent = fav.title || 'Prompt';
        favModalPromptTitleBar.dataset.desc = fav.description || '';
        favoritesModal.style.display = 'none';
      };
      // Add Remove button only when selected
      removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.className = 'remove-inline-btn';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        // Remove from localStorage
        let updatedFavorites = getFavorites();
        updatedFavorites.splice(idx, 1);
        localStorage.setItem('personalFavorites', JSON.stringify(updatedFavorites));
        // Re-render list and clear details
        renderFavoritesList();
        favoriteDetails.innerHTML = '';
        copyFavoriteBtn.style.display = 'none';
      };
      row.appendChild(removeBtn);
      row.removeBtn = removeBtn;
    });
    favoritesList.appendChild(row);
  });
}
