//------------------------------
// CLASS: MouseUpgradeSystem
// Encapsulates the manual click upgrade chain logic.
//------------------------------
class MouseUpgradeSystem {
    // Constructor accepts a reference to the <ul> element to render upgrades,
    // and a reference to the main Game instance.
    constructor(listEl, game) {
        this.listEl = listEl;          // DOM element for displaying upgrades.
        this.game = game;              // Reference to the global Game instance.
        this.currentIndex = 0;         // Index tracking the current upgrade in the array.
        // Array of mouse upgrade objects with cost, increment value, and owned count.
        this.upgrades = [
            { id: 1, name: "Chocolate Mouse", cost: 10, increment: 1, count: 0 },
            { id: 2, name: "Hot Chocolate Cursor", cost: 50, increment: 2, count: 0 },
            { id: 3, name: "Cookie Click Accelerator", cost: 250, increment: 5, count: 0 },
            { id: 4, name: "Caramel Crunch Clicker", cost: 1000, increment: 10, count: 0 },
            { id: 5, name: "Sugar Rush Spinner", cost: 5000, increment: 20, count: 0 },
            { id: 6, name: "Butterscotch Speedster", cost: 20000, increment: 50, count: 0 },
            { id: 7, name: "Fudge Flicker", cost: 100000, increment: 100, count: 0 },
            { id: 8, name: "Cocoa Turbo EXTREME!", cost: 500000, increment: 250, count: 0 }
        ];
    }
    
    // Method: render
    // Renders the current mouse upgrade option into the designated <ul> element.
    render() {
        // Clear the <ul> element contents.
        this.listEl.innerHTML = "";
        
        // Check if currentIndex indicates an available upgrade.
        if (this.currentIndex < this.upgrades.length) {
            // Get the upgrade object at the current index.
            const upg = this.upgrades[this.currentIndex];
            // Create a <li> element to represent the upgrade option.
            const li = document.createElement('li');
            // Set text content of <li> with upgrade name and cost.
            li.textContent = `${upg.name} (Cost: ${upg.cost})`;
            // Add click event listener to process purchase.
            li.addEventListener('click', () => {
                // Check if the player has enough score to purchase.
                if (this.game.score >= upg.cost) {
                    // Deduct the upgrade cost from game score.
                    this.game.score -= upg.cost;
                    // Increment upgrade counter for record keeping.
                    upg.count++;
                    // Increase manual click (cookie) value by upgrade increment.
                    this.game.cookieValue += upg.increment;
                    // Move the index pointer to the next upgrade.
                    this.currentIndex++;
                    // Re-render the upgrade list to display the new available upgrade.
                    this.render();
                    // Update on-screen displays such as the score.
                    this.game.updateDisplays();
                } else {
                    // If not enough score, the error modal is invoked.
                    this.game.openErrorModal();
                }
            });
            // Append the newly created <li> to the upgrade <ul>.
            this.listEl.appendChild(li);
        } else {
            // If all upgrades have been purchased, show max reached message.
            const li = document.createElement('li');
            li.textContent = "Max Mouse Upgrades Reached";
            this.listEl.appendChild(li);
        }
    }
}

//------------------------------
// CLASS: AutoClickerChain
// Encapsulates a single chain of auto-click upgrades.
//------------------------------
class AutoClickerChain {
    // Constructor receives a chain label, target <ul> element, and Game reference.
    constructor(label, listEl, game) {
        this.label = label;            // Name of the chain (e.g., "Auto Clicker 1").
        this.listEl = listEl;          // DOM element where upgrades are rendered.
        this.game = game;              // Game instance for accessing shared game state.
        this.currentIndex = 0;         // Start with the first available upgrade.
        this.autoValue = 0;            // Total auto-click value contributed by upgrades.
        // Create an array of upgrade objects using a static helper method.
        this.upgrades = AutoClickerChain.createUpgrades(label);
    }
    
