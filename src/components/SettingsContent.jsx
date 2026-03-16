import { useEffect, useState } from 'react';
import { getSemesterTheme, SEMESTER_OPTIONS } from '../lib/planner';

export default function SettingsContent({
  year,
  selectedSemesters,
  themeMode,
  onChange,
  yearUnitCount,
  canRemoveYear,
  onRemoveYear,
}) {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  useEffect(() => {
    setShowDeleteWarning(false);
  }, [year]);

  const handleSemesterChange = (semesterValue) => {
    if (selectedSemesters.includes(semesterValue)) {
      onChange(selectedSemesters.filter((value) => value !== semesterValue));
      return;
    }

    onChange([...selectedSemesters, semesterValue]);
  };

  const handleDeleteClick = () => {
    if (!canRemoveYear) {
      return;
    }

    if (yearUnitCount > 0 && !showDeleteWarning) {
      setShowDeleteWarning(true);
      return;
    }

    onRemoveYear();
  };

  return (
    <div className="text-[color:var(--text-primary)]">
      <div className="border-b border-[color:var(--border)] pb-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
          Year settings
        </p>
        <h3 className="mt-2 text-[1.8rem] font-semibold tracking-[-0.05em]">Year {year}</h3>
      </div>

      <div className="border-b border-[color:var(--border)] py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
          Visible periods
        </p>
        <div className="mt-4 divide-y divide-[color:var(--border)] border border-[color:var(--border)]">
          {SEMESTER_OPTIONS.map((option) => {
            const selected = selectedSemesters.includes(option.value);
            const semesterTheme = getSemesterTheme(option.value, themeMode);

            return (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 px-4 py-3 transition hover:bg-[color:var(--surface-subtle)]"
                style={selected ? { backgroundColor: semesterTheme.surface } : undefined}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleSemesterChange(option.value)}
                  className="h-4 w-4"
                  style={{ accentColor: 'var(--accent-strong)' }}
                />
                <span
                  className="h-3 w-3 shrink-0"
                  style={{ backgroundColor: semesterTheme.badge }}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[color:var(--text-primary)]">{option.label}</p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
                    {selected ? 'Visible on board' : 'Hidden'}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
          Year management
        </p>
        <p className="mt-2 text-sm leading-6 text-[color:var(--text-secondary)]">
          {canRemoveYear
            ? 'Delete this year if you no longer need the lane group.'
            : 'At least one year must remain in the planner.'}
        </p>

        <button
          type="button"
          className="app-button mt-4 h-11 px-4 text-sm font-semibold text-[color:var(--danger)]"
          onClick={handleDeleteClick}
          disabled={!canRemoveYear}
        >
          Delete year
        </button>

        {showDeleteWarning ? (
          <div className="mt-4 space-y-3 bg-[color:var(--danger-soft)] p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--danger)]">
                Confirm delete
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-primary)]">
                Deleting Year {year} will remove {yearUnitCount} planned unit
                {yearUnitCount === 1 ? '' : 's'} from the board.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="h-11 bg-[color:var(--danger)] px-4 text-sm font-semibold text-[#f9f3e9] transition hover:brightness-95"
                onClick={onRemoveYear}
              >
                Confirm delete
              </button>
              <button
                type="button"
                className="app-button h-11 px-4 text-sm font-semibold"
                onClick={() => setShowDeleteWarning(false)}
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
