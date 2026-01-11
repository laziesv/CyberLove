import { useState } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lightbulb } from 'lucide-react';

interface MultiSelectChallengeProps {
  challenge: Challenge;
  onComplete: (correct: boolean) => void;
}

const MultiSelectChallenge = ({ challenge, onComplete }: MultiSelectChallengeProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    const correctAnswers = challenge.correctAnswer.split('|').sort();
    const userAnswers = [...selectedIds].sort();

    const isCorrect =
      correctAnswers.length === userAnswers.length &&
      correctAnswers.every((value, index) => value === userAnswers[index]);

    onComplete(isCorrect);
  };

  const handleShowHint = () => {
    if (challenge.hint) {
      toast({
        title: 'คำใบ้ ✨',
        description: challenge.hint,
      });
    }
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-card/80 backdrop-blur-sm w-full max-w-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mb-6">
        {challenge.options?.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Label
              htmlFor={option.id}
              className={`
                flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer
                ${selectedIds.includes(option.id)
                  ? 'border-love-pink bg-love-pink/10'
                  : 'border-border hover:border-foreground/50'
                }
              `}
            >
              <Checkbox
                id={option.id}
                checked={selectedIds.includes(option.id)}
                onCheckedChange={() => handleSelect(option.id)}
                className="mr-3"
              />
              <span className="font-semibold">{option.text}</span>
            </Label>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} className="text-lg px-8">
          ยืนยัน
        </Button>
        {challenge.hint && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleShowHint}
            aria-label="แสดงคำใบ้"
          >
            <Lightbulb className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiSelectChallenge;
