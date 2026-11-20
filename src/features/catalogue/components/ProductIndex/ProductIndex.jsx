import { useMemo, useState } from 'react';
import Icon from '@/components/common/Icon';
import SectionHeading from '@/components/common/SectionHeading';
import { products, sheetsByN, sheetsOfHsn } from '../../data/catalogueIndex';
import { formatRupees, sheetNumber } from '../../utils/formatters';
import { parseQuery } from '../../utils/sheetSearch';
import Highlight from '../Highlight';
import SheetViewer from '../SheetViewer';
import styles from './ProductIndex.module.css';

/*
 * Product Index, built the same way as the FEED Export Catalogue Explorer:
 * one row per HSN code. A code listed in two sheets is still one row, with
 * both sheets linked in the "Catalogue sheet" cell.
 */
const typeOptions = [
  { value: 'all', label: 'All Types' },
  { value: 'Fresh / Raw', label: 'Fresh / Raw' },
  { value: 'Processed', label: 'Processed' },
  { value: 'Value-added', label: 'Value-added' },
  { value: 'Input', label: 'Input' },
];

const columns = [
  { id: 'hsn', label: 'HSN code' },
  { id: 'name', label: 'Product' },
  { id: 'type', label: 'Type' },
  { id: 'exp', label: 'Export ₹ Cr', numeric: true },
  { id: 'imp', label: 'Import ₹ Cr', numeric: true },
  { id: 'net', label: 'Net ₹ Cr', numeric: true, extra: 'netCol' },
  { id: 'sheet', label: 'Product family', extra: 'sheetCol' },
];

const comparators = {
  hsn: (a, b) => (a.hsn < b.hsn ? -1 : 1),
  name: (a, b) => a.name.localeCompare(b.name),
  type: (a, b) => a.type.localeCompare(b.type),
  sheet: (a, b) => a.main - b.main,
  exp: (a, b) => a.exp - b.exp,
  imp: (a, b) => a.imp - b.imp,
  net: (a, b) => a.net - b.net,
};

/* Phones / tablets: column headings are hidden there, so sorting moves into a dropdown */
const sortWords = { hsn: ['0 → 9', '9 → 0'], sheet: ['01 → 56', '56 → 01'] };
const sortChoices = columns.flatMap((col) => {
  const dir = col.numeric ? -1 : 1;
  const [first, second] = col.numeric ? ['high → low', 'low → high'] : (sortWords[col.id] ?? ['A → Z', 'Z → A']);
  return [
    { value: `${col.id}:${dir}`, label: `${col.label}: ${first}` },
    { value: `${col.id}:${-dir}`, label: `${col.label}: ${second}` },
  ];
});

const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const formatCr = (value) => inr.format(value);

