// Wait for the full DOM to load before executing any script logic.
document.addEventListener('DOMContentLoaded', () => {
    // Get reference to the main cookie image element.
    const cookie = document.getElementById('cookie');
    // Get reference to the score display element where the cookie total is shown.
    const scoreDisplay = document.getElementById('score');
    // Get reference to the sidebar container used for upgrades and toggling.
    const sidebar = document.getElementById('sidebar');
    // Get reference to the button that toggles the sidebar state (collapsed/expanded).
    const sidebarToggle = document.getElementById('sidebarToggle');

    // Initialize the player's score to zero.
    let score = 0;
    // Set the base value per click for the cookie (can be increased via upgrades).
    let cookieValue = 1; 

    // -------------------------
    // Begin Mouse Upgrade System Section
    // -------------------------
    // This system lets the user manually upgrade the cookie click value with mouse-related upgrades.

    // Index to track the current mouse upgrade in the chain.
    let currentMouseUpgradeIndex = 0;
    // Array of objects representing each upgrade in the mouse upgrade chain.
    const mouseUpgrades = [
        { id: 1, name: "Chocolate Mouse", cost: 10, increment: 1, count: 0 },
        { id: 2, name: "Hot Chocolate Cursor", cost: 50, increment: 2, count: 0 },
        { id: 3, name: "Cookie Click Accelerator", cost: 250, increment: 5, count: 0 },
        { id: 4, name: "Caramel Crunch Clicker", cost: 1000, increment: 10, count: 0 },
        { id: 5, name: "Sugar Rush Spinner", cost: 5000, increment: 20, count: 0 },
        { id: 6, name: "Butterscotch Speedster", cost: 20000, increment: 50, count: 0 },
        { id: 7, name: "Fudge Flicker", cost: 100000, increment: 100, count: 0 },
        { id: 8, name: "Cocoa Turbo EXTREME!", cost: 500000, increment: 250, count: 0 }
    ];
    // Get reference to the <ul> element for rendering the mouse upgrade in the sidebar.
    const mouseUpgradeList = document.getElementById('mouse-upgrade');

    // Function to render the current mouse upgrade in the sidebar.
    function renderMouseUpgrade() {
        // Clear any previous content from the mouse upgrade list.
        mouseUpgradeList.innerHTML = "";
        // If there are still upgrades remaining in the chain...
        if (currentMouseUpgradeIndex < mouseUpgrades.length) {
            // Get the current upgrade object.
            const upg = mouseUpgrades[currentMouseUpgradeIndex];
            // Create a new <li> element to display the upgrade.
            const li = document.createElement('li');
            // Set the text to show the upgrade's name and cost.
            li.textContent = `${upg.name} (Cost: ${upg.cost})`;
            // On clicking the upgrade...
            li.addEventListener('click', () => {
                // Check if the player has enough cookies to buy the upgrade.
                if (score >= upg.cost) {
                    // Deduct the cost from the total score.
                    score -= upg.cost;
                    // Update the score display with the new score.
                    scoreDisplay.textContent = score;
                    // Increment the upgrade's owned count.
                    upg.count++;
                    // Increase the cookie's per-click value by the upgrade's increment value.
                    cookieValue += upg.increment;
                    // Move to the next upgrade in the chain.
                    currentMouseUpgradeIndex++;
                    // Re-render the mouse upgrade to show the new upgrade option.
                    renderMouseUpgrade();
                } else {
                    // Alert the user if they do not have enough cookies.
                    alert("Not enough cookies!");
                }
            });
            // Append the new <li> element into the mouse upgrade list container.
            mouseUpgradeList.appendChild(li);
        } else {
            // If all upgrades are purchased, display that no further upgrades are available.
            const li = document.createElement('li');
            li.textContent = "Max Mouse Upgrades Reached";
            mouseUpgradeList.appendChild(li);
        }
    }
    // Call the function once to render the initial mouse upgrade.
    renderMouseUpgrade();

    // -------------------------
    // Begin Auto Clicker Upgrade Systems Section (7 independent chains)
    // -------------------------
    // These chains grant automatic cookie generation over time.

    // Helper function to create an array of 8 auto clicker upgrades.
    // Each auto clicker upgrade increases the auto click value.
    function createAutoUpgrades(chainLabel) {
        return [
            { id: 1, name: `${chainLabel} - Baking Bot`, cost: 20, increment: 1, count: 0 },
            { id: 2, name: `${chainLabel} - Cookie Conveyor`, cost: 100, increment: 2, count: 0 },
            { id: 3, name: `${chainLabel} - Dough Drone`, cost: 500, increment: 5, count: 0 },
            { id: 4, name: `${chainLabel} - Oven Overcharger`, cost: 2000, increment: 10, count: 0 },
            { id: 5, name: `${chainLabel} - Pastry Processor`, cost: 10000, increment: 20, count: 0 },
            { id: 6, name: `${chainLabel} - Sugar Synthesizer`, cost: 40000, increment: 50, count: 0 },
            { id: 7, name: `${chainLabel} - Frosting Facilitator`, cost: 200000, increment: 100, count: 0 },
            { id: 8, name: `${chainLabel} - Grandma's Oven`, cost: 1000000, increment: 250, count: 0 }
        ];
    }

    // Create an array to hold 7 separate auto clicker chains.
    // Each chain has its own label, upgrade chain, current index, auto value, and target <ul> element.
    const autoClickerChains = [];
    // Loop to create 7 chains.
    for (let i = 1; i <= 7; i++) {
        const chainLabel = `Auto Clicker ${i}`;
        autoClickerChains.push({
            label: chainLabel,                // A label to identify the chain.
            upgrades: createAutoUpgrades(chainLabel),             // Generate a fresh copy of 8 upgrades.
            currentIndex: 0,                            // Start at the first upgrade.
            autoValue: 0,                               // Auto click value starts at 0.
            listEl: document.getElementById(`auto-upgrade-${i}`) // Get the corresponding <ul> element by its id.
        });
    }

    // Function to render the current upgrade for a given auto clicker chain.
    function renderAutoUpgrade(chain) {
        // Clear the chain's current upgrade display.
        chain.listEl.innerHTML = "";
        // Check if there are still upgrades available in this chain.
        if (chain.currentIndex < chain.upgrades.length) {
            // Retrieve the current upgrade object.
            const upg = chain.upgrades[chain.currentIndex];
            // Create a new <li> element to display the upgrade for this auto clicker.
            const li = document.createElement('li');
            // Set the text to show the chain label, upgrade name, and cost.
            li.textContent = `${upg.name} (Cost: ${upg.cost})`;
            // Add a click event listener to handle purchasing the upgrade.
            li.addEventListener('click', () => {
                // Check if the player has enough cookies to purchase.
                if (score >= upg.cost) {
                    // Deduct the cost from the score.
                    score -= upg.cost;
                    // Update the score display element.
                    scoreDisplay.textContent = score;
                    // Increment the purchased upgrade's count.
                    upg.count++;
                    // Increase the auto click value for this chain by the upgrade's increment.
                    chain.autoValue += upg.increment;
                    // Move on to the next upgrade in the chain.
                    chain.currentIndex++;
                    // Re-render the auto clicker upgrade for this chain.
                    renderAutoUpgrade(chain);
                } else {
                    // Alert the player if they do not have enough cookies.
                    alert("Not enough cookies!");
                }
            });
            // Append the newly created <li> element to the chain's designated upgrade list.
            chain.listEl.appendChild(li);
        } else {
            // If all upgrades for the chain have been purchased, inform the player.
            const li = document.createElement('li');
            li.textContent = `${chain.label} - Max Upgrades Reached`;
            chain.listEl.appendChild(li);
        }
    }
    // Render the initial upgrade for all 7 auto clicker chains.
    autoClickerChains.forEach(chain => renderAutoUpgrade(chain));

    // -------------------------
    // Timer for Automatic Cookie Generation
    // -------------------------
    // Set up an interval to add cookies automatically based on the cumulative auto click value.
    setInterval(() => {
        // Sum the autoValue from all auto clicker chains.
        let totalAuto = autoClickerChains.reduce((sum, chain) => sum + chain.autoValue, 0);
        // If there is any auto-generated cookie value, add it to the score.
        if (totalAuto > 0) {
            score += totalAuto;
            // Update the score display with the new total.
            scoreDisplay.textContent = score;
        }
    }, 1000); // Execute this block every 1000 milliseconds (1 second).

    // -------------------------
    // Mouse Click Functionality for Manual Clicking
    // -------------------------
    // Add an event listener on the cookie element so when it's clicked, the score increases.
    cookie.addEventListener('click', () => {
        // Add the current cookie value (which might be enhanced by mouse upgrades) to the score.
        score += cookieValue;
        // Update the displayed score.
        scoreDisplay.textContent = score;
        // Apply a temporary 'clicked' class for visual feedback.
        cookie.classList.add('clicked');
        // Remove the 'clicked' class after a short delay to reset the animation.
        setTimeout(() => {
            cookie.classList.remove('clicked');
        }, 100);
    });

    // -------------------------
    // Sidebar Toggle Functionality
    // -------------------------
    // Add an event listener to the sidebar toggle button.
    sidebarToggle.addEventListener('click', () => {
        // Toggle the 'collapsed' class on the sidebar element to show/hide its full width.
        sidebar.classList.toggle('collapsed');
    });
});