    // Static method to generate unique upgrade names for a given chain label.
    static createUpgrades(chainLabel) {
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
    
    // Method: render
    // Renders the current upgrade of this auto-click chain onto its <ul> element.
    render() {
        // Clear the contents of this chain's target element.
        this.listEl.innerHTML = "";
        
        // If there is an upgrade available (not all purchased yet).
        if (this.currentIndex < this.upgrades.length) {
            const upg = this.upgrades[this.currentIndex]; // Current upgrade.
            const li = document.createElement('li');        // Create list item.
            li.textContent = `${upg.name} (Cost: ${upg.cost})`; // Set its text.
            // Add click event to attempt purchasing the upgrade.
            li.addEventListener('click', () => {
                // Ensure sufficient score is available.
                if (this.game.score >= upg.cost) {
                    // Deduct the cost from the game score.
                    this.game.score -= upg.cost;
                    // Increment count of times this upgrade is purchased.
                    upg.count++;
                    // Increase auto click contribution.
                    this.autoValue += upg.increment;
                    // Move pointer to next upgrade.
                    this.currentIndex++;
                    // Re-render to update displayed upgrade option.
                    this.render();
                    // Update all relevant game displays.
                    this.game.updateDisplays();
                } else {
                    // Open error modal if not enough score.
                    this.game.openErrorModal();
                }
            });
            // Append the list item into the chain's DOM element.
            this.listEl.appendChild(li);
        } else {
            // When no upgrades remain, display a "max reached" message.
            const li = document.createElement('li');
            li.textContent = `${this.label} - Max Upgrades Reached`;
            this.listEl.appendChild(li);
        }
    }
}

//------------------------------
// CLASS: Game
// Main game controller. Maintains overall state and manages timers, displays, and events.
//------------------------------
class Game {
    // Constructor initializes element references, game state, and subsystems.
    constructor() {
        // Grab references to key DOM elements.
        this.cookie = document.getElementById('cookie');               // The clickable cookie image.
        this.scoreDisplay = document.getElementById('score');            // Display for current score.
        this.sidebar = document.getElementById('sidebar');               // Sidebar for upgrades.
        this.sidebarToggle = document.getElementById('sidebarToggle');     // Button to collapse sidebar.
        this.humanClicksDisplay = document.getElementById('human-clicks'); // Display for manual click count.
        this.autoClicksDisplay = document.getElementById('auto-clicks');   // Display for auto click count.
        this.cpsDisplay = document.getElementById('cps');                  // Display for clicks per second.
        
        // Modal elements for errors and theme options.
        this.errorModal = document.getElementById('error-modal');
        this.closeErrorModal = document.getElementById('close-error-modal');
        this.optionsButton = document.getElementById('options-button');
        this.themeModal = document.getElementById('theme-modal');
        this.closeThemeModal = document.getElementById('close-theme-modal');
        // All theme option list items within the theme modal.
        this.themeOptions = this.themeModal.querySelectorAll('li[data-theme]');
        
        // Initialize game state variables.
        this.score = 0;              // Total score (cookies).
        this.cookieValue = 1;        // Value per cookie click.
        this.humanClicks = 0;        // Total value from manual clicks.
        this.autoClicks = 0;         // Total value awarded automatically.
        this.humanClicksThisSecond = 0; // Temp counter for manual clicks per second.
        
        // Instantiate the manual click upgrade system.
        this.mouseUpgradeSystem = new MouseUpgradeSystem(document.getElementById('mouse-upgrade'), this);
        
        // Create 7 auto clicker chain instances.
        this.autoClickerChains = [];
        for (let i = 1; i <= 7; i++) {
            const chainLabel = `Auto Clicker ${i}`;
            const listEl = document.getElementById(`auto-upgrade-${i}`);
            const chain = new AutoClickerChain(chainLabel, listEl, this);
            this.autoClickerChains.push(chain);
        }
        
        // Setup event listeners (cookie clicks, sidebar toggle, modals, etc.)
        this.setupEventListeners();
        // Start regular timers for updating CPS and auto awards.
        this.startTimers();
        // Render initial upgrade lists.
        this.renderAll();
        // Initialize all on-screen display elements.
        this.updateDisplays();
    }
    
