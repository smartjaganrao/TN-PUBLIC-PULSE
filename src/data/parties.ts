import dmkImg from '../assets/img/DMK.webp';
import aiadmkImg from '../assets/img/AIDMK.webp';
import bjpImg from '../assets/img/BJP.webp';
import tvkImg from '../assets/img/TVK.webp';
import ntkImg from '../assets/img/NTK.webp';
import incImg from '../assets/img/INC.avif';
import pmkImg from '../assets/img/PMK.webp';
import dmdkImg from '../assets/img/DMDK.avif';
import vckImg from '../assets/img/VCK.webp';
import mnmImg from '../assets/img/MNM.webp';
import mdmkImg from '../assets/img/MDMK.webp';
import ammkImg from '../assets/img/AMMK.webp';
import cpiImg from '../assets/img/CPI.avif';
import cpimImg from '../assets/img/CPI(M).avif';
import sdpiImg from '../assets/img/SDPI.webp';
import tmcImg from '../assets/img/TMC.webp';
import kmdkImg from '../assets/img/KMDK.webp';
import mmkImg from '../assets/img/MMK.webp';
import iumlImg from '../assets/img/IUML.webp';
import aapImg from '../assets/img/AAP.webp';
import ptImg from '../assets/img/PT.webp';
import pnkImg from '../assets/img/PNK.webp';
import pbkImg from '../assets/img/PBK.webp';
import notaImg from '../assets/img/NOTA.webp';
import tmmkImg from '../assets/img/TMMK.webp';
import atpImg from '../assets/img/ATP.webp';
import ijkImg from '../assets/img/IJK.webp';
import inlImg from '../assets/img/INL.webp';
import bspImg from '../assets/img/BSP.webp';
import aifbImg from '../assets/img/AIFB.webp';

export interface Party {
  id: string;
  name: string;
  color: string;
  image: string;
  axis: 'RULING' | 'OPPOSITION' | 'ALTERNATIVES';
}

export const parties: Party[] = [
  // RULING FRONT (SPA)
  { id: "DMK", name: "DMK", color: "#FF0000", image: dmkImg, axis: 'RULING' },
  { id: "Congress", name: "INC", color: "#0000FF", image: incImg, axis: 'RULING' },
  { id: "VCK", name: "VCK", color: "#0000FF", image: vckImg, axis: 'RULING' },
  { id: "CPI", name: "CPI", color: "#FF0000", image: cpiImg, axis: 'RULING' },
  { id: "CPIM", name: "CPI(M)", color: "#FF0000", image: cpimImg, axis: 'RULING' },
  { id: "MDMK", name: "MDMK", color: "#FF0000", image: mdmkImg, axis: 'RULING' },
  { id: "IUML", name: "IUML", color: "#008000", image: iumlImg, axis: 'RULING' },
  { id: "KMDK", name: "KMDK", color: "#FFFF00", image: kmdkImg, axis: 'RULING' },
  { id: "MMK", name: "MMK", color: "#008000", image: mmkImg, axis: 'RULING' },
  
  // OPPOSITION FRONT (AIADMK/NDA)
  { id: "AIADMK", name: "AIADMK", color: "#008000", image: aiadmkImg, axis: 'OPPOSITION' },
  { id: "BJP", name: "BJP", color: "#FF9933", image: bjpImg, axis: 'OPPOSITION' },
  { id: "PMK", name: "PMK", color: "#FFFF00", image: pmkImg, axis: 'OPPOSITION' },
  { id: "DMDK", name: "DMDK", color: "#FFD700", image: dmdkImg, axis: 'OPPOSITION' },
  { id: "AMMK", name: "AMMK", color: "#FF0000", image: ammkImg, axis: 'OPPOSITION' },
  { id: "TMCM", name: "TMC(M)", color: "#FF9933", image: tmcImg, axis: 'OPPOSITION' },
  { id: "PNK", name: "PNK", color: "#FF0000", image: pnkImg, axis: 'OPPOSITION' },
  { id: "PBK", name: "PBK", color: "#FF0000", image: pbkImg, axis: 'OPPOSITION' },
  { id: "IJK", name: "IJK", color: "#FF0000", image: ijkImg, axis: 'OPPOSITION' },

  // ALTERNATIVES & OTHERS
  { id: "TVK", name: "TVK", color: "#800000", image: tvkImg, axis: 'ALTERNATIVES' },
  { id: "NTK", name: "NTK", color: "#FFFF00", image: ntkImg, axis: 'ALTERNATIVES' },
  { id: "MNM", name: "MNM", color: "#FFFFFF", image: mnmImg, axis: 'ALTERNATIVES' },
  { id: "SDPI", name: "SDPI", color: "#008000", image: sdpiImg, axis: 'ALTERNATIVES' },
  { id: "AAP", name: "AAP", color: "#0000FF", image: aapImg, axis: 'ALTERNATIVES' },
  { id: "PT", name: "PT", color: "#FF0000", image: ptImg, axis: 'ALTERNATIVES' },
  { id: "TMMK", name: "TMMK", color: "#008000", image: tmmkImg, axis: 'ALTERNATIVES' },
  { id: "ATP", name: "ATP", color: "#FF0000", image: atpImg, axis: 'ALTERNATIVES' },
  { id: "INL", name: "INL", color: "#008000", image: inlImg, axis: 'ALTERNATIVES' },
  { id: "BSP", name: "BSP", color: "#0000FF", image: bspImg, axis: 'ALTERNATIVES' },
  { id: "AIFB", name: "AIFB", color: "#FF0000", image: aifbImg, axis: 'ALTERNATIVES' },
  { id: "NOTA", name: "NOTA", color: "#808080", image: notaImg, axis: 'ALTERNATIVES' }
];

