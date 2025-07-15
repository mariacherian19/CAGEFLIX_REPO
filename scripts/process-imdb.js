const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const CAGE_ID = "nm0000115";
const MAX_TITLES = 100;
const MAX_ACTORS = 50;
const MAX_COACTORS_PER_TITLE = 10;

const MOVIES_FILE = path.join(__dirname, "cage-movies.json");
const SHOWS_FILE = path.join(__dirname, "cage-shows.json");

async function processIMDBData() {
  const cageMovieIds = new Set();
  const titleToActors = {};
  const neededActorIds = new Set();
  const actorIdToName = {};
  const movies = [];
  const shows = [];

  // Cage's titles and actors
  console.log("Processing principals...");
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "dataset", "title.principals.tsv"))
      .pipe(csv({ separator: "\t" }))
      .on("data", (row) => {
        try {
          const isActor = ["actor", "actress"].includes(row.category);
          const isCage = row.nconst === CAGE_ID;

          if (isCage && cageMovieIds.size < MAX_TITLES) {
            cageMovieIds.add(row.tconst);
          }

          if (isActor && cageMovieIds.has(row.tconst)) {
            if (!titleToActors[row.tconst]) {
              titleToActors[row.tconst] = new Set();
            }
            titleToActors[row.tconst].add(row.nconst);
          }
        } catch (e) {
          console.error("Error in principals row:", e.message);
        }
      })
      .on("end", resolve)
      .on("error", reject);
  });

  //  co-actor IDs
  for (const tconst of cageMovieIds) {
    const all = Array.from(titleToActors[tconst] || []);
    for (const id of all) {
      if (id !== CAGE_ID && neededActorIds.size < MAX_ACTORS) {
        neededActorIds.add(id);
      }
    }
  }

  //  actor names
  console.log("Processing names");
  await new Promise((resolve, reject) => {
    let found = 0;
    const stream = fs
      .createReadStream(path.join(__dirname, "dataset", "name.basics.tsv"))
      .pipe(csv({ separator: "\t" }))
      .on("data", (row) => {
        if (neededActorIds.has(row.nconst)) {
          actorIdToName[row.nconst] = row.primaryName;
          found++;

          if (found >= neededActorIds.size) {
            stream.destroy();
          }
        }
      })
      .on("end", () => {
        resolve();
      })
      .on("error", reject);
  });

  // basic title info
  console.log("Processing basics...");
  await new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "dataset", "title.basics.tsv"))
      .pipe(csv({ separator: "\t" }))
      .on("data", (row) => {
        if (!cageMovieIds.has(row.tconst)) return;

        const validTypes = ["movie", "tvSeries", "tvMiniSeries"];
        if (!validTypes.includes(row.titleType)) return;

        const allActors = Array.from(titleToActors[row.tconst] || []);
        const coActors = allActors
          .filter((id) => id !== CAGE_ID)
          .slice(0, MAX_COACTORS_PER_TITLE)
          .map((id) => actorIdToName[id])
          .filter(Boolean);

        const entry = {
          id: row.tconst,
          type: row.titleType,
          title: row.primaryTitle,
          year: row.startYear,
          runtime: row.runtimeMinutes,
          genres: row.genres?.split(",") || [],
          coActors,
          description: "[No description available in IMDb datasets]",
        };

        if (row.titleType === "movie") {
          if (movies.length < MAX_TITLES) movies.push(entry);
        } else {
          if (shows.length < MAX_TITLES) shows.push(entry);
        }
      })
      .on("end", () => {
        resolve();
      })
      .on("error", reject);
  });

  try {
    fs.writeFileSync(MOVIES_FILE, JSON.stringify(movies, null, 2));
    fs.writeFileSync(SHOWS_FILE, JSON.stringify(shows, null, 2));
  } catch (err) {
    console.error("Failed to write output files ", err);
  }
}

processIMDBData().catch((err) => {
  console.error(" error:", err);
  process.exit(1);
});
