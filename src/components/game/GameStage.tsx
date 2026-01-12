import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stage, Choice, Challenge } from '@/types/game';
import { dialogs } from '@/data/dialogs';
import { characters } from '@/data/characters';
import DialogBox from './DialogBox';
import CharacterSprite from './CharacterSprite';
import { ArrowLeft } from 'lucide-react';

// **Import รูปภาพโดยตรง**
import cryptographyBg from '@/assets/background/cryptography.png';
import authenticationBg from '@/assets/background/authentication.jpg';
import authorizationBg from '@/assets/background/authorization.jpg';


interface GameStageProps {
  stage: Stage;
  stageLevel: number;
  affection: number;
  onComplete: (finalAffection: number) => void;
  onBack: () => void;
}

// ใช้ import ของรูปภาพ
const stageBackgrounds: Record<Stage, string> = {
  cryptography: cryptographyBg,
  authentication: authenticationBg,
  authorization: authorizationBg,
};


const GameStage = ({ stage, stageLevel, affection: initialAffection, onComplete, onBack }: GameStageProps) => {
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [affection, setAffection] = useState(initialAffection);
  const [showResponse, setShowResponse] = useState<string | null>(null);
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'sad'>('neutral');
  const [challengeFailed, setChallengeFailed] = useState(false);

  // Select the dialog set based on the stageLevel
  const dialogSet = dialogs[stage];
  const stageDialogs = dialogSet[stageLevel] || dialogSet[0]; // Fallback to level 0

  const currentDialog = stageDialogs[currentDialogIndex];
  const character = characters.find(c => c.stage === stage);

  useEffect(() => {
    // Reset when stage changes
    setCurrentDialogIndex(0);
    setAffection(initialAffection);
    setShowResponse(null);
    setEmotion('neutral');
    setChallengeFailed(false);
  }, [stage, initialAffection, stageLevel]);

  const handleNext = () => {
    if (showResponse) {
      setShowResponse(null);
      setEmotion('neutral');

      if (challengeFailed) {
        setChallengeFailed(false);
        // Do not advance, stay on the same challenge
        return;
      }
    }

    if (currentDialogIndex < stageDialogs.length - 1) {
      setCurrentDialogIndex(prev => prev + 1);
    } else {
      // Stage complete
      onComplete(affection);
    }
  };

  const handleChoice = (choice: Choice) => {
    const newAffection = Math.max(0, affection + choice.affectionChange);
    setAffection(newAffection);
    setShowResponse(choice.response);
    setEmotion(choice.correct ? 'happy' : 'sad');
  };

  const handleChallengeComplete = (correct: boolean, challenge: Challenge) => {
    const affectionChange = correct ? challenge.affectionChange : challenge.incorrectAffectionChange;
    const response = correct ? challenge.response : challenge.incorrectResponse;

    const newAffection = Math.max(0, affection + affectionChange);
    setAffection(newAffection);
    setShowResponse(response);
    setEmotion(correct ? 'happy' : 'sad');
    if (!correct) {
      setChallengeFailed(true);
    }
  };

  if (!currentDialog || !character) return null;

  return (
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${stageBackgrounds[stage]})` }} // <-- ใช้รูปที่ import
    >
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        onPointerDownCapture={(e) => e.stopPropagation()}
        className="absolute top-6 left-6 z-[9999] pointer-events-auto flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border hover:border-love-pink transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>กลับ</span>
      </motion.button>

      {/* Stage indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 right-6 z-50 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-full border border-border"
      >
        <span className="text-sm text-muted-foreground">
          {stage.charAt(0).toUpperCase() + stage.slice(1)}
        </span>
      </motion.div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
        <motion.div
          className="h-full bg-gradient-to-r from-love-pink to-cyber-purple"
          initial={{ width: 0 }}
          animate={{ width: `${((currentDialogIndex + 1) / stageDialogs.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-love-pink/30 rounded-full"
            initial={{
              x: Math.random() * 100 + '%',
              y: Math.random() * 100 + '%',
            }}
            animate={{
              y: [null, '-20%'],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* Character */}
      <CharacterSprite stage={stage} affection={affection} emotion={emotion} />

      {/* Dialog */}
      <DialogBox
        dialog={currentDialog}
        onNext={handleNext}
        onChoice={handleChoice}
        onChallengeComplete={handleChallengeComplete}
        characterId={currentDialog.character}
        showResponse={showResponse}
      />
    </div>
  );
};

export default GameStage;
