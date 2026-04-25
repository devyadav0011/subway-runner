import type { Route } from './+types/home';
import { HeroSection } from '~/components/hero-section/hero-section';
import { InstructionsSection } from '~/components/instructions-section/instructions-section';
import { LeaderboardSection } from '~/components/leaderboard-section/leaderboard-section';
import { SettingsPanel } from '~/components/settings-panel/settings-panel';
import styles from './home.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Velocity Dash — Endless Runner' },
    { name: 'description', content: 'Dodge. Collect. Survive. How far can you go?' },
  ];
}

export default function Home() {
  return (
    <main className={styles.home}>
      <HeroSection />
      <InstructionsSection />
      <LeaderboardSection />
      <SettingsPanel />
    </main>
  );
}
