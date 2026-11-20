import { useState } from 'react';
import Icon from '@/components/common/Icon';
import { backToHome } from '@/hooks/useHashRoute';
import ProductIndex from '@/features/catalogue/components/ProductIndex';
import { productGroups } from '@/features/catalogue/data/catalogueExplorerContent';
import { useCompare } from '@/features/catalogue/hooks/useCompare';
import styles from './ProductIndexPage.module.css';

/*
 * Own page for the Product Index (461 HSN products), opened from the home
 * page's "Product Index" tab: a Back button and the index.
 */
export default function ProductIndexPage() {
  const [activeGroup, setActiveGroup] = useState('all');
  const { compareIds, toggleCompare, compareLimit } = useCompare();

  return (
    <main className={styles.page}>
      <button type="button" className={styles.back} onClick={backToHome}>
        <Icon name="chevronLeft" size={18} strokeWidth={2.6} />
        Back
      </button>

      <ProductIndex
        groups={productGroups}
        activeGroup={activeGroup}
        onGroupChange={setActiveGroup}
        compareIds={compareIds}
        compareLimit={compareLimit}
        onToggleCompare={toggleCompare}
      />
    </main>
  );
}
