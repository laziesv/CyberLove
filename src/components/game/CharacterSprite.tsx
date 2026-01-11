import { motion } from 'framer-motion';
import { Stage } from '@/types/game';
import cipherImg from '@/assets/characters/cipher.png';
import veraImg from '@/assets/characters/vera.png';
import ariaImg from '@/assets/characters/aria.png';

interface CharacterSpriteProps {
  stage: Stage;
  affection: number;
  emotion?: 'neutral' | 'happy' | 'sad' | 'surprised';
}

const characterImages: Record<Stage, string> = {
  cryptography: cipherImg,
  authentication: veraImg,
  authorization: ariaImg,
};

const characterColors: Record<Stage, string> = {
  cryptography: 'from-purple-500 to-blue-500',
  authentication: 'from-pink-500 to-rose-500',
  authorization: 'from-cyan-500 to-blue-500',
};

const CharacterSprite = ({ stage, affection, emotion = 'neutral' }: CharacterSpriteProps) => {
  const characterImg = characterImages[stage];

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Character container */}
        <div className="relative w-[1000px] h-[950px] flex items-center justify-center">
          {/* Character image */}
          <motion.img
            src={characterImg}
            alt="Character"
            className="w-full h-full object-contain drop-shadow-2xl"
            animate={emotion === 'happy' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5 }}
          />

          {/* Floating hearts when affection is high */}
          {affection > 30 && (
            <>
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ opacity: 0, y: 0, x: (i - 1) * 30 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-20, -60],
                    x: (i - 1) * 30 + Math.sin(i) * 10,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{ top: '20%' }}
                >
                  💕
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Affection indicator */}
        <motion.div
          className="fixed left-1/2 top-6 transform -translate-x-1/2 z-50 bg-card/80 backdrop-blur-sm px-4 py-1 rounded-full border border-love-pink/30"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-love-pink">💕 {affection}</span>
        </motion.div>

      </motion.div>
    </motion.div>
  );
};

export default CharacterSprite;
