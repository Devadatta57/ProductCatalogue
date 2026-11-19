import { CatalogueExplorer, CatalogueHero } from '@/features/catalogue';
import styles from './CataloguePage.module.css';

export default function CataloguePage() {
  return (
    <main className={styles.page}>
      <CatalogueHero />
      <CatalogueExplorer />
    </main>
  );
}
