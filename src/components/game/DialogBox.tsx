import { motion, AnimatePresence } from 'framer-motion';
import { DialogLine, Choice, Challenge } from '@/types/game';
import { characters } from '@/data/characters';
import { useState, useEffect } from 'react';
import CaesarCipher from './CaesarCipher';
import FillInTheBlank from './FillInTheBlank';
import MultiSelectChallenge from './MultiSelectChallenge';
import  ScytaleCipher  from './ScytaleCipher';

interface DialogBoxProps {
  dialog: DialogLine;
  onNext: () => void;
  onChoice: (choice: Choice) => void;
  onChallengeComplete: (correct: boolean, challenge: Challenge) => void;
  characterId?: string;
  showResponse?: string | null;
}

const DialogBox = ({
  dialog,
  onNext,
  onChoice,
  onChallengeComplete,
  characterId,
  showResponse,
}: DialogBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const character = characterId
    ? characters.find(c => c.id === characterId)
    : null;

  const textToDisplay = showResponse || dialog.text;

  const renderChallenge = (challenge: Challenge) => {
    switch (challenge.type) {
      case 'caesar_cipher':
        return (
          <CaesarCipher
            challenge={challenge}
            onComplete={(correct) => onChallengeComplete(correct, challenge)}
          />
        );
      case 'fill_in_the_blank':
        return (
          <FillInTheBlank
            challenge={challenge}
            onComplete={(correct) => onChallengeComplete(correct, challenge)}
          />
        );
      case 'multi_select':
        return (
          <MultiSelectChallenge
            challenge={challenge}
            onComplete={(correct) => onChallengeComplete(correct, challenge)}
          />
        );
        case 'scytale':
        return (
          <ScytaleCipher
            challenge={challenge}
            onComplete={(correct) => onChallengeComplete(correct, challenge)}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (dialog.isChallenge && !showResponse) return;

    setDisplayedText('');
    setIsTyping(true);
    let index = 0;

    const timer = setInterval(() => {
      if (index < textToDisplay.length) {
        setDisplayedText(textToDisplay.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 30);

    return () => clearInterval(timer);
  }, [textToDisplay, dialog.isChallenge, showResponse]);

  const handleClick = () => {
    if (dialog.isChallenge && !showResponse) return;
    if (isTyping) {
      setDisplayedText(textToDisplay);
      setIsTyping(false);
    } else if (!dialog.isChoice || showResponse) {
      onNext();
    }
  };

  if (dialog.isChallenge && dialog.challenge && !showResponse) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4 text-center"
        >
          <p className="text-2xl font-bold text-white bg-black/30 p-4 rounded-lg">{dialog.text}</p>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="w-full flex justify-center"
        >
          {renderChallenge(dialog.challenge)}
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 z-50">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-4xl mx-auto relative"
      >
        {/* ================= Character Name ================= */}
        {character && !showResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="
              absolute -top-6 left-6 z-20
              px-6 py-2
              bg-gradient-to-r from-love-pink to-cyber-purple
              text-primary-foreground font-bold
              rounded-xl
              shadow-lg
              border border-love-pink/40
            "
          >
            {character.name}
          </motion.div>
        )}

        {/* ================= Choices (TOP) ================= */}
        <AnimatePresence>
          {dialog.isChoice && dialog.choices && !isTyping && !showResponse && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 space-y-3"
            >
              {dialog.choices.map((choice, index) => (
                <motion.button
                  key={choice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChoice(choice);
                  }}
                  className="
                    w-full
                    vn-choice-button
                    text-left
                    p-4
                    rounded-xl
                    text-foreground
                    hover:text-love-pink
                  "
                >
                  <span className="text-love-pink mr-3">♦</span>
                  {choice.text}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= Dialog Box ================= */}
        <div
          onClick={handleClick}
          className="
            vn-dialog-box
            rounded-2xl
            p-6 pt-8
            min-h-[120px]
            cursor-pointer
            relative
          "
        >
          <p className="text-lg md:text-xl leading-relaxed text-foreground">
            {displayedText}
            {isTyping && (
              <motion.span
                className="ml-1"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                ▌
              </motion.span>
            )}
          </p>

          {/* Continue indicator */}
          {!isTyping && !dialog.isChoice && (
            <motion.div
              className="absolute bottom-4 right-6 text-love-pink text-sm"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ▼ คลิกเพื่อไปต่อ
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DialogBox;