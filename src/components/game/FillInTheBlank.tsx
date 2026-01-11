import { useState } from 'react';
import { motion } from 'framer-motion';
import { Challenge } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Lightbulb } from 'lucide-react';

interface FillInTheBlankProps {
  challenge: Challenge;
  onComplete: (correct: boolean) => void;
}

const FillInTheBlank = ({ challenge, onComplete }: FillInTheBlankProps) => {
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    const correctAnswers = challenge.correctAnswer.split('|').map(a => a.trim().toLowerCase());
    const userAnswer = answer.trim().toLowerCase();

    if (correctAnswers.includes(userAnswer)) {
      onComplete(true);
    } else {
      onComplete(false);
    }
  };

  const handleShowHint = () => {
    setShowHint(true);
    toast({
      title: 'คำใบ้ ✨',
      description: challenge.hint,
    });
  };

  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-card/80 backdrop-blur-sm w-full max-w-lg">
      <div className="w-full">
        <Input
          type="text"
          placeholder="พิมพ์คำตอบของคุณที่นี่..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          className="text-center text-lg h-12"
        />
      </div>
      <div className="flex items-center gap-4 mt-4">
        <Button onClick={handleSubmit} className="text-lg px-8">
          ส่งคำตอบ
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

export default FillInTheBlank;
