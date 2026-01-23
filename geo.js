// geo.js
// ==============================
// GEO INPUT + AUTOCOMPLETE + NORMALIZATION
// ==============================

const cityInput = document.getElementById("cityInput");
const citySuggestions = document.getElementById("citySuggestions");
const selectedCitiesContainer = document.getElementById("selectedCities");
const addMillionBtn = document.getElementById("addMillionCities");

// ==============================
// DATA
// ==============================

const geoNames = cityData.map(item => item.name);
let selectedRegions = [];

// алиасы / сокращения
const GEO_ALIASES = {
  "мск": "Москва",
  "москва": "Москва",
  "дефолтсити": "Москва",
  "питер": "Санкт-Петербург",
  "спб": "Санкт-Петербург",
  "санкт петербург": "Санкт-Петербург",
  "спбг": "Санкт-Петербург",
  "екб": "Екатеринбург",
  "ебург": "Екатеринбург",
  "свердловск": "Екатеринбург",
  "нск": "Новосибирск",
  "сиб": "Новосибирск",
  "нн": "Нижний Новгород",
  "нино": "Нижний Новгород",
  "ннов": "Нижний Новгород",
  "крк": "Красноярск",
  "крас": "Красноярск",
  "кск": "Красноярск",
  "крд": "Краснодар",
  "красн": "Краснодар",
  "чел": "Челябинск",
  "челяба": "Челябинск",
  "члб": "Челябинск",
  "самара": "Самара",
  "ростов": "Ростов-на-Дону",
  "рнд": "Ростов-на-Дону",
  "ростов папа": "Ростов-на-Дону",
  "кзн": "Казань",
  "каз": "Казань",
  "уфа": "Уфа",
  "пм": "Пермь",
  "врн": "Воронеж",
  "ворон": "Воронеж",
  "влг": "Волгоград",
  "влв": "Владивосток",
  "влад": "Владивосток",
  "вл": "Владивосток",
  "омск": "Омск",
  "сар": "Саратов",
  "тлт": "Тольятти",
  "ижевск": "Ижевск",
  "иж": "Ижевск",
  "ульян": "Ульяновск",
  "яр": "Ярославль",
  "ярик": "Ярославль",
  "ирк": "Иркутск",
  "тмн": "Тюмень",
  "хаба": "Хабаровск",
  "хбр": "Хабаровск",
  "орен": "Оренбург",
  "кемерово": "Кемерово",
  "кем": "Кемерово",
  "рязань": "Рязань",
  "рзн": "Рязань",
  "томск": "Томск",
  "астра": "Астрахань",
  "пенза": "Пенза",
  "липецк": "Липецк",
  "тула": "Тула",
  "клд": "Калининград",
  "кениг": "Калининград",
  "став": "Ставрополь",
  "курск": "Курск",
  "тв": "Тверь",
  "махач": "Махачкала",
  "сур": "Сургут",
  "сгт": "Сургут",
  "якутск": "Якутск",
  "якт": "Якутск",
  "мо": "Московская область",
  "подмосковье": "Московская область",
  "ло": "Ленинградская область",
  "лен": "Ленинградская область",
  "хмао": "Ханты-Мансийский автономный округ",
  "янао": "Ямало-Ненецкий автономный округ",
  "дв": "Дальний Восток",
  "приморье": "Приморский край",
  "кубань": "Краснодарский край",
  "vcr": "Москва",
  "vsk": "Москва",
  "vjcrdf": "Москва",
  "мск": "Москва",
  "москва": "Москва",
  "gbnth": "Санкт-Петербург",
  "piter": "Санкт-Петербург",
  "cgб": "Санкт-Петербург",
  "spb": "Санкт-Петербург",
  "питер": "Санкт-Петербург",
  "спб": "Санкт-Петербург",
  "trб": "Екатеринбург",
  "ekb": "Екатеринбург",
  "trehu": "Екатеринбург",
  "екб": "Екатеринбург",
  "ебург": "Екатеринбург",
  "ycr": "Новосибирск",
  "nsk": "Новосибирск",
  "нск": "Новосибирск",
  "yy": "Нижний Новгород",
  "nn": "Нижний Новгород",
  "yjd": "Нижний Новгород",
  "нн": "Нижний Новгород",
  "ннов": "Нижний Новгород",
  "rhr": "Красноярск",
  "krk": "Красноярск",
  "rhfc": "Красноярск",
  "крк": "Красноярск",
  "крас": "Красноярск",
  "rhf": "Краснодар",
  "krd": "Краснодар",
  "rhfcy": "Краснодар",
  "крд": "Краснодар",
  "красн": "Краснодар",
  "xtk": "Челябинск",
  "chl": "Челябинск",
  "xtky": "Челябинск",
  "чел": "Челябинск",
  "члб": "Челябинск",
  "cfvfhf": "Самара",
  "samara": "Самара",
  "самара": "Самара",
  "hjcnjv": "Ростов-на-Дону",
  "rnd": "Ростов-на-Дону",
  "hyl": "Ростов-на-Дону",
  "ростов": "Ростов-на-Дону",
  "рнд": "Ростов-на-Дону",
  "rpy": "Казань",
  "kzn": "Казань",
  "кзн": "Казань",
  "каз": "Казань",
  "eaf": "Уфа",
  "ufa": "Уфа",
  "уфа": "Уфа",
  "gv": "Пермь",
  "perm": "Пермь",
  "пм": "Пермь",
  "дн": "Воронеж",
  "vrn": "Воронеж",
  "врн": "Воронеж",
  "dku": "Волгоград",
  "vlg": "Волгоград",
  "влг": "Волгоград",
  "dk": "Владивосток",
  "vvo": "Владивосток",
  "вл": "Владивосток",
  "влв": "Владивосток",
  "jvcr": "Омск",
  "omsk": "Омск",
  "омск": "Омск",
  "cfh": "Саратов",
  "sar": "Саратов",
  "сар": "Саратов",
  "nknd": "Тольятти",
  "tlt": "Тольятти",
  "тлт": "Тольятти",
  "b;tdcr": "Ижевск",
  "izh": "Ижевск",
  "ижевск": "Ижевск",
  "иж": "Ижевск",
  "ezmzy": "Ульяновск",
  "ulyan": "Ульяновск",
  "ульян": "Ульяновск",
  "zh": "Ярославль",
  "yar": "Ярославль",
  "ярик": "Ярославль",
  "bhr": "Иркутск",
  "irk": "Иркутск",
  "ирк": "Иркутск",
  "nvy": "Тюмень",
  "tmn": "Тюмень",
  "тмн": "Тюмень",
  "fcnhf": "Астрахань",
  "astra": "Астрахань",
  "астра": "Астрахань",
  "rkf": "Калининград",
  "kld": "Калининград",
  "кениг": "Калининград",
  "клд": "Калининград",
  "vj": "Московская область",
  "mo": "Московская область",
  "мо": "Московская область",
  "kj": "Ленинградская область",
  "lo": "Ленинградская область",
  "ло": "Ленинградская область",
  "хvfо": "Ханты-Мансийский автономный округ",
  "khmao": "Ханты-Мансийский автономный округ",
  "хмао": "Ханты-Мансийский автономный округ",
  "zyfо": "Ямало-Ненецкий автономный округ",
  "yanao": "Ямало-Ненецкий автономный округ",
  "янао": "Ямало-Ненецкий автономный округ"
};

