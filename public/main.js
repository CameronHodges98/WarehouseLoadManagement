// LoadID and PalletID Counters
let loadID = 1;
let palletID = 1;

// Data Structure to Store Loads & Pallets
let loads = JSON.parse(localStorage.getItem("loads")) || {};

// Function to generate LoadID
const getNextLoadID = () => String(loadID++).padStart(5, '0');
const createLoadID = () => {
    const id = getNextLoadID();
    loads[id] = {}; // Initialize with an empty object for pallets
    localStorage.setItem("loads", JSON.stringify(loads));
    return id;
};

// Function to generate PalletID
const getNextPalletID = () => String(palletID++).padStart(6, '0');
const createPalletID = (loadID) => {
    if (loads[loadID]) {
        const palletID = getNextPalletID();
        loads[loadID][palletID] = { products: [] }; // Assign an empty product array at creation
        localStorage.setItem("loads", JSON.stringify(loads));
        return palletID;
    }
    return null; // Handle cases where LoadID does not exist
};

// Function to Generate a New Load with Pallets
const generatePallet = () => {
    let numPallets = parseInt(document.getElementById("numPallets").value);
    if (numPallets < 1) return alert("Enter a valid number of pallets.");

    let newLoadID = getNextLoadID();
    loads[newLoadID] = {}; // Initialize a new Load

    for (let i = 0; i < numPallets; i++) {
        createPalletID(newLoadID); // Create pallets inside the load
    }

    localStorage.setItem("loads", JSON.stringify(loads)); // Save the loads object to localStorage
    updateUI();
};

// Function to Delete Multiple LoadIDs and Their Pallets
const deleteLoad = () => {
    let loadIDsToDelete = document
        .getElementById("deleteLoadID")
        .value.trim()
        .split(",");
    
    loadIDsToDelete.forEach((load) => {
        load = load.trim(); // Remove extra spaces
        if (loads[load]) {
            delete loads[load];
        } else {
            alert(`LoadID ${load} not found.`);
        }
    });
    updateUI();
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
        updateUI();
    }
};

// Function to Update the UI Instantly
const updateUI = () => {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = ""; // Clear output

    if (Object.keys(loads).length === 0) {
        outputDiv.innerHTML = "<p>No Loads Available</p>";
        return;
    }

    for (let load in loads) {
        let loadEntry = document.createElement("div");

        // Extract pallet IDs from the loads object
        let palletIDs = Object.keys(loads[load]);

        // Create a clickable link for each LoadID
        loadEntry.innerHTML = `<p><strong>Load ID:</strong> 
                                  <a href="loadDetails.html?loadID=${load}" target="_blank">${load}</a></p>
                                 <p><strong>Pallets:</strong> ${palletIDs.join(", ")}</p>
                                 <hr>`;
        outputDiv.appendChild(loadEntry);
    }
};

// Add event listeners to update the UI when data changes
document.getElementById("generatePalletButton").addEventListener("click", generatePallet);
document.getElementById("deleteLoadButton").addEventListener("click", deleteLoad);
document.getElementById("deletePalletButton").addEventListener("click", deletePallet);

// Initial UI update on page load
updateUI();
