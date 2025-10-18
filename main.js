// Reset all main fields
document.getElementById('resetBtn').addEventListener('click', function() {
  document.getElementById('dataInput').value = '';
  document.getElementById('promptInput').value = '';
  document.getElementById('codeInput').value = '';
  document.getElementById('result').textContent = '';
  document.getElementById('promptTitle').textContent = 'Prompt';
  document.getElementById('promptTitleBar').dataset.desc = '';
});
let resultText = "";

// Handle file upload
document.getElementById("fileInput").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("dataInput").value = reader.result;
  };
  reader.readAsText(file);
});

// Run user code
document.getElementById("runBtn").addEventListener("click", function() {
  const data = document.getElementById("dataInput").value;
  const code = document.getElementById("codeInput").value;
  try {
    // Create a function with 'data' in scope
    const fn = new Function("data", code);
    const output = fn(data);
    resultText = typeof output === "object" ? JSON.stringify(output, null, 2) : String(output);
    document.getElementById("result").textContent = resultText;
  } catch (err) {
    resultText = "Error: " + err.message;
    document.getElementById("result").textContent = resultText;
  }
});

// Copy to clipboard
document.getElementById("copyBtn").addEventListener("click", function() {
  navigator.clipboard.writeText(resultText).then(() => {
    alert("Result copied to clipboard!");
  });
});

// Download result
document.getElementById("downloadBtn").addEventListener("click", function() {
  const blob = new Blob([resultText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "result.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// --- Output modal behavior: show when #output changes ---
(function() {
  const outputEl = document.getElementById('output');
  const modal = document.getElementById('outputModal');
  const closeBtn = document.getElementById('closeOutputModal');
  if (!outputEl || !modal ||  !closeBtn) return;

  let showTimeout = null;
  const debounceMs = 100; // group rapid updates

  function showModalWithContent() {
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
  }

  function hideModal() {
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
  }

  // Close handlers
  closeBtn.addEventListener('click', hideModal);
  modal.addEventListener('click', function(e) {
    if (e.target === modal) hideModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') hideModal();
  });

  // Observe text changes and childList changes
  const obs = new MutationObserver(function(mutations) {
    if (showTimeout) clearTimeout(showTimeout);
    showTimeout = setTimeout(function() {
        showModalWithContent();
    }, debounceMs);
  });

  obs.observe(outputEl, { characterData: true, childList: true, subtree: true });

  // Provide a small helper to allow other scripts to programmatically show output
  window.showOutputInModal = function(text) {
    outputEl.textContent = text;
  };

})();
