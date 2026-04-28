export type University = {
  id: string;
  name: string;
  country: string;
  domain?: string;
};

// Seed: 30+ Thai institutions, then ~110 across the rest of ASEAN.
// Used for the searchable dropdown on /apply step 2 and for the institutional-email
// whitelist on step 3.
export const universities: University[] = [
  // Thailand — 30+
  { id: "th-cu", name: "Chulalongkorn University", country: "Thailand", domain: "chula.ac.th" },
  { id: "th-mu", name: "Mahidol University", country: "Thailand", domain: "mahidol.ac.th" },
  { id: "th-tu", name: "Thammasat University", country: "Thailand", domain: "tu.ac.th" },
  { id: "th-ku", name: "Kasetsart University", country: "Thailand", domain: "ku.ac.th" },
  { id: "th-cmu", name: "Chiang Mai University", country: "Thailand", domain: "cmu.ac.th" },
  { id: "th-kkn", name: "Khon Kaen University", country: "Thailand", domain: "kku.ac.th" },
  { id: "th-psu", name: "Prince of Songkla University", country: "Thailand", domain: "psu.ac.th" },
  { id: "th-kmutt", name: "King Mongkut's University of Technology Thonburi", country: "Thailand", domain: "kmutt.ac.th" },
  { id: "th-kmitl", name: "King Mongkut's Institute of Technology Ladkrabang", country: "Thailand", domain: "kmitl.ac.th" },
  { id: "th-kmutnb", name: "King Mongkut's University of Technology North Bangkok", country: "Thailand", domain: "kmutnb.ac.th" },
  { id: "th-su", name: "Silpakorn University", country: "Thailand", domain: "su.ac.th" },
  { id: "th-swu", name: "Srinakharinwirot University", country: "Thailand", domain: "swu.ac.th" },
  { id: "th-bu", name: "Burapha University", country: "Thailand", domain: "buu.ac.th" },
  { id: "th-nu", name: "Naresuan University", country: "Thailand", domain: "nu.ac.th" },
  { id: "th-mfu", name: "Mae Fah Luang University", country: "Thailand", domain: "mfu.ac.th" },
  { id: "th-msu", name: "Mahasarakham University", country: "Thailand", domain: "msu.ac.th" },
  { id: "th-rmuti", name: "Rajamangala University of Technology Isan", country: "Thailand", domain: "rmuti.ac.th" },
  { id: "th-rmutt", name: "Rajamangala University of Technology Thanyaburi", country: "Thailand", domain: "rmutt.ac.th" },
  { id: "th-rmutk", name: "Rajamangala University of Technology Krungthep", country: "Thailand", domain: "rmutk.ac.th" },
  { id: "th-rmutl", name: "Rajamangala University of Technology Lanna", country: "Thailand", domain: "rmutl.ac.th" },
  { id: "th-au", name: "Assumption University", country: "Thailand", domain: "au.edu" },
  { id: "th-bu-uni", name: "Bangkok University", country: "Thailand", domain: "bu.ac.th" },
  { id: "th-spu", name: "Sripatum University", country: "Thailand", domain: "spu.ac.th" },
  { id: "th-utcc", name: "University of the Thai Chamber of Commerce", country: "Thailand", domain: "utcc.ac.th" },
  { id: "th-rsu", name: "Rangsit University", country: "Thailand", domain: "rsu.ac.th" },
  { id: "th-dpu", name: "Dhurakij Pundit University", country: "Thailand", domain: "dpu.ac.th" },
  { id: "th-pim", name: "Panyapiwat Institute of Management", country: "Thailand", domain: "pim.ac.th" },
  { id: "th-stou", name: "Sukhothai Thammathirat Open University", country: "Thailand", domain: "stou.ac.th" },
  { id: "th-wu", name: "Walailak University", country: "Thailand", domain: "wu.ac.th" },
  { id: "th-tsu", name: "Thaksin University", country: "Thailand", domain: "tsu.ac.th" },
  { id: "th-up", name: "University of Phayao", country: "Thailand", domain: "up.ac.th" },
  { id: "th-rbru", name: "Rambhai Barni Rajabhat University", country: "Thailand", domain: "rbru.ac.th" },
  { id: "th-srru", name: "Surindra Rajabhat University", country: "Thailand", domain: "srru.ac.th" },
  { id: "th-nida", name: "National Institute of Development Administration", country: "Thailand", domain: "nida.ac.th" },
  { id: "th-aiit", name: "Asian Institute of Technology", country: "Thailand", domain: "ait.ac.th" },
  { id: "th-vu", name: "Vongchavalitkul University", country: "Thailand", domain: "vu.ac.th" },

  // Singapore
  { id: "sg-nus", name: "National University of Singapore", country: "Singapore", domain: "nus.edu.sg" },
  { id: "sg-ntu", name: "Nanyang Technological University", country: "Singapore", domain: "ntu.edu.sg" },
  { id: "sg-smu", name: "Singapore Management University", country: "Singapore", domain: "smu.edu.sg" },
  { id: "sg-sutd", name: "Singapore University of Technology and Design", country: "Singapore", domain: "sutd.edu.sg" },
  { id: "sg-suss", name: "Singapore University of Social Sciences", country: "Singapore", domain: "suss.edu.sg" },
  { id: "sg-sit", name: "Singapore Institute of Technology", country: "Singapore", domain: "singaporetech.edu.sg" },
  { id: "sg-yale-nus", name: "Yale-NUS College", country: "Singapore", domain: "yale-nus.edu.sg" },

  // Malaysia
  { id: "my-um", name: "Universiti Malaya", country: "Malaysia", domain: "um.edu.my" },
  { id: "my-ukm", name: "Universiti Kebangsaan Malaysia", country: "Malaysia", domain: "ukm.edu.my" },
  { id: "my-upm", name: "Universiti Putra Malaysia", country: "Malaysia", domain: "upm.edu.my" },
  { id: "my-usm", name: "Universiti Sains Malaysia", country: "Malaysia", domain: "usm.my" },
  { id: "my-utm", name: "Universiti Teknologi Malaysia", country: "Malaysia", domain: "utm.my" },
  { id: "my-iium", name: "International Islamic University Malaysia", country: "Malaysia", domain: "iium.edu.my" },
  { id: "my-mmu", name: "Multimedia University", country: "Malaysia", domain: "mmu.edu.my" },
  { id: "my-taylors", name: "Taylor's University", country: "Malaysia", domain: "taylors.edu.my" },
  { id: "my-monash", name: "Monash University Malaysia", country: "Malaysia", domain: "monash.edu.my" },
  { id: "my-sunway", name: "Sunway University", country: "Malaysia", domain: "sunway.edu.my" },
  { id: "my-help", name: "HELP University", country: "Malaysia", domain: "help.edu.my" },
  { id: "my-uitm", name: "Universiti Teknologi MARA", country: "Malaysia", domain: "uitm.edu.my" },
  { id: "my-uum", name: "Universiti Utara Malaysia", country: "Malaysia", domain: "uum.edu.my" },
  { id: "my-unimas", name: "Universiti Malaysia Sarawak", country: "Malaysia", domain: "unimas.my" },

  // Indonesia
  { id: "id-ui", name: "Universitas Indonesia", country: "Indonesia", domain: "ui.ac.id" },
  { id: "id-itb", name: "Institut Teknologi Bandung", country: "Indonesia", domain: "itb.ac.id" },
  { id: "id-ugm", name: "Universitas Gadjah Mada", country: "Indonesia", domain: "ugm.ac.id" },
  { id: "id-ipb", name: "IPB University", country: "Indonesia", domain: "ipb.ac.id" },
  { id: "id-its", name: "Institut Teknologi Sepuluh Nopember", country: "Indonesia", domain: "its.ac.id" },
  { id: "id-unair", name: "Universitas Airlangga", country: "Indonesia", domain: "unair.ac.id" },
  { id: "id-unpad", name: "Universitas Padjadjaran", country: "Indonesia", domain: "unpad.ac.id" },
  { id: "id-undip", name: "Universitas Diponegoro", country: "Indonesia", domain: "undip.ac.id" },
  { id: "id-binus", name: "Bina Nusantara University", country: "Indonesia", domain: "binus.ac.id" },
  { id: "id-prasmul", name: "Universitas Prasetiya Mulya", country: "Indonesia", domain: "pmbs.ac.id" },
  { id: "id-uns", name: "Universitas Sebelas Maret", country: "Indonesia", domain: "uns.ac.id" },
  { id: "id-unhas", name: "Universitas Hasanuddin", country: "Indonesia", domain: "unhas.ac.id" },
  { id: "id-trisakti", name: "Universitas Trisakti", country: "Indonesia", domain: "trisakti.ac.id" },
  { id: "id-atmajaya", name: "Atma Jaya Catholic University of Indonesia", country: "Indonesia", domain: "atmajaya.ac.id" },

  // Philippines
  { id: "ph-up", name: "University of the Philippines Diliman", country: "Philippines", domain: "up.edu.ph" },
  { id: "ph-admu", name: "Ateneo de Manila University", country: "Philippines", domain: "ateneo.edu" },
  { id: "ph-dlsu", name: "De La Salle University", country: "Philippines", domain: "dlsu.edu.ph" },
  { id: "ph-ust", name: "University of Santo Tomas", country: "Philippines", domain: "ust.edu.ph" },
  { id: "ph-mapua", name: "Mapúa University", country: "Philippines", domain: "mapua.edu.ph" },
  { id: "ph-fea", name: "Far Eastern University", country: "Philippines", domain: "feu.edu.ph" },
  { id: "ph-pup", name: "Polytechnic University of the Philippines", country: "Philippines", domain: "pup.edu.ph" },
  { id: "ph-silliman", name: "Silliman University", country: "Philippines", domain: "su.edu.ph" },
  { id: "ph-usc", name: "University of San Carlos", country: "Philippines", domain: "usc.edu.ph" },

  // Vietnam
  { id: "vn-vnu-hn", name: "Vietnam National University, Hanoi", country: "Vietnam", domain: "vnu.edu.vn" },
  { id: "vn-vnu-hcm", name: "Vietnam National University, Ho Chi Minh City", country: "Vietnam", domain: "vnuhcm.edu.vn" },
  { id: "vn-hust", name: "Hanoi University of Science and Technology", country: "Vietnam", domain: "hust.edu.vn" },
  { id: "vn-fpt", name: "FPT University", country: "Vietnam", domain: "fpt.edu.vn" },
  { id: "vn-rmit", name: "RMIT University Vietnam", country: "Vietnam", domain: "rmit.edu.vn" },
  { id: "vn-fulbright", name: "Fulbright University Vietnam", country: "Vietnam", domain: "fulbright.edu.vn" },
  { id: "vn-uel", name: "University of Economics and Law", country: "Vietnam", domain: "uel.edu.vn" },
  { id: "vn-due", name: "University of Da Nang", country: "Vietnam", domain: "udn.vn" },
  { id: "vn-hcmut", name: "Ho Chi Minh City University of Technology", country: "Vietnam", domain: "hcmut.edu.vn" },
  { id: "vn-fou", name: "Foreign Trade University", country: "Vietnam", domain: "ftu.edu.vn" },

  // Cambodia
  { id: "kh-rupp", name: "Royal University of Phnom Penh", country: "Cambodia", domain: "rupp.edu.kh" },
  { id: "kh-itc", name: "Institute of Technology of Cambodia", country: "Cambodia", domain: "itc.edu.kh" },
  { id: "kh-puc", name: "Pannasastra University of Cambodia", country: "Cambodia", domain: "puc.edu.kh" },
  { id: "kh-au", name: "American University of Phnom Penh", country: "Cambodia", domain: "aupp.edu.kh" },
  { id: "kh-rule", name: "Royal University of Law and Economics", country: "Cambodia", domain: "rule.edu.kh" },

  // Laos
  { id: "la-nuol", name: "National University of Laos", country: "Laos", domain: "nuol.edu.la" },
  { id: "la-suu", name: "Souphanouvong University", country: "Laos", domain: "su.edu.la" },
  { id: "la-cu", name: "Champasak University", country: "Laos", domain: "cu.edu.la" },

  // Myanmar
  { id: "mm-uy", name: "University of Yangon", country: "Myanmar", domain: "uy.edu.mm" },
  { id: "mm-um", name: "University of Mandalay", country: "Myanmar", domain: "umd.edu.mm" },
  { id: "mm-yt", name: "Yangon Technological University", country: "Myanmar", domain: "ytu.edu.mm" },
  { id: "mm-mit", name: "Myanmar Institute of Technology", country: "Myanmar", domain: "mit.edu.mm" },

  // Brunei
  { id: "bn-ubd", name: "Universiti Brunei Darussalam", country: "Brunei", domain: "ubd.edu.bn" },
  { id: "bn-utb", name: "Universiti Teknologi Brunei", country: "Brunei", domain: "utb.edu.bn" },
  { id: "bn-unissa", name: "Universiti Islam Sultan Sharif Ali", country: "Brunei", domain: "unissa.edu.bn" },

  // Timor-Leste
  { id: "tl-untl", name: "Universidade Nacional Timor Lorosa'e", country: "Timor-Leste", domain: "untl.edu.tl" },

  // Catch-all
  { id: "other", name: "Other / Not listed", country: "—" },
];

export function searchUniversities(query: string, limit = 12): University[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    // Surface Thai universities first when there's no query.
    return [...universities].sort((a, b) => {
      if (a.country === "Thailand" && b.country !== "Thailand") return -1;
      if (b.country === "Thailand" && a.country !== "Thailand") return 1;
      return a.name.localeCompare(b.name);
    }).slice(0, limit);
  }
  return universities
    .filter((u) => u.name.toLowerCase().includes(q) || u.country.toLowerCase().includes(q))
    .slice(0, limit);
}

export function getUniversityById(id: string | undefined): University | undefined {
  if (!id) return undefined;
  return universities.find((u) => u.id === id);
}

export const partnerEmailDomains = universities
  .map((u) => u.domain)
  .filter((d): d is string => Boolean(d));
