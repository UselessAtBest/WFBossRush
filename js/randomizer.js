const Randomizer = (() => {
    let rollsA = 0;
    let rollsB = 0;
    let poolNormal = [];
    let poolLimited = [];
  
    async function init() {
      poolNormal = await (await fetch("data/poolNormal.json")).json();
      poolLimited = await (await fetch("data/poolLimited.json")).json();
  
      // Attach remaining reroll counts to each item
      poolNormal.forEach(i => {
        if (i.rerolls === undefined) i.rerolls = Infinity; // default: unlimited
        i._remaining = i.rerolls;
      });
      poolLimited.forEach(i => {
        if (i.rerolls === undefined) i.rerolls = Infinity;
        i._remaining = i.rerolls;
      });
  
      document.getElementById("randomBtnA").addEventListener("click", () => roll(poolNormal, "A"));
      document.getElementById("randomBtnB").addEventListener("click", () => roll(poolLimited, "B"));
    }
  
    function addRolls({ poolNormal = 0, poolLimited = 0 }) {
      rollsA += poolNormal;
      rollsB += poolLimited;
      updateLabels();
    }
  
    function refundRoll(item) {
      // Refund roll back to correct pool
      if (item.sourcePool === "A") {
        rollsA++;
        // restore item back into pool
        const poolItem = poolNormal.find(i => i.name === item.name);
        if (poolItem) poolItem._remaining++;
      } else if (item.sourcePool === "B") {
        rollsB++;
        const poolItem = poolLimited.find(i => i.name === item.name);
        if (poolItem) poolItem._remaining++;
      }
      updateLabels();
    }
  
    function updateLabels() {
      document.getElementById("randomBtnA").textContent = `🎲 Big Pool (${rollsA})`;
      document.getElementById("randomBtnB").textContent = `🎲 Small Pool (${rollsB})`;
    }
  
    function roll(pool, type) {
      if (type === "A" && rollsA <= 0) return;
      if (type === "B" && rollsB <= 0) return;
  
      // filter out exhausted items
      const available = pool.filter(i => i._remaining > 0);
      if (available.length === 0) {
        alert("No more items available in this pool!");
        return;
      }
  
      // pick random available item
      const item = available[Math.floor(Math.random() * available.length)];
      item._remaining--; // consume one reroll
  
      if (type === "A") rollsA--; else rollsB--;
      updateLabels();
  
      // Attach source pool for refunds
      const rolledItem = { ...item, sourcePool: type };
      Inventory.addItem(rolledItem);
  
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
  
    return { init, addRolls, refundRoll };
  })();
  