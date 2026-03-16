import { stringToColorCode } from '../lib/planner';

function RequirementBlock({ label, value, state }) {
  const tone =
    state === 'unmet' ? 'danger' : state === 'review' ? 'warning' : value ? 'default' : 'muted';
  const statusLabel =
    !value ? 'None listed' : state === 'unmet' ? 'Not satisfied' : state === 'review' ? 'Manual review' : 'Satisfied';

  return (
    <div
      className={`relative px-5 py-4 ${
        tone === 'danger' ? 'bg-[color:var(--danger-soft)]' : tone === 'warning' ? 'bg-[color:var(--accent-soft)]' : ''
      }`}
    >
      <span
        className="absolute inset-y-0 left-0 w-[4px]"
        style={{
          backgroundColor:
            tone === 'danger'
              ? 'var(--danger)'
              : tone === 'warning'
                ? 'var(--accent)'
                : 'rgba(23, 28, 26, 0.22)',
        }}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-3">
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${
            tone === 'danger'
              ? 'text-[color:var(--danger)]'
              : tone === 'warning'
                ? 'text-[color:var(--accent)]'
                : 'text-[color:var(--text-secondary)]'
          }`}
        >
          {label}
        </p>
        <span
          className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${
            tone === 'danger'
              ? 'bg-[#f2d5ca] text-[color:var(--danger)]'
              : tone === 'warning'
                ? 'bg-[color:var(--surface-strong)] text-[color:var(--accent)]'
              : 'bg-[color:var(--surface-strong)] text-[color:var(--text-secondary)]'
          }`}
        >
          {statusLabel}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[color:var(--text-primary)]">{value || 'None listed'}</p>
    </div>
  );
}

function StatusPill({ label, tone = 'default' }) {
  const toneClasses =
    tone === 'danger'
      ? 'bg-[#f2d5ca] text-[color:var(--danger)]'
      : tone === 'warning'
        ? 'bg-[color:var(--surface-strong)] text-[color:var(--accent)]'
      : tone === 'accent'
        ? 'bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]'
        : 'bg-[color:var(--surface-strong)] text-[color:var(--text-secondary)]';

  return (
    <span className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${toneClasses}`}>
      {label}
    </span>
  );
}

function PanelContent({ selectedItem, status, themeMode, onClose, onToggleIgnoreWarning }) {
  const panelColor = stringToColorCode(selectedItem.id, themeMode);
  const belongsTo = Array.isArray(selectedItem.Belonging) ? selectedItem.Belonging.slice(0, 4) : [];

  return (
    <div className="app-scroll h-full overflow-y-auto border border-[color:var(--border-strong)] bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-[var(--shadow-soft)]">
      <div className="border-b border-[color:var(--border)] px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
              Unit inspector
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className="px-3 py-1.5 font-mono text-[13px] font-semibold tracking-[0.12em] text-[#f7f3e9]"
                style={{ backgroundColor: panelColor }}
              >
                {selectedItem.id}
              </span>
              {status ? (
                <StatusPill
                  label={status.hasConflict ? 'Warnings active' : status.needsReview ? 'Manual review' : 'Ready to take'}
                  tone={status.hasConflict ? 'danger' : status.needsReview ? 'warning' : 'accent'}
                />
              ) : null}
              {status?.hasConflict && status.needsReview ? <StatusPill label="Manual review" tone="warning" /> : null}
              {selectedItem.ignore_warning ? <StatusPill label="Warnings ignored" tone="accent" /> : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              className="app-icon-btn flex h-10 w-10 items-center justify-center"
              href={`https://www.sydney.edu.au/units/${selectedItem.id}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Open unit page"
            >
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </a>
            <button
              type="button"
              className="app-icon-btn flex h-10 w-10 items-center justify-center"
              onClick={onClose}
              aria-label="Close details"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        <h2 className="mt-5 text-[2rem] font-semibold leading-tight tracking-[-0.05em] text-[color:var(--text-primary)]">
          {selectedItem.name}
        </h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
          Review dependencies, verify whether the current placement works, and decide whether to keep
          automated warning checks enabled for this unit.
        </p>

        {belongsTo.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {belongsTo.map((table) => (
              <span
                key={table}
                className="bg-[color:var(--surface-strong)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-secondary)]"
              >
                {table.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="divide-y divide-[color:var(--border)]">
        <RequirementBlock
          label="Prerequisites"
          value={selectedItem.P}
          state={status?.pState}
        />
        <RequirementBlock
          label="Corequisites"
          value={selectedItem.C}
          state={status?.cState}
        />
        <RequirementBlock
          label="Prohibitions"
          value={selectedItem.N}
          state={status?.nState}
        />
      </div>

      <div className="border-t border-[color:var(--border)] px-5 py-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-[30ch]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
              Warning policy
            </p>
            <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
              Leave warnings on when you want the planner to keep prerequisite logic strict.
            </p>
          </div>

          <button
            type="button"
            className="app-button h-11 px-4 text-sm font-semibold"
            data-active={selectedItem.ignore_warning ? 'true' : 'false'}
            onClick={() => onToggleIgnoreWarning(selectedItem.id)}
          >
            Ignore warnings: {selectedItem.ignore_warning ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DescriptionPanel({
  themeMode,
  selectedItem,
  status,
  isOpen,
  onClose,
  onToggleIgnoreWarning,
}) {
  const desktopOpenClass = isOpen ? 'w-[400px] opacity-100 xl:w-[430px]' : 'w-0 opacity-0';

  return (
    <>
      <aside
        className={`hidden overflow-hidden transition-[width,opacity] duration-300 md:block md:shrink-0 ${desktopOpenClass} ${
          isOpen ? '' : 'pointer-events-none'
        }`}
      >
        {selectedItem ? (
          <div className="h-full w-[400px] xl:w-[430px]">
            <PanelContent
              selectedItem={selectedItem}
              status={status}
              themeMode={themeMode}
              onClose={onClose}
              onToggleIgnoreWarning={onToggleIgnoreWarning}
            />
          </div>
        ) : null}
      </aside>

      <aside
        className={`fixed inset-0 z-50 bg-[rgba(23,28,26,0.18)] transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'
        }`}
      >
        {selectedItem ? (
          <div className="ml-auto h-full w-full max-w-[430px]">
            <PanelContent
              selectedItem={selectedItem}
              status={status}
              themeMode={themeMode}
              onClose={onClose}
              onToggleIgnoreWarning={onToggleIgnoreWarning}
            />
          </div>
        ) : null}
      </aside>
    </>
  );
}
