document.addEventListener('DOMContentLoaded', () => {
    const cookie = document.getElementById('cookie');
    const scoreDisplay = document.getElementById('score');
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    let score = 0;
    let cookieValue = 1; // Base value per click

    // -------------------------
    // Mouse Upgrade System
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
    // Auto Clicker Upgrade Systems (7 chains)
    // -------------------------
    // Helper to create an array of 8 upgrades for auto clickers
    function createAutoUpgrades() {
        return [
            { id: 1, name: "Auto Clicker Upgrade 1", cost: 20, increment: 1, count: 0 },
            { id: 2, name: "Auto Clicker Upgrade 2", cost: 100, increment: 2, count: 0 },
            { id: 3, name: "Auto Clicker Upgrade 3", cost: 500, increment: 5, count: 0 },
            { id: 4, name: "Auto Clicker Upgrade 4", cost: 2000, increment: 10, count: 0 },
            { id: 5, name: "Auto Clicker Upgrade 5", cost: 10000, increment: 20, count: 0 },
            { id: 6, name: "Auto Clicker Upgrade 6", cost: 40000, increment: 50, count: 0 },
            { id: 7, name: "Auto Clicker Upgrade 7", cost: 200000, increment: 100, count: 0 },
            { id: 8, name: "Auto Clicker Upgrade 8", cost: 1000000, increment: 250, count: 0 }
        ];
    }
    // Create 7 chains, each with its current index and auto value
    const autoClickerChains = [];
    for (let i = 1; i <= 7; i++) {
        autoClickerChains.push({
            label: `Auto Clicker ${i}`,
            upgrades: createAutoUpgrades(),
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
            li.textContent = `${chain.label} - ${upg.name} (Cost: ${upg.cost})`;
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
    // Render all auto clicker systems
    autoClickerChains.forEach(chain => renderAutoUpgrade(chain));

    // -------------------------
    // Timer: Add auto clicker cookies each second
    // -------------------------
    setInterval(() => {
        let totalAuto = autoClickerChains.reduce((sum, chain) => sum + chain.autoValue, 0);
        if (totalAuto > 0) {
            score += totalAuto;
            scoreDisplay.textContent = score;
        }
    }, 1000);

    // -------------------------
    // Mouse click functionality
    // -------------------------
    cookie.addEventListener('click', () => {
        score += cookieValue;
        scoreDisplay.textContent = score;
        cookie.classList.add('clicked');
        setTimeout(() => {
            cookie.classList.remove('clicked');
        }, 100);
    });

    // -------------------------
    // Sidebar toggle functionality
    // -------------------------
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
    });
});
