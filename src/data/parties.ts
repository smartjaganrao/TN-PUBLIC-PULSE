import dmkLogo from '../assets/img/DMK.webp';
import incLogo from '../assets/img/INC.avif';
import vckLogo from '../assets/img/VCK.webp';
import cpiLogo from '../assets/img/CPI.avif';
import cpimLogo from '../assets/img/CPI(M).avif';
import mdmkLogo from '../assets/img/MDMK.webp';
import iumlLogo from '../assets/img/IUML.webp';
import kmdkLogo from '../assets/img/KMDK.webp';
import mmkLogo from '../assets/img/MMK.webp';
import aiadmkLogo from '../assets/img/AIDMK.webp';
import bjpLogo from '../assets/img/BJP.webp';
import pmkLogo from '../assets/img/PMK.webp';
import dmdkLogo from '../assets/img/DMDK.avif';
import ammkLogo from '../assets/img/AMMK.webp';
import tmcLogo from '../assets/img/TMC.webp';
import pnkLogo from '../assets/img/PNK.webp';
import pbkLogo from '../assets/img/PBK.webp';
import ijkLogo from '../assets/img/IJK.webp';
import tvkLogo from '../assets/img/TVK.webp';
import ntkLogo from '../assets/img/NTK.webp';
import mnmLogo from '../assets/img/MNM.webp';
import sdpiLogo from '../assets/img/SDPI.webp';
import aapLogo from '../assets/img/AAP.webp';
import ptLogo from '../assets/img/PT.webp';
import tmmkLogo from '../assets/img/TMMK.webp';
import atpLogo from '../assets/img/ATP.webp';
import inlLogo from '../assets/img/INL.webp';
import bspLogo from '../assets/img/BSP.webp';
import aifbLogo from '../assets/img/AIFB.webp';
import notaLogo from '../assets/img/NOTA.webp';

export interface Party {
  id: string;
  name: string;
  color: string;
  image: string;
  axis: 'RULING' | 'OPPOSITION' | 'ALTERNATIVES';
}

export const parties: Party[] = [
  // RULING FRONT (SPA)
  { id: "DMK", name: "DMK", color: "#FF0000", image: dmkLogo, axis: 'RULING' },
  { id: "Congress", name: "INC", color: "#0000FF", image: incLogo, axis: 'RULING' },
  { id: "VCK", name: "VCK", color: "#0000FF", image: vckLogo, axis: 'RULING' },
  { id: "CPI", name: "CPI", color: "#FF0000", image: cpiLogo, axis: 'RULING' },
  { id: "CPIM", name: "CPI(M)", color: "#FF0000", image: cpimLogo, axis: 'RULING' },
  { id: "MDMK", name: "MDMK", color: "#FF0000", image: mdmkLogo, axis: 'RULING' },
  { id: "IUML", name: "IUML", color: "#008000", image: iumlLogo, axis: 'RULING' },
  { id: "KMDK", name: "KMDK", color: "#FFFF00", image: kmdkLogo, axis: 'RULING' },
  { id: "MMK", name: "MMK", color: "#008000", image: mmkLogo, axis: 'RULING' },
  
  // OPPOSITION FRONT (AIADMK/NDA)
  { id: "AIADMK", name: "AIADMK", color: "#008000", image: aiadmkLogo, axis: 'OPPOSITION' },
  { id: "BJP", name: "BJP", color: "#FF9933", image: bjpLogo, axis: 'OPPOSITION' },
  { id: "PMK", name: "PMK", color: "#FFFF00", image: pmkLogo, axis: 'OPPOSITION' },
  { id: "DMDK", name: "DMDK", color: "#FFD700", image: dmdkLogo, axis: 'OPPOSITION' },
  { id: "AMMK", name: "AMMK", color: "#FF0000", image: ammkLogo, axis: 'OPPOSITION' },
  { id: "TMCM", name: "TMC(M)", color: "#FF9933", image: tmcLogo, axis: 'OPPOSITION' },
  { id: "PNK", name: "PNK", color: "#FF0000", image: pnkLogo, axis: 'OPPOSITION' },
  { id: "PBK", name: "PBK", color: "#FF0000", image: pbkLogo, axis: 'OPPOSITION' },
  { id: "IJK", name: "IJK", color: "#FF0000", image: ijkLogo, axis: 'OPPOSITION' },

  // ALTERNATIVES & OTHERS
  { id: "TVK", name: "TVK", color: "#800000", image: tvkLogo, axis: 'ALTERNATIVES' },
  { id: "NTK", name: "NTK", color: "#FFFF00", image: ntkLogo, axis: 'ALTERNATIVES' },
  { id: "MNM", name: "MNM", color: "#FFFFFF", image: mnmLogo, axis: 'ALTERNATIVES' },
  { id: "SDPI", name: "SDPI", color: "#008000", image: sdpiLogo, axis: 'ALTERNATIVES' },
  { id: "AAP", name: "AAP", color: "#0000FF", image: aapLogo, axis: 'ALTERNATIVES' },
  { id: "PT", name: "PT", color: "#FF0000", image: ptLogo, axis: 'ALTERNATIVES' },
  { id: "TMMK", name: "TMMK", color: "#008000", image: tmmkLogo, axis: 'ALTERNATIVES' },
  { id: "ATP", name: "ATP", color: "#FF0000", image: atpLogo, axis: 'ALTERNATIVES' },
  { id: "INL", name: "INL", color: "#008000", image: inlLogo, axis: 'ALTERNATIVES' },
  { id: "BSP", name: "BSP", color: "#0000FF", image: bspLogo, axis: 'ALTERNATIVES' },
  { id: "AIFB", name: "AIFB", color: "#FF0000", image: aifbLogo, axis: 'ALTERNATIVES' },
  { id: "NOTA", name: "NOTA", color: "#808080", image: notaLogo, axis: 'ALTERNATIVES' }
];

