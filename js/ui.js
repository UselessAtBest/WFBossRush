const UI = {

  
  showIntroPopup: async function(filePath = "data/intro.html", afterLoad) {
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

      if (afterLoad && typeof afterLoad === "function") {
        afterLoad(popup);
      }
    } catch (err) {
      popup.innerHTML = "<p>Failed to load content.</p>";
      console.error(err);
    }

    requestAnimationFrame(() => {
      overlay.classList.add("show");
      popup.classList.add("show");
    });

    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        popup.classList.remove("show");
        overlay.classList.remove("show");
        setTimeout(() => overlay.remove(), 300);
      }
    });
  },

  showInfoPopup: function(message) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.style.zIndex = 9999;

    const popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = `<div class="popup-content">${message}</div>`;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("show");
      popup.classList.add("show");
    });


    overlay.addEventListener("click", e => {
      if (e.target === overlay) {
        popup.classList.remove("show");
        overlay.classList.remove("show");
        setTimeout(() => overlay.remove(), 300);
      }
    });
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


      if (btnData.sp === true) {
        btn.dataset.sp = "true";
        btn.disabled = true;
      } else {
        btn.disabled = btnData.used || false;
      }


      if (btnData.image) {
        const img = document.createElement("img");
        img.src = btnData.image;
        img.className = "button-image";
        btn.appendChild(img);
      }


      const labelDiv = document.createElement("div");
      labelDiv.className = `button-label tier-${btnData.tier || 1}-label`;
      labelDiv.innerHTML = btnData.label || "";
      btn.appendChild(labelDiv);

      const nameDiv = document.createElement("div");
      nameDiv.className = "button-name";
      nameDiv.textContent = btnData.name || "";
      btn.appendChild(nameDiv);


      btn.classList.add(`tier-${btnData.tier || 1}-btn`);


      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        btn.disabled = true;
        btnData.used = true;

        const rolledItems = [];


        const normalRolls = btnData.rolls?.poolNormal || 0;
        for (let i = 0; i < normalRolls; i++) {
          const item = Randomizer.rollPool("A", true);
          if (item) rolledItems.push(item);
        }


        const limitedRolls = btnData.rolls?.poolLimited || 0;
        for (let j = 0; j < limitedRolls; j++) {
          const item = Randomizer.rollPool("B", true);
          if (item) rolledItems.push(item);
        }

        const normalItems = rolledItems.filter(i => i.sourcePool === "A");
        const limitedItems = rolledItems.filter(i => i.sourcePool === "B");

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

        popupHTML += `<p class="click-to-close">Click outside to close</p>`;

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

        overlay.addEventListener("click", e => {
          if (e.target === overlay) {
            popup.classList.remove("show");
            overlay.classList.remove("show");
            setTimeout(() => overlay.remove(), 300);
          }
        });
      });

      grid.appendChild(btn);
    });
  }
};
