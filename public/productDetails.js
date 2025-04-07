const params = new URLSearchParams(window.location.search);
const loadID = params.get("loadID");
const palletID = params.get("palletID");
const productID = params.get("productID");

const productDetailsDiv = document.getElementById("productDetails");

let loads = JSON.parse(localStorage.getItem("loads")) || {}; // Get loads from localStorage

// Select the cancel button
const cancelButton = document.getElementById("cancelChanges");

// Add event listener to the button
cancelButton.addEventListener("click", function () {
  // Redirect to palletDetails.html when the Cancel button is clicked
  window.location.href = `palletDetails.html?loadID=${loadID}&palletID=${palletID}`;
});

// Function to load and display the current product details
const loadProductDetails = () => {
  if (
    loadID &&
    palletID &&
    productID &&
    loads[loadID] &&
    loads[loadID][palletID]
  ) {
    const pallet = loads[loadID][palletID];
    const product = pallet.products.find((p) => p.productID === productID);

    if (product) {
      // Display product details in the form fields
      document.getElementById("productTitle").value = product.title || "";
      document.getElementById("productDescription").value =
        product.description || "";
      document.getElementById("productCondition").value =
        product.condition || "";
      document.getElementById("productRetailPrice").value =
        product.retailPrice || "";
      document.getElementById("productSoldPrice").value =
        product.soldPrice || "";

      // Display the ProductID under the h2 tag
      document.getElementById("productIDDisplay").textContent = `${productID}`;
    } else {
      alert("Product not found.");
    }
  } else {
    alert("Invalid LoadID, PalletID, or ProductID.");
  }
};

// Function to save product changes and update localStorage
const saveChanges = () => {
  const title = document.getElementById("productTitle").value.trim();
  const description = document
    .getElementById("productDescription")
    .value.trim();
  const condition = document.getElementById("productCondition").value.trim();
  const retailPrice = document
    .getElementById("productRetailPrice")
    .value.trim();
  const soldPrice = document.getElementById("productSoldPrice").value.trim();

  if (!title || !description || !condition || !retailPrice || !soldPrice) {
    alert("Please fill in all fields before saving.");
    return;
  }

  if (
    loadID &&
    palletID &&
    productID &&
    loads[loadID] &&
    loads[loadID][palletID]
  ) {
    const pallet = loads[loadID][palletID];
    const product = pallet.products.find((p) => p.productID === productID);

    if (product) {
      // Update the product details in localStorage
      product.title = title;
      product.description = description;
      product.condition = condition;
      product.retailPrice = retailPrice;
      product.soldPrice = soldPrice;

      // Save the updated loads back to localStorage
      localStorage.setItem("loads", JSON.stringify(loads));

      // Show the confirmation popup
      const confirmation = confirm(
        "Changes saved successfully! Redirect to Pallet Details."
      );

      // If the user clicks "OK", proceed with the redirection after 3 seconds
      if (confirmation) {
        // Timeout for 3 seconds before redirecting
        setTimeout(() => {
          // Redirect to the Pallet Details page
          window.location.href = `palletDetails.html?loadID=${loadID}&palletID=${palletID}`;
        }, 1000); // 1000ms = 1 seconds
      }

      if (confirmation) {
        // Redirect back to the palletDetails page with the correct LoadID and PalletID
        window.location.href = `palletDetails.html?loadID=${loadID}&palletID=${palletID}`;
      }
    } else {
      alert("Product not found.");
    }
  } else {
    alert("Invalid LoadID, PalletID, or ProductID.");
  }
};

// Load product details when the page loads
window.onload = loadProductDetails;

// Add event listener to Save Changes button
document
  .getElementById("saveChangesButton")
  .addEventListener("click", saveChanges);
