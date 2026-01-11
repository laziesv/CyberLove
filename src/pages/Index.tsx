import { useState , useEffect } from 'react';
import { Stage } from '@/types/game';
import TitleScreen from '@/components/game/TitleScreen';
import StageSelect from '@/components/game/StageSelect';
import GameStage from '@/components/game/GameStage';
import VictoryScreen from '@/components/game/VictoryScreen';

type GameScreen = 'title' | 'select' | 'playing' | 'victory';

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('title');
  const [currentStage, setCurrentStage] = useState<Stage>('cryptography');
  const [completedStages, setCompletedStages] = useState<Stage[]>([]);
  const [affection, setAffection] = useState<Record<string, number>>({
    cipher: 0,
    vera: 0,
    aria: 0,
  });

    useEffect(() => {
  fetch('/api/next-stage.json')
    .then(res => res.json())
    .then(data => {
      if (data.stage === 'authorization') {
        setCurrentStage('authorization');
        setScreen('playing');
      }
    })
    .catch(() => {});
}, []);

  const handleStart = () => {
    setScreen('select');
  };

  const handleSelectStage = (stage: Stage) => {
    setCurrentStage(stage);
    setScreen('playing');
  };

  const handleStageComplete = (finalAffection: number) => {
    const characterIds: Record<Stage, string> = {
      cryptography: 'cipher',
      authentication: 'vera',
      authorization: 'aria',
    };

    const charId = characterIds[currentStage];
    
    setAffection(prev => ({
      ...prev,
      [charId]: finalAffection,
    }));

    if (!completedStages.includes(currentStage)) {
      const newCompleted = [...completedStages, currentStage];
      setCompletedStages(newCompleted);

      // Check if all stages completed
      if (newCompleted.length === 3) {
        setScreen('victory');
      } else {
        setScreen('select');
      }
    } else {
      setScreen('select');
    }
  };

  const handleBack = () => {
    setScreen('select');
  };

  const handleRestart = () => {
    setCompletedStages([]);
    setAffection({
      cipher: 0,
      vera: 0,
      aria: 0,
    });
    setCurrentStage('cryptography');
    setScreen('title');
  };

  const getInitialAffection = (stage: Stage): number => {
    const characterIds: Record<Stage, string> = {
      cryptography: 'cipher',
      authentication: 'vera',
      authorization: 'aria',
    };
    return affection[characterIds[stage]] || 0;
  };

  return (
    <div className="min-h-screen bg-background">
      {screen === 'title' && <TitleScreen onStart={handleStart} />}
      {screen === 'select' && (
        <StageSelect
          completedStages={completedStages}
          currentStage={currentStage}
          onSelectStage={handleSelectStage}
          affection={affection}
        />
      )}
      {screen === 'playing' && (
        <GameStage
          stage={currentStage}
          affection={getInitialAffection(currentStage)}
          onComplete={handleStageComplete}
          onBack={handleBack}
        />
      )}
      {screen === 'victory' && (
        <VictoryScreen affection={affection} onRestart={handleRestart} />
      )}
    </div>
  );
};

export default Index;
