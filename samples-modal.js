

// Modal logic for sample catalog
let samples = [];
// DOM elements
const samplesModal = document.getElementById('samplesModal');
const openSamplesBtn = document.getElementById('openSamplesBtn');
const closeSamplesModal = document.getElementById('closeSamplesModal');
const samplesList = document.getElementById('samplesList');
const sampleDetails = document.getElementById('sampleDetails');
const copySampleBtn = document.getElementById('copySampleBtn');
const dataInput = document.getElementById('dataInput');
const codeInput = document.getElementById('codeInput');
const promptFieldContainer = document.getElementById('promptFieldContainer');
const promptTitleBar = document.getElementById('promptTitleBar');
const promptTitle = document.getElementById('promptTitle');
const promptDescTooltip = document.getElementById('promptDescTooltip');
const promptToggle = document.getElementById('promptToggle');
const promptFieldContent = document.getElementById('promptFieldContent');
let promptInput = document.getElementById('promptInput');

// Close modal when clicking outside modal content
samplesModal.addEventListener('mousedown', function(e) {
  if (e.target === samplesModal) {
    samplesModal.style.display = 'none';
    sampleDetails.innerHTML = '';
    Array.from(samplesList.children).forEach(child => child.classList.remove('active'));
  }
});

// Fetch samples.json on startup
fetch('samples.json')
  .then(res => res.json())
  .then(data => {
    samples = data;
  });


// Collapsible logic
let promptCollapsed = false;
promptTitleBar.addEventListener('click', () => {
  promptCollapsed = !promptCollapsed;
  promptFieldContent.style.display = promptCollapsed ? 'none' : 'block';
  promptToggle.innerHTML = promptCollapsed ? '&#9654;' : '&#9660;';
});
promptFieldContent.style.display = 'block';
promptToggle.innerHTML = '&#9660;';

// Show description tooltip on hover
promptTitleBar.addEventListener('mouseenter', () => {
  if (promptTitleBar.dataset.desc) {
    promptDescTooltip.textContent = promptTitleBar.dataset.desc;
    promptDescTooltip.style.display = 'inline-block';
  }
});
promptTitleBar.addEventListener('mouseleave', () => {
  promptDescTooltip.style.display = 'none';
});

openSamplesBtn.addEventListener('click', () => {
  renderSamplesList();
  samplesModal.style.display = 'block';
});

closeSamplesModal.addEventListener('click', () => {
  samplesModal.style.display = 'none';
  sampleDetails.innerHTML = '';
  copySampleBtn.style.display = 'none';
});


function renderSamplesList() {
  samplesList.innerHTML = '';
  samples.forEach((sample, idx) => {
    const row = document.createElement('div');
    row.className = 'sample-title-row';

    const item = document.createElement('div');
    item.textContent = sample.title;
    item.className = 'sample-title';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.className = 'copy-inline-btn';
    copyBtn.onclick = (e) => {
      e.stopPropagation();
      dataInput.value = sample.data || '';
      // Set code field preserving literal \n, not converting to newlines
      codeInput.value = typeof sample.code === 'string' ? sample.code.replace(/\\n/g, '\\n') : '';
      promptInput.value = sample.prompt || '';
      promptTitle.textContent = sample.title || 'Prompt';
      promptTitleBar.dataset.desc = sample.description || '';
      samplesModal.style.display = 'none';
    };

    row.appendChild(item);
    row.appendChild(copyBtn);

    let active = false;

    item.addEventListener('mouseenter', () => {
      sampleDetails.innerHTML = `<strong>Description:</strong> ${sample.description}`;
    });
    item.addEventListener('mouseleave', () => {
      if (!active) sampleDetails.innerHTML = '';
    });
    item.addEventListener('click', () => {
      // Remove active from all rows
      Array.from(samplesList.children).forEach(child => child.classList.remove('active'));
      row.classList.add('active');
      active = true;
      let html = `<strong>Title:</strong> ${sample.title}<br><strong>Description:</strong> ${sample.description}`;
      if (sample.prompt) {
        html += `<br><strong>Prompt:</strong><br><pre>${sample.prompt}</pre>`;
      }
      sampleDetails.innerHTML = html;
    });
    samplesList.appendChild(row);
  });
}