// ==============================
// HELPERS
// ==============================

function normalizeInput(value) {
  return value
    .toLowerCase()
    .replace(/[^а-яa-z\s-]/gi, "")
    .trim();
}

function resolveGeoName(input) {
  const normalized = normalizeInput(input);

  // алиасы
  if (GEO_ALIASES[normalized]) {
    return GEO_ALIASES[normalized];
  }

  // точное совпадение
  const exact = geoNames.find(
    name => name.toLowerCase() === normalized
  );
  if (exact) return exact;

  // частичное совпадение
  const partial = geoNames.find(
    name => name.toLowerCase().includes(normalized)
  );

  return partial || null;
}

function addToSelected(cityName) {
  if (!selectedRegions.includes(cityName)) {
    selectedRegions.push(cityName);
  }
}

function hideSuggestions() {
  citySuggestions.style.display = "none";
  citySuggestions.innerHTML = "";
}

// ==============================
// RENDER CHIPS
// ==============================

function renderSelectedCities() {
  selectedCitiesContainer.innerHTML = "";

  selectedRegions.forEach(name => {
    const chip = document.createElement("div");
    chip.className = "city-chip";
    chip.innerHTML = `
      ${name}
      <span>×</span>
    `;

    chip.querySelector("span").onclick = () => {
      selectedRegions = selectedRegions.filter(c => c !== name);
      renderSelectedCities();
    };

    selectedCitiesContainer.appendChild(chip);
  });

  function checkGeoAlerts() {
  const warningBox = document.getElementById("geoWarning");
  if (!warningBox) return;

  const triggerRegions = [
    "Московская область", 
    "Ленинградская область", 
    "Республика Крым"
  ];
  
  // Если выбран хоть один из регионов-триггеров, показываем плашку
  const hasTrigger = selectedRegions.some(name => triggerRegions.includes(name));
  warningBox.style.display = hasTrigger ? "block" : "none";
}
}

