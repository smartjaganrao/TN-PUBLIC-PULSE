export interface Party {
  id: string;
  name: string;
  color: string;
  image: string;
  axis: 'RULING' | 'OPPOSITION' | 'ALTERNATIVES';
}

export const parties: Party[] = [
  { id: "DMK", name: "DMK", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/DMK_logo.svg/300px-DMK_logo.svg.png", axis: 'RULING' },
  { id: "AIADMK", name: "AIADMK", color: "#008000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/AIADMK_Logo.svg/300px-AIADMK_Logo.svg.png", axis: 'OPPOSITION' },
  { id: "BJP", name: "BJP", color: "#FF9933", image: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Bharatiya_Janata_Party_logo.svg/300px-Bharatiya_Janata_Party_logo.svg.png", axis: 'OPPOSITION' },
  { id: "TVK", name: "TVK", color: "#800000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Tamilaga_Vettri_Kazhagam_Flag.svg/300px-Tamilaga_Vettri_Kazhagam_Flag.svg.png", axis: 'ALTERNATIVES' },
  { id: "NTK", name: "NTK", color: "#FFFF00", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Naam_Tamilar_Katchi_Logo.svg/300px-Naam_Tamilar_Katchi_Logo.svg.png", axis: 'ALTERNATIVES' },
  { id: "Congress", name: "Congress", color: "#0000FF", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Indian_National_Congress_logo.svg/300px-Indian_National_Congress_logo.svg.png", axis: 'RULING' },
  { id: "PMK", name: "PMK", color: "#FFFF00", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Pattali_Makkal_Katchi_Logo.svg/300px-Pattali_Makkal_Katchi_Logo.svg.png", axis: 'OPPOSITION' },
  { id: "DMDK", name: "DMDK", color: "#FFD700", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/DMDK_Logo.svg/300px-DMDK_Logo.svg.png", axis: 'OPPOSITION' },
  { id: "VCK", name: "VCK", color: "#0000FF", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Viduthalai_Chiruthaigal_Katchi_Flag.svg/300px-Viduthalai_Chiruthaigal_Katchi_Flag.svg.png", axis: 'RULING' },
  { id: "MNM", name: "MNM", color: "#FFFFFF", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Makkal_Needhi_Maiyam_Logo.svg/300px-Makkal_Needhi_Maiyam_Logo.svg.png", axis: 'ALTERNATIVES' },
  { id: "MDMK", name: "MDMK", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/MDMK_Flag.svg/300px-MDMK_Flag.svg.png", axis: 'RULING' },
  { id: "AMMK", name: "AMMK", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/AMMK_Logo.svg/300px-AMMK_Logo.svg.png", axis: 'OPPOSITION' },
  { id: "CPI", name: "CPI", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/CPI-banner.svg/300px-CPI-banner.svg.png", axis: 'RULING' },
  { id: "CPIM", name: "CPI(M)", color: "#FF0000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/CPIM-banner.svg/300px-CPIM-banner.svg.png", axis: 'RULING' },
  { id: "SDPI", name: "SDPI", color: "#008000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/SDPI_Flag.svg/300px-SDPI_Flag.svg.png", axis: 'ALTERNATIVES' },
  { id: "TMCM", name: "TMC(M)", color: "#FF9933", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Tamil_Maanila_Congress_Logo.svg/300px-Tamil_Maanila_Congress_Logo.svg.png", axis: 'OPPOSITION' },
  { id: "KMDK", name: "KMDK", color: "#FFFF00", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/KMDK_Flag.svg/300px-KMDK_Flag.svg.png", axis: 'RULING' },
  { id: "MMK", name: "MMK", color: "#008000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/MMK_Flag.svg/300px-MMK_Flag.svg.png", axis: 'RULING' },
  { id: "IUML", name: "IUML", color: "#008000", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/IUML_Flag.svg/300px-IUML_Flag.svg.png", axis: 'RULING' },
  { id: "AAP", name: "AAP", color: "#0000FF", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Aam_Aadmi_Party_logo.svg/300px-Aam_Aadmi_Party_logo.svg.png", axis: 'ALTERNATIVES' },
  { id: "Independent", name: "Independent", color: "#808080", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Independent_candidate_symbol.svg/300px-Independent_candidate_symbol.svg.png", axis: 'ALTERNATIVES' }
];
