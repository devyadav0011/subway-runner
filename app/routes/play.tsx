import { useNavigate } from 'react-router';
import type { Route } from './+types/play';
import { useGameEngine } from '~/hooks/use-game-engine';
import { GameCanvas } from '~/components/game-canvas/game-canvas';
import { GameHud } from '~/components/game-hud/game-hud';
import { Countdown } from '~/components/countdown/countdown';
import { PauseOverlay } from '~/components/pause-overlay/pause-overlay';
import { GameOverModal } from '~/components/game-over-modal/game-over-modal';
import { MobileControls } from '~/components/mobile-controls/mobile-controls';
import styles from './play.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Play — Velocity Dash' },
    { name: 'description', content: 'Run, dodge, and collect your way to the top!' },
  ];
}

export default function Play() {
  const navigate = useNavigate();
  const engine = useGameEngine();

  const handleQuit = () => {
    engine.quitToMenu();
    navigate('/');
  };

  if (engine.gameState === 'menu') {
    engine.startGame();
  }

  return (
    <div className={styles.page}>
      <div className={styles.gameWrapper}>
        {/* HUD */}
        {(engine.gameState === 'playing' || engine.gameState === 'paused') && (
          <GameHud stats={engine.stats} onPause={engine.pauseGame} />
        )}

        {/* Main canvas */}
        <GameCanvas
          playerLane={engine.playerLane}
          playerAction={engine.playerAction}
          obstacles={engine.obstacles}
          collectibles={engine.collectibles}
          speed={engine.speed}
          onSwipeLeft={engine.moveLeft}
          onSwipeRight={engine.moveRight}
          onSwipeUp={engine.jump}
          onSwipeDown={engine.slide}
        />

        {/* Mobile controls */}
        {engine.gameState === 'playing' && (
          <MobileControls
            onLeft={engine.moveLeft}
            onRight={engine.moveRight}
            onJump={engine.jump}
            onSlide={engine.slide}
          />
        )}

        {/* Countdown overlay */}
        {engine.gameState === 'countdown' && (
          <Countdown count={engine.countdown} />
        )}

        {/* Pause overlay */}
        {engine.gameState === 'paused' && (
          <PauseOverlay
            onResume={engine.resumeGame}
            onRestart={engine.restartGame}
            onQuit={handleQuit}
          />
        )}

        {/* Game over modal */}
        {engine.gameState === 'gameover' && (
          <GameOverModal
            stats={engine.stats}
            onPlayAgain={engine.restartGame}
            onQuit={handleQuit}
          />
        )}
      </div>
    </div>
  );
}
