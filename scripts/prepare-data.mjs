// Generates src/data/countries.ts and src/data/worldBorders.json for Terra.
//
// Sources (all open data, no API keys; only this script needs network access,
// never the shipped app):
//  - world-countries (mledoze)  — country attributes. License: ODbL.
//  - world-atlas + topojson-client — simplified (110m) border geometry, derived
//    from Natural Earth (public domain).
//  - Pew Research Center, "The Future of World Religions: Population Growth
//    Projections, 2010-2050", via datasets/world-religion-projections on
//    GitHub — religion composition by country, 2020 estimates.
//    License: CC BY 4.0 — attribution to Pew Research Center is required
//    wherever this data is shown (see README.md).
//
// Re-run with: npm install world-countries world-atlas topojson-client --no-save
//              node prepare-data.mjs
import countries from "world-countries";
import topology from "world-atlas/countries-110m.json" with { type: "json" };
import * as topojson from "topojson-client";
import { writeFileSync } from "node:fs";

const RELIGIONS_CSV_URL =
  "https://raw.githubusercontent.com/datasets/world-religion-projections/main/rounded_percentage.csv";
const RELIGION_KEYS = ["Buddhists", "Christians", "Folk Religions", "Hindus", "Jews", "Muslims", "Other Religions", "Unaffiliated"];

// Pew's country names -> our cca3, bridging naming/diacritic differences
// between the two datasets.
const RELIGION_NAME_ALIASES = {
  "bolivia": "BOL",
  "bosnia-herzegovina": "BIH",
  "brunei": "BRN",
  "cape verde": "CPV",
  "congo, dem. rep.": "COD",
  "congo, rep.": "COG",
  "cote d'ivoire": "CIV",
  "czech republic": "CZE",
  "iran": "IRN",
  "laos": "LAO",
  "macedonia": "MKD",
  "republic of macedonia": "MKD",
  "micronesia (country)": "FSM",
  "moldova": "MDA",
  "north korea": "PRK",
  "burma (myanmar)": "MMR",
  "myanmar (burma)": "MMR",
  "palestinian territories": "PSE",
  "russia": "RUS",
  "sao tome and principe": "STP",
  "south korea": "KOR",
  "st. kitts and nevis": "KNA",
  "st. lucia": "LCA",
  "st. vincent and the grenadines": "VCT",
  "swaziland": "SWZ",
  "syria": "SYR",
  "taiwan": "TWN",
  "tanzania": "TZA",
  "the gambia": "GMB",
  "turkey": "TUR",
  "united states": "USA",
  "united kingdom": "GBR",
  "venezuela": "VEN",
  "vietnam": "VNM",
};

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split("\n");
  const headers = headerLine.split(",").map((h) => h.trim());
  return lines.map((line) => {
    const cells = line.split(",").map((c) => c.trim());
    const row = {};
    headers.forEach((h, i) => (row[h] = cells[i]));
    return row;
  });
}

function friendlyGroupName(pewLabel) {
  const map = { "Folk Religions": "Folk religions", "Other Religions": "Other religions", Unaffiliated: "Unaffiliated / no religion" };
  return map[pewLabel] ?? pewLabel;
}

async function loadReligions() {
  const res = await fetch(RELIGIONS_CSV_URL);
  if (!res.ok) throw new Error(`Failed to fetch religion dataset: ${res.status}`);
  const rows2020 = parseCsv(await res.text()).filter((r) => r.Year === "2020" && r.Country !== "All Countries");

  const byCommonName = new Map(countries.map((c) => [c.name.common.toLowerCase(), c.cca3]));
  const byOfficialName = new Map(countries.map((c) => [c.name.official.toLowerCase(), c.cca3]));

  const byCca3 = {};
  for (const row of rows2020) {
    const lower = row.Country.toLowerCase();
    const cca3 = RELIGION_NAME_ALIASES[lower] ?? byCommonName.get(lower) ?? byOfficialName.get(lower);
    if (!cca3) continue; // remaining misses are non-sovereign territories not in our country list anyway

    const shares = RELIGION_KEYS.map((k) => ({ name: k, percent: parseFloat(row[k]) })).filter((s) => !Number.isNaN(s.percent));
    shares.sort((a, b) => b.percent - a.percent);
    const top = shares.filter((s, i) => i === 0 || s.percent >= 4).slice(0, 4);
    byCca3[cca3] = top.map((s) => ({ name: friendlyGroupName(s.name), percent: Math.round(s.percent * 10) / 10 }));
  }
  return byCca3;
}

