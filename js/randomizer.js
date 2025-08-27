const Randomizer = (() => {
  let poolNormal = [];
  let poolLimited = [];
  const globalItemsMap = new Map(); 

  async function init() {

    const normalData = await (await fetch("data/poolNormal.json")).json();
    const limitedData = await (await fetch("data/poolLimited.json")).json();

    const allItems = [...normalData, ...limitedData];

    allItems.forEach(item => {
      const name = item.name.trim();
      if (!globalItemsMap.has(name)) {
        globalItemsMap.set(name, { ...item, _remaining: item.rerolls ?? Infinity });
      }
    });

    poolNormal = normalData.map(item => globalItemsMap.get(item.name.trim()));
    poolLimited = limitedData.map(item => globalItemsMap.get(item.name.trim()));
  }

  function refundRoll(item) {
    const globalItem = globalItemsMap.get(item.name.trim());
    if (globalItem) globalItem._remaining++;
  }

  function rollPool(type, silent = false) {
    const pool = type === "A" ? poolNormal : poolLimited;

    const available = pool.filter(i => i._remaining > 0);
    if (available.length === 0) return null;

    const item = available[Math.floor(Math.random() * available.length)];

    item._remaining--;

    const rolledItem = { ...item, sourcePool: type };
    Inventory.addItem(rolledItem);

    if (!silent) {
      const msg = `<strong>${rolledItem.name}</strong><br>${rolledItem.category?.map(c => capitalize(c)).join(", ") || ""}`;
      UI.showInfoPopup(msg);
    }

    return rolledItem;
  }

  function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return { init, refundRoll, rollPool };
})();
