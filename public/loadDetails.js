// Function to go back to the previous page in the history stack
const goBack = () => {
  window.history.back(); // This will navigate the user back to the previous page
};

// Retrieve the LoadID from the URL
const params = new URLSearchParams(window.location.search);
const loadID = params.get("loadID");

// Display the corresponding PalletIDs for the LoadID
const loadDetailsDiv = document.getElementById("loadDetails");

let loads = JSON.parse(localStorage.getItem("loads")) || {}; // Get loads from localStorage

// Function to display the LoadID and PalletIDs along with QR codes
function displayLoadDetails() {
  if (loadID && loads[loadID]) {
    const pallets = Object.keys(loads[loadID]); // Extract pallet IDs from the object

    if (pallets.length > 0) {
      loadDetailsDiv.innerHTML = `
        <p><strong>Load ID:</strong> ${loadID}</p>
        <div class="pallet-list">
            ${pallets
              .map((palletID) => {
                const qrCode = loads[loadID][palletID]?.qrCode;
                return `
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
                  </section>`
              })
              .join("")}
        </div>`;
    } else {
      loadDetailsDiv.innerHTML = "<p>No pallets found for this LoadID.</p>";
    }
  } else {
    loadDetailsDiv.innerHTML = "<p>Invalid LoadID.</p>";
  }
}

// Initial display of LoadID and PalletIDs
displayLoadDetails();