// ---- Hand-curated highlights for a first wave of featured countries -------
// (accent color pulled from each flag's most distinctive hue; fun facts are
// original wording, not sourced from any single text.)
const FEATURED = {
  USA: { accentColor: "#3C3B6E", funFact: "The United States has no official language at the federal level — English is dominant by custom, not law." },
  CAN: { accentColor: "#FF0000", funFact: "Canada has the longest coastline of any country on Earth, touching the Atlantic, Pacific, and Arctic oceans." },
  MEX: { accentColor: "#006847", funFact: "Chocolate, corn, tomatoes, and vanilla were all first domesticated in Mexico by ancient Mesoamerican civilizations." },
  BRA: { accentColor: "#009739", funFact: "Brazil is the only country in the Americas where Portuguese is the official language, a legacy of 16th-century colonization." },
  CHL: { accentColor: "#D52B1E", funFact: "Chile stretches over 4,300 km north to south but is never more than about 350 km wide, squeezed between the Andes and the Pacific." },
  GBR: { accentColor: "#00247D", funFact: "The United Kingdom is a union of four countries — England, Scotland, Wales, and Northern Ireland." },
  FRA: { accentColor: "#0055A4", funFact: "France has more time zones than any other country — 12 in total, thanks to its overseas territories." },
  DEU: { accentColor: "#FFCE00", funFact: "\"Deutschland\" comes from an old Germanic word that simply meant \"the people.\"" },
  ITA: { accentColor: "#009246", funFact: "Italy has 58 UNESCO World Heritage Sites, more than any other country." },
  ESP: { accentColor: "#AA151B", funFact: "Spanish is native to Spain, but more native speakers now live in Mexico than in Spain itself." },
  ISL: { accentColor: "#02529C", funFact: "Iceland keeps no standing army, and its capital Reykjavík is heated almost entirely by geothermal energy." },
  RUS: { accentColor: "#0039A6", funFact: "Russia spans 11 time zones — more than any other country on Earth." },
  EGY: { accentColor: "#CE1126", funFact: "Egypt is transcontinental: the Sinai Peninsula lies in Asia while the rest of the country sits in Africa." },
  NGA: { accentColor: "#008751", funFact: "Nigeria is Africa's most populous country, and Lagos is projected to become one of the largest cities on Earth." },
  KEN: { accentColor: "#006600", funFact: "Kenya's Great Rift Valley is slowly tearing East Africa apart — in a few million years it will split into a new landmass." },
  ZAF: { accentColor: "#007A4D", funFact: "South Africa has three capital cities — Pretoria, Cape Town, and Bloemfontein — each hosting a different branch of government." },
  COD: { accentColor: "#007FFF", funFact: "The Democratic Republic of the Congo and the Republic of the Congo face each other across the Congo River — the only capitals in the world to do so." },
  COG: { accentColor: "#009543", funFact: "Brazzaville and Kinshasa, the two Congos' capitals, are the closest pair of capital cities in the world." },
  JPN: { accentColor: "#BC002D", funFact: "Japan's own name for itself, Nippon, translates to \"origin of the sun\" — the source of \"Land of the Rising Sun.\"" },
  CHN: { accentColor: "#DE2910", funFact: "China shares land borders with 14 countries, tied with Russia for the most of any nation." },
  IND: { accentColor: "#FF9933", funFact: "India recognizes 22 official languages, and its banknotes print the currency value in 15 different scripts." },
  NPL: { accentColor: "#DC143C", funFact: "Nepal's flag is the only national flag in the world that isn't rectangular — two stacked triangular pennants for the Himalayas." },
  THA: { accentColor: "#A51931", funFact: "Thailand is the only country in Southeast Asia that was never colonized by a European power." },
  AUS: { accentColor: "#00008B", funFact: "Australia is the only country that is also an entire continent." },
  NZL: { accentColor: "#00247D", funFact: "New Zealand is one of the last major landmasses on Earth settled by humans, first reached by Polynesian voyagers around 1300 CE." },
  VAT: { accentColor: "#FFE000", funFact: "Vatican City is the smallest internationally recognized country in the world — smaller than most golf courses." },
  TUR: { accentColor: "#E30A17", funFact: "Istanbul is the only major city in the world that sits on two continents, split by the Bosphorus strait between Europe and Asia." },
  GRC: { accentColor: "#0D5EAF", funFact: "The word \"alphabet\" itself comes from the first two letters of the Greek alphabet: alpha and beta." },
  PRT: { accentColor: "#046A38", funFact: "Portugal is one of the oldest countries in Europe with essentially unchanged borders, dating back to the 12th century." },
  MAR: { accentColor: "#C1272D", funFact: "Morocco was the first country in the world to formally recognize American independence, in 1777." },
  ETH: { accentColor: "#078930", funFact: "Ethiopia runs on its own calendar, currently about seven to eight years behind the Gregorian one used in most of the world." },
  KOR: { accentColor: "#0047A0", funFact: "South Korea's Incheon Airport was, for years, ranked among the world's best — with an in-terminal ice rink and golf course." },
  ARG: { accentColor: "#75AADB", funFact: "Buenos Aires' Avenida 9 de Julio, with up to 20 lanes of traffic, is often cited as the widest avenue in the world." },
  NLD: { accentColor: "#21468B", funFact: "The Netherlands' name means \"low countries\" — about a quarter of the country sits below sea level." },
  SWE: { accentColor: "#006AA7", funFact: "Sweden hasn't fought a war since 1814, one of the longest streaks of any nation on Earth." },
  NOR: { accentColor: "#BA0C2F", funFact: "Norway's oil-funded sovereign wealth fund is one of the largest single investors in the world, owning roughly 1.5% of all publicly listed shares globally." },
  DNK: { accentColor: "#C60C30", funFact: "Denmark's flag, the Dannebrog, is believed to be the oldest continuously used national flag in the world, dating to the 13th century." },
  POL: { accentColor: "#DC143C", funFact: "Poland adopted Europe's first modern written constitution in 1791 — the world's second, after the United States." },
  CHE: { accentColor: "#FF0000", funFact: "Switzerland holds direct democratic referendums on national issues several times a year." },
  AUT: { accentColor: "#ED2939", funFact: "Austria's flag is said to be the oldest state flag still in use, with a legend dating it to the 1190s." },
  IRL: { accentColor: "#169B62", funFact: "Ireland is home to roughly three sheep for every two people." },
  IDN: { accentColor: "#CE1126", funFact: "Indonesia spans over 17,000 islands across three time zones — more than any country except Russia." },
  VNM: { accentColor: "#DA251D", funFact: "Vietnam is the world's second-largest coffee exporter, after Brazil." },
  PHL: { accentColor: "#0038A8", funFact: "The Philippines is Asia's only Christian-majority country, a legacy of over 300 years of Spanish rule." },
  PAK: { accentColor: "#01411C", funFact: "Pakistan is home to K2, the world's second-highest mountain, and more peaks over 8,000 meters than any country besides Nepal." },
  BGD: { accentColor: "#006A4E", funFact: "Bangladesh sits atop the world's largest river delta, formed where three major rivers converge before reaching the Bay of Bengal." },
  SAU: { accentColor: "#006C35", funFact: "Saudi Arabia has no permanent rivers — the largest country in the world without one." },
  ARE: { accentColor: "#00732F", funFact: "Dubai's Burj Khalifa is so tall that people near its top see the sunset several minutes later than people at street level." },
  SGP: { accentColor: "#EF3340", funFact: "Singapore is one of only three city-states left in the world, alongside Monaco and Vatican City." },
  MYS: { accentColor: "#010066", funFact: "Malaysia is one of just 17 'megadiverse' countries, home to an outsized share of the world's plant and animal species." },
  LKA: { accentColor: "#FFB700", funFact: "Sri Lanka was the first country in the world with a female head of government, electing Sirimavo Bandaranaike as prime minister in 1960." },
  GHA: { accentColor: "#006B3F", funFact: "Ghana was the first sub-Saharan African country to gain independence from colonial rule, in 1957." },
  TZA: { accentColor: "#1EB53A", funFact: "Tanzania holds both the highest point in Africa, Kilimanjaro, and the Serengeti's annual migration of over a million wildebeest." },
  UGA: { accentColor: "#FCDC04", funFact: "Uganda sits at the source of the Nile, where the river begins its journey from Lake Victoria." },
  SEN: { accentColor: "#00853F", funFact: "Senegal's name is thought to come from a Wolof phrase meaning roughly \"our canoe\" — a reference to shared destiny." },
  TUN: { accentColor: "#E70013", funFact: "Tunisia sparked the Arab Spring in 2011 and is widely cited as the movement's one lasting democratic transition." },
  DZA: { accentColor: "#006233", funFact: "Algeria is Africa's largest country by land area, with over four-fifths of it covered by the Sahara Desert." },
  ZWE: { accentColor: "#006400", funFact: "Zimbabwe takes its name from Great Zimbabwe, a medieval stone city whose ruins are the largest ancient structure in sub-Saharan Africa outside Egypt." },
  COL: { accentColor: "#FCD116", funFact: "Colombia has more recorded bird species than any other country on Earth — over 1,900." },
  PER: { accentColor: "#D91023", funFact: "Machu Picchu was unknown to the outside world until 1911, despite being built in the 15th century." },
  VEN: { accentColor: "#FFCC00", funFact: "Venezuela's Angel Falls is the world's tallest waterfall, with a drop about 15 times the height of Niagara Falls." },
  CUB: { accentColor: "#002A8F", funFact: "Many of Cuba's classic American cars have stayed on the road since the 1950s, kept running for decades under a long-standing US trade embargo." },
  URY: { accentColor: "#0038A8", funFact: "Uruguay hosted and won the first-ever FIFA World Cup, in 1930." },
  UKR: { accentColor: "#0057B7", funFact: "Ukraine's black soil (chernozem) is so fertile that the country is one of the world's largest grain exporters, sometimes called the 'breadbasket of Europe.'" },
  BEL: { accentColor: "#FDDA24", funFact: "Belgium produces over 220,000 tons of chocolate a year and has more chocolatiers per capita than any other country." },
  FIN: { accentColor: "#003580", funFact: "Finland has more saunas than cars — over 3 million for a population of roughly 5.5 million." },
  CZE: { accentColor: "#11457E", funFact: "Czechia has one of the highest beer consumption rates per capita in the world, and Pilsner-style lager was invented there in 1842." },
  HUN: { accentColor: "#CE2939", funFact: "Hungarian is unrelated to nearly every language spoken by its neighbors — it belongs to the same family as Finnish and Estonian." },
  ROU: { accentColor: "#002B7F", funFact: "Romanian is a Romance language, a linguistic island of Latin heritage surrounded by Slavic-speaking neighbors." },
  BGR: { accentColor: "#00966E", funFact: "The bacterium that helps ferment yogurt, Lactobacillus bulgaricus, is named after Bulgaria, long credited as the drink's birthplace." },
  SRB: { accentColor: "#C6363C", funFact: "Serbia is landlocked, but has more mineral springs and spas than almost any other country in Europe." },
  HRV: { accentColor: "#FF0000", funFact: "Croatia's coastline includes over a thousand islands, though only about 50 are inhabited." },
  LTU: { accentColor: "#FDB913", funFact: "Lithuanian is considered one of the most conservative living languages, preserving features linguists trace back thousands of years." },
  LVA: { accentColor: "#9E3039", funFact: "Latvia holds one of the largest collections of folk songs in the world — over a million recorded verses." },
  EST: { accentColor: "#0072CE", funFact: "Estonia lets citizens vote, sign documents, and access nearly all public services online, earning it the nickname 'e-Stonia.'" },
  BLR: { accentColor: "#D22730", funFact: "Belarus lost roughly a quarter of its population in WWII, among the heaviest losses of any country." },
  CYP: { accentColor: "#D57800", funFact: "Cyprus is the only country in the world currently divided by a UN buffer zone running through its capital, Nicosia." },
  IRQ: { accentColor: "#CE1126", funFact: "Iraq sits within the 'Cradle of Civilization' — the first writing, the wheel, and the first cities are all believed to have emerged there." },
  IRN: { accentColor: "#239F40", funFact: "Iran's Persepolis was built starting around 518 BCE as the ceremonial capital of the largest empire the ancient world had seen." },
  SYR: { accentColor: "#CE1126", funFact: "Damascus is widely considered one of the oldest continuously inhabited cities on Earth." },
  LBN: { accentColor: "#00A651", funFact: "The Phoenician alphabet, developed in what's now Lebanon, is the ancestor of the Greek, Latin, and Arabic alphabets used across the world today." },
  JOR: { accentColor: "#007A3D", funFact: "Petra, Jordan's ancient Nabataean city, is carved directly into rose-colored rock and appeared as a filming location in Indiana Jones." },
  KWT: { accentColor: "#007A3D", funFact: "Before oil, Kuwait built its wealth on pearl diving — one of the Persian Gulf's major pearling centers for centuries." },
  QAT: { accentColor: "#8D1B3D", funFact: "Qatar became the first Middle Eastern country to host the FIFA World Cup, in 2022." },
  OMN: { accentColor: "#DB161B", funFact: "Oman's historic wealth came from frankincense, an aromatic resin traded across the ancient world." },
  YEM: { accentColor: "#CE1126", funFact: "Yemen's island of Socotra, isolated for millions of years, is home to plants — like the umbrella-shaped dragon's blood tree — found nowhere else on Earth." },
  KAZ: { accentColor: "#00AFCA", funFact: "Kazakhstan is the world's largest landlocked country by area." },
  UZB: { accentColor: "#0099B5", funFact: "Samarkand, on Uzbekistan's Silk Road, was once conquered by both Alexander the Great and Genghis Khan." },
  KHM: { accentColor: "#032EA1", funFact: "Angkor Wat, built in the 12th century, is the largest religious monument in the world." },
  LAO: { accentColor: "#CE1126", funFact: "Laos has no coastline at all — it's the only landlocked country in Southeast Asia." },
  MMR: { accentColor: "#FECB00", funFact: "At its peak, the ancient city of Bagan held over 10,000 Buddhist temples and pagodas — thousands still stand today." },
  PRK: { accentColor: "#ED1C27", funFact: "North Korea's Mount Paektu, an active volcano on the Chinese border, holds deep significance in Korean mythology." },
  MNG: { accentColor: "#C4272F", funFact: "Mongolia is the most sparsely populated sovereign country on Earth." },
  LBY: { accentColor: "#E70013", funFact: "Libya's Leptis Magna holds some of the best-preserved Roman ruins anywhere in the Mediterranean." },
  SDN: { accentColor: "#D21034", funFact: "Sudan has more ancient pyramids than Egypt — nearly 200, built by the Kingdom of Kush." },
  TCD: { accentColor: "#002664", funFact: "Lake Chad, once one of Africa's largest lakes, has shrunk by roughly 90% since the 1960s." },
  NER: { accentColor: "#E05206", funFact: "Over four-fifths of Niger lies within the Sahara Desert." },
  MLI: { accentColor: "#14B53A", funFact: "Mali's 14th-century ruler Mansa Musa is often cited as the wealthiest individual in recorded history." },
  CIV: { accentColor: "#F77F00", funFact: "Côte d'Ivoire is the world's largest cocoa producer, supplying roughly 40% of the global market." },
  CMR: { accentColor: "#007A5E", funFact: "Cameroon is nicknamed 'Africa in Miniature' for containing nearly every major African climate and landscape within one country." },
  GAB: { accentColor: "#009E60", funFact: "Gabon protects roughly 11% of its land as national parks, and its beaches are one of the few places on Earth where forest elephants and hippos wander onto the sand." },
  AGO: { accentColor: "#CE1021", funFact: "Angola's semba music is widely considered a root influence on Brazilian samba, carried across the Atlantic by the slave trade." },
  ZMB: { accentColor: "#198A00", funFact: "Victoria Falls, shared between Zambia and Zimbabwe, is known locally as 'the smoke that thunders.'" },
  MWI: { accentColor: "#339E35", funFact: "Lake Malawi holds more fish species than any other lake on Earth — most found nowhere else." },
  MOZ: { accentColor: "#007168", funFact: "Mozambique's coastline stretches over 2,500 km, longer than the entire US Pacific coast." },
  NAM: { accentColor: "#003580", funFact: "The Namib, believed to be the world's oldest desert, has existed in something like its current form for roughly 55–80 million years." },
  BWA: { accentColor: "#75AADB", funFact: "Botswana has held uninterrupted multi-party elections since independence in 1966, among Africa's most stable democracies." },
  RWA: { accentColor: "#00A1DE", funFact: "Rwanda's parliament has one of the highest shares of women representatives of any country in the world." },
  BFA: { accentColor: "#EF2B2D", funFact: "Burkina Faso hosts FESPACO, Africa's largest film festival, every two years since 1969." },
  GTM: { accentColor: "#4997D0", funFact: "Guatemala is home to over 20 different Maya languages still spoken today." },
  PAN: { accentColor: "#005293", funFact: "The Panama Canal, though only about 82 km long, handles roughly 5% of all world trade." },
  DOM: { accentColor: "#002D62", funFact: "Santo Domingo, founded in 1496, is the oldest continuously inhabited European settlement in the Americas." },
  HTI: { accentColor: "#00209F", funFact: "Haiti's 1804 revolution made it the first independent Black republic in the world and the only nation founded by a successful slave revolt." },
  TTO: { accentColor: "#CE1126", funFact: "The steelpan, widely considered the only acoustic instrument invented in the 20th century, was born in Trinidad." },
  BOL: { accentColor: "#DA291C", funFact: "Bolivia's Salar de Uyuni, the world's largest salt flat, becomes a giant mirror when a thin layer of water covers it." },
  ECU: { accentColor: "#FFDD00", funFact: "Ecuador is named for the equator, which runs directly through the country." },
  PRY: { accentColor: "#D52B1E", funFact: "Paraguay is one of the only countries in Latin America where an Indigenous language, Guaraní, is spoken daily by the vast majority of the population." },
  JAM: { accentColor: "#009B3A", funFact: "Jamaica, birthplace of reggae music, has produced more Olympic sprint champions per capita than almost any other country." },
  CRI: { accentColor: "#002B7F", funFact: "Costa Rica abolished its military in 1948 and has had none since." },
  HND: { accentColor: "#0073CF", funFact: "Honduras's Copán ruins hold some of the most detailed hieroglyphic writing anywhere in the Maya world." },
  PNG: { accentColor: "#CE1126", funFact: "Papua New Guinea is home to over 800 languages — more than any other country on Earth." },
  FJI: { accentColor: "#68BFE5", funFact: "Fiji's more than 330 islands hold some of the richest coral reefs in the South Pacific." },
  AFG: { accentColor: "#D32011", funFact: "Afghanistan's Wakhan Corridor — a narrow strip of land — was created by 19th-century imperial powers specifically to keep British and Russian territory from touching." },
  ARM: { accentColor: "#D90012", funFact: "Armenia was the first country in the world to adopt Christianity as a state religion, in 301 CE." },
  AZE: { accentColor: "#00B5E2", funFact: "Azerbaijan's capital, Baku, is known as the 'Land of Fire' for natural gas seeps that create eternally burning flames on its hillsides." },
  BHR: { accentColor: "#CE1126", funFact: "Bahrain's ancient Dilmun civilization was mentioned in some of the earliest known written texts, Sumerian cuneiform tablets." },
  BTN: { accentColor: "#FF4E12", funFact: "Bhutan measures national success by 'Gross National Happiness' instead of GDP, and it's the only carbon-negative country in the world." },
  BRN: { accentColor: "#FCD116", funFact: "Brunei's oil and gas wealth gives it one of the highest GDP-per-capita rates in Southeast Asia, with no income tax." },
  GEO: { accentColor: "#FF0000", funFact: "Georgia is widely considered the birthplace of wine, with evidence of winemaking dating back roughly 8,000 years." },
  ISR: { accentColor: "#0038B8", funFact: "Hebrew is the only historical language to be successfully revived as a modern, native spoken language after centuries of primarily liturgical use." },
  KGZ: { accentColor: "#E8112D", funFact: "Roughly 90% of Kyrgyzstan's territory sits above 1,500 meters, and nomadic yurt culture remains a living tradition, not just a tourist display." },
  MDV: { accentColor: "#D21034", funFact: "The Maldives is the world's lowest-lying country, with an average elevation of only about 1.5 meters above sea level." },
  TJK: { accentColor: "#006847", funFact: "Tajikistan holds the Pamir Mountains, nicknamed the 'Roof of the World.'" },
  TLS: { accentColor: "#DC241F", funFact: "Timor-Leste is Asia's youngest country, gaining full independence only in 2002." },
  TKM: { accentColor: "#6C9C41", funFact: "Turkmenistan is home to the 'Door to Hell,' a natural gas crater that has been burning continuously since the 1970s." },
  ALB: { accentColor: "#E41E20", funFact: "Albania was officially an atheist state from 1967 to 1990, the only one in the world at the time." },
  AND: { accentColor: "#0018A8", funFact: "Andorra is jointly ruled by two co-princes — the President of France and the Bishop of Urgell in Spain — an arrangement dating to 1278." },
  BIH: { accentColor: "#002395", funFact: "Sarajevo hosted the 1984 Winter Olympics; a decade later the same city endured the longest siege of a capital in modern warfare history." },
  LIE: { accentColor: "#002B7F", funFact: "Liechtenstein is one of only two doubly landlocked countries in the world, the other being Uzbekistan." },
  LUX: { accentColor: "#00A1DE", funFact: "Luxembourg is the last remaining sovereign grand duchy in the world, and it has the highest GDP per capita of any country on Earth." },
  MLT: { accentColor: "#CF142B", funFact: "Malta holds some of the oldest freestanding stone structures on Earth — older than Stonehenge or the Egyptian pyramids." },
  MDA: { accentColor: "#003DA5", funFact: "Moldova's Mileștii Mici wine cellar holds a Guinness World Record for the largest wine collection, with over a million bottles." },
  MCO: { accentColor: "#CE1126", funFact: "Monaco is the second-smallest country in the world, yet also the most densely populated, and has been ruled by the same family since 1297." },
  MNE: { accentColor: "#C40308", funFact: "Montenegro's name literally means 'Black Mountain,' and it split peacefully from Serbia in a 2006 referendum." },
  MKD: { accentColor: "#D20000", funFact: "North Macedonia only adopted its current name in 2019, after a 27-year naming dispute with Greece was resolved." },
  SMR: { accentColor: "#5EB6E4", funFact: "San Marino claims to be the oldest surviving sovereign state and constitutional republic in the world, founded in 301 CE." },
  SVK: { accentColor: "#0B4EA2", funFact: "Slovakia has more castles and châteaux per capita than any other country in the world." },
  SVN: { accentColor: "#005CE6", funFact: "Slovenia is one of the most forested countries in Europe, with trees covering nearly 60% of its land." },
  ATG: { accentColor: "#CE1126", funFact: "Antigua and Barbuda claims to have 365 beaches, one for every day of the year." },
  BHS: { accentColor: "#00778B", funFact: "The Bahamas' waters include the Tongue of the Ocean, a deep-sea trench so profound the US Navy uses it to test submarines." },
  BRB: { accentColor: "#00267F", funFact: "Barbados was the birthplace of rum distillation, with the world's oldest rum-producing brand, Mount Gay, dating to 1703." },
  BLZ: { accentColor: "#003F87", funFact: "Belize is the only country in Central America where English is the official language, and it protects the second-largest barrier reef system in the world." },
  DMA: { accentColor: "#00853F", funFact: "Dominica is home to Boiling Lake, the second-largest hot lake in the world, formed by a flooded volcanic fumarole." },
  SLV: { accentColor: "#0047AB", funFact: "El Salvador made history in 2021 as the first country to adopt Bitcoin as legal tender." },
  GRD: { accentColor: "#CE1126", funFact: "Grenada is known as the 'Spice Isle' for producing a large share of the world's nutmeg." },
  GUY: { accentColor: "#009739", funFact: "Guyana is the only English-speaking country in South America, and it's home to Kaieteur Falls, one of the world's tallest single-drop waterfalls." },
  NIC: { accentColor: "#0067C6", funFact: "Nicaragua's Lake Nicaragua is one of the only freshwater lakes in the world home to bull sharks." },
  KNA: { accentColor: "#009E49", funFact: "Alexander Hamilton, a US Founding Father, was born on Nevis, part of Saint Kitts and Nevis." },
  LCA: { accentColor: "#66CCFF", funFact: "Saint Lucia has produced two Nobel Prize winners — more per capita than almost any country on Earth." },
  VCT: { accentColor: "#0072C6", funFact: "Saint Vincent and the Grenadines is made up of one main island and 32 smaller islands and cays." },
  SUR: { accentColor: "#377E3F", funFact: "Suriname is the smallest sovereign country in South America, and the only one where Dutch is the official language." },
  BEN: { accentColor: "#008751", funFact: "Benin is widely considered the birthplace of Vodun (Voodoo), still formally recognized as an official religion." },
  BDI: { accentColor: "#CE1021", funFact: "Burundi's traditional royal drummers, the Abatimbo, perform a centuries-old ceremonial tradition recognized by UNESCO." },
  CPV: { accentColor: "#003893", funFact: "Cape Verde was uninhabited until Portuguese sailors settled it in 1462." },
  CAF: { accentColor: "#003082", funFact: "The Central African Republic was briefly declared the 'Central African Empire' from 1976 to 1979 under self-proclaimed Emperor Bokassa." },
  COM: { accentColor: "#3A75C4", funFact: "Comoros produces the majority of the world's ylang-ylang, an essential oil used in perfumes including Chanel No. 5." },
  DJI: { accentColor: "#6AB2E7", funFact: "Djibouti's Lake Assal is the lowest point in Africa and one of the saltiest bodies of water on Earth." },
  GNQ: { accentColor: "#3E9A00", funFact: "Equatorial Guinea is the only country in Africa where Spanish is an official language." },
  ERI: { accentColor: "#EA0437", funFact: "Eritrea's capital, Asmara, is a UNESCO World Heritage site nicknamed 'Africa's Modernist City' for its Italian Art Deco architecture." },
  SWZ: { accentColor: "#FFD900", funFact: "Eswatini is one of the last absolute monarchies left in the world." },
  GMB: { accentColor: "#CE1126", funFact: "The Gambia is mainland Africa's smallest country, a narrow strip of land almost entirely surrounded by Senegal." },
  GIN: { accentColor: "#CE1126", funFact: "Guinea holds the headwaters of both the Niger and Senegal rivers, two of West Africa's most important waterways." },
  GNB: { accentColor: "#CE1126", funFact: "Guinea-Bissau's Bijagós Archipelago is a UNESCO Biosphere Reserve where several islands are still governed by traditional matrilineal customs." },
  LSO: { accentColor: "#00209F", funFact: "Lesotho is the only country in the world located entirely above 1,000 meters in elevation." },
  LBR: { accentColor: "#002868", funFact: "Liberia was founded by freed African-American and Caribbean settlers in 1822 and became Africa's first republic in 1847." },
  MDG: { accentColor: "#FC3D32", funFact: "Madagascar split from mainland Africa around 160 million years ago, leaving roughly 90% of its wildlife found nowhere else on Earth." },
  MRT: { accentColor: "#00A95C", funFact: "Mauritania holds the Eye of the Sahara — a mysterious 40km-wide geological formation visible from space." },
  MUS: { accentColor: "#EA2839", funFact: "Mauritius was the only known home of the dodo bird, extinct since the late 1600s within decades of human arrival." },
  STP: { accentColor: "#12AD2B", funFact: "São Tomé and Príncipe is Africa's second-smallest country, and once supplied a large share of the world's cocoa." },
  SYC: { accentColor: "#003F87", funFact: "Seychelles' Vallée de Mai holds the coco de mer, a palm producing the largest and heaviest seed in the plant kingdom." },
  SLE: { accentColor: "#1EB53A", funFact: "Sierra Leone's capital, Freetown, was founded in 1792 specifically as a home for freed and formerly enslaved people." },
  SOM: { accentColor: "#4189DD", funFact: "Somalia has the longest coastline of any country in mainland Africa." },
  SSD: { accentColor: "#0F47AF", funFact: "South Sudan is the world's newest country, becoming independent only in 2011." },
  TGO: { accentColor: "#006A4E", funFact: "Togo is one of the narrowest countries in the world relative to its length." },
  KIR: { accentColor: "#CE1126", funFact: "Kiribati is the only country in the world situated in all four hemispheres." },
  MHL: { accentColor: "#003893", funFact: "The Marshall Islands' Bikini Atoll was the site of 23 US nuclear weapons tests between 1946 and 1958." },
  FSM: { accentColor: "#75B2DD", funFact: "Micronesia is home to Nan Madol, a mysterious ancient city built on nearly a hundred artificial islets of massive basalt logs." },
  NRU: { accentColor: "#002B7F", funFact: "Nauru is the world's smallest island nation and the third-smallest country overall." },
  PLW: { accentColor: "#4AADD6", funFact: "Palau's Jellyfish Lake is home to millions of golden jellyfish that have evolved to lose most of their sting." },
  WSM: { accentColor: "#002B7F", funFact: "Samoa moved the International Date Line in 2011, skipping December 30 entirely." },
  SLB: { accentColor: "#0051BA", funFact: "The Solomon Islands were the site of some of the fiercest fighting of WWII's Pacific campaign, including the Battle of Guadalcanal." },
  TON: { accentColor: "#C10000", funFact: "Tonga is the only Pacific nation never formally colonized by a foreign power, maintaining a continuous monarchy for over a thousand years." },
  TUV: { accentColor: "#48B5E4", funFact: "Tuvalu is the world's fourth-smallest country and one of the most vulnerable to sea level rise." },
  VUT: { accentColor: "#D21034", funFact: "Vanuatu is home to Pentecost Island's land diving ritual, widely considered the ancestor of modern bungee jumping." },
};

