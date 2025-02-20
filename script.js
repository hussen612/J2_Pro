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

    // Elements for top bar stats:
    const humanClicksDisplay = document.getElementById('human-clicks');
    const autoClicksDisplay = document.getElementById('auto-clicks');
    const cpsDisplay = document.getElementById('cps');

    // Initialise the player's score to zero.
    let score = 0;
    // Track total human-clicked cookies and auto-clicked cookies separately.
    let humanClickCount = 0;
    let autoClickCount = 0;
    // Set the base value per click for the cookie (can be increased via upgrades).
    let cookieValue = 1;
    // New variable: count human clicks that occur within the current second.
    let humanClicksThisSecond = 0;

    // Get reference to error modal elements.
    const errorModal = document.getElementById('error-modal');
    const closeErrorModal = document.getElementById('close-error-modal');

    // Function to open error modal.
    function openErrorModal() {
        errorModal.classList.remove('hidden');
    }
    // Event listener for closing the error modal.
    closeErrorModal.addEventListener('click', () => {
        errorModal.classList.add('hidden');
    });

    // -------------------------
    // Begin Mouse Upgrade System Section
    // -------------------------
    let currentMouseUpgradeIndex = 0;
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
    const mouseUpgradeList = document.getElementById('mouse-upgrade');

    function renderMouseUpgrade() {
        mouseUpgradeList.innerHTML = "";
        if (currentMouseUpgradeIndex < mouseUpgrades.length) {
            const upg = mouseUpgrades[currentMouseUpgradeIndex];
            const li = document.createElement('li');
            li.textContent = `${upg.name} (Cost: ${upg.cost})`;
            li.addEventListener('click', () => {
                if (score >= upg.cost) {
                    score -= upg.cost;
                    scoreDisplay.textContent = score;
                    upg.count++;
                    cookieValue += upg.increment;
                    currentMouseUpgradeIndex++;
                    renderMouseUpgrade();
                } else {
                    openErrorModal();
                }
            });
            mouseUpgradeList.appendChild(li);
        } else {
            const li = document.createElement('li');
            li.textContent = "Max Mouse Upgrades Reached";
            mouseUpgradeList.appendChild(li);
        }
    }
    renderMouseUpgrade();

    // -------------------------
    // Begin Auto Clicker Upgrade Systems Section (7 independent chains)
    // -------------------------
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

    const autoClickerChains = [];
    for (let i = 1; i <= 7; i++) {
        const chainLabel = `Auto Clicker ${i}`;
        autoClickerChains.push({
            label: chainLabel,
            upgrades: createAutoUpgrades(chainLabel),
            currentIndex: 0,
            autoValue: 0,
            listEl: document.getElementById(`auto-upgrade-${i}`)
        });
    }

    function renderAutoUpgrade(chain) {
        chain.listEl.innerHTML = "";
        if (chain.currentIndex < chain.upgrades.length) {
            const upg = chain.upgrades[chain.currentIndex];
            const li = document.createElement('li');
            li.textContent = `${upg.name} (Cost: ${upg.cost})`;
            li.addEventListener('click', () => {
                if (score >= upg.cost) {
                    score -= upg.cost;
                    scoreDisplay.textContent = score;
                    upg.count++;
                    chain.autoValue += upg.increment;
                    chain.currentIndex++;
                    renderAutoUpgrade(chain);
                } else {
                    openErrorModal();
                }
            });
            chain.listEl.appendChild(li);
        } else {
            const li = document.createElement('li');
            li.textContent = `${chain.label} - Max Upgrades Reached`;
            chain.listEl.appendChild(li);
        }
    }
    autoClickerChains.forEach(chain => renderAutoUpgrade(chain));

    // -------------------------
    // New Timer: Combine Auto and Human Clicks for CPS Calculation
    // -------------------------
    // Remove the old 10ms interval. Create new one that fires every 1000ms.
    setInterval(() => {
        // Sum auto-generated clicks from all chains.
        let totalAuto = autoClickerChains.reduce((sum, chain) => sum + chain.autoValue, 0);
        // Calculate CPS as auto clicks plus human clicks this second.
        let cps = totalAuto + humanClicksThisSecond;
        cpsDisplay.textContent = cps;
        // Add auto-generated cookies to the score (human clicks are already counted on click).
        if (totalAuto > 0) {
            score += totalAuto;
            autoClickCount += totalAuto;
            scoreDisplay.textContent = score;
            autoClicksDisplay.textContent = autoClickCount;
        }
        // Reset human click counter for the next second.
        humanClicksThisSecond = 0;
    }, 1000);

    // -------------------------
    // Mouse Click Functionality for Manual Clicking
    // -------------------------
    cookie.addEventListener('click', () => {
        score += cookieValue;
        humanClickCount += cookieValue; // Track how many cookies came from manual clicks
        // Count human clicks this second for CPS calculation.
        humanClicksThisSecond += cookieValue;
        scoreDisplay.textContent = score;
        humanClicksDisplay.textContent = humanClickCount;

        cookie.classList.add('clicked');
        setTimeout(() => {
            cookie.classList.remove('clicked');
        }, 100);
    });

    // -------------------------
    // Sidebar Toggle Functionality
    // -------------------------
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });

    // -------------------------
    // Options Menu and Theme Modal Functionality
    // -------------------------
    const optionsButton = document.getElementById('options-button');
    const themeModal = document.getElementById('theme-modal');
    const closeThemeModal = document.getElementById('close-theme-modal');
    
    // Show the modal when options button is clicked
    optionsButton.addEventListener('click', () => {
        themeModal.classList.remove('hidden');
    });
    
    // Hide the modal when close button is clicked
    closeThemeModal.addEventListener('click', () => {
        themeModal.classList.add('hidden');
    });
    
    // Add event listeners on each theme option in the modal
    const themeOptions = themeModal.querySelectorAll('li[data-theme]');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            // Remove any existing theme class from body
            document.body.classList.remove('theme-dark', 'theme-pink', 'theme-brown');
            // Add the selected theme class to the body
            const selectedTheme = option.getAttribute('data-theme');
            document.body.classList.add(`theme-${selectedTheme}`);
            // Hide the modal after selection
            themeModal.classList.add('hidden');
        });
    });
});
