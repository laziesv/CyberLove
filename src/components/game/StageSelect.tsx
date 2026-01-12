import { motion } from 'framer-motion';
import { Lock, Unlock, Heart, ArrowRight } from 'lucide-react';
import { Stage } from '@/types/game';
import { characters } from '@/data/characters';

interface StageSelectProps {
  completedStages: Stage[];
  currentStage: Stage;
  onSelectStage: (stage: Stage) => void;
  affection: Record<string, number>;
  // DEV: Prop for skipping stages
  onStageSkip?: (stage: Stage) => void;
  // DEV: End of skip prop
}

const stages: { id: Stage; name: string; emoji: string; description: string }[] = [
  {
    id: 'cryptography',
    name: 'Cryptography',
    emoji: '🔐',
    description: 'เรียนรู้การเข้ารหัสกับซิฟเฟอร์',
  },
  {
    id: 'authentication',
    name: 'Authentication',
    emoji: '🔑',
    description: 'พิสูจน์ตัวตนกับวีร่า',
  },
  {
    id: 'authorization',
    name: 'Authorization',
    emoji: '👑',
    description: 'รับสิทธิ์จากอาเรีย',
  },
];

const StageSelect = ({ completedStages, onSelectStage, affection, onStageSkip }: StageSelectProps) => {
  const isStageUnlocked = (stage: Stage): boolean => {
  if (stage === 'authorization') return false; // fake lock

  const stageIndex = stages.findIndex(s => s.id === stage);
  if (stageIndex === 0) return true;

  const prevStage = stages[stageIndex - 1];
  return completedStages.includes(prevStage.id);
  };

  const isStageCompleted = (stage: Stage): boolean => {
    return completedStages.includes(stage);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.h2
        className="text-4xl font-bold text-gradient-love mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        เลือกด่าน
      </motion.h2>

      <motion.p
        className="text-muted-foreground mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        พิชิตใจสาวๆ ทีละคน ตามลำดับนะ 💕
      </motion.p>

      <div className="flex flex-col md:flex-row gap-6 max-w-4xl">
        {stages.map((stage, index) => {
          const character = characters.find(c => c.stage === stage.id);
          const unlocked = isStageUnlocked(stage.id);
          const completed = isStageCompleted(stage.id);
          const charAffection = character ? affection[character.id] || 0 : 0;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-6">
                  <ArrowRight className={`w-6 h-6 ${completed ? 'text-love-pink' : 'text-muted'}`} />
                </div>
              )}

              <motion.button
                onClick={() => unlocked && onSelectStage(stage.id)}
                disabled={!unlocked}
                className={`
                  relative w-64 p-6 rounded-2xl border-2 transition-all duration-300
                  ${unlocked
                    ? 'border-love-pink/50 hover:border-love-pink vn-choice-button cursor-pointer'
                    : 'border-muted/30 bg-muted/10 cursor-not-allowed opacity-60'
                  }
                  ${completed ? 'border-green-500/50' : ''}
                `}
                whileHover={unlocked ? { scale: 1.02 } : {}}
                whileTap={unlocked ? { scale: 0.98 } : {}}
              >
                {/* Lock/Unlock indicator */}
                <div className="absolute -top-3 -right-3">
                  {completed ? (
                    <motion.div
                      className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Heart className="w-4 h-4 text-white fill-white" />
                    </motion.div>
                  ) : unlocked ? (
                    <div className="w-8 h-8 bg-love-pink rounded-full flex items-center justify-center glow-pink">
                      <Unlock className="w-4 h-4 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Stage emoji */}
                <div className="text-5xl mb-4">{stage.emoji}</div>

                {/* Stage name */}
                <h3 className={`text-xl font-bold mb-2 ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {stage.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {stage.description}
                </p>

                {/* Character name */}
                {character && (
                  <div className={`text-sm ${unlocked ? 'text-love-pink' : 'text-muted-foreground'}`}>
                    {character.name}
                  </div>
                )}

                {/* Affection bar */}
                {completed && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>💕 Affection</span>
                      <span>{charAffection}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-love-pink to-heart-red"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(charAffection, 100)}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                )}
              </motion.button>
              
              {/* DEV: Skip button for testing */}
              {onStageSkip && unlocked && !completed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStageSkip(stage.id);
                  }}
                  className="absolute bottom-2 right-2 text-xs bg-muted/50 text-muted-foreground px-2 py-1 rounded hover:bg-muted"
                >
                  Skip
                </button>
              )}
              {/* DEV: End of skip button */}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StageSelect;