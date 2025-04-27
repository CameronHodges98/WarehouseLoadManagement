// loadDetails.js (updated)

const params = new URLSearchParams(window.location.search);
const loadID = params.get("loadID");
const loadDetailsDiv = document.getElementById("loadDetails");

let loads = JSON.parse(localStorage.getItem("loads")) || {};

let pallets = []; // to hold all pallets
let currentIndex = 0; // starting index

function displayCurrentPallet() {
  if (pallets.length === 0) {
    loadDetailsDiv.innerHTML = "<p>No pallets found for this LoadID.</p>";
    return;
  }

  const palletID = pallets[currentIndex];
  const qrCode = loads[loadID][palletID]?.qrCode;

  loadDetailsDiv.innerHTML = `
    <p><strong>Load ID:</strong> ${loadID}</p>
    <section class="pallet-info">
      <div class="qr-code-container">
        ${
          qrCode
            ? `<img src="${qrCode}" alt="QR Code for ${palletID}" class="qr-code"/>`
            : ""
        }
      </div>
      <div class="pallet">
        <a href="palletDetails.html?loadID=${loadID}&palletID=${palletID}" target="_self">
          Pallet ID: ${palletID}
        </a>
      </div>
      <div class="carousel-buttons">
        <button class="carousel-btn" onclick="moveLeft()">&#8592; Previous</button>
        <button class="carousel-btn" onclick="moveRight()">Next &#8594;</button>
      </div>
    </section>
  `;
}

function moveLeft() {
  if (currentIndex > 0) {
    currentIndex--;
    displayCurrentPallet();
  }
}

function moveRight() {
  if (currentIndex < pallets.length - 1) {
    currentIndex++;
    displayCurrentPallet();
  }
}

function setupLoadDetails() {
  if (loadID && loads[loadID]) {
    pallets = Object.keys(loads[loadID]);
    displayCurrentPallet();
  } else {
    loadDetailsDiv.innerHTML = "<p>Invalid LoadID.</p>";
  }
}

setupLoadDetails();
