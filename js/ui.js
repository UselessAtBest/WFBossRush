const UI = {
  showIntroPopup: async function(filePath = "data/intro.html") {
    const overlay = document.createElement("div");
    overlay.id = "introOverlay";
    overlay.className = "popup-overlay";
    overlay.style.zIndex = 9999;

    const popup = document.createElement("div");
    popup.id = "introPopup";
    popup.className = "popup";
    popup.innerHTML = "Loading...";
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    try {
      const response = await fetch(filePath);
      const html = await response.text();
      popup.innerHTML = html;
    } catch (err) {
      popup.innerHTML = "<p>Failed to load intro content.</p>";
      console.error(err);
    }

    requestAnimationFrame(() => {
      overlay.classList.add("show");
      popup.classList.add("show");
    });

    overlay.addEventListener("click", () => {
      popup.classList.remove("show");
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    });
  },

  showInfoPopup: function(message) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.style.zIndex = 9999;

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `
      <div class="popup-content">
        ${message}
      </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("show");
      popup.classList.add("show");
    });

    const close = () => {
      popup.classList.remove("show");
      overlay.classList.remove("show");
      setTimeout(() => overlay.remove(), 300);
    };

    popup.querySelector(".popup-content").addEventListener("click", close);
    overlay.addEventListener("click", close);
  },

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

      const nameDiv = document.createElement("div");
      nameDiv.className = "button-name";
      nameDiv.textContent = btnData.name || "";

      const labelDiv = document.createElement("div");
      labelDiv.className = `button-label tier-${btnData.tier || 1}-label`;
      labelDiv.innerHTML = btnData.label;

      btn.appendChild(nameDiv);
      btn.appendChild(labelDiv);

      btn.classList.add(`tier-${btnData.tier || 1}-btn`);
      btn.disabled = btnData.used || false;

      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btnData.used = true;

        const normalRolls = btnData.rolls?.poolNormal || 0;
        const limitedRolls = btnData.rolls?.poolLimited || 0;

        const rolledItems = [];

        for (let i = 0; i < normalRolls; i++) {
          const item = Randomizer.rollPool("A", true); 
          if (item) rolledItems.push(item);
        }

        for (let i = 0; i < limitedRolls; i++) {
          const item = Randomizer.rollPool("B", true); 
          if (item) rolledItems.push(item);
        }

let normalItems = rolledItems.filter(i => i.sourcePool === "A");
let limitedItems = rolledItems.filter(i => i.sourcePool === "B");

let popupHTML = btnData.popupMessage ? `<p>${btnData.popupMessage}</p>` : "";

if (rolledItems.length) {
  popupHTML += `<p class="popup-title">You Unlocked:</p>`;

  if (normalItems.length) {
    popupHTML += `<p><strong>General Pool:</strong></p><ul class="roll-list">`; 
    normalItems.forEach(i => {
      popupHTML += `<li>${i.name} (${i.category || ""})</li>`;
    });
    popupHTML += `</ul>`;
  }

  if (limitedItems.length) {
    popupHTML += `<hr class="roll-separator">`;
    popupHTML += `<p><strong>Boss Pool:</strong></p><ul class="roll-list">`;   
    limitedItems.forEach(i => {
      popupHTML += `<li>${i.name} (${i.category || ""})</li>`;
    });
    popupHTML += `</ul>`;
  }
}

popupHTML += `<p class="click-to-close">Click to close</p>`;

const overlay = document.createElement("div");
overlay.className = "popup-overlay";
overlay.style.zIndex = 9999;

const popup = document.createElement("div");
popup.className = `popup multi-roll-popup tier-${btnData.tier}-popup`;
popup.innerHTML = `<div class="popup-content">${popupHTML}</div>`;

overlay.appendChild(popup);
document.body.appendChild(overlay);

requestAnimationFrame(() => {
  overlay.classList.add("show");
  popup.classList.add("show");
});

const close = () => {
  popup.classList.remove("show");
  overlay.classList.remove("show");
  setTimeout(() => overlay.remove(), 300);
};

popup.querySelector(".popup-content").addEventListener("click", close);
overlay.addEventListener("click", close);

        overlay.addEventListener("click", close);
      });

      grid.appendChild(btn);
    });
  },
};

