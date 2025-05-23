const params = new URLSearchParams(window.location.search);
const loadID = params.get("loadID");
const palletID = params.get("palletID");

const palletDetailsDiv = document.getElementById("palletDetails");

let loads = JSON.parse(localStorage.getItem("loads")) || {}; // Get loads from localStorage

// Function to go back to the index.html page
const goBack = () => {
  window.location.href = "index.html"; // Redirects to the index.html page
};

// Function to assign location and set overflow to true
const assignLocation = () => {
  const location = document.getElementById("locationInput").value.trim();

  if (location === "") {
    alert("Please enter a location.");
    return;
  }

  if (loadID && palletID && loads[loadID] && loads[loadID][palletID]) {
    // Save the location and overflow status to the pallet
    loads[loadID][palletID].location = location;
    loads[loadID][palletID].overflow = true; // Set overflow to true
    localStorage.setItem("loads", JSON.stringify(loads)); // Save updated loads to localStorage

    // Hide the input and button and show the location
    document.getElementById("locationInput").style.display = "none";
    document.getElementById("assignLocationButton").style.display = "none";

    // Update the display to show the location and overflow status
    document.getElementById("locationText").textContent = location;
    document.getElementById("overflowText").textContent = "True";

    // Optionally, clear the input field (although hidden now)
    document.getElementById("locationInput").value = "";
  } else {
    alert("Invalid LoadID or PalletID.");
  }
};

// PalletDisplay function
const displayPalletDetails = () => {
  if (loadID && palletID && loads[loadID] && loads[loadID][palletID]) {
    const pallet = loads[loadID][palletID];
    const products = pallet.products;
    const location = pallet.location || "No location assigned"; // Display location if available
    const overflow = pallet.overflow !== undefined ? pallet.overflow : "False"; // Default to False if undefined

    palletDetailsDiv.innerHTML = `
        <p><strong>Load ID:</strong> ${loadID}</p>
        <p><strong>Pallet ID:</strong> ${palletID}</p>
        <p><strong>Products:</strong></p>
        <p class="product-list">
            ${
              products.length > 0
                ? products
                    .map(
                      (product) =>
                        `<a href="productDetails.html?loadID=${loadID}&palletID=${palletID}&productID=${product.productID}">${product.productID}</a>`
                    )
                    .join(", ")
                : "No products in this pallet."
            }
          </p>
      `;

    // Show the appropriate button based on the pallet's locked status
    const lockPalletButton = document.getElementById("lockPalletButton");
    const unlockPalletButton = document.getElementById("unlockPalletButton");

    if (pallet.locked) {
      unlockPalletButton.style.display = "block";
      unlockPalletButton.style.backgroundColor = "lightcoral";
      unlockPalletButton.style.color = "#222";
      lockPalletButton.style.display = "none";
    } else {
      lockPalletButton.style.display = "block";
      lockPalletButton.style.backgroundColor = "lightgreen";
      lockPalletButton.style.color = "#222";
      unlockPalletButton.style.display = "none";
    }
  } else {
    palletDetailsDiv.innerHTML = "<p>Invalid LoadID or PalletID.</p>";
  }
};

// Function to lock the pallet with a confirmation popup
const lockPallet = () => {
  const confirmation = confirm(
    "Are you sure you want to complete this pallet?"
  );

  if (confirmation) {
    if (loadID && palletID && loads[loadID] && loads[loadID][palletID]) {
      // Lock the pallet
      loads[loadID][palletID].locked = true;
      localStorage.setItem("loads", JSON.stringify(loads)); // Save updated loads to localStorage
      displayPalletDetails(); // Refresh the display to reflect the locked status

      // Update the display to show the location and overflow status
      document.getElementById("overflowText").textContent = "False"; // Overflow set to false when locked
      document.getElementById("locationText").textContent = ""; // Location cleared when locked
    } else {
      alert("Invalid LoadID or PalletID.");
    }
  }
};

// Function to unlock the pallet (requires manager code)
const unlockPallet = () => {
  const managerCode = prompt("Enter manager code to unlock the pallet:");

  if (managerCode === "1234") {
    if (loadID && palletID && loads[loadID] && loads[loadID][palletID]) {
      // Set the locked status to false for the pallet
      loads[loadID][palletID].locked = false;
      localStorage.setItem("loads", JSON.stringify(loads)); // Save updated loads to localStorage
      displayPalletDetails(); // Refresh the display to reflect the unlock status

      // Show location input and button again since the pallet is unlocked
      document.getElementById("locationInput").style.display = "inline";
      document.getElementById("assignLocationButton").style.display = "inline";

      alert(
        `Pallet ${palletID} is now unlocked. You can now assign a location.`
      );
    } else {
      alert("Invalid LoadID or PalletID.");
    }
  } else {
    alert("Incorrect manager code.");
  }
};

// Function to add product to pallet
const addProduct = () => {
  const productID = document.getElementById("productID").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const condition = document.getElementById("condition").value.trim();
  const retailPrice = parseFloat(document.getElementById("retailPrice").value);
  const soldPrice = parseFloat(document.getElementById("soldPrice").value);

  // Regular expression to check if the ProductID is exactly 10 digits (0-9)
  const productIDRegex = /^\d{10}$/;

  // Validate the productID against the regex
  if (!productIDRegex.test(productID)) {
    alert(
      "Please enter a valid Product ID: Exactly 10 digits, no letters or special characters."
    );
    return;
  }

  if (loadID && palletID && loads[loadID] && loads[loadID][palletID]) {
    // Check if the pallet is locked
    if (loads[loadID][palletID].locked) {
      alert(
        `Pallet ${palletID} is locked and cannot have more products added.`
      );
      return;
    }

    // Check if the productID already exists in the pallet's product list
    if (
      loads[loadID][palletID].products.some(
        (product) => product.productID === productID
      )
    ) {
      alert("This Product ID already exists in the pallet.");
      return;
    }

    // Add the new product object to the pallet
    const newProduct = {
      productID,
      title,
      description,
      condition,
      retailPrice,
      soldPrice,
    };

    loads[loadID][palletID].products.push(newProduct);
    localStorage.setItem("loads", JSON.stringify(loads)); // Save updated loads to localStorage
    displayPalletDetails(); // Refresh the display
  } else {
    alert("Invalid LoadID or PalletID.");
  }

  // Reset the input fields but keep the focus active
  document.getElementById("productID").value = ""; // Clear the ProductID input
  document.getElementById("title").value = ""; // Clear the title input
  document.getElementById("description").value = ""; // Clear the description input
  document.getElementById("condition").value = ""; // Clear the condition input
  document.getElementById("retailPrice").value = ""; // Clear the retail price input
  document.getElementById("soldPrice").value = ""; // Clear the sold price input
  document.getElementById("productID").focus(); // Keep focus on the ProductID input for the next entry
};

// Add event listeners for "Enter" key press to submit location and product inputs
document
  .getElementById("locationInput")
  .addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      assignLocation();
    }
  });

document.getElementById("productID").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addProduct();
  }
});

// Initial display of PalletID and its products
displayPalletDetails();
