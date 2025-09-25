// Personal favorites save logic
let saveFavoriteBtn = document.getElementById('saveFavoriteBtn');
let saveFavoriteModal = document.getElementById('saveFavoriteModal');
let closeSaveFavoriteModal = document.getElementById('closeSaveFavoriteModal');
let saveFavoriteConfirmBtn = document.getElementById('saveFavoriteConfirmBtn');
let favoriteTitle = document.getElementById('favoriteTitle');
let favoriteDesc = document.getElementById('favoriteDesc');
let favoritePrompt = document.getElementById('favoritePrompt');
let favoritesDataInput = document.getElementById('dataInput');
let favoritesCodeInput = document.getElementById('codeInput');
let favoritesPromptInput = document.getElementById('promptInput');

saveFavoriteBtn.addEventListener('click', () => {
  favoriteTitle.value = '';
  favoriteDesc.value = '';
  favoritePrompt.value = favoritesPromptInput.value || '';
  saveFavoriteModal.style.display = 'block';
});

closeSaveFavoriteModal.addEventListener('click', () => {
  saveFavoriteModal.style.display = 'none';
});

saveFavoriteConfirmBtn.addEventListener('click', () => {
  const favorite = {
    title: favoriteTitle.value.trim() || 'Untitled',
    description: favoriteDesc.value.trim(),
    prompt: favoritePrompt.value.trim(),
    data: favoritesDataInput.value,
    code: favoritesCodeInput.value,
    output: document.getElementById('result').textContent
  };
  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem('personalFavorites') || '[]');
  } catch {}
  favorites.push(favorite);
  localStorage.setItem('personalFavorites', JSON.stringify(favorites));
  saveFavoriteModal.style.display = 'none';
  alert('Saved to personal library!');
});

// Close modal when clicking outside modal content
saveFavoriteModal.addEventListener('mousedown', function(e) {
  if (e.target === saveFavoriteModal) {
    saveFavoriteModal.style.display = 'none';
  }
});
