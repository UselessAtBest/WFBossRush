const Inventory = (() => {
    let items = [];
    let currentMain = "all";
    let currentCategory = "all";
    let currentSubtab = "weapons";
  
    const subtabOptions = {
      warframe: ["warframe", "mods"],
      primary: ["weapons", "mods"],
      secondary: ["weapons", "mods"],
      melee: ["weapons", "mods"],
      all: ["weapons", "mods"] // default for All view
    };
  
    function init() {
      // Main tab (All)
      document.querySelectorAll("#mainTabs button").forEach(btn => {
        btn.addEventListener("click", () => {
          currentMain = btn.dataset.tab;
          currentCategory = "all"; // reset category
          setActive("#mainTabs", btn);
          buildSubtabs();
          render();
        });
      });
  
      // Category tabs (warframe/Primary/etc.)
      document.querySelectorAll("#categoryTabs button").forEach(btn => {
        btn.addEventListener("click", () => {
          currentCategory = btn.dataset.tab;
          setActive("#categoryTabs", btn);
          buildSubtabs();
          render();
        });
      });
  
      // Default state
      setActive("#mainTabs", document.querySelector("#mainTabs button[data-tab='all']"));
      buildSubtabs();
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
      currentSubtab = subtabOptions[group][0];
      setActive("#subTabs", subtabContainer.querySelector("button"));
    }
  
    function setActive(groupSelector, activeBtn) {
      document.querySelectorAll(`${groupSelector} button`).forEach(b => b.classList.remove("active"));
      activeBtn.classList.add("active");
    }
  
    function addItem(item) {
      items.push(item);
      render();
    }
  
    function render() {
      const list = document.getElementById("inventoryList");
      list.innerHTML = "";
  
      let filtered = [...items];
  
      // Filter by category
      if (currentCategory !== "all") {
        filtered = filtered.filter(i => i.category.toLowerCase() === currentCategory);
      }
  
      // Filter by subtab
      if (currentSubtab) {
        filtered = filtered.filter(i =>
          i.type.toLowerCase() === currentSubtab || i.category.toLowerCase() === currentSubtab
        );
      }
  
      if (filtered.length === 0) {
        list.innerHTML = "<div>No items yet.</div>";
        return;
      }
  
      filtered.forEach(i => {
        const div = document.createElement("div");
        div.textContent = `${i.name} (${capitalize(i.category)}, ${capitalize(i.type)})`;
        list.appendChild(div);
      });
    }
  
    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  
    return { init, addItem };
  })();
  