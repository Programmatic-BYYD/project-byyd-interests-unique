// calc.js
// ==============================
// BASE + INTERESTS CALCULATION
// ==============================

let BASE = 0;

// ==============================
// HELPERS
// ==============================

function calculateBaseFromCity(region, gender, ageFrom, ageTo) {
  let sum = 0;
  const genderData = region.capacity[gender];
  if (!genderData) return 0;

  for (let age = ageFrom; age <= ageTo; age++) {
    sum += genderData[String(age)] || 0;
  }
  return sum;
}

// ==============================
// BASE CALCULATION
// ==============================

function calculateBase() {
  const selectedRegions = window.getSelectedRegions
    ? window.getSelectedRegions()
    : [];

  if (!selectedRegions.length) {
    alert("Добавьте хотя бы один город или регион");
    return;
  }

  const gender = document.getElementById("genderSelect").value;

  const ageFromInput = document.getElementById("ageFrom");
  const ageToInput = document.getElementById("ageTo");

  let ageFromRaw = ageFromInput.value;
  let ageToRaw = ageToInput.value;

  // сброс ошибок
  ageFromInput.classList.remove("error");
  ageToInput.classList.remove("error");

  let ageFrom, ageTo;

  // CASE 1: оба пустые → дефолт 0–70
  if (ageFromRaw === "" && ageToRaw === "") {
    ageFrom = 0;
    ageTo = 70;
  } else {
    ageFrom = Number(ageFromRaw);
    ageTo = Number(ageToRaw);

    const invalid =
      isNaN(ageFrom) ||
      isNaN(ageTo) ||
      ageFrom < 0 ||
      ageTo > 70 ||
      ageFrom > ageTo;

    if (invalid) {
      ageFromInput.classList.add("error");
      ageToInput.classList.add("error");
      alert("Проверьте корректность возраста");
      return;
    }
  }

  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  let totalSum = 0;

  selectedRegions.forEach(regionName => {
    const region = cityData.find(c => c.name === regionName);
    if (!region) return;

    let regionSum = 0;

    if (gender === "М/Ж") {
      regionSum += calculateBaseFromCity(region, "М", ageFrom, ageTo);
      regionSum += calculateBaseFromCity(region, "Ж", ageFrom, ageTo);
    } else {
      regionSum += calculateBaseFromCity(region, gender, ageFrom, ageTo);
    }

    totalSum += regionSum;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${region.name}</td>
      <td>${region.region || "—"}</td>
      <td>${region.district || "—"}</td>
      <td>${gender}</td>
      <td>${ageFrom}–${ageTo}</td>
      <td>${regionSum.toLocaleString("ru-RU")}</td>
    `;
    tableBody.appendChild(tr);
  });

  const totalRow = document.createElement("tr");
  totalRow.innerHTML = `
    <td><b>Итого</b></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b>${totalSum.toLocaleString("ru-RU")}</b></td>
  `;
  tableBody.appendChild(totalRow);

  BASE = totalSum;

  // OUTPUT
  document.getElementById("baseReach").innerText =
    BASE.toLocaleString("ru-RU");

  document.getElementById("finalReach").innerText =
    BASE.toLocaleString("ru-RU");

  document.getElementById("coef").innerText = "1.00";
  document.getElementById("deltaReach").innerText = "0%";
  document.getElementById("citiesCount").innerText =
    selectedRegions.length;

  document.getElementById("explanation").innerText =
    "Базовый охват рассчитан по гео, полу и возрасту. " +
    "Если возраст не выбран, используется диапазон 0–70 лет.";

  // auto-open details
  const accordion = document.getElementById("detailsAccordion");
  const tableWrapper = document.getElementById("tableWrapper");
  const subtitle = document.getElementById("detailsSubtitle");

  accordion.classList.add("open");
  tableWrapper.style.display = "block";
  subtitle.innerText = "Скрыть список";
}

// ==============================
// INTERESTS CALCULATION
// ==============================

function calculateWithInterests() {
  if (!BASE) {
    alert("Сначала рассчитайте базовый охват");
    return;
  }

  const selectedInterests = window.getSelectedInterests
    ? window.getSelectedInterests()
    : [];

  if (!selectedInterests.length) {
    document.getElementById("finalReach").innerText =
      BASE.toLocaleString("ru-RU");

    document.getElementById("coef").innerText = "1.00";
    document.getElementById("deltaReach").innerText = "0%";

    document.getElementById("explanation").innerText =
      "Интересы не выбраны — используется базовый охват";

    return;
  }

  const coefs = selectedInterests
    .map(id => {
      const interest = interestsData.find(i => i.id === id);
      return interest ? COEF[interest.status] : null;
    })
    .filter(Boolean);

  if (!coefs.length) return;

  const finalCoef = Math.min(...coefs);
  const finalReach = Math.round(BASE * finalCoef);

  const deltaPercent =
    ((BASE - finalReach) / BASE * 100).toFixed(1);

  document.getElementById("finalReach").innerText =
    finalReach.toLocaleString("ru-RU");

  document.getElementById("coef").innerText =
    finalCoef.toFixed(2);

  document.getElementById("deltaReach").innerText =
    `${deltaPercent}%`;

  document.getElementById("explanation").innerText =
    "Охват скорректирован по интересам. " +
    "Для расчёта применяется самый узкий интерес из выбранных. " +
    "Повторяющиеся или однотипные интересы не усиливают сужение — коэффициент применяется один раз.";
}

// ==============================
// EVENTS
// ==============================

document
  .getElementById("calcBtn")
  .addEventListener("click", calculateBase);

document
  .getElementById("calcWithInterestsBtn")
  .addEventListener("click", calculateWithInterests);

document
  .getElementById("resetBtn")
  .addEventListener("click", () => location.reload());

// ==============================
// ACCORDIONS
// ==============================

const detailsAccordion = document.getElementById("detailsAccordion");
const tableToggle = document.getElementById("tableToggle");
const tableWrapper = document.getElementById("tableWrapper");
const subtitle = document.getElementById("detailsSubtitle");

tableToggle.addEventListener("click", () => {
  const isOpen = detailsAccordion.classList.contains("open");
  detailsAccordion.classList.toggle("open");
  tableWrapper.style.display = isOpen ? "none" : "block";
  subtitle.innerText = isOpen
    ? "Раскрыть список"
    : "Скрыть список";
});

const interestsAccordion = document.getElementById("interestsAccordion");
const interestsToggle = document.getElementById("interestsToggle");
const interestsBody = document.getElementById("interestsBody");

interestsToggle.addEventListener("click", () => {
  const isOpen = interestsAccordion.classList.contains("open");
  interestsAccordion.classList.toggle("open");
  interestsBody.style.display = isOpen ? "none" : "block";
});
