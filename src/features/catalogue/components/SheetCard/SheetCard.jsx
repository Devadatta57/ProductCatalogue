import { formatRupees, sheetNumber } from '../../utils/formatters';
import Icon from '../../../../components/common/Icon/Icon';
import styles from './SheetCard.module.css';

const MAX_HITS_SHOWN = 3;

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
      <span className={styles.count}>{sheet.products.length} products</span>

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
          <span>Product family {number}: </span>
          {sheet.name}
        </h3>
        <p className={styles.meta}>
          {sheet.hs}
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
      </div>

      <div className={styles.info}>
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

        <div className={styles.statsWrap}>
          <dl className={styles.stats}>
            <div className={`${styles.stat} ${styles.statExport}`}>
              <dt>
                <Icon name="tradeExport" size="1em" className={styles.statIcon} />
                Export
              </dt>
              <dd className={styles.export}>{formatRupees(sheet.exp)}</dd>
            </div>
            <div className={`${styles.stat} ${styles.statImport}`}>
              <dt>
                <Icon name="tradeImport" size="1em" className={styles.statIcon} />
                Import
              </dt>
              <dd className={styles.import}>{formatRupees(sheet.imp)}</dd>
            </div>
            <div className={`${styles.stat} ${net < 0 ? styles.statImport : styles.statNet}`}>
              <dt>
                <Icon name="tradeNet" size="1em" className={styles.statIcon} />
                Net
              </dt>
              <dd className={net < 0 ? styles.import : styles.net}>{formatRupees(net)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
