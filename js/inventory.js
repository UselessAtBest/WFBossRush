const Inventory = (() => {
  let items = [];
  let currentCategory = "all";
  let currentSubtab = null; // null = show all in the current category

  const subtabOptions = {
    warframe: ["warframe", "mods"],
    primary: ["weapons", "mods"],
    secondary: ["weapons", "mods"],
    melee: ["weapons", "mods"],
    all: ["warframe", "weapons", "mods"] // default for All view
  };

  function init() {
    // Main tab (All)
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

    // Category tabs (2nd row)
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

    // Default subtab
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
    // Ensure category and type are arrays
    if (!Array.isArray(item.category)) item.category = [item.category];
    if (!Array.isArray(item.type)) item.type = [item.type];

    items.push(item);
    render();
  }

  function refundItem(item) {
    items = items.filter(i => i !== item);
    Randomizer.refundRoll(item);
    render();
  }

  function render() {
    const list = document.getElementById("inventoryList");
    list.innerHTML = "";

    let filtered = [...items];

    // Filter by main category if not "all"
    if (currentCategory !== "all") {
      filtered = filtered.filter(i =>
        i.category.map(c => c.toLowerCase()).includes(currentCategory) ||
        i.category.map(c => c.toLowerCase()).includes("all")
      );
    }

    // Filter by subtab if a subtab is selected
    if (currentSubtab) {
      filtered = filtered.filter(i =>
        i.type.map(t => t.toLowerCase()).includes(currentSubtab)
      );
    }

    if (filtered.length === 0) {
      list.innerHTML = '<div class="empty-message">No items yet.</div>';
      return;
    }

    filtered.forEach(i => {
      const div = document.createElement("div");
      div.className = "inventory-item";

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
    });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return { init, addItem };
})();
