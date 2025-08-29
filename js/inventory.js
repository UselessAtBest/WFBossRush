const Inventory = (() => {
  let items = [];
  let currentCategory = "all";
  let currentSubtab = null;

  const subtabOptions = {
    warframe: ["warframe", "mods"],
    primary: ["weapons", "mods"],
    secondary: ["weapons", "mods"],
    melee: ["weapons", "mods"],
    all: ["warframe", "weapons", "mods"]
  };

  function init() {
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

    item._id = crypto.randomUUID();
    items.push(item);
    render([item]); 
  }

  function refundItem(item) {
    // Remove old item
    items = items.filter(i => i._id !== item._id);
  
    // Don't call Randomizer.refundRoll here, it shows a popup we don't want
  
    // Roll new item
    const rerolled = Randomizer.rollPool(item.sourcePool, true);
  
    if (rerolled) {
      rerolled._id = crypto.randomUUID();
      items.push(rerolled);
  
      const catText = rerolled.category.map(capitalize).join(" ");
      const typeText = rerolled.type.map(capitalize).join(" ");
      const msg = `<p class="popup-title">You Rerolled:</p>
                   <p><strong>${rerolled.name}</strong><br>${catText} ${typeText}</p>`;
      UI.showInfoPopup(msg);
    }
  
    render();
  }
  

  function render(newItems = []) {
    const list = document.getElementById("inventoryList");

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

    const itemsToRender = newItems.length ? newItems : filtered;

    itemsToRender.forEach((i, index) => {
      if (document.querySelector(`[data-id="${i._id}"]`)) return;

      const div = document.createElement("div");
      div.className = "inventory-item";
      div.dataset.id = i._id;
      div.style.opacity = 0;
      div.style.transform = "translateX(30px)";
      div.style.transition = "all 0.15s ease";

      const content = document.createElement("div");
      content.className = "inventory-content";

      const shownCategory = i.displayCategory || i.category.join(", ").split(",").map(capitalize).join(", ");
      const shownType = i.displayType || i.type.join(",").split(",").map(capitalize).join(", ");

      let details = shownCategory;
      if (!shownType.toLowerCase().includes(shownCategory.toLowerCase())) {
        details += `, ${shownType}`;
      }

      const span = document.createElement("span");
      span.textContent = `${i.name} (${details})`;
      content.appendChild(span);

      const btnContainer = document.createElement("div");
      btnContainer.className = "inventory-btns";

      const btnRefund = document.createElement("button");
      btnRefund.className = "refund-btn";
      btnRefund.textContent = "↩ Reroll";
      btnRefund.addEventListener("click", () => refundItem(i));

      const btnRemove = document.createElement("button");
      btnRemove.className = "remove-btn";
      btnRemove.textContent = "✖";
      btnRemove.addEventListener("click", () => {
        items = items.filter(x => x._id !== i._id);
        // Don't call Randomizer.refundRoll here either
        render();
      });

      btnContainer.appendChild(btnRefund);
      btnContainer.appendChild(btnRemove);

      content.appendChild(btnContainer);
      div.appendChild(content);
      list.appendChild(div);

      setTimeout(() => {
        div.style.opacity = 1;
        div.style.transform = "translateX(0)";
      }, index * 50); 
    });
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return { init, addItem };
})();
