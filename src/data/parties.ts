export interface Party {
  id: string;
  name: string;
  color: string;
  image: string;
  axis: 'RULING' | 'OPPOSITION' | 'ALTERNATIVES';
}

export const parties: Party[] = [
  // RULING FRONT (SPA)
  { id: "DMK", name: "DMK", color: "#FF0000", image: "/img/DMK.webp", axis: 'RULING' },
  { id: "Congress", name: "INC", color: "#0000FF", image: "/img/INC.avif", axis: 'RULING' },
  { id: "VCK", name: "VCK", color: "#0000FF", image: "/img/VCK.webp", axis: 'RULING' },
  { id: "CPI", name: "CPI", color: "#FF0000", image: "/img/CPI.avif", axis: 'RULING' },
  { id: "CPIM", name: "CPI(M)", color: "#FF0000", image: "/img/CPI(M).avif", axis: 'RULING' },
  { id: "MDMK", name: "MDMK", color: "#FF0000", image: "/img/MDMK.webp", axis: 'RULING' },
  { id: "IUML", name: "IUML", color: "#008000", image: "/img/IUML.webp", axis: 'RULING' },
  { id: "KMDK", name: "KMDK", color: "#FFFF00", image: "/img/KMDK.webp", axis: 'RULING' },
  { id: "MMK", name: "MMK", color: "#008000", image: "/img/MMK.webp", axis: 'RULING' },
  
  // OPPOSITION FRONT (AIADMK/NDA)
  { id: "AIADMK", name: "AIADMK", color: "#008000", image: "/img/AIDMK.webp", axis: 'OPPOSITION' },
  { id: "BJP", name: "BJP", color: "#FF9933", image: "/img/BJP.webp", axis: 'OPPOSITION' },
  { id: "PMK", name: "PMK", color: "#FFFF00", image: "/img/PMK.webp", axis: 'OPPOSITION' },
  { id: "DMDK", name: "DMDK", color: "#FFD700", image: "/img/DMDK.avif", axis: 'OPPOSITION' },
  { id: "AMMK", name: "AMMK", color: "#FF0000", image: "/img/AMMK.webp", axis: 'OPPOSITION' },
  { id: "TMCM", name: "TMC(M)", color: "#FF9933", image: "/img/TMC.webp", axis: 'OPPOSITION' },
  { id: "PNK", name: "PNK", color: "#FF0000", image: "/img/PNK.webp", axis: 'OPPOSITION' },
  { id: "PBK", name: "PBK", color: "#FF0000", image: "/img/PBK.webp", axis: 'OPPOSITION' },
  { id: "IJK", name: "IJK", color: "#FF0000", image: "/img/IJK.webp", axis: 'OPPOSITION' },

  // ALTERNATIVES & OTHERS
  { id: "TVK", name: "TVK", color: "#800000", image: "/img/TVK.webp", axis: 'ALTERNATIVES' },
  { id: "NTK", name: "NTK", color: "#FFFF00", image: "/img/NTK.webp", axis: 'ALTERNATIVES' },
  { id: "MNM", name: "MNM", color: "#FFFFFF", image: "/img/MNM.webp", axis: 'ALTERNATIVES' },
  { id: "SDPI", name: "SDPI", color: "#008000", image: "/img/SDPI.webp", axis: 'ALTERNATIVES' },
  { id: "AAP", name: "AAP", color: "#0000FF", image: "/img/AAP.webp", axis: 'ALTERNATIVES' },
  { id: "PT", name: "PT", color: "#FF0000", image: "/img/PT.webp", axis: 'ALTERNATIVES' },
  { id: "TMMK", name: "TMMK", color: "#008000", image: "/img/TMMK.webp", axis: 'ALTERNATIVES' },
  { id: "ATP", name: "ATP", color: "#FF0000", image: "/img/ATP.webp", axis: 'ALTERNATIVES' },
  { id: "INL", name: "INL", color: "#008000", image: "/img/INL.webp", axis: 'ALTERNATIVES' },
  { id: "BSP", name: "BSP", color: "#0000FF", image: "/img/BSP.webp", axis: 'ALTERNATIVES' },
  { id: "AIFB", name: "AIFB", color: "#FF0000", image: "/img/AIFB.webp", axis: 'ALTERNATIVES' },
  { id: "NOTA", name: "NOTA", color: "#808080", image: "/img/NOTA.webp", axis: 'ALTERNATIVES' }
];

