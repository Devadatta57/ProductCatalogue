import { catalogueHeroContent } from '../../data/catalogueHeroContent';
import styles from './CatalogueHero.module.css';

export default function CatalogueHero({ content = catalogueHeroContent }) {
  const { titleLines, titleHighlight, description, stats = [], image } = content;

  return (
    <section className={styles.hero} aria-labelledby="catalogue-hero-title">
      <svg className={styles.wave} viewBox="0 0 1440 220" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 120C240 60 470 70 720 120s520 90 720 20V220H0z" fill="#e6f3e0" opacity="0.7" />
        <path d="M0 160c260-50 520-30 760 20s470 40 680-10V220H0z" fill="#ddefd5" opacity="0.6" />
      </svg>

      <img src={image.src} alt={image.alt} className={styles.visual} />

      <div className={styles.content}>
        <h1 id="catalogue-hero-title" className={styles.title}>
          {titleLines.map((line) => (
            <span key={line} className={styles.line}>
              {line}
            </span>
          ))}
          <span className={`${styles.line} ${styles.highlight}`}>{titleHighlight}</span>
        </h1>

        <p className={styles.description}>{description}</p>

        {stats.length > 0 && (
          <dl className={styles.stats}>
            {stats.map(({ value, label, wide }) => (
              <div key={label} className={`${styles.stat} ${wide ? styles.statWide : ''}`}>
                <dt className={styles.statLabel}>{label}</dt>
                <dd className={styles.statValue}>{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
