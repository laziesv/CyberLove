import { useState , useEffect } from 'react';
import { useState , useEffect } from 'react';
import { Stage } from '@/types/game';
import TitleScreen from '@/components/game/TitleScreen';
import StageSelect from '@/components/game/StageSelect';
import GameStage from '@/components/game/GameStage';
import VictoryScreen from '@/components/game/VictoryScreen';
import { dialogs } from '@/data/dialogs';
import { dialogs } from '@/data/dialogs';

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
  const [stageCompletionCount, setStageCompletionCount] = useState<Record<Stage, number>>({
    cryptography: 0,
    authentication: 0,
    authorization: 0,
  });

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const auth = sessionStorage.getItem('auth_hint');

  if (!params.has('next-stage')) return;
  if (auth !== 'verified') return;

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

useEffect(() => {
  const saved = sessionStorage.getItem('ctf-progress');
  if (saved) {
    const data = JSON.parse(saved);
    setCompletedStages(data.completedStages || []);
    setAffection(data.affection || {});
    setStageCompletionCount(data.stageCompletionCount || {});
  }
}, []);

useEffect(() => {
  sessionStorage.setItem(
    'ctf-progress',
    JSON.stringify({
      completedStages,
      affection,
      stageCompletionCount,
    })
  );
}, [completedStages, affection, stageCompletionCount]);

useEffect(() => {
  fetch('/?next-stage', { cache: 'no-store' }).catch(() => {});
}, []);

useEffect(() => {
  sessionStorage.setItem('To continue', '/?next-stage');
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
    
    // Increment completion count for the current stage
    setStageCompletionCount(prev => ({
      ...prev,
      [currentStage]: (prev[currentStage] || 0) + 1,
    }));
    
    // Increment completion count for the current stage
    setStageCompletionCount(prev => ({
      ...prev,
      [currentStage]: (prev[currentStage] || 0) + 1,
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

  // DEV: Function to skip stages for testing
  const handleStageSkip = (stageToSkip: Stage) => {
    const characterIds: Record<Stage, string> = {
      cryptography: 'cipher',
      authentication: 'vera',
      authorization: 'aria',
    };

    const charId = characterIds[stageToSkip];
    
    // Set max affection for skipped stage
    setAffection(prev => ({
      ...prev,
      [charId]: 100,
    }));
    
    // Increment completion count
    setStageCompletionCount(prev => ({
      ...prev,
      [stageToSkip]: (prev[stageToSkip] || 0) + 1,
    }));

    if (!completedStages.includes(stageToSkip)) {
      const newCompleted = [...completedStages, stageToSkip];
      setCompletedStages(newCompleted);

      if (newCompleted.length === 3) {
        setScreen('victory');
      }
    }
  };
  // DEV: End of skip function

  // DEV: Function to skip stages for testing
  const handleStageSkip = (stageToSkip: Stage) => {
    const characterIds: Record<Stage, string> = {
      cryptography: 'cipher',
      authentication: 'vera',
      authorization: 'aria',
    };

    const charId = characterIds[stageToSkip];
    
    // Set max affection for skipped stage
    setAffection(prev => ({
      ...prev,
      [charId]: 100,
    }));
    
    // Increment completion count
    setStageCompletionCount(prev => ({
      ...prev,
      [stageToSkip]: (prev[stageToSkip] || 0) + 1,
    }));

    if (!completedStages.includes(stageToSkip)) {
      const newCompleted = [...completedStages, stageToSkip];
      setCompletedStages(newCompleted);

      if (newCompleted.length === 3) {
        setScreen('victory');
      }
    }
  };
  // DEV: End of skip function

  const handleRestart = () => {
    sessionStorage.removeItem('ctf-progress');
    setCompletedStages([]);
    setAffection({
      cipher: 0,
      vera: 0,
      aria: 0,
    });
    setStageCompletionCount({
      cryptography: 0,
      authentication: 0,
      authorization: 0,
    });
    setStageCompletionCount({
      cryptography: 0,
      authentication: 0,
      authorization: 0,
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

  const getStageLevel = (stage: Stage): number => {
    const count = stageCompletionCount[stage] || 0;
    const numberOfLevels = dialogs[stage]?.length || 1;
    // Loop through available dialog levels. If a stage is not yet completed, `count` will be 0.
    // After first completion, count becomes 1, so we play level 1.
    return count % numberOfLevels;
  }

  const getStageLevel = (stage: Stage): number => {
    const count = stageCompletionCount[stage] || 0;
    const numberOfLevels = dialogs[stage]?.length || 1;
    // Loop through available dialog levels. If a stage is not yet completed, `count` will be 0.
    // After first completion, count becomes 1, so we play level 1.
    return count % numberOfLevels;
  }

  return (
    <div className="min-h-screen bg-background">
      {screen === 'title' && <TitleScreen onStart={handleStart} />}
      {screen === 'select' && (
        <StageSelect
          completedStages={completedStages}
          currentStage={currentStage}
          onSelectStage={handleSelectStage}
          affection={affection}
          // DEV: Prop for skipping stages
          onStageSkip={handleStageSkip}
          // DEV: End of skip prop
          // DEV: Prop for skipping stages
          onStageSkip={handleStageSkip}
          // DEV: End of skip prop
        />
      )}
      {screen === 'playing' && (
        <GameStage
          stage={currentStage}
          stageLevel={getStageLevel(currentStage)}
          stageLevel={getStageLevel(currentStage)}
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
