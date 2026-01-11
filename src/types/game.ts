export type Stage = 'cryptography' | 'authentication' | 'authorization';
export type ChallengeType = 'caesar_cipher' | 'fill_in_the_blank' | 'multi_select';

export interface Character {
  id: string;
  name: string;
  stage: Stage;
  avatar: string;
  description: string;
  affection: number;
}

export interface DialogLine {
  character?: string;
  text: string;
  isChoice?: boolean;
  choices?: Choice[];
  isChallenge?: boolean;
  challenge?: Challenge;
}

export interface Choice {
  id: string;
  text: string;
  correct: boolean;
  response: string;
  affectionChange: number;
}

export interface Challenge {
  type: ChallengeType;
  encryptedText?: string; // Optional for non-cipher challenges
  correctAnswer: string;
  response: string;
  affectionChange: number;
  incorrectResponse: string;
  incorrectAffectionChange: number;
  hint?: string;
  options?: { id: string; text: string }[];
}

export interface GameState {
  currentStage: Stage;
  stagesCompleted: Stage[];
  affection: Record<string, number>;
  currentDialog: number;
}
