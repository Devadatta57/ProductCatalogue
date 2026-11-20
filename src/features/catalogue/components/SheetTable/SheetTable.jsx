import Icon from '@/components/common/Icon';
import { sheetNumber } from '../../utils/formatters';
import Highlight from '../Highlight';
import styles from './SheetTable.module.css';

/*
 * Table layout of the Product Families tab (the "Table" view of the FEED
 * Export Catalogue Explorer): one row per family with its figures, a mini
 * export vs import bar and a Compare tick.
 */

const MAX_HITS_SHOWN = 3;
const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = (value) => inr.format(value);

export default function SheetTable({ results, query, groupsById, compareIds, compareLimit, onToggleCompare, onOpen }) {
  const compareFull = compareIds.length >= compareLimit;

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Product family</th>
            <th>Group</th>
            <th>HS</th>
            <th className={styles.num}>Products</th>
            <th className={`${styles.num} ${styles.exportHead}`}>Export ₹ Cr</th>
            <th className={`${styles.num} ${styles.importHead}`}>Import ₹ Cr</th>
            <th className={styles.num}>Net ₹ Cr</th>
            <th>
              Export vs Import
              {/* Colour key for the bars */}
              <span className={styles.legend}>
                <span>
                  <i className={styles.barExport} />
                  Export
                </span>
                <span>
                  <i className={styles.barImport} />
                  Import
                </span>
              </span>
            </th>
            <th className={styles.center}>Compare</th>
          </tr>
        </thead>
        <tbody>
          {results.map(({ sheet, hits }) => {
            const group = groupsById[sheet.group];
            const net = sheet.exp - sheet.imp;
            const max = Math.max(sheet.exp, sheet.imp, 1);
            const compared = compareIds.includes(sheet.n);
            const disabled = !compared && compareFull;
            return (
              <tr key={sheet.n} data-compared={compared}>
                <td className={styles.number}>{sheetNumber(sheet.n)}</td>
                <td className={styles.name}>
                  {/* Only the eye icon opens the viewer; the name is plain text */}
                  <span className={styles.nameRow}>
                    <button
                      type="button"
                      className={styles.viewIcon}
                      onClick={() => onOpen(sheet.n)}
                      title={`View ${sheet.name}`}
                      aria-label={`View ${sheet.name}`}
                    >
                      <Icon name="eye" size={16} strokeWidth={2} />
                    </button>
                    <span className={styles.nameText}>
                      <Highlight text={sheet.name} query={query} />
                    </span>
                  </span>
                  {hits.length > 0 && (
                    <p className={styles.hits}>
                      {hits.slice(0, MAX_HITS_SHOWN).map((p, i) => (
                        <span key={p.hsn}>
                          {i > 0 && ' · '}
                          <code>
                            <Highlight text={p.hsn} query={query} />
                          </code>{' '}
                          <Highlight text={p.name} query={query} />
                        </span>
                      ))}
                      {hits.length > MAX_HITS_SHOWN && ` +${hits.length - MAX_HITS_SHOWN} more`}
                    </p>
                  )}
                </td>
                <td>
                  <span className={styles.group}>
                    {group && (
                      <span className={styles.groupIcon} style={{ color: group.color }}>
                        <Icon name={group.icon} size={13} strokeWidth={2.3} />
                      </span>
                    )}
                    {group?.name}
                  </span>
                </td>
                <td className={styles.hs}>{sheet.hs}</td>
                <td className={styles.num}>{sheet.products.length}</td>
                <td className={`${styles.num} ${styles.exportValue}`}>{fmt(sheet.exp)}</td>
                <td className={`${styles.num} ${styles.importValue}`}>{fmt(sheet.imp)}</td>
                <td className={`${styles.num} ${net < 0 ? styles.negative : ''}`}>{fmt(net)}</td>
                <td>
                  <span className={styles.bars} aria-hidden="true">
                    <span className={styles.barExport} style={{ width: `${(sheet.exp / max) * 100}%` }} />
                    <span className={styles.barImport} style={{ width: `${(sheet.imp / max) * 100}%` }} />
                  </span>
                </td>
                <td className={styles.center}>
                  <input
                    type="checkbox"
                    className={styles.check}
                    checked={compared}
                    disabled={disabled}
                    onChange={() => onToggleCompare(sheet.n)}
                    title={disabled ? `Compare holds up to ${compareLimit} product families` : undefined}
                    aria-label={`Compare ${sheet.name}`}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
