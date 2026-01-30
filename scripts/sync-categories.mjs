import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const RAKUTEN_APP_ID = process.env.RAKUTEN_APP_ID;
const YAHOO_APP_ID = process.env.YAHOO_APP_ID;

const CATEGORY_MAP_PATH = 'src/data/category-map.json';
const CATEGORIES_JSON_PATH = 'src/data/categories.json';

async function fetchRakutenGenre(genreId) {
  const url = `https://app.rakuten.co.jp/services/api/IchibaGenre/Search/20140222?format=json&applicationId=${RAKUTEN_APP_ID}&genreId=${genreId}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Rakuten API Error: ${res.status}`);
  return await res.json();
}

async function findRakutenIdByName(parentGenreId, targetName) {
  try {
    const data = await fetchRakutenGenre(parentGenreId);
    const children = data.children || [];
    // Try exact match first, then partial
    let found = children.find(c => c.child.genreName === targetName);
    if (!found) found = children.find(c => c.child.genreName.includes(targetName));
    return found ? { mallId: found.child.genreId.toString(), name: found.child.genreName } : null;
  } catch (e) {
    console.error(`Error finding Rakuten ID for ${targetName}:`, e.message);
    return null;
  }
}

async function fetchYahooCategoryId(keyword) {
  const url = `https://shopping.yahooapis.jp/ShoppingWebService/V3/itemSearch?appid=${YAHOO_APP_ID}&query=${encodeURIComponent(keyword)}&results=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
        if (res.status === 429) console.warn(`Yahoo API Rate Limit (429) for ${keyword}`);
        return null;
    }
    const data = await res.json();
    if (data.hits && data.hits.length > 0) {
      const categories = data.hits[0].parentCategories;
      if (categories && categories.length > 0) {
        const cat = categories[categories.length - 1];
        return { mallId: cat.id.toString(), name: cat.name };
      }
    }
  } catch (e) {
    console.error(`Error fetching Yahoo ID for ${keyword}:`, e.message);
  }
  return null;
}

const RAKUTEN_ROOT_FALLBACKS = {
  "美容・コスメ・香水": "100939",
  "家電": "562637",
  "食品": "100227",
  "スポーツ・アウトドア": "101070",
  "テレビゲーム": "101205",
  "レディースファッション": "100371",
  "インテリア・寝具・収納": "100804",
  "ペット・ペットグッズ": "101213",
  "キッズ・ベビー・マタニティ": "100533"
};

async function sync() {
  const categoryMap = JSON.parse(fs.readFileSync(CATEGORY_MAP_PATH, 'utf-8'));
  const currentCategories = JSON.parse(fs.readFileSync(CATEGORIES_JSON_PATH, 'utf-8'));
  const brands = Object.keys(categoryMap);
  
  const results = {};

  for (const brandId of brands) {
    console.log(`Syncing ${brandId}...`);
    const def = categoryMap[brandId];
    
    // --- Rakuten ---
    let rakParent = await findRakutenIdByName(0, def.parent);
    if (!rakParent) rakParent = { mallId: RAKUTEN_ROOT_FALLBACKS[def.parent], name: def.parent };
    
    const rakList = [];
    if (rakParent.mallId) {
      rakList.push({ id: "all", name: rakParent.name, mallId: rakParent.mallId });
      for (const childName of def.children) {
        const res = await findRakutenIdByName(rakParent.mallId, childName);
        if (res) {
          const shortId = childName === "Nintendo Switch" ? "switch" : childName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10);
          rakList.push({ id: shortId || `c${rakList.length}`, name: res.name, mallId: res.mallId });
        }
      }
    }

    // --- Yahoo ---
    let yahParent = await fetchYahooCategoryId(def.parent);
    const yahList = [];
    if (yahParent) {
      yahList.push({ id: "all", name: yahParent.name, mallId: yahParent.mallId });
      for (const childName of def.children) {
        const res = await fetchYahooCategoryId(childName);
        if (res) {
          const shortId = childName === "Nintendo Switch" ? "switch" : childName.toLowerCase().replace(/[^a-z]/g, '').substring(0, 10);
          yahList.push({ id: shortId || `c${yahList.length}`, name: res.name, mallId: res.mallId });
        }
      }
    }

    // Merge with current data if API failed (keep existing IDs as fallback)
    results[brandId] = {
      rakuten: rakList.length > 0 ? rakList : (currentCategories[brandId]?.rakuten || []),
      yahoo: yahList.length > 0 ? yahList : (currentCategories[brandId]?.yahoo || [])
    };
    
    // Ensure "all" is present
    if (results[brandId].rakuten.length === 0 && rakParent.mallId) {
        results[brandId].rakuten = [{ id: "all", name: rakParent.name, mallId: rakParent.mallId }];
    }
  }

  // Preserve "bestie" root categories if not in map
  if (!results.bestie && currentCategories.bestie) {
    results.bestie = currentCategories.bestie;
  }

  fs.writeFileSync(CATEGORIES_JSON_PATH, JSON.stringify(results, null, 2));
  console.log(`Successfully updated ${CATEGORIES_JSON_PATH}`);
}

sync().catch(console.error);
