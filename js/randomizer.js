const Randomizer = (() => {
    let rollsA = 0;
    let rollsB = 0;
    let poolA = [];
    let poolB = [];
  
    async function init() {
      poolA = await (await fetch("data/poolA.json")).json();
      poolB = await (await fetch("data/poolB.json")).json();
  
      document.getElementById("randomBtnA").addEventListener("click", () => roll(poolA, "A"));
      document.getElementById("randomBtnB").addEventListener("click", () => roll(poolB, "B"));
    }
  
    function addRolls({ poolA = 0, poolB = 0 }) {
      rollsA += poolA;
      rollsB += poolB;
      updateLabels();
    }
  
    function updateLabels() {
      document.getElementById("randomBtnA").textContent = `🎲 Big Pool (${rollsA})`;
      document.getElementById("randomBtnB").textContent = `🎲 Small Pool (${rollsB})`;
    }
  
    function roll(pool, type) {
      if (type === "A" && rollsA <= 0) return;
      if (type === "B" && rollsB <= 0) return;
  
      const item = pool[Math.floor(Math.random() * pool.length)];
      if (type === "A") rollsA--; else rollsB--;
      updateLabels();
      Inventory.addItem(item);
      showRollPopup(item);
    }
  
    function showRollPopup(item) {
      const popup = document.createElement("div");
      popup.className = "roll-popup";
      popup.innerHTML = `<strong>You Rolled ${item.name}</strong><br>${capitalize(item.category)}`;
      document.body.appendChild(popup);
  
      setTimeout(() => {
        popup.classList.add("fade-out");
        setTimeout(() => popup.remove(), 500);
      }, 2000);
    }
  
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    return { init, addRolls };
  })();
  