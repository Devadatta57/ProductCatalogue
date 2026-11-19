import styles from './BrandLogo.module.css';

export default function BrandLogo({ name = 'FEED', tagline = 'FEED MSCS LTD.', href = '/' }) {
  return (
    <a href={href} className={styles.logo} aria-label={`${name} - ${tagline}`}>
      <svg className={styles.mark} viewBox="0 0 48 44" aria-hidden="true">
        <path d="M22.5 36C10 34 4.5 22 8.5 7c10.5 5 16 15.5 14 29z" fill="#3aa635" />
        <path d="M25.5 36c-2-13.5 3.5-24 14-29 4 15-1.5 27-14 29z" fill="#1d7f22" />
        <path d="M24 34.5V12" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
        <path d="M3 33c9 9.5 30 10 42-2-11 5-27 7-42 2z" fill="#f26a1b" />
      </svg>
      <span className={styles.text}>
        <span className={styles.name}>{name}</span>
        <span className={styles.tagline}>{tagline}</span>
      </span>
    </a>
  );
}
