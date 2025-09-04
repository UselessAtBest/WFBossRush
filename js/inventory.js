const Inventory = {
  items: [],

  init: function () {
    const saved = localStorage.getItem("inventory");
    if (saved) {
      try {
        this.items = JSON.parse(saved);
      } catch (err) {
        console.error("Failed to load inventory:", err);
        this.items = [];
      }
    } else {
      this.items = [];
    }
    this.render();
  },

  save: function () {
    try {
      localStorage.setItem("inventory", JSON.stringify(this.items));
    } catch (err) {
      console.error("Failed to save inventory:", err);
    }
  },


  addItem: function (item) {
    if (!item || !item.name) return;

    const exists = this.items.find(
      (i) => i.name === item.name && i.sourcePool === item.sourcePool
    );
    if (exists) return;

    this.items.push(item);
    this.save();
    this.render();
  },


  removeItem: function (index) {
    if (index < 0 || index >= this.items.length) return;
    this.items.splice(index, 1);
    this.save();
    this.render();
  },


  rerollItem: function (index) {
    if (index < 0 || index >= this.items.length) return;

    const original = this.items[index];
    const sourcePool = original?.sourcePool || "A"; 
    this.items.splice(index, 1);
    this.save();
    this.render();

    let newItem = null;
    try {
      newItem = Randomizer.rollPool(sourcePool, true);
    } catch (err) {
      console.error("Reroll failed:", err);
    }

    if (newItem) {
      this.addItem(newItem);

      const cat =
        Array.isArray(newItem.category)
          ? newItem.category.join(", ")
          : (newItem.category || "");
      const type =
        Array.isArray(newItem.type)
          ? newItem.type.join(", ")
          : (newItem.type || "");

      const title =
        sourcePool === "B" ? "Rerolled (Boss Pool)" : "Rerolled (General Pool)";
      const html = `
        <p class="popup-title">${title}</p>
        <p><strong>${newItem.name}</strong><br>${cat} ${type}</p>
      `;
      if (typeof UI?.showInfoPopup === "function") {
        UI.showInfoPopup(html);
      }
    } else {
      if (typeof UI?.showInfoPopup === "function") {
        UI.showInfoPopup(
          `<p class="popup-title">Reroll</p><p>No item available from pool ${sourcePool}.</p>`
        );
      }
    }
  },

  clear: function () {
    this.items = [];
    this.save();
    this.render();
  },

  render: function () {
    const list = document.getElementById("inventoryList");
    if (!list) return;

    list.innerHTML = "";

    if (this.items.length === 0) {
      list.innerHTML = '<div class="empty-message">Inventory is empty.</div>';
      return;
    }

    this.items.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "inventory-item";

      const content = document.createElement("div");
      content.className = "inventory-content";

      const catText = Array.isArray(item.category)
        ? item.category.join(", ")
        : (item.category || "N/A");
      content.innerHTML = `<span>${item.name} (${catText})</span>`;

      const buttons = document.createElement("div");
      buttons.className = "inventory-btns";

      const rerollBtn = document.createElement("button");
      rerollBtn.className = "refund-btn reroll-btn";
      rerollBtn.textContent = "↺";
      rerollBtn.title = "Reroll (remove this item and get a new one from the same pool)";
      rerollBtn.addEventListener("click", () => this.rerollItem(index));

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "✖";
      removeBtn.title = "Remove item";
      removeBtn.addEventListener("click", () => this.removeItem(index));

      buttons.appendChild(rerollBtn);
      buttons.appendChild(removeBtn);

      content.appendChild(buttons);
      div.appendChild(content);
      list.appendChild(div);
    });
  }
};

// Auto-init on page load
document.addEventListener("DOMContentLoaded", () => Inventory.init());
