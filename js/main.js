window.addEventListener("DOMContentLoaded", async () => {
    try {
      // Load buttons.json and build grid
      const buttonsData = await (await fetch("data/buttons.json")).json();
      UI.buildButtonGrid(buttonsData);
  
      // Initialize randomizer and inventory
      await Randomizer.init(); // make sure Randomizer.js exists
      Inventory.init();        // make sure inventory.js exists
  
      // Load intro popup text
      const intro = await (await fetch("data/intro.json")).json();
      UI.showPopup(intro.message);
  
    } catch (err) {
      console.error("Error initializing page:", err);
    }
  });
  