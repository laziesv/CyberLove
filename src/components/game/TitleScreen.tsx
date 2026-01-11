import { motion } from 'framer-motion';
import { Heart, Shield, Lock } from 'lucide-react';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen = ({ onStart }: TitleScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-love-pink rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        {/* Icons */}
        <motion.div
          className="flex justify-center gap-6 mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Lock className="w-12 h-12 text-cyber-blue" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="w-16 h-16 text-love-pink" />
          </motion.div>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-12 h-12 text-cyber-purple" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-4 text-gradient-love"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          CyberLove
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          เกมจีบสาว × เรียนรู้ Cybersecurity
        </motion.p>

        <motion.p
          className="text-sm text-muted-foreground mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          พิชิตใจสาวๆ ด้วยความรู้ด้านความปลอดภัย 💕
        </motion.p>

        {/* Start Button */}
        <motion.button
          onClick={onStart}
          className="px-12 py-4 bg-gradient-to-r from-love-pink to-cyber-purple text-primary-foreground rounded-full text-xl font-bold glow-pink hover:scale-105 transition-transform"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          💕 เริ่มเกม 💕
        </motion.button>

        {/* Stage preview */}
        <motion.div
          className="mt-10 flex justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          {[
            { name: 'Cryptography', icon: '🔐' },
            { name: 'Authentication', icon: '🔑' },
            { name: 'Authorization', icon: '👑' },
          ].map((stage, index) => (
            <motion.div
              key={stage.name}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
            >
              <div className="text-3xl mb-2">{stage.icon}</div>
              <div className="text-sm text-muted-foreground">{stage.name}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TitleScreen;
