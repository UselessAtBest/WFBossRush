(async () => {
  const container = document.getElementById("leaderboardContainer");

  // 1️⃣ Load the manifest with cache-busting
  let manifest;
  try {
    const timestamp = Date.now();
    manifest = await (await fetch(`./manifest.json?_=${timestamp}`)).json();
  } catch (err) {
    console.error("Failed to load manifest.json", err);
    container.innerHTML = "<p>Failed to load leaderboard manifest.</p>";
    return;
  }

  // 2️⃣ Loop through categories
  for (const cat of manifest.categories) {
    const column = document.createElement("div");
    column.className = "category-column";
    column.innerHTML = `<h2>${cat.displayName}</h2>`;

    const runs = [];

    // 3️⃣ Load each run listed in the manifest for this category
    for (const runFile of cat.runs) {
      const filePath = `${cat.folder}/${runFile}`;
      try {
        const timestamp = Date.now(); // cache-busting per file
        const res = await fetch(`${filePath}?_=${timestamp}`);
        if (!res.ok) continue;
        const data = await res.json();
        runs.push(data);
      } catch (e) {
        console.warn(`Failed to load ${filePath}`, e);
      }
    }

    // 4️⃣ Sort runs by time ascending
    runs.sort((a, b) => {
      const t1 = a.time.split("-").map(Number);
      const t2 = b.time.split("-").map(Number);
      return t1[0] * 60 + t1[1] - (t2[0] * 60 + t2[1]);
    });

    // 5️⃣ Render each run
    runs.forEach((entry, idx) => {
      const div = document.createElement("div");
      div.className = "entry";

      // Ranking classes
      let rankClass = "";
      const rankNumber = idx + 1;
      if (idx === 0) rankClass = "gold";
      else if (idx === 1) rankClass = "silver";
      else if (idx === 2) rankClass = "bronze";

      // Player line
      const playerLine = entry.name
        ? `<div class="player-line">
             <span class="player-name">${entry.name}</span>
             ${entry.time && entry.time.toLowerCase() !== "n/a" ? `<span class="player-time">${entry.time.replace("-", ":")}</span>` : ""}
           </div>`
        : "";

      // Video line
      const videoLine =
        entry.video && entry.video.toLowerCase() !== "n/a"
          ? `<div class="video-line">
               <a href="${entry.video}" target="_blank">Watch The Run Here!</a>
             </div>`
          : "";

      // Socials
      let socialLinksHTML = "";
      if (entry.socials) {
        socialLinksHTML = Object.keys(entry.socials)
          .filter((key) => !key.toLowerCase().includes("_display") && entry.socials[key].toLowerCase() !== "n/a")
          .map((key) => {
            const displayName = entry.socials[key + "_Display"] || key;
            return `<a href="${entry.socials[key]}" target="_blank">${displayName}</a>`;
          })
          .join(" | ");
      }
      const socialsLine = socialLinksHTML ? `<div class="socials-line">${socialLinksHTML}</div>` : "";

      div.innerHTML = `
        <div class="rank ${rankClass}">${rankNumber}</div>
        <div class="entry-content">
          ${playerLine}
          ${videoLine}
          ${socialsLine}
        </div>
      `;

      column.appendChild(div);
    });

    container.appendChild(column);
  }
})();
