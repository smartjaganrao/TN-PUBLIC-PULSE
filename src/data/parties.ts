export interface Party {
  id: string;
  name: string;
  color: string;
  image: string;
}

export const parties: Party[] = [
  { id: "DMK", name: "DMK", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/DMK_logo.svg/300px-DMK_logo.svg.png" },
  { id: "AIADMK", name: "AIADMK", color: "#008000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/AIADMK_Logo.svg/300px-AIADMK_Logo.svg.png" },
  { id: "BJP", name: "BJP", color: "#FF9933", image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/300px-Bharatiya_Janata_Party_logo.svg.png" },
  { id: "TVK", name: "TVK", color: "#800000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Tamilaga_Vettri_Kazhagam_Flag.svg/300px-Tamilaga_Vettri_Kazhagam_Flag.svg.png" },
  { id: "NTK", name: "NTK", color: "#FFFF00", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Naam_Tamilar_Katchi_Logo.svg/300px-Naam_Tamilar_Katchi_Logo.svg.png" },
  { id: "Congress", name: "Congress", color: "#0000FF", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_logo.svg/300px-Indian_National_Congress_logo.svg.png" },
  { id: "PMK", name: "PMK", color: "#FFFF00", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pattali_Makkal_Katchi_Logo.svg/300px-Pattali_Makkal_Katchi_Logo.svg.png" },
  { id: "DMDK", name: "DMDK", color: "#FFD700", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/DMDK_Logo.svg/300px-DMDK_Logo.svg.png" },
  { id: "AMMK", name: "AMMK", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/AMMK_Logo.svg/300px-AMMK_Logo.svg.png" },
  { id: "Independent", name: "Independent", color: "#808080", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Independent_candidate_symbol.svg/300px-Independent_candidate_symbol.svg.png" }
];
