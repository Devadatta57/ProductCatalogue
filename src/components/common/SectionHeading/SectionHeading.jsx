import Icon from '@/components/common/Icon';
import styles from './SectionHeading.module.css';

/**
 * Title for a section or page: icon, heading and a one-line description.
 * `as` picks the heading level (h1 on its own page, h2 inside the home page).
 * `tone="light"` is for dark backgrounds.
 */
export default function SectionHeading({ as: Tag = 'h2', icon, title, description, tone = 'dark', id }) {
  return (
    <div className={styles.heading} data-tone={tone}>
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          <Icon name={icon} size={20} strokeWidth={2.2} />
        </span>
      )}
      <div>
        <Tag id={id} className={styles.title}>
          {title}
        </Tag>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
}
