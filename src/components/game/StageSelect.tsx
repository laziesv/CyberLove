import { motion } from 'framer-motion';
import { Lock, Unlock, Heart, ArrowRight, Lightbulb } from 'lucide-react';
import { Stage } from '@/types/game';
import { characters } from '@/data/characters';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface StageSelectProps {
  completedStages: Stage[];
  currentStage: Stage;
  onSelectStage: (stage: Stage) => void;
  affection: Record<string, number>;
  onStageSkip?: (stage: Stage) => void;
}

const stages: { id: Stage; name: string; emoji: string; description: string }[] = [
  { id: 'cryptography', name: 'Cryptography', emoji: '🔐', description: 'เรียนรู้การเข้ารหัสกับไฮมิยะ มิโอะ' },
  { id: 'authentication', name: 'Authentication', emoji: '🔑', description: 'พิสูจน์ตัวตนกับฮูเต๋า' },
  { id: 'authorization', name: 'Authorization', emoji: '👑', description: 'รับสิทธิ์จากอาเรียสะ มิฮาอิลลอฟนา คุโจ' },
];

// ตรวจสอบว่าด่านปลดล็อกหรือยัง
const isStageUnlocked = (stage: Stage, completedStages: Stage[]): boolean => {
  if (stage === 'cryptography') return true;
  if (stage === 'authentication') return completedStages.includes('cryptography');
  if (stage === 'authorization') return false; // Stage 3 ยังล็อก
  return false;
};

// ตรวจสอบว่าด่านสามารถแสดง hint ได้ไหม
const canShowHint = (stage: Stage, completedStages: Stage[]): boolean => {
  return stage === 'authorization' &&
         completedStages.includes('cryptography') &&
         completedStages.includes('authentication');
};

const StageSelect = ({ completedStages, onSelectStage, affection, onStageSkip }: StageSelectProps) => {
  const [hintVisible, setHintVisible] = useState(false);
  const isStageCompleted = (stage: Stage) => completedStages.includes(stage);

  const showGlobalHintButton = canShowHint('authorization', completedStages);
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  const handleShowHint = () => {
    setShowHint(true);
    toast({
      title: 'คำใบ้ ✨',
      description: 'บางครั้งข้อมูลสำคัญถูกเก็บไว้ในเบราว์เซอร์... ลองดูสิ่งที่หน้าเว็บจดจำให้คุณ',
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* ปุ่ม Hint แบบ Lightbulb */}
      {showGlobalHintButton && (
        <Button
          onClick={handleShowHint}
          variant="outline"
          size="icon"
          className="absolute top-6 right-6 z-50"
          aria-label="แสดง Hint"
        >
          <Lightbulb className="w-5 h-5" />
        </Button>
      )}

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
          const unlocked = isStageUnlocked(stage.id, completedStages);
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
                  ${unlocked ? 'border-love-pink/50 hover:border-love-pink vn-choice-button cursor-pointer'
                    : 'border-muted/30 bg-muted/10 cursor-not-allowed opacity-60'}
                  ${completed ? 'border-green-500/50' : ''}
                `}
                whileHover={unlocked ? { scale: 1.02 } : {}}
                whileTap={unlocked ? { scale: 0.98 } : {}}
              >
                <div className="absolute -top-3 -right-3">
                  {completed ? (
                    <motion.div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
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

                <div className="text-5xl mb-4">{stage.emoji}</div>
                <h3 className={`text-xl font-bold mb-2 ${unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {stage.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-1">{stage.description}</p>

                {character && (
                  <div className={`text-sm ${unlocked ? 'text-love-pink' : 'text-muted-foreground'}`}>
                    {character.name}
                  </div>
                )}

                {character && charAffection > 0 && (
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
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default StageSelect;
