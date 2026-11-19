/*
 * Toolbar + product-group content, taken from the FEED Export Catalogue
 * Explorer (FY 2025-26, FEED KYJ product master list).
 */
import { ENABLE_COMPARE_TAB, ENABLE_PRODUCT_INDEX_TAB } from '../config/visibility';

export const catalogueTotals = {
  sheets: 56,
  products: 461, // unique HSN codes across all product families
};

/* All tabs always show; `enabled: false` means clicking it does nothing (see config/visibility.js) */
export const catalogueTabs = [
  { id: 'sheets', label: 'Product Families', icon: 'sheets', countKey: 'sheets', enabled: true },
  { id: 'products', label: 'Product Index', icon: 'productIndex', countKey: 'products', enabled: ENABLE_PRODUCT_INDEX_TAB },
  { id: 'compare', label: 'Compare', icon: 'compare', countKey: 'compare', enabled: ENABLE_COMPARE_TAB },
];

export const searchPlaceholder =
  'Search product, family or HSN code (e.g. chilli, 0904, 09101100, ghee)';

export const sortOptions = [
  { value: 'n', label: 'Family number' },
  { value: 'exp', label: 'Export: high → low' },
  { value: 'imp', label: 'Import: high → low' },
  { value: 'net', label: 'Net trade: high → low' },
  { value: 'netl', label: 'Net trade: low → high' },
  { value: 'cnt', label: 'Products: most first' },
  { value: 'name', label: 'Name: A → Z' },
];

/* `sheets` = product-family sheets in the group, `products` = unique HSN codes */
export const productGroups = [
  { id: '1', name: 'Seafood & Animal Products', icon: 'fish', color: '#1B9AAA', sheets: 3, products: 20 },
  { id: '2', name: 'Vegetables, Tubers & Pulses', icon: 'leaf', color: '#5BAA2C', sheets: 8, products: 57 },
  { id: '3', name: 'Fruits & Nuts', icon: 'apple', color: '#F08A24', sheets: 10, products: 81 },
  { id: '4', name: 'Spices', icon: 'chili', color: '#C73E3A', sheets: 11, products: 68 },
  { id: '5', name: 'Cereals & Flour Products', icon: 'wheat', color: '#B8921B', sheets: 5, products: 58 },
  { id: '6', name: 'Oilseeds & Edible Oils', icon: 'drop', color: '#8A6A12', sheets: 7, products: 42 },
  { id: '7', name: 'Plantation Crops', icon: 'sprout', color: '#7A4B2A', sheets: 4, products: 65 },
  { id: '8', name: 'Medicinal Plants, Gums, Extracts & Oils', icon: 'medical', color: '#2F7D6B', sheets: 5, products: 48 },
  { id: '9', name: 'Prepared Foods & Beverages', icon: 'cup', color: '#7A4EA3', sheets: 1, products: 4 },
  { id: '10', name: 'Seeds & Flowers', icon: 'flower', color: '#D1457F', sheets: 2, products: 19 },
];
