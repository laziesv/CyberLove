import { Character } from '@/types/game';
import cipherImg from '@/assets/characters/cipher.png';
import veraImg from '@/assets/characters/vera.png';
import ariaImg from '@/assets/characters/aria.png';

export const characters: Character[] = [
  {
    id: 'cipher',
    name: 'ไฮมิยะ มิโอะ (Haimiya Mio)',
    stage: 'cryptography',
    avatar: cipherImg,
    description: 'สาวลึกลับผู้หลงใหลในการเข้ารหัส ชอบเล่นปริศนาและซ่อนความลับไว้ในตัวอักษร',
    affection: 0,
  },
  {
    id: 'vera',
    name: 'ฮูเต๋า (Hutao)',
    stage: 'authentication',
    avatar: veraImg,
    description: 'ผู้พิทักษ์แห่งความจริง เธอจะไม่ยอมให้ใครผ่านถ้าพิสูจน์ตัวตนไม่ได้',
    affection: 0,
  },
  {
    id: 'aria',
    name: 'อาริสะ มิฮาอิลลอฟนา คุโจ (Arisa Mihailovna Kujo)',
    stage: 'authorization',
    avatar: ariaImg,
    description: 'ผู้กำหนดสิทธิ์แห่งราชอาณาจักร เธอจะตัดสินว่าคุณมีสิทธิ์ทำอะไรได้บ้าง',
    affection: 0,
  },
];

export const getCharacterByStage = (stage: string): Character | undefined => {
  return characters.find(c => c.stage === stage);
};
