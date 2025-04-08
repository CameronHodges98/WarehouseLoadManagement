
// LoadID and PalletID Counters
let loadID = 1;
let palletID = 1;
let productIDCounter = 1; // Start counter for products

// Data Structure to Store Loads & Pallets
let loads = JSON.parse(localStorage.getItem("loads")) || {};
let pageSize = 10; // Set a default number of results per page
let currentPage = 1; // Track the current page for pagination

// Function to generate LoadID
const getNextLoadID = () => String(loadID++).padStart(5, "0");
const createLoadID = () => {
  const id = getNextLoadID();
  loads[id] = {}; // Initialize with an empty object for pallets
  localStorage.setItem("loads", JSON.stringify(loads)); // Save the changes to localStorage
  updateUI(); // Call to re-render the page with the updated loads
  return id;
};

// Function to generate PalletID
const getNextPalletID = () => String(palletID++).padStart(6, "0");
const createPalletID = (loadID) => {
  if (loads[loadID]) {
    const palletID = getNextPalletID();
    loads[loadID][palletID] = { products: [], qrCode: "" }; // Assign an empty product array and a QR code field
    localStorage.setItem("loads", JSON.stringify(loads)); // Save the changes to localStorage
    generateQRCode(palletID); // Generate QR code for the pallet
    updateUI(); // Call to re-render the page with the updated pallets
    return palletID;
  }
  return null; // Handle cases where LoadID does not exist
};

// Function to Create a New Load with Pallets and Add Products
const createPalletsAndAddProducts = () => {
  let numPallets = parseInt(document.getElementById("numPallets").value);
  let numProducts = parseInt(document.getElementById("productIDsBulk").value);

  if (numPallets < 1 || numProducts < 0)
    return alert("Enter valid numbers for pallets and products.");

  let newLoadID = createLoadID(); // Create a new load

  for (let i = 0; i < numPallets; i++) {
    const palletID = createPalletID(newLoadID); // Create pallets inside the load
    // Add products to each pallet after creation
    for (let j = 0; j < numProducts; j++) {
      const productID = String(productIDCounter++).padStart(10, "0"); // Generate a unique ProductID, pad with zeros
      loads[newLoadID][palletID].products.push({
        productID,
        title: "", // Default values for product
        description: "",
        condition: "",
        retailPrice: "",
        soldPrice: "",
      }); // Add product to pallet
    }
  }

  localStorage.setItem("loads", JSON.stringify(loads)); // Save the updated loads
  updateUI(); // Call to re-render the page with the updated loads

  // Clear input fields after creation
  document.getElementById("numPallets").value = 1;
  document.getElementById("productIDsBulk").value = 0;
};

// Function to Delete Multiple LoadIDs and Their Pallets
const deleteLoad = () => {
  let loadIDsToDelete = document
    .getElementById("deleteLoadID")
    .value.trim()
    .split(",");

  let success = false;

  loadIDsToDelete.forEach((load) => {
    load = load.trim(); // Remove extra spaces
    if (loads[load]) {
      delete loads[load];
      success = true;
    } else {
      alert(`LoadID ${load} not found.`);
    }
  });

  if (success) {
    localStorage.setItem("loads", JSON.stringify(loads)); // Save the updated loads
    updateUI(); // Call to re-render the page with the updated loads
    showConfirmationMessage("Load(s) deleted successfully!"); // Show confirmation message
  }

  // Clear the delete input field after deletion
  document.getElementById("deleteLoadID").value = "";
};

// Function to Delete Multiple PalletIDs from Any Load
const deletePallet = () => {
  let palletIDsToDelete = document
    .getElementById("deletePalletID")
    .value.trim()
    .split(",");

  let foundAny = false;

  palletIDsToDelete.forEach((palletIDToDelete) => {
    palletIDToDelete = palletIDToDelete.trim(); // Remove extra spaces
    let found = false;

    for (let load in loads) {
      if (loads[load][palletIDToDelete]) {
        delete loads[load][palletIDToDelete]; // Remove the pallet
        found = true;
        foundAny = true;

        // If no more pallets remain in the load, delete the load
        if (Object.keys(loads[load]).length === 0) {
          delete loads[load];
        }
        break;
      }
    }

    if (!found) {
      alert(`PalletID ${palletIDToDelete} not found.`);
    }
  });

  if (foundAny) {
    localStorage.setItem("loads", JSON.stringify(loads)); // Save the updated loads
    updateUI(); // Call to re-render the page with the updated pallets
    showConfirmationMessage("Pallet(s) deleted successfully!"); // Show confirmation message
  }

  // Clear the delete input field after deletion
  document.getElementById("deletePalletID").value = "";
};

