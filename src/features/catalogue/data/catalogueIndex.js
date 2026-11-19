/*
 * Lookups built once from catalogueSheets.json, shared by the Product Index,
 * Compare and the sheet viewer.
 */
import catalogueSheets from './catalogueSheets.json';

/** sheet number → sheet */
export const sheetsByN = Object.fromEntries(catalogueSheets.map((sheet) => [sheet.n, sheet]));

/**
 * One entry per HSN code (as in the FEED Export Catalogue Explorer). A code
 * listed in two sheets is one entry with both sheet numbers.
 */
export const products = (() => {
  const byHsn = {};
  for (const sheet of catalogueSheets) {
    for (const p of sheet.products) {
      const row = (byHsn[p.hsn] ??= { hsn: p.hsn, name: p.name, type: p.type, exp: p.exp, imp: p.imp, sheets: [] });
      row.sheets.push(sheet.n);
    }
  }
  return Object.values(byHsn).map((row) => {
    // Main sheet (used for sorting) is never the pickles sheet
    const notPickles = row.sheets.filter((n) => sheetsByN[n].name !== 'Pickles & Chutneys');
    const main = row.sheets.length > 1 ? (notPickles[0] ?? row.sheets[0]) : row.sheets[0];
    return {
      ...row,
      net: +(row.exp - row.imp).toFixed(2),
      main,
      search: `${row.name} ${row.type} ${row.hsn} ${row.sheets.map((n) => sheetsByN[n].name).join(' ')}`.toLowerCase(),
    };
  });
})();

/** HSN code → every sheet it is listed in */
export const sheetsOfHsn = Object.fromEntries(products.map((p) => [p.hsn, p.sheets]));
