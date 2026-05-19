

// Ensure these match your credentials perfectly
const personalAccessToken = 'patRvOkBLnLxeil0O.4a06592b47068b313e5152cf101878e19a08d39e3bfde16fb9da2a3ae9410efa';
const baseId = 'appJmA67ZIZ6IfIcS';
const tableName = 'Inventory'; 
const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

let allRecords = [];

async function fetchAirtableData() {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${personalAccessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    allRecords = data.records.sort((a, b) => {
      const modelA = String(a.fields['Name'] || '0');
      const modelB = String(b.fields['Name'] || '0');
      return modelA.localeCompare(modelB, undefined, {
        numeric: true,
        sensitivity: 'base'
      });
    });

    displayData(allRecords);

  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('hello-container').innerText =
      'Error details: ' + error.message;
  }
}

// ONLY search filter now
function applyFilters() {
  const searchTerm = document
    .getElementById('search-bar')
    .value
    .toLowerCase();

  const filteredRecords = allRecords.filter(record => {
    const aircraftModel = (record.fields['Name'] || '').toLowerCase();
    return aircraftModel.includes(searchTerm);
  });

  displayData(filteredRecords);
}

function displayData(records) {
  const container = document.getElementById('hello-container');
  container.innerHTML = '';
  
    document.querySelector("#hello-container").style.display = "grid";

  if (records.length === 0) {
    container.innerHTML = '<div class="grid-active" style="width:100%;padding:50px 0;">No matches found</div>';
    document.querySelector("#hello-container").style.removeProperty("display");
    document.querySelector("#hello-container").style.display = "block";
    return;
  }

  records.forEach(record => {

    // ✅ ADDED: hide Qty = 0
    if (Number(record.fields['Qty'] || 0) === 0) return;

    const aircraft = record.fields['Name'] || '';
    const type = record.fields['Type'] || '';
    const description = record.fields['Description'] || '';
    const rawQty = record.fields['Qty'] || '0';
    const formattedQty = Number(rawQty).toLocaleString();

    const aircraftCol = document.createElement('div');
    aircraftCol.classList.add('grid-column');
    aircraftCol.textContent = aircraft;

    const typeCol = document.createElement('div');
    typeCol.classList.add('grid-column');
    typeCol.textContent = type;

    const descriptionCol = document.createElement('div');
    descriptionCol.classList.add('grid-column');
    descriptionCol.textContent = description;

    const qtyCol = document.createElement('div');
    qtyCol.classList.add('grid-column');
    qtyCol.textContent = formattedQty;

    container.appendChild(aircraftCol);
    container.appendChild(typeCol);
    container.appendChild(descriptionCol);
    container.appendChild(qtyCol);
  });
}

function createHeaders(targetHeaders) {
  const headerContainer = document.getElementById('header-container');
  headerContainer.innerHTML = '';

  targetHeaders.forEach(headerText => {
    const headerDiv = document.createElement('div');
    headerDiv.innerText = headerText;
    headerDiv.style.flex = "1";
    headerContainer.appendChild(headerDiv);
  });
}

document
  .getElementById('search-bar')
  .addEventListener('input', applyFilters);

// Initial load
fetchAirtableData();


function applyGrid() {
  const items = document.querySelectorAll('#hello-container .grid-column');

  items.forEach((el, i) => {
    const active = (Math.floor(i / 4) % 2 === 0);
    el.classList.toggle('grid-active', active);
  });
}

const container = document.querySelector('#hello-container');

if (container) {
  new MutationObserver(applyGrid).observe(container, {
    childList: true,
    subtree: true
  });
}

applyGrid();