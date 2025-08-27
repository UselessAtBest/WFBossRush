window.addEventListener("DOMContentLoaded", async () => {
  try {
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

    await Randomizer.init();
    Inventory.init();

    const btnBig = document.getElementById("randomBtnA");
    if (btnBig) btnBig.addEventListener("click", () => Randomizer.rollPool("A"));

    const btnSmall = document.getElementById("randomBtnB");
    if (btnSmall) btnSmall.addEventListener("click", () => Randomizer.rollPool("B"));

    const buttonsData = await (await fetch("data/buttons.json")).json();
    UI.buildButtonGrid(buttonsData);

    const urlParams = new URLSearchParams(window.location.search);
    const skipIntro = urlParams.has("noIntro");

    if (!skipIntro) {
      await UI.showIntroPopup("data/intro.html");
    }

    const aboutBtn = document.getElementById("aboutBtn");
    if (aboutBtn) {
      aboutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        UI.showIntroPopup("data/intro.html");
      });
    }
  } catch (err) {
    console.error("Error initializing page:", err);
  }
});