// ---- Border geometry: ccn3 (numeric) -> cca3, from world-countries --------
const ccn3ToCca3 = new Map(countries.map((c) => [c.ccn3, c.cca3]));

const geo = topojson.feature(topology, topology.objects.countries);

const round = (n) => Math.round(n * 100) / 100;

const worldBorders = geo.features.map((f) => {
  const cca3 = ccn3ToCca3.get(f.id) ?? null;
  const polys =
    f.geometry?.type === "Polygon"
      ? [f.geometry.coordinates]
      : f.geometry?.type === "MultiPolygon"
      ? f.geometry.coordinates
      : [];
  const outerRings = polys
    .map((poly) => poly[0]) // outer ring only, ignore holes (lakes) for now
    .filter(Boolean)
    .map((ring) => ring.map(([lon, lat]) => [round(lon), round(lat)]));

  return {
    id: cca3 ?? `n${f.id}`,
    matched: Boolean(cca3),
    outerRings,
  };
});

const borderCoverage = new Set(worldBorders.filter((b) => b.matched).map((b) => b.id));

// ---- Country attributes ----------------------------------------------------
function callingCode(idd) {
  if (!idd?.root) return undefined;
  if (!idd.suffixes || idd.suffixes.length === 0) return idd.root;
  if (idd.suffixes.length > 5) return idd.root; // shared-code region (e.g. NANP); suffixes are area codes
  return idd.root + idd.suffixes[0];
}

