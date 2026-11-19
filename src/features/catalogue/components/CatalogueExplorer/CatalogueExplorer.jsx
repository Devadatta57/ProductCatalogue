import { useDeferredValue, useMemo, useState } from 'react';
import { useStickyBar } from '@/hooks/useStickyBar';
import { COMPARE_LIMIT, useCompare } from '../../hooks/useCompare';
import {
  catalogueTabs,
  catalogueTotals,
  productGroups,
  searchPlaceholder,
  sortOptions,
} from '../../data/catalogueExplorerContent';
import catalogueSheets from '../../data/catalogueSheets.json';
import { sheetImages } from '../../data/sheetImages';
import { compareSheets, matchSheet, parseQuery, sheetSearchText } from '../../utils/sheetSearch';
import CatalogueToolbar from '../CatalogueToolbar';
import CompareView from '../CompareView';
import GroupSidebar from '../GroupSidebar';
import ProductIndex from '../ProductIndex';
import SheetResults from '../SheetResults';
import styles from './CatalogueExplorer.module.css';

const groupsById = Object.fromEntries(productGroups.map((group) => [group.id, group]));

// Search text is built once per sheet, not on every keystroke
const indexedSheets = catalogueSheets.map((sheet) => ({
  sheet,
  text: sheetSearchText(sheet, groupsById[sheet.group].name),
}));

const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function CatalogueExplorer() {
  const [activeTab, setActiveTab] = useState('sheets');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(sortOptions[0].value);
  const [activeGroup, setActiveGroup] = useState('all');
  // Product Index tab: its own search box and group filter
  const [indexQuery, setIndexQuery] = useState('');
  const [indexGroup, setIndexGroup] = useState('all');
  const deferredIndexQuery = useDeferredValue(indexQuery);
  // Product families shown as cards ('grid') or as a table ('list')
  const [view, setView] = useState('grid');
  // Product families ticked for Compare (shared with the table page)
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const { containerRef, barRef, sentinelRef, stuck } = useStickyBar();

  // Typing stays snappy; the card list catches up a moment later
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => {
    const parsed = parseQuery(deferredQuery);
    const list = [];
    for (const { sheet, text } of indexedSheets) {
      if (activeGroup !== 'all' && sheet.group !== activeGroup) continue;
      const { ok, hits } = matchSheet(sheet, text, parsed);
      if (ok) list.push({ sheet, hits });
    }
    const byKey = compareSheets(sort);
    return list.sort((a, b) => byKey(a.sheet, b.sheet));
  }, [deferredQuery, activeGroup, sort]);

  // If the page is scrolled down into the cards, jump back to the first row
  const scrollToResults = () => {
    const section = containerRef.current;
    if (section && section.getBoundingClientRect().top < 0) {
      section.scrollIntoView({ block: 'start', behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  };

  const handleGroupChange = (groupId) => {
    setActiveGroup(groupId);
    scrollToResults();
  };

  const counts = { ...catalogueTotals, compare: compareIds.length };

  const handleTabChange = (tabId) => {
    // Tabs switched off in config/visibility.js stay on screen but don't navigate
    if (catalogueTabs.find((tab) => tab.id === tabId)?.enabled === false) return;
    setActiveTab(tabId);
    scrollToResults();
  };

  // "View as" Grid (cards) or Table, both right here on the home page
  const handleViewChange = (nextView) => {
    setView(nextView);
    scrollToResults();
  };

  const showCompare = activeTab === 'compare';
  const showProducts = activeTab === 'products';

  return (
    <section ref={containerRef} className={styles.explorer} aria-label="Browse the catalogue">
      <div ref={sentinelRef} aria-hidden="true" />

      {/* Toolbar + search stay pinned to the top while the page scrolls */}
      <div ref={barRef} className={styles.bar} data-stuck={stuck}>
        <CatalogueToolbar
          tabs={catalogueTabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={counts}
          query={query}
          onQueryChange={setQuery}
          onSearch={scrollToResults}
          placeholder={searchPlaceholder}
        />
      </div>

      {showProducts ? (
        <ProductIndex
          query={deferredIndexQuery}
          searchValue={indexQuery}
          onSearchChange={setIndexQuery}
          groups={productGroups}
          activeGroup={indexGroup}
          onGroupChange={setIndexGroup}
          compareIds={compareIds}
          compareLimit={COMPARE_LIMIT}
          onToggleCompare={toggleCompare}
        />
      ) : showCompare ? (
        <CompareView
          compareIds={compareIds}
          compareLimit={COMPARE_LIMIT}
          groupsById={groupsById}
          onToggleCompare={toggleCompare}
          onClear={clearCompare}
          onGoToSheets={() => handleTabChange('sheets')}
        />
      ) : (
        <div className={styles.body}>
          {/* Product groups: one block (5 × 2 tiles) above the family cards */}
          <div className={styles.groups}>
            <GroupSidebar
              groups={productGroups}
              totalSheets={catalogueTotals.sheets}
              activeGroup={activeGroup}
              onGroupChange={handleGroupChange}
            />
          </div>

          <SheetResults
            results={results}
            query={deferredQuery.trim()}
            view={view}
            groupsById={groupsById}
            images={sheetImages}
            compareIds={compareIds}
            compareLimit={COMPARE_LIMIT}
            onToggleCompare={toggleCompare}
            onViewChange={handleViewChange}
            sortOptions={sortOptions}
            sort={sort}
            onSortChange={setSort}
          />
        </div>
      )}
    </section>
  );
}
