const Inventory = {
  items: [],

  // Initialize inventory from localStorage
  init: function() {
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

  // Save current inventory to localStorage
  save: function() {
    try {
      localStorage.setItem("inventory", JSON.stringify(this.items));
    } catch (err) {
      console.error("Failed to save inventory:", err);
    }
  },

  // Add a new item
  addItem: function(item) {
    if (!item || !item.name) return;

    // Prevent duplicates
    const exists = this.items.find(i => i.name === item.name && i.sourcePool === item.sourcePool);
    if (exists) return;

    this.items.push(item);
    this.save();
    this.render();
  },

  // Remove an item by index
  removeItem: function(index) {
    if (index < 0 || index >= this.items.length) return;
    this.items.splice(index, 1);
    this.save();
    this.render();
  },

  // Refund / re-enable an item (optional)
  refundItem: function(index) {
    if (index < 0 || index >= this.items.length) return;
    this.items.splice(index, 1); // remove refunded item
    this.save();
    this.render();
  },

  // Clear all inventory
  clear: function() {
    this.items = [];
    this.save();
    this.render();
  },

  // Render the inventory DOM
  render: function() {
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
      content.innerHTML = `<span>${item.name} (${item.category || "N/A"})</span>`;

      const buttons = document.createElement("div");
      buttons.className = "inventory-btns";

      const refundBtn = document.createElement("button");
      refundBtn.className = "refund-btn";
      refundBtn.textContent = "↺";
      refundBtn.title = "Refund / Remove item";
      refundBtn.addEventListener("click", () => this.refundItem(index));

      const removeBtn = document.createElement("button");
      removeBtn.className = "remove-btn";
      removeBtn.textContent = "✖";
      removeBtn.title = "Remove item";
      removeBtn.addEventListener("click", () => this.removeItem(index));

      buttons.appendChild(refundBtn);
      buttons.appendChild(removeBtn);

      content.appendChild(buttons);
      div.appendChild(content);
      list.appendChild(div);
    });
  }
};

// Auto-init on page load
document.addEventListener("DOMContentLoaded", () => Inventory.init());
