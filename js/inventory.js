const Inventory = (() => {
  let items = [];
  let currentCategory = "all";
  let currentSubtab = null; 
  let previousItemsCount = 0; // Tracks already-rendered items for animation

  const subtabOptions = {
    warframe: ["warframe", "mods"],
    primary: ["weapons", "mods"],
    secondary: ["weapons", "mods"],
    melee: ["weapons", "mods"],
    all: ["warframe", "weapons", "mods"] 
  };

  function init() {
    // Main tabs
    document.querySelectorAll("#mainTabs button").forEach(btn => {
      btn.addEventListener("click", () => {
        currentCategory = "all";
        currentSubtab = null;
        setActive("#mainTabs", btn);
        clearActive("#categoryTabs");
        buildSubtabs();
        render();
      });
    });

    // Category tabs
    document.querySelectorAll("#categoryTabs button").forEach(btn => {
      btn.addEventListener("click", () => {
        currentCategory = btn.dataset.tab;
        currentSubtab = null;
        setActive("#categoryTabs", btn);
        clearActive("#mainTabs");
        buildSubtabs();
        render();
      });
    });

    // Default state
    setActive("#mainTabs", document.querySelector("#mainTabs button[data-tab='all']"));
    buildSubtabs();
    render();
  }

  function buildSubtabs() {
    const subtabContainer = document.getElementById("subTabs");
    subtabContainer.innerHTML = "";

    const group = currentCategory === "all" ? "all" : currentCategory;
    subtabOptions[group].forEach(option => {
      const btn = document.createElement("button");
      btn.textContent = capitalize(option);
      btn.dataset.subtab = option;
      btn.addEventListener("click", () => {
        currentSubtab = option;
        setActive("#subTabs", btn);
        render();
      });
      subtabContainer.appendChild(btn);
    });
    currentSubtab = null;
    clearActive("#subTabs");
  }

  function setActive(groupSelector, activeBtn) {
    document.querySelectorAll(`${groupSelector} button`).forEach(b => b.classList.remove("active"));
    if (activeBtn) activeBtn.classList.add("active");
  }

  function clearActive(groupSelector) {
    document.querySelectorAll(`${groupSelector} button`).forEach(b => b.classList.remove("active"));
  }

  function addItem(item) {
    if (!Array.isArray(item.category)) item.category = [item.category];
    if (!Array.isArray(item.type)) item.type = [item.type];

    items.push(item);
    render([item]); // Pass only the newly added item for animation
  }

  function refundItem(item) {
    items = items.filter(i => i !== item);

    Randomizer.refundRoll(item);

    const rerolled = Randomizer.rollPool(item.sourcePool, true);

    if (rerolled) {
      const catText = rerolled.category?.map(c => capitalize(c)).join(" ") || "";
      const typeText = rerolled.type?.map(t => capitalize(t)).join(" ") || "";

      const msg = `<p class="popup-title">You Rerolled:</p>
                   <p><strong>${rerolled.name}</strong><br>${catText} ${typeText}</p>`;
      UI.showInfoPopup(msg);
      addItem(rerolled); // Add rerolled item to inventory with animation
    }

    render();
  }

  function render(newItems = []) {
    const list = document.getElementById("inventoryList");

    // Clear list only if rendering full inventory
    if (newItems.length === 0) {
      list.innerHTML = "";
    }

    let filtered = [...items];

    if (currentCategory !== "all") {
      filtered = filtered.filter(i =>
        i.category.map(c => c.toLowerCase()).includes(currentCategory) ||
        i.category.map(c => c.toLowerCase()).includes("all")
      );
    }

    if (currentSubtab) {
      filtered = filtered.filter(i =>
        i.type.map(t => t.toLowerCase()).includes(currentSubtab)
      );
    }

    if (filtered.length === 0) {
      list.innerHTML = '<div class="empty-message">No items yet.</div>';
      return;
    }

    // Append only new items if provided
    const itemsToRender = newItems.length ? newItems : filtered;
    itemsToRender.forEach((i, index) => {
      const div = document.createElement("div");
      div.className = "inventory-item";
      div.style.opacity = 0;
      div.style.transform = "translateX(30px)";
      div.style.transition = "all 0.4s ease";

      const shownCategory = i.displayCategory || i.category.join(", ").split(", ").map(capitalize).join(", ");
      const shownType = i.displayType || i.type.join(", ").split(", ").map(capitalize).join(", ");

      let details = shownCategory;
      if (!shownType.toLowerCase().includes(shownCategory.toLowerCase())) {
        details += `, ${shownType}`;
      }

      const span = document.createElement("span");
      span.textContent = `${i.name} (${details})`;

      const btn = document.createElement("button");
      btn.className = "refund-btn";
      btn.textContent = "↩ Refund";
      btn.addEventListener("click", () => refundItem(i));

      div.appendChild(span);
      div.appendChild(btn);
      list.appendChild(div);

      // Animate in with stagger
      setTimeout(() => {
        div.style.opacity = 1;
        div.style.transform = "translateX(0)";
      }, index * 100);
    });

    // Update previous items count
    previousItemsCount = list.children.length;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return { init, addItem };
})();
