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
                    alert("Not enough cookies!");
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
                    alert("Not enough cookies!");
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
    // Timer for Automatic Cookie Generation
    // -------------------------
    setInterval(() => {
        let totalAuto = autoClickerChains.reduce((sum, chain) => sum + chain.autoValue, 0);
        if (totalAuto > 0) {
            score += totalAuto;
            autoClickCount += totalAuto; // Track how many cookies came from auto upgrades
            scoreDisplay.textContent = score;
        }
        // Update clicks per second (auto rate) in real time
        // Since the interval is every 10 ms, totalAuto * 100 = auto clicks per second
        cpsDisplay.textContent = totalAuto * 100;
        // Update the auto clicks display
        autoClicksDisplay.textContent = autoClickCount;
    }, 10);

    // -------------------------
    // Mouse Click Functionality for Manual Clicking
    // -------------------------
    cookie.addEventListener('click', () => {
        score += cookieValue;
        humanClickCount += cookieValue; // Track how many cookies came from manual clicks
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
});
