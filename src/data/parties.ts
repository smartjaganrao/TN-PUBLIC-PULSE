const getPartyImage = (filename: string) => {
  return `/img/${filename}`;
};

export interface Party {
  id: string;
  name: string;
  color: string;
  image: string;
  axis: 'RULING' | 'OPPOSITION' | 'ALTERNATIVES';
}

export const parties: Party[] = [
  // RULING FRONT (SPA)
  { id: "DMK", name: "DMK", color: "#FF0000", image: getPartyImage('DMK.webp'), axis: 'RULING' },
  { id: "Congress", name: "INC", color: "#0000FF", image: getPartyImage('INC.avif'), axis: 'RULING' },
  { id: "VCK", name: "VCK", color: "#0000FF", image: getPartyImage('VCK.webp'), axis: 'RULING' },
  { id: "CPI", name: "CPI", color: "#FF0000", image: getPartyImage('CPI.avif'), axis: 'RULING' },
  { id: "CPIM", name: "CPI(M)", color: "#FF0000", image: getPartyImage('CPIM.avif'), axis: 'RULING' },
  { id: "MDMK", name: "MDMK", color: "#FF0000", image: getPartyImage('MDMK.webp'), axis: 'RULING' },
  { id: "IUML", name: "IUML", color: "#008000", image: getPartyImage('IUML.webp'), axis: 'RULING' },
  { id: "KMDK", name: "KMDK", color: "#FFFF00", image: getPartyImage('KMDK.webp'), axis: 'RULING' },
  { id: "MMK", name: "MMK", color: "#008000", image: getPartyImage('MMK.webp'), axis: 'RULING' },
  
  // OPPOSITION FRONT (AIADMK/NDA)
  { id: "AIADMK", name: "AIADMK", color: "#008000", image: getPartyImage('AIDMK.webp'), axis: 'OPPOSITION' },
  { id: "BJP", name: "BJP", color: "#FF9933", image: getPartyImage('BJP.webp'), axis: 'OPPOSITION' },
  { id: "PMK", name: "PMK", color: "#FFFF00", image: getPartyImage('PMK.webp'), axis: 'OPPOSITION' },
  { id: "DMDK", name: "DMDK", color: "#FFD700", image: getPartyImage('DMDK.avif'), axis: 'OPPOSITION' },
  { id: "AMMK", name: "AMMK", color: "#FF0000", image: getPartyImage('AMMK.webp'), axis: 'OPPOSITION' },
  { id: "TMCM", name: "TMC(M)", color: "#FF9933", image: getPartyImage('TMC.webp'), axis: 'OPPOSITION' },
  { id: "PNK", name: "PNK", color: "#FF0000", image: getPartyImage('PNK.webp'), axis: 'OPPOSITION' },
  { id: "PBK", name: "PBK", color: "#FF0000", image: getPartyImage('PBK.webp'), axis: 'OPPOSITION' },
  { id: "IJK", name: "IJK", color: "#FF0000", image: getPartyImage('IJK.webp'), axis: 'OPPOSITION' },

  // ALTERNATIVES & OTHERS
  { id: "TVK", name: "TVK", color: "#800000", image: getPartyImage('TVK.webp'), axis: 'ALTERNATIVES' },
  { id: "NTK", name: "NTK", color: "#FFFF00", image: getPartyImage('NTK.webp'), axis: 'ALTERNATIVES' },
  { id: "MNM", name: "MNM", color: "#FFFFFF", image: getPartyImage('MNM.webp'), axis: 'ALTERNATIVES' },
  { id: "SDPI", name: "SDPI", color: "#008000", image: getPartyImage('SDPI.webp'), axis: 'ALTERNATIVES' },
  { id: "AAP", name: "AAP", color: "#0000FF", image: getPartyImage('AAP.webp'), axis: 'ALTERNATIVES' },
  { id: "PT", name: "PT", color: "#FF0000", image: getPartyImage('PT.webp'), axis: 'ALTERNATIVES' },
  { id: "TMMK", name: "TMMK", color: "#008000", image: getPartyImage('TMMK.webp'), axis: 'ALTERNATIVES' },
  { id: "ATP", name: "ATP", color: "#FF0000", image: getPartyImage('ATP.webp'), axis: 'ALTERNATIVES' },
  { id: "INL", name: "INL", color: "#008000", image: getPartyImage('INL.webp'), axis: 'ALTERNATIVES' },
  { id: "BSP", name: "BSP", color: "#0000FF", image: getPartyImage('BSP.webp'), axis: 'ALTERNATIVES' },
  { id: "AIFB", name: "AIFB", color: "#FF0000", image: getPartyImage('AIFB.webp'), axis: 'ALTERNATIVES' },
  { id: "NOTA", name: "NOTA", color: "#808080", image: getPartyImage('NOTA.webp'), axis: 'ALTERNATIVES' }
];

