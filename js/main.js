window.addEventListener("DOMContentLoaded", async () => {
  try {
    const toggle = document.getElementById("themeToggle");
    const root = document.documentElement;

    // Theme initialization
    if (localStorage.getItem("theme") === "light") {
      root.classList.add("light-mode");
      toggle.textContent = "☀️";
    } else {
      toggle.textContent = "🌙";
    }

    toggle.addEventListener("click", () => {
      root.classList.toggle("light-mode");
      if (root.classList.contains("light-mode")) {
        toggle.textContent = "☀️";
        localStorage.setItem("theme", "light");
      } else {
        toggle.textContent = "🌙";
        localStorage.setItem("theme", "dark");
      }
    });

    await Randomizer.init();
    Inventory.init();

    // Utility to capitalize
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    // Header button roll helper
    const handleHeaderRoll = (poolName, title) => {
      const item = Randomizer.rollPool(poolName);
      if (!item) return;

      // Show popup
      const catText = item.category.map(capitalize).join(", ");
      const typeText = item.type.map(capitalize).join(", ");
      const msg = `<p class="popup-title">${title}</p>
                   <p><strong>${item.name}</strong><br>${catText} ${typeText}</p>`;
      UI.showInfoPopup(msg);

      // Add item only once
    };

    // General Pool button
    const btnBig = document.getElementById("randomBtnA");
    if (btnBig) btnBig.addEventListener("click", () => handleHeaderRoll("A", "General Pool Roll"));

    // Boss Pool button
    const btnSmall = document.getElementById("randomBtnB");
    if (btnSmall) btnSmall.addEventListener("click", () => handleHeaderRoll("B", "Boss Pool Roll"));

    // Multi-roll SP version button
    const btnMulti = document.getElementById("multiRollBtn");
    if (btnMulti) {
      btnMulti.addEventListener("click", () => {
        multiRoll(60, 30);

        // Unlock SP-only buttons after multi-roll
        const grid = document.getElementById("buttonGrid");
        const spButtons = grid.querySelectorAll("button[data-sp='true']");
        spButtons.forEach(btn => btn.disabled = false);
      });
    }

    // Multi-roll function
    const multiRoll = (countA, countB) => {
      for (let i = 0; i < countA; i++) {
        const itemA = Randomizer.rollPool("A", false, true);
        if (itemA) Inventory.addItem(itemA);
      }
      for (let j = 0; j < countB; j++) {
        const itemB = Randomizer.rollPool("B", false, true);
        if (itemB) Inventory.addItem(itemB);
      }
    };

    // Build dynamic button grid
    const buttonsData = await (await fetch("data/buttons.json")).json();
    buttonsData.forEach(b => console.log("Loaded JSON button:", b.name, b.sp));
    UI.buildButtonGrid(buttonsData);

    // Intro popup handling
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has("noIntro")) await UI.showIntroPopup("data/intro.html");

    // About button
    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
      aboutBtn.addEventListener("click", e => {
        e.preventDefault();
        UI.showIntroPopup("data/intro.html");
      });
    }

        // Faq button
        const faqBtn = document.getElementById("faqBtn");
        if (faqBtn) {
          faqBtn.addEventListener("click", e => {
            e.preventDefault();
            UI.showIntroPopup("data/faq.html");
          });
        }

        // How To button
        const howBtn = document.getElementById("howBtn");
        if (howBtn) {
          howBtn.addEventListener("click", e => {
            e.preventDefault();
            UI.showIntroPopup("data/howto.html");
          });
        }

  } catch (err) {
    console.error("Error initializing page:", err);
  }
});

