import Icon from '@/components/common/Icon';
import styles from './CatalogueToolbar.module.css';

export default function CatalogueToolbar({
  tabs,
  activeTab,
  onTabChange,
  counts,
  query,
  onQueryChange,
  onSearch,
  placeholder,
}) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(query.trim());
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.tabs} role="group" aria-label="Catalogue sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={styles.pill}
            aria-pressed={activeTab === tab.id}
            onClick={() => onTabChange(tab.id)}
          >
            <Icon name={tab.icon} size={17} />
            <span>{tab.label}</span>
            <span className={styles.badge}>{counts[tab.countKey] ?? 0}</span>
          </button>
        ))}
      </div>

      {/* Full-width row under the buttons, right above the group list */}
      <form className={styles.search} role="search" onSubmit={handleSubmit}>
        <Icon name="search" size={19} strokeWidth={2.4} className={styles.searchIcon} />
        <input
          type="search"
          className={styles.searchInput}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={placeholder}
          aria-label="Search product, family or HSN code"
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className={styles.send} aria-label="Search">
          <Icon name="arrowRight" size={17} strokeWidth={2.6} />
        </button>
      </form>
    </div>
  );
}
