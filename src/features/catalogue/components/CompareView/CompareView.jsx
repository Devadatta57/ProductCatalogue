import { useState } from 'react';
import Icon from '@/components/common/Icon';
import SectionHeading from '@/components/common/SectionHeading';
import { sheetsByN, sheetsOfHsn } from '../../data/catalogueIndex';
import { sheetImages } from '../../data/sheetImages';
import SheetViewer from '../SheetViewer';
import styles from './CompareView.module.css';

/*
 * Compare tab: everything the FEED Export Catalogue Explorer shows for the
 * selected sheets (thumbnail, export vs import bars, side-by-side figures)
 * in one card, one row per sheet.
 */

const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmt = (value) => inr.format(value);

export default function CompareView({ compareIds, compareLimit, groupsById, onToggleCompare, onClear, onGoToSheets }) {
  // Sheet number open in the viewer
  const [viewing, setViewing] = useState(null);

  const sheets = compareIds.map((n) => sheetsByN[n]).filter(Boolean);
  const max = Math.max(...sheets.map((s) => Math.max(s.exp, s.imp)), 1);
  const barWidth = (value) => `${Math.max(0.6, (value / max) * 100)}%`;

  return (
    <section className={styles.page} aria-label="Compare product families">
      <SectionHeading
        icon="compare"
        title="Compare"
        tone="light"
        description={`Compare up to ${compareLimit} product families side by side`}
      />

      <p className={styles.info} aria-live="polite">
        Tick “Compare” on any product family card (up to {compareLimit}). Selected: <b>{sheets.length}</b>
      </p>

      {sheets.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>
            <Icon name="compare" size={26} strokeWidth={2.2} />
          </span>
          <b>Nothing selected yet</b>
          <p>
            Go to the Product Families tab and tick “Compare” on 2 to {compareLimit} families. They will appear here side by side
            with export, import and net values.
          </p>
          <button type="button" className={styles.primary} onClick={onGoToSheets}>
            Go to Product Families
            <Icon name="arrowRight" size={16} strokeWidth={2.4} />
          </button>
        </div>
      ) : (
        <div className={styles.box}>
          <div className={styles.boxHead}>
            <div>
              <h2>Selected product families</h2>
              <p className={styles.boxSub}>Export vs Import (₹ crore, FY 2025–26)</p>
            </div>
            <div className={styles.headActions}>
              <div className={styles.legend}>
                <span>
                  <i className={styles.legendExport} />
                  Export
                </span>
                <span>
                  <i className={styles.legendImport} />
                  Import
                </span>
              </div>
              <button type="button" className={styles.secondary} onClick={onClear}>
                Clear all
              </button>
            </div>
          </div>

          <div className={styles.grid} role="table" aria-label="Selected product families compared">
            <div className={styles.headRow} role="row">
              <span role="columnheader">Product family</span>
              <span role="columnheader">Group</span>
              <span role="columnheader" className={styles.center}>
                Products
              </span>
              <span role="columnheader">Export ₹ Cr</span>
              <span role="columnheader">Import ₹ Cr</span>
              <span role="columnheader" className={styles.num}>
                Net ₹ Cr
              </span>
              <span role="columnheader" className={styles.num}>
                Export share of imports
              </span>
              <span role="columnheader" className={styles.srOnly}>
                Remove
              </span>
            </div>

            {sheets.map((s) => {
              const group = groupsById[s.group];
              const net = s.exp - s.imp;
              return (
                <div key={s.n} className={styles.row} role="row" style={{ '--group-color': group?.color }}>
                  {/* Product family: image with its name underneath */}
                  <div className={styles.sheetCell} role="cell">
                    <button
                      type="button"
                      className={styles.thumb}
                      onClick={() => setViewing(s.n)}
                      title={`Open ${s.name}`}
                      aria-label={`Open ${s.name}`}
                    >
                      {sheetImages[s.n] ? <img src={sheetImages[s.n]} alt="" decoding="async" /> : null}
                    </button>
                    {/* Name is plain text; the thumbnail above opens the sheet */}
                    <span className={styles.nameText}>{s.name}</span>
                  </div>

                  {/* Group: its coloured icon + name */}
                  <div className={`${styles.groupCell} ${styles.groupArea}`} role="cell">
                    <span className={styles.mobileLabel}>Group</span>
                    <span className={styles.groupName}>
                      {group && (
                        <span className={styles.groupIcon} style={{ color: group.color }}>
                          <Icon name={group.icon} size={14} strokeWidth={2.3} />
                        </span>
                      )}
                      {group?.name}
                    </span>
                  </div>

                  <div className={`${styles.center} ${styles.figure} ${styles.productsArea}`} role="cell">
                    <span className={styles.mobileLabel}>Products</span>
                    {s.products.length}
                  </div>

                  {/* Export and Import each in their own column: value + bar */}
                  <div className={`${styles.money} ${styles.exportCell}`} role="cell">
                    <span className={styles.mobileLabel}>Export ₹ Cr</span>
                    <span className={styles.moneyValue}>₹{fmt(s.exp)}</span>
                    <span className={styles.track}>
                      <span className={styles.barExport} style={{ width: barWidth(s.exp) }} />
                    </span>
                  </div>

                  <div className={`${styles.money} ${styles.importCell}`} role="cell">
                    <span className={styles.mobileLabel}>Import ₹ Cr</span>
                    <span className={styles.moneyValue}>₹{fmt(s.imp)}</span>
                    <span className={styles.track}>
                      <span className={styles.barImport} style={{ width: barWidth(s.imp) }} />
                    </span>
                  </div>

                  <div className={`${styles.num} ${styles.figure} ${styles.netArea} ${net < 0 ? styles.negative : ''}`} role="cell">
                    <span className={styles.mobileLabel}>Net ₹ Cr</span>
                    {fmt(net)}
                  </div>

                  <div className={`${styles.num} ${styles.figure} ${styles.shareArea}`} role="cell">
                    <span className={styles.mobileLabel}>Export share of imports</span>
                    {s.imp > 0 ? `${(s.exp / s.imp).toFixed(2)}×` : 'no imports'}
                  </div>

                  <div role="cell" className={styles.removeCell}>
                    <button
                      type="button"
                      className={styles.remove}
                      onClick={() => onToggleCompare(s.n)}
                      title="Remove"
                      aria-label={`Remove ${s.name} from compare`}
                    >
                      <Icon name="close" size={14} strokeWidth={2.6} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {viewing && (
        <SheetViewer
          key={viewing}
          initialSheet={viewing}
          sheetsByN={sheetsByN}
          sheetsOfHsn={sheetsOfHsn}
          groupsById={groupsById}
          compareIds={compareIds}
          compareLimit={compareLimit}
          onToggleCompare={onToggleCompare}
          onClose={() => setViewing(null)}
        />
      )}
    </section>
  );
}
