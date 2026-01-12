import { useState } from 'react';
import { Challenge } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface CaesarCipherProps {
  challenge: Challenge;
  onComplete: (correct: boolean) => void;
}

const CaesarCipher = ({ challenge, onComplete }: CaesarCipherProps) => {
  const [shift, setShift] = useState(1);

  const decrypt = (text: string, shift: number): string => {
    return text
      .split('')
      .map(char => {
        if (char >= 'A' && char <= 'Z') {
          return String.fromCharCode(((char.charCodeAt(0) - 65 - shift + 26) % 26) + 65);
        } else if (char >= 'a' && char <= 'z') {
          return String.fromCharCode(((char.charCodeAt(0) - 97 - shift + 26) % 26) + 97);
        }
        return char;
      })
      .join('');
  };

  const decryptedText = decrypt(challenge.encryptedText, shift);

  const handleSubmit = () => {
    onComplete(decryptedText === challenge.correctAnswer);
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-card/80 backdrop-blur-sm">
      <p className="mb-4 text-xl font-bold tracking-widest text-white">{challenge.encryptedText}</p>
      <div className="w-full max-w-sm p-4 my-4 border-2 border-dashed rounded-lg border-primary/50">
        <p className="text-2xl font-bold text-center text-primary tracking-widest">{decryptedText}</p>
      </div>
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-2 text-lg font-semibold text-white">
          <span>Shift: {shift}</span>
          <span>(1-25)</span>
        </div>
        <Slider
          min={1}
          max={25}
          step={1}
          value={[shift]}
          onValueChange={(value) => setShift(value[0])}
        />
      </div>
      <Button onClick={handleSubmit} className="mt-6 text-lg">
        ถอดรหัส
      </Button>
    </div>
  );
};

export default CaesarCipher;
