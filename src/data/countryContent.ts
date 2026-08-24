import type { CountryContent } from "../types/country";

/**
 * Phase 2, wave 1: History / Culture / Nature / Food / Landmarks for a
 * curated set of countries spanning every continent. Original wording
 * throughout — nothing copied from any single source. Every field is
 * independent, so a country can have three sections filled in and two
 * still missing; CountryDetailScreen handles that gracefully.
 *
 * Add more countries here over time — this file is hand-maintained, unlike
 * src/data/countries.ts, and re-running scripts/prepare-data.mjs never
 * touches it.
 */
export const COUNTRY_CONTENT: Record<string, CountryContent> = {
  USA: {
    history: [
      { year: "1776", label: "Declaration of Independence signed, breaking from British rule" },
      { year: "1787", label: "US Constitution drafted in Philadelphia" },
      { year: "1861–65", label: "Civil War fought over slavery and the union" },
      { year: "1920", label: "19th Amendment grants women the right to vote" },
      { year: "1969", label: "Apollo 11 lands the first humans on the Moon" },
    ],
    culture:
      "American culture is a patchwork shaped by waves of immigration, regional identity, and a strong tradition of individualism. From jazz and hip-hop to Hollywood film, much of the 20th century's global pop culture originated here, blending influences from Africa, Europe, and Latin America.",
    nature:
      "The country spans nearly every biome on Earth — Arctic tundra in Alaska, desert in the Southwest, temperate rainforest in the Pacific Northwest, and the Everglades' subtropical wetlands in Florida. Yellowstone, established in 1872, was the world's first national park.",
    food: [
      { name: "Barbecue", note: "Slow-smoked meat traditions vary by region — Texas brisket, Carolina pulled pork, Kansas City ribs." },
      { name: "Apple pie", note: "A dessert so tied to national identity it became cultural shorthand for Americana." },
      { name: "Tex-Mex", note: "A border-region fusion of Mexican and American Southern cooking." },
    ],
    landmarks: [
      { name: "Statue of Liberty", note: "A gift from France in 1886, it was the first sight of America for millions of arriving immigrants." },
      { name: "Grand Canyon", note: "Carved by the Colorado River over roughly 5–6 million years, it stretches nearly 450 km." },
      { name: "Golden Gate Bridge", note: "Completed in 1937; its International Orange color was chosen to stand out against San Francisco's fog." },
    ],
  },

  BRA: {
    history: [
      { year: "1500", label: "Portuguese explorers arrive, beginning colonization" },
      { year: "1822", label: "Brazil declares independence from Portugal" },
      { year: "1888", label: "Slavery abolished — the last country in the Americas to do so" },
      { year: "1960", label: "Capital moved from Rio de Janeiro to the newly built city of Brasília" },
    ],
    culture:
      "Brazil's culture blends Indigenous, African, and Portuguese roots into something distinct — samba and Carnival, capoeira, and a deep national passion for football. Rio's Carnival draws millions of visitors each year and ranks among the largest street festivals on Earth.",
    nature:
      "More than half of Brazil is covered by the Amazon rainforest, home to an estimated 10% of all known species on the planet. The country also holds the Pantanal, the world's largest tropical wetland.",
    food: [
      { name: "Feijoada", note: "A hearty black bean and pork stew, considered the national dish." },
      { name: "Pão de queijo", note: "Chewy cheese bread made with tapioca flour, a breakfast staple." },
      { name: "Açaí bowl", note: "A frozen Amazonian berry, blended and topped with granola and fruit." },
    ],
    landmarks: [
      { name: "Christ the Redeemer", note: "Completed in 1931 atop Corcovado mountain, overlooking Rio de Janeiro." },
      { name: "Iguazu Falls", note: "A system of nearly 275 waterfalls shared with Argentina, wider than Niagara." },
      { name: "Amazon River", note: "The largest river by discharge volume on Earth — more water than the next several largest combined." },
    ],
  },

  CHL: {
    history: [
      { year: "1541", label: "Santiago founded by Spanish conquistador Pedro de Valdivia" },
      { year: "1818", label: "Chile declares independence from Spain" },
      { year: "1973–90", label: "Military dictatorship under Augusto Pinochet" },
      { year: "1990", label: "Return to democratic government" },
    ],
    culture:
      "Chilean culture is shaped by extreme geography — hemmed in by the Andes, the Pacific, and the Atacama Desert, it developed a distinct identity. Poetry runs deep here: Chile has produced two Nobel laureates in literature, Gabriela Mistral and Pablo Neruda.",
    nature:
      "Chile's length gives it an extraordinary range of landscapes: the driest non-polar desert on Earth in the north, temperate rainforest and volcanoes in the center-south, and Patagonian glaciers near its tip.",
    food: [
      { name: "Empanadas", note: "Baked pastries filled with beef, onion, olives, and egg." },
      { name: "Curanto", note: "A traditional dish from Chiloé, cooked in a pit with hot stones." },
      { name: "Pastel de choclo", note: "A corn and beef casserole, sweet and savory together." },
    ],
    landmarks: [
      { name: "Easter Island (Rapa Nui)", note: "Home to nearly 900 moai statues carved by the Rapa Nui people, over 3,700 km from the mainland." },
      { name: "Atacama Desert", note: "So dry that some stations have never recorded rainfall; its clear skies make it a hub for astronomy." },
      { name: "Torres del Paine", note: "Granite towers and glacial lakes in Chilean Patagonia." },
    ],
  },

  FRA: {
    history: [
      { year: "1789", label: "French Revolution begins, ending centuries of absolute monarchy" },
      { year: "1804", label: "Napoleon Bonaparte crowned Emperor" },
      { year: "1889", label: "Eiffel Tower completed for the World's Fair" },
      { year: "1944", label: "Liberation of Paris from occupation" },
    ],
    culture:
      "France's cultural exports — fashion, cinema, philosophy, and cuisine — have shaped global taste for centuries. Paris remains a symbolic capital of art and ideas, and French gastronomy was one of the first culinary traditions added to UNESCO's Intangible Cultural Heritage list.",
    nature:
      "From the Alps in the east to the Atlantic coastline in the west, France holds remarkable geographic range within a relatively compact area, including Mont Blanc, Western Europe's highest peak.",
    food: [
      { name: "Croissant", note: "A laminated butter pastry that became a breakfast icon worldwide." },
      { name: "Coq au vin", note: "Chicken braised slowly in red wine, a classic of home cooking." },
      { name: "Cheese", note: "France produces over 1,000 varieties, from Camembert to Roquefort." },
    ],
    landmarks: [
      { name: "Eiffel Tower", note: "Built as a temporary exhibit in 1889, it was nearly torn down before becoming a permanent icon." },
      { name: "Palace of Versailles", note: "The opulent former royal residence, its Hall of Mirrors a symbol of absolute monarchy." },
      { name: "Mont Saint-Michel", note: "A tidal island abbey that appears to float when the tide comes in." },
    ],
  },

  ITA: {
    history: [
      { year: "753 BCE", label: "Traditional founding date of Rome" },
      { year: "27 BCE", label: "Roman Empire begins under Augustus" },
      { year: "1300s–1600s", label: "The Renaissance transforms art, science, and thought" },
      { year: "1861", label: "Italy unifies into a single kingdom" },
    ],
    culture:
      "Italy's regions each carry distinct dialects, cuisines, and traditions — unification came late, in 1861, and local identity remains strong. The country has more UNESCO World Heritage Sites than any other nation.",
    nature:
      "The Apennine mountains run the length of the peninsula, and active volcanoes — Vesuvius, Etna, Stromboli — are a reminder the landscape is still being shaped.",
    food: [
      { name: "Pizza", note: "Born in Naples; the Margherita was reputedly created in 1889 to honor Italy's queen." },
      { name: "Pasta", note: "Hundreds of shapes exist, many tied to specific regions and sauces." },
      { name: "Gelato", note: "Denser and less airy than ice cream, churned slower for a silkier texture." },
    ],
    landmarks: [
      { name: "Colosseum", note: "Completed in 80 CE, it could hold an estimated 50,000–80,000 spectators." },
      { name: "Venice canals", note: "A city built across more than 100 small islands, linked by canals and bridges." },
      { name: "Leaning Tower of Pisa", note: "Its tilt began during construction in the 12th century, due to soft ground." },
    ],
  },

  EGY: {
    history: [
      { year: "3100 BCE", label: "Upper and Lower Egypt unified under the first pharaoh" },
      { year: "2560 BCE", label: "Great Pyramid of Giza completed" },
      { year: "30 BCE", label: "Egypt becomes a Roman province after Cleopatra's death" },
      { year: "1922", label: "Egypt gains independence from British rule" },
      { year: "1971", label: "Aswan High Dam completed, reshaping the Nile's flooding" },
    ],
    culture:
      "Egyptian identity blends Pharaonic, Arab, and Islamic heritage. Cairo is one of the largest cities in the Arab world and a historic center of Islamic scholarship, home to Al-Azhar, one of the oldest universities on Earth.",
    nature:
      "More than 90% of Egypt is desert; nearly all of its population lives along the narrow, fertile Nile River valley and delta.",
    food: [
      { name: "Koshari", note: "A layered dish of rice, lentils, pasta, and spiced tomato sauce — the national dish." },
      { name: "Ful medames", note: "Slow-cooked fava beans, a breakfast staple for centuries." },
      { name: "Molokhia", note: "A leafy green stew, often served with rice or bread." },
    ],
    landmarks: [
      { name: "Great Pyramid of Giza", note: "The last surviving wonder of the ancient world; the tallest structure on Earth for nearly 3,800 years." },
      { name: "Karnak Temple", note: "A vast temple complex built and expanded over roughly 2,000 years." },
      { name: "Abu Simbel", note: "Massive rock temples relocated in the 1960s to save them from flooding by the Aswan Dam." },
    ],
  },

  KEN: {
    history: [
      { year: "1895", label: "British East Africa Protectorate established" },
      { year: "1952–60", label: "Mau Mau uprising against colonial rule" },
      { year: "1963", label: "Kenya gains independence" },
      { year: "1964", label: "Jomo Kenyatta becomes the country's first president" },
    ],
    culture:
      "Kenya is home to more than 40 ethnic groups, each with distinct languages and traditions, unified by Swahili and English as official languages. Long-distance running is a source of enormous national pride — Kenyan athletes have dominated marathon and middle-distance events for decades.",
    nature:
      "The Great Rift Valley cuts through the country, and the annual wildebeest migration across the Maasai Mara is one of the largest wildlife movements on Earth.",
    food: [
      { name: "Ugali", note: "A firm maize porridge, the staple starch of most meals." },
      { name: "Nyama choma", note: "Grilled meat, usually goat or beef, often a centerpiece of gatherings." },
      { name: "Sukuma wiki", note: "Sautéed collard greens, whose name means 'to stretch the week.'" },
    ],
    landmarks: [
      { name: "Maasai Mara", note: "A wildlife reserve famous for the Great Migration of wildebeest and zebra." },
      { name: "Mount Kenya", note: "Africa's second-highest peak, and the country's namesake." },
      { name: "Lake Nakuru", note: "Once famous for vast flocks of flamingos drawn to its alkaline waters." },
    ],
  },

  ZAF: {
    history: [
      { year: "1652", label: "Dutch establish a supply station at the Cape" },
      { year: "1948", label: "Apartheid formally instituted" },
      { year: "1990", label: "Nelson Mandela released after 27 years in prison" },
      { year: "1994", label: "First multiracial democratic elections; Mandela becomes president" },
    ],
    culture:
      "South Africa is often called the 'Rainbow Nation' for its diversity — 12 official languages are recognized, more than any other country. Music played a major role in the anti-apartheid movement and remains central to national identity.",
    nature:
      "The country spans desert, savanna, and Mediterranean-climate fynbos found almost nowhere else on Earth, concentrated in the Cape Floristic Region.",
    food: [
      { name: "Bobotie", note: "Spiced minced meat baked with an egg topping, of Cape Malay origin." },
      { name: "Braai", note: "A social barbecue tradition central to gatherings across the country." },
      { name: "Biltong", note: "Air-dried, cured meat — a popular snack descended from settler preservation methods." },
    ],
    landmarks: [
      { name: "Table Mountain", note: "A flat-topped mountain over Cape Town, part of one of the world's richest plant kingdoms." },
      { name: "Kruger National Park", note: "One of Africa's largest game reserves, home to the 'Big Five.'" },
      { name: "Robben Island", note: "Where Nelson Mandela was imprisoned for 18 of his 27 years in custody." },
    ],
  },

  JPN: {
    history: [
      { year: "794", label: "Heian period begins, a golden age of court culture" },
      { year: "1603", label: "Tokugawa shogunate begins two centuries of isolation" },
      { year: "1868", label: "Meiji Restoration ends the shogunate, rapidly modernizes Japan" },
      { year: "1945", label: "World War II ends after the atomic bombings of Hiroshima and Nagasaki" },
      { year: "1964", label: "Tokyo hosts the first Olympics held in Asia" },
    ],
    culture:
      "Japanese culture balances deep tradition with rapid modernity — tea ceremony and centuries-old shrines coexist with a global pop-culture export machine in anime, manga, and video games.",
    nature:
      "Japan sits on the Pacific Ring of Fire, giving it more than 100 active volcanoes and frequent earthquakes, alongside dramatic seasonal change — cherry blossoms in spring, fiery maple leaves in autumn.",
    food: [
      { name: "Sushi", note: "Vinegared rice paired with seafood, evolved from a fermentation preservation method centuries ago." },
      { name: "Ramen", note: "Wheat noodles in broth, with countless regional styles." },
      { name: "Tempura", note: "Lightly battered, deep-fried seafood and vegetables." },
    ],
    landmarks: [
      { name: "Mount Fuji", note: "Japan's highest peak and an active volcano, considered sacred for centuries." },
      { name: "Fushimi Inari Shrine", note: "Famous for thousands of vermillion torii gates climbing a Kyoto hillside." },
      { name: "Itsukushima Shrine", note: "A shrine whose iconic gate appears to float at high tide." },
    ],
  },

  CHN: {
    history: [
      { year: "221 BCE", label: "Qin Shi Huang unifies China, becomes first emperor" },
      { year: "1279", label: "Yuan dynasty begins — China's first foreign-led dynasty, under the Mongols" },
      { year: "1644", label: "Qing dynasty begins, the last imperial dynasty" },
      { year: "1949", label: "People's Republic of China founded" },
    ],
    culture:
      "Chinese civilization has one of the longest continuous histories on Earth, and its philosophical traditions — Confucianism, Daoism, and later Buddhism — still shape social values today.",
    nature:
      "China's geography ranges from the Himalayas along its southwest border to the Gobi Desert in the north and subtropical forest in the south, supporting enormous biodiversity, including the giant panda's only native habitat.",
    food: [
      { name: "Dumplings (jiaozi)", note: "Often eaten for luck during Lunar New Year celebrations." },
      { name: "Peking duck", note: "Roasted to crisp the skin, a centuries-old imperial dish." },
      { name: "Hot pot", note: "A communal simmering broth where diners cook their own ingredients tableside." },
    ],
    landmarks: [
      { name: "Great Wall of China", note: "Built and rebuilt over centuries by successive dynasties, stretching thousands of kilometers." },
      { name: "Forbidden City", note: "The imperial palace complex in Beijing, home to 24 emperors." },
      { name: "Terracotta Army", note: "Thousands of life-sized clay soldiers buried to guard the first emperor's tomb." },
    ],
  },

  IND: {
    history: [
      { year: "2500 BCE", label: "Indus Valley Civilization flourishes" },
      { year: "268 BCE", label: "Ashoka the Great expands the Mauryan Empire, later embraces Buddhism" },
      { year: "1858", label: "British Crown rule begins after the East India Company era" },
      { year: "1947", label: "India gains independence, partitioned into India and Pakistan" },
    ],
    culture:
      "India is home to the origins of Hinduism, Buddhism, Jainism, and Sikhism, alongside a large Muslim population — few countries hold this density of religious and linguistic diversity. Bollywood produces more films annually than any other national film industry.",
    nature:
      "From the Himalayas in the north to tropical Kerala in the south, India's geography supports an extraordinary range of ecosystems, including the Sundarbans mangrove forest, home to Bengal tigers.",
    food: [
      { name: "Biryani", note: "Layered spiced rice with meat or vegetables, with regional variations across the country." },
      { name: "Dosa", note: "A fermented rice-and-lentil crepe from South India." },
      { name: "Masala chai", note: "Black tea brewed with milk and spices, an everyday ritual." },
    ],
    landmarks: [
      { name: "Taj Mahal", note: "A marble mausoleum built by Emperor Shah Jahan for his wife, completed around 1653." },
      { name: "Varanasi's ghats", note: "Ancient riverside steps along the Ganges, among the oldest continuously inhabited sites in the world." },
      { name: "Hawa Mahal", note: "A honeycombed sandstone palace facade in Jaipur, built to let royal women observe street life unseen." },
    ],
  },

  NPL: {
    history: [
      { year: "1768", label: "Prithvi Narayan Shah unifies Nepal into a single kingdom" },
      { year: "1953", label: "Tenzing Norgay and Edmund Hillary make the first confirmed summit of Everest" },
      { year: "2008", label: "Nepal abolishes its monarchy, becomes a federal republic" },
      { year: "2015", label: "A magnitude 7.8 earthquake devastates the Kathmandu Valley" },
    ],
    culture:
      "Nepal sits at a cultural crossroads between South Asia and Tibet, and Hindu and Buddhist traditions have coexisted here for centuries, often sharing the same temples and festivals.",
    nature:
      "Eight of the world's ten highest peaks lie at least partly within Nepal, including Everest, and the country drops from 8,849m summits to lowland jungle in a remarkably short distance.",
    food: [
      { name: "Momo", note: "Steamed or fried dumplings, Nepal's most iconic street food." },
      { name: "Dal bhat", note: "Lentil soup and rice, the everyday staple eaten across the country." },
      { name: "Sel roti", note: "A ring-shaped rice-flour donut, especially popular during festivals." },
    ],
    landmarks: [
      { name: "Mount Everest", note: "The world's highest peak, straddling the Nepal–Tibet border." },
      { name: "Kathmandu Durbar Square", note: "A cluster of historic palaces and temples at the old royal center." },
      { name: "Phewa Lake, Pokhara", note: "A lake town beneath the Annapurna range, a hub for trekkers." },
    ],
  },

  THA: {
    history: [
      { year: "1238", label: "Sukhothai Kingdom founded, often considered the first Thai state" },
      { year: "1782", label: "Bangkok becomes the capital under the Chakri dynasty" },
      { year: "1932", label: "Constitutional monarchy replaces absolute monarchy" },
      { year: "1997", label: "Asian financial crisis begins in Thailand, spreads across the region" },
    ],
    culture:
      "Thai culture is deeply shaped by Theravada Buddhism, practiced by the vast majority of the population, and by deep respect for the monarchy. The traditional wai greeting reflects a broader cultural emphasis on courtesy and hierarchy.",
    nature:
      "Thailand ranges from dense northern mountain jungle to more than 1,400 islands along its southern coasts, supporting coral reefs, elephants, and some of the region's last wild tigers.",
    food: [
      { name: "Pad thai", note: "Stir-fried rice noodles with egg, tofu or shrimp, and tamarind, popularized nationally in the 1930s–40s." },
      { name: "Tom yum", note: "A hot and sour soup built on lemongrass, galangal, and lime leaf." },
      { name: "Mango sticky rice", note: "Sweet coconut rice paired with ripe mango, a beloved dessert." },
    ],
    landmarks: [
      { name: "Grand Palace", note: "The former royal residence in Bangkok, home to the revered Emerald Buddha." },
      { name: "Ayutthaya", note: "Ruins of a former capital, once one of the world's largest cities before its destruction in 1767." },
      { name: "Phi Phi Islands", note: "Limestone cliffs and turquoise water made famous well beyond Thailand's borders." },
    ],
  },

  AUS: {
    history: [
      { year: "~65,000 BCE", label: "Aboriginal Australians arrive, beginning the world's oldest continuous living culture" },
      { year: "1770", label: "James Cook charts the east coast, claims it for Britain" },
      { year: "1788", label: "First British penal colony established at Sydney Cove" },
      { year: "1901", label: "Australian colonies federate into a single nation" },
    ],
    culture:
      "Aboriginal and Torres Strait Islander cultures represent the longest continuous cultures on Earth, with oral traditions and art stretching back tens of thousands of years. Modern Australian identity blends this deep heritage with a multicultural population shaped by post-war immigration.",
    nature:
      "Isolated for millions of years, Australia evolved a wildly distinct ecosystem — marsupials like kangaroos and koalas, and the Great Barrier Reef, the largest living structure on Earth, visible from space.",
    food: [
      { name: "Meat pie", note: "A handheld savory pie, an everyday lunch staple." },
      { name: "Vegemite on toast", note: "A salty yeast-extract spread that divides outsiders and unites locals." },
      { name: "Barramundi", note: "A prized native fish, common on menus near the coast." },
    ],
    landmarks: [
      { name: "Sydney Opera House", note: "Its sail-like shells took over a decade to build and became a UNESCO World Heritage Site." },
      { name: "Uluru", note: "A massive sandstone monolith sacred to the Anangu people, glowing red at sunset." },
      { name: "Great Barrier Reef", note: "Stretching over 2,300 km, made up of nearly 3,000 individual reefs." },
    ],
  },

  ISL: {
    history: [
      { year: "874", label: "Norse settler Ingólfur Arnarson founds the first permanent settlement" },
      { year: "930", label: "The Althing, one of the world's oldest parliaments, is established" },
      { year: "1944", label: "Iceland becomes a fully independent republic" },
      { year: "2010", label: "Eyjafjallajökull's eruption grounds air travel across much of Europe" },
    ],
    culture:
      "With a population under 400,000, Iceland retains an unusually close relationship to its Norse sagas and folklore — polls have found a majority of residents willing to say they believe elves or hidden folk are at least possible.",
    nature:
      "Sitting on the Mid-Atlantic Ridge, Iceland is one of the most volcanically active places on Earth, with glaciers, geysers, and lava fields often within view of each other.",
    food: [
      { name: "Skyr", note: "A thick, protein-rich dairy product similar to yogurt, eaten for over a thousand years." },
      { name: "Plokkfiskur", note: "A comforting mashed fish and potato dish." },
      { name: "Rúgbrauð", note: "Dense rye bread, traditionally baked using geothermal heat." },
    ],
    landmarks: [
      { name: "Blue Lagoon", note: "A geothermal spa formed from mineral-rich water near a power plant." },
      { name: "Gullfoss", note: "A powerful two-tiered waterfall on the popular 'Golden Circle' route." },
      { name: "Þingvellir", note: "A rift valley where the North American and Eurasian plates are visibly pulling apart — and the site of the original Althing." },
    ],
  },

  CAN: {
    history: [
      { year: "1534", label: "Jacques Cartier claims the land for France" },
      { year: "1763", label: "Treaty of Paris cedes New France to Britain" },
      { year: "1867", label: "Canadian Confederation unites four provinces into one dominion" },
      { year: "1982", label: "Canada patriates its constitution, gaining full independence from the UK" },
    ],
    culture:
      "Canada's identity rests on a foundational tension between English and French heritage — the country is officially bilingual, and Quebec maintains a distinct francophone culture within it. Multiculturalism has been government policy, not just practice, since 1971.",
    nature:
      "Canada holds about a fifth of the world's fresh water and more lakes than the rest of the world combined. Its boreal forest stretches coast to coast, home to grizzly bears, moose, and vast populations of migratory birds.",
    food: [
      { name: "Poutine", note: "Fries topped with cheese curds and gravy, born in rural Quebec in the 1950s." },
      { name: "Butter tarts", note: "A flaky pastry filled with a sweet, gooey butter-and-sugar filling." },
      { name: "Maple syrup", note: "Canada produces roughly 70% of the world's supply, tapped from sugar maples each spring." },
    ],
    landmarks: [
      { name: "Niagara Falls", note: "Shared with the US; the Canadian side, Horseshoe Falls, carries the larger share of the water." },
      { name: "Banff National Park", note: "Canada's first national park, established in 1885 amid the Rocky Mountains." },
      { name: "CN Tower", note: "Once the tallest freestanding structure on Earth, a Toronto icon since 1976." },
    ],
  },

  GBR: {
    history: [
      { year: "1066", label: "Norman Conquest reshapes English language and law" },
      { year: "1215", label: "Magna Carta limits royal power, an early step toward constitutional government" },
      { year: "1707", label: "Acts of Union join England and Scotland into Great Britain" },
      { year: "1945", label: "Britain emerges from WWII and begins decolonization" },
    ],
    culture:
      "The UK's cultural exports run deep, from Shakespeare to the Beatles to the Premier League, and its constitutional monarchy — with no single written constitution — remains one of the world's oldest continuous systems of government.",
    nature:
      "Despite its compact size, the UK ranges from the Scottish Highlands to chalk cliffs and ancient woodland, with a temperate, famously changeable climate shaped by the surrounding Atlantic.",
    food: [
      { name: "Fish and chips", note: "Battered fish and fried potatoes, a working-class staple since the 1860s." },
      { name: "Sunday roast", note: "A weekly tradition of roasted meat, potatoes, and vegetables." },
      { name: "Full English breakfast", note: "Eggs, bacon, sausage, beans, and toast — a hearty start to the day." },
    ],
    landmarks: [
      { name: "Stonehenge", note: "A prehistoric stone circle over 4,500 years old, its purpose still debated." },
      { name: "Big Ben & the Houses of Parliament", note: "The bell's chime has marked time over London since 1859." },
      { name: "Edinburgh Castle", note: "A fortress perched on an extinct volcano, dominating Scotland's capital skyline." },
    ],
  },

  DEU: {
    history: [
      { year: "800", label: "Charlemagne crowned Holy Roman Emperor" },
      { year: "1871", label: "German unification under Prussia creates a single German state" },
      { year: "1933–45", label: "Nazi era and World War II" },
      { year: "1949", label: "Germany divided into East and West" },
      { year: "1990", label: "Reunification after the fall of the Berlin Wall" },
    ],
    culture:
      "Germany's cultural weight spans classical music (Bach, Beethoven) and philosophy (Kant, Nietzsche), alongside a strong regional identity — each of its 16 states retains distinct dialects and traditions, a legacy of Germany's late, 19th-century unification.",
    nature:
      "From the Bavarian Alps in the south to the North Sea coast, Germany balances dense forest — the Black Forest among the most famous — with the Rhine and Danube rivers threading through it.",
    food: [
      { name: "Bratwurst", note: "Grilled sausage, with regional variations across the country." },
      { name: "Sauerkraut", note: "Fermented cabbage, a staple side dish for centuries." },
      { name: "Pretzel (Brezel)", note: "A twisted, lye-dipped bread, a Bavarian beer-hall staple." },
    ],
    landmarks: [
      { name: "Neuschwanstein Castle", note: "A fairy-tale 19th-century castle that inspired Disney's Sleeping Beauty Castle." },
      { name: "Brandenburg Gate", note: "Once a symbol of a divided Berlin, now of reunification." },
      { name: "Cologne Cathedral", note: "A Gothic cathedral that took over 600 years to complete." },
    ],
  },

  ESP: {
    history: [
      { year: "711", label: "Moorish conquest begins nearly 800 years of Islamic rule in parts of Iberia" },
      { year: "1492", label: "Reconquista completes as Granada falls; Columbus reaches the Americas the same year" },
      { year: "1936–39", label: "Spanish Civil War" },
      { year: "1975", label: "Death of Franco ends a 36-year dictatorship; transition to democracy begins" },
    ],
    culture:
      "Spain's regions — Catalonia, the Basque Country, Andalusia among them — maintain distinct languages and identities within the country. Flamenco, bullfighting, and the siesta tradition are cultural touchstones, though customs vary widely by region.",
    nature:
      "Spain is Europe's second-most mountainous country after Switzerland, with a climate spanning lush green Galicia in the northwest to the near-desert landscapes of Almería in the southeast.",
    food: [
      { name: "Paella", note: "A saffron rice dish from Valencia, traditionally cooked over an open fire." },
      { name: "Jamón ibérico", note: "Cured ham from free-range pigs, prized for its marbled fat." },
      { name: "Tapas", note: "Small shared plates — a social eating tradition rather than a single dish." },
    ],
    landmarks: [
      { name: "Sagrada Família", note: "Gaudí's still-unfinished basilica in Barcelona, under construction since 1882." },
      { name: "Alhambra", note: "A Moorish palace and fortress complex in Granada, a masterpiece of Islamic architecture." },
      { name: "Park Güell", note: "Another Gaudí work — a mosaic-tiled public park overlooking Barcelona." },
    ],
  },

  RUS: {
    history: [
      { year: "882", label: "Kievan Rus' unifies Slavic tribes under Oleg of Novgorod" },
      { year: "1547", label: "Ivan IV (\"the Terrible\") crowned the first Tsar of Russia" },
      { year: "1917", label: "Russian Revolution ends imperial rule, leads to the Soviet Union" },
      { year: "1991", label: "Soviet Union dissolves; Russian Federation established" },
    ],
    culture:
      "Russian literature, ballet, and classical music — Tolstoy, Tchaikovsky, the Bolshoi — carry enormous global influence relative to the country's population. Orthodox Christianity has shaped Russian art and architecture for over a thousand years.",
    nature:
      "Russia's Siberian taiga is the largest forest on Earth, and Lake Baikal, over 25 million years old, holds roughly a fifth of the world's unfrozen fresh water.",
    food: [
      { name: "Borscht", note: "A beet soup, often served with sour cream, claimed by several countries in the region." },
      { name: "Pelmeni", note: "Meat-filled dumplings, similar to a smaller, boiled pierogi." },
      { name: "Blini", note: "Thin pancakes, traditionally topped with caviar or sour cream." },
    ],
    landmarks: [
      { name: "Red Square & St. Basil's Cathedral", note: "The colorful, onion-domed cathedral has anchored Moscow's central square since 1561." },
      { name: "The Hermitage", note: "One of the largest art museums in the world, housed in the former Winter Palace in St. Petersburg." },
      { name: "Trans-Siberian Railway", note: "The longest railway line in the world, spanning over 9,200 km." },
    ],
  },

  NGA: {
    history: [
      { year: "1000s", label: "Kingdom of Benin rises to prominence as a major West African power" },
      { year: "1885", label: "Berlin Conference formalizes British claims over the region" },
      { year: "1960", label: "Nigeria gains independence from Britain" },
      { year: "1967–70", label: "Nigerian Civil War (Biafran War)" },
    ],
    culture:
      "Nigeria is home to over 250 ethnic groups and 500 languages, with Hausa, Yoruba, and Igbo the largest. Nollywood, its film industry, produces more titles per year than Hollywood, and Afrobeats has become a major global music export.",
    nature:
      "Nigeria's landscape shifts from mangrove swamps along the coast to savanna in the north, with the Niger and Benue rivers converging near the center of the country.",
    food: [
      { name: "Jollof rice", note: "A spiced, tomato-based rice dish, the center of good-natured rivalry with neighboring countries over whose version is best." },
      { name: "Suya", note: "Skewered, spice-crusted grilled meat, a popular street food." },
      { name: "Egusi soup", note: "A thick soup made from ground melon seeds, often with leafy greens and meat." },
    ],
    landmarks: [
      { name: "Zuma Rock", note: "A massive monolith outside Abuja, sometimes called the 'Gateway to Abuja.'" },
      { name: "Benin City walls", note: "Remnants of what was once one of the largest man-made structures on Earth, built over centuries by the Kingdom of Benin." },
      { name: "Yankari National Park", note: "One of West Africa's largest game reserves, home to elephants and warm springs." },
    ],
  },

  COD: {
    history: [
      { year: "1885", label: "King Leopold II of Belgium claims the territory as his personal property" },
      { year: "1908", label: "Belgian government takes over direct colonial control" },
      { year: "1960", label: "Independence, followed by years of political crisis" },
      { year: "1997", label: "Mobutu Sese Seko's regime falls after over three decades in power" },
    ],
    culture:
      "With over 200 ethnic groups and as many languages, DR Congo is one of the most linguistically diverse countries on Earth; Lingala, Swahili, Kikongo, and Tshiluba serve as national languages alongside French. Congolese rumba, a music genre born here, spread across Africa through the 20th century.",
    nature:
      "The Congo Basin rainforest, the second-largest in the world after the Amazon, covers much of the country and is home to forest elephants, bonobos, and mountain gorillas.",
    food: [
      { name: "Fufu", note: "A dough made from cassava or plantain, the staple accompaniment to most meals." },
      { name: "Moambe chicken", note: "Chicken stewed in palm nut sauce, widely considered a national dish." },
      { name: "Saka saka", note: "Cassava leaves pounded and stewed, often with peanut sauce." },
    ],
    landmarks: [
      { name: "Virunga National Park", note: "Africa's oldest national park, home to critically endangered mountain gorillas." },
      { name: "Congo River", note: "The world's deepest river, and the only major river to cross the equator twice." },
      { name: "Nyiragongo Volcano", note: "One of the few volcanoes on Earth with a persistent lava lake." },
    ],
  },

  COG: {
    history: [
      { year: "1880", label: "French explorer Pierre de Brazza signs a treaty establishing a French protectorate" },
      { year: "1910", label: "Becomes part of French Equatorial Africa" },
      { year: "1960", label: "Independence from France" },
      { year: "1997", label: "Civil war breaks out amid a contested election, ending the following year" },
    ],
    culture:
      "Congolese culture centers heavily on Brazzaville and its deep ties to Congolese rumba and sapologie — a distinctive, flamboyant fashion subculture that turned personal style into an art form.",
    nature:
      "Much of the country lies within the Congo Basin rainforest, and the Kouilou-Niari region holds some of Central Africa's most significant untouched wilderness.",
    food: [
      { name: "Saka saka", note: "Cassava leaves stewed with palm oil, a staple across the country." },
      { name: "Poisson braisé", note: "Grilled fish, often tilapia, seasoned and served whole." },
      { name: "Fufu", note: "Pounded cassava or plantain dough, eaten alongside stews." },
    ],
    landmarks: [
      { name: "Nouabalé-Ndoki National Park", note: "Pristine rainforest home to forest elephants and western lowland gorillas." },
      { name: "Basilique Sainte-Anne", note: "A distinctive green-roofed Brazzaville cathedral, a colonial-era landmark." },
      { name: "Congo River waterfront", note: "Brazzaville sits directly across the river from Kinshasa — the only capital pairing like it in the world." },
    ],
  },

  NZL: {
    history: [
      { year: "1300s", label: "Polynesian voyagers settle the islands, becoming the Māori" },
      { year: "1840", label: "Treaty of Waitangi signed between the British Crown and Māori chiefs" },
      { year: "1893", label: "New Zealand becomes the first country to grant women the right to vote" },
      { year: "1947", label: "Full independence from Britain formalized" },
    ],
    culture:
      "Māori culture is woven into national identity — the haka, the Māori language (te reo), and the Treaty of Waitangi all hold official standing. New Zealand's isolation bred a strong outdoor, adventure-sport culture, from bungee jumping (invented here) to rugby's central role in national life.",
    nature:
      "New Zealand's isolation produced unique wildlife, including flightless birds like the kiwi. Geologically active, it holds geothermal fields, glaciers, and fjords within a relatively small area.",
    food: [
      { name: "Hāngī", note: "Food slow-cooked in an underground earth oven, a traditional Māori method." },
      { name: "Pavlova", note: "A meringue dessert topped with cream and fruit, its origin contested with Australia." },
      { name: "Meat pies", note: "A handheld savory pastry, an everyday lunch staple." },
    ],
    landmarks: [
      { name: "Milford Sound", note: "A fjord in Fiordland National Park, often called the eighth wonder of the world." },
      { name: "Hobbiton", note: "The film set built for The Lord of the Rings and The Hobbit, now a permanent attraction." },
      { name: "Tongariro National Park", note: "New Zealand's oldest national park, a dual UNESCO site for both natural and Māori cultural significance." },
    ],
  },

  TUR: {
    history: [
      { year: "330 CE", label: "Constantinople founded as the new capital of the Roman Empire" },
      { year: "1453", label: "Ottoman conquest of Constantinople ends the Byzantine Empire" },
      { year: "1923", label: "Republic of Turkey founded under Mustafa Kemal Atatürk after the Ottoman Empire's collapse" },
      { year: "1923–38", label: "Atatürk's reforms modernize and secularize the new republic" },
    ],
    culture:
      "Turkey straddles Europe and Asia both geographically and culturally, blending Ottoman, Islamic, and secular republican influences. Istanbul, split by the Bosphorus strait, is the only major city in the world spanning two continents.",
    nature:
      "Turkey's geography ranges from Aegean coastline to the volcanic landscape of Cappadocia, famous for its cave dwellings and hot air balloon flights, and the high plateaus of Anatolia.",
    food: [
      { name: "Kebab", note: "Grilled meat with countless regional variations, from döner to adana." },
      { name: "Baklava", note: "Layers of filo pastry, nuts, and honey syrup, a dessert with roots across the former Ottoman Empire." },
      { name: "Turkish tea (çay)", note: "Brewed strong in a double teapot, a near-constant presence in daily social life." },
    ],
    landmarks: [
      { name: "Hagia Sophia", note: "Built as a cathedral in 537 CE, later a mosque, then a museum, and a mosque again." },
      { name: "Cappadocia", note: "A region of surreal rock formations and centuries-old cave dwellings carved into volcanic stone." },
      { name: "Ephesus", note: "One of the best-preserved ancient cities in the Mediterranean, once a major Roman port." },
    ],
  },

  GRC: {
    history: [
      { year: "508 BCE", label: "Athens establishes democracy, among the first in recorded history" },
      { year: "336–323 BCE", label: "Alexander the Great builds an empire stretching to India" },
      { year: "1453", label: "Fall of Constantinople ends the Byzantine (Eastern Roman) Empire" },
      { year: "1821–32", label: "Greek War of Independence ends nearly 400 years of Ottoman rule" },
    ],
    culture:
      "Greece is often called the birthplace of Western philosophy, theater, and democracy — a legacy that still shapes how the country sees its place in the world. Orthodox Christianity and a strong tradition of hospitality (philoxenia) remain central to daily life.",
    nature:
      "Greece has over 6,000 islands and islets, though only around 230 are inhabited, and its mountainous mainland made isolated regional cultures inevitable for much of its history.",
    food: [
      { name: "Moussaka", note: "Layered eggplant, spiced meat, and béchamel sauce, baked until golden." },
      { name: "Greek salad (horiatiki)", note: "Tomatoes, cucumber, olives, and feta, dressed simply in olive oil." },
      { name: "Souvlaki", note: "Skewered grilled meat, a ubiquitous street food." },
    ],
    landmarks: [
      { name: "The Acropolis & Parthenon", note: "A temple to Athena completed in 438 BCE, overlooking Athens from its hilltop." },
      { name: "Santorini", note: "A crescent-shaped island formed by a massive volcanic eruption around 1600 BCE." },
      { name: "Meteora", note: "Monasteries built atop natural sandstone pillars, some dating to the 14th century." },
    ],
  },

  PRT: {
    history: [
      { year: "1143", label: "Portugal recognized as an independent kingdom" },
      { year: "1415–1999", label: "Portuguese Age of Discovery and colonial empire, from Ceuta to Macau" },
      { year: "1755", label: "Massive earthquake devastates Lisbon, reshaping the city and influencing early seismology" },
      { year: "1974", label: "Carnation Revolution ends decades of dictatorship without significant bloodshed" },
    ],
    culture:
      "Portugal's maritime Age of Discovery — Vasco da Gama, Magellan's expedition — left Portuguese as an official language on four continents. Fado, a melancholic musical genre centered on longing (saudade), remains central to Portuguese identity.",
    nature:
      "From the Douro Valley's terraced vineyards to the Algarve's dramatic coastline and the volcanic Azores islands far out in the Atlantic, Portugal packs varied landscapes into a small footprint.",
    food: [
      { name: "Bacalhau", note: "Salted, dried cod — said to have a different recipe for every day of the year." },
      { name: "Pastéis de nata", note: "Custard tarts with a caramelized top, a Lisbon specialty since the 18th century." },
      { name: "Francesinha", note: "A hearty Porto sandwich, layered with meats and drenched in a spiced beer-tomato sauce." },
    ],
    landmarks: [
      { name: "Belém Tower", note: "A fortified tower in Lisbon built to commemorate Vasco da Gama's voyage to India." },
      { name: "Pena Palace", note: "A vividly colored 19th-century Romanticist palace in Sintra." },
      { name: "Douro Valley", note: "One of the world's oldest demarcated wine regions, terraced along the river since Roman times." },
    ],
  },

  MAR: {
    history: [
      { year: "788", label: "Idrisid dynasty founds Fes, establishing one of the earliest Islamic states in the region" },
      { year: "1912", label: "France and Spain establish protectorates over Morocco" },
      { year: "1956", label: "Morocco regains independence" },
      { year: "1975", label: "The Green March — hundreds of thousands of Moroccans cross into Western Sahara, a territory whose status remains disputed" },
    ],
    culture:
      "Morocco sits at a crossroads of Arab, Berber (Amazigh), and Mediterranean influence, visible in its architecture and cuisine; Tamazight was recognized as an official language alongside Arabic in 2011.",
    nature:
      "Morocco spans the Atlas Mountains, the edge of the Sahara Desert, and both Atlantic and Mediterranean coastlines — a range that lets it host ski resorts and desert dunes within the same country.",
    food: [
      { name: "Tagine", note: "A slow-cooked stew named for the cone-shaped clay pot it's cooked in." },
      { name: "Couscous", note: "Steamed semolina, traditionally served with vegetables and meat on Fridays." },
      { name: "Mint tea", note: "Green tea steeped with fresh mint and sugar, a central ritual of hospitality." },
    ],
    landmarks: [
      { name: "Jemaa el-Fnaa", note: "Marrakesh's central square, a UNESCO-recognized hub of storytellers, musicians, and food stalls each evening." },
      { name: "Hassan II Mosque", note: "One of the largest mosques in the world, its minaret towering 210 meters over Casablanca's coastline." },
      { name: "Chefchaouen", note: "A mountain town famous for its blue-painted buildings and streets." },
    ],
  },

  ETH: {
    history: [
      { year: "~980 BCE", label: "Kingdom of Aksum's origins trace to legends of the Queen of Sheba" },
      { year: "1270", label: "Solomonic dynasty founded, claiming descent from King Solomon" },
      { year: "1896", label: "Battle of Adwa — Ethiopia defeats an invading Italian army, remaining uncolonized" },
      { year: "1974", label: "Emperor Haile Selassie deposed, ending the monarchy" },
    ],
    culture:
      "Ethiopia is one of only two African countries never colonized (with Liberia), and it runs on its own calendar, currently about seven to eight years behind the Gregorian one. It's also home to one of the world's oldest Christian traditions, dating to the 4th century.",
    nature:
      "Ethiopia's Great Rift Valley cuts through the country, and the Simien Mountains hold jagged peaks nicknamed the 'Roof of Africa,' home to species found nowhere else, like the gelada monkey.",
    food: [
      { name: "Injera", note: "A spongy, slightly sour flatbread that doubles as both plate and utensil for most meals." },
      { name: "Doro wat", note: "A spiced chicken stew, often considered the national dish." },
      { name: "Coffee ceremony", note: "An elaborate, hours-long ritual of roasting and brewing coffee — a plant believed to have originated in Ethiopia." },
    ],
    landmarks: [
      { name: "Lalibela's rock-hewn churches", note: "Eleven medieval churches carved directly downward out of solid rock in the 12th–13th centuries." },
      { name: "Simien Mountains", note: "A UNESCO World Heritage site of dramatic escarpments and rare wildlife." },
      { name: "Danakil Depression", note: "One of the hottest, lowest, and most geologically active places on Earth." },
    ],
  },

  KOR: {
    history: [
      { year: "57 BCE", label: "Traditional founding of the Silla Kingdom, one of Korea's Three Kingdoms" },
      { year: "1392", label: "Joseon Dynasty founded, ruling for over 500 years" },
      { year: "1910–45", label: "Japanese colonial rule" },
      { year: "1950–53", label: "Korean War divides the peninsula, ending in armistice rather than a formal peace treaty" },
      { year: "1988", label: "Seoul hosts the Summer Olympics, symbolizing the country's rapid development" },
    ],
    culture:
      "South Korea's transformation from post-war poverty to a global economic and cultural power is matched by its recent soft-power rise through K-pop, K-dramas, and film, including Parasite's historic 2020 Best Picture win.",
    nature:
      "Mountains cover about 70% of South Korea, and its four distinct seasons bring cherry blossoms in spring and vivid foliage in autumn across its national parks.",
    food: [
      { name: "Kimchi", note: "Fermented, spiced vegetables — usually cabbage — served with nearly every meal." },
      { name: "Bibimbap", note: "Rice topped with vegetables, meat, and gochujang chili paste, mixed together before eating." },
      { name: "Korean barbecue", note: "Meat grilled tableside, often wrapped in lettuce with garlic and sauce." },
    ],
    landmarks: [
      { name: "Gyeongbokgung Palace", note: "The largest of Seoul's Five Grand Palaces, first built in 1395." },
      { name: "Jeju Island", note: "A volcanic island home to Hallasan, South Korea's highest peak." },
      { name: "DMZ (Demilitarized Zone)", note: "The heavily fortified buffer between North and South Korea — now, ironically, a haven for wildlife due to decades of limited human activity." },
    ],
  },

  ARG: {
    history: [
      { year: "1516", label: "Spanish explorers first reach the Río de la Plata" },
      { year: "1816", label: "Argentina declares independence from Spain" },
      { year: "1946–55, 1973–74", label: "Juan Perón's presidencies reshape Argentine politics for generations" },
      { year: "1976–83", label: "Military dictatorship, followed by a return to democracy" },
    ],
    culture:
      "Tango originated in the working-class port neighborhoods of Buenos Aires in the late 19th century, blending European, African, and local influences. Football is close to a national religion, and Argentina has produced two of the sport's most celebrated players, Diego Maradona and Lionel Messi.",
    nature:
      "Argentina stretches from subtropical wetlands in the north to Patagonia's glaciers and windswept steppe in the south, including Aconcagua, the highest peak in the Americas.",
    food: [
      { name: "Asado", note: "A slow-cooked barbecue tradition, central to Argentine social life." },
      { name: "Empanadas", note: "Baked or fried pastries with regional fillings, found in nearly every province." },
      { name: "Mate", note: "A caffeinated infusion sipped from a shared gourd through a metal straw, a daily social ritual." },
    ],
    landmarks: [
      { name: "Perito Moreno Glacier", note: "One of the few glaciers in the world still advancing rather than retreating." },
      { name: "Iguazu Falls", note: "Shared with Brazil, a system of waterfalls wider than Niagara." },
      { name: "Recoleta Cemetery", note: "An elaborate Buenos Aires cemetery of ornate mausoleums, including Eva Perón's grave." },
    ],
  },

  NLD: {
    history: [
      { year: "1568–1648", label: "Eighty Years' War wins independence from Spain" },
      { year: "1602", label: "Dutch East India Company founded, the world's first multinational corporation" },
      { year: "1600s", label: "Dutch Golden Age of art, trade, and science" },
      { year: "1944–45", label: "The Hunger Winter during the final months of Nazi occupation" },
    ],
    culture:
      "The Netherlands built its identity partly through hydraulic engineering — roughly a quarter of the country sits below sea level, reclaimed and protected by centuries of dikes and windmills. Dutch directness and a deeply ingrained cycling culture are widely noted national traits.",
    nature:
      "With more bikes than people and famously flat terrain, the Dutch landscape is heavily human-shaped — tulip fields, polders, and windmills are as much engineering as nature.",
    food: [
      { name: "Stroopwafel", note: "A thin waffle sandwich filled with caramel syrup, traditionally warmed atop a hot drink." },
      { name: "Bitterballen", note: "Deep-fried, breaded meat ragout balls, a beloved bar snack." },
      { name: "Dutch cheese", note: "Gouda and Edam are Dutch exports so successful their names became generic terms worldwide." },
    ],
    landmarks: [
      { name: "Anne Frank House", note: "The Amsterdam hiding place where Anne Frank wrote her diary during Nazi occupation." },
      { name: "Keukenhof", note: "One of the world's largest flower gardens, blooming each spring with millions of tulips." },
      { name: "Rijksmuseum", note: "Home to Rembrandt's The Night Watch and centuries of Dutch masters." },
    ],
  },

  SWE: {
    history: [
      { year: "793–1066", label: "Viking Age; Swedish Vikings trade and raid mainly eastward" },
      { year: "1397", label: "Kalmar Union joins Sweden, Denmark, and Norway under one crown" },
      { year: "1523", label: "Gustav Vasa breaks Sweden free of the Kalmar Union" },
      { year: "1814", label: "Sweden's last war — the country has avoided armed conflict ever since" },
    ],
    culture:
      "Sweden's culture prizes lagom, a sense of 'just the right amount,' alongside a modesty often linked to the cultural norm known as Jantelagen. It's also a design and pop-music powerhouse, exporting IKEA, ABBA, and Spotify.",
    nature:
      "With over 100,000 lakes and vast boreal forest, Sweden also sees the midnight sun in its far north, where the sun barely sets in summer.",
    food: [
      { name: "Meatballs (köttbullar)", note: "Served with lingonberry sauce and cream gravy, a national comfort food." },
      { name: "Gravlax", note: "Cured salmon, traditionally with dill and salt rather than smoke." },
      { name: "Fika", note: "Less a dish than a ritual — a coffee-and-pastry break built into the workday." },
    ],
    landmarks: [
      { name: "Vasa Museum", note: "Houses a nearly intact 17th-century warship that sank on its maiden voyage and was recovered 333 years later." },
      { name: "Ice Hotel", note: "Rebuilt each winter from snow and ice in the Arctic town of Jukkasjärvi." },
      { name: "Gamla Stan", note: "Stockholm's medieval old town of narrow cobblestone streets, set on its own island." },
    ],
  },

  NOR: {
    history: [
      { year: "872", label: "Traditional date Harald Fairhair unifies Norway into one kingdom" },
      { year: "1397–1814", label: "Union with Denmark" },
      { year: "1905", label: "Norway peacefully separates from Sweden, becoming fully independent" },
      { year: "1969", label: "North Sea oil discovered, transforming Norway's economy" },
    ],
    culture:
      "Norway channeled its oil wealth into a sovereign wealth fund — now one of the largest in the world — rather than spending it immediately, a decision widely credited for its long-term prosperity. Friluftsliv, or 'open-air living,' shapes a deep cultural attachment to nature.",
    nature:
      "Norway's coastline, carved by glaciers into dramatic fjords, would stretch well over 100,000 km if every inlet were measured, and its Arctic north sees both the midnight sun and the polar night.",
    food: [
      { name: "Fårikål", note: "Mutton and cabbage stew, considered Norway's national dish." },
      { name: "Salmon", note: "Norway is one of the world's largest salmon exporters, much of it farmed along the fjords." },
      { name: "Lefse", note: "A soft flatbread, often served with butter and sugar." },
    ],
    landmarks: [
      { name: "Geirangerfjord", note: "A UNESCO-listed fjord with waterfalls cascading down sheer cliffs." },
      { name: "Preikestolen (Pulpit Rock)", note: "A flat-topped cliff rising 604 meters above a fjord, a popular hiking destination." },
      { name: "Bryggen", note: "Bergen's colorful wooden wharf buildings, dating to the Hanseatic trading era." },
    ],
  },

  DNK: {
    history: [
      { year: "965", label: "Harald Bluetooth's runestone marks Denmark's conversion to Christianity" },
      { year: "1397–1523", label: "Kalmar Union" },
      { year: "1849", label: "Denmark adopts a constitutional monarchy" },
      { year: "1940–45", label: "German occupation during WWII" },
    ],
    culture:
      "Denmark consistently ranks among the world's happiest countries, often linked to hygge — a cultural emphasis on coziness and togetherness — alongside strong social trust and a compact, bike-friendly capital.",
    nature:
      "Denmark is largely flat and low-lying, made up of the Jutland peninsula and over 400 named islands, with a coastline never more than about 50 km from any point in the country.",
    food: [
      { name: "Smørrebrød", note: "Open-faced rye bread sandwiches, elaborately topped." },
      { name: "Danish pastry", note: "Despite the name, its laminated-dough technique actually traces to Austrian bakers." },
      { name: "Frikadeller", note: "Pan-fried meatballs, a home-cooking staple." },
    ],
    landmarks: [
      { name: "The Little Mermaid statue", note: "A Copenhagen harbor statue inspired by Hans Christian Andersen's fairy tale." },
      { name: "Kronborg Castle", note: "The setting Shakespeare used for Hamlet's Elsinore." },
      { name: "Legoland Billund", note: "The original Legoland, built where the toy brick itself was invented." },
    ],
  },

  POL: {
    history: [
      { year: "966", label: "Poland's ruler Mieszko I converts to Christianity, the traditional founding of the Polish state" },
      { year: "1569–1795", label: "Polish–Lithuanian Commonwealth, one of Europe's largest states, later partitioned out of existence" },
      { year: "1918", label: "Poland re-emerges as an independent nation after 123 years of partition" },
      { year: "1939–45", label: "Nazi and Soviet occupation during WWII devastates the country" },
      { year: "1989", label: "The Solidarity movement helps end communist rule" },
    ],
    culture:
      "Poland's deep Catholic identity and history of resilience through repeated partition and occupation shape a strong sense of national continuity. It's also the birthplace of Copernicus, Chopin, and Marie Curie.",
    nature:
      "Poland ranges from Baltic beaches in the north to the Tatra Mountains in the south, and Białowieża Forest holds some of Europe's last primeval woodland, home to free-roaming European bison.",
    food: [
      { name: "Pierogi", note: "Filled dumplings, sweet or savory, boiled or fried." },
      { name: "Bigos", note: "A hearty hunter's stew of sauerkraut, meat, and mushrooms." },
      { name: "Kielbasa", note: "Poland's iconic sausage, with countless regional styles." },
    ],
    landmarks: [
      { name: "Wawel Castle", note: "The former seat of Polish kings, overlooking Kraków from a hill on the Vistula River." },
      { name: "Auschwitz-Birkenau", note: "The largest Nazi concentration and extermination camp, preserved as a memorial and museum." },
      { name: "Wieliczka Salt Mine", note: "A mine worked continuously since the 13th century, with chapels carved entirely from salt." },
    ],
  },

  CHE: {
    history: [
      { year: "1291", label: "Three cantons sign a pact considered the founding of the Swiss Confederation" },
      { year: "1515", label: "Battle of Marignano; Switzerland adopts lasting neutrality afterward" },
      { year: "1815", label: "Congress of Vienna formally recognizes Swiss neutrality" },
      { year: "1863", label: "The International Red Cross is founded in Geneva" },
    ],
    culture:
      "Switzerland's four official languages — German, French, Italian, and Romansh — reflect a country organized around strong local (cantonal) autonomy rather than centralized national identity. Direct democracy runs deep, with citizens voting on referendums several times a year.",
    nature:
      "The Alps cover about 60% of Switzerland, and glacier-fed lakes like Geneva and Lucerne sit among some of Europe's highest peaks, including the Matterhorn.",
    food: [
      { name: "Fondue", note: "Melted cheese for dipping bread, a dish born of Alpine winters and using up hardened cheese." },
      { name: "Rösti", note: "A pan-fried shredded potato cake, originally a farmer's breakfast." },
      { name: "Swiss chocolate", note: "Switzerland pioneered milk chocolate production in the 1870s." },
    ],
    landmarks: [
      { name: "The Matterhorn", note: "One of the most recognizable mountains on Earth, straddling the border with Italy." },
      { name: "Chillon Castle", note: "A moated island castle on Lake Geneva that inspired Byron's poem 'The Prisoner of Chillon.'" },
      { name: "CERN", note: "Home to the Large Hadron Collider and the birthplace of the World Wide Web." },
    ],
  },

  AUT: {
    history: [
      { year: "976", label: "The Babenberg dynasty begins ruling the March of Austria" },
      { year: "1273–1918", label: "Habsburg dynasty rules Austria, and much of Central Europe, for over 600 years" },
      { year: "1918", label: "Austro-Hungarian Empire dissolves after WWI" },
      { year: "1938–45", label: "Annexed by Nazi Germany; regains independence in 1955" },
    ],
    culture:
      "Vienna served as the imperial and cultural capital of Central Europe for centuries, home to Mozart, Beethoven, and Freud, and its coffeehouse culture is recognized by UNESCO as intangible cultural heritage.",
    nature:
      "The Alps cover roughly 60% of Austria, and the country's ski resorts and Danube River valley vineyards define much of its geography.",
    food: [
      { name: "Wiener Schnitzel", note: "A breaded, pan-fried veal cutlet, Austria's signature dish." },
      { name: "Sachertorte", note: "A dense chocolate cake with apricot jam, created in Vienna in 1832." },
      { name: "Kaiserschmarrn", note: "Shredded, caramelized pancake, traditionally dusted with sugar and served with fruit compote." },
    ],
    landmarks: [
      { name: "Schönbrunn Palace", note: "The Habsburgs' summer residence, with 1,441 rooms." },
      { name: "Hallstatt", note: "A lakeside village so picturesque it inspired a full-scale replica built in China." },
      { name: "Vienna State Opera", note: "One of the world's busiest opera houses, staging a different production nearly every night." },
    ],
  },

  IRL: {
    history: [
      { year: "432", label: "Traditional date Saint Patrick begins his mission, later becoming Ireland's patron saint" },
      { year: "1845–52", label: "The Great Famine kills roughly a million people and drives mass emigration" },
      { year: "1916", label: "The Easter Rising challenges British rule in Dublin" },
      { year: "1922", label: "Irish Free State established, ending direct British rule over most of the island" },
    ],
    culture:
      "Ireland's literary output is outsized for its population — Joyce, Yeats, Wilde, and Beckett among its world-renowned writers — and traditional music, storytelling, and pub culture remain central to social life.",
    nature:
      "Ireland's mild, wet climate keeps it green year-round, and its rugged Atlantic coastline, including the Cliffs of Moher, has shaped both its scenery and its historically challenging farming conditions.",
    food: [
      { name: "Irish stew", note: "Lamb or mutton simmered with potatoes and root vegetables." },
      { name: "Soda bread", note: "A quick bread leavened with baking soda rather than yeast." },
      { name: "Irish breakfast", note: "Similar to the full English, with the addition of white and black pudding." },
    ],
    landmarks: [
      { name: "Cliffs of Moher", note: "Sheer Atlantic cliffs rising over 200 meters, among Ireland's most visited natural sites." },
      { name: "Newgrange", note: "A Neolithic passage tomb older than Stonehenge and the Egyptian pyramids." },
      { name: "Guinness Storehouse", note: "A Dublin brewery-turned-museum built around the beer that became a national symbol." },
    ],
  },

  IDN: {
    history: [
      { year: "1293", label: "Majapahit Empire founded, becoming one of the largest empires in Southeast Asian history" },
      { year: "1602", label: "Dutch East India Company begins colonizing the archipelago" },
      { year: "1945", label: "Sukarno declares independence from the Netherlands (formally recognized in 1949)" },
      { year: "1965–66", label: "Political violence and transition to Suharto's 'New Order' government" },
    ],
    culture:
      "Indonesia spans over 17,000 islands and more than 300 ethnic groups, unified partly by the national motto 'Bhinneka Tunggal Ika' — Unity in Diversity. It's the world's largest Muslim-majority country, though Bali remains predominantly Hindu.",
    nature:
      "Indonesia sits on the Pacific Ring of Fire with over 130 active volcanoes, and its rainforests — among the most biodiverse on Earth — are home to orangutans, Komodo dragons, and Sumatran tigers.",
    food: [
      { name: "Nasi goreng", note: "Indonesia's fried rice, often considered a national dish." },
      { name: "Satay", note: "Skewered, grilled meat served with peanut sauce." },
      { name: "Rendang", note: "A slow-cooked, spice-rich beef dish from West Sumatra." },
    ],
    landmarks: [
      { name: "Borobudur", note: "The world's largest Buddhist temple, built in the 9th century." },
      { name: "Komodo National Park", note: "Home to the Komodo dragon, the world's largest living lizard." },
      { name: "Mount Bromo", note: "An active volcano whose smoking crater draws sunrise trekkers." },
    ],
  },

  VNM: {
    history: [
      { year: "111 BCE–939 CE", label: "Chinese rule over Vietnam for roughly a millennium" },
      { year: "1858–1954", label: "French colonial rule" },
      { year: "1954", label: "Vietnam splits into North and South at the 17th parallel" },
      { year: "1975", label: "Fall of Saigon ends the Vietnam War, reunifying the country" },
    ],
    culture:
      "Vietnamese culture blends Confucian, Buddhist, and French colonial influences with a strong tradition of ancestor veneration and community. Its writing evolved from Chinese characters through a unique local script before adopting a Latin-based alphabet under French influence.",
    nature:
      "From Ha Long Bay's limestone karsts to the terraced rice paddies of Sapa and the Mekong Delta's waterways, Vietnam's geography stretches over 1,600 km north to south.",
    food: [
      { name: "Phở", note: "A noodle soup built on a slow-simmered broth, eaten any time of day." },
      { name: "Bánh mì", note: "A baguette sandwich reflecting French colonial influence, filled with Vietnamese ingredients." },
      { name: "Spring rolls", note: "Fresh or fried, wrapped in rice paper or pastry." },
    ],
    landmarks: [
      { name: "Ha Long Bay", note: "Thousands of limestone islands and karsts rising from emerald water." },
      { name: "Hội An", note: "A well-preserved trading port town, lit nightly by colorful lanterns." },
      { name: "Cu Chi Tunnels", note: "An extensive underground tunnel network used during the Vietnam War, now open to visitors." },
    ],
  },

  PHL: {
    history: [
      { year: "1521", label: "Ferdinand Magellan reaches the Philippines, beginning Spanish contact" },
      { year: "1565–1898", label: "Spanish colonial rule for over 300 years" },
      { year: "1898–1946", label: "American colonial rule, interrupted by Japanese occupation in WWII" },
      { year: "1986", label: "People Power Revolution peacefully ends the Marcos dictatorship" },
    ],
    culture:
      "The Philippines blends Malay, Spanish, American, and Chinese influences — it's Asia's largest Christian-majority nation, a legacy of Spanish rule, and English remains a co-official language from the American colonial period. Family and community (bayanihan) are central cultural values.",
    nature:
      "An archipelago of over 7,600 islands, the Philippines sits within the Coral Triangle, one of the most biodiverse marine regions on Earth, and experiences frequent typhoons and volcanic activity along the Pacific Ring of Fire.",
    food: [
      { name: "Adobo", note: "Meat braised in vinegar, soy sauce, and garlic, widely considered the national dish." },
      { name: "Lechon", note: "Whole roasted pig, a centerpiece of celebrations." },
      { name: "Halo-halo", note: "A shaved-ice dessert layered with sweet beans, fruit, and ice cream." },
    ],
    landmarks: [
      { name: "Chocolate Hills", note: "Over 1,200 unusually uniform, cone-shaped hills on Bohol island." },
      { name: "Banaue Rice Terraces", note: "Mountainside terraces carved some 2,000 years ago, still farmed today." },
      { name: "Palawan's Underground River", note: "A navigable underground river through a limestone cave system." },
    ],
  },

  PAK: {
    history: [
      { year: "2500 BCE", label: "Indus Valley Civilization flourishes in the region, among the world's earliest urban cultures" },
      { year: "711", label: "Arab general Muhammad bin Qasim brings Islam to the region" },
      { year: "1947", label: "Pakistan is created via the partition of British India" },
      { year: "1971", label: "East Pakistan secedes to become Bangladesh after civil war" },
    ],
    culture:
      "Pakistan's culture blends South Asian, Persian, and Islamic influences across its provinces — Punjabi, Sindhi, Pashtun, and Baloch traditions each remain distinct. Urdu poetry and Sufi shrine culture both hold deep social significance.",
    nature:
      "Pakistan holds more of the world's high peaks over 8,000m than any country besides Nepal and China, including K2, where three great mountain ranges — the Himalayas, Karakoram, and Hindu Kush — meet.",
    food: [
      { name: "Biryani", note: "Layered spiced rice with meat, a centerpiece of celebrations." },
      { name: "Nihari", note: "A slow-cooked stew, traditionally simmered overnight." },
      { name: "Karahi", note: "Meat cooked quickly in a wok-like pan with tomatoes and spices." },
    ],
    landmarks: [
      { name: "K2", note: "The world's second-highest peak and one of the most dangerous to climb." },
      { name: "Mohenjo-daro", note: "Ruins of a 4,500-year-old Indus Valley city, among the best-preserved Bronze Age sites." },
      { name: "Badshahi Mosque", note: "A 17th-century Mughal-era mosque in Lahore, once the largest in the world." },
    ],
  },

  BGD: {
    history: [
      { year: "1204", label: "Islam spreads through the region under Bakhtiyar Khalji's conquest of Bengal" },
      { year: "1757", label: "Battle of Plassey brings the region under British East India Company control" },
      { year: "1947", label: "Becomes East Pakistan following the partition of British India" },
      { year: "1971", label: "Independence war against Pakistan establishes Bangladesh" },
    ],
    culture:
      "Bangladesh has one of the strongest linguistic-identity movements in the world — the 1952 Language Movement, defending Bengali against imposed Urdu, is honored globally as International Mother Language Day. Music, poetry, especially Tagore and Nazrul, and river life shape daily culture.",
    nature:
      "Bangladesh sits atop the world's largest river delta, formed by the Ganges, Brahmaputra, and Meghna rivers, and holds the Sundarbans, the largest mangrove forest on Earth and home to Bengal tigers.",
    food: [
      { name: "Hilsa fish", note: "Bangladesh's national fish, central to Bengali cuisine." },
      { name: "Biryani", note: "Spiced rice with meat, popular at celebrations." },
      { name: "Pitha", note: "Rice-flour cakes, sweet or savory, especially popular in winter." },
    ],
    landmarks: [
      { name: "Sundarbans", note: "The world's largest mangrove forest, shared with India, home to the Bengal tiger." },
      { name: "Sixty Dome Mosque", note: "A 15th-century UNESCO-listed mosque in Bagerhat." },
      { name: "Cox's Bazar", note: "One of the longest natural sea beaches in the world." },
    ],
  },

  SAU: {
    history: [
      { year: "610", label: "Islam's revelations begin in Mecca" },
      { year: "622", label: "The Hijra — Muhammad's migration to Medina — marks year one of the Islamic calendar" },
      { year: "1932", label: "Ibn Saud unifies the region into the Kingdom of Saudi Arabia" },
      { year: "1938", label: "Discovery of oil transforms the kingdom's economy" },
    ],
    culture:
      "Saudi Arabia holds Islam's two holiest cities, Mecca and Medina, and hosts the annual Hajj pilgrimage, drawing millions of Muslims from around the world each year. In recent years the country has pursued rapid social and economic diversification under its Vision 2030 plan.",
    nature:
      "The Arabian Desert, including the Rub' al Khali (Empty Quarter), one of the largest continuous sand deserts on Earth, dominates the landscape, with a Red Sea coastline supporting extensive coral reefs.",
    food: [
      { name: "Kabsa", note: "Spiced rice with meat, widely considered the national dish." },
      { name: "Dates", note: "A staple food and major export, grown across the country's oases." },
      { name: "Arabic coffee (qahwa)", note: "Lightly roasted, cardamom-spiced coffee, central to hospitality customs." },
    ],
    landmarks: [
      { name: "Masjid al-Haram", note: "The Great Mosque of Mecca, surrounding the Kaaba, Islam's holiest site." },
      { name: "AlUla", note: "An ancient oasis region with pre-Islamic Nabataean tombs carved into rock." },
      { name: "Kingdom Centre Tower", note: "A skybridge-topped skyscraper defining Riyadh's modern skyline." },
    ],
  },

  ARE: {
    history: [
      { year: "1820", label: "General Maritime Treaty establishes British influence over the Trucial States" },
      { year: "1958", label: "Oil discovered in Abu Dhabi, transforming the region's economy" },
      { year: "1971", label: "Six emirates unite to form the UAE (Ras al-Khaimah joins in 1972)" },
      { year: "1985", label: "Emirates airline founded, later becoming a major global carrier" },
    ],
    culture:
      "The UAE's population is overwhelmingly expatriate — Emirati citizens make up roughly a tenth to a sixth of residents — creating one of the most internationally diverse societies on Earth, built rapidly around a federal system of seven semi-autonomous emirates.",
    nature:
      "Much of the UAE sits within the Arabian Desert, though its coastline along the Persian Gulf and mountainous Hajar range in the east add variety to an otherwise arid landscape.",
    food: [
      { name: "Al Machboos", note: "Spiced rice with meat or fish, a Gulf staple similar to biryani." },
      { name: "Luqaimat", note: "Sweet, deep-fried dumplings drizzled with date syrup." },
      { name: "Camel milk", note: "A traditional Bedouin staple, now also sold in flavored, packaged forms." },
    ],
    landmarks: [
      { name: "Burj Khalifa", note: "The tallest building in the world, standing 828 meters over Dubai." },
      { name: "Sheikh Zayed Grand Mosque", note: "One of the world's largest mosques, holding one of the biggest hand-knotted carpets ever made." },
      { name: "Palm Jumeirah", note: "An artificial archipelago shaped like a palm tree, visible from space." },
    ],
  },

  SGP: {
    history: [
      { year: "1819", label: "Stamford Raffles establishes a British trading post" },
      { year: "1942–45", label: "Japanese occupation during WWII" },
      { year: "1963", label: "Joins the Federation of Malaysia" },
      { year: "1965", label: "Expelled from Malaysia, becomes fully independent" },
    ],
    culture:
      "Singapore built a famously multiethnic society from British colonial trade routes — Chinese, Malay, Indian, and Eurasian communities each retain distinct traditions, reflected in four official languages. Its transformation from a small trading port into one of the world's wealthiest nations within a single generation is often cited as a model of rapid development.",
    nature:
      "Despite intense urban density, Singapore has invested heavily in greening the city — Gardens by the Bay and its many parks are part of a deliberate 'City in a Garden' strategy.",
    food: [
      { name: "Chili crab", note: "Stir-fried crab in a sweet, spicy tomato-chili sauce, a signature dish." },
      { name: "Hainanese chicken rice", note: "Poached chicken with rice cooked in chicken fat and broth." },
      { name: "Laksa", note: "A spicy coconut noodle soup blending Chinese and Malay influences." },
    ],
    landmarks: [
      { name: "Marina Bay Sands", note: "A resort topped by a ship-shaped skypark connecting its three towers." },
      { name: "Gardens by the Bay", note: "Futuristic 'Supertree' structures integrating solar power and vertical gardens." },
      { name: "Merlion Park", note: "Home to the half-lion, half-fish statue that symbolizes the city." },
    ],
  },

  MYS: {
    history: [
      { year: "1400", label: "Malacca Sultanate founded, becoming a major trading hub" },
      { year: "1511–1957", label: "Portuguese, then Dutch, then British colonial control in succession" },
      { year: "1957", label: "Federation of Malaya gains independence" },
      { year: "1963", label: "Malaysia forms, joining Malaya with Singapore, Sabah, and Sarawak (Singapore leaves in 1965)" },
    ],
    culture:
      "Malaysia's population is a mix of Malay, Chinese, and Indian communities, each maintaining distinct languages, religions, and festivals, officially celebrated together as a model of multicultural coexistence. Islam is the official religion, though freedom of religion is constitutionally protected.",
    nature:
      "Malaysia's rainforests, among the oldest on Earth, span both the Malay Peninsula and Borneo, home to orangutans, proboscis monkeys, and some of the world's largest flowers, the Rafflesia.",
    food: [
      { name: "Nasi lemak", note: "Coconut rice served with sambal, anchovies, peanuts, and egg — often called the national dish." },
      { name: "Satay", note: "Grilled skewered meat with peanut sauce." },
      { name: "Laksa", note: "A noodle soup with countless regional variations across the country." },
    ],
    landmarks: [
      { name: "Petronas Twin Towers", note: "Once the tallest buildings in the world, connected by a skybridge." },
      { name: "Batu Caves", note: "A limestone hill temple complex reached by 272 colorful steps." },
      { name: "Mount Kinabalu", note: "Borneo's highest peak and a UNESCO World Heritage site." },
    ],
  },

  LKA: {
    history: [
      { year: "247 BCE", label: "Buddhism introduced to the island, becoming central to its culture" },
      { year: "1505–1948", label: "Portuguese, then Dutch, then British colonial rule in succession" },
      { year: "1948", label: "Independence from Britain (as Ceylon; renamed Sri Lanka in 1972)" },
      { year: "1983–2009", label: "Civil war between the government and Tamil separatists" },
    ],
    culture:
      "Sri Lanka's culture reflects a long Buddhist heritage alongside Hindu, Muslim, and Christian communities, with elaborate temple festivals and a strong tradition of classical dance. Its position on ancient trade routes made it a hub for spices, particularly cinnamon.",
    nature:
      "Despite its small size, Sri Lanka holds extraordinary biodiversity, from rainforest and highland tea plantations to dry-zone national parks home to leopards and Asian elephants.",
    food: [
      { name: "Rice and curry", note: "A meal of rice with multiple curries, vegetables, and sambols." },
      { name: "Hoppers (appa)", note: "Bowl-shaped fermented rice-flour pancakes, often with an egg cooked in the center." },
      { name: "Ceylon tea", note: "Grown in the central highlands, among the world's most prized teas." },
    ],
    landmarks: [
      { name: "Sigiriya", note: "An ancient rock fortress rising 200 meters, topped with the ruins of a 5th-century palace." },
      { name: "Temple of the Sacred Tooth Relic", note: "A Kandy temple said to house a tooth of the Buddha." },
      { name: "Yala National Park", note: "One of the best places in the world to spot wild leopards." },
    ],
  },

  GHA: {
    history: [
      { year: "1000s–1900s", label: "Ashanti Empire rises to become one of West Africa's most powerful states" },
      { year: "1482", label: "Portuguese build Elmina Castle, beginning centuries of European trade, including the transatlantic slave trade" },
      { year: "1957", label: "Ghana becomes the first sub-Saharan African country to gain independence from colonial rule" },
      { year: "1966", label: "Kwame Nkrumah, Ghana's first president, overthrown in a coup" },
    ],
    culture:
      "Ghana's independence in 1957 made it a symbol for African liberation movements across the continent. Kente cloth, woven in intricate patterns each carrying symbolic meaning, is among its best-known cultural exports.",
    nature:
      "Ghana's landscape ranges from Atlantic coastline and rainforest in the south to savanna in the north, with Lake Volta, one of the largest artificial lakes in the world by surface area.",
    food: [
      { name: "Jollof rice", note: "A spiced tomato rice dish, claimed proudly — and contested by neighbors — as Ghana's own." },
      { name: "Fufu", note: "Pounded cassava and plantain, served with soup." },
      { name: "Waakye", note: "Rice and beans cooked together, often with a range of accompaniments." },
    ],
    landmarks: [
      { name: "Cape Coast Castle", note: "A former slave-trading fort, now a memorial and UNESCO World Heritage site." },
      { name: "Kakum National Park", note: "A rainforest canopy walkway suspended high above the forest floor." },
      { name: "Lake Volta", note: "One of the largest reservoirs by surface area in the world." },
    ],
  },

  TZA: {
    history: [
      { year: "1498", label: "Vasco da Gama reaches the East African coast" },
      { year: "1885–1919", label: "German East Africa colonial period" },
      { year: "1961", label: "Tanganyika gains independence; Zanzibar follows in 1963" },
      { year: "1964", label: "Tanganyika and Zanzibar merge to form Tanzania" },
    ],
    culture:
      "Tanzania is home to over 120 ethnic groups, unified by Swahili as a national language — a rare case of linguistic unity across such diversity. Zanzibar's Stone Town reflects centuries of Arab, Persian, Indian, and European trade influence.",
    nature:
      "Tanzania holds Mount Kilimanjaro, Africa's highest peak, and the Serengeti, host to the largest terrestrial mammal migration on Earth, alongside the Ngorongoro Crater, an intact volcanic caldera teeming with wildlife.",
    food: [
      { name: "Ugali", note: "A stiff maize porridge, the staple starch across the country." },
      { name: "Nyama choma", note: "Grilled meat, often shared at social gatherings." },
      { name: "Zanzibar pilau", note: "Spiced rice reflecting centuries of Indian Ocean trade influence." },
    ],
    landmarks: [
      { name: "Mount Kilimanjaro", note: "Africa's highest peak and the tallest free-standing mountain in the world." },
      { name: "Serengeti National Park", note: "Home to the annual Great Migration of over a million wildebeest." },
      { name: "Zanzibar's Stone Town", note: "A UNESCO-listed old town of coral-stone buildings and narrow alleys." },
    ],
  },

  UGA: {
    history: [
      { year: "1300s", label: "Buganda Kingdom rises to become the region's dominant power" },
      { year: "1894", label: "Britain establishes the Uganda Protectorate" },
      { year: "1962", label: "Independence from Britain" },
      { year: "1971–79", label: "Idi Amin's rule, marked by widespread violence and economic collapse" },
    ],
    culture:
      "Uganda is home to dozens of ethnic groups, with the Buganda Kingdom retaining a ceremonial monarchy alongside the modern republic. Winston Churchill famously nicknamed it the 'Pearl of Africa' for its lush, varied landscape.",
    nature:
      "Uganda sits at the source of the Nile and holds a significant share of the world's remaining mountain gorillas, alongside the Rwenzori Mountains' glacier-capped peaks near the equator.",
    food: [
      { name: "Matoke", note: "Steamed and mashed green bananas, a staple dish." },
      { name: "Rolex", note: "A rolled chapati with fried eggs and vegetables, a popular street food unrelated to the watch brand it shares a name with." },
      { name: "Luwombo", note: "Meat or vegetables steamed inside banana leaves." },
    ],
    landmarks: [
      { name: "Bwindi Impenetrable Forest", note: "Home to roughly half the world's remaining mountain gorillas." },
      { name: "Source of the Nile", note: "Jinja marks where the world's longest river begins its flow from Lake Victoria." },
      { name: "Rwenzori Mountains", note: "Snow-capped peaks straddling the equator, among Africa's tallest ranges." },
    ],
  },

  SEN: {
    history: [
      { year: "1444", label: "Portuguese traders reach the Senegal coast" },
      { year: "1600s–1800s", label: "Gorée Island becomes a major hub of the transatlantic slave trade" },
      { year: "1960", label: "Independence from France" },
      { year: "1960–80", label: "Léopold Sédar Senghor, also a celebrated poet, serves as Senegal's first president" },
    ],
    culture:
      "Senegal is known for teranga — a deeply held culture of hospitality — and for producing some of West Africa's most influential musicians, including Youssou N'Dour. It has a long history of stable, peaceful transitions of power, unusual in the region.",
    nature:
      "Senegal's landscape ranges from Sahel scrubland in the north to the Sine-Saloum Delta's mangrove estuaries, a haven for migratory birds.",
    food: [
      { name: "Thieboudienne", note: "Fish and rice cooked in a tomato-based sauce with vegetables, widely considered the national dish." },
      { name: "Yassa", note: "Chicken or fish marinated in lemon and onions." },
      { name: "Mafé", note: "A peanut-based stew with meat and vegetables." },
    ],
    landmarks: [
      { name: "Gorée Island", note: "A former slave-trading post off Dakar's coast, now a UNESCO World Heritage memorial site." },
      { name: "African Renaissance Monument", note: "A towering bronze statue overlooking Dakar, among the tallest statues in Africa." },
      { name: "Lake Retba (Lac Rose)", note: "A lake tinted pink by algae, historically mined for salt." },
    ],
  },

  TUN: {
    history: [
      { year: "814 BCE", label: "Carthage founded by Phoenician settlers, later becoming Rome's great rival" },
      { year: "146 BCE", label: "Rome destroys Carthage in the Third Punic War" },
      { year: "1574–1881", label: "Ottoman rule, followed by French protectorate" },
      { year: "2011", label: "The Tunisian Revolution topples the government, sparking the wider Arab Spring" },
    ],
    culture:
      "Tunisia was the birthplace of the Arab Spring in 2011 and is often cited as the movement's one lasting democratic transition. Its culture blends Berber, Arab, Ottoman, and French influences, visible in its cuisine, architecture, and bilingual (Arabic-French) daily life.",
    nature:
      "Tunisia ranges from Mediterranean coastline in the north to the edge of the Sahara in the south, including salt flats (chotts) that shimmer with mirages in summer heat.",
    food: [
      { name: "Couscous", note: "Steamed semolina, Tunisia's most iconic dish, often topped with vegetables, meat, and harissa." },
      { name: "Brik", note: "A thin pastry filled with egg and tuna, fried until crisp." },
      { name: "Harissa", note: "A fiery chili paste that seasons much of Tunisian cuisine." },
    ],
    landmarks: [
      { name: "Carthage ruins", note: "Remnants of the ancient city that once rivaled Rome for Mediterranean dominance." },
      { name: "Medina of Tunis", note: "A UNESCO-listed old town of narrow alleys and centuries-old architecture." },
      { name: "Sahara dunes near Douz", note: "A gateway to the desert, once a filming location for Star Wars." },
    ],
  },

  DZA: {
    history: [
      { year: "202 BCE", label: "Kingdom of Numidia, an early Berber state, rises under Masinissa" },
      { year: "1516–1830", label: "Ottoman rule over Algeria" },
      { year: "1830–1962", label: "French colonial rule" },
      { year: "1954–62", label: "Algerian War of Independence, one of the 20th century's most significant anti-colonial conflicts" },
    ],
    culture:
      "Algeria is Africa's largest country by area, and its culture blends Arab and Berber (Amazigh) heritage — Tamazight was recognized as an official language in 2016. Rai music, born in Oran, became one of Algeria's most influential cultural exports.",
    nature:
      "Over four-fifths of Algeria lies within the Sahara Desert, including the Ahaggar Mountains' dramatic volcanic peaks, while a narrow, fertile Mediterranean strip holds most of the population.",
    food: [
      { name: "Couscous", note: "Steamed semolina, central to Algerian cuisine and recognized as UNESCO Intangible Cultural Heritage alongside neighboring countries." },
      { name: "Chorba", note: "A tomato-based soup, often eaten to break the Ramadan fast." },
      { name: "Merguez", note: "A spiced lamb or beef sausage." },
    ],
    landmarks: [
      { name: "Casbah of Algiers", note: "A UNESCO-listed old quarter of narrow, winding streets overlooking the Mediterranean." },
      { name: "Tassili n'Ajjer", note: "A vast plateau holding thousands of prehistoric rock paintings." },
      { name: "Timgad", note: "Remarkably preserved Roman ruins on the edge of the Sahara." },
    ],
  },

  ZWE: {
    history: [
      { year: "1100–1450", label: "Great Zimbabwe rises as a major trading center, giving the country its later name" },
      { year: "1888", label: "Cecil Rhodes's British South Africa Company gains mining rights, beginning colonial rule" },
      { year: "1965", label: "Rhodesia unilaterally declares independence from Britain under white minority rule" },
      { year: "1980", label: "Independence as Zimbabwe under majority rule" },
    ],
    culture:
      "Zimbabwe takes its name from Great Zimbabwe, the stone-walled city that was once the center of a powerful medieval trading empire. Shona sculpture, working primarily in stone, has become internationally recognized as a distinct modern art form.",
    nature:
      "Zimbabwe holds a share of Victoria Falls, one of the largest waterfalls on Earth, alongside Hwange National Park's substantial elephant population.",
    food: [
      { name: "Sadza", note: "A stiff maize porridge, the staple starch of most meals." },
      { name: "Nyama", note: "Grilled or stewed meat, often served with sadza and greens." },
      { name: "Peanut butter stew (dovi)", note: "Vegetables or meat cooked in a rich peanut sauce." },
    ],
    landmarks: [
      { name: "Victoria Falls", note: "Known locally as 'the smoke that thunders,' among the largest waterfalls in the world by combined width and height." },
      { name: "Great Zimbabwe", note: "Extensive stone ruins of a medieval city, the largest ancient structure in sub-Saharan Africa outside Egypt." },
      { name: "Hwange National Park", note: "Zimbabwe's largest game reserve, home to large elephant herds." },
    ],
  },

  COL: {
    history: [
      { year: "1499", label: "Spanish explorers first reach the Colombian coast" },
      { year: "1819", label: "Simón Bolívar leads Colombia to independence from Spain" },
      { year: "1903", label: "Panama secedes from Colombia, enabling the Panama Canal" },
      { year: "1964–2016", label: "Decades-long armed conflict with FARC guerrillas, ending in a peace accord" },
    ],
    culture:
      "Colombia's culture varies dramatically by region — Caribbean coastal cumbia and vallenato, Andean bambuco, and Pacific-coast Afro-Colombian traditions all coexist. It's also the birthplace of Nobel laureate Gabriel García Márquez and magical realism.",
    nature:
      "Colombia is one of the most biodiverse countries on Earth relative to its size, holding parts of the Amazon, Andes, and Caribbean and Pacific coastlines, and more bird species than any other country.",
    food: [
      { name: "Bandeja paisa", note: "A hearty platter of beans, rice, meat, plantain, and egg." },
      { name: "Arepas", note: "Grilled or fried corn cakes, eaten with nearly every meal." },
      { name: "Ajiaco", note: "A chicken and potato soup from the Bogotá region." },
    ],
    landmarks: [
      { name: "Cartagena's Walled City", note: "A UNESCO-listed colonial port city, ringed by centuries-old fortifications." },
      { name: "Ciudad Perdida", note: "The 'Lost City,' an ancient settlement predating Machu Picchu, reachable only by multi-day trek." },
      { name: "Cocora Valley", note: "Home to the wax palm, Colombia's national tree and the tallest palm species on Earth." },
    ],
  },

  PER: {
    history: [
      { year: "1438–1533", label: "Inca Empire expands to become the largest pre-Columbian empire in the Americas" },
      { year: "1533", label: "Spanish conquistador Francisco Pizarro captures the Inca capital, beginning colonial rule" },
      { year: "1821", label: "Independence declared from Spain" },
      { year: "1980–2000", label: "Internal conflict with the Shining Path insurgency" },
    ],
    culture:
      "Peru's culture blends Indigenous Quechua and Aymara traditions with Spanish colonial and, more recently, Chinese and Japanese immigrant influences — its cuisine, in particular, is considered one of the most dynamic fusion food cultures in the world.",
    nature:
      "Peru holds a stretch of the Amazon rainforest, the high Andes, and an arid Pacific coastline, giving it extraordinary ecological range within a single country.",
    food: [
      { name: "Ceviche", note: "Raw fish cured in citrus juice, widely considered Peru's national dish." },
      { name: "Lomo saltado", note: "Stir-fried beef reflecting Chinese-Peruvian fusion cooking." },
      { name: "Pisco sour", note: "A cocktail made from pisco brandy, a matter of friendly rivalry with Chile over its origin." },
    ],
    landmarks: [
      { name: "Machu Picchu", note: "A 15th-century Inca citadel set high in the Andes, rediscovered by the outside world in 1911." },
      { name: "Nazca Lines", note: "Enormous geoglyphs etched into the desert, visible only from the air." },
      { name: "Lake Titicaca", note: "The highest navigable lake in the world, shared with Bolivia." },
    ],
  },

  VEN: {
    history: [
      { year: "1498", label: "Christopher Columbus becomes the first European to sight Venezuela" },
      { year: "1811", label: "Venezuela becomes one of the first Spanish colonies in South America to declare independence" },
      { year: "1922", label: "Major oil discovery transforms Venezuela into one of the world's leading oil exporters" },
      { year: "1999", label: "Hugo Chávez becomes president, beginning a period of major political change" },
    ],
    culture:
      "Venezuela has produced more Miss Universe and Miss World winners than any other country, and baseball, unusually for South America, is the most popular sport, a legacy of early 20th-century American oil-industry ties.",
    nature:
      "Venezuela holds Angel Falls, the world's tallest waterfall, within the Guiana Highlands' flat-topped tepui plateaus, alongside Caribbean coastline and a share of the Amazon rainforest.",
    food: [
      { name: "Arepas", note: "Grilled corn cakes, split and filled with various ingredients, an everyday staple." },
      { name: "Pabellón criollo", note: "Shredded beef, black beans, rice, and plantain — the national dish." },
      { name: "Hallaca", note: "A cornmeal dish filled with stew and wrapped in plantain leaves, especially for the December holidays." },
    ],
    landmarks: [
      { name: "Angel Falls", note: "The world's tallest uninterrupted waterfall, dropping 979 meters in Canaima National Park." },
      { name: "Mount Roraima", note: "A dramatic tabletop mountain (tepui) said to have inspired Arthur Conan Doyle's The Lost World." },
      { name: "Los Roques Archipelago", note: "A national park of coral islands and turquoise water in the Caribbean." },
    ],
  },

  CUB: {
    history: [
      { year: "1492", label: "Christopher Columbus lands in Cuba on his first voyage" },
      { year: "1898", label: "Spanish–American War ends Spanish rule; Cuba later gains formal independence in 1902" },
      { year: "1959", label: "Fidel Castro's revolution overthrows the Batista government" },
      { year: "1962", label: "The Cuban Missile Crisis brings the US and Soviet Union to the brink of nuclear conflict" },
    ],
    culture:
      "Cuba's culture fuses Spanish and West African heritage, especially audible in son and salsa music and visible in Santería religious traditions. Havana's well-preserved mid-century architecture and classic American cars, kept running for decades under a long US trade embargo, have become iconic images of the country.",
    nature:
      "Cuba is the largest island in the Caribbean, with extensive coral reefs, the Zapata Swamp wetlands, and a mountainous east that shelters some of the region's richest biodiversity.",
    food: [
      { name: "Ropa vieja", note: "Shredded, slow-cooked beef in tomato sauce, widely considered the national dish." },
      { name: "Moros y Cristianos", note: "Black beans and rice cooked together." },
      { name: "Cuban sandwich", note: "Ham, roast pork, cheese, and pickles pressed on bread." },
    ],
    landmarks: [
      { name: "Old Havana", note: "A UNESCO-listed old town of colonial architecture and colorful facades." },
      { name: "Viñales Valley", note: "A tobacco-farming region of dramatic limestone hills called mogotes." },
      { name: "El Capitolio", note: "Havana's grand former capitol building, closely modeled on the US Capitol." },
    ],
  },

  URY: {
    history: [
      { year: "1516", label: "Spanish explorers first arrive in the region" },
      { year: "1828", label: "Uruguay gains independence, in part as a buffer state between Argentina and Brazil" },
      { year: "1930", label: "Uruguay hosts and wins the first FIFA World Cup" },
      { year: "1973–85", label: "Military dictatorship, followed by return to democracy" },
    ],
    culture:
      "Uruguay is one of Latin America's most secular and socially liberal countries, an early adopter of the eight-hour workday and women's suffrage, and more recently of same-sex marriage and cannabis legalization. Mate-drinking is a near-universal daily ritual.",
    nature:
      "Uruguay's landscape is mostly rolling grassland (pampas), supporting a cattle-ranching economy that gives the country one of the highest ratios of livestock to people in the world.",
    food: [
      { name: "Asado", note: "Slow-grilled meat, central to Uruguayan social life, much like in neighboring Argentina." },
      { name: "Chivito", note: "A towering steak sandwich piled with toppings." },
      { name: "Mate", note: "A shared herbal infusion, sipped constantly throughout the day." },
    ],
    landmarks: [
      { name: "Ciudad Vieja, Montevideo", note: "The historic old town, home to colonial-era plazas and architecture." },
      { name: "Punta del Este", note: "A glamorous beach resort city, popular with South American elites." },
      { name: "Colonia del Sacramento", note: "A UNESCO-listed Portuguese colonial town with cobblestone streets." },
    ],
  },

  MEX: {
    history: [
      { year: "1325", label: "Tenochtitlan founded by the Aztecs" },
      { year: "1521", label: "Spanish conquest of the Aztec Empire under Hernán Cortés" },
      { year: "1810", label: "Miguel Hidalgo's Grito de Dolores launches the war for independence" },
      { year: "1846–48", label: "Mexican–American War; Mexico loses roughly half its territory" },
      { year: "1910–20", label: "Mexican Revolution" },
    ],
    culture:
      "Mexico blends Indigenous (Aztec, Maya, and dozens more) and Spanish colonial heritage — Día de los Muertos, mariachi music, and a deeply rooted mural-art tradition (Diego Rivera, Frida Kahlo) all reflect that fusion.",
    nature:
      "From the Sonoran Desert in the north to Yucatán jungle and Pacific and Gulf coastlines, Mexico is one of the most biodiverse countries on Earth, home to millions of overwintering monarch butterflies each year.",
    food: [
      { name: "Tacos", note: "Countless regional fillings on corn or flour tortillas, one of Mexico's most globally recognized exports." },
      { name: "Mole", note: "A complex sauce blending chilies, spices, and often chocolate, with dozens of regional variations." },
      { name: "Tamales", note: "Masa dough steamed in corn husks or banana leaves, a dish with roots in pre-Hispanic Mesoamerica." },
    ],
    landmarks: [
      { name: "Chichén Itzá", note: "A Maya city whose pyramid, El Castillo, aligns precisely with the equinox sun." },
      { name: "Teotihuacan", note: "An ancient city near Mexico City with two of the largest pyramids in the Americas." },
      { name: "Palenque", note: "A Maya city-state deep in the Chiapas jungle, known for its intricately carved temples." },
    ],
  },

  UKR: {
    history: [
      { year: "882", label: "Kievan Rus' established with Kyiv as its capital, the cultural ancestor of Ukraine, Russia, and Belarus" },
      { year: "1240", label: "Mongol invasion destroys Kyiv, ending Kievan Rus'" },
      { year: "1654", label: "The Cossack Hetmanate allies with Muscovy under the Treaty of Pereyaslav" },
      { year: "1932–33", label: "The Holodomor, a man-made famine, kills millions of Ukrainians" },
      { year: "1991", label: "Ukraine becomes independent as the Soviet Union dissolves" },
    ],
    culture:
      "Ukraine's culture centers on a rich folk tradition — vyshyvanka embroidery, Easter pysanky eggs, and bandura music — alongside Kyiv's role as the historic birthplace of Eastern Slavic Orthodox Christianity.",
    nature:
      "Ukraine's black-earth (chernozem) soil is among the most fertile in the world, making the country one of the globe's largest grain exporters, alongside the Carpathian Mountains in its west.",
    food: [
      { name: "Borscht", note: "A beet soup central to Ukrainian identity, inscribed on UNESCO's endangered cultural heritage list." },
      { name: "Varenyky", note: "Dumplings filled with potato, cheese, or fruit, similar to pierogi." },
      { name: "Holubtsi", note: "Cabbage rolls stuffed with meat and rice." },
    ],
    landmarks: [
      { name: "Saint Sophia Cathedral", note: "An 11th-century cathedral in Kyiv, among the oldest standing structures from Kievan Rus'." },
      { name: "Chernobyl Exclusion Zone", note: "Site of the 1986 nuclear disaster, now a tightly controlled historical site." },
      { name: "Lviv's Old Town", note: "A UNESCO-listed city center blending Central European architectural styles." },
    ],
  },

  BEL: {
    history: [
      { year: "1830", label: "Belgium gains independence from the Netherlands" },
      { year: "1885–1908", label: "King Leopold II rules the Congo Free State as his personal property, a brutal chapter later widely condemned" },
      { year: "1914, 1940", label: "Belgium is invaded by Germany in both World Wars" },
      { year: "1958", label: "Brussels hosts the World's Fair, building the Atomium" },
    ],
    culture:
      "Belgium is split between Dutch-speaking Flanders and French-speaking Wallonia, with Brussels itself officially bilingual — a linguistic divide that shapes much of national politics. It's also a hub of European institutions, hosting the EU's main headquarters.",
    nature:
      "Belgium is largely flat and low-lying, with the wooded, hillier Ardennes region in its south standing in contrast to the rest of the country's farmland and coastal dunes.",
    food: [
      { name: "Belgian waffles", note: "Crisper and airier than most, sold widely as street food." },
      { name: "Belgian chocolate", note: "A centuries-old industry, with pralines invented in Brussels in 1912." },
      { name: "Moules-frites", note: "Mussels and fries, a national comfort-food staple." },
    ],
    landmarks: [
      { name: "Grand Place, Brussels", note: "A UNESCO-listed central square ringed by ornate guildhalls." },
      { name: "Atomium", note: "A 102-meter model of an iron crystal, built for the 1958 World's Fair." },
      { name: "Bruges' canals", note: "A well-preserved medieval city often called the 'Venice of the North.'" },
    ],
  },

  FIN: {
    history: [
      { year: "1150s", label: "Sweden begins Christianizing and incorporating Finland" },
      { year: "1809", label: "Finland becomes an autonomous Grand Duchy under the Russian Empire" },
      { year: "1917", label: "Finland declares independence amid the Russian Revolution" },
      { year: "1939–44", label: "Finland fights the Soviet Union in the Winter War and Continuation War" },
    ],
    culture:
      "Finland's culture carries a deep connection to nature and solitude — the sauna, with more saunas than cars in the country, is a near-universal social institution. Finnish is unrelated to its Scandinavian neighbors' languages, part of the smaller Finno-Ugric family.",
    nature:
      "Finland holds roughly 188,000 lakes and vast boreal forest, and its far north lies within the Arctic Circle, where the aurora borealis is regularly visible in winter.",
    food: [
      { name: "Karjalanpiirakka", note: "Rye pastries filled with rice porridge, a Karelian specialty eaten nationwide." },
      { name: "Salmiakki", note: "Salty licorice candy, an acquired taste closely associated with Finnish identity." },
      { name: "Reindeer", note: "Sautéed reindeer meat, especially in Lapland, reflecting Sámi culinary tradition." },
    ],
    landmarks: [
      { name: "Suomenlinna", note: "A sea fortress spanning several islands off Helsinki, built in the 1700s." },
      { name: "Lapland", note: "Finland's Arctic north, home to reindeer herding and the Northern Lights." },
      { name: "Helsinki Cathedral", note: "A neoclassical landmark dominating the capital's skyline." },
    ],
  },

  CZE: {
    history: [
      { year: "870s", label: "Great Moravia adopts Christianity under missionaries Cyril and Methodius" },
      { year: "1346–78", label: "Charles IV's reign makes Prague a great European capital" },
      { year: "1618", label: "The Defenestration of Prague helps trigger the Thirty Years' War" },
      { year: "1989", label: "The Velvet Revolution peacefully ends communist rule" },
      { year: "1993", label: "Czechoslovakia peacefully splits into the Czech Republic and Slovakia" },
    ],
    culture:
      "Czechia has one of the highest beer consumption rates per capita in the world, with a brewing tradition dating back centuries — Pilsner-style lager itself originated in the Czech city of Plzeň in 1842.",
    nature:
      "Czechia is landlocked and largely hilly, ringed by low mountain ranges, with Bohemian Switzerland's sandstone rock formations among its most striking landscapes.",
    food: [
      { name: "Svíčková", note: "Marinated beef in a creamy vegetable sauce, served with bread dumplings." },
      { name: "Trdelník", note: "A rolled, grilled pastry dusted with sugar, popular with tourists in Prague." },
      { name: "Czech beer", note: "Pilsner lager, a style invented in Plzeň, remains a defining national export." },
    ],
    landmarks: [
      { name: "Prague Castle", note: "One of the largest ancient castle complexes in the world." },
      { name: "Charles Bridge", note: "A 14th-century stone bridge lined with baroque statues." },
      { name: "Český Krumlov", note: "A fairy-tale medieval town built around a bend in the Vltava River." },
    ],
  },

  HUN: {
    history: [
      { year: "895", label: "Magyar tribes settle the Carpathian Basin under Árpád" },
      { year: "1000", label: "Stephen I crowned as Hungary's first Christian king" },
      { year: "1526", label: "Ottoman victory at Mohács begins over 150 years of Ottoman rule over much of Hungary" },
      { year: "1956", label: "The Hungarian Revolution against Soviet control is crushed by Soviet troops" },
      { year: "1989", label: "Hungary opens its border with Austria, accelerating the fall of the Iron Curtain" },
    ],
    culture:
      "Hungarian is unrelated to nearly every neighboring language, part of the Uralic family alongside Finnish and Estonian, reinforcing a strong sense of distinct national identity. Thermal bathing culture, inherited partly from Ottoman rule, remains central to daily life in Budapest.",
    nature:
      "Hungary holds Lake Balaton, Central Europe's largest lake, and the Great Hungarian Plain (Puszta), a wide grassland historically home to horse-herding traditions.",
    food: [
      { name: "Goulash", note: "A paprika-spiced meat and vegetable stew, Hungary's best-known dish." },
      { name: "Chimney cake (kürtőskalács)", note: "A rolled, caramelized pastry cooked over open coals." },
      { name: "Paprika", note: "Hungary is one of the world's largest producers of this signature spice." },
    ],
    landmarks: [
      { name: "Buda Castle", note: "A former royal palace overlooking the Danube in Budapest." },
      { name: "Hungarian Parliament Building", note: "One of Europe's largest legislative buildings, lit dramatically along the riverbank at night." },
      { name: "Lake Balaton", note: "Central Europe's largest lake, a major summer resort area." },
    ],
  },

  ROU: {
    history: [
      { year: "106", label: "Roman Emperor Trajan conquers Dacia, giving Romania its name and Latin-based language" },
      { year: "1859", label: "Wallachia and Moldavia unite to form the basis of modern Romania" },
      { year: "1947", label: "Romania becomes a communist state under Soviet influence" },
      { year: "1989", label: "Nicolae Ceaușescu's dictatorship is overthrown in a violent revolution" },
    ],
    culture:
      "Romanian is a Romance language, a linguistic island of Latin heritage surrounded by Slavic-speaking neighbors. Transylvania's blend of Romanian, Hungarian, and Saxon German influence gave rise to the Dracula legend, loosely inspired by 15th-century ruler Vlad the Impaler.",
    nature:
      "The Carpathian Mountains arc through the country, sheltering some of Europe's largest remaining populations of brown bears and wolves, while the Danube Delta forms one of the continent's most important wetlands.",
    food: [
      { name: "Sarmale", note: "Cabbage rolls stuffed with spiced meat and rice, a staple at celebrations." },
      { name: "Mămăligă", note: "A cornmeal porridge similar to polenta, a historic peasant staple." },
      { name: "Papanași", note: "Fried or boiled dumplings served with sour cream and jam." },
    ],
    landmarks: [
      { name: "Bran Castle", note: "A medieval castle popularly associated with the Dracula legend." },
      { name: "Painted Monasteries of Bucovina", note: "16th-century monasteries famous for elaborate exterior frescoes." },
      { name: "Danube Delta", note: "Europe's largest and best-preserved river delta, a UNESCO biosphere reserve." },
    ],
  },

  BGR: {
    history: [
      { year: "681", label: "The First Bulgarian Empire is founded, one of Europe's oldest states to keep its original name" },
      { year: "1396", label: "The Ottoman Empire conquers Bulgaria, beginning nearly 500 years of rule" },
      { year: "1878", label: "Bulgaria regains independence after the Russo-Turkish War" },
      { year: "1946–90", label: "Communist rule under the Bulgarian Communist Party" },
    ],
    culture:
      "Bulgaria claims one of Europe's oldest continuous national identities, and it's also believed to be the birthplace of yogurt — the bacterium that helps ferment it, Lactobacillus bulgaricus, is named for the country.",
    nature:
      "Bulgaria's Balkan and Rila mountain ranges hold some of Southeastern Europe's highest peaks, alongside a Black Sea coastline lined with beach resorts.",
    food: [
      { name: "Banitsa", note: "A flaky pastry filled with cheese and eggs, a breakfast staple." },
      { name: "Shopska salad", note: "Tomatoes, cucumbers, peppers, and grated cheese, Bulgaria's iconic salad." },
      { name: "Yogurt", note: "Bulgarian-style yogurt is internationally recognized for its distinct tang." },
    ],
    landmarks: [
      { name: "Rila Monastery", note: "A richly frescoed Orthodox monastery founded in the 10th century." },
      { name: "Plovdiv's Old Town", note: "One of Europe's oldest continuously inhabited cities, with a well-preserved Roman amphitheater." },
      { name: "Seven Rila Lakes", note: "A chain of glacial lakes high in the Rila Mountains." },
    ],
  },

  SRB: {
    history: [
      { year: "1217", label: "The Kingdom of Serbia is established under Stefan the First-Crowned" },
      { year: "1389", label: "The Battle of Kosovo becomes a defining, mythologized moment in Serbian national memory" },
      { year: "1459–1804", label: "Ottoman rule over Serbia" },
      { year: "1918", label: "Serbia becomes a founding part of the Kingdom of Yugoslavia" },
    ],
    culture:
      "Serbian culture carries deep Orthodox Christian roots, and Slava — a family's celebration of its patron saint — is one of its most distinctive traditions, passed down through generations regardless of where a family lives.",
    nature:
      "Serbia is landlocked, with the Danube and its tributaries carving through fertile plains in the north and forested mountains in the south.",
    food: [
      { name: "Ćevapi", note: "Grilled minced-meat sausages, popular across the former Yugoslavia." },
      { name: "Rakija", note: "A strong fruit brandy, central to hospitality and celebration." },
      { name: "Sarma", note: "Cabbage rolls stuffed with meat and rice, especially popular in winter." },
    ],
    landmarks: [
      { name: "Belgrade Fortress", note: "A fortress at the confluence of the Sava and Danube rivers, with a history spanning over two millennia." },
      { name: "Studenica Monastery", note: "A UNESCO-listed 12th-century monastery of white marble." },
      { name: "Đavolja Varoš (Devil's Town)", note: "A field of unusual eroded rock formations in southern Serbia." },
    ],
  },

  HRV: {
    history: [
      { year: "925", label: "Tomislav becomes Croatia's first king, uniting the region" },
      { year: "1102", label: "Croatia enters a personal union with Hungary" },
      { year: "1918", label: "Croatia joins the Kingdom of Yugoslavia" },
      { year: "1991–95", label: "Croatia fights a war of independence following Yugoslavia's breakup" },
    ],
    culture:
      "Croatia's Adriatic coast reflects centuries of Venetian influence, especially visible in Dalmatian architecture and cuisine, while its inland regions carry stronger Central European character.",
    nature:
      "Croatia's coastline includes over a thousand islands, and Plitvice Lakes National Park holds a cascading chain of turquoise lakes and waterfalls.",
    food: [
      { name: "Pašticada", note: "Slow-braised beef in a rich wine sauce, a Dalmatian specialty." },
      { name: "Burek", note: "A flaky, filled pastry, popular across the former Yugoslavia." },
      { name: "Fresh seafood", note: "Grilled fish and shellfish are staples along the Adriatic coast." },
    ],
    landmarks: [
      { name: "Plitvice Lakes National Park", note: "Sixteen terraced lakes connected by waterfalls, Croatia's most famous natural site." },
      { name: "Dubrovnik's Old Town", note: "A walled medieval city on the Adriatic, a UNESCO World Heritage site." },
      { name: "Diocletian's Palace", note: "A Roman emperor's retirement palace forming the core of modern Split." },
    ],
  },

  LTU: {
    history: [
      { year: "1253", label: "Mindaugas crowned king, marking Lithuania's founding as a Christian kingdom" },
      { year: "1386–1569", label: "Lithuania and Poland unite, eventually forming one of Europe's largest states" },
      { year: "1795", label: "Lithuania is absorbed into the Russian Empire" },
      { year: "1990", label: "Lithuania becomes the first Soviet republic to declare independence" },
    ],
    culture:
      "Lithuanian is considered one of the most conservative living Indo-European languages, retaining features linguists trace back thousands of years. Amber, washed ashore from the Baltic Sea, has been worked into jewelry here since prehistoric times.",
    nature:
      "Lithuania's Curonian Spit, a narrow strip of shifting sand dunes separating a lagoon from the Baltic Sea, is a UNESCO World Heritage site.",
    food: [
      { name: "Cepelinai", note: "Potato dumplings filled with meat, named for their zeppelin-like shape." },
      { name: "Šaltibarščiai", note: "A vivid pink, chilled beet soup served in summer." },
      { name: "Kibinai", note: "Pastries filled with meat, a specialty of the Karaim community in Trakai." },
    ],
    landmarks: [
      { name: "Trakai Island Castle", note: "A red-brick castle set on an island in a lake near Vilnius." },
      { name: "Hill of Crosses", note: "A pilgrimage site covered in tens of thousands of crosses." },
      { name: "Curonian Spit", note: "A UNESCO-listed dune landscape shared with Russia's Kaliningrad region." },
    ],
  },

  LVA: {
    history: [
      { year: "1201", label: "German crusaders found Riga, beginning centuries of foreign rule over the region" },
      { year: "1721", label: "Russia gains control of Latvian territory from Sweden" },
      { year: "1918", label: "Latvia declares independence after WWI" },
      { year: "1940–91", label: "Soviet occupation, interrupted by Nazi occupation during WWII" },
    ],
    culture:
      "Latvia has one of the largest collections of folk songs (dainas) in the world, numbering well over a million recorded verses, central to a national song-and-dance festival tradition recognized by UNESCO.",
    nature:
      "Latvia is heavily forested, with over half its land covered in woodland, alongside a Baltic Sea coastline of white sand beaches.",
    food: [
      { name: "Rye bread", note: "A dense, dark bread central to Latvian cuisine and identity." },
      { name: "Piragi", note: "Small pastries filled with bacon and onion." },
      { name: "Cold beet soup", note: "Similar to its Lithuanian neighbor's, served chilled in summer." },
    ],
    landmarks: [
      { name: "Riga's Old Town", note: "A UNESCO-listed medieval center with notable Art Nouveau architecture." },
      { name: "Rundāle Palace", note: "A baroque palace often called the 'Versailles of Latvia.'" },
      { name: "Gauja National Park", note: "Latvia's largest national park, with sandstone cliffs and medieval castle ruins." },
    ],
  },

  EST: {
    history: [
      { year: "1227", label: "Northern Crusades bring the region under foreign Christian rule" },
      { year: "1918", label: "Estonia declares independence" },
      { year: "1940–91", label: "Soviet occupation, interrupted by Nazi occupation during WWII" },
      { year: "1991", label: "Estonia restores independence and later pioneers digital government services" },
    ],
    culture:
      "Estonia is often called 'E-stonia' for its embrace of digital governance — nearly all public services, including voting, can be done online. Its language is closely related to Finnish, part of the Finno-Ugric family rather than the Baltic languages of its neighbors.",
    nature:
      "Estonia is dotted with over 1,500 islands and holds extensive bog and wetland ecosystems, remnants of the last ice age.",
    food: [
      { name: "Verivorst", note: "Blood sausage, a traditional Christmas dish." },
      { name: "Kama", note: "A mix of roasted ground grains, traditionally blended with buttermilk or kefir." },
      { name: "Baltic herring", note: "A staple fish, smoked, pickled, or fried." },
    ],
    landmarks: [
      { name: "Tallinn's Old Town", note: "One of Europe's best-preserved medieval city centers, a UNESCO World Heritage site." },
      { name: "Lahemaa National Park", note: "Estonia's largest national park, with coastal bogs and manor houses." },
      { name: "Kadriorg Palace", note: "A baroque palace built by Peter the Great in Tallinn." },
    ],
  },

  BLR: {
    history: [
      { year: "1067", label: "Polotsk emerges as an early center of Slavic culture in the region" },
      { year: "1569", label: "Belarus becomes part of the Polish–Lithuanian Commonwealth" },
      { year: "1795", label: "Absorbed into the Russian Empire" },
      { year: "1991", label: "Belarus becomes independent as the Soviet Union dissolves" },
    ],
    culture:
      "Belarus suffered some of the heaviest losses of any country in WWII, with roughly a quarter of its population killed — a memory that remains central to national identity. Its capital, Minsk, was almost entirely rebuilt after the war in monumental Soviet style.",
    nature:
      "Belarus is largely flat, covered in forest and wetland, and shares the Białowieża Forest with Poland — one of Europe's last remaining tracts of primeval woodland.",
    food: [
      { name: "Draniki", note: "Fried potato pancakes, a national staple." },
      { name: "Machanka", note: "Pork stew served with pancakes for dipping." },
      { name: "Kolduny", note: "Small dumplings filled with meat or mushrooms." },
    ],
    landmarks: [
      { name: "Mir Castle", note: "A UNESCO-listed 16th-century castle blending Gothic, Baroque, and Renaissance styles." },
      { name: "Białowieża Forest", note: "Ancient woodland shared with Poland, home to free-roaming European bison." },
      { name: "Nesvizh Palace", note: "A former residence of the powerful Radziwiłł family." },
    ],
  },

  CYP: {
    history: [
      { year: "1571", label: "The Ottoman Empire conquers Cyprus from Venice" },
      { year: "1878", label: "Britain takes administrative control" },
      { year: "1960", label: "Cyprus becomes independent from Britain" },
      { year: "1974", label: "The island is divided following a coup and subsequent military intervention, a division that persists" },
    ],
    culture:
      "Cyprus sits at a crossroads of Greek and Turkish culture, reflected in its cuisine, language, and the island's continuing division into Greek Cypriot and Turkish Cypriot administered areas.",
    nature:
      "Cyprus's Troodos Mountains rise from a Mediterranean coastline, and the island holds some of the oldest known wine-producing regions in the world.",
    food: [
      { name: "Halloumi", note: "A semi-hard cheese that holds its shape when grilled, one of Cyprus's best-known exports." },
      { name: "Souvlaki", note: "Grilled skewered meat, widely shared with Greek cuisine." },
      { name: "Commandaria", note: "A sweet dessert wine with a documented history stretching back over 2,000 years." },
    ],
    landmarks: [
      { name: "Paphos Archaeological Park", note: "Roman-era mosaics and ruins, a UNESCO World Heritage site." },
      { name: "Kyrenia Castle", note: "A Byzantine-era castle on the island's northern coast." },
      { name: "Troodos Mountains", note: "Home to painted Byzantine churches, also UNESCO-listed." },
    ],
  },
  IRQ: {
    history: [
      { year: "~3500 BCE", label: "Sumerians develop the world's first writing system in Mesopotamia" },
      { year: "1792 BCE", label: "Hammurabi's Babylon issues one of history's earliest law codes" },
      { year: "762", label: "Baghdad founded, becoming a golden-age center of science and learning under the Abbasid Caliphate" },
      { year: "1932", label: "Iraq gains independence from British administration" },
    ],
    culture:
      "Iraq sits within the 'Cradle of Civilization,' the land between the Tigris and Euphrates where writing, the wheel, and the first cities are all believed to have emerged. Baghdad's House of Wisdom made it a global center of translation and scholarship in the medieval Islamic Golden Age.",
    nature:
      "The Tigris and Euphrates rivers, whose waters shaped the earliest civilizations, still define Iraq's geography, feeding the Mesopotamian Marshes in the south, once one of the largest wetland ecosystems in the Middle East.",
    food: [
      { name: "Masgouf", note: "Grilled, split whole fish, often considered Iraq's national dish." },
      { name: "Dolma", note: "Vegetables or grape leaves stuffed with rice and meat." },
      { name: "Kebab", note: "Grilled skewered meat, prepared in many regional styles." },
    ],
    landmarks: [
      { name: "Ziggurat of Ur", note: "A roughly 4,000-year-old stepped temple, one of the best-preserved structures from ancient Mesopotamia." },
      { name: "Babylon ruins", note: "Remains of one of the ancient world's most legendary cities." },
      { name: "Al-Mustansiriya Madrasah", note: "A 13th-century Baghdad institution, among the world's oldest universities." },
    ],
  },

  IRN: {
    history: [
      { year: "550 BCE", label: "Cyrus the Great founds the Achaemenid Persian Empire, one of history's largest empires" },
      { year: "651", label: "Arab conquest brings Islam to Persia" },
      { year: "1501", label: "The Safavid dynasty establishes Shia Islam as Iran's state religion" },
      { year: "1979", label: "The Iranian Revolution ends the monarchy and establishes an Islamic Republic" },
    ],
    culture:
      "Iran's Persian cultural heritage — poetry (Hafez, Rumi, Ferdowsi), miniature painting, and garden design — has influenced art across the Islamic world for over a thousand years. Nowruz, the Persian New Year marking the spring equinox, is celebrated across Central Asia and the Caucasus, not just Iran.",
    nature:
      "Iran's geography ranges from the Alborz and Zagros mountain ranges to the Dasht-e Kavir and Dasht-e Lut deserts, among the hottest and driest places on Earth.",
    food: [
      { name: "Kebab", note: "Grilled meat, often served with saffron rice, a cornerstone of Iranian cuisine." },
      { name: "Ghormeh sabzi", note: "A fragrant herb stew with kidney beans and dried lime." },
      { name: "Tahdig", note: "The crispy, golden rice formed at the bottom of the pot, prized as a delicacy." },
    ],
    landmarks: [
      { name: "Persepolis", note: "The ceremonial capital of the Achaemenid Empire, founded around 518 BCE." },
      { name: "Naqsh-e Jahan Square", note: "One of the largest city squares in the world, ringed by Safavid-era mosques and palaces in Isfahan." },
      { name: "Golestan Palace", note: "A Qajar-era royal complex in Tehran, blending Persian and European styles." },
    ],
  },

  SYR: {
    history: [
      { year: "~3000 BCE", label: "Ebla emerges as a major early Syrian city-state" },
      { year: "64 BCE", label: "Rome annexes Syria, and Damascus grows into a major provincial capital" },
      { year: "661–750", label: "Damascus serves as the capital of the Umayyad Caliphate, one of history's largest empires" },
      { year: "1946", label: "Syria gains full independence from French administration" },
    ],
    culture:
      "Damascus is widely considered one of the oldest continuously inhabited cities in the world, and Syria's position on ancient trade routes left a legacy of remarkable architectural and culinary diversity across its historic cities.",
    nature:
      "Syria's landscape ranges from the fertile Orontes River valley to the eastern steppe bordering the Syrian Desert, historically part of the Fertile Crescent.",
    food: [
      { name: "Kibbeh", note: "Bulgur and minced meat, shaped and stuffed in countless regional variations." },
      { name: "Hummus & baba ghanoush", note: "Chickpea and eggplant dips, shared widely across the Levant." },
      { name: "Baklava", note: "Layered filo pastry with nuts and syrup, with Aleppo among the dish's most renowned centers." },
    ],
    landmarks: [
      { name: "Umayyad Mosque", note: "One of the oldest and largest mosques in the world, in the heart of old Damascus." },
      { name: "Palmyra", note: "Ruins of an ancient caravan city that once linked Rome to Persia and China." },
      { name: "Krak des Chevaliers", note: "One of the best-preserved Crusader castles in the world." },
    ],
  },

  LBN: {
    history: [
      { year: "~1200 BCE", label: "The Phoenicians, based in coastal cities like Byblos and Tyre, spread the alphabet across the Mediterranean" },
      { year: "64 BCE", label: "Rome annexes the region" },
      { year: "1920", label: "The French Mandate creates the modern borders of Lebanon" },
      { year: "1975–90", label: "The Lebanese Civil War" },
    ],
    culture:
      "Lebanon is credited as the birthplace of the alphabet, spread across the Mediterranean by Phoenician traders over 3,000 years ago. Beirut has long been known as a cosmopolitan crossroads of Christian, Muslim, and Druze communities.",
    nature:
      "Lebanon's Mount Lebanon range rises steeply from the Mediterranean coast, and its ancient cedar forests, though much reduced, remain a national symbol, appearing on the country's flag.",
    food: [
      { name: "Hummus & tabbouleh", note: "Chickpea dip and a parsley-forward herb salad, both central to Lebanese mezze." },
      { name: "Kibbeh", note: "Bulgur and minced meat, often considered Lebanon's national dish." },
      { name: "Manakish", note: "Flatbread topped with za'atar or cheese, a common breakfast." },
    ],
    landmarks: [
      { name: "Baalbek", note: "Home to some of the largest and best-preserved Roman temple ruins in the world." },
      { name: "Byblos", note: "One of the oldest continuously inhabited cities on Earth and a hub of Phoenician trade." },
      { name: "Cedars of God", note: "An ancient, protected grove of Lebanon's iconic cedar trees." },
    ],
  },

  JOR: {
    history: [
      { year: "312 BCE", label: "The Nabataeans establish Petra as their capital, growing wealthy from trade routes" },
      { year: "106", label: "Rome annexes the Nabataean kingdom" },
      { year: "1921", label: "The Emirate of Transjordan is established under British administration" },
      { year: "1946", label: "Jordan becomes fully independent" },
    ],
    culture:
      "Jordan's Bedouin heritage remains a strong thread in national identity, with hospitality customs — including elaborate coffee and tea rituals — carrying deep cultural weight. The country has also long served as a refuge, hosting large refugee populations from multiple regional conflicts over decades.",
    nature:
      "Jordan holds the Dead Sea, the lowest point on Earth's land surface, and Wadi Rum's dramatic red-sand desert, alongside the Jordan River valley.",
    food: [
      { name: "Mansaf", note: "Lamb cooked in fermented dried yogurt, served over rice — Jordan's national dish." },
      { name: "Falafel", note: "Fried chickpea patties, a beloved street food." },
      { name: "Knafeh", note: "A sweet cheese pastry soaked in syrup, especially associated with the city of Nablus." },
    ],
    landmarks: [
      { name: "Petra", note: "A city carved directly into rose-colored rock by the Nabataeans over 2,000 years ago." },
      { name: "Wadi Rum", note: "A vast desert of red sand and dramatic rock formations, also called the Valley of the Moon." },
      { name: "The Dead Sea", note: "The lowest point on Earth's land surface, so salty that swimmers float effortlessly." },
    ],
  },

  KWT: {
    history: [
      { year: "1613", label: "The town of Kuwait is founded as a fishing and trading settlement" },
      { year: "1899", label: "Kuwait becomes a British protectorate" },
      { year: "1961", label: "Kuwait gains independence" },
      { year: "1990–91", label: "Iraq invades Kuwait, prompting the Gulf War and Kuwait's liberation" },
    ],
    culture:
      "Before oil, Kuwait built its wealth on pearl diving and maritime trade, and its position at the head of the Persian Gulf made it a historic hub connecting Mesopotamia, Arabia, and the wider Indian Ocean trade network.",
    nature:
      "Kuwait's landscape is almost entirely flat desert, with a Persian Gulf coastline supporting a modern skyline built largely on oil wealth discovered in the 1930s.",
    food: [
      { name: "Machboos", note: "Spiced rice with meat or fish, Kuwait's signature dish." },
      { name: "Mutabbaq samak", note: "A fish dish layered with rice and spices." },
      { name: "Gahwa", note: "Cardamom-spiced Arabic coffee, central to hospitality traditions." },
    ],
    landmarks: [
      { name: "Kuwait Towers", note: "Three water towers that have become the country's most recognizable modern symbol." },
      { name: "Grand Mosque", note: "Kuwait's largest mosque, capable of holding tens of thousands of worshippers." },
      { name: "Souq Al-Mubarakiya", note: "A historic marketplace predating Kuwait's oil wealth." },
    ],
  },

  QAT: {
    history: [
      { year: "1868", label: "Qatar becomes a British protectorate under Sheikh Mohammed bin Thani" },
      { year: "1939", label: "Oil is discovered, though full-scale production waits until after WWII" },
      { year: "1971", label: "Qatar gains independence" },
      { year: "2022", label: "Qatar becomes the first Middle Eastern country to host the FIFA World Cup" },
    ],
    culture:
      "Qatar built one of the world's highest per-capita incomes on natural gas wealth, and hosting the 2022 World Cup marked a major step in its push to become a global sports and culture hub, alongside institutions like the Museum of Islamic Art.",
    nature:
      "Qatar is a flat, low-lying peninsula almost entirely covered by desert, with a Persian Gulf coastline and few natural freshwater sources.",
    food: [
      { name: "Machboos", note: "Spiced rice with meat, a Gulf staple shared with neighboring countries." },
      { name: "Harees", note: "Wheat and meat cooked slowly into a thick porridge, especially popular during Ramadan." },
      { name: "Luqaimat", note: "Sweet fried dumplings drizzled with date syrup." },
    ],
    landmarks: [
      { name: "Museum of Islamic Art", note: "A landmark building in Doha housing one of the world's most significant collections of Islamic art." },
      { name: "Katara Cultural Village", note: "A cultural district blending traditional and modern Qatari architecture." },
      { name: "The Pearl-Qatar", note: "An artificial island development off Doha's coast." },
    ],
  },

  OMN: {
    history: [
      { year: "~563 BCE", label: "Omani sailors are recorded trading frankincense across the ancient world" },
      { year: "1508–1650", label: "Portuguese control key Omani ports" },
      { year: "1650–1970", label: "The Omani Empire at its height controls territory stretching to Zanzibar" },
      { year: "1970", label: "Sultan Qaboos begins a decades-long modernization of the country" },
    ],
    culture:
      "Oman built historic wealth on frankincense, an aromatic resin harvested from trees native to the region and traded across the ancient world. Its empire once stretched across the Indian Ocean as far as Zanzibar, leaving lasting cultural ties to East Africa.",
    nature:
      "Oman's landscape ranges from the rugged Hajar Mountains to the vast Rub' al Khali desert and a long Arabian Sea coastline where sea turtles nest.",
    food: [
      { name: "Shuwa", note: "Slow-cooked, spiced meat traditionally buried and cooked underground for special occasions." },
      { name: "Omani halwa", note: "A dense, sweet dessert flavored with rosewater, saffron, and nuts." },
      { name: "Dates", note: "A staple crop, central to hospitality and daily diet." },
    ],
    landmarks: [
      { name: "Sultan Qaboos Grand Mosque", note: "Oman's largest mosque, in the capital Muscat." },
      { name: "Nizwa Fort", note: "A 17th-century fort with a distinctive massive circular tower." },
      { name: "Wahiba Sands", note: "A vast desert of orange dunes, home to Bedouin communities." },
    ],
  },

  YEM: {
    history: [
      { year: "~1200 BCE", label: "The Kingdom of Sheba flourishes in southern Arabia, later legendary across multiple traditions" },
      { year: "~1st c. BCE–CE", label: "Known to Romans as 'Arabia Felix' for its wealth from the incense trade" },
      { year: "1918", label: "North Yemen gains independence from the Ottoman Empire" },
      { year: "1990", label: "North and South Yemen unify into a single state" },
    ],
    culture:
      "Yemen's ancient wealth came from its control of the incense trade route, and Sana'a's Old City, with its distinctive multi-story tower houses, has been continuously inhabited for over 2,500 years.",
    nature:
      "Yemen's mainland ranges from Red Sea coastline to highland terraces once used for coffee cultivation, while the remote island of Socotra, isolated for millions of years, hosts plant life found nowhere else on Earth.",
    food: [
      { name: "Saltah", note: "A bubbling meat stew topped with a fenugreek froth, widely considered Yemen's national dish." },
      { name: "Mandi", note: "Slow-cooked, smoked meat served over rice." },
      { name: "Yemeni coffee", note: "Grown in ancient highland terraces, among the oldest cultivated coffee in the world." },
    ],
    landmarks: [
      { name: "Old City of Sana'a", note: "A UNESCO-listed old city of distinctive multi-story tower houses, inhabited for over 2,500 years." },
      { name: "Socotra Island", note: "An isolated island famous for its otherworldly dragon's blood trees." },
      { name: "Shibam", note: "'The Manhattan of the Desert,' a 16th-century city of mudbrick skyscrapers." },
    ],
  },

  KAZ: {
    history: [
      { year: "1465", label: "The Kazakh Khanate is founded, unifying nomadic Kazakh tribes" },
      { year: "1731–1847", label: "Russia gradually annexes Kazakh territory" },
      { year: "1991", label: "Kazakhstan becomes independent, the last Soviet republic to do so" },
      { year: "1997", label: "The capital moves from Almaty to the newly built city of Astana" },
    ],
    culture:
      "Kazakhstan's nomadic heritage runs deep — eagle hunting, yurt-dwelling traditions, and horse culture remain culturally significant even as the country has rapidly urbanized. It's also the world's largest landlocked country.",
    nature:
      "Kazakhstan's vast steppe, the largest dry steppe region in the world, gives way to the Tian Shan mountains in the southeast and the shrinking Aral Sea in the west, once one of the largest lakes on Earth.",
    food: [
      { name: "Beshbarmak", note: "Boiled meat over wide noodles, widely considered the national dish." },
      { name: "Kumis", note: "Fermented mare's milk, a traditional nomadic staple." },
      { name: "Baursak", note: "Fried dough puffs, often served with tea." },
    ],
    landmarks: [
      { name: "Charyn Canyon", note: "A dramatic canyon landscape often compared to a smaller Grand Canyon." },
      { name: "Baikonur Cosmodrome", note: "The world's first and largest operational space launch facility, leased from Kazakhstan by Russia." },
      { name: "Khan Shatyr", note: "A giant transparent tent-shaped structure in Astana housing an indoor city." },
    ],
  },

  UZB: {
    history: [
      { year: "329 BCE", label: "Alexander the Great conquers Samarkand" },
      { year: "1370–1405", label: "Timur (Tamerlane) builds an empire centered on Samarkand, a golden-age capital of art and architecture" },
      { year: "1865–76", label: "Russia conquers the Central Asian khanates" },
      { year: "1991", label: "Uzbekistan becomes independent" },
    ],
    culture:
      "Uzbekistan's Silk Road cities — Samarkand, Bukhara, Khiva — were once among the greatest centers of learning, art, and trade in the Islamic world, and their turquoise-domed architecture remains a defining national image.",
    nature:
      "Much of Uzbekistan lies within the Kyzylkum Desert, and the shrinking Aral Sea, once the world's fourth-largest lake, has become one of the starkest examples of human-caused environmental change.",
    food: [
      { name: "Plov", note: "Rice cooked with meat, carrots, and onions, the national dish, often prepared in massive communal pots." },
      { name: "Samsa", note: "Baked pastries filled with meat or pumpkin, related to samosas." },
      { name: "Non", note: "Round, tandoor-baked bread, central to nearly every meal." },
    ],
    landmarks: [
      { name: "Registan Square, Samarkand", note: "Three monumental Islamic schools (madrasas) forming one of Central Asia's most spectacular squares." },
      { name: "Bukhara's Old City", note: "A UNESCO-listed city with over 140 historic architectural monuments." },
      { name: "Itchan Kala, Khiva", note: "A walled inner city of mosques and minarets, remarkably preserved." },
    ],
  },
  KHM: {
    history: [
      { year: "802", label: "The Khmer Empire is founded, eventually building Angkor into one of the largest pre-industrial cities in the world" },
      { year: "1431", label: "Angkor is abandoned as the capital after invasion" },
      { year: "1863–1953", label: "French colonial rule" },
      { year: "1975–79", label: "The Khmer Rouge regime under Pol Pot causes the deaths of an estimated 1.5–2 million people" },
    ],
    culture:
      "Cambodia's Angkor-era architecture represents one of history's great artistic achievements, and the country has rebuilt its cultural institutions — including classical dance and traditional arts — in the decades since the Khmer Rouge era nearly destroyed them.",
    nature:
      "The Tonlé Sap, Southeast Asia's largest freshwater lake, dramatically reverses its flow each year with the monsoon, supporting one of the region's richest freshwater fisheries.",
    food: [
      { name: "Amok", note: "Fish steamed in banana leaf with coconut curry, often considered Cambodia's national dish." },
      { name: "Kuy teav", note: "A noodle soup typically eaten for breakfast." },
      { name: "Num banh chok", note: "Rice noodles with a fish-based green curry sauce." },
    ],
    landmarks: [
      { name: "Angkor Wat", note: "The largest religious monument in the world, built in the 12th century." },
      { name: "Angkor Thom & the Bayon", note: "A walled city center famous for its serene, giant stone faces." },
      { name: "Tonlé Sap Lake", note: "Southeast Asia's largest freshwater lake, home to floating villages." },
    ],
  },

  LAO: {
    history: [
      { year: "1353", label: "Fa Ngum founds the Kingdom of Lan Xang ('Million Elephants')" },
      { year: "1893–1953", label: "French colonial rule as part of French Indochina" },
      { year: "1975", label: "The Pathet Lao establish a communist government, ending the monarchy" },
      { year: "1964–73", label: "Laos becomes one of the most heavily bombed countries per capita in history during the Vietnam War era" },
    ],
    culture:
      "Laos is a landlocked, predominantly Theravada Buddhist country where nearly every young man traditionally spends time as a monk. Luang Prabang's morning alms-giving ceremony, where monks collect food from residents, remains a defining daily ritual.",
    nature:
      "The Mekong River runs the length of Laos, and its mountainous, heavily forested terrain has kept much of the country less developed than its neighbors, preserving significant biodiversity.",
    food: [
      { name: "Larb", note: "Minced meat salad with herbs, lime, and toasted rice powder, widely considered the national dish." },
      { name: "Sticky rice", note: "Eaten by hand, the staple accompaniment to nearly every meal." },
      { name: "Tam mak hoong", note: "A spicy green papaya salad." },
    ],
    landmarks: [
      { name: "Luang Prabang", note: "A UNESCO-listed former royal capital known for its temples and morning alms ceremony." },
      { name: "Plain of Jars", note: "Thousands of mysterious ancient stone jars scattered across a highland plateau." },
      { name: "Kuang Si Falls", note: "A multi-tiered turquoise waterfall near Luang Prabang." },
    ],
  },

  MMR: {
    history: [
      { year: "1044", label: "King Anawrahta founds the Pagan Empire, Myanmar's first unified kingdom" },
      { year: "1885", label: "Britain completes its conquest of Burma, later administering it as part of British India" },
      { year: "1948", label: "Burma gains independence" },
      { year: "1962–2011", label: "The military rules the country for nearly five decades" },
    ],
    culture:
      "Myanmar's Buddhist heritage is visible everywhere — Bagan alone once held over 10,000 temples, and nearly every Buddhist man traditionally spends time as a monk. Longyi, a wrapped garment worn by both men and women, remains everyday dress across the country.",
    nature:
      "The Irrawaddy River runs the length of Myanmar, and its geography ranges from Himalayan foothills in the north to the Andaman Sea coastline and Mergui Archipelago in the south.",
    food: [
      { name: "Mohinga", note: "A fish-based noodle soup often considered Myanmar's national dish." },
      { name: "Tea leaf salad (lahpet thoke)", note: "Fermented tea leaves mixed with nuts and vegetables, a uniquely Burmese dish." },
      { name: "Shan noodles", note: "Rice noodles from Shan State, served with a tomato-based sauce." },
    ],
    landmarks: [
      { name: "Bagan", note: "A vast plain once holding over 10,000 Buddhist temples and pagodas, thousands of which still stand." },
      { name: "Shwedagon Pagoda", note: "A massive gold-covered stupa in Yangon, one of Buddhism's most sacred sites." },
      { name: "Inle Lake", note: "Known for its leg-rowing fishermen and floating gardens." },
    ],
  },

  PRK: {
    history: [
      { year: "1945", label: "Korea is divided at the 38th parallel following Japan's WWII defeat" },
      { year: "1948", label: "The Democratic People's Republic of Korea is established under Kim Il Sung" },
      { year: "1950–53", label: "The Korean War ends in an armistice, not a formal peace treaty, leaving the peninsula divided" },
      { year: "1994–2011", label: "Leadership passes within the Kim family across generations" },
    ],
    culture:
      "North Korea's state ideology of Juche, emphasizing national self-reliance, shapes public life, education, and art, and mass performances like the Arirang games have become internationally recognized displays of coordinated spectacle.",
    nature:
      "North Korea is largely mountainous, with Mount Paektu — an active volcano on the Chinese border holding deep significance in Korean folklore and state mythology — as its highest peak.",
    food: [
      { name: "Naengmyeon", note: "Cold buckwheat noodles, especially associated with Pyongyang." },
      { name: "Kimchi", note: "Fermented, spiced vegetables, shared with South Korean cuisine as a peninsula-wide staple." },
      { name: "Sinseollo", note: "A festive hot pot of meat, vegetables, and seafood." },
    ],
    landmarks: [
      { name: "Kim Il Sung Square", note: "A vast public square in Pyongyang used for mass parades and gatherings." },
      { name: "Mount Paektu", note: "An active volcano and the peninsula's highest peak, revered in Korean mythology." },
      { name: "Juche Tower", note: "A monument in Pyongyang dedicated to North Korea's state ideology." },
    ],
  },

  MNG: {
    history: [
      { year: "1206", label: "Genghis Khan unites the Mongol tribes, founding what becomes the largest contiguous land empire in history" },
      { year: "1691", label: "Mongolia comes under Qing Chinese control" },
      { year: "1921", label: "Mongolia declares independence with Soviet backing, becoming the world's second communist state" },
      { year: "1990", label: "Mongolia peacefully transitions to democracy" },
    ],
    culture:
      "Mongolia's nomadic herding culture remains vibrant — roughly a quarter to a third of the population still lives a semi-nomadic lifestyle in traditional gers (yurts). The Naadam festival, celebrating wrestling, archery, and horse racing, is the country's most important annual event.",
    nature:
      "Mongolia is the world's most sparsely populated sovereign country, its landscape spanning the Gobi Desert in the south and vast grassland steppe across the center and north.",
    food: [
      { name: "Buuz", note: "Steamed mutton dumplings, especially eaten during the Lunar New Year." },
      { name: "Khorkhog", note: "Meat slow-cooked with hot stones inside a sealed container." },
      { name: "Airag", note: "Fermented mare's milk, a traditional nomadic staple." },
    ],
    landmarks: [
      { name: "Gobi Desert", note: "One of the world's largest deserts, home to dinosaur fossil sites and sand dunes." },
      { name: "Genghis Khan Equestrian Statue", note: "A massive stainless-steel statue outside Ulaanbaatar, among the largest equestrian statues in the world." },
      { name: "Erdene Zuu Monastery", note: "Mongolia's oldest surviving Buddhist monastery." },
    ],
  },
  LBY: {
    history: [
      { year: "630 BCE", label: "Greek colonists found Cyrene, later a major center of Hellenistic culture" },
      { year: "146 BCE", label: "Rome incorporates the region, building Leptis Magna into one of its grandest African cities" },
      { year: "1911–43", label: "Italian colonial rule" },
      { year: "1951", label: "Libya becomes independent, the first country to gain independence through the United Nations" },
    ],
    culture:
      "Libya's coast holds some of the best-preserved Roman ruins in the Mediterranean, a legacy of its role as a major grain-exporting province of the Roman Empire. Berber and Arab heritage both shape the country's cultural identity.",
    nature:
      "Over 90% of Libya is desert, part of the Sahara, with nearly the entire population concentrated along a narrow Mediterranean coastal strip.",
    food: [
      { name: "Couscous", note: "Steamed semolina, often topped with lamb and vegetables." },
      { name: "Bazin", note: "A dense dough made from barley flour, traditionally shared from a communal dish." },
      { name: "Sharba libiya", note: "A tomato-based soup with lamb and pasta, popular for breaking the Ramadan fast." },
    ],
    landmarks: [
      { name: "Leptis Magna", note: "One of the most complete and impressive Roman archaeological sites in the Mediterranean." },
      { name: "Cyrene", note: "An ancient Greek colony and UNESCO World Heritage site." },
      { name: "Ghadames", note: "A centuries-old desert oasis town known as 'the pearl of the desert.'" },
    ],
  },

  SDN: {
    history: [
      { year: "~2500 BCE", label: "The Kingdom of Kush flourishes along the Nile south of Egypt" },
      { year: "~25 BCE", label: "Kushite Nubian rulers had earlier conquered Egypt, ruling as its 25th dynasty pharaohs" },
      { year: "1956", label: "Sudan gains independence from joint British–Egyptian rule" },
      { year: "2011", label: "South Sudan secedes after a referendum, ending Africa's longest-running civil war" },
    ],
    culture:
      "Sudan holds more ancient pyramids than Egypt, built by the Kingdom of Kush, whose Nubian rulers once controlled Egypt itself. Nile River culture — fishing, farming, and riverside trade — has shaped daily life here for thousands of years.",
    nature:
      "The Blue and White Nile rivers converge at Khartoum, and Sudan's landscape ranges from Red Sea coral reefs to the Sahara's edge and the Nubian Desert.",
    food: [
      { name: "Ful medames", note: "Slow-cooked fava beans, a breakfast staple shared with Egypt." },
      { name: "Kisra", note: "A thin, fermented sorghum flatbread." },
      { name: "Mullah", note: "A stew of meat and vegetables, served over kisra or rice." },
    ],
    landmarks: [
      { name: "Pyramids of Meroë", note: "Nearly 200 steep, narrow pyramids built by the Kingdom of Kush — more than in all of Egypt." },
      { name: "Sanganeb Marine National Park", note: "A pristine coral atoll in the Red Sea." },
      { name: "Jebel Barkal", note: "A sacred mountain and archaeological site linked to ancient Nubian and Egyptian religion." },
    ],
  },

  TCD: {
    history: [
      { year: "900s", label: "The Kanem Empire rises around Lake Chad, becoming a major trans-Saharan trading power" },
      { year: "1900", label: "France establishes colonial control" },
      { year: "1960", label: "Chad gains independence from France" },
      { year: "1965–90", label: "Decades of civil conflict and political instability" },
    ],
    culture:
      "Chad sits at a cultural crossroads between Sahelian West Africa and the Arab-influenced Sahara, reflected in a population of over 200 ethnic groups and both Arabic and French as official languages.",
    nature:
      "Lake Chad, once one of Africa's largest lakes, has shrunk dramatically in recent decades, while the Ennedi Plateau in the north holds dramatic sandstone formations and ancient rock art.",
    food: [
      { name: "Boule", note: "A stiff, pounded grain dough, the staple accompaniment to most meals." },
      { name: "Daraba", note: "A stew of okra, meat, and greens." },
      { name: "Grilled fish", note: "A Lake Chad staple, given the lake's historic fishing economy." },
    ],
    landmarks: [
      { name: "Ennedi Plateau", note: "A UNESCO-listed desert landscape of sandstone arches, canyons, and ancient rock art." },
      { name: "Zakouma National Park", note: "A recovering wildlife reserve home to elephants and rare antelope." },
      { name: "Lake Chad", note: "Once one of Africa's largest lakes, a historic hub for surrounding civilizations." },
    ],
  },

  NER: {
    history: [
      { year: "1000s", label: "The Hausa city-states and the Songhai Empire both hold influence over parts of present-day Niger" },
      { year: "1899", label: "France establishes colonial control" },
      { year: "1960", label: "Niger gains independence" },
      { year: "1991", label: "The Aïr and Ténéré region becomes a UNESCO World Heritage site" },
    ],
    culture:
      "Niger's Tuareg, Hausa, Zarma, and Fulani communities each maintain distinct traditions, with the Tuareg's historic role as trans-Saharan caravan traders leaving a lasting cultural imprint across the region.",
    nature:
      "Over four-fifths of Niger lies within the Sahara Desert, though the Niger River, which gives the country its name, supports agriculture and fishing along a fertile southern strip.",
    food: [
      { name: "Jollof-style rice & stews", note: "Rice-based dishes shared broadly across West Africa's Sahel region." },
      { name: "Millet porridge", note: "A staple grain dish, central to daily diet in a largely arid country." },
      { name: "Brochettes", note: "Grilled skewered meat, a popular street food." },
    ],
    landmarks: [
      { name: "Aïr and Ténéré Natural Reserves", note: "A UNESCO-listed Saharan landscape of mountains and dunes, home to rare desert wildlife." },
      { name: "Niger River", note: "West Africa's third-longest river, sustaining agriculture through the country's arid south." },
      { name: "Agadez's Grand Mosque", note: "A distinctive mudbrick mosque and historic Tuareg trading hub." },
    ],
  },

  MLI: {
    history: [
      { year: "1235", label: "The Mali Empire is founded, growing into one of the wealthiest empires in world history under Mansa Musa" },
      { year: "1324", label: "Mansa Musa's pilgrimage to Mecca reportedly disrupted regional gold economies for years" },
      { year: "1892", label: "France establishes colonial control" },
      { year: "1960", label: "Mali gains independence" },
    ],
    culture:
      "Mali's Mansa Musa is often cited as the wealthiest individual in recorded history, and Timbuktu, part of his empire, became a legendary center of Islamic scholarship, home to hundreds of thousands of ancient manuscripts.",
    nature:
      "Northern Mali lies within the Sahara, while the Niger River supports a fertile inland delta in the country's center, historically the heart of its great trading empires.",
    food: [
      { name: "Jollof-style rice dishes", note: "Rice with sauce and meat or fish, common across the region." },
      { name: "To", note: "A stiff porridge made from millet or sorghum, a staple starch." },
      { name: "Grilled Niger River fish", note: "A dietary staple along the river's fertile delta." },
    ],
    landmarks: [
      { name: "Timbuktu", note: "A legendary medieval center of Islamic scholarship, home to ancient manuscript libraries." },
      { name: "Djenné's Great Mosque", note: "The largest mudbrick building in the world." },
      { name: "Dogon Country", note: "Dramatic cliffside villages and a distinct culture along the Bandiagara Escarpment." },
    ],
  },

  CIV: {
    history: [
      { year: "1843–93", label: "France gradually establishes colonial control" },
      { year: "1893", label: "Côte d'Ivoire becomes a French colony" },
      { year: "1960", label: "Independence under Félix Houphouët-Boigny, who leads the country for 33 years" },
      { year: "2002–11", label: "Two civil conflicts follow a contested political transition" },
    ],
    culture:
      "Côte d'Ivoire is the world's largest cocoa producer, and its cultural life ranges from the elaborate masks and dance of forest-region ethnic groups to a thriving Abidjan music scene that has shaped West African pop music.",
    nature:
      "Côte d'Ivoire's south holds tropical rainforest, increasingly pressured by cocoa farming, while the north transitions into savanna near the Sahel.",
    food: [
      { name: "Attiéké", note: "Fermented, granulated cassava, often served with grilled fish." },
      { name: "Kedjenou", note: "Chicken or guinea fowl slow-cooked with vegetables in a sealed pot." },
      { name: "Alloco", note: "Fried ripe plantains, a popular street food." },
    ],
    landmarks: [
      { name: "Basilica of Our Lady of Peace", note: "One of the largest churches in the world, built in Yamoussoukro." },
      { name: "Comoé National Park", note: "One of West Africa's largest protected wildlife areas." },
      { name: "Grand-Bassam", note: "A former colonial capital and UNESCO World Heritage site." },
    ],
  },

  CMR: {
    history: [
      { year: "1472", label: "Portuguese explorers reach the Cameroon coast" },
      { year: "1884", label: "Germany establishes the colony of Kamerun" },
      { year: "1919", label: "The territory is divided between France and Britain after WWI" },
      { year: "1960–61", label: "French and British Cameroon separately gain independence, then unify" },
    ],
    culture:
      "Cameroon is often called 'Africa in miniature' for holding nearly every major African climate, landscape, and cultural region within one country. Its dual French and English colonial heritage left it with two official languages and distinct regional identities.",
    nature:
      "Cameroon ranges from Atlantic coastline and rainforest in the south to semi-arid Sahel in the north, including Mount Cameroon, one of Africa's most active volcanoes.",
    food: [
      { name: "Ndolé", note: "A stew of bitter leaves, peanuts, and meat or fish, widely considered the national dish." },
      { name: "Jollof-style rice & grilled fish", note: "Common along the coast." },
      { name: "Plantains", note: "A dietary staple, fried, boiled, or pounded." },
    ],
    landmarks: [
      { name: "Mount Cameroon", note: "West Africa's highest peak and one of Africa's most active volcanoes." },
      { name: "Waza National Park", note: "A savanna reserve in the north, home to elephants and giraffes." },
      { name: "Foumban's Royal Palace", note: "Seat of the Bamum Kingdom, with a rich museum of royal artifacts." },
    ],
  },

  GAB: {
    history: [
      { year: "1839", label: "France establishes its first coastal trading posts" },
      { year: "1910", label: "Gabon becomes part of French Equatorial Africa" },
      { year: "1960", label: "Independence from France" },
      { year: "2002", label: "Gabon protects roughly 11% of its land as national parks, becoming a rainforest conservation model" },
    ],
    culture:
      "Gabon's small population relative to its land area has left much of its dense rainforest intact, and Bwiti, a spiritual tradition involving the iboga plant, remains an important part of cultural and religious life for several ethnic groups.",
    nature:
      "Nearly 90% of Gabon is covered in rainforest, part of the Congo Basin, and its network of national parks — including beaches where forest elephants and hippos wander onto the sand — is considered one of Africa's conservation success stories.",
    food: [
      { name: "Poulet nyembwe", note: "Chicken cooked in a rich palm-nut sauce, widely considered a national dish." },
      { name: "Cassava leaves", note: "Pounded and stewed, a staple side dish." },
      { name: "Grilled fish", note: "A coastal staple, given Gabon's extensive Atlantic shoreline." },
    ],
    landmarks: [
      { name: "Loango National Park", note: "Known for its 'surfing hippos' and forest elephants that wander onto Atlantic beaches." },
      { name: "Lopé National Park", note: "A UNESCO World Heritage rainforest site with ancient rock engravings." },
      { name: "Libreville's waterfront", note: "Gabon's capital, founded by freed slaves in 1849." },
    ],
  },

  AGO: {
    history: [
      { year: "1483", label: "Portuguese explorers reach the Kingdom of Kongo" },
      { year: "1575", label: "Portugal founds Luanda, beginning centuries of colonization and the transatlantic slave trade" },
      { year: "1975", label: "Angola gains independence from Portugal" },
      { year: "1975–2002", label: "A prolonged civil war follows independence" },
    ],
    culture:
      "Angola's culture reflects a deep fusion of Bantu and Portuguese heritage, especially audible in semba music, considered a root influence on Brazilian samba. Kizomba, a slow, romantic dance style, later grew from Angola into a global genre.",
    nature:
      "Angola's landscape ranges from Atlantic coastline and desert in the south, near the Namib, to highland plateaus and Congo Basin rainforest in the north.",
    food: [
      { name: "Muamba de galinha", note: "Chicken stewed in palm oil with okra and garlic, widely considered the national dish." },
      { name: "Funge", note: "A stiff cassava or cornmeal porridge, the staple starch." },
      { name: "Grilled fish & seafood", note: "Common along Angola's extensive coastline." },
    ],
    landmarks: [
      { name: "Kalandula Falls", note: "One of Africa's largest waterfalls by volume." },
      { name: "Tundavala Gap", note: "A dramatic escarpment offering sweeping highland views." },
      { name: "Fortress of São Miguel", note: "A 16th-century Portuguese fort overlooking Luanda's bay." },
    ],
  },

  ZMB: {
    history: [
      { year: "1855", label: "Explorer David Livingstone becomes the first European to see Victoria Falls" },
      { year: "1911", label: "Britain establishes the colony of Northern Rhodesia" },
      { year: "1964", label: "Zambia gains independence under Kenneth Kaunda" },
      { year: "1900s", label: "Zambia becomes one of Africa's leading copper producers through the 20th century" },
    ],
    culture:
      "Zambia has maintained a long record of peaceful political transitions since independence, unusual in the region, and its more than 70 ethnic groups are broadly unified by a strong tradition of respect for community elders.",
    nature:
      "Zambia shares Victoria Falls with Zimbabwe and holds vast wilderness across South Luangwa and Kafue National Parks, part of the wider Zambezi River basin.",
    food: [
      { name: "Nshima", note: "A stiff maize porridge, the staple accompaniment to nearly every meal." },
      { name: "Ifisashi", note: "Vegetables cooked in a ground-peanut sauce." },
      { name: "Grilled bream", note: "A freshwater fish common along Zambia's many rivers and lakes." },
    ],
    landmarks: [
      { name: "Victoria Falls", note: "Shared with Zimbabwe, one of the largest waterfalls in the world." },
      { name: "South Luangwa National Park", note: "Renowned for walking safaris and dense wildlife." },
      { name: "Kafue National Park", note: "One of Africa's largest national parks." },
    ],
  },

  MWI: {
    history: [
      { year: "1859", label: "Explorer David Livingstone reaches Lake Malawi" },
      { year: "1891", label: "Britain establishes the Nyasaland protectorate" },
      { year: "1964", label: "Malawi gains independence under Hastings Banda, who rules as an authoritarian president for three decades" },
      { year: "1994", label: "Malawi transitions to multi-party democracy" },
    ],
    culture:
      "Malawi is often called 'the Warm Heart of Africa' for the friendliness widely attributed to its people, and Lake Malawi — covering nearly a fifth of the country — has shaped fishing, trade, and daily life for centuries.",
    nature:
      "Lake Malawi, the ninth-largest lake in the world, holds more fish species than any other lake on Earth, most found nowhere else.",
    food: [
      { name: "Nsima", note: "A stiff maize porridge, the staple starch of nearly every meal." },
      { name: "Chambo", note: "A prized Lake Malawi fish, often grilled or fried." },
      { name: "Mandasi", note: "Fried dough similar to doughnuts, a common snack." },
    ],
    landmarks: [
      { name: "Lake Malawi", note: "A UNESCO World Heritage site holding more fish species than any lake on Earth." },
      { name: "Mount Mulanje", note: "A massif rising dramatically from the surrounding plain, popular with hikers." },
      { name: "Zomba Plateau", note: "A highland region of pine forest and waterfalls." },
    ],
  },

  MOZ: {
    history: [
      { year: "1498", label: "Vasco da Gama reaches the Mozambican coast" },
      { year: "1505", label: "Portugal establishes colonial control" },
      { year: "1975", label: "Mozambique gains independence after a decade-long liberation war" },
      { year: "1977–92", label: "A devastating civil war follows independence" },
    ],
    culture:
      "Mozambique's culture reflects centuries of Swahili, Arab, Indian, and Portuguese trade influence along its coast, visible in its cuisine, architecture, and the continued widespread use of Portuguese as an official language.",
    nature:
      "Mozambique's over 2,500 km coastline includes the Bazaruto and Quirimbas archipelagos, with coral reefs among the richest in the Indian Ocean.",
    food: [
      { name: "Piri-piri chicken", note: "Chicken marinated in a fiery chili sauce, one of Mozambique's best-known culinary exports." },
      { name: "Matapa", note: "Cassava leaves cooked with peanuts and often seafood." },
      { name: "Prawns", note: "Mozambican prawns are internationally renowned, given the country's extensive coastline." },
    ],
    landmarks: [
      { name: "Island of Mozambique", note: "A former Portuguese colonial capital and UNESCO World Heritage site." },
      { name: "Bazaruto Archipelago", note: "A chain of islands with pristine beaches and coral reefs." },
      { name: "Gorongosa National Park", note: "A wildlife reserve recovering dramatically after decades of civil-war depletion." },
    ],
  },

  NAM: {
    history: [
      { year: "1884", label: "Germany establishes the colony of German South West Africa" },
      { year: "1904–08", label: "German colonial forces carry out mass killings of the Herero and Nama peoples, later recognized by Germany as genocide" },
      { year: "1920", label: "South Africa administers the territory following WWI" },
      { year: "1990", label: "Namibia gains independence, among the last African countries to do so" },
    ],
    culture:
      "Namibia is one of the least densely populated countries on Earth, and its Himba people, in the country's remote north, maintain distinctive traditions including ochre-based body adornment.",
    nature:
      "The Namib, believed to be the world's oldest desert, meets the Atlantic along a coastline so treacherous it's known as the 'Skeleton Coast,' while towering red dunes at Sossusvlei rank among the tallest in the world.",
    food: [
      { name: "Biltong", note: "Air-dried cured meat, a widely popular snack reflecting German and Afrikaner settler influence." },
      { name: "Potjiekos", note: "A slow-cooked stew made in a cast-iron pot over open coals." },
      { name: "Game meat", note: "Springbok and oryx are common on Namibian menus." },
    ],
    landmarks: [
      { name: "Sossusvlei", note: "Towering red sand dunes, among the tallest in the world, in the Namib Desert." },
      { name: "Etosha National Park", note: "A wildlife reserve centered on a vast salt pan." },
      { name: "Skeleton Coast", note: "A remote, fog-shrouded coastline littered with historic shipwrecks." },
    ],
  },

  BWA: {
    history: [
      { year: "1885", label: "Britain establishes the Bechuanaland Protectorate at local chiefs' request" },
      { year: "1966", label: "Botswana gains independence, one of the poorest countries in the world at the time" },
      { year: "1967", label: "Major diamond deposits are discovered, transforming the economy" },
      { year: "1966–present", label: "Uninterrupted multi-party elections since independence" },
    ],
    culture:
      "Botswana is frequently cited as one of Africa's most stable democracies, having maintained uninterrupted multi-party elections since independence, alongside careful management of diamond wealth into national development.",
    nature:
      "The Okavango Delta, one of the world's largest inland deltas, floods seasonally to create a wildlife-rich oasis within the Kalahari Desert, which covers most of the country.",
    food: [
      { name: "Seswaa", note: "Slow-cooked, shredded beef or goat, often served at celebrations." },
      { name: "Bogobe", note: "A sorghum porridge, a staple starch." },
      { name: "Morogo", note: "Wild leafy greens, a common side dish." },
    ],
    landmarks: [
      { name: "Okavango Delta", note: "A UNESCO World Heritage inland river delta teeming with wildlife." },
      { name: "Chobe National Park", note: "Home to one of Africa's largest elephant populations." },
      { name: "Tsodilo Hills", note: "A UNESCO site with thousands of ancient rock paintings." },
    ],
  },

  RWA: {
    history: [
      { year: "1600s", label: "The Kingdom of Rwanda consolidates under a centralized monarchy" },
      { year: "1916–1962", label: "Belgian colonial administration entrenches ethnic distinctions that would later fuel violence" },
      { year: "1994", label: "A genocide against the Tutsi minority and moderate Hutus kills an estimated 800,000 people over roughly 100 days" },
      { year: "1994–present", label: "Rwanda pursues a widely noted process of reconciliation and rapid development" },
    ],
    culture:
      "Rwanda has rebuilt around a strong national identity emphasizing unity over ethnic division, alongside one of the world's most notable examples of post-conflict reconciliation. It's also a global leader in women's political representation, with women holding a majority of parliamentary seats.",
    nature:
      "Rwanda, the 'Land of a Thousand Hills,' holds a share of the Virunga volcanic range and is one of the last strongholds of the endangered mountain gorilla.",
    food: [
      { name: "Ugali", note: "A stiff maize or cassava porridge, a staple starch." },
      { name: "Isombe", note: "Cassava leaves cooked with eggplant and often peanut sauce." },
      { name: "Brochettes", note: "Grilled skewered meat, a popular street food." },
    ],
    landmarks: [
      { name: "Volcanoes National Park", note: "Home to endangered mountain gorillas, made famous by researcher Dian Fossey's work." },
      { name: "Kigali Genocide Memorial", note: "A memorial and museum honoring victims of the 1994 genocide." },
      { name: "Lake Kivu", note: "One of Africa's Great Lakes, ringed by terraced hills." },
    ],
  },

  BFA: {
    history: [
      { year: "1896", label: "France establishes colonial control over the Mossi kingdoms" },
      { year: "1960", label: "Independence as Upper Volta" },
      { year: "1984", label: "Revolutionary leader Thomas Sankara renames the country Burkina Faso, 'Land of Upright People'" },
      { year: "1987", label: "Sankara is assassinated in a coup after a brief but influential presidency" },
    ],
    culture:
      "Burkina Faso hosts FESPACO, Africa's largest film festival, held in Ouagadougou every two years since 1969, reflecting the country's outsized role in African cinema relative to its size.",
    nature:
      "Burkina Faso is landlocked, with a landscape transitioning from Sahel scrubland in the north to savanna and scattered forest in the south, supporting elephants in reserves like Arly.",
    food: [
      { name: "Tô", note: "A stiff porridge made from millet, sorghum, or corn, the staple starch." },
      { name: "Riz gras", note: "'Fat rice' — rice cooked with meat and vegetables." },
      { name: "Grilled brochettes", note: "Skewered meat, a popular street food across West Africa." },
    ],
    landmarks: [
      { name: "Sindou Peaks", note: "Dramatic wind- and water-carved rock formations." },
      { name: "Ruins of Loropéni", note: "A UNESCO-listed stone fortification linked to the historic trans-Saharan gold trade." },
      { name: "Ouagadougou's Grand Mosque", note: "A distinctive Sahelian mudbrick mosque in the capital." },
    ],
  },
  GTM: {
    history: [
      { year: "250–900", label: "The Maya civilization flourishes across the region, building great cities like Tikal" },
      { year: "1524", label: "Spanish conquistador Pedro de Alvarado begins the conquest of the Maya kingdoms" },
      { year: "1821", label: "Guatemala gains independence from Spain" },
      { year: "1960–96", label: "A civil war, including violence against Maya communities recognized by a UN-backed truth commission, devastates the country" },
    ],
    culture:
      "Guatemala holds Central America's largest Indigenous population, with over 20 Maya languages still spoken, and Maya traditions, dress, and weaving remain vibrant, particularly in the western highlands.",
    nature:
      "Guatemala's volcanic highlands, including active Volcán de Fuego, give way to Petén's lowland rainforest in the north, home to jaguars and howler monkeys around the Maya ruins of Tikal.",
    food: [
      { name: "Pepián", note: "A rich, spiced meat stew often considered Guatemala's national dish." },
      { name: "Tamales", note: "Corn dough filled and steamed in banana leaves or corn husks, especially for celebrations." },
      { name: "Black beans", note: "A staple side, often served refried with nearly every meal." },
    ],
    landmarks: [
      { name: "Tikal", note: "One of the largest and most important Maya archaeological sites, its temples rising above the jungle canopy." },
      { name: "Lake Atitlán", note: "A volcanic lake ringed by three volcanoes and traditional Maya villages." },
      { name: "Antigua Guatemala", note: "A UNESCO-listed colonial city known for its Spanish Baroque architecture." },
    ],
  },

  PAN: {
    history: [
      { year: "1501", label: "Spanish explorers first reach Panama" },
      { year: "1671", label: "Pirate Henry Morgan sacks Panama City" },
      { year: "1821", label: "Panama gains independence from Spain as part of Gran Colombia" },
      { year: "1903", label: "Panama separates from Colombia and grants the US rights to build the Panama Canal, completed in 1914 and transferred to full Panamanian control in 1999" },
    ],
    culture:
      "Panama's identity is deeply tied to its role as a global crossroads — the canal handles roughly 5% of world trade, and the country's population reflects centuries of migration from the Caribbean, Asia, and beyond drawn by canal-era labor.",
    nature:
      "Panama's isthmus connects North and South America and separates the Pacific and Atlantic oceans, holding rainforest so biodiverse that the land bridge itself enabled a historic exchange of species between the continents.",
    food: [
      { name: "Sancocho", note: "A hearty chicken and root vegetable stew, widely considered the national dish." },
      { name: "Ceviche", note: "Raw fish cured in citrus, popular along both coasts." },
      { name: "Patacones", note: "Twice-fried green plantains, a common side dish." },
    ],
    landmarks: [
      { name: "Panama Canal", note: "One of the great engineering achievements of the 20th century, connecting the Atlantic and Pacific." },
      { name: "Casco Viejo", note: "Panama City's colonial old town, a UNESCO World Heritage site." },
      { name: "San Blas Islands", note: "An archipelago home to the Indigenous Guna people." },
    ],
  },

  DOM: {
    history: [
      { year: "1492", label: "Christopher Columbus lands on the island of Hispaniola on his first voyage" },
      { year: "1496", label: "Santo Domingo is founded, the oldest continuously inhabited European settlement in the Americas" },
      { year: "1844", label: "The Dominican Republic gains independence from Haiti" },
      { year: "1930–61", label: "Rafael Trujillo's dictatorship dominates the country" },
    ],
    culture:
      "The Dominican Republic is the birthplace of merengue and bachata, two of Latin music's most influential genres, and baseball is close to a national religion, with the country producing more MLB players than any nation besides the US.",
    nature:
      "The Dominican Republic shares the island of Hispaniola with Haiti, and its Cordillera Central holds the Caribbean's highest peak, Pico Duarte, alongside extensive Caribbean coastline.",
    food: [
      { name: "La Bandera", note: "Rice, beans, and stewed meat — an everyday meal named for resembling the national flag's colors." },
      { name: "Mangú", note: "Mashed plantains, often served for breakfast." },
      { name: "Sancocho", note: "A hearty meat and root vegetable stew, especially popular for gatherings." },
    ],
    landmarks: [
      { name: "Zona Colonial, Santo Domingo", note: "The oldest European settlement in the Americas, a UNESCO World Heritage site." },
      { name: "Pico Duarte", note: "The Caribbean's highest peak." },
      { name: "Los Haitises National Park", note: "A landscape of karst hills and mangrove-lined bays." },
    ],
  },

  HTI: {
    history: [
      { year: "1492", label: "Columbus lands on the island, which he names Hispaniola" },
      { year: "1697", label: "Spain cedes the western third of the island to France, which becomes the colony of Saint-Domingue" },
      { year: "1791–1804", label: "The Haitian Revolution becomes the only successful slave revolt to found a nation, making Haiti the first independent Black republic in the world" },
      { year: "1804", label: "Haiti declares independence" },
    ],
    culture:
      "Haiti's revolution remains one of history's most significant anti-slavery uprisings, and the country's culture blends West African, French, and Indigenous Taíno influences, especially visible in Haitian Vodou, Creole language, and vibrant naive art traditions.",
    nature:
      "Haiti shares the island of Hispaniola with the Dominican Republic, with a mountainous landscape that gave the country its Indigenous Taíno name, meaning 'land of high mountains.'",
    food: [
      { name: "Griot", note: "Fried marinated pork, a Haitian staple." },
      { name: "Diri ak djon djon", note: "Rice cooked with black Haitian mushrooms, prized for their distinct flavor and color." },
      { name: "Pikliz", note: "A spicy pickled cabbage and pepper condiment served with nearly every meal." },
    ],
    landmarks: [
      { name: "Citadelle Laferrière", note: "A massive mountaintop fortress built after independence to defend against future invasion." },
      { name: "Sans-Souci Palace", note: "Ruins of an early 19th-century royal palace, a UNESCO World Heritage site alongside the Citadelle." },
      { name: "Jacmel", note: "A coastal town known for its ironwork architecture and vibrant Carnival." },
    ],
  },

  TTO: {
    history: [
      { year: "1498", label: "Columbus sights Trinidad on his third voyage" },
      { year: "1797", label: "Britain seizes Trinidad from Spain" },
      { year: "1889", label: "Trinidad and Tobago are administratively united as a single colony" },
      { year: "1962", label: "Independence from Britain" },
    ],
    culture:
      "Trinidad and Tobago is the birthplace of both steelpan music and Carnival traditions that have spread across the Caribbean and its diaspora worldwide, reflecting a cultural mix of African, Indian, and other communities brought by colonial-era labor.",
    nature:
      "Despite their small size, the twin islands hold notable biodiversity, including one of the most accessible tropical rainforests in the Caribbean and nesting sites for leatherback sea turtles.",
    food: [
      { name: "Doubles", note: "Fried flatbread sandwiching curried chickpeas, a beloved street-food breakfast." },
      { name: "Callaloo", note: "A leafy green stew, often with crab or okra." },
      { name: "Roti", note: "Flatbread wrapped around curried fillings, reflecting the islands' Indian heritage." },
    ],
    landmarks: [
      { name: "Pitch Lake", note: "The largest natural deposit of asphalt in the world." },
      { name: "Maracas Bay", note: "A popular beach on Trinidad's north coast." },
      { name: "Caroni Bird Sanctuary", note: "Home to Trinidad and Tobago's national bird, the scarlet ibis." },
    ],
  },

  BOL: {
    history: [
      { year: "1545", label: "Discovery of silver at Potosí's Cerro Rico funds much of the Spanish Empire for centuries" },
      { year: "1548", label: "Spanish colonizers found La Paz" },
      { year: "1825", label: "Bolivia gains independence, named for liberator Simón Bolívar" },
      { year: "1952", label: "The Bolivian National Revolution nationalizes the tin industry and grants universal suffrage" },
    ],
    culture:
      "Bolivia has one of South America's largest Indigenous populations, and Aymara and Quechua both hold official status alongside Spanish, reflecting one of the region's strongest surviving Indigenous political and cultural presences.",
    nature:
      "Bolivia holds Salar de Uyuni, the world's largest salt flat, alongside a share of the high Andean altiplano and Amazon rainforest in its lowlands.",
    food: [
      { name: "Salteñas", note: "Baked pastries filled with a juicy, slightly sweet meat stew, a beloved snack." },
      { name: "Pique macho", note: "A hearty dish of chopped beef, sausage, fries, and vegetables." },
      { name: "Chuño", note: "Freeze-dried potato, an ancient Andean preservation technique still used today." },
    ],
    landmarks: [
      { name: "Salar de Uyuni", note: "The world's largest salt flat, famously mirror-like when flooded." },
      { name: "Tiwanaku", note: "Ruins of a major pre-Inca civilization near Lake Titicaca." },
      { name: "Lake Titicaca", note: "The highest navigable lake in the world, shared with Peru." },
    ],
  },

  ECU: {
    history: [
      { year: "1463", label: "The Inca Empire incorporates the region" },
      { year: "1534", label: "Spanish conquest establishes colonial rule" },
      { year: "1830", label: "Ecuador becomes independent after the dissolution of Gran Colombia" },
      { year: "1835", label: "Charles Darwin visits the Galápagos Islands, later shaping his theory of evolution" },
    ],
    culture:
      "Ecuador takes its name from the equator, which runs directly through the country, and its Indigenous Kichwa communities remain a significant cultural and political presence, particularly in the Andean highlands.",
    nature:
      "Ecuador's Galápagos Islands, isolated in the Pacific, hold species found nowhere else on Earth, while the mainland spans Andean peaks, Amazon rainforest, and Pacific coastline.",
    food: [
      { name: "Ceviche", note: "Seafood cured in citrus, prepared differently across Ecuador's coastal and highland regions." },
      { name: "Locro de papa", note: "A creamy potato soup, often topped with avocado and cheese." },
      { name: "Cuy", note: "Roasted guinea pig, a traditional Andean highland dish." },
    ],
    landmarks: [
      { name: "Galápagos Islands", note: "An isolated volcanic archipelago famous for giant tortoises and unique wildlife that shaped Darwin's theory of evolution." },
      { name: "Middle of the World monument", note: "Marking the equator just outside Quito." },
      { name: "Cotopaxi", note: "One of the world's highest active volcanoes." },
    ],
  },

  PRY: {
    history: [
      { year: "1537", label: "Spanish colonizers found Asunción" },
      { year: "1811", label: "Paraguay becomes one of the first South American countries to gain independence from Spain" },
      { year: "1864–70", label: "The War of the Triple Alliance kills a majority of Paraguay's male population, among the deadliest wars in the Americas" },
      { year: "1954–89", label: "Alfredo Stroessner rules as a long-standing dictator" },
    ],
    culture:
      "Paraguay is unusual in Latin America for the widespread daily use of Guaraní, an Indigenous language, alongside Spanish as a co-official language spoken by the vast majority of the population, regardless of ethnicity.",
    nature:
      "Paraguay is landlocked, split by the Paraguay River into a fertile eastern region and the sparsely populated Gran Chaco, a vast dry forest shared with Argentina and Bolivia.",
    food: [
      { name: "Sopa paraguaya", note: "A dense, savory cornbread despite its name meaning 'Paraguayan soup.'" },
      { name: "Chipa", note: "Cheese bread made with cassava starch, a beloved snack." },
      { name: "Asado", note: "Grilled meat, central to Paraguayan social gatherings." },
    ],
    landmarks: [
      { name: "Jesuit Missions of La Santísima Trinidad de Paraná", note: "UNESCO-listed ruins of 17th–18th century Jesuit missions." },
      { name: "Itaipu Dam", note: "One of the largest hydroelectric dams in the world, shared with Brazil." },
      { name: "Ñacunday Falls", note: "A wide, powerful waterfall in eastern Paraguay." },
    ],
  },

  JAM: {
    history: [
      { year: "1494", label: "Columbus lands in Jamaica on his second voyage" },
      { year: "1655", label: "England seizes Jamaica from Spain" },
      { year: "1670–1838", label: "Jamaica becomes a major sugar and slave colony under British rule" },
      { year: "1962", label: "Jamaica gains independence from Britain" },
    ],
    culture:
      "Jamaica's cultural influence on the world far outweighs its size — reggae music, born here in the late 1960s and carried globally by artists like Bob Marley, and the Rastafari movement both originated on the island. Jamaican sprinters have also dominated world athletics for decades.",
    nature:
      "Jamaica's interior Blue Mountains, famous for their coffee, rise sharply from a coastline of beaches and coral reefs, with the rugged, cave-riddled Cockpit Country in the northwest.",
    food: [
      { name: "Jerk chicken", note: "Meat marinated in a fiery spice blend and traditionally smoked over pimento wood." },
      { name: "Ackee and saltfish", note: "Jamaica's national dish, pairing a native fruit with salted codfish." },
      { name: "Patties", note: "Flaky, curry-spiced pastries filled with meat or vegetables." },
    ],
    landmarks: [
      { name: "Dunn's River Falls", note: "A terraced waterfall near Ocho Rios that visitors can climb." },
      { name: "Blue Mountains", note: "Home to some of the world's most prized coffee." },
      { name: "Bob Marley Museum", note: "Marley's former home in Kingston, now a museum dedicated to his legacy." },
    ],
  },

  CRI: {
    history: [
      { year: "1502", label: "Columbus reaches the Costa Rican coast on his fourth voyage" },
      { year: "1821", label: "Costa Rica gains independence from Spain as part of the Federal Republic of Central America" },
      { year: "1948", label: "A brief civil war leads to the abolition of Costa Rica's military, a decision that has held ever since" },
      { year: "1970s–present", label: "Costa Rica becomes a global pioneer in ecotourism and conservation" },
    ],
    culture:
      "Costa Rica has had no standing army since 1948, redirecting resources toward education and healthcare, and 'pura vida' — 'pure life' — captures a national ethos of contentment widely cited in its consistently high happiness rankings.",
    nature:
      "Though covering just a tiny fraction of the Earth's surface, Costa Rica holds around 5% of the world's biodiversity, protected across an extensive national park system covering roughly a quarter of the country.",
    food: [
      { name: "Gallo pinto", note: "Rice and beans, the everyday breakfast staple." },
      { name: "Casado", note: "A balanced plate of rice, beans, plantain, salad, and a protein." },
      { name: "Chifrijo", note: "A layered rice, beans, and crispy pork dish." },
    ],
    landmarks: [
      { name: "Arenal Volcano", note: "An iconic, near-symmetrical volcanic cone." },
      { name: "Monteverde Cloud Forest", note: "A misty, high-elevation reserve famous for its biodiversity and canopy walkways." },
      { name: "Manuel Antonio National Park", note: "A small but exceptionally biodiverse park combining beaches and rainforest." },
    ],
  },

  HND: {
    history: [
      { year: "250–900", label: "The Maya city of Copán flourishes as a major center of astronomy and hieroglyphic writing" },
      { year: "1502", label: "Columbus reaches the coast on his fourth voyage, naming the region 'Honduras' ('depths')" },
      { year: "1821", label: "Independence from Spain" },
      { year: "1899–1900s", label: "The country becomes closely tied to American banana companies, giving rise to the term 'banana republic'" },
    ],
    culture:
      "Honduras's Copán ruins hold some of the finest hieroglyphic writing in the Maya world, and Garifuna communities along the Caribbean coast — descendants of shipwrecked and escaped African and Indigenous Caribbean peoples — maintain a distinct language, music, and cuisine recognized by UNESCO.",
    nature:
      "Honduras holds the second-largest coral reef system in the world along its Caribbean coast, part of the Mesoamerican Barrier Reef, alongside mountainous, pine-forested highlands inland.",
    food: [
      { name: "Baleada", note: "A folded flour tortilla filled with beans, cheese, and cream, a beloved everyday snack." },
      { name: "Sopa de caracol", note: "Conch soup, especially popular on the Caribbean coast." },
      { name: "Plantains", note: "Fried, boiled, or mashed, a staple across most meals." },
    ],
    landmarks: [
      { name: "Copán Ruins", note: "A UNESCO-listed Maya site famous for its detailed hieroglyphic stairway." },
      { name: "Roatán", note: "An island known for diving along the Mesoamerican Barrier Reef." },
      { name: "Pico Bonito National Park", note: "A biodiverse cloud-forest reserve near the Caribbean coast." },
    ],
  },
  PNG: {
    history: [
      { year: "~50,000 years ago", label: "Among the earliest human migrations out of Africa and Asia reach New Guinea" },
      { year: "1884", label: "The island is divided between German, British, and Dutch colonial claims" },
      { year: "1975", label: "Papua New Guinea gains independence from Australia" },
      { year: "1975–present", label: "The country becomes recognized as one of the most linguistically diverse places on Earth, with over 800 languages" },
    ],
    culture:
      "Papua New Guinea is home to more languages than any other country on Earth — over 800 — a legacy of its extremely rugged terrain, which isolated communities from one another for thousands of years. Traditional 'sing-sing' festivals, with elaborate feathered headdresses and body paint, remain vibrant expressions of this diversity.",
    nature:
      "Papua New Guinea's rugged highlands and dense rainforest hold extraordinary biodiversity, including birds-of-paradise found nowhere else, alongside coral reefs ranked among the richest in the world.",
    food: [
      { name: "Mumu", note: "Meat and vegetables slow-cooked in an underground earth oven, prepared for special occasions." },
      { name: "Sago", note: "A starch extracted from palm trees, a staple in lowland and coastal regions." },
      { name: "Kaukau", note: "Sweet potato, a highland dietary staple." },
    ],
    landmarks: [
      { name: "Kokoda Track", note: "A famous WWII-era trekking route through dense mountain jungle." },
      { name: "Sepik River", note: "A major river lined with villages known for elaborate traditional woodcarving." },
      { name: "Mount Wilhelm", note: "Papua New Guinea's highest peak." },
    ],
  },

  FJI: {
    history: [
      { year: "~3500 years ago", label: "Lapita seafarers first settle the Fijian islands" },
      { year: "1874", label: "Fiji becomes a British colony" },
      { year: "1879–1916", label: "Britain brings indentured laborers from India to work sugar plantations, permanently shaping Fiji's demographics" },
      { year: "1970", label: "Fiji gains independence" },
    ],
    culture:
      "Fiji's population reflects both Indigenous Fijian and Indo-Fijian communities, the latter descended largely from 19th-century indentured laborers, giving the country a distinct blend of Melanesian and South Asian cultural influence. Kava, a ceremonial drink made from a native root, remains central to Fijian hospitality and ritual.",
    nature:
      "Fiji's over 330 islands hold some of the South Pacific's richest coral reefs, alongside volcanic highlands and rainforest on its larger islands.",
    food: [
      { name: "Kokoda", note: "Fish marinated in citrus and coconut milk, similar to ceviche." },
      { name: "Lovo", note: "Food slow-cooked in an underground oven, prepared for feasts." },
      { name: "Cassava and taro", note: "Root vegetables that form the starch base of most traditional meals." },
    ],
    landmarks: [
      { name: "Sigatoka Sand Dunes", note: "Fiji's first national park, holding ancient archaeological sites." },
      { name: "Garden of the Sleeping Giant", note: "An orchid garden at the base of the Sabeto mountain range." },
      { name: "Great Astrolabe Reef", note: "One of the largest barrier reefs in the world." },
    ],
  },

  AFG: {
    history: [
      { year: "330 BCE", label: "Alexander the Great conquers the region, founding several cities including Kandahar" },
      { year: "1747", label: "Ahmad Shah Durrani founds the Durrani Empire, the foundation of modern Afghanistan" },
      { year: "1839–1919", label: "Afghanistan becomes a buffer state during the 'Great Game' between British and Russian empires" },
      { year: "1979–89", label: "Soviet–Afghan War" },
    ],
    culture:
      "Afghanistan sits at a historic crossroads of Persian, Central Asian, and South Asian culture, and its many ethnic groups — Pashtun, Tajik, Hazara, Uzbek among others — each carry distinct languages and traditions. Poetry, especially in Dari and Pashto, holds deep cultural importance.",
    nature:
      "The Hindu Kush mountain range dominates Afghanistan's geography, and the Wakhan Corridor — a narrow panhandle in the northeast — was drawn by 19th-century imperial powers specifically to separate British and Russian territory.",
    food: [
      { name: "Kabuli palaw", note: "Spiced rice with lamb, carrots, and raisins, widely considered the national dish." },
      { name: "Mantu", note: "Steamed dumplings filled with spiced meat, topped with yogurt and lentil sauce." },
      { name: "Naan", note: "Flatbread baked in a tandoor-style oven, central to nearly every meal." },
    ],
    landmarks: [
      { name: "Band-e-Amir", note: "Afghanistan's first national park, a chain of deep blue lakes separated by natural dams." },
      { name: "Minaret of Jam", note: "A 12th-century minaret in a remote valley, a UNESCO World Heritage site." },
      { name: "Blue Mosque, Mazar-i-Sharif", note: "A richly tiled shrine considered one of the most beautiful buildings in Central Asia." },
    ],
  },

  ARM: {
    history: [
      { year: "301", label: "Armenia becomes the first country in the world to adopt Christianity as a state religion" },
      { year: "1045", label: "The last independent Armenian kingdom falls, beginning centuries of foreign rule" },
      { year: "1915–23", label: "Mass killings and deportations of Armenians under the Ottoman Empire" },
      { year: "1991", label: "Independence as the Soviet Union dissolves" },
    ],
    culture:
      "Armenia's identity is deeply tied to being the world's first Christian nation, and its distinctive alphabet, created around 405 CE specifically to translate the Bible, remains unchanged in daily use today.",
    nature:
      "Armenia is a mountainous, landlocked country dominated by the Lesser Caucasus range, with Lake Sevan, one of the largest high-altitude lakes in the world, at its heart.",
    food: [
      { name: "Khorovats", note: "Armenian-style barbecue, a centerpiece of gatherings." },
      { name: "Dolma", note: "Grape leaves or vegetables stuffed with spiced rice and meat." },
      { name: "Lavash", note: "A thin, soft flatbread recognized by UNESCO as intangible cultural heritage." },
    ],
    landmarks: [
      { name: "Tatev Monastery", note: "A 9th-century monastery reached by one of the world's longest cable cars." },
      { name: "Lake Sevan", note: "One of the largest high-altitude freshwater lakes in the world." },
      { name: "Geghard Monastery", note: "A medieval monastery partially carved out of an adjacent mountain." },
    ],
  },

  AZE: {
    history: [
      { year: "1918", label: "Azerbaijan Democratic Republic becomes the first secular democratic republic in the Muslim world" },
      { year: "1920", label: "Sovietized by the Red Army" },
      { year: "1991", label: "Independence as the Soviet Union dissolves" },
      { year: "1988–94, 2020", label: "Conflict with Armenia over the Nagorno-Karabakh region" },
    ],
    culture:
      "Azerbaijan calls itself the 'Land of Fire,' both for ancient Zoroastrian fire-worship traditions and for natural gas seeps that create naturally burning flames on its hillsides. Baku's blend of medieval old town and futuristic architecture reflects a modern oil-and-gas-funded economy.",
    nature:
      "Azerbaijan spans the Caucasus Mountains, the Caspian Sea coastline, and semi-desert plains, and it holds mud volcanoes found in only a handful of places on Earth.",
    food: [
      { name: "Plov", note: "Saffron rice with meat, fruit, or herbs, prepared in dozens of regional styles." },
      { name: "Dolma", note: "Grape leaves stuffed with spiced meat and rice." },
      { name: "Baklava", note: "A syrup-soaked pastry, a fixture of Novruz celebrations." },
    ],
    landmarks: [
      { name: "Flame Towers", note: "Three flame-shaped skyscrapers dominating Baku's modern skyline." },
      { name: "Old City, Baku", note: "A walled medieval quarter and UNESCO World Heritage site." },
      { name: "Gobustan mud volcanoes", note: "A landscape of bubbling mud formations near ancient rock carvings." },
    ],
  },

  BHR: {
    history: [
      { year: "~2200 BCE", label: "The Dilmun civilization flourishes on the island, referenced in early Sumerian texts" },
      { year: "1521–1602", label: "Portuguese control of the islands" },
      { year: "1932", label: "Oil discovered — the first Gulf state to do so" },
      { year: "1971", label: "Independence from Britain" },
    ],
    culture:
      "Bahrain's Dilmun civilization was referenced in some of the earliest known written texts, Sumerian cuneiform tablets describing it as a paradise-like trading hub. Modern Bahrain remains a financial and cultural crossroads of the Gulf.",
    nature:
      "Bahrain is an archipelago of over 30 islands, low-lying and largely desert, though ancient underground freshwater springs once made it unusually fertile for the region.",
    food: [
      { name: "Machboos", note: "Spiced rice with meat or fish, a Gulf staple." },
      { name: "Muhammar", note: "Sweetened rice, often served alongside savory dishes." },
      { name: "Fresh dates", note: "A dietary staple grown across the islands for millennia." },
    ],
    landmarks: [
      { name: "Bahrain Fort (Qal'at al-Bahrain)", note: "A UNESCO World Heritage site built atop layers of settlement going back 4,000 years." },
      { name: "Tree of Life", note: "A solitary tree surviving in the middle of the desert, its water source unknown." },
      { name: "Al Fateh Grand Mosque", note: "One of the largest mosques in the world." },
    ],
  },

  BTN: {
    history: [
      { year: "747", label: "Guru Rinpoche introduces Buddhism to Bhutan" },
      { year: "1616", label: "Ngawang Namgyal unifies Bhutan and establishes its distinct cultural identity" },
      { year: "1907", label: "The Wangchuck dynasty begins, ruling to this day" },
      { year: "2008", label: "Bhutan transitions from absolute to constitutional monarchy" },
    ],
    culture:
      "Bhutan measures national progress through 'Gross National Happiness' rather than GDP alone, a policy first articulated by its king in 1972. Traditional dress (gho and kira) remains mandatory in official and formal settings, and Buddhism shapes nearly every aspect of public life.",
    nature:
      "Bhutan is the world's only carbon-negative country, with its constitution requiring at least 60% forest cover be maintained permanently. Its Himalayan peaks include Gangkhar Puensum, believed to be the highest unclimbed mountain on Earth.",
    food: [
      { name: "Ema datshi", note: "Chilies stewed in cheese sauce, widely considered the national dish." },
      { name: "Momo", note: "Steamed dumplings filled with meat or vegetables." },
      { name: "Red rice", note: "A nutty, slightly chewy rice variety unique to the Himalayas." },
    ],
    landmarks: [
      { name: "Paro Taktsang (Tiger's Nest)", note: "A monastery built into a sheer cliff face 900 meters above the valley floor." },
      { name: "Punakha Dzong", note: "A fortress-monastery at the confluence of two rivers." },
      { name: "Dochula Pass", note: "A mountain pass with 108 memorial chortens (stupas) and Himalayan views." },
    ],
  },

  BRN: {
    history: [
      { year: "1400s", label: "Brunei Empire at its height controls much of Borneo and the Philippines" },
      { year: "1888", label: "Brunei becomes a British protectorate" },
      { year: "1929", label: "Oil discovered, transforming the economy" },
      { year: "1984", label: "Full independence from Britain" },
    ],
    culture:
      "Brunei's sultan has ruled since 1967, one of the longest-reigning monarchs in the world, and the country funds free healthcare, education, and significant subsidies from its oil and gas wealth, alongside strict adherence to Islamic law.",
    nature:
      "Much of Brunei remains covered in pristine rainforest, part of the Borneo ecosystem shared with Malaysia and Indonesia, home to proboscis monkeys and hornbills.",
    food: [
      { name: "Ambuyat", note: "A starchy sago-palm paste, eaten with a variety of dipping sauces, considered the national dish." },
      { name: "Nasi katok", note: "Rice with fried chicken and sambal, a beloved everyday meal." },
      { name: "Satay", note: "Grilled skewered meat, widely popular across the region." },
    ],
    landmarks: [
      { name: "Sultan Omar Ali Saifuddien Mosque", note: "An iconic golden-domed mosque in the capital, Bandar Seri Begawan." },
      { name: "Kampong Ayer", note: "A centuries-old stilted water village, often called the 'Venice of the East.'" },
      { name: "Ulu Temburong National Park", note: "Pristine rainforest reachable only by longboat." },
    ],
  },

  GEO: {
    history: [
      { year: "4th c. BCE", label: "Kingdom of Iberia (Kartli) emerges as an early Georgian state" },
      { year: "337", label: "Georgia adopts Christianity as its state religion" },
      { year: "1801–1918", label: "Absorbed into the Russian Empire" },
      { year: "1991", label: "Independence as the Soviet Union dissolves" },
    ],
    culture:
      "Georgia is widely considered the birthplace of wine, with archaeological evidence of winemaking in clay vessels called qvevri dating back roughly 8,000 years. Polyphonic singing traditions here are recognized by UNESCO as intangible cultural heritage.",
    nature:
      "The Greater Caucasus Mountains form Georgia's northern border, holding some of Europe's highest peaks, while the country's Black Sea coast supports a subtropical climate unusual for the region.",
    food: [
      { name: "Khachapuri", note: "Cheese-filled bread, with regional variations including one topped with a raw egg." },
      { name: "Khinkali", note: "Twisted dumplings filled with spiced meat and broth." },
      { name: "Georgian wine", note: "Made using an 8,000-year-old qvevri clay-vessel method, recognized by UNESCO." },
    ],
    landmarks: [
      { name: "Gergeti Trinity Church", note: "A mountainside church set dramatically beneath Mount Kazbek." },
      { name: "Old Town Tbilisi", note: "A historic quarter of sulfur bathhouses and balconied wooden houses." },
      { name: "Uplistsikhe", note: "An ancient cave city carved into rock, inhabited for over 3,000 years." },
    ],
  },

  ISR: {
    history: [
      { year: "~1000 BCE", label: "Traditional period of the united Kingdom of Israel under David and Solomon" },
      { year: "70 CE", label: "The Second Temple in Jerusalem is destroyed by Rome" },
      { year: "1917", label: "The Balfour Declaration expresses British support for a Jewish homeland" },
      { year: "1948", label: "The State of Israel is established" },
    ],
    culture:
      "Israel is home to sites central to Judaism, Christianity, and Islam, and Hebrew's revival as a modern spoken language — after centuries used mainly for prayer and scholarship — is considered one of history's few successful language revivals. Tel Aviv has become a major global technology hub.",
    nature:
      "Israel holds the Dead Sea, the lowest point on Earth's land surface and one of the saltiest bodies of water anywhere, alongside the Negev desert covering much of its south.",
    food: [
      { name: "Hummus", note: "Chickpea dip, a cornerstone of the region's shared food culture." },
      { name: "Falafel", note: "Fried chickpea patties, a widely popular street food." },
      { name: "Shakshuka", note: "Eggs poached in a spiced tomato sauce, a popular breakfast dish." },
    ],
    landmarks: [
      { name: "Old City of Jerusalem", note: "A walled city holding sites sacred to Judaism, Christianity, and Islam." },
      { name: "Masada", note: "An ancient hilltop fortress overlooking the Dead Sea." },
      { name: "Dead Sea", note: "The lowest point on Earth's land surface, so salty that swimmers float effortlessly." },
    ],
  },

  KGZ: {
    history: [
      { year: "201 BCE", label: "Early Kyrgyz tribes are first recorded, associated with the region around the Yenisei River" },
      { year: "1876", label: "Incorporated into the Russian Empire" },
      { year: "1936", label: "Becomes a Soviet republic" },
      { year: "1991", label: "Independence as the Soviet Union dissolves" },
    ],
    culture:
      "Kyrgyzstan's nomadic heritage remains genuinely alive rather than a tourist performance — many families still move to high mountain pastures (jailoo) with their livestock each summer, living in traditional yurts.",
    nature:
      "Roughly 90% of Kyrgyzstan sits above 1,500 meters elevation, dominated by the Tian Shan mountain range, with Issyk-Kul, one of the largest alpine lakes in the world, at its heart.",
    food: [
      { name: "Beshbarmak", note: "Boiled meat over noodles, a centerpiece of celebrations." },
      { name: "Kymyz", note: "Fermented mare's milk, a traditional nomadic staple." },
      { name: "Plov", note: "Rice with meat, carrots, and onions, shared across Central Asia." },
    ],
    landmarks: [
      { name: "Issyk-Kul Lake", note: "One of the largest alpine lakes in the world, warm enough not to freeze despite the altitude." },
      { name: "Ala Archa National Park", note: "Dramatic canyon and mountain scenery near the capital, Bishkek." },
      { name: "Tash Rabat", note: "A stone caravanserai from the Silk Road era, high in the mountains." },
    ],
  },

  MDV: {
    history: [
      { year: "~500 BCE", label: "Early Buddhist settlers arrive from Sri Lanka and India" },
      { year: "1153", label: "Conversion to Islam, which remains the state religion" },
      { year: "1887–1965", label: "British protectorate" },
      { year: "1965", label: "Independence from Britain" },
    ],
    culture:
      "The Maldives is entirely Muslim by law, and Dhivehi, its language, is written in a unique script called Thaana. Traditional Maldivian society was built around fishing and seafaring across its scattered atolls long before tourism became the dominant industry.",
    nature:
      "The Maldives is the world's lowest-lying country, with an average elevation of roughly 1.5 meters, spread across nearly 1,200 coral islands — making it one of the nations most exposed to sea level rise.",
    food: [
      { name: "Garudhiya", note: "A clear fish broth, a staple of Maldivian home cooking." },
      { name: "Mas huni", note: "Shredded smoked tuna with coconut and onion, a common breakfast." },
      { name: "Hedhikaa", note: "Bite-sized savory snacks, traditionally served with tea." },
    ],
    landmarks: [
      { name: "Malé", note: "One of the most densely populated islands on Earth, packed with the entire capital city." },
      { name: "Grand Friday Mosque, Malé", note: "A distinctive coral-stone mosque dating to the 17th century." },
      { name: "Overwater bungalow resorts", note: "An entire hospitality industry built around the islands' famous turquoise lagoons." },
    ],
  },

  TJK: {
    history: [
      { year: "9th–10th c.", label: "The Samanid Empire, a golden age of Persian culture, is centered near modern Tajikistan" },
      { year: "1868", label: "Incorporated into the Russian Empire" },
      { year: "1929", label: "Becomes a Soviet republic" },
      { year: "1992–97", label: "Civil war following independence" },
    ],
    culture:
      "Tajikistan is the only Central Asian country where the majority speaks a Persian-related language (Tajik) rather than a Turkic one, tying it culturally closer to Iran and Afghanistan than to its Turkic-speaking neighbors.",
    nature:
      "The Pamir Mountains, nicknamed the 'Roof of the World,' cover much of eastern Tajikistan, holding some of the highest peaks in the former Soviet Union and glaciers that feed Central Asia's major rivers.",
    food: [
      { name: "Plov", note: "Rice with meat, carrots, and onions, the centerpiece of Tajik hospitality." },
      { name: "Qurutob", note: "Bread soaked in a fermented yogurt sauce, considered a national dish." },
      { name: "Samsa", note: "Baked pastries filled with meat or pumpkin." },
    ],
    landmarks: [
      { name: "Pamir Highway", note: "One of the world's highest and most remote roads, crossing the 'Roof of the World.'" },
      { name: "Iskanderkul Lake", note: "A glacial lake named for Alexander the Great." },
      { name: "Hissar Fort", note: "Ruins of a fortress guarding a historic Silk Road route." },
    ],
  },

  TLS: {
    history: [
      { year: "1515", label: "Portuguese traders arrive, beginning centuries of colonial presence" },
      { year: "1975", label: "Declares independence from Portugal, then is invaded days later" },
      { year: "1999", label: "A UN-supervised referendum votes overwhelmingly for independence" },
      { year: "2002", label: "Formal independence, becoming Asia's youngest nation" },
    ],
    culture:
      "Timor-Leste's culture blends Melanesian, Portuguese, and Southeast Asian influences, with Tetum and Portuguese as official languages. Catholicism, introduced under Portuguese rule, remains the majority religion, unusual in the region.",
    nature:
      "Timor-Leste's mountainous terrain and surrounding waters, part of the Coral Triangle, hold exceptional marine biodiversity, with pristine dive sites just off its coastline.",
    food: [
      { name: "Ikan sabuko", note: "Grilled fish, often marinated with local spices." },
      { name: "Batar da'an", note: "Corn, beans, and pumpkin cooked together, a traditional staple." },
      { name: "Tropical fruit", note: "Papaya, banana, and other produce are dietary staples." },
    ],
    landmarks: [
      { name: "Cristo Rei of Dili", note: "A large statue of Christ overlooking the capital, reached by a long stairway." },
      { name: "Jaco Island", note: "A pristine, uninhabited island off the eastern tip." },
      { name: "Mount Ramelau", note: "Timor-Leste's highest peak, a pilgrimage site with a Virgin Mary statue at its summit." },
    ],
  },

  TKM: {
    history: [
      { year: "~2500 BCE", label: "The ancient Bronze Age Oxus civilization flourishes in the region" },
      { year: "1881", label: "Incorporated into the Russian Empire following Turkmen resistance" },
      { year: "1924", label: "Becomes a Soviet republic" },
      { year: "1991", label: "Independence as the Soviet Union dissolves" },
    ],
    culture:
      "Turkmenistan's Akhal-Teke horse breed, prized for its metallic sheen and endurance, has been bred in the region for thousands of years and remains a powerful national symbol. Turkmen carpet-weaving traditions are recognized by UNESCO.",
    nature:
      "The Karakum Desert covers about 70% of Turkmenistan, holding the Darvaza gas crater — nicknamed the 'Door to Hell' — which has burned continuously since the 1970s.",
    food: [
      { name: "Plov", note: "Rice with lamb, carrots, and onions, central to Turkmen hospitality." },
      { name: "Manty", note: "Steamed dumplings filled with meat." },
      { name: "Chorba", note: "A hearty meat and vegetable soup." },
    ],
    landmarks: [
      { name: "Darvaza Gas Crater", note: "A natural gas field that collapsed into a crater and has burned continuously since the 1970s." },
      { name: "Ashgabat", note: "A capital city famous for its extraordinary concentration of white marble buildings." },
      { name: "Ancient Merv", note: "Ruins of one of the great Silk Road cities, once among the largest in the world." },
    ],
  },
  ALB: {
    history: [
      { year: "1190", label: "The Principality of Arbanon, considered the first Albanian state, is established" },
      { year: "1478–1912", label: "Ottoman rule" },
      { year: "1912", label: "Independence declared" },
      { year: "1944–85", label: "Enver Hoxha's isolationist communist regime, including an official ban on religion" },
    ],
    culture:
      "Albania's Skanderbeg, a 15th-century nobleman who resisted Ottoman expansion for over two decades, remains the country's most celebrated national hero. Decades of communist-era isolation left the country famously dotted with hundreds of thousands of small concrete bunkers.",
    nature:
      "Albania's coastline spans both the Adriatic and Ionian Seas, and its rugged interior, including the Albanian Alps, has kept parts of the country remarkably wild and undeveloped.",
    food: [
      { name: "Tavë kosi", note: "Baked lamb with rice and a tangy yogurt sauce, widely considered the national dish." },
      { name: "Byrek", note: "A flaky pastry filled with cheese, spinach, or meat." },
      { name: "Fresh Adriatic seafood", note: "Common along the coastal regions." },
    ],
    landmarks: [
      { name: "Berat", note: "A UNESCO-listed 'city of a thousand windows,' known for its Ottoman-era hillside houses." },
      { name: "Butrint", note: "Ancient ruins spanning Greek, Roman, and Byzantine periods." },
      { name: "Albanian Riviera", note: "A dramatic coastline of cliffs and beaches along the Ionian Sea." },
    ],
  },

  AND: {
    history: [
      { year: "1278", label: "A charter establishes joint sovereignty between the Count of Foix and the Bishop of Urgell, still in effect today" },
      { year: "1993", label: "Andorra adopts its first written constitution" },
      { year: "1993", label: "Joins the United Nations" },
    ],
    culture:
      "Andorra is co-ruled by two princes — the President of France and the Bishop of Urgell in Spain — an arrangement dating to 1278 and one of the last surviving examples of feudal co-sovereignty in the world. Catalan is the sole official language.",
    nature:
      "Nestled entirely within the Pyrenees between France and Spain, Andorra is Europe's highest capital country by average elevation, with a landscape dominated by mountains and ski resorts.",
    food: [
      { name: "Trinxat", note: "Cabbage and potato mashed and pan-fried with bacon, a mountain comfort dish." },
      { name: "Escudella", note: "A slow-cooked meat and vegetable stew." },
      { name: "Formatge de tupí", note: "A pungent aged cheese, a distinctly Andorran specialty." },
    ],
    landmarks: [
      { name: "Madriu-Perafita-Claror Valley", note: "Andorra's only UNESCO World Heritage site, a glacial mountain valley." },
      { name: "Casa de la Vall", note: "The former seat of Andorra's parliament, dating to the 16th century." },
      { name: "Vallnord & Grandvalira", note: "Among the largest ski resort areas in the Pyrenees." },
    ],
  },

  BIH: {
    history: [
      { year: "1180s", label: "The medieval Banate of Bosnia emerges as an early state" },
      { year: "1463–1878", label: "Ottoman rule" },
      { year: "1914", label: "The assassination of Archduke Franz Ferdinand in Sarajevo helps trigger WWI" },
      { year: "1992–95", label: "The Bosnian War, including the Srebrenica massacre, later recognized as genocide by international courts" },
    ],
    culture:
      "Bosnia and Herzegovina's population reflects a genuine blend of Bosniak Muslim, Serb Orthodox, and Croat Catholic communities, and Sarajevo's Ottoman-era old town earned it a historic reputation as the 'Jerusalem of Europe' for its religious diversity.",
    nature:
      "Bosnia and Herzegovina is largely mountainous and forested, with the Dinaric Alps running through its interior and a short but dramatic Adriatic coastline around the town of Neum.",
    food: [
      { name: "Ćevapi", note: "Grilled minced-meat sausages, widely regarded as the national dish." },
      { name: "Burek", note: "A flaky pastry filled with meat, cheese, or spinach." },
      { name: "Bosnian coffee", note: "Prepared in a distinctive copper pot, central to daily hospitality." },
    ],
    landmarks: [
      { name: "Stari Most (Old Bridge), Mostar", note: "A 16th-century Ottoman bridge, rebuilt after being destroyed in the 1990s war." },
      { name: "Sarajevo's Baščaršija", note: "The historic Ottoman-era old bazaar quarter." },
      { name: "Kravice Waterfalls", note: "A wide, tiered waterfall on the Trebižat River." },
    ],
  },

  LIE: {
    history: [
      { year: "1719", label: "The Holy Roman Emperor unites two lordships into the Principality of Liechtenstein" },
      { year: "1806", label: "Liechtenstein becomes fully sovereign following the dissolution of the Holy Roman Empire" },
      { year: "1923", label: "Forms a customs and currency union with Switzerland" },
      { year: "1990", label: "Joins the United Nations" },
    ],
    culture:
      "Liechtenstein is one of only two doubly landlocked countries in the world — bordered entirely by other landlocked countries (Switzerland and Austria) — the other being Uzbekistan. Its low corporate tax rate has drawn far more registered companies than the country has citizens.",
    nature:
      "The Rhine River forms Liechtenstein's western border, and the Alps rise steeply across most of its small territory, leaving only a narrow valley for settlement.",
    food: [
      { name: "Käsknöpfle", note: "A cheese-and-dumpling dish similar to a rich mac and cheese." },
      { name: "Ribel", note: "A cornmeal dish, historically a peasant staple, now a local specialty." },
      { name: "Alpine cheeses", note: "Produced in the country's mountain dairies." },
    ],
    landmarks: [
      { name: "Vaduz Castle", note: "The reigning prince's residence, overlooking the capital from a hillside." },
      { name: "Gutenberg Castle", note: "A restored medieval castle in the town of Balzers." },
      { name: "Malbun", note: "A small alpine resort village popular for hiking and skiing." },
    ],
  },

  LUX: {
    history: [
      { year: "963", label: "Siegfried of Ardennes establishes a castle that becomes the foundation of Luxembourg City" },
      { year: "1839", label: "Modern Luxembourg's borders are set by the Treaty of London" },
      { year: "1867", label: "Neutrality guaranteed by treaty; the country's fortress is dismantled" },
      { year: "1957", label: "Becomes a founding member of what would grow into the European Union" },
    ],
    culture:
      "Luxembourg is the world's only remaining sovereign grand duchy, and most residents speak three languages fluently — Luxembourgish, French, and German — switching between them in daily life. It's also home to major EU institutions alongside Brussels and Strasbourg.",
    nature:
      "Luxembourg's north (the Ardennes) is hilly and forested, while its south holds the fertile Moselle river valley, known for its vineyards.",
    food: [
      { name: "Judd mat Gaardebounen", note: "Smoked pork collar with broad beans, widely considered the national dish." },
      { name: "Gromperekichelcher", note: "Fried potato fritters, a popular street food." },
      { name: "Luxembourg wine", note: "Produced along the Moselle valley, mostly for domestic consumption." },
    ],
    landmarks: [
      { name: "Luxembourg City's Old Quarters", note: "A UNESCO-listed old town built into dramatic river gorges." },
      { name: "Vianden Castle", note: "A restored medieval castle overlooking the Ardennes." },
      { name: "Bock Casemates", note: "A network of underground fortress tunnels carved into rock." },
    ],
  },

  MLT: {
    history: [
      { year: "~3600 BCE", label: "Megalithic temples are built on Malta, among the oldest freestanding stone structures on Earth" },
      { year: "1530–1798", label: "Ruled by the Knights of St. John (Knights Hospitaller)" },
      { year: "1565", label: "The Great Siege of Malta repels a massive Ottoman invasion force" },
      { year: "1964", label: "Independence from Britain" },
    ],
    culture:
      "Malta's megalithic temples, built around 3600 BCE, predate Stonehenge and the Egyptian pyramids, making them among the oldest freestanding structures in the world. The Knights of St. John's centuries of rule left Valletta one of the most concentrated collections of historic architecture anywhere.",
    nature:
      "Malta is one of the smallest and most densely populated countries in the world, an archipelago in the central Mediterranean with dramatic limestone cliffs and turquoise coves.",
    food: [
      { name: "Fenkata (rabbit stew)", note: "Widely considered Malta's national dish." },
      { name: "Pastizzi", note: "Flaky pastries filled with ricotta or mushy peas." },
      { name: "Ftira", note: "A distinctive ring-shaped Maltese bread." },
    ],
    landmarks: [
      { name: "Valletta", note: "An entire UNESCO World Heritage capital city, built by the Knights of St. John." },
      { name: "Ħaġar Qim & Mnajdra", note: "Megalithic temple complexes older than Stonehenge." },
      { name: "Blue Lagoon, Comino", note: "A strikingly turquoise cove between Malta's main islands." },
    ],
  },

  MDA: {
    history: [
      { year: "1359", label: "The Principality of Moldavia is founded" },
      { year: "1812", label: "Bessarabia (most of modern Moldova) is annexed by the Russian Empire" },
      { year: "1940", label: "Incorporated into the Soviet Union as the Moldavian SSR" },
      { year: "1991", label: "Independence as the Soviet Union dissolves" },
    ],
    culture:
      "Moldova's wine culture runs deep — Mileștii Mici, one of its wine cellars, holds a Guinness World Record for the largest wine collection on Earth, stored across nearly 200 km of underground tunnels. Romanian and Moldovan cultural ties remain close, sharing a common language.",
    nature:
      "Moldova is a small, landlocked, hilly country dominated by farmland and vineyards, with the Dniester River forming much of its eastern boundary.",
    food: [
      { name: "Mămăligă", note: "A cornmeal porridge similar to polenta, a national staple." },
      { name: "Sarmale", note: "Cabbage rolls stuffed with spiced meat and rice." },
      { name: "Moldovan wine", note: "Produced across extensive vineyards; the country is home to some of the world's largest wine cellars." },
    ],
    landmarks: [
      { name: "Mileștii Mici", note: "An enormous underground wine cellar with nearly 200 km of tunnels." },
      { name: "Orheiul Vechi", note: "A clifftop monastery complex carved into limestone, inhabited since antiquity." },
      { name: "Capriana Monastery", note: "One of Moldova's oldest and most important Orthodox monasteries." },
    ],
  },

  MCO: {
    history: [
      { year: "1297", label: "François Grimaldi captures the fortress of Monaco disguised as a monk, founding the ruling dynasty" },
      { year: "1861", label: "Monaco cedes most of its territory to France in exchange for recognized independence" },
      { year: "1929", label: "The first Monaco Grand Prix is held, run through the streets of the city ever since" },
      { year: "1993", label: "Monaco joins the United Nations" },
    ],
    culture:
      "Monaco has been ruled by the same family, the Grimaldis, since 1297 — one of the longest-reigning dynasties in the world. The Monaco Grand Prix, raced through the city's own streets since 1929, remains one of motorsport's most prestigious events.",
    nature:
      "Monaco is the second-smallest country in the world and the most densely populated, its entire territory squeezed onto a narrow strip of Mediterranean coastline beneath steep hills.",
    food: [
      { name: "Socca", note: "A thin chickpea-flour pancake shared with the neighboring French Riviera." },
      { name: "Barbagiuan", note: "Fried pastries filled with chard and ricotta." },
      { name: "Mediterranean seafood", note: "A staple of Monégasque cuisine." },
    ],
    landmarks: [
      { name: "Monte Carlo Casino", note: "An opulent 19th-century casino that helped build Monaco's modern economy." },
      { name: "Prince's Palace", note: "The Grimaldi family's residence since the 13th century." },
      { name: "Monaco Grand Prix circuit", note: "A street circuit raced through the heart of the city every year." },
    ],
  },

  MNE: {
    history: [
      { year: "1042", label: "An early Montenegrin state (Duklja) achieves recognized independence" },
      { year: "1516–1852", label: "Ruled as a theocracy by prince-bishops" },
      { year: "1918", label: "Joins the Kingdom of Serbs, Croats and Slovenes (later Yugoslavia)" },
      { year: "2006", label: "Independence restored via a peaceful referendum" },
    ],
    culture:
      "Montenegro's name, meaning 'Black Mountain,' reflects its rugged terrain, and the country's small size belies a rich Orthodox Christian monastic tradition, with monasteries built into cliffsides across the interior.",
    nature:
      "Montenegro packs dramatic Adriatic coastline, the deep Tara River Canyon (Europe's deepest gorge), and rugged mountains into a remarkably compact area.",
    food: [
      { name: "Njeguški pršut", note: "Smoke-cured ham from the village of Njeguši, a prized delicacy." },
      { name: "Kačamak", note: "A cornmeal and potato dish similar to polenta." },
      { name: "Fresh Adriatic seafood", note: "Common along the coastal towns." },
    ],
    landmarks: [
      { name: "Bay of Kotor", note: "A dramatic fjord-like bay ringed by mountains and a UNESCO-listed medieval old town." },
      { name: "Ostrog Monastery", note: "A monastery built directly into a vertical cliff face." },
      { name: "Tara River Canyon", note: "Europe's deepest gorge, popular for rafting." },
    ],
  },

  MKD: {
    history: [
      { year: "4th c. BCE", label: "The ancient Kingdom of Macedon, home of Alexander the Great, is centered partly in this region" },
      { year: "1913", label: "The region is divided among Balkan states following the Balkan Wars" },
      { year: "1991", label: "Independence as Yugoslavia dissolves, initially as 'Republic of Macedonia'" },
      { year: "2019", label: "Renamed North Macedonia following a long-running naming dispute with Greece" },
    ],
    culture:
      "North Macedonia's Ohrid, on the shores of one of Europe's oldest and deepest lakes, was once said to have 365 churches — one for each day of the year — reflecting the region's deep Orthodox Christian heritage.",
    nature:
      "North Macedonia is landlocked and mountainous, centered on Lake Ohrid, one of Europe's oldest and deepest lakes and home to species found nowhere else.",
    food: [
      { name: "Tavče gravče", note: "Baked beans, widely considered the national dish." },
      { name: "Ajvar", note: "A roasted red pepper relish, made in large batches each autumn." },
      { name: "Shopska salad", note: "Tomatoes, cucumbers, and cheese, shared across the Balkans." },
    ],
    landmarks: [
      { name: "Lake Ohrid", note: "One of Europe's oldest and deepest lakes, a UNESCO World Heritage site for both nature and culture." },
      { name: "Matka Canyon", note: "A dramatic gorge near the capital, Skopje, popular for hiking and kayaking." },
      { name: "Skopje's Stone Bridge", note: "A 15th-century Ottoman bridge linking the city's old and new quarters." },
    ],
  },

  SMR: {
    history: [
      { year: "301", label: "Traditionally founded by a Christian stonemason, Marinus, fleeing religious persecution" },
      { year: "1600", label: "Adopts one of the world's oldest surviving written constitutions" },
      { year: "1862", label: "Signs a treaty of friendship with the newly unified Kingdom of Italy, preserving its independence" },
      { year: "1992", label: "Joins the United Nations" },
    ],
    culture:
      "San Marino claims to be the oldest surviving sovereign state and constitutional republic on Earth, continuously self-governing since its traditional founding in 301 CE. Its entire economy and identity remain closely intertwined with — yet distinct from — surrounding Italy.",
    nature:
      "San Marino is built around Monte Titano, a steep limestone peak in the Apennines, with sweeping views across the surrounding Italian countryside to the Adriatic Sea.",
    food: [
      { name: "Piadina", note: "A thin flatbread, shared with the neighboring Romagna region of Italy." },
      { name: "Fagioli con le cotiche", note: "A bean and pork-rind stew." },
      { name: "Torta tre monti", note: "A layered wafer cake named for San Marino's three peaks." },
    ],
    landmarks: [
      { name: "Three Towers of San Marino", note: "Medieval fortresses crowning the peaks of Monte Titano." },
      { name: "Basilica di San Marino", note: "A neoclassical basilica housing the relics of the country's founder." },
      { name: "City of San Marino", note: "The entire historic capital is a UNESCO World Heritage site." },
    ],
  },

  SVK: {
    history: [
      { year: "863", label: "Christian missionaries Cyril and Methodius arrive in Great Moravia, centered partly in modern Slovakia" },
      { year: "1000s–1918", label: "Part of the Kingdom of Hungary for nearly a millennium" },
      { year: "1993", label: "Czechoslovakia peacefully splits into the Czech Republic and Slovakia (the 'Velvet Divorce')" },
      { year: "2004", label: "Joins the European Union" },
    ],
    culture:
      "Slovakia has more castles and châteaux per capita than any other country in the world, a legacy of its long history as a contested borderland within the Kingdom of Hungary and beyond.",
    nature:
      "The Carpathian Mountains, including the dramatic High Tatras, dominate northern Slovakia, holding some of Central Europe's highest peaks and best-preserved alpine wilderness.",
    food: [
      { name: "Bryndzové halušky", note: "Potato dumplings with sheep's cheese and bacon, widely considered the national dish." },
      { name: "Kapustnica", note: "A sauerkraut and sausage soup, especially popular at Christmas." },
      { name: "Trdelník", note: "A rolled, grilled pastry dusted with sugar." },
    ],
    landmarks: [
      { name: "Spiš Castle", note: "One of the largest castle complexes in Central Europe, a UNESCO World Heritage site." },
      { name: "High Tatras", note: "A dramatic, glacially carved mountain range with Slovakia's highest peaks." },
      { name: "Bratislava Castle", note: "A hilltop fortress overlooking the capital and the Danube." },
    ],
  },

  SVN: {
    history: [
      { year: "6th c.", label: "Slavic tribes settle the region, forming the early Duchy of Carantania" },
      { year: "1000s–1918", label: "Part of the Habsburg (Austrian) monarchy for nearly a millennium" },
      { year: "1991", label: "Declares independence from Yugoslavia after a brief Ten-Day War" },
      { year: "2004", label: "Joins the European Union, followed by the eurozone in 2007" },
    ],
    culture:
      "Slovenia's Ljubljana was European Green Capital in 2016, reflecting a national identity built around sustainability, and it was the first former Yugoslav republic to join both the EU and the eurozone.",
    nature:
      "Nearly 60% of Slovenia is forested, among the highest shares in Europe, and the country packs the Julian Alps, Adriatic coastline, and the karst caves that gave 'karst' its name into a remarkably small area.",
    food: [
      { name: "Potica", note: "A rolled pastry filled with walnuts or other fillings, a festive staple." },
      { name: "Kranjska klobasa", note: "A traditional Carniolan sausage protected by geographic designation." },
      { name: "Štruklji", note: "Rolled dumplings, sweet or savory, boiled or baked." },
    ],
    landmarks: [
      { name: "Lake Bled", note: "An alpine lake with a church on a tiny island and a clifftop castle." },
      { name: "Postojna Cave", note: "One of the largest karst cave systems in the world, explored by train since 1872." },
      { name: "Julian Alps & Triglav National Park", note: "Slovenia's only national park, centered on its highest peak." },
    ],
  },

  VAT: {
    history: [
      { year: "4th c.", label: "Emperor Constantine commissions the first St. Peter's Basilica over the traditional burial site of St. Peter" },
      { year: "756", label: "The Donation of Pepin establishes the Papal States, lasting over a thousand years" },
      { year: "1870", label: "The Papal States are absorbed into a unified Italy" },
      { year: "1929", label: "The Lateran Treaty with Italy establishes Vatican City as a fully independent sovereign state" },
    ],
    culture:
      "Vatican City is the spiritual center of the worldwide Catholic Church and home to the Pope, its head of state. Swiss Guards, recruited exclusively from Switzerland since 1506, still protect the Pope in distinctive Renaissance-era uniforms.",
    landmarks: [
      { name: "St. Peter's Basilica", note: "One of the largest churches in the world, built over the traditional burial site of St. Peter." },
      { name: "Sistine Chapel", note: "Famous for Michelangelo's ceiling and Last Judgment frescoes." },
      { name: "Vatican Museums", note: "Home to one of the world's greatest art collections, accumulated by popes over centuries." },
    ],
  },
  ATG: {
    history: [
      { year: "1493", label: "Christopher Columbus sights Antigua on his second voyage" },
      { year: "1632", label: "England establishes its first successful settlement" },
      { year: "1784", label: "Admiral Horatio Nelson takes command of the Caribbean fleet from English Harbour" },
      { year: "1981", label: "Independence from Britain" },
    ],
    culture:
      "Antigua and Barbuda's Carnival, celebrating the abolition of slavery, is the country's biggest cultural event of the year, and cricket holds a place close to a national passion, as across much of the English-speaking Caribbean.",
    nature:
      "The twin-island nation claims 365 beaches, one for each day of the year, ringed by coral reefs in the eastern Caribbean.",
    food: [
      { name: "Fungee and pepperpot", note: "Cornmeal alongside a hearty meat and vegetable stew, widely considered the national dish." },
      { name: "Saltfish", note: "Salted, dried fish, a Caribbean staple prepared many ways." },
      { name: "Ducana", note: "A sweet, spiced sweet-potato dumpling wrapped in banana leaf." },
    ],
    landmarks: [
      { name: "Nelson's Dockyard", note: "The only continuously working Georgian-era naval dockyard in the world, a UNESCO World Heritage site." },
      { name: "Shirley Heights", note: "A former military lookout with sweeping views over English Harbour." },
      { name: "Barbuda's Frigate Bird Sanctuary", note: "One of the largest frigate bird colonies in the world." },
    ],
  },

  BHS: {
    history: [
      { year: "1492", label: "Christopher Columbus makes his first landfall in the Americas on a Bahamian island" },
      { year: "1718", label: "Britain establishes a formal colonial government, partly to suppress piracy" },
      { year: "1973", label: "Independence from Britain" },
    ],
    culture:
      "Junkanoo, a vibrant street parade with costumes, music, and dance rooted in West African tradition, is the Bahamas' signature cultural celebration, held every Boxing Day and New Year's Day.",
    nature:
      "The Bahamas spans over 700 islands and cays, with waters so clear that the Tongue of the Ocean — a deep trench off Andros Island — is used by the US Navy to test submarines.",
    food: [
      { name: "Conch salad", note: "Diced conch marinated in citrus, a beloved Bahamian staple." },
      { name: "Peas and rice", note: "Pigeon peas and rice, a near-universal side dish." },
      { name: "Guava duff", note: "A steamed guava-filled dessert, rolled like a jelly roll." },
    ],
    landmarks: [
      { name: "Pink Sands Beach, Harbour Island", note: "A famous beach with genuinely pink-tinted sand." },
      { name: "Thunderball Grotto", note: "An underwater cave system made famous by James Bond films." },
      { name: "Exuma's swimming pigs", note: "Wild pigs that swim out to greet boats in the Exuma Cays." },
    ],
  },

  BRB: {
    history: [
      { year: "1627", label: "England establishes its first permanent settlement" },
      { year: "1600s–1800s", label: "Sugar plantations built on enslaved labor drive the colonial economy" },
      { year: "1966", label: "Independence from Britain" },
      { year: "2021", label: "Barbados becomes a republic, removing the British monarch as head of state" },
    ],
    culture:
      "Barbados is widely credited as the birthplace of rum, with Mount Gay, dating to 1703, considered the world's oldest rum brand still in production. Cricket and the Crop Over festival, celebrating the historic sugar cane harvest, remain central to national identity.",
    nature:
      "Barbados sits slightly apart from the volcanic Lesser Antilles chain, giving it a flatter, coral-limestone geology and calmer Caribbean-side beaches alongside a rougher Atlantic coast.",
    food: [
      { name: "Cou-cou and flying fish", note: "Cornmeal and okra paired with flying fish, the national dish." },
      { name: "Macaroni pie", note: "A baked, cheesy pasta dish, a Bajan Sunday staple." },
      { name: "Rum", note: "Barbados is considered the birthplace of rum distillation." },
    ],
    landmarks: [
      { name: "Harrison's Cave", note: "A crystallized limestone cavern explored by tram." },
      { name: "Bathsheba", note: "A dramatic Atlantic coastline known for its rock formations and surfing." },
      { name: "Historic Bridgetown", note: "A UNESCO-listed capital reflecting centuries of British colonial garrison history." },
    ],
  },

  BLZ: {
    history: [
      { year: "1638", label: "English settlers begin logging along the coast, the first European foothold" },
      { year: "1862", label: "Formally becomes the colony of British Honduras" },
      { year: "1981", label: "Independence from Britain, taking the name Belize" },
    ],
    culture:
      "Belize is the only Central American country where English is the official language, reflecting its history as British Honduras, and Garifuna and Maya communities keep distinct languages and traditions alive alongside Creole, Mestizo, and other groups.",
    nature:
      "Belize protects the Mesoamerican Barrier Reef, the second-largest barrier reef system in the world, alongside extensive rainforest sheltering jaguars and hundreds of bird species.",
    food: [
      { name: "Rice and beans", note: "Cooked in coconut milk, often served with stewed meat, a Belizean staple." },
      { name: "Garnaches", note: "Fried corn tortillas topped with beans, cheese, and cabbage." },
      { name: "Hudut", note: "A Garifuna dish of mashed plantains with fish in coconut broth." },
    ],
    landmarks: [
      { name: "Great Blue Hole", note: "A massive marine sinkhole visible from space, part of the barrier reef system." },
      { name: "Caracol", note: "Belize's largest Maya archaeological site, deep in the rainforest." },
      { name: "Xunantunich", note: "A Maya ceremonial center with sweeping jungle views from its main pyramid." },
    ],
  },

  DMA: {
    history: [
      { year: "1493", label: "Sighted by Columbus on a Sunday, giving the island its name" },
      { year: "1763", label: "Ceded to Britain, though Kalinago (Carib) resistance continued longer here than most" },
      { year: "1978", label: "Independence from Britain" },
    ],
    culture:
      "Dominica is home to the last significant population of Kalinago (Carib) people in the Caribbean, living in a designated territory that preserves their traditions. The island's rugged terrain kept European colonization slower and less complete here than on neighboring islands.",
    nature:
      "Nicknamed 'the Nature Island,' Dominica is covered in dense rainforest and volcanic peaks, home to Boiling Lake, the second-largest hot lake on Earth, formed above a flooded volcanic vent.",
    food: [
      { name: "Callaloo soup", note: "A leafy green soup, often with crab." },
      { name: "Mountain chicken", note: "Despite the name, a large frog once considered a national delicacy, now protected due to declining populations." },
      { name: "Bakes and saltfish", note: "Fried dough with salted fish, a common breakfast." },
    ],
    landmarks: [
      { name: "Boiling Lake", note: "The world's second-largest hot lake, reached by a demanding hike." },
      { name: "Trafalgar Falls", note: "Twin waterfalls easily accessible near the capital." },
      { name: "Morne Trois Pitons National Park", note: "A UNESCO World Heritage rainforest reserve of volcanoes and lakes." },
    ],
  },

  SLV: {
    history: [
      { year: "1200s–1500s", label: "The Pipil people establish the kingdom of Cuzcatlán" },
      { year: "1524", label: "Spanish conquest begins under Pedro de Alvarado" },
      { year: "1821", label: "Independence from Spain" },
      { year: "1980–92", label: "A civil war between the government and leftist guerrillas" },
    ],
    culture:
      "El Salvador's identity has been shaped by resilience through both natural disasters — it sits on the Pacific Ring of Fire — and a difficult civil-war era, with a strong modern emphasis on rebuilding and tourism growth.",
    nature:
      "El Salvador is Central America's smallest mainland country, dotted with volcanoes along the Pacific Ring of Fire, including several still active, alongside a coastline popular with surfers.",
    food: [
      { name: "Pupusas", note: "Thick corn tortillas stuffed with cheese, beans, or pork, widely considered the national dish." },
      { name: "Yuca frita", note: "Fried cassava, often served with pickled cabbage." },
      { name: "Horchata", note: "A cinnamon-spiced rice or morro-seed drink." },
    ],
    landmarks: [
      { name: "Joya de Cerén", note: "A Maya farming village preserved under volcanic ash, called the 'Pompeii of the Americas.'" },
      { name: "Santa Ana Volcano", note: "An active volcano with a striking turquoise crater lake." },
      { name: "El Tunco", note: "A popular Pacific surf beach." },
    ],
  },

  GRD: {
    history: [
      { year: "1498", label: "Sighted by Columbus on his third voyage" },
      { year: "1650", label: "French settlers establish the first European colony" },
      { year: "1763", label: "Ceded to Britain" },
      { year: "1983", label: "A US-led military intervention follows a violent internal coup" },
    ],
    culture:
      "Grenada is nicknamed the 'Spice Isle' for its nutmeg, mace, and cinnamon production — a nutmeg pod is even featured on the national flag. Its Carnival, known as Spicemas, is one of the Caribbean's most vibrant celebrations.",
    nature:
      "Grenada's volcanic peaks support lush rainforest and spice plantations, ringed by beaches and an underwater sculpture park just offshore.",
    food: [
      { name: "Oil down", note: "A one-pot dish of breadfruit, salted meat, and coconut milk, widely considered the national dish." },
      { name: "Nutmeg ice cream", note: "A local specialty reflecting the island's signature spice." },
      { name: "Callaloo soup", note: "A leafy green soup shared across the Caribbean." },
    ],
    landmarks: [
      { name: "Grand Anse Beach", note: "A two-mile stretch of white sand, among the Caribbean's most celebrated beaches." },
      { name: "Underwater Sculpture Park", note: "One of the first of its kind, submerged off the coast near St. George's." },
      { name: "Grand Etang National Park", note: "A rainforest reserve centered on a volcanic crater lake." },
    ],
  },

  GUY: {
    history: [
      { year: "1616", label: "The Dutch establish the first European settlements" },
      { year: "1814", label: "Ceded to Britain, becoming British Guiana" },
      { year: "1966", label: "Independence from Britain" },
      { year: "2015", label: "Major offshore oil discoveries begin transforming the economy" },
    ],
    culture:
      "Guyana is the only English-speaking country on the South American mainland, and its population reflects a distinctive mix of Indo-Guyanese and Afro-Guyanese communities descended from indentured laborers and enslaved people brought under colonial rule.",
    nature:
      "Over 80% of Guyana remains covered in pristine rainforest, part of the Amazon and Guiana Shield ecosystems, holding Kaieteur Falls, one of the world's tallest single-drop waterfalls.",
    food: [
      { name: "Pepperpot", note: "A dark, slow-cooked meat stew flavored with cassareep, widely considered the national dish." },
      { name: "Roti and curry", note: "Reflecting the country's significant Indo-Guyanese population." },
      { name: "Cook-up rice", note: "Rice cooked with beans, meat, and coconut milk." },
    ],
    landmarks: [
      { name: "Kaieteur Falls", note: "One of the world's tallest single-drop waterfalls, nearly five times the height of Niagara." },
      { name: "Iwokrama Forest", note: "A vast protected rainforest reserve." },
      { name: "Shell Beach", note: "A remote nesting site for four species of endangered sea turtles." },
    ],
  },

  NIC: {
    history: [
      { year: "1522", label: "Spanish conquest begins under Gil González Dávila" },
      { year: "1821", label: "Independence from Spain" },
      { year: "1937–79", label: "The Somoza family dictatorship rules for over four decades" },
      { year: "1979", label: "The Sandinista Revolution overthrows the Somoza government" },
    ],
    culture:
      "Nicaragua is the largest country in Central America, and its literary tradition is a source of deep national pride — poet Rubén Darío, a founder of Spanish-language literary modernism, remains a defining cultural figure.",
    nature:
      "Nicaragua holds Lake Nicaragua, Central America's largest lake and one of the few freshwater lakes anywhere with a resident population of bull sharks, alongside a chain of volcanoes along the Pacific side.",
    food: [
      { name: "Gallo pinto", note: "Rice and beans, the everyday staple." },
      { name: "Vigorón", note: "Boiled yuca topped with pork rinds and cabbage slaw." },
      { name: "Nacatamal", note: "A large tamale filled with meat, rice, and vegetables, wrapped in banana leaf." },
    ],
    landmarks: [
      { name: "Ometepe Island", note: "An island formed by two volcanoes rising from Lake Nicaragua." },
      { name: "Masaya Volcano", note: "One of the few volcanoes in the world with a permanently visible lava lake, viewable by road." },
      { name: "Granada", note: "A well-preserved Spanish colonial city on the shores of Lake Nicaragua." },
    ],
  },

  KNA: {
    history: [
      { year: "1493", label: "Sighted by Columbus, who named Saint Kitts after himself (San Cristóbal)" },
      { year: "1623", label: "England establishes its first Caribbean colony here, predating Barbados and Jamaica" },
      { year: "1783", label: "Alexander Hamilton, later a founding US statesman, is born on Nevis" },
      { year: "1983", label: "Independence from Britain" },
    ],
    culture:
      "Saint Kitts and Nevis was England's first Caribbean colony, sometimes called 'the mother colony of the West Indies,' and Alexander Hamilton, a US Founding Father, was born on Nevis in the 1750s.",
    nature:
      "The twin-island federation is the smallest sovereign country in the Americas, built around volcanic peaks including Mount Liamuiga, a dormant volcano on Saint Kitts.",
    food: [
      { name: "Stewed saltfish and spicy plantain", note: "Widely considered the national dish." },
      { name: "Goat water", note: "A spiced goat stew, a festive specialty." },
      { name: "Conkies", note: "A cornmeal and coconut dessert steamed in banana leaf." },
    ],
    landmarks: [
      { name: "Brimstone Hill Fortress", note: "A UNESCO-listed 18th-century fortress known as the 'Gibraltar of the West Indies.'" },
      { name: "Nevis Peak", note: "A dormant volcano dominating the smaller island." },
      { name: "Romney Manor", note: "Historic botanical gardens on a former sugar plantation." },
    ],
  },

  LCA: {
    history: [
      { year: "1502", label: "Sighted by Columbus, though the exact date of European discovery is disputed" },
      { year: "1600s–1814", label: "Contested repeatedly between France and Britain, changing hands 14 times" },
      { year: "1814", label: "Formally ceded to Britain" },
      { year: "1979", label: "Independence from Britain" },
    ],
    culture:
      "Saint Lucia has produced two Nobel laureates — economist Arthur Lewis and poet Derek Walcott — an extraordinary number for an island of its size. Its French and British colonial past, having changed hands 14 times, left a lasting Creole (Kwéyòl) language alongside English.",
    nature:
      "The Pitons, twin volcanic spires rising directly from the Caribbean Sea, are Saint Lucia's most iconic natural landmark and a UNESCO World Heritage site.",
    food: [
      { name: "Green fig and saltfish", note: "Boiled green bananas with salted codfish, the national dish." },
      { name: "Bakes", note: "Fried or baked dough, a breakfast staple." },
      { name: "Callaloo soup", note: "A leafy green soup, shared across the Caribbean." },
    ],
    landmarks: [
      { name: "The Pitons", note: "Twin volcanic spires and a UNESCO World Heritage site." },
      { name: "Sulphur Springs", note: "A drive-in volcano with bubbling mud pools." },
      { name: "Diamond Falls Botanical Gardens", note: "Mineral-tinted waterfalls surrounded by tropical gardens." },
    ],
  },

  VCT: {
    history: [
      { year: "1498", label: "Sighted by Columbus" },
      { year: "1700s", label: "Indigenous and Garifuna resistance delayed European settlement longer than on most islands" },
      { year: "1783", label: "Formally ceded to Britain" },
      { year: "1979", label: "Independence from Britain" },
    ],
    culture:
      "Saint Vincent's Garifuna people, descended from a mix of Indigenous Kalinago and African ancestry, resisted European colonization longer than almost any other Caribbean population before being forcibly deported by the British in 1797 — many of their descendants live in Central America today.",
    nature:
      "The nation spans one main island and 32 smaller Grenadine islands and cays, including La Soufrière, an active volcano, and the Tobago Cays, a cluster of uninhabited islets ringed by coral reef.",
    food: [
      { name: "Roasted breadfruit and fried jackfish", note: "Widely considered the national dish." },
      { name: "Callaloo soup", note: "A leafy green soup common across the Caribbean." },
      { name: "Souse", note: "A pickled pork dish served cold." },
    ],
    landmarks: [
      { name: "Tobago Cays", note: "A protected marine park of uninhabited islets and coral reef." },
      { name: "La Soufrière", note: "An active volcano dominating the main island's north." },
      { name: "Bequia", note: "A yacht-friendly Grenadine island known for its boatbuilding tradition." },
    ],
  },

  SUR: {
    history: [
      { year: "1650", label: "England establishes the first European colony" },
      { year: "1667", label: "Traded to the Dutch in exchange for New Amsterdam (later New York)" },
      { year: "1975", label: "Independence from the Netherlands" },
    ],
    culture:
      "Suriname is the only country in South America where Dutch is the official language, a legacy of the 1667 treaty that traded the colony to the Netherlands in exchange for New Amsterdam — today's New York City. Its population reflects extraordinary diversity: Javanese, South Asian, African, Indigenous, and European heritage all coexist.",
    nature:
      "Over 90% of Suriname remains covered in pristine Amazonian rainforest, among the highest forest-cover percentages of any country on Earth.",
    food: [
      { name: "Pom", note: "A baked casserole of chicken and a root vegetable called pomtajer, a festive dish." },
      { name: "Roti", note: "Reflecting the country's significant Indo-Surinamese population." },
      { name: "Bakabana", note: "Fried plantain, a popular street snack." },
    ],
    landmarks: [
      { name: "Central Suriname Nature Reserve", note: "A vast UNESCO-listed rainforest wilderness." },
      { name: "Paramaribo's historic inner city", note: "A UNESCO-listed old town blending Dutch colonial architecture." },
      { name: "Brownsberg Nature Park", note: "A rainforest plateau with waterfalls and wildlife." },
    ],
  },
  BEN: {
    history: [
      { year: "1600s–1894", label: "The Kingdom of Dahomey rises to power, known for its all-female military regiment" },
      { year: "1892–94", label: "France conquers Dahomey after years of resistance" },
      { year: "1960", label: "Independence from France" },
      { year: "1975", label: "Renamed from Dahomey to Benin" },
    ],
    culture:
      "Benin is widely considered the birthplace of Vodun (Voodoo), formally recognized as an official religion alongside Christianity and Islam, and its historic Kingdom of Dahomey was famous for the Mino, an all-female military regiment.",
    nature:
      "Benin's landscape ranges from Atlantic coastline and lagoons in the south to savanna and the Pendjari wildlife reserves in the north.",
    food: [
      { name: "Amiwo", note: "A spiced corn-flour dish similar to polenta, often with tomato sauce." },
      { name: "Akassa", note: "Fermented corn dough, a staple starch." },
      { name: "Grilled fish", note: "Common along the coastal lagoons." },
    ],
    landmarks: [
      { name: "Ganvié", note: "A stilted lake village sometimes called the 'Venice of Africa.'" },
      { name: "Royal Palaces of Abomey", note: "A UNESCO World Heritage site preserving the history of the Dahomey kingdom." },
      { name: "Pendjari National Park", note: "One of West Africa's best wildlife reserves, home to lions and elephants." },
    ],
  },

  BDI: {
    history: [
      { year: "1600s", label: "The Kingdom of Burundi consolidates under a centralized monarchy" },
      { year: "1890s", label: "Becomes part of German East Africa, later Belgian-administered Ruanda-Urundi" },
      { year: "1962", label: "Independence from Belgium, split from Rwanda into a separate state" },
      { year: "1993–2005", label: "A long civil war follows the country's first democratic election" },
    ],
    culture:
      "Burundi's royal drumming tradition, once reserved exclusively for the king's court, is now recognized by UNESCO as intangible cultural heritage and performed at national celebrations. Its history and ethnic makeup closely parallel neighboring Rwanda's.",
    nature:
      "Burundi sits along the northern shore of Lake Tanganyika, one of the world's deepest and oldest lakes, with hilly, densely populated terrain across the rest of the country.",
    food: [
      { name: "Ugali", note: "A stiff maize or cassava porridge, a staple starch." },
      { name: "Beans and plantains", note: "A dietary staple across the country." },
      { name: "Fresh Lake Tanganyika fish", note: "Common along the lakeshore." },
    ],
    landmarks: [
      { name: "Lake Tanganyika", note: "One of the world's deepest and oldest freshwater lakes." },
      { name: "Source of the Nile", note: "Burundi claims one of several sites contending as the Nile's furthest headwater." },
      { name: "Kibira National Park", note: "A rainforest reserve home to chimpanzees." },
    ],
  },

  CPV: {
    history: [
      { year: "1462", label: "Portuguese settlers establish the first European colony in the tropics, on a previously uninhabited archipelago" },
      { year: "1500s–1800s", label: "Becomes a major hub in the transatlantic slave trade" },
      { year: "1975", label: "Independence from Portugal" },
    ],
    culture:
      "Cape Verde's culture, called Cabo-verdianidade, blends African and Portuguese heritage into something distinctly its own, expressed richly through morna, a melancholic musical genre made famous worldwide by singer Cesária Évora.",
    nature:
      "Cape Verde is a volcanic archipelago far off the West African coast, arid and often drought-prone, with Pico do Fogo, an active volcano, as its highest point.",
    food: [
      { name: "Cachupa", note: "A slow-cooked stew of corn, beans, and meat or fish, widely considered the national dish." },
      { name: "Pastel com diabo dentro", note: "Fried pastries filled with fish and vegetables — literally 'pastry with the devil inside.'" },
      { name: "Grogue", note: "A sugarcane spirit distilled locally." },
    ],
    landmarks: [
      { name: "Pico do Fogo", note: "An active volcano on Fogo island, with a village built inside its crater." },
      { name: "Santa Maria Beach, Sal", note: "A popular white-sand beach destination." },
      { name: "Cidade Velha", note: "Cape Verde's first colonial settlement and a UNESCO World Heritage site." },
    ],
  },

  CAF: {
    history: [
      { year: "1800s", label: "The region is home to numerous kingdoms and is heavily impacted by the East African slave trade" },
      { year: "1894", label: "France establishes colonial control as part of French Equatorial Africa" },
      { year: "1960", label: "Independence from France" },
      { year: "1976–79", label: "Jean-Bédel Bokassa declares himself Emperor of the short-lived Central African Empire" },
    ],
    culture:
      "The Central African Republic is home to over 80 ethnic groups, with Sango serving as a unifying national lingua franca alongside French. Its history includes the notorious brief self-declared Central African Empire under Bokassa in the 1970s.",
    nature:
      "The country sits at a geographic crossroads between the Sahel and Central Africa's rainforest belt, with the Sangha and Ubangi rivers supporting significant wildlife including forest elephants and lowland gorillas.",
    food: [
      { name: "Kanda ti nyma", note: "Cassava leaves cooked with peanut paste and meat." },
      { name: "Cassava and plantain", note: "Dietary staples across the country." },
      { name: "Grilled bushmeat", note: "Traditionally significant, though increasingly regulated for conservation." },
    ],
    landmarks: [
      { name: "Dzanga-Sangha Reserve", note: "A rainforest reserve renowned for forest elephant and gorilla viewing." },
      { name: "Boali Falls", note: "A dramatic waterfall on the Mbali River." },
      { name: "Bangui's Notre-Dame Cathedral", note: "A landmark of the capital city." },
    ],
  },

  COM: {
    history: [
      { year: "632", label: "Islam is introduced to the islands by Arab traders" },
      { year: "1841–1912", label: "France gradually establishes colonial control" },
      { year: "1975", label: "Independence from France (Mayotte votes to remain French)" },
      { year: "1975–present", label: "The country has experienced numerous coups, among the most in modern African history" },
    ],
    culture:
      "Comoros, nicknamed the 'Perfume Islands,' produces most of the world's ylang-ylang, an essential oil central to luxury perfumes including Chanel No. 5. Swahili, Arab, and French influences all shape island culture and cuisine.",
    nature:
      "The volcanic archipelago sits in the Indian Ocean between Madagascar and mainland Africa, home to Mount Karthala, one of the world's largest active volcanic craters.",
    food: [
      { name: "Langouste à la vanille", note: "Lobster cooked in a vanilla-infused sauce, a signature dish." },
      { name: "Coconut rice", note: "A staple accompaniment to many meals." },
      { name: "Mataba", note: "Cassava leaves cooked with coconut milk and meat or fish." },
    ],
    landmarks: [
      { name: "Mount Karthala", note: "An active volcano with one of the largest craters in the world." },
      { name: "Old Friday Mosque, Moroni", note: "A 15th-century mosque in the capital." },
      { name: "Chomoni Beach", note: "A white-sand beach popular on Grande Comore." },
    ],
  },

  DJI: {
    history: [
      { year: "800s", label: "The region becomes an early center of Islamic trade along the Red Sea" },
      { year: "1862–96", label: "France establishes colonial control, forming French Somaliland" },
      { year: "1977", label: "Independence from France" },
      { year: "1977–present", label: "Djibouti's strategic location makes it host to multiple foreign military bases" },
    ],
    culture:
      "Djibouti's population is split mainly between Somali and Afar communities, and its strategic position at the mouth of the Red Sea has made it a hub for foreign military bases from multiple countries simultaneously — a distinctive feature of its modern economy.",
    nature:
      "Djibouti holds Lake Assal, Africa's lowest point and one of the saltiest lakes on Earth, set within a stark volcanic landscape shared by the wider Afar Triangle.",
    food: [
      { name: "Skoudehkaris", note: "Spiced rice with goat or lamb, widely considered the national dish." },
      { name: "Lahoh", note: "A spongy flatbread similar to Ethiopian injera." },
      { name: "Fresh seafood", note: "Common in the coastal capital." },
    ],
    landmarks: [
      { name: "Lake Assal", note: "Africa's lowest point and one of the saltiest lakes in the world." },
      { name: "Day Forest National Park", note: "A rare highland forest reserve amid the surrounding desert." },
      { name: "Lake Abbe", note: "An otherworldly landscape of limestone chimneys on the Ethiopian border." },
    ],
  },

  GNQ: {
    history: [
      { year: "1778", label: "Spain acquires the territory from Portugal" },
      { year: "1968", label: "Independence from Spain" },
      { year: "1968–79", label: "Francisco Macías Nguema's brutal dictatorship" },
      { year: "1990s", label: "Offshore oil discoveries transform the economy" },
    ],
    culture:
      "Equatorial Guinea is the only African country with Spanish as an official language, alongside French and Portuguese, reflecting its distinct colonial history separate from its neighbors. It's split between a mainland region and the island capital area of Malabo.",
    nature:
      "The country combines a mainland rainforest region (Río Muni) with several Atlantic islands, including Bioko, home to volcanic peaks and rare primate species.",
    food: [
      { name: "Pepesoup", note: "A spicy fish or meat soup, widely enjoyed." },
      { name: "Cassava and plantain", note: "Dietary staples across the country." },
      { name: "Fresh seafood", note: "Central to the cuisine of the island territories." },
    ],
    landmarks: [
      { name: "Malabo", note: "The capital, set on the volcanic island of Bioko." },
      { name: "Monte Alén National Park", note: "A mainland rainforest reserve with gorillas and forest elephants." },
      { name: "Moka Wildlife Reserve, Bioko", note: "Home to rare primate species found nowhere else." },
    ],
  },

  ERI: {
    history: [
      { year: "1890", label: "Italy formally establishes the colony of Eritrea" },
      { year: "1941", label: "Britain takes administrative control after defeating Italian forces in WWII" },
      { year: "1961–91", label: "A 30-year war of independence against Ethiopia, among the longest in African history" },
      { year: "1993", label: "Independence formally recognized following a referendum" },
    ],
    culture:
      "Eritrea's capital, Asmara, is nicknamed 'Africa's Modernist City' for its extraordinarily preserved collection of 1930s Italian Art Deco architecture, a UNESCO World Heritage site. The nation's identity was forged partly through its 30-year independence struggle, one of the longest wars in African history.",
    nature:
      "Eritrea's Red Sea coastline includes the Dahlak Archipelago, over 200 islands with rich marine life, while its interior rises sharply into highlands.",
    food: [
      { name: "Injera", note: "A spongy flatbread shared with neighboring Ethiopia, the base of most meals." },
      { name: "Zigni", note: "A spiced meat stew, often eaten with injera." },
      { name: "Ga'at", note: "A firm porridge, typically served with spiced butter." },
    ],
    landmarks: [
      { name: "Asmara", note: "A UNESCO World Heritage capital known for its Italian Art Deco architecture." },
      { name: "Dahlak Archipelago", note: "Over 200 Red Sea islands with historic pearl-diving heritage." },
      { name: "Qohaito", note: "Ruins of an ancient pre-Aksumite settlement on a high plateau." },
    ],
  },

  SWZ: {
    history: [
      { year: "1750s", label: "The Swazi nation consolidates under King Ngwane III" },
      { year: "1903", label: "Becomes a British protectorate" },
      { year: "1968", label: "Independence from Britain" },
      { year: "2018", label: "Officially renamed from Swaziland to Eswatini" },
    ],
    culture:
      "Eswatini is one of the world's last remaining absolute monarchies, and its annual Umhlanga (Reed Dance) and Incwala ceremonies, centuries-old traditions honoring kingship and community, remain vibrant and widely attended.",
    nature:
      "Eswatini's compact territory ranges from highveld grassland to lowveld savanna, holding significant wildlife reserves despite its small size.",
    food: [
      { name: "Sishwala", note: "A stiff maize porridge, the staple starch." },
      { name: "Sidvudvu", note: "A pumpkin and cornmeal dish." },
      { name: "Emasi", note: "Fermented milk, a traditional staple." },
    ],
    landmarks: [
      { name: "Hlane Royal National Park", note: "Eswatini's largest protected area, home to lions and elephants." },
      { name: "Mlilwane Wildlife Sanctuary", note: "A reserve known for close encounters with zebra and antelope." },
      { name: "Ezulwini Valley", note: "'Valley of Heaven,' home to royal residences and cultural sites." },
    ],
  },

  GMB: {
    history: [
      { year: "1455", label: "Portuguese explorers first reach the Gambia River" },
      { year: "1765", label: "Britain establishes formal colonial control" },
      { year: "1965", label: "Independence from Britain" },
      { year: "1994–2017", label: "Yahya Jammeh rules following a coup, until a peaceful transfer of power" },
    ],
    culture:
      "The Gambia's entire shape follows the course of the Gambia River, a narrow strip of land almost completely surrounded by Senegal. Alex Haley's novel Roots traced his ancestry to a Gambian village, drawing global attention to the country's role in the transatlantic slave trade.",
    nature:
      "The Gambia River, from which the country takes its shape and name, supports mangroves, wetlands, and significant birdlife along its length.",
    food: [
      { name: "Domoda", note: "A rich peanut-based stew with meat and vegetables." },
      { name: "Benachin", note: "A one-pot rice dish similar to jollof rice." },
      { name: "Fresh river fish", note: "Common along the Gambia River." },
    ],
    landmarks: [
      { name: "Kunta Kinteh Island", note: "A former slave-trading post and UNESCO World Heritage site linked to Alex Haley's Roots." },
      { name: "Abuko Nature Reserve", note: "A compact wildlife reserve near the coast." },
      { name: "River Gambia National Park", note: "Home to a chimpanzee rehabilitation project." },
    ],
  },

  GIN: {
    history: [
      { year: "1300s–1400s", label: "Part of the Mali Empire's sphere of influence" },
      { year: "1891", label: "France establishes the colony of French Guinea" },
      { year: "1958", label: "The first French African colony to choose full independence" },
      { year: "1958–84", label: "Sékou Touré rules as an authoritarian president" },
    ],
    culture:
      "Guinea was the first French African colony to vote for full, immediate independence in 1958, rejecting continued association with France even at the cost of an abrupt cutoff of French support. Its griot storytelling and kora music traditions connect it to the broader Mande cultural sphere.",
    nature:
      "The Fouta Djallon highlands, sometimes called the 'water tower of West Africa,' give rise to the headwaters of both the Niger and Senegal rivers.",
    food: [
      { name: "Riz gras", note: "'Fat rice,' rice cooked with meat and vegetables." },
      { name: "Fouti", note: "A cassava-leaf stew with peanuts." },
      { name: "Grilled fish", note: "Common along the Atlantic coast." },
    ],
    landmarks: [
      { name: "Fouta Djallon highlands", note: "A dramatic plateau region and the source of major West African rivers." },
      { name: "Îles de Los", note: "A small archipelago just off the capital, Conakry." },
      { name: "Mount Nimba Strict Nature Reserve", note: "A UNESCO-listed reserve shared with Côte d'Ivoire and Liberia." },
    ],
  },

  GNB: {
    history: [
      { year: "1446", label: "Portuguese explorers first reach the coast" },
      { year: "1879", label: "Formally separated from Cape Verde as a distinct Portuguese colony" },
      { year: "1963–74", label: "An armed independence struggle led by Amílcar Cabral" },
      { year: "1974", label: "Independence from Portugal, among the first Portuguese African colonies to achieve it" },
    ],
    culture:
      "Guinea-Bissau's Bijagós Archipelago islands maintain traditional matrilineal social structures in some communities, where women hold significant customary authority, unusual within the wider region.",
    nature:
      "The Bijagós Archipelago, a UNESCO Biosphere Reserve of roughly 80 islands, supports hippos that swim in saltwater, saltwater crocodiles, and important sea turtle nesting sites.",
    food: [
      { name: "Jollof-style rice dishes", note: "Common across the coastal region." },
      { name: "Cachupa", note: "A slow-cooked bean and corn stew, shared culturally with Cape Verde." },
      { name: "Fresh seafood", note: "A staple given the extensive coastline and archipelago." },
    ],
    landmarks: [
      { name: "Bijagós Archipelago", note: "A UNESCO Biosphere Reserve of roughly 80 islands." },
      { name: "Bolama", note: "A former colonial capital, now largely abandoned and slowly being reclaimed by nature." },
      { name: "Cacheu", note: "A historic Portuguese colonial fort town." },
    ],
  },

  LSO: {
    history: [
      { year: "1818–68", label: "King Moshoeshoe I unites Basotho clans and navigates conflicts with Boer settlers and the Zulu" },
      { year: "1868", label: "Becomes a British protectorate, Basutoland, at Moshoeshoe's request for protection" },
      { year: "1966", label: "Independence from Britain as the Kingdom of Lesotho" },
    ],
    culture:
      "Lesotho is entirely enclaved within South Africa, one of only three countries in the world completely surrounded by a single neighbor. The Basotho blanket, a woven wool garment, remains a defining symbol of national identity, worn in daily life and ceremony alike.",
    nature:
      "Lesotho is the only country in the world located entirely above 1,000 meters elevation, earning it the nickname 'Kingdom in the Sky,' with the Maloti Mountains supporting Southern Africa's highest peaks.",
    food: [
      { name: "Papa", note: "A stiff maize porridge, the staple starch." },
      { name: "Moroho", note: "Wild leafy greens, a common side dish." },
      { name: "Motoho", note: "A fermented sorghum drink." },
    ],
    landmarks: [
      { name: "Sani Pass", note: "A dramatic mountain pass connecting Lesotho to South Africa via hairpin switchbacks." },
      { name: "Maletsunyane Falls", note: "One of the highest single-drop waterfalls in Southern Africa." },
      { name: "Thaba Bosiu", note: "Moshoeshoe I's mountain stronghold, central to Basotho national identity." },
    ],
  },

  LBR: {
    history: [
      { year: "1822", label: "The American Colonization Society begins settling freed slaves from the United States" },
      { year: "1847", label: "Liberia declares independence, becoming Africa's first republic" },
      { year: "1980–2003", label: "A series of coups and civil wars devastates the country" },
      { year: "2005", label: "Ellen Johnson Sirleaf becomes Africa's first elected female head of state" },
    ],
    culture:
      "Liberia was founded by freed African-American and Caribbean settlers, and its capital, Monrovia, is named for US President James Monroe. Its flag deliberately echoes the American flag's stars and stripes, reflecting this founding history.",
    nature:
      "Liberia holds a significant share of the Upper Guinean rainforest, one of West Africa's most important remaining forest ecosystems, home to forest elephants and pygmy hippos.",
    food: [
      { name: "Jollof-style rice dishes", note: "Common across the country." },
      { name: "Cassava leaf soup", note: "Pounded cassava leaves cooked with meat or fish." },
      { name: "Palm butter soup", note: "Made from the pulp of palm nuts." },
    ],
    landmarks: [
      { name: "Sapo National Park", note: "Liberia's largest protected rainforest area." },
      { name: "Providence Island", note: "The historic landing site of the first freed-slave settlers in Monrovia." },
      { name: "Kpatawee Waterfalls", note: "A popular waterfall near Gbarnga." },
    ],
  },

  MDG: {
    history: [
      { year: "1500s", label: "Various Malagasy kingdoms rise, most significantly the Merina Kingdom" },
      { year: "1897", label: "France annexes Madagascar, ending the Merina monarchy" },
      { year: "1960", label: "Independence from France" },
    ],
    culture:
      "Madagascar's culture blends Southeast Asian and East African roots, reflecting the island's settlement by Austronesian voyagers over a thousand years before European contact — a genuinely unusual origin story for an island so close to Africa.",
    nature:
      "Isolated for roughly 160 million years, Madagascar evolved wildlife found nowhere else, including all of the world's lemur species, alongside baobab trees and a wide range of unique ecosystems from rainforest to spiny desert.",
    food: [
      { name: "Romazava", note: "A beef and leafy green stew, widely considered the national dish." },
      { name: "Rice", note: "Eaten at nearly every meal, more per capita than almost anywhere on Earth." },
      { name: "Ravitoto", note: "Pounded cassava leaves cooked with pork." },
    ],
    landmarks: [
      { name: "Avenue of the Baobabs", note: "An iconic dirt road lined with centuries-old baobab trees." },
      { name: "Tsingy de Bemaraha", note: "A dramatic UNESCO-listed landscape of razor-sharp limestone formations." },
      { name: "Andasibe-Mantadia National Park", note: "Rainforest home to the indri, the largest living lemur species." },
    ],
  },

  MRT: {
    history: [
      { year: "1076", label: "The Almoravid movement, an Islamic reform movement, originates in the region" },
      { year: "1904", label: "France establishes colonial control" },
      { year: "1960", label: "Independence from France" },
      { year: "1981", label: "Formally abolishes slavery, the last country in the world to do so" },
    ],
    culture:
      "Mauritania sits at a cultural crossroads between Arab-Berber North Africa and Sub-Saharan West Africa, and its ancient trading cities were once major centers of Islamic scholarship along trans-Saharan caravan routes.",
    nature:
      "Mauritania holds the Richat Structure (Eye of the Sahara), a roughly 40-km-wide circular geological formation so distinctive it's used as a landmark by astronauts, set within the vast Sahara that covers most of the country.",
    food: [
      { name: "Thieboudienne", note: "Fish and rice, shared with neighboring Senegal." },
      { name: "Couscous", note: "Served with meat and vegetables, a staple across the Maghreb-Sahel region." },
      { name: "Mechoui", note: "Whole roasted lamb, a centerpiece of celebrations." },
    ],
    landmarks: [
      { name: "Richat Structure (Eye of the Sahara)", note: "A massive circular geological formation visible from space." },
      { name: "Chinguetti", note: "A UNESCO-listed ancient trading and pilgrimage city with a historic library of manuscripts." },
      { name: "Banc d'Arguin National Park", note: "A coastal reserve renowned for migratory birds." },
    ],
  },

  MUS: {
    history: [
      { year: "1638", label: "The Dutch establish the first European settlement" },
      { year: "1710", label: "The Dutch abandon the island; the dodo bird goes extinct around this time" },
      { year: "1810", label: "Britain seizes Mauritius from France during the Napoleonic Wars" },
      { year: "1968", label: "Independence from Britain" },
    ],
    culture:
      "Mauritius's population reflects a genuinely diverse mix of Indian, African, Chinese, and European heritage, coexisting with notable harmony across Hindu, Muslim, Christian, and Buddhist communities alike.",
    nature:
      "Mauritius was the only home of the dodo bird, driven extinct within decades of human settlement — one of history's fastest documented extinctions — and its surrounding reefs remain rich with marine life.",
    food: [
      { name: "Dholl puri", note: "A split-pea flatbread, a beloved street food reflecting Indian heritage." },
      { name: "Rougaille", note: "A tomato-based Creole sauce served with meat or fish." },
      { name: "Fresh seafood", note: "Common given the island's extensive coastline." },
    ],
    landmarks: [
      { name: "Le Morne Brabant", note: "A dramatic mountain and UNESCO World Heritage site tied to the history of escaped slaves." },
      { name: "Chamarel Seven Coloured Earths", note: "A geological formation of naturally striped, multicolored sand dunes." },
      { name: "Black River Gorges National Park", note: "Mauritius's largest national park." },
    ],
  },

  STP: {
    history: [
      { year: "1470", label: "Portuguese explorers discover the previously uninhabited islands" },
      { year: "1500s–1800s", label: "Becomes a major hub for sugar, then cocoa, plantations built on forced labor" },
      { year: "1975", label: "Independence from Portugal" },
    ],
    culture:
      "São Tomé and Príncipe's culture reflects its plantation-era history, with Forro, Angolar, and other Creole languages developing from the mix of Portuguese and African communities brought to the previously uninhabited islands.",
    nature:
      "The volcanic islands sit directly on the equator in the Gulf of Guinea, covered in dense rainforest with extraordinarily high rates of species found nowhere else.",
    food: [
      { name: "Calulu", note: "A stew of fish or meat with leafy greens and okra, widely considered the national dish." },
      { name: "Fresh cocoa and coffee", note: "Historic cash crops still central to the economy." },
      { name: "Breadfruit", note: "A dietary staple across the islands." },
    ],
    landmarks: [
      { name: "Pico Cão Grande", note: "A striking volcanic spire rising nearly 370 meters from the rainforest." },
      { name: "Ilhéu das Rolas", note: "A tiny island straddling the equator itself." },
      { name: "Obo Natural Park", note: "Protected rainforest covering much of the interior." },
    ],
  },

  SYC: {
    history: [
      { year: "1756", label: "France formally claims the previously uninhabited islands" },
      { year: "1794–1810", label: "Contested between France and Britain during the Napoleonic Wars" },
      { year: "1814", label: "Formally ceded to Britain" },
      { year: "1976", label: "Independence from Britain" },
    ],
    culture:
      "Seychelles has the smallest population of any African country, and its Creole culture blends French, British, African, and Asian influences into a distinct island identity, with Seychellois Creole as an official language alongside English and French.",
    nature:
      "Seychelles' Vallée de Mai holds the coco de mer, a palm producing the largest and heaviest seed of any plant on Earth, alongside granite islands unlike almost anywhere else in the tropics.",
    food: [
      { name: "Fish curry", note: "A staple built on the islands' abundant seafood." },
      { name: "Grilled red snapper", note: "Common given the surrounding reefs." },
      { name: "Breadfruit", note: "A dietary staple across the islands." },
    ],
    landmarks: [
      { name: "Vallée de Mai", note: "A UNESCO World Heritage palm forest, home to the giant coco de mer seed." },
      { name: "Anse Source d'Argent", note: "Frequently cited as one of the most photographed beaches in the world." },
      { name: "Aldabra Atoll", note: "One of the largest coral atolls on Earth, home to giant tortoises." },
    ],
  },

  SLE: {
    history: [
      { year: "1462", label: "Portuguese explorer Pedro de Sintra names the region 'Serra Leoa' (Lion Mountains)" },
      { year: "1787", label: "Britain establishes a settlement for freed and formerly enslaved people" },
      { year: "1961", label: "Independence from Britain" },
      { year: "1991–2002", label: "A brutal civil war, later the subject of international attention over 'blood diamonds'" },
    ],
    culture:
      "Sierra Leone's capital, Freetown, was founded specifically as a home for freed and formerly enslaved people in 1792, giving the country a distinctive founding history shared with Liberia. Krio, a Creole language born from that founding community, remains widely spoken.",
    nature:
      "Sierra Leone's coastline includes some of West Africa's most pristine beaches, backed by rainforest and the Freetown Peninsula's dramatic hills.",
    food: [
      { name: "Cassava leaf stew", note: "Pounded cassava leaves with meat or fish, widely considered a national dish." },
      { name: "Jollof rice", note: "A spiced tomato rice dish, shared across West Africa." },
      { name: "Groundnut soup", note: "A rich peanut-based stew." },
    ],
    landmarks: [
      { name: "Freetown Peninsula beaches", note: "Pristine, palm-lined beaches near the capital." },
      { name: "Tacugama Chimpanzee Sanctuary", note: "A rescue and rehabilitation center for endangered chimpanzees." },
      { name: "Bunce Island", note: "A former slave-trading fort with deep historical ties to Sierra Leone's African-American diaspora." },
    ],
  },

  SOM: {
    history: [
      { year: "1st c. CE", label: "Ancient Somali coastal city-states trade actively across the Indian Ocean" },
      { year: "1888–1960", label: "Divided between British and Italian colonial administrations" },
      { year: "1960", label: "British and Italian Somaliland unite to form independent Somalia" },
      { year: "1991", label: "The central government collapses, beginning decades of state fragility" },
    ],
    culture:
      "Somali culture places deep value on oral poetry, considered one of the richest poetic traditions in Africa, historically used to record history, settle disputes, and convey political messages. Somalia's ancient coastal cities were major Indian Ocean trading hubs for over a thousand years.",
    nature:
      "Somalia has the longest coastline of any mainland African country, stretching along both the Gulf of Aden and the Indian Ocean, with an arid interior suited to nomadic pastoralism.",
    food: [
      { name: "Bariis iskukaris", note: "Spiced rice with meat, a festive staple." },
      { name: "Sabaayad", note: "A flaky flatbread, often eaten for breakfast." },
      { name: "Camel milk", note: "A traditional staple reflecting the country's nomadic herding heritage." },
    ],
    landmarks: [
      { name: "Laas Geel", note: "Some of the best-preserved prehistoric rock art in Africa, dating back thousands of years." },
      { name: "Mogadishu's Old Town", note: "Historic architecture reflecting the city's role as an ancient trading hub." },
      { name: "Zeila", note: "A historic port town with centuries of Red Sea trading history." },
    ],
  },

  SSD: {
    history: [
      { year: "1899–1956", label: "Governed jointly by Britain and Egypt as part of Anglo-Egyptian Sudan" },
      { year: "1955–72, 1983–2005", label: "Two prolonged civil wars against the government in Khartoum" },
      { year: "2005", label: "A peace agreement grants the south significant autonomy" },
      { year: "2011", label: "A referendum votes overwhelmingly for independence, creating the world's newest country" },
    ],
    culture:
      "South Sudan is home to dozens of Nilotic ethnic groups, including the Dinka and Nuer, with cattle holding deep cultural, social, and economic significance across many communities.",
    nature:
      "The Sudd, one of the largest freshwater wetlands on Earth, dominates South Sudan's geography, supporting the great migration of white-eared kob and other antelope, one of the largest large-mammal migrations in the world.",
    food: [
      { name: "Ful medames", note: "Slow-cooked fava beans, shared with northern Sudan." },
      { name: "Kisra", note: "A thin fermented flatbread." },
      { name: "Milk and dairy products", note: "Central to the diet of many pastoralist communities." },
    ],
    landmarks: [
      { name: "The Sudd", note: "One of the world's largest freshwater wetlands, teeming with wildlife." },
      { name: "Boma National Park", note: "Home to one of the largest antelope migrations on Earth." },
      { name: "Nimule National Park", note: "A reserve along the White Nile near the Ugandan border." },
    ],
  },

  TGO: {
    history: [
      { year: "1884", label: "Germany establishes the colony of Togoland" },
      { year: "1914", label: "Britain and France divide Togoland after Germany's defeat in WWI" },
      { year: "1960", label: "French Togoland gains independence as Togo" },
      { year: "1967–2005", label: "Gnassingbé Eyadéma rules for nearly four decades" },
    ],
    culture:
      "Togo's narrow, elongated shape packs an unusually wide range of ethnic groups and traditions into a small territory, and Lomé's vibrant fetish market reflects the continued practice of traditional Vodun religion alongside Christianity and Islam.",
    nature:
      "Togo stretches from a short Atlantic coastline through savanna and hills to the Sahel in the north, with the Togo Mountains running through its center.",
    food: [
      { name: "Fufu", note: "Pounded cassava or yam, served with soup." },
      { name: "Pâte", note: "A cornmeal or millet porridge, a staple starch." },
      { name: "Akpan", note: "A fermented corn pudding, often eaten as a snack." },
    ],
    landmarks: [
      { name: "Koutammakou (Land of the Batammariba)", note: "A UNESCO World Heritage region famous for distinctive fortified mud tower-houses." },
      { name: "Lomé's Grand Marché", note: "A sprawling market including the well-known 'Voodoo market.'" },
      { name: "Togo-Ville", note: "A lakeside town central to the country's Vodun religious traditions." },
    ],
  },
  KIR: {
    history: [
      { year: "~3000 years ago", label: "Austronesian and later Micronesian voyagers settle the islands" },
      { year: "1892", label: "Britain establishes a protectorate over the Gilbert Islands" },
      { year: "1943", label: "The Battle of Tarawa, one of the bloodiest Pacific battles of WWII, takes place on Kiribati soil" },
      { year: "1979", label: "Independence from Britain" },
    ],
    culture:
      "Kiribati spans an extraordinary expanse of ocean — its 33 atolls stretch across all four hemispheres, and the country deliberately redrew the International Date Line in 1995 so its entire territory shares the same calendar day.",
    nature:
      "Kiribati's low-lying coral atolls average only about 2 meters above sea level, making it one of the countries most existentially threatened by rising seas.",
    food: [
      { name: "Fish (raw or grilled)", note: "A dietary staple across the atolls." },
      { name: "Coconut and breadfruit", note: "Core starches given limited arable land." },
      { name: "Babai", note: "A giant swamp taro, cultivated in specially dug pits." },
    ],
    landmarks: [
      { name: "Tarawa Atoll", note: "Site of a major WWII battle and the country's capital." },
      { name: "Phoenix Islands Protected Area", note: "One of the largest marine protected areas in the world." },
      { name: "Kiritimati (Christmas Island)", note: "The largest coral atoll on Earth by land area." },
    ],
  },

  MHL: {
    history: [
      { year: "~2,000 years ago", label: "Micronesian voyagers settle the islands using sophisticated stick-chart navigation" },
      { year: "1885", label: "Germany establishes a protectorate" },
      { year: "1946–58", label: "The US conducts 67 nuclear weapons tests in the islands, including at Bikini Atoll" },
      { year: "1986", label: "Independence in free association with the United States" },
    ],
    culture:
      "The Marshall Islands' traditional stick charts, made from palm ribs and shells, encoded wave and swell patterns to help ancient navigators cross vast stretches of open ocean — a sophisticated system unique to the region.",
    nature:
      "The Marshall Islands consists of low coral atolls scattered across the central Pacific, none rising more than a few meters above sea level.",
    food: [
      { name: "Fish and coconut-based dishes", note: "Core to the traditional diet." },
      { name: "Breadfruit", note: "A dietary staple across the atolls." },
      { name: "Rice", note: "Widely eaten, largely imported." },
    ],
    landmarks: [
      { name: "Bikini Atoll", note: "A former nuclear test site and UNESCO World Heritage site documenting the nuclear age." },
      { name: "Majuro Atoll", note: "Home to the capital, a narrow strip of land ringing a lagoon." },
      { name: "Arno Atoll", note: "Known for traditional outrigger canoe building." },
    ],
  },

  FSM: {
    history: [
      { year: "~3,500 years ago", label: "The islands are first settled by Austronesian voyagers" },
      { year: "1200s–1600s", label: "Nan Madol is constructed on Pohnpei as the ceremonial center of the Saudeleur dynasty" },
      { year: "1899", label: "Purchased by Germany from Spain following the Spanish–American War" },
      { year: "1986", label: "Independence in free association with the United States" },
    ],
    culture:
      "The Federated States of Micronesia spans four culturally and linguistically distinct states, each with its own traditions, but shares a common history connected to Nan Madol, a mysterious basalt city built on Pohnpei centuries before European contact.",
    nature:
      "Micronesia's scattered high and low islands support extensive coral reefs and some of the deepest ocean trenches on Earth nearby.",
    food: [
      { name: "Fish and reef seafood", note: "A staple across the islands." },
      { name: "Breadfruit and taro", note: "Core traditional starches." },
      { name: "Coconut", note: "Used throughout cooking and daily life." },
    ],
    landmarks: [
      { name: "Nan Madol", note: "A mysterious ancient city built on basalt islets, sometimes called the 'Venice of the Pacific.'" },
      { name: "Chuuk Lagoon", note: "A WWII shipwreck diving site holding an entire sunken Japanese fleet." },
      { name: "Kosrae's rainforest", note: "Pristine, largely undeveloped island wilderness." },
    ],
  },

  NRU: {
    history: [
      { year: "~3,000 years ago", label: "The island is first settled by Micronesian and Polynesian voyagers" },
      { year: "1888", label: "Germany annexes the island" },
      { year: "1906", label: "Phosphate mining begins, eventually depleting most of the island's interior" },
      { year: "1968", label: "Independence, briefly becoming one of the wealthiest nations per capita due to phosphate exports" },
    ],
    culture:
      "Nauru is the world's smallest island nation, and its dramatic economic rise and fall — from one of the highest per-capita incomes on Earth during the phosphate boom to major economic hardship after reserves were depleted — is almost unique in modern history.",
    nature:
      "Nauru's interior, once covered in phosphate-rich rock, was extensively mined through the 20th century, leaving a landscape of jagged limestone pinnacles across much of the island's center.",
    food: [
      { name: "Fish", note: "A dietary staple." },
      { name: "Coconut", note: "Used throughout traditional cooking." },
      { name: "Imported foods", note: "Now form a significant share of the modern Nauruan diet." },
    ],
    landmarks: [
      { name: "Command Ridge", note: "Nauru's highest point, with WWII-era Japanese fortifications." },
      { name: "Buada Lagoon", note: "A freshwater lagoon surrounded by lush vegetation, a contrast to the mined interior." },
      { name: "Anibare Bay", note: "A scenic bay along the coast." },
    ],
  },

  PLW: {
    history: [
      { year: "~3,000 years ago", label: "The islands are first settled by Austronesian voyagers" },
      { year: "1885", label: "Spain establishes nominal colonial control" },
      { year: "1899", label: "Sold to Germany, then seized by Japan during WWI" },
      { year: "1994", label: "Independence in free association with the United States" },
    ],
    culture:
      "Palau enshrined environmental protection directly into its constitution, and visitors are required to sign a pledge in their passport promising to protect the islands' environment — a rare, legally binding conservation commitment for tourists.",
    nature:
      "Palau's Rock Islands are a cluster of mushroom-shaped limestone islets ringed by coral reef, including Jellyfish Lake, home to millions of stingless golden jellyfish.",
    food: [
      { name: "Fish and reef seafood", note: "A dietary staple." },
      { name: "Taro", note: "A traditional starch, often grown in specially maintained patches." },
      { name: "Fruit bat soup", note: "A traditional delicacy, though increasingly rare." },
    ],
    landmarks: [
      { name: "Rock Islands Southern Lagoon", note: "A UNESCO World Heritage site of limestone islets and coral reef." },
      { name: "Jellyfish Lake", note: "A marine lake home to millions of stingless golden jellyfish." },
      { name: "Milky Way Lagoon", note: "Known for its white limestone mud, said to have skin benefits." },
    ],
  },

  WSM: {
    history: [
      { year: "~2,850 years ago", label: "Among the earliest Polynesian settlements, considered by many the cradle of Polynesian culture" },
      { year: "1899", label: "Divided between Germany (Western Samoa) and the United States (American Samoa)" },
      { year: "1962", label: "Western Samoa becomes independent, the first Pacific Island nation to do so in the 20th century" },
    ],
    culture:
      "Samoa is considered by many scholars to be the cradle of Polynesian culture, and fa'a Samoa, 'the Samoan way,' governs social life through a matai (chief) system that remains central to community organization today.",
    nature:
      "Samoa's two main volcanic islands are covered in rainforest and ringed by coral reef, with waterfalls and blowholes shaped by their volcanic origins.",
    food: [
      { name: "Palusami", note: "Coconut cream baked in taro leaves, widely considered a national dish." },
      { name: "Oka", note: "Raw fish marinated in coconut milk and citrus." },
      { name: "Taro and breadfruit", note: "Traditional starches central to most meals." },
    ],
    landmarks: [
      { name: "To Sua Ocean Trench", note: "A giant swimming hole reached by ladder, set in a lush garden." },
      { name: "Papase'ea Sliding Rocks", note: "Natural rock slides into freshwater pools." },
      { name: "Robert Louis Stevenson Museum", note: "The former home of the author, who spent his final years in Samoa." },
    ],
  },

  SLB: {
    history: [
      { year: "~30,000 years ago", label: "Among the earliest human settlements in the Pacific" },
      { year: "1568", label: "Spanish explorer Álvaro de Mendaña names the islands, believing he'd found King Solomon's gold" },
      { year: "1942–43", label: "The Battle of Guadalcanal, a major WWII turning point in the Pacific" },
      { year: "1978", label: "Independence from Britain" },
    ],
    culture:
      "Solomon Islands is home to remarkable linguistic diversity — over 70 distinct languages across a relatively small population — and traditional shell money and customary land ownership remain significant alongside modern governance.",
    nature:
      "The Solomon Islands span nearly a thousand islands across the western Pacific, holding extensive rainforest and coral reefs within the Coral Triangle.",
    food: [
      { name: "Fish and coconut-based dishes", note: "Core to the traditional diet." },
      { name: "Poi", note: "Pounded taro or sweet potato." },
      { name: "Cassava pudding", note: "A traditional dessert." },
    ],
    landmarks: [
      { name: "Guadalcanal", note: "Site of a pivotal WWII battle, with wrecks and memorials still visible." },
      { name: "Marovo Lagoon", note: "One of the largest saltwater lagoons in the world." },
      { name: "Skull Island", note: "A small island with a traditional shrine of ancestral skulls." },
    ],
  },

  TON: {
    history: [
      { year: "~950 BCE", label: "Among the earliest Polynesian settlements" },
      { year: "1200s", label: "The Tu'i Tonga dynasty establishes an empire influencing much of Polynesia" },
      { year: "1900", label: "Becomes a British protected state while retaining internal self-government" },
      { year: "1970", label: "Full independence, having never been formally colonized" },
    ],
    culture:
      "Tonga is the only Pacific island nation never formally colonized by a foreign power, maintaining an unbroken monarchy for over a thousand years. Sunday remains strictly observed as a day of rest, with most commercial activity halted by law.",
    nature:
      "Tonga's more than 170 islands span both volcanic and coral formations, with humpback whales migrating through its waters each year to breed.",
    food: [
      { name: "Lu pulu", note: "Corned beef and onion baked in coconut cream and taro leaves." },
      { name: "Ota ika", note: "Raw fish marinated in coconut milk and citrus, similar to ceviche." },
      { name: "Root vegetables", note: "Taro, cassava, and yam form the traditional starch base." },
    ],
    landmarks: [
      { name: "Ha'amonga 'a Maui", note: "A massive coral limestone trilithon, sometimes called the 'Stonehenge of the Pacific.'" },
      { name: "Mapu'a 'a Vaea Blowholes", note: "Dramatic ocean blowholes along the coast." },
      { name: "Humpback whale swimming tours", note: "Tonga is one of the few places in the world where swimming with humpback whales is permitted." },
    ],
  },

  TUV: {
    history: [
      { year: "~2,000 years ago", label: "Settled by Polynesian voyagers" },
      { year: "1892", label: "Britain establishes a protectorate over the Ellice Islands" },
      { year: "1978", label: "Independence from Britain, having earlier split administratively from the Gilbert Islands" },
    ],
    culture:
      "Tuvalu's population, spread across just a handful of low coral atolls, maintains close community ties centered on the falekaupule, a traditional council of elders still central to local governance.",
    nature:
      "Tuvalu's highest point sits only about 4.5 meters above sea level, making it one of the countries most existentially threatened by climate change and rising seas.",
    food: [
      { name: "Fish", note: "A core dietary staple." },
      { name: "Coconut and pulaka (swamp taro)", note: "Traditional starches suited to atoll growing conditions." },
      { name: "Breadfruit", note: "Common across the islands." },
    ],
    landmarks: [
      { name: "Funafuti Conservation Area", note: "A marine reserve protecting reefs and small islets." },
      { name: "Funafuti Lagoon", note: "The central lagoon around which the capital atoll is built." },
      { name: "Te Ana Lighthouse", note: "A landmark on the main atoll." },
    ],
  },

  VUT: {
    history: [
      { year: "~3,000 years ago", label: "Settled by Lapita and later Melanesian voyagers" },
      { year: "1906", label: "Britain and France establish an unusual joint colonial administration, the New Hebrides Condominium" },
      { year: "1980", label: "Independence as Vanuatu, ending the unique dual-colonial arrangement" },
    ],
    culture:
      "Vanuatu was ruled jointly by Britain and France as an unusual shared 'condominium' government until independence, and Pentecost Island's traditional land diving ritual — men leaping from towers with vines tied to their ankles — is widely considered the direct ancestor of modern bungee jumping.",
    nature:
      "Vanuatu's more than 80 islands are volcanically active, including Mount Yasur, one of the most accessible active volcanoes in the world, with visitors able to look directly into its glowing crater.",
    food: [
      { name: "Laplap", note: "Grated root vegetables baked with coconut cream, widely considered the national dish." },
      { name: "Fresh seafood", note: "A dietary staple across the islands." },
      { name: "Kava", note: "A traditional ceremonial drink made from a native root." },
    ],
    landmarks: [
      { name: "Mount Yasur", note: "One of the world's most accessible active volcanoes, viewable up close." },
      { name: "Pentecost Island land diving", note: "A traditional ritual considered the ancestor of bungee jumping." },
      { name: "Blue Holes, Espiritu Santo", note: "Strikingly turquoise freshwater swimming holes." },
    ],
  },
};
