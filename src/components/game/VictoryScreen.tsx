import { motion } from 'framer-motion';
import { Heart, Trophy, Star, RefreshCw } from 'lucide-react';
import { characters } from '@/data/characters';

interface VictoryScreenProps {
  affection: Record<string, number>;
  onRestart: () => void;
}

const VictoryScreen = ({ affection, onRestart }: VictoryScreenProps) => {
  const totalAffection = Object.values(affection).reduce((sum, val) => sum + val, 0);
  const averageAffection = Math.round(totalAffection / characters.length);

  const getRank = () => {
    if (averageAffection >= 80) return { rank: 'S', title: 'Security Master! 💖', color: 'text-amber-400' };
    if (averageAffection >= 60) return { rank: 'A', title: 'เก่งมาก!', color: 'text-love-pink' };
    if (averageAffection >= 40) return { rank: 'B', title: 'ดีเลย!', color: 'text-cyber-blue' };
    return { rank: 'C', title: 'ลองใหม่นะ~', color: 'text-muted-foreground' };
  };

  const { rank, title, color } = getRank();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Celebration particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: '50%',
              y: '50%',
              scale: 0,
            }}
            animate={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: [0, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {['💕', '⭐', '✨', '🎉', '💖'][Math.floor(Math.random() * 5)]}
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center z-10"
      >
        {/* Trophy */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="mb-8"
        >
          <Trophy className="w-24 h-24 text-amber-400 mx-auto" />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-gradient-love mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          ยินดีด้วย! 🎉
        </motion.h1>

        <motion.p
          className="text-xl text-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          คุณพิชิตทุกด่านแล้ว!
        </motion.p>

        {/* Rank */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <div className={`text-8xl font-bold ${color} mb-2`}>{rank}</div>
          <div className="text-xl text-muted-foreground">{title}</div>
        </motion.div>

        {/* Character affection summary */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          {characters.map((char, index) => (
            <motion.div
              key={char.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border"
            >
              <div className="text-3xl mb-2">
                {char.stage === 'cryptography' ? '👩‍💻' : char.stage === 'authentication' ? '👮‍♀️' : '👸'}
              </div>
              <div className="text-sm font-medium text-foreground mb-2">{char.name}</div>
              <div className="flex items-center justify-center gap-1">
                <Heart className="w-4 h-4 text-love-pink fill-love-pink" />
                <span className="text-love-pink font-bold">{affection[char.id] || 0}%</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Total score */}
        <motion.div
          className="mb-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
          <span className="text-2xl font-bold text-foreground">
            รวม: {totalAffection} คะแนน
          </span>
        </motion.div>

        {/* Restart button */}
        <motion.button
          onClick={onRestart}
          className="px-8 py-4 bg-gradient-to-r from-love-pink to-cyber-purple text-primary-foreground rounded-full text-lg font-bold glow-pink hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" />
          เล่นอีกครั้ง
        </motion.button>
      </motion.div>
    </div>
  );
};

export default VictoryScreen;
