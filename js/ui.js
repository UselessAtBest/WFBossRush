// Define a global UI object
const UI = {
    // Show intro popup
    showPopup: function(text) {
      const overlay = document.getElementById("popupOverlay");
      const content = document.getElementById("introPopup");
      content.textContent = text;
      overlay.style.display = "flex";
  
      overlay.addEventListener("click", function hide() {
        overlay.style.display = "none";
        overlay.removeEventListener("click", hide);
      });
    },
  
    // Show temporary info popup for rolls
    showInfoPopup: function(text) {
      const popup = document.createElement("div");
      popup.className = "roll-popup";
      popup.textContent = text;
      document.body.appendChild(popup);
  
      setTimeout(() => {
        popup.classList.add("fade-out");
        setTimeout(() => popup.remove(), 500);
      }, 2000);
    },
  
    // Build the button grid
    buildButtonGrid: function(buttonsData) {
      const grid = document.getElementById("buttonGrid");
      grid.innerHTML = "";
  
      const total = buttonsData.length;
      const cols = Math.ceil(Math.sqrt(total));
      const rows = Math.ceil(total / cols);
  
      grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      grid.style.gridTemplateRows = `repeat(${rows}, auto)`;
  
      buttonsData.forEach(btnData => {
        const btn = document.createElement("button");
        btn.textContent = btnData.label;
        btn.disabled = btnData.used || false;
  
        btn.addEventListener("click", () => {
          if (btn.disabled) return;
          btn.disabled = true;
          btnData.used = true;
  
          Randomizer.addRolls(btnData.rolls); // make sure Randomizer exists
          UI.showInfoPopup(`${btnData.label}\n${btnData.text || ''}`);
        });
  
        grid.appendChild(btn);
      });
    }
  };
  