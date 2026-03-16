import { stringToColorCode } from '../lib/planner';

export default function UnitCard({
  item,
  themeMode,
  isSelected,
  hasConflict,
  needsReview,
  onSelect,
  onDelete,
  onDragStart,
}) {
  const accentColor = stringToColorCode(item.id, themeMode);
  const stateLabel = hasConflict ? 'Warnings active' : needsReview ? 'Manual review' : isSelected ? 'Selected' : 'Placed';

  return (
    <div
      className="app-unit-card group active:scale-[0.995]"
      style={{
        '--unit-accent': accentColor,
      }}
      data-selected={isSelected ? 'true' : 'false'}
      data-conflict={hasConflict ? 'true' : 'false'}
      data-review={needsReview ? 'true' : 'false'}
      draggable
      onClick={() => onSelect(item.id)}
      onDragStart={(event) => onDragStart(event, item)}
      role="presentation"
    >
      <button
        type="button"
        className="absolute right-0 top-0 z-[2] flex h-11 w-11 items-center justify-center border-b border-l border-[color:var(--border)] bg-[color:var(--surface-strong)] text-[color:var(--text-secondary)] opacity-0 transition group-hover:opacity-100 hover:bg-[color:var(--surface-subtle)] hover:text-[color:var(--text-primary)] max-md:opacity-100"
        onClick={(event) => {
          event.stopPropagation();
          onDelete(item.id);
        }}
        aria-label={`Delete ${item.id}`}
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>

      <div className="flex h-full flex-col px-5 py-4">
        <div className="pr-12">
          <p className="font-mono text-[13px] font-semibold tracking-[0.12em] text-[color:var(--text-primary)]">
            {item.id}
          </p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
            {stateLabel}
          </p>
        </div>

        <div className="mt-4 flex-1 pr-2">
          <h3 className="text-[15px] font-semibold leading-6 text-[color:var(--text-primary)]">
            {item.name}
          </h3>
        </div>

        <div className="mt-4 space-y-4">
          {hasConflict || needsReview ? (
            <div className="app-warning-band">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                {hasConflict ? 'Dependency issue' : 'Manual review'}
              </p>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-[color:var(--border)] pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
              {hasConflict ? 'Check prerequisites' : needsReview ? 'Verify manually' : 'Ready in plan'}
            </p>
            <span
              className="h-3.5 w-3.5 shrink-0"
              style={{ backgroundColor: accentColor }}
              aria-hidden
            />
          </div>
        </div>
      </div>
    </div>
  );
}