const religionsByCca3 = await loadReligions();

const terraCountries = countries
  .filter((c) => c.independent || c.unMember || c.cca3 === "VAT") // sovereign states + Vatican
  .map((c) => {
    const featured = FEATURED[c.cca3];
    return {
      id: c.cca3,
      cca2: c.cca2,
      ccn3: c.ccn3,
      name: { common: c.name.common, official: c.name.official },
      flagEmoji: c.flag,
      region: c.region,
      subregion: c.subregion || undefined,
      capital: c.capital && c.capital.length ? c.capital : undefined,
      latlng: [c.latlng[0], c.latlng[1]],
      areaKm2: c.area || undefined,
      population: c.population || undefined,
      languages: c.languages ? Object.values(c.languages) : undefined,
      currencies: c.currencies
        ? Object.entries(c.currencies).map(([code, v]) => ({ code, name: v.name, symbol: v.symbol }))
        : undefined,
      callingCode: callingCode(c.idd),
      tld: c.tld && c.tld.length ? c.tld : undefined,
      landlocked: c.landlocked ?? undefined,
      borders: c.borders && c.borders.length ? c.borders : undefined,
      hasBorderGeometry: borderCoverage.has(c.cca3),
      religions: religionsByCca3[c.cca3],
      accentColor: featured?.accentColor,
      funFact: featured?.funFact,
    };
  })
  .sort((a, b) => a.name.common.localeCompare(b.name.common));

