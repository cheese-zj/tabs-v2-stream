import { useMemo, useState } from 'react';
import AcademicYear from './AcademicYear';
import Modal from './Modal';

function ThemeOption({ label, description, isActive, onClick }) {
  return (
    <button
      type="button"
      className="app-button w-full px-4 py-4 text-left"
      data-active={isActive ? 'true' : 'false'}
      onClick={onClick}
    >
      <p className="text-sm font-semibold text-[color:var(--text-primary)]">{label}</p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">{description}</p>
    </button>
  );
}

function BoardSettingsContent({ unitCount, themeMode, onChangeTheme, onResetBoard }) {
  const [showResetWarning, setShowResetWarning] = useState(false);

  return (
    <div className="text-[color:var(--text-primary)]">
      <div className="border-b border-[color:var(--border)] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
          Planner settings
        </p>
        <h3 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em]">Board controls</h3>
        <p className="mt-2 max-w-[48ch] text-sm leading-6 text-[color:var(--text-secondary)]">
          Switch between colour systems and manage the board state from one place.
        </p>
      </div>

      <div className="border-b border-[color:var(--border)] py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
          Colour mode
        </p>
        <div className="mt-4 grid gap-2">
          <ThemeOption
            label="Bright default"
            description="White background with higher-contrast hashed colours for faster scanning."
            isActive={themeMode === 'bright'}
            onClick={() => onChangeTheme('bright')}
          />
          <ThemeOption
            label="Muted editorial"
            description="Softer paper tones with lower contrast when you want the quieter editorial treatment."
            isActive={themeMode === 'muted'}
            onClick={() => onChangeTheme('muted')}
          />
        </div>
      </div>

      <div className="border-b border-[color:var(--border)] py-5 text-sm text-[color:var(--text-secondary)]">
        <p>{unitCount > 0 ? `${unitCount} planned units will be removed.` : 'No units are currently planned.'}</p>
      </div>

      <div className="pt-5">
        {!showResetWarning ? (
          <button
            type="button"
            className="app-button h-11 px-4 text-sm font-semibold text-[color:var(--danger)]"
            onClick={() => setShowResetWarning(true)}
          >
            Reset board
          </button>
        ) : null}

        {showResetWarning ? (
          <div className="space-y-4 bg-[color:var(--danger-soft)] p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--danger)]">
                Confirm reset
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-primary)]">
                This action cannot be undone and will clear the entire board.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="h-11 bg-[color:var(--danger)] px-4 text-sm font-semibold text-[#f9f3e9] transition hover:brightness-95"
                onClick={onResetBoard}
              >
                Confirm reset
              </button>
              <button
                type="button"
                className="app-button h-11 px-4 text-sm font-semibold"
                onClick={() => setShowResetWarning(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div className="min-w-[128px] border-l border-[color:var(--border)] pl-4 first:border-l-0 first:pl-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
        {label}
      </p>
      <p className="mt-2 text-[1.6rem] font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

export default function SemBoard({
  themeMode,
  academicYears,
  items,
  statusById,
  selectedItemId,
  onAddYear,
  onRemoveYear,
  onCleanBoard,
  onDropItem,
  onSelectItem,
  onDeleteItem,
  onDragItem,
  onChangeTheme,
}) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const canRemoveYears = academicYears.length > 1;
  const itemCount = useMemo(() => items.length, [items]);

  const handleResetBoard = () => {
    onCleanBoard();
    setIsSettingsOpen(false);
  };

  return (
    <section className="app-surface flex h-full w-full min-w-0 flex-col overflow-hidden max-md:min-h-[560px]">
      <div className="border-b border-[color:var(--border)] px-5 py-5 max-md:px-4">
        <div className="flex items-start justify-between gap-5 max-lg:flex-col">
          <div className="min-w-0 max-w-[64ch]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
              Planner board
            </p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-[-0.06em] text-[color:var(--text-primary)]">
              Build the degree as a clean row of periods, not a stack of mismatched cards.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
              Units stay as full module blocks. Once a semester gets dense, the lane wraps into a grid
              instead of forcing you to pan sideways.
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-4 max-md:w-full max-md:justify-between">
            <div className="flex flex-wrap gap-4">
              <StatBlock label="Planned units" value={itemCount} />
              <StatBlock label="Visible years" value={academicYears.length} />
            </div>

            <button
              type="button"
              className="app-button flex h-11 items-center justify-center gap-1.5 px-4 text-sm font-semibold"
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open planner settings"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="app-scroll h-full overflow-y-auto px-5 py-3 max-md:px-4">
        {academicYears.map((year) => (
          <AcademicYear
            key={`year-${year}`}
            year={year}
            items={items}
            statusById={statusById}
            themeMode={themeMode}
            selectedItemId={selectedItemId}
            canRemoveYear={canRemoveYears}
            onRemoveYear={onRemoveYear}
            onDropItem={onDropItem}
            onSelectItem={onSelectItem}
            onDeleteItem={onDeleteItem}
            onDragItem={onDragItem}
          />
        ))}

        <div className="border-t border-[color:var(--border)] pt-4">
          <button
            type="button"
            className="app-button flex h-12 w-full items-center justify-center gap-2 px-4 text-sm font-semibold"
            onClick={onAddYear}
            aria-label="Add year to planner"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add year
          </button>
        </div>
      </div>

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <BoardSettingsContent
          unitCount={itemCount}
          themeMode={themeMode}
          onChangeTheme={onChangeTheme}
          onResetBoard={handleResetBoard}
        />
      </Modal>
    </section>
  );
}
