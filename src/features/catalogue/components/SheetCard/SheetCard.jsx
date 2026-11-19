import Icon from '@/components/common/Icon';
import { formatRupees, sheetNumber } from '../../utils/formatters';
import { SHOW_COMPARE_ON_CARDS, SHOW_PRODUCT_INDEX_LABEL } from '../../config/visibility';
import styles from './SheetCard.module.css';

const MAX_HITS_SHOWN = 3;

/* Show / hide switches live in config/visibility.js */
const SHOW_PRODUCT_INDEX = SHOW_PRODUCT_INDEX_LABEL;
const SHOW_COMPARE = SHOW_COMPARE_ON_CARDS;

export default function SheetCard({
  sheet,
  group,
  image,
  hits = [],
  compared,
  compareDisabled,
  onToggleCompare,
  onOpen,
}) {
  const net = sheet.exp - sheet.imp;
  const number = sheetNumber(sheet.n);
  const compareId = `compare-sheet-${sheet.n}`;

  return (
    <article className={styles.card} style={{ '--group-color': group.color }} aria-labelledby={`sheet-${sheet.n}-title`}>
      <header className={styles.head}>
        <div className={styles.groupRow}>
          <span className={styles.number} aria-hidden="true">
            {number}
          </span>
          <p className={styles.group}>
            Group {sheet.group} - {group.name}
          </p>
        </div>
        <h3 id={`sheet-${sheet.n}-title`} className={styles.title}>
          <span className={SHOW_PRODUCT_INDEX ? undefined : styles.srOnly}>Product family {number}: </span>
          {sheet.name}
        </h3>
        <p className={styles.meta}>
          {sheet.hs} · {sheet.products.length} products
        </p>
      </header>

      <div className={styles.panel}>
        <div className={styles.thumb}>
          {image ? (
            <img src={image} alt={`${sheet.name} infographic`} loading="lazy" decoding="async" />
          ) : (
            <span className={styles.noImage}>Image coming soon</span>
          )}
          {/* Whole image opens the full-screen viewer */}
          {onOpen && (
            <button
              type="button"
              className={styles.open}
              onClick={() => onOpen(sheet.n)}
              aria-label={`Open ${sheet.name}`}
              title={`Open ${sheet.name}`}
            />
          )}
        </div>

        <div className={styles.brandRow}>
          <span className={styles.brand}>
            <Icon name="globe" size={17} strokeWidth={2} className={styles.globe} />
            FEED MSCS LTD.
          </span>
        </div>
      </div>

      <div className={styles.info}>
        {SHOW_COMPARE && (
          <label
            className={styles.compare}
            htmlFor={compareId}
            title={compareDisabled ? 'Compare holds up to 6 product families' : undefined}
          >
            <input
              id={compareId}
              type="checkbox"
              checked={compared}
              disabled={compareDisabled}
              onChange={() => onToggleCompare(sheet.n)}
            />
            Compare
          </label>
        )}

        {hits.length > 0 && (
          <ul className={styles.hits} aria-label="Matching products">
            {hits.slice(0, MAX_HITS_SHOWN).map((product) => (
              <li key={product.hsn}>
                <code>{product.hsn}</code> {product.name}
              </li>
            ))}
            {hits.length > MAX_HITS_SHOWN && <li>+{hits.length - MAX_HITS_SHOWN} more in this family</li>}
          </ul>
        )}

        <dl className={styles.stats}>
          <div className={styles.stat}>
            <dt>Export</dt>
            <dd className={styles.export}>{formatRupees(sheet.exp)}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Import</dt>
            <dd className={styles.import}>{formatRupees(sheet.imp)}</dd>
          </div>
          <div className={styles.stat}>
            <dt>Net</dt>
            <dd className={net < 0 ? styles.import : styles.net}>{formatRupees(net)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
