// Define a global UI object
const UI = {
  // ================= Intro Popup (on page load) =================
  showIntroPopup: async function(filePath = "data/intro.html") {
    const overlay = document.createElement("div");
    overlay.id = "introOverlay";
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.id = "introPopup";
    popup.className = "popup";
    popup.innerHTML = "Loading...";
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Load intro HTML
    try {
      const response = await fetch(filePath);
      const html = await response.text();
      popup.innerHTML = html;
    } catch (err) {
      popup.innerHTML = "<p>Failed to load intro content.</p>";
      console.error(err);
    }

    // Show with fade + scale
    requestAnimationFrame(() => {
      overlay.classList.add("show");
      popup.classList.add("show");
    });

    // Close on click anywhere on overlay
    overlay.addEventListener("click", () => {
      popup.classList.remove("show");
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    });
  },

  // ================= Button Popups =================
  showButtonPopup: function(htmlText, tier = 1) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
  
    const popup = document.createElement("div");
    popup.className = `popup tier-${tier}-popup`;
    popup.innerHTML = htmlText;
  
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  
    requestAnimationFrame(() => {
      overlay.classList.add("show");
      popup.classList.add("show");
    });
  
    // Auto-hide after 2 seconds
    setTimeout(() => {
      popup.classList.remove("show");
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    }, 2000);
  
    // Close immediately if clicked
    overlay.addEventListener("click", () => {
      popup.classList.remove("show");
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    });
  },
  

  // ================= Build Button Grid =================
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
  
      // Separate name and label into two lines
      const nameDiv = document.createElement("div");
      nameDiv.className = "button-name";
      nameDiv.textContent = btnData.name || "";
  
      const labelDiv = document.createElement("div");
      labelDiv.className = `button-label tier-${btnData.tier || 1}-label`;
      labelDiv.innerHTML = btnData.label;
  
      btn.appendChild(nameDiv);
      btn.appendChild(labelDiv);
  
      // Add button tier class
      btn.classList.add(`tier-${btnData.tier || 1}-btn`);
      btn.disabled = btnData.used || false;
  
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btnData.used = true;
  
        // Add rolls
        Randomizer.addRolls(btnData.rolls);
  
        // Create dynamic popup message
        const normal = btnData.rolls.poolNormal || 0;
        const boss = btnData.rolls.poolLimited || 0;
        const popupText = `
          <p>${btnData.popupMessage || ""}</p>
          <p>You have received <strong>${normal}</strong> Normal Rolls and <strong>${boss}</strong> Boss Rolls</p>
        `;
  
        UI.showButtonPopup(popupText, btnData.tier);
      });
  
      grid.appendChild(btn);
    });
  },
  
};

// ================= About Button (if exists) =================

const aboutBtn = document.getElementById("aboutBtn");
if (aboutBtn) {
  aboutBtn.addEventListener("click", () => {
    UI.showIntroPopup("/data/intro.html");
  });
}