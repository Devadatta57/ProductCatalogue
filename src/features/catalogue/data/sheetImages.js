/*
 * Sheet infographics: src/assets/images/sheets/sheet-NN.jpg (800px wide,
 * resized from the "products logo added" set). Vite turns each into a hashed URL.
 */
const files = import.meta.glob('/src/assets/images/sheets/sheet-*.jpg', {
  eager: true,
  import: 'default',
});

/** sheet number → image URL */
export const sheetImages = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [Number(path.match(/sheet-(\d+)\.jpg$/)[1]), url]),
);
