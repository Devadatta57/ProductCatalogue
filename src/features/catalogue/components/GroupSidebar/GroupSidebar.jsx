import Icon from '@/components/common/Icon';
import styles from './GroupSidebar.module.css';

/*
 * Product groups as one rectangular block above the family cards:
 * an "All 10 groups" button and the 10 groups as
 * tiles, 5 per row. The number on each tile is how many families it holds.
 */
export default function GroupSidebar({ groups, totalSheets, activeGroup, onGroupChange }) {
  const allActive = activeGroup === 'all';

  return (
    <nav className={styles.panel} aria-label="Product groups">
      <div className={styles.head}>
        <button
          type="button"
          className={styles.all}
          aria-pressed={allActive}
          onClick={() => onGroupChange('all')}
          title={`${groups.length} groups · ${totalSheets} product families`}
        >
          <Icon name="allGroups" size={16} strokeWidth={2.2} />
          All {groups.length} groups
          <span className={styles.count}>{totalSheets}</span>
        </button>
      </div>

      <ul className={styles.grid}>
        {groups.map((group) => (
          <li key={group.id}>
            <button
              type="button"
              className={styles.tile}
              style={{ '--group-color': group.color }}
              aria-pressed={activeGroup === group.id}
              onClick={() => onGroupChange(group.id)}
              title={`${group.sheets} product families · ${group.products} products`}
            >
              <span className={styles.icon}>
                <Icon name={group.icon} size={18} strokeWidth={2.3} />
              </span>
              <span className={styles.label}>{group.name}</span>
              <span className={styles.count} aria-label={`${group.sheets} product families`}>
                {group.sheets}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
