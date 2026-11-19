import { useMemo, useState } from 'react';
import Icon from '@/components/common/Icon';
import { sheetsByN, sheetsOfHsn } from '../../data/catalogueIndex';
import { parseQuery } from '../../utils/sheetSearch';
import SheetCard from '../SheetCard';
import SheetTable from '../SheetTable';
import SheetViewer from '../SheetViewer';
import styles from './SheetResults.module.css';

export default function SheetResults({
  results,
  query,
  view = 'grid',
  groupsById,
  images,
  compareIds,
  compareLimit,
  onToggleCompare,
  onViewChange,
  sortOptions,
  sort,
  onSortChange,
}) {
  // Family open in the viewer; ◀ ▶ there step through the families listed here
  const [viewing, setViewing] = useState(null);
  const parsedQuery = useMemo(() => parseQuery(query), [query]);
  const compareFull = compareIds.length >= compareLimit;
  const listed = results.map(({ sheet }) => sheet.n);

  return (
    <div className={styles.results}>
      {/* No heading: "Sort by" + "View as" at the top right, then the cards */}
      <div className={styles.headRow}>
        <div className={styles.controls}>
        {onSortChange && (
          <label className={styles.viewAs}>
            <span>Sort by</span>
            <span className={styles.viewSelect}>
              <Icon name="sort" size={15} className={styles.viewIcon} />
              <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon name="chevronDown" size={15} strokeWidth={2.8} className={styles.viewChevron} />
            </span>
          </label>
        )}

        {onViewChange && (
          <label className={styles.viewAs}>
            <span>View as</span>
            <span className={styles.viewSelect}>
              <Icon name={view === 'list' ? 'table' : 'grid'} size={15} className={styles.viewIcon} />
              <select value={view} onChange={(event) => onViewChange(event.target.value)}>
                <option value="grid">Grid</option>
                <option value="list">Table</option>
              </select>
              <Icon name="chevronDown" size={15} strokeWidth={2.8} className={styles.viewChevron} />
            </span>
          </label>
        )}
        </div>
      </div>

      {results.length === 0 ? (
        <div className={styles.empty}>
          <b>No product family found</b>
          Try a product name (chilli, ghee, tea), a family, or an HSN code (0904, 09101100).
        </div>
      ) : view === 'list' ? (
        <SheetTable
          results={results}
          query={parsedQuery}
          groupsById={groupsById}
          compareIds={compareIds}
          compareLimit={compareLimit}
          onToggleCompare={onToggleCompare}
          onOpen={setViewing}
        />
      ) : (
        <div className={styles.grid}>
          {results.map(({ sheet, hits }) => {
            const compared = compareIds.includes(sheet.n);
            return (
              <SheetCard
                key={sheet.n}
                sheet={sheet}
                group={groupsById[sheet.group]}
                image={images[sheet.n]}
                hits={hits}
                compared={compared}
                compareDisabled={!compared && compareFull}
                onToggleCompare={onToggleCompare}
                onOpen={setViewing}
              />
            );
          })}
        </div>
      )}

      {viewing && (
        <SheetViewer
          key={viewing}
          initialSheet={viewing}
          initialList={listed}
          sheetsByN={sheetsByN}
          sheetsOfHsn={sheetsOfHsn}
          groupsById={groupsById}
          compareIds={compareIds}
          compareLimit={compareLimit}
          onToggleCompare={onToggleCompare}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
