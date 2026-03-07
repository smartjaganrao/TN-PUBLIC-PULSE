const imageModules = import.meta.glob('../assets/img/*.{webp,avif,jpg}', { eager: true, query: '?url', import: 'default' });

const getPartyImage = (filename: string) => {
  const path = `../assets/img/${filename}`;
  const resolved = (imageModules[path] as string) || '';
  if (!resolved) {
    console.warn(`[Asset Resolution] Could not find image: ${filename} at path: ${path}`);
  }
  return resolved;
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
  { id: "DMK", name: "DMK", color: "#FF0000", image: getPartyImage('DMK.jpg'), axis: 'RULING' },
  { id: "Congress", name: "INC", color: "#0000FF", image: getPartyImage('INC.jpg'), axis: 'RULING' },
  { id: "VCK", name: "VCK", color: "#0000FF", image: getPartyImage('VCK.jpg'), axis: 'RULING' },
  { id: "CPI", name: "CPI", color: "#FF0000", image: getPartyImage('CPI.jpg'), axis: 'RULING' },
  { id: "CPIM", name: "CPI(M)", color: "#FF0000", image: getPartyImage('CPIM.jpg'), axis: 'RULING' },
  { id: "MDMK", name: "MDMK", color: "#FF0000", image: getPartyImage('MDMK.jpg'), axis: 'RULING' },
  { id: "IUML", name: "IUML", color: "#008000", image: getPartyImage('IUML.jpg'), axis: 'RULING' },
  { id: "KMDK", name: "KMDK", color: "#FFFF00", image: getPartyImage('KMDK.jpg'), axis: 'RULING' },
  { id: "MMK", name: "MMK", color: "#008000", image: getPartyImage('MMK.jpg'), axis: 'RULING' },
  
  // OPPOSITION FRONT (AIADMK/NDA)
  { id: "AIADMK", name: "AIDMK", color: "#008000", image: getPartyImage('AIDMK.jpg'), axis: 'OPPOSITION' },
  { id: "BJP", name: "BJP", color: "#FF9933", image: getPartyImage('BJP.jpg'), axis: 'OPPOSITION' },
  { id: "PMK", name: "PMK", color: "#FFFF00", image: getPartyImage('PMK.jpg'), axis: 'OPPOSITION' },
  { id: "DMDK", name: "DMDK", color: "#FFD700", image: getPartyImage('DMDK.jpg'), axis: 'OPPOSITION' },
  { id: "AMMK", name: "AMMK", color: "#FF0000", image: getPartyImage('AMMK.jpg'), axis: 'OPPOSITION' },
  { id: "TMCM", name: "TMC(M)", color: "#FF9933", image: getPartyImage('TMC.jpg'), axis: 'OPPOSITION' },
  { id: "PNK", name: "PNK", color: "#FF0000", image: getPartyImage('PNK.jpg'), axis: 'OPPOSITION' },
  { id: "PBK", name: "PBK", color: "#FF0000", image: getPartyImage('PBK.jpg'), axis: 'OPPOSITION' },
  { id: "IJK", name: "IJK", color: "#FF0000", image: getPartyImage('IJK.jpg'), axis: 'OPPOSITION' },

  // ALTERNATIVES & OTHERS
  { id: "TVK", name: "TVK", color: "#800000", image: getPartyImage('TVK.jpg'), axis: 'ALTERNATIVES' },
  { id: "NTK", name: "NTK", color: "#FFFF00", image: getPartyImage('NTK.jpg'), axis: 'ALTERNATIVES' },
  { id: "MNM", name: "MNM", color: "#FFFFFF", image: getPartyImage('MNM.jpg'), axis: 'ALTERNATIVES' },
  { id: "SDPI", name: "SDPI", color: "#008000", image: getPartyImage('SDPI.jpg'), axis: 'ALTERNATIVES' },
  { id: "AAP", name: "AAP", color: "#0000FF", image: getPartyImage('AAP.jpg'), axis: 'ALTERNATIVES' },
  { id: "PT", name: "PT", color: "#FF0000", image: getPartyImage('PT.jpg'), axis: 'ALTERNATIVES' },
  { id: "TMMK", name: "TMMK", color: "#008000", image: getPartyImage('TMMK.jpg'), axis: 'ALTERNATIVES' },
  { id: "ATP", name: "ATP", color: "#FF0000", image: getPartyImage('ATP.jpg'), axis: 'ALTERNATIVES' },
  { id: "INL", name: "INL", color: "#008000", image: getPartyImage('INL.jpg'), axis: 'ALTERNATIVES' },
  { id: "BSP", name: "BSP", color: "#0000FF", image: getPartyImage('BSP.jpg'), axis: 'ALTERNATIVES' },
  { id: "AIFB", name: "AIFB", color: "#FF0000", image: getPartyImage('AIFB.jpg'), axis: 'ALTERNATIVES' },
  { id: "NOTA", name: "NOTA", color: "#808080", image: getPartyImage('NOTA.jpg'), axis: 'ALTERNATIVES' }
];