function downloadCsv(rows) {
  const table = [
    ['HSN', 'Product', 'Type', 'Export_Rs_Cr_FY2025-26', 'Import_Rs_Cr_FY2025-26', 'Net_Rs_Cr', 'Product_families'],
    ...rows.map((p) => [
      p.hsn,
      p.name,
      p.type,
      p.exp,
      p.imp,
      p.net,
      p.sheets.map((n) => `${sheetNumber(n)} ${sheetsByN[n].name}`).join(' | '),
    ]),
  ];
  const csv = table.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  // BOM so Excel opens the file as UTF-8
  const blob = new Blob([String.fromCharCode(0xfeff) + csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'FEED_products_hsn_list.csv';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ProductIndex({
  query = '',
  groups,
  activeGroup,
  onGroupChange,
  compareIds = [],
  compareLimit = 6,
  onToggleCompare,
}) {
  const compareFull = compareIds.length >= compareLimit;
  const [type, setType] = useState('all');
  const [sortBy, setSortBy] = useState({ id: 'hsn', dir: 1 });
  // { n, hsn } of the sheet open in the viewer
  const [viewing, setViewing] = useState(null);

  const parsed = useMemo(() => parseQuery(query), [query]);
  const groupName = activeGroup === 'all' ? null : groups.find((g) => g.id === activeGroup)?.name;

  const rows = useMemo(() => {
    const list = products.filter((p) => {
      if (activeGroup !== 'all' && !p.sheets.some((n) => sheetsByN[n].group === activeGroup)) return false;
      if (type !== 'all' && p.type !== type) return false;
      if (!parsed) return true;
      if (parsed.hsn) return p.hsn.includes(parsed.hsn);
      return parsed.words.every((word) => p.search.includes(word));
    });
    const compare = comparators[sortBy.id];
    return list.sort((a, b) => compare(a, b) * sortBy.dir);
  }, [parsed, activeGroup, type, sortBy]);

  const totals = useMemo(
    () => rows.reduce((sum, p) => ({ exp: sum.exp + p.exp, imp: sum.imp + p.imp }), { exp: 0, imp: 0 }),
    [rows],
  );

  const handleSort = (id) => {
    setSortBy((prev) => {
      if (prev.id === id) return { id, dir: -prev.dir };
      // Numbers start high → low, everything else A → Z
      return { id, dir: columns.find((col) => col.id === id).numeric ? -1 : 1 };
    });
  };

  const trimmedQuery = query.trim();
  const groupsById = useMemo(() => Object.fromEntries(groups.map((g) => [g.id, g])), [groups]);

  return (
    <section className={styles.page} aria-label="Product index">
      <SectionHeading
        as="h1"
        icon="productIndex"
        title="Product Index"
        tone="light"
        description="Every HSN product in the catalogue with its export and import, ₹ crore, FY 2025–26"
      />

      <div className={styles.controls}>
        <label className={styles.typeLabel}>
          <span>Group:</span>
          <span className={styles.select}>
            <select value={activeGroup} onChange={(event) => onGroupChange(event.target.value)}>
              <option value="all">All groups</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} strokeWidth={2.6} className={styles.chevron} />
          </span>
        </label>

        <label className={styles.typeLabel}>
          <span>Type:</span>
          <span className={styles.select}>
            <select value={type} onChange={(event) => setType(event.target.value)}>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} strokeWidth={2.6} className={styles.chevron} />
          </span>
        </label>

        <label className={`${styles.typeLabel} ${styles.sortLabel}`}>
          <span>Sort:</span>
          <span className={styles.select}>
            <select
              value={`${sortBy.id}:${sortBy.dir}`}
              onChange={(event) => {
                const [id, dir] = event.target.value.split(':');
                setSortBy({ id, dir: Number(dir) });
              }}
            >
              {sortChoices.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon name="chevronDown" size={16} strokeWidth={2.6} className={styles.chevron} />
          </span>
        </label>

        <button type="button" className={styles.download} onClick={() => downloadCsv(rows)}>
          <Icon name="download" size={18} strokeWidth={2.4} />
          <span>Download this list (CSV)</span>
        </button>
      </div>

      <p className={styles.info} aria-live="polite">
        Showing <b>{rows.length}</b> of {products.length} HSN products
        {groupName && (
          <>
            {' '}
            in <b>{groupName}</b>
          </>
        )}
        {trimmedQuery && (
          <>
            {' '}
            matching “<b>{trimmedQuery}</b>”
          </>
        )}{' '}
        · export <b>{formatRupees(totals.exp)} Cr</b> · import <b>{formatRupees(totals.imp)} Cr</b>
      </p>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sortBy.id === col.id;
                return (
                  <th
                    key={col.id}
                    className={[col.numeric && styles.num, col.extra && styles[col.extra]].filter(Boolean).join(' ') || undefined}
                    aria-sort={active ? (sortBy.dir === 1 ? 'ascending' : 'descending') : 'none'}
                  >
                    <button type="button" className={styles.sortBtn} onClick={() => handleSort(col.id)}>
                      {col.label}
                      {active && <span className={styles.arrow}>{sortBy.dir === 1 ? '▲' : '▼'}</span>}
                    </button>
                  </th>
                );
              })}
              <th className={styles.compareCol}>Compare</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className={styles.empty}>
                  <b>No product found</b>
                  Try a different name or the first digits of an HSN code.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.hsn} data-compared={row.sheets.some((n) => compareIds.includes(n))}>
                  <td className={styles.hsn}>
                    <Highlight text={row.hsn} query={parsed} />
                  </td>
                  <td className={styles.product} title={row.name}>
                    <Highlight text={row.name} query={parsed} />
                  </td>
                  <td className={styles.typeCell}>
                    <span className={styles.type} data-type={row.type}>
                      {row.type}
                    </span>
                  </td>
                  {/* data-label: caption shown above each figure in the phone card layout */}
                  <td className={`${styles.num} ${styles.exp}`} data-label="Export ₹ Cr">
                    {formatCr(row.exp)}
                  </td>
                  <td className={`${styles.num} ${styles.imp}`} data-label="Import ₹ Cr">
                    {formatCr(row.imp)}
                  </td>
                  <td className={`${styles.num} ${styles.netCol}`} data-label="Net ₹ Cr">
                    <span className={styles.net} data-negative={row.net < 0}>
                      {formatCr(row.net)}
                    </span>
                  </td>
                  <td className={styles.sheetCol} data-label="Product family">
                    <span className={styles.sheets}>
                      {/* Only the eye icon opens the sheet; the name is plain text */}
                      {row.sheets.map((n) => (
                        <span key={n} className={styles.sheetRow}>
                          <button
                            type="button"
                            className={styles.viewIcon}
                            onClick={() => setViewing({ n, hsn: row.hsn })}
                            title={`View ${sheetsByN[n].name}`}
                            aria-label={`View ${sheetsByN[n].name}`}
                          >
                            <Icon name="eye" size={15} strokeWidth={2} />
                          </button>
                          <span className={styles.sheetName} title={`${sheetNumber(n)} ${sheetsByN[n].name}`}>
                            {sheetNumber(n)} {sheetsByN[n].name}
                          </span>
                        </span>
                      ))}
                    </span>
                  </td>
                  <td className={styles.compareCol} data-label="Compare">
                    {/* One tick per product family, lined up with the names beside it */}
                    <span className={styles.compareStack}>
                      {row.sheets.map((n) => {
                        const compared = compareIds.includes(n);
                        const disabled = !compared && compareFull;
                        return (
                          <span key={n} className={styles.compareCell}>
                            <input
                              type="checkbox"
                              className={styles.check}
                              checked={compared}
                              disabled={disabled}
                              onChange={() => onToggleCompare?.(n)}
                              title={disabled ? `Compare holds up to ${compareLimit} product families` : undefined}
                              aria-label={`Compare ${sheetNumber(n)} ${sheetsByN[n].name}`}
                            />
                          </span>
                        );
                      })}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {viewing && (
        <SheetViewer
          key={`${viewing.n}-${viewing.hsn}`}
          initialSheet={viewing.n}
          highlightHsn={viewing.hsn}
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