// ---- Write output -----------------------------------------------------------
const tsOut =
  `// AUTO-GENERATED by data-prep/prepare-data.mjs — do not hand-edit.\n` +
  `// Sources: world-countries (ODbL); religion composition from Pew Research\n` +
  `// Center, "Religious Composition by Country" (CC BY 4.0) — attribution\n` +
  `// required, see README.md.\n` +
  `import type { Country } from "../types/country";\n\n` +
  `export const COUNTRIES: Country[] = ${JSON.stringify(terraCountries, null, 2)} satisfies Country[];\n`;

writeFileSync(new URL("./out-countries.ts", import.meta.url), tsOut);
writeFileSync(
  new URL("./out-worldBorders.json", import.meta.url),
  JSON.stringify(worldBorders)
);

const religionCoverage = terraCountries.filter((c) => c.religions).length;
console.log(`Countries: ${terraCountries.length}`);
console.log(`Border features: ${worldBorders.length} (matched: ${borderCoverage.size})`);
console.log(`Religion data: ${religionCoverage} / ${terraCountries.length}`);
console.log(`Featured (fun fact) countries: ${Object.keys(FEATURED).length}`);
const unmatchedFeatured = Object.keys(FEATURED).filter((id) => !borderCoverage.has(id));
if (unmatchedFeatured.length) console.log("Featured w/o polygon geometry:", unmatchedFeatured);
