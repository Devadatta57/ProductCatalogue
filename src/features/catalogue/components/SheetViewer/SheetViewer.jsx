import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/common/Icon';
import { SHOW_COMPARE_IN_VIEWER } from '../../config/visibility';
import { sheetImages } from '../../data/sheetImages';
import { formatRupees, sheetNumber } from '../../utils/formatters';
import styles from './SheetViewer.module.css';

/*
 * Full-screen sheet viewer (same content as the FEED Export Catalogue
 * Explorer's viewer): zoomable sheet image + a products panel with the
 * sheet's totals, an overlap note, a filter and the full HSN table.
 */

const MAX_ZOOM = 8;
const inr = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const fileName = (sheet) => `FEED_Product_Family_${sheetNumber(sheet.n)}_${sheet.name.replace(/[^A-Za-z0-9]+/g, '_')}.jpg`;

export default function SheetViewer({
  initialSheet,
  initialList,
  highlightHsn,
  sheetsByN,
  sheetsOfHsn,
  groupsById,
  compareIds = [],
  compareLimit = 6,
  onToggleCompare,
  onClose,
}) {
  // Families ◀ ▶ step through: the list it was opened from, else just this one
  const [list, setList] = useState(() => (initialList?.includes(initialSheet) ? initialList : [initialSheet]));
  const [n, setN] = useState(initialSheet);
  const [hsn, setHsn] = useState(highlightHsn ?? null);
  const [filter, setFilter] = useState('');
  const [zoom, setZoom] = useState(100);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null);

  const dialogRef = useRef(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);
  const markedRef = useRef(null);
  // Live zoom/pan state, kept outside React so dragging stays smooth
  const view = useRef({ sc: 1, x: 0, y: 0, iw: 1, ih: 1, fit: 1, ptr: new Map(), pd: 0 });

  const sheet = sheetsByN[n];
  const group = groupsById[sheet.group];
  const image = sheetImages[n];
  const net = sheet.exp - sheet.imp;
  const position = list.indexOf(n);
  const inCompare = compareIds.includes(n);

  /* ---------- toast ---------- */
  const toastTimer = useRef();
  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------- zoom + pan ---------- */
  const apply = useCallback(() => {
    const v = view.current;
    if (imgRef.current) imgRef.current.style.transform = `translate(${v.x}px, ${v.y}px) scale(${v.sc})`;
    setZoom(Math.round(v.sc * 100));
  }, []);

  const clamp = useCallback(() => {
    const v = view.current;
    const stage = stageRef.current;
    if (!stage) return;
    const sw = stage.clientWidth;
    const sh = stage.clientHeight;
    const w = v.iw * v.sc;
    const h = v.ih * v.sc;
    v.x = w <= sw ? (sw - w) / 2 : Math.min(0, Math.max(sw - w, v.x));
    v.y = h <= sh ? (sh - h) / 2 : Math.min(0, Math.max(sh - h, v.y));
  }, []);

  const fitView = useCallback(() => {
    const v = view.current;
    const stage = stageRef.current;
    if (!stage) return;
    v.fit = Math.min(stage.clientWidth / v.iw, stage.clientHeight / v.ih);
    v.sc = v.fit;
    v.x = 0;
    v.y = 0;
    clamp();
    apply();
  }, [apply, clamp]);

  const zoomAt = useCallback(
    (factor, cx, cy) => {
      const v = view.current;
      const next = Math.min(Math.max(v.sc * factor, v.fit * 0.9), MAX_ZOOM);
      const ratio = next / v.sc;
      v.x = cx - (cx - v.x) * ratio;
      v.y = cy - (cy - v.y) * ratio;
      v.sc = next;
      clamp();
      apply();
    },
    [apply, clamp],
  );

  const zoomCenter = (factor) => {
    const stage = stageRef.current;
    zoomAt(factor, stage.clientWidth / 2, stage.clientHeight / 2);
  };

  const actualSize = () => {
    view.current.sc = 1;
    view.current.x = 0;
    view.current.y = 0;
    clamp();
    apply();
  };

  const handleImageLoad = (event) => {
    view.current.iw = event.currentTarget.naturalWidth;
    view.current.ih = event.currentTarget.naturalHeight;
    fitView();
  };

  // Re-fit when the stage changes size (window resize, panel toggled)
  useEffect(() => {
    const stage = stageRef.current;
    const observer = new ResizeObserver(() => fitView());
    observer.observe(stage);
    return () => observer.disconnect();
  }, [fitView]);

  // Wheel zoom needs a non-passive listener to stop the page scrolling
  useEffect(() => {
    const stage = stageRef.current;
    const onWheel = (event) => {
      event.preventDefault();
      const r = stage.getBoundingClientRect();
      zoomAt(event.deltaY < 0 ? 1.18 : 1 / 1.18, event.clientX - r.left, event.clientY - r.top);
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  const onPointerDown = (event) => {
    const v = view.current;
    event.currentTarget.setPointerCapture(event.pointerId);
    v.ptr.set(event.pointerId, { x: event.clientX, y: event.clientY });
    setDragging(true);
    if (v.ptr.size === 2) {
      const [a, b] = [...v.ptr.values()];
      v.pd = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };

  const onPointerMove = (event) => {
    const v = view.current;
    if (!v.ptr.has(event.pointerId)) return;
    const prev = v.ptr.get(event.pointerId);
    v.ptr.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (v.ptr.size === 1) {
      v.x += event.clientX - prev.x;
      v.y += event.clientY - prev.y;
      clamp();
      apply();
    } else if (v.ptr.size === 2) {
      // Pinch zoom
      const [a, b] = [...v.ptr.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = stageRef.current.getBoundingClientRect();
      if (v.pd > 0) zoomAt(d / v.pd, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
      v.pd = d;
    }
  };

  const onPointerUp = (event) => {
    const v = view.current;
    v.ptr.delete(event.pointerId);
    v.pd = 0;
    if (!v.ptr.size) setDragging(false);
  };

  const onDoubleClick = (event) => {
    const v = view.current;
    const r = stageRef.current.getBoundingClientRect();
    if (v.sc > v.fit * 1.05) fitView();
    else zoomAt(2.6 / (v.sc / v.fit), event.clientX - r.left, event.clientY - r.top);
  };

  /* ---------- sheets ---------- */
  const step = useCallback(
    (dir) => {
      if (list.length < 2) return;
      const i = list.indexOf(n);
      setN(list[(i + dir + list.length) % list.length]);
      setFilter('');
    },
    [list, n],
  );

  const goToSheet = (target) => {
    setList((prev) => (prev.includes(target) ? prev : [target, ...prev]));
    setHsn(null);
    setFilter('');
    setN(target);
  };

  const toggleCompare = () => {
    if (!inCompare && compareIds.length >= compareLimit) {
      showToast(`Compare holds up to ${compareLimit} product families`);
      return;
    }
    onToggleCompare?.(n);
    showToast(inCompare ? 'Removed from Compare' : 'Added to Compare');
  };

  const downloadImage = async () => {
    try {
      const blob = await fetch(image).then((res) => res.blob());
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName(sheet);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showToast('Image downloaded');
    } catch {
      showToast('Download failed');
    }
  };

  const copyHsn = (code) => {
    if (!navigator.clipboard) {
      showToast('Copy not allowed');
      return;
    }
    navigator.clipboard.writeText(code).then(
      () => showToast(`HSN ${code} copied`),
      () => showToast('Copy not allowed'),
    );
  };

  /* ---------- products panel ---------- */
  const others = useMemo(() => {
    const map = {};
    for (const p of sheet.products) {
      const o = sheetsOfHsn[p.hsn].filter((x) => x !== sheet.n);
      if (o.length) map[p.hsn] = o;
    }
    return map;
  }, [sheet, sheetsOfHsn]);
  const overlapCount = Object.keys(others).length;

  const rows = useMemo(() => {
    const f = filter.toLowerCase().trim();
    return sheet.products.filter((p) => !f || `${p.hsn} ${p.name} ${p.type}`.toLowerCase().includes(f));
  }, [sheet, filter]);

  // Bring the clicked HSN into view inside the table only (not the whole dialog)
  const tableWrapRef = useRef(null);
  useEffect(() => {
    const row = markedRef.current;
    const wrap = tableWrapRef.current;
    if (!row || !wrap) return;
    wrap.scrollTop = row.offsetTop - wrap.clientHeight / 2 + row.offsetHeight / 2;
  }, [n, hsn]);

  /* ---------- open / close + keyboard ---------- */
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    // Esc: "cancel" fires straight away, unlike the queued "close" event
    const handleCancel = (event) => {
      event.preventDefault();
      onCloseRef.current();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => {
      dialog.removeEventListener('cancel', handleCancel);
      if (dialog.open) dialog.close();
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.target.tagName === 'INPUT') return;
      if (event.key === 'ArrowLeft') step(-1);
      else if (event.key === 'ArrowRight') step(1);
      else if (event.key === '+' || event.key === '=') zoomCenter(1.4);
      else if (event.key === '-') zoomCenter(1 / 1.4);
      else if (event.key === '0') fitView();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <dialog ref={dialogRef} className={styles.viewer} aria-labelledby="sheet-viewer-title">
      {/* ---------- Top bar ---------- */}
      <header className={styles.top}>
        <button type="button" className={styles.closeBtn} onClick={onClose} title="Close (Esc)">
          <Icon name="close" size={18} strokeWidth={2.4} />
          <span>Close</span>
        </button>

        <div className={styles.titleBlock}>
          <h2 id="sheet-viewer-title" className={styles.title}>
            <span className={styles.titleNum} style={{ background: group?.color }}>
              {sheetNumber(sheet.n)}
            </span>
            {sheet.name}
          </h2>
          <p className={styles.subtitle}>
            Group {sheet.group} · {group?.name}
            <span className={styles.position}>
              {position + 1} of {list.length}
            </span>
          </p>
        </div>

        <div className={styles.tools}>
          <div className={styles.toolGroup} role="group" aria-label="Product families">
            <button type="button" onClick={() => step(-1)} disabled={list.length < 2} title="Previous (←)" aria-label="Previous product family">
              <Icon name="chevronLeft" size={18} strokeWidth={2.4} />
            </button>
            <button type="button" onClick={() => step(1)} disabled={list.length < 2} title="Next (→)" aria-label="Next product family">
              <Icon name="chevronRight" size={18} strokeWidth={2.4} />
            </button>
          </div>

          <div className={styles.toolGroup} role="group" aria-label="Zoom">
            <button type="button" onClick={() => zoomCenter(1 / 1.4)} title="Zoom out (−)" aria-label="Zoom out">
              <Icon name="minus" size={18} strokeWidth={2.4} />
            </button>
            <span className={styles.zoomLevel} aria-live="polite">
              {zoom}%
            </span>
            <button type="button" onClick={() => zoomCenter(1.4)} title="Zoom in (+)" aria-label="Zoom in">
              <Icon name="plus" size={18} strokeWidth={2.4} />
            </button>
            <button type="button" onClick={fitView} title="Fit to screen (0)">
              <Icon name="fit" size={17} strokeWidth={2.2} />
              <span className={styles.toolText}>Fit</span>
            </button>
            <button type="button" onClick={actualSize} title="Actual size">
              <span className={styles.toolText}>100%</span>
            </button>
          </div>

          {SHOW_COMPARE_IN_VIEWER && (
            <button
              type="button"
              className={styles.compareBtn}
              onClick={toggleCompare}
              aria-pressed={inCompare}
              title={inCompare ? 'Remove from compare' : 'Add to compare'}
            >
              <Icon name={inCompare ? 'check' : 'compare'} size={17} strokeWidth={2.2} />
              <span className={styles.toolText}>{inCompare ? 'In compare' : 'Compare'}</span>
            </button>
          )}

          <button
            type="button"
            className={styles.downloadBtn}
            onClick={downloadImage}
            disabled={!image}
            title="Download image"
            aria-label="Download image"
          >
            <Icon name="download" size={17} strokeWidth={2.2} />
            <span className={styles.toolText}>Download image</span>
          </button>
        </div>
      </header>

      <div className={styles.middle} data-panel="true">
        {/* ---------- Image stage ---------- */}
        <div
          ref={stageRef}
          className={styles.stage}
          data-dragging={dragging}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onDoubleClick={onDoubleClick}
        >
          {image ? (
            <img
              key={n}
              ref={imgRef}
              src={image}
              alt={`${sheet.name} infographic`}
              className={styles.image}
              onLoad={handleImageLoad}
              draggable={false}
            />
          ) : (
            <p className={styles.noImage}>Image coming soon</p>
          )}

          {list.length > 1 && (
            <>
              <button type="button" className={`${styles.navArrow} ${styles.navLeft}`} onClick={() => step(-1)} aria-label="Previous product family">
                <Icon name="chevronLeft" size={22} strokeWidth={2.4} />
              </button>
              <button type="button" className={`${styles.navArrow} ${styles.navRight}`} onClick={() => step(1)} aria-label="Next product family">
                <Icon name="chevronRight" size={22} strokeWidth={2.4} />
              </button>
            </>
          )}

          <p className={styles.hint}>Scroll or pinch to zoom · drag to move · double-click to zoom in</p>
        </div>

        {/* ---------- Products panel ---------- */}
        <aside className={styles.panel} aria-label={`Products in ${sheet.name}`}>
          <div className={styles.panelHead}>
            <h3>
              {sheetNumber(sheet.n)} · {sheet.name}
            </h3>
            <p>
              {sheet.hs} · Group {sheet.group}: {group?.name}
            </p>
          </div>

          <dl className={styles.kpis}>
            <div className={styles.kpiExport}>
              <dt>Export FY26</dt>
              <dd>{formatRupees(sheet.exp)} Cr</dd>
            </div>
            <div className={styles.kpiImport}>
              <dt>Import FY26</dt>
              <dd>{formatRupees(sheet.imp)} Cr</dd>
            </div>
            <div className={net < 0 ? styles.kpiNegative : styles.kpiNet}>
              <dt>Net</dt>
              <dd>{formatRupees(net)} Cr</dd>
            </div>
          </dl>

          {overlapCount > 0 && (
            <p className={styles.note}>
              <Icon name="info" size={16} strokeWidth={2.2} />
              <span>
                {overlapCount} HSN code{overlapCount > 1 ? 's' : ''} in this family also appear in other families (marked
                ↗). Do not add the family totals together.
              </span>
            </p>
          )}

          <label className={styles.filter}>
            <Icon name="search" size={16} strokeWidth={2.4} />
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder={`Filter these ${sheet.products.length} products or HSN…`}
              aria-label="Filter products in this family"
            />
          </label>

          <div ref={tableWrapRef} className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>HSN</th>
                  <th>Product</th>
                  <th className={styles.num}>Export</th>
                  <th className={styles.num}>Import</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className={styles.emptyRow}>
                      No product matches “{filter}”
                    </td>
                  </tr>
                ) : (
                  rows.map((p) => {
                    const marked = p.hsn === hsn;
                    return (
                      <tr key={p.hsn} ref={marked ? markedRef : undefined} data-marked={marked}>
                        <td className={styles.hsnCell}>
                          <code>{p.hsn}</code>
                          <button type="button" className={styles.copy} onClick={() => copyHsn(p.hsn)} title="Copy HSN" aria-label={`Copy HSN ${p.hsn}`}>
                            <Icon name="copy" size={13} strokeWidth={2.2} />
                          </button>
                        </td>
                        <td>
                          <span className={styles.productName}>{p.name}</span>
                          <span className={styles.meta}>
                            <span className={styles.type} data-type={p.type}>
                              {p.type}
                            </span>
                            {others[p.hsn] && (
                              <span className={styles.also}>
                                ↗ also in
                                {others[p.hsn].map((other) => (
                                  <button
                                    key={other}
                                    type="button"
                                    onClick={() => goToSheet(other)}
                                    title={`${sheetNumber(other)} ${sheetsByN[other].name}`}
                                  >
                                    {sheetNumber(other)}
                                  </button>
                                ))}
                              </span>
                            )}
                          </span>
                        </td>
                        <td className={styles.num}>{inr.format(p.exp)}</td>
                        <td className={styles.num}>{inr.format(p.imp)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </aside>
      </div>

      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}
    </dialog>
  );
}