// Function to Show Confirmation Message after Deletion
const showConfirmationMessage = (message) => {
  const outputDiv = document.getElementById("output");
  const confirmationDiv = document.createElement("div");
  confirmationDiv.className = "confirmation-message";
  confirmationDiv.innerText = message;
  outputDiv.insertBefore(confirmationDiv, outputDiv.firstChild); // Insert the confirmation message at the top
  setTimeout(() => {
    confirmationDiv.remove(); // Remove the confirmation message after 3 seconds
  }, 3000);
};

// Function to Update the UI Instantly with Search Functionality
const updateUI = () => {
  const outputDiv = document.getElementById("output");
  const searchQuery = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase(); // Get the search query

  outputDiv.innerHTML = ""; // Clear output

  if (Object.keys(loads).length === 0) {
    outputDiv.innerHTML = "<p>No Loads Available</p>";
    return;
  }

  // Filter the loads based on the search query (either by LoadID or PalletID)
  let filteredLoads = Object.keys(loads).filter((loadID) => {
    // Check if LoadID matches or if any PalletID within that Load matches
    return (
      loadID.toLowerCase().includes(searchQuery) || // Check if LoadID matches the search query
      Object.keys(loads[loadID]).some(
        (palletID) => palletID.toLowerCase().includes(searchQuery) // Check if any PalletID matches the search query
      )
    );
  });

  if (filteredLoads.length === 0) {
    outputDiv.innerHTML = "<p>No matching results found.</p>";
    return;
  }

  // Render filtered loads and pallets with pagination
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageLoads = filteredLoads.slice(startIndex, endIndex);

  pageLoads.forEach((load) => {
    let loadEntry = document.createElement("div");

    // Extract pallet IDs from the loads object
    let palletIDs = Object.keys(loads[load]);

    // Create a clickable link for each LoadID
    loadEntry.innerHTML = `<p><strong>Load ID:</strong> 
                                    <a href="loadDetails.html?loadID=${load}" target="_self">${load}</a></p>
                                   <p><strong>Pallets:</strong> 
                                     ${palletIDs
                                       .map(
                                         (palletID) =>
                                           `<a href="palletDetails.html?loadID=${load}&palletID=${palletID}" target="_self">${palletID}</a>`
                                       )
                                       .join(", ")}</p>
                                   <hr>`;
    outputDiv.appendChild(loadEntry);
  });

  // Pagination Controls
  const paginationDiv = document.createElement("div");
  paginationDiv.className = "pagination";
  paginationDiv.innerHTML = `
      <button onclick="changePage(-1)">Prev</button>
      <span>Page ${currentPage}</span>
      <button onclick="changePage(1)">Next</button>
  `;
  outputDiv.appendChild(paginationDiv);
};

// Function to change page for pagination
const changePage = (direction) => {
  const filteredLoads = Object.keys(loads);
  const totalPages = Math.ceil(filteredLoads.length / pageSize);
  currentPage = Math.min(Math.max(currentPage + direction, 1), totalPages); // Stay within page range
  updateUI();
};

// Event Listener for the Search Input
document.getElementById("searchInput").addEventListener("input", updateUI);

// Initial UI update on page load
updateUI();

// Function to generate QR Code for each PalletID and store it in the data structure
const generateQRCode = (palletID) => {
  const qrCode = new QRCode(document.createElement("div"), {
    text: palletID,
    width: 128,
    height: 128,
  });

  // Store QR code as base64 string in the data structure
  let base64QRCode = qrCode._oDrawing._elCanvas.toDataURL("image/png");
  for (let loadID in loads) {
    if (loads[loadID][palletID]) {
      loads[loadID][palletID].qrCode = base64QRCode; // Link QR code to the palletID
      localStorage.setItem("loads", JSON.stringify(loads)); // Save changes to localStorage
      break;
    }
  }
};
