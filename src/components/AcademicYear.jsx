import { useEffect, useMemo, useState } from 'react';
import Modal from './Modal';
import Semester from './Semester';
import SettingsContent from './SettingsContent';
import { compareSemesterOrder, SEMESTER_OPTIONS } from '../lib/planner';

function loadSemesterSettings(year) {
  if (typeof window === 'undefined') {
    return [1, 2];
  }

  try {
    const raw = window.localStorage.getItem(`semesters-year-${year}`);

    if (!raw) {
      return [1, 2];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [1, 2];
    }

    const validValues = new Set(SEMESTER_OPTIONS.map((option) => option.value));
    const normalized = parsed
      .map((value) => Number(value))
      .filter((value) => validValues.has(value));

    return normalized.length > 0 ? normalized : [1, 2];
  } catch {
    return [1, 2];
  }
}

function MetaValue({ label, value }) {
  return (
    <div className="border-l border-[color:var(--border)] pl-3 first:border-l-0 first:pl-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
        {label}
      </p>
      <p className="mt-1 font-mono text-[13px] font-semibold tracking-[0.08em] text-[color:var(--text-primary)]">
        {value}
      </p>
    </div>
  );
}

export default function AcademicYear({
  year,
  items,
  statusById,
  themeMode,
  selectedItemId,
  canRemoveYear,
  onRemoveYear,
  onDropItem,
  onSelectItem,
  onDeleteItem,
  onDragItem,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemesters, setSelectedSemesters] = useState(() => loadSemesterSettings(year));

  useEffect(() => {
    setSelectedSemesters(loadSemesterSettings(year));
  }, [year]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(`semesters-year-${year}`, JSON.stringify(selectedSemesters));
  }, [year, selectedSemesters]);

  const sortedSemesters = useMemo(() => {
    return [...selectedSemesters].sort((a, b) => compareSemesterOrder(a, b));
  }, [selectedSemesters]);

  const yearUnitCount = useMemo(() => {
    return items.filter((item) => item.year === year).length;
  }, [items, year]);

  const handleRemoveYear = () => {
    onRemoveYear(year);
    setIsModalOpen(false);
  };

  return (
    <section className="border-b border-[color:var(--border)] py-5 last:border-b-0">
      <div className="mb-4 flex items-start justify-between gap-4 max-md:flex-col">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[color:var(--accent-soft)] px-3 py-1.5 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-primary)]">
              Year {year}
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
              Academic frame
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-3">
            <MetaValue label="Units" value={yearUnitCount} />
            <MetaValue label="Periods" value={sortedSemesters.length} />
          </div>
        </div>

        <button
          type="button"
          className="app-button flex h-11 items-center justify-center gap-1.5 px-4 text-sm font-semibold"
          onClick={() => setIsModalOpen(true)}
          aria-label={`Configure year ${year}`}
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Configure
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {sortedSemesters.map((semester) => {
          const option = SEMESTER_OPTIONS.find((entry) => entry.value === semester);

          return (
            <Semester
              key={`year-${year}-semester-${semester}`}
              semester={semester}
              semesterLabel={option?.label ?? `Period ${semester}`}
              year={year}
              items={items}
              themeMode={themeMode}
              selectedItemId={selectedItemId}
              statusById={statusById}
              onDropItem={onDropItem}
              onSelectItem={onSelectItem}
              onDeleteItem={onDeleteItem}
              onDragItem={onDragItem}
            />
          );
        })}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <SettingsContent
          year={year}
          selectedSemesters={selectedSemesters}
          themeMode={themeMode}
          onChange={setSelectedSemesters}
          yearUnitCount={yearUnitCount}
          canRemoveYear={canRemoveYear}
          onRemoveYear={handleRemoveYear}
        />
      </Modal>
    </section>
  );
}
