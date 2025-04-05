        // Retrieve the loadID and palletID from the URL
        const params = new URLSearchParams(window.location.search);
        const loadID = params.get("loadID");
        const palletID = params.get("palletID");

        // Display loadID and palletID
        const palletHeader = document.getElementById('palletHeader');
        palletHeader.innerHTML = `${loadID} | ${palletID}`;

        // Products array to hold the ProductIDs for this pallet
        let products = [];

        // Function to add product to the pallet
        function addProduct() {
            const productID = document.getElementById('productID').value.trim();

            // Regular expression to check if the ProductID is exactly 10 digits (0-9)
            const productIDRegex = /^\d{10}$/;

            // Validate the productID against the regex
            if (!productIDRegex.test(productID)) {
                alert("Please enter a valid Product ID: Exactly 10 digits, no letters or special characters.");
                return;
            }

            // Check if the product already exists in the pallet
            if (products.includes(productID)) {
                alert("This Product ID already exists in the pallet.");
                return;
            }

            // Add the product to the pallet
            products.push(productID);
            document.getElementById('productID').value = '';  // Clear the input field
            displayMessage("Product added successfully!");
        }

        // Display success message
        function displayMessage(message) {
            document.getElementById('message').innerText = message;
            setTimeout(() => {
                document.getElementById('message').innerText = '';
            }, 2000);
        }