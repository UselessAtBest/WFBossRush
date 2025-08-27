window.addEventListener("DOMContentLoaded", async () => {
  try {
    // 1️⃣ Theme toggle setup
    const toggle = document.getElementById("themeToggle");
    const root = document.documentElement;

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

    // 2️⃣ Load buttons.json and build grid
    const buttonsData = await (await fetch("data/buttons.json")).json();
    UI.buildButtonGrid(buttonsData);

    // 3️⃣ Initialize randomizer and inventory
    await Randomizer.init();
    Inventory.init();

    // 4️⃣ Load intro HTML popup and show it
    await UI.showIntroPopup("/data/intro.html");

    // 5️⃣ About button triggers the intro popup
    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
      aboutBtn.addEventListener("click", () => {
        UI.showIntroPopup("/data/intro.html");
      });
    }

  } catch (err) {
    console.error("Error initializing page:", err);
  }
});
