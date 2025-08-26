(async () => {
  const container = document.getElementById("leaderboardContainer");

  const categoryFolders = [
    { folder: "/WFBossRush/leaderboard/category1/", displayName: "Normal Mode" },
    { folder: "/WFBossRush/leaderboard/category2/", displayName: "SP Hard Mode" },
    { folder: "/WFBossRush/leaderboard/category3/", displayName: "Sliv Mode" }
  ];

  for (const cat of categoryFolders) {
    const column = document.createElement("div");
    column.className = "category-column";
    column.innerHTML = `<h2>${cat.displayName}</h2>`;

    const runs = [];

    for (let i = 1; i <= 99; i++) {
      const fileName = `${cat.folder}/run${i.toString().padStart(2,"0")}.json`;
      try {
        const res = await fetch(fileName);
        if (!res.ok) continue;
        const data = await res.json();
        runs.push(data);
      } catch(e) {
        console.warn(`Failed to load ${fileName}`, e);
      }
    }

    // Sort by time ascending (minutes:seconds)
    runs.sort((a, b) => {
      const t1 = a.time.split("-").map(Number);
      const t2 = b.time.split("-").map(Number);
      return t1[0]*60 + t1[1] - (t2[0]*60 + t2[1]);
    });

    runs.forEach((entry, idx) => {
      const div = document.createElement("div");
      div.className = "entry";

      // Ranking classes
      let rankClass = "";
      let rankNumber = idx + 1;
      if(idx === 0) rankClass = "gold";
      else if(idx === 1) rankClass = "silver";
      else if(idx === 2) rankClass = "bronze";

      // Conditional lines
      const playerLine = entry.name ? 
        `<div class="player-line">
           <span class="player-name">${entry.name}</span>
           ${entry.time && entry.time.toLowerCase() !== "n/a" ? `<span class="player-time">${entry.time.replace("-", ":")}</span>` : ""}
         </div>` : "";

      const videoLine = entry.video && entry.video.toLowerCase() !== "n/a" ? 
        `<div class="video-line">
           <a href="${entry.video}" target="_blank">Watch The Run Here!</a>
         </div>` : "";

      let socialLinksHTML = "";
      if (entry.socials) {
        socialLinksHTML = Object.keys(entry.socials)
          .filter(key => !key.toLowerCase().includes("_display") && entry.socials[key].toLowerCase() !== "n/a")
          .map(key => {
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