// ==============================
// ADD CITY (FROM INPUT / CLICK)
// ==============================

function addCityFromString(value) {
  const parts = value.split(",").map(v => v.trim()).filter(Boolean);

  parts.forEach(part => {
    const resolved = resolveGeoName(part);
    if (resolved) {
      addToSelected(resolved);
    }
  });

  renderSelectedCities();
  hideSuggestions();
  cityInput.value = "";
}

// ==============================
// INPUT EVENTS
// ==============================

cityInput.addEventListener("keydown", e => {
  if (e.key === "Enter" || e.key === ",") {
    e.preventDefault();
    addCityFromString(cityInput.value);
  }
});

cityInput.addEventListener("blur", () => {
  hideSuggestions();
});

cityInput.addEventListener("input", () => {
  const query = normalizeInput(
    cityInput.value.split(",").pop()
  );

  citySuggestions.innerHTML = "";

  if (!query) {
    hideSuggestions();
    return;
  }

  const matches = geoNames
    .filter(name => name.toLowerCase().includes(query))
    .slice(0, 10);

  if (!matches.length) {
    hideSuggestions();
    return;
  }

  matches.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name;
    li.addEventListener("mousedown", e => {
  e.preventDefault(); // ⬅️ блокирует blur

  addToSelected(name);
  renderSelectedCities();
  hideSuggestions();
  cityInput.value = "";
});

    citySuggestions.appendChild(li);
  });

  citySuggestions.style.display = "block";
});

// ==============================
// MILLION CITIES BUTTON
// ==============================

if (addMillionBtn) {
  addMillionBtn.addEventListener("click", () => {
    if (typeof millionCities === "undefined") return;

    millionCities.forEach(city => {
      if (geoNames.includes(city)) {
        addToSelected(city);
      }
    });

    renderSelectedCities();
    hideSuggestions();
    cityInput.value = "";
  });
}

// ==============================
// API FOR calc.js
// ==============================

window.getSelectedRegions = () => [...selectedRegions];

// ==============================
// GEO PRESETS (STUB)
// ==============================

document.querySelectorAll(".geo-preset-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const preset = btn.dataset.preset;

    console.log(`Гео-пресет выбран: ${preset}`);

    // TODO:
    // regions  → все регионы РФ
    // million  → города-миллионники
    // 500      → города 500k+
    // 100      → города 100k+

    // Пока заглушка — ничего не добавляем
  });
});
