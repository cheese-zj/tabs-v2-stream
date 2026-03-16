import UnitCard from './UnitCard';
import { getSemesterTheme } from '../lib/planner';

function resolveGridColumns(itemCount) {
  if (itemCount <= 0) {
    return { desktop: 1, mobile: 1 };
  }

  if (itemCount <= 4) {
    return {
      desktop: itemCount,
      mobile: Math.min(itemCount, 2),
    };
  }

  return {
    desktop: 4,
    mobile: 2,
  };
}

export default function Semester({
  semesterLabel,
  semester,
  year,
  items,
  themeMode,
  selectedItemId,
  statusById,
  onDropItem,
  onSelectItem,
  onDeleteItem,
  onDragItem,
}) {
  const semesterItems = items.filter((item) => item.year === year && item.semester === semester);
  const semesterTheme = getSemesterTheme(semester, themeMode);
  const gridColumns = resolveGridColumns(semesterItems.length);

  const handleDrop = (event) => {
    event.preventDefault();
    const itemPayload = event.dataTransfer.getData('item');

    if (!itemPayload) {
      return;
    }

    try {
      const parsed = JSON.parse(itemPayload);
      onDropItem(parsed, year, semester);
    } catch {
      // Ignore malformed drag payloads.
    }
  };

  return (
    <div className="overflow-hidden border border-[color:var(--border)] bg-[color:var(--surface-strong)]">
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] px-4 py-3 max-md:flex-col max-md:items-start">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{
              backgroundColor: semesterTheme.badge,
              color: semesterTheme.text,
            }}
          >
            {semesterLabel}
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
            {semesterItems.length} unit{semesterItems.length === 1 ? '' : 's'}
          </p>
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
          Drop units here
        </p>
      </div>

      <div
        className="min-h-[190px]"
        style={{ backgroundColor: semesterTheme.surface }}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={(event) => event.preventDefault()}
      >
        {semesterItems.length > 0 ? (
          <div
            className="semester-grid gap-px"
            style={{
              '--semester-columns': gridColumns.desktop,
              '--semester-mobile-columns': gridColumns.mobile,
              backgroundColor: semesterTheme.border,
            }}
          >
            {semesterItems.map((item) => {
              const status = statusById.get(item.id);

              return (
                <UnitCard
                  key={item.id}
                  item={item}
                  themeMode={themeMode}
                  isSelected={item.id === selectedItemId}
                  hasConflict={Boolean(status?.hasConflict)}
                  needsReview={Boolean(status?.needsReview)}
                  onSelect={onSelectItem}
                  onDelete={onDeleteItem}
                  onDragStart={onDragItem}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[190px] items-center justify-center px-6 text-center">
            <div className="max-w-[30ch]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
                Empty lane
              </p>
              <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
                Drag a unit into {semesterLabel.toLowerCase()} and it will snap into this block.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