    // Method: setupEventListeners
    // Connects DOM events to game logic.
    setupEventListeners() {
        // When the cookie is clicked, handle the manual click.
        this.cookie.addEventListener('click', () => this.handleCookieClick());
        
        // Toggle sidebar visibility when its button is clicked.
        this.sidebarToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('collapsed');
        });
        
        // Close the error modal when its close button is pressed.
        this.closeErrorModal.addEventListener('click', () => {
            this.errorModal.classList.add('hidden');
        });
        
        // Open the theme modal when the options button is clicked.
        this.optionsButton.addEventListener('click', () => {
            this.themeModal.classList.remove('hidden');
        });
        
        // Close the theme modal when its close button is clicked.
        this.closeThemeModal.addEventListener('click', () => {
            this.themeModal.classList.add('hidden');
        });
        
        // For each theme option, update the body class to change the color theme.
        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove any existing theme classes.
                document.body.classList.remove('theme-dark','theme-pink','theme-brown');
                // Get the selected theme from the data attribute.
                const selectedTheme = option.getAttribute('data-theme');
                // Add new theme class to the body element.
                document.body.classList.add(`theme-${selectedTheme}`);
                // Hide the theme modal.
                this.themeModal.classList.add('hidden');
            });
        });
    }
    
    // Method: updateDisplays
    // Updates the on-screen score and click statistics.
    updateDisplays() {
        this.scoreDisplay.textContent = this.score;
        this.humanClicksDisplay.textContent = this.humanClicks;
        this.autoClicksDisplay.textContent = this.autoClicks;
    }
    
    // Method: handleCookieClick
    // Processes a manual click on the cookie.
    handleCookieClick() {
        // Increase game score and manual click count by the current cookieValue.
        this.score += this.cookieValue;
        this.humanClicks += this.cookieValue;
        // Also add to the counter for clicks in the current second.
        this.humanClicksThisSecond += this.cookieValue;
        // Update displays to reflect the new score.
        this.updateDisplays();
        // Add a temporary CSS class for visual feedback.
        this.cookie.classList.add('clicked');
        // Remove the clicked class after a short delay (100ms).
        setTimeout(() => {
            this.cookie.classList.remove('clicked');
        }, 100);
    }
    
    // Method: startTimers
    // Starts a recurring timer every second to update CPS and grant auto-click rewards.
    startTimers() {
        setInterval(() => {
            // Calculate the total auto click value from all chains.
            let totalAuto = this.autoClickerChains.reduce((sum, chain) => sum + chain.autoValue, 0);
            // Compute CPS as the sum of auto clicks plus manual clicks recorded in this second.
            let cps = totalAuto + this.humanClicksThisSecond;
            this.cpsDisplay.textContent = cps;
            // Award auto-generated cookies if there are any.
            if (totalAuto > 0) {
                this.score += totalAuto;
                this.autoClicks += totalAuto;
                this.updateDisplays();
            }
            // Reset the manual click counter for the next interval.
            this.humanClicksThisSecond = 0;
        }, 1000);
    }
    
    // Method: renderAll
    // Invokes render on the upgrade systems to update their display.
    renderAll() {
        this.mouseUpgradeSystem.render();
        this.autoClickerChains.forEach(chain => chain.render());
    }
    
    // Method: openErrorModal
    // Displays the error modal for insufficient cookies.
    openErrorModal() {
        this.errorModal.classList.remove('hidden');
    }
}

//------------------------------
// GAME INITIALIZATION
// When the DOM is fully loaded, create a new Game instance and store it globally.
//------------------------------
document.addEventListener('DOMContentLoaded', () => {
    window.gameInstance = new Game();
});
