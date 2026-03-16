import { useEffect, useMemo, useState } from 'react';
import aggregatedUnits from '../aggregated_units.json';
import tables from '../tables.json';
import DescriptionPanel from './components/DescriptionPanel';
import SemBoard from './components/SemBoard';
import Sidebar from './components/Sidebar';
import {
  buildRequirementStatusMap,
  DEFAULT_ACADEMIC_YEARS,
  normalizeItem,
} from './lib/planner';

function loadJson(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);

    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export default function App() {
  const [themeMode, setThemeMode] = useState(() => {
    const stored = loadJson('visualTheme', 'bright');
    return stored === 'muted' ? 'muted' : 'bright';
  });

  const [items, setItems] = useState(() => {
    const stored = loadJson('storedItems', []);

    if (!Array.isArray(stored)) {
      return [];
    }

    return stored
      .filter((item) => item && item.id)
      .map((item) =>
        normalizeItem(item, {
          year: Number(item.year ?? 1),
          semester: Number(item.semester ?? 1),
        }),
      );
  });

  const [academicYears, setAcademicYears] = useState(() => {
    const stored = loadJson('academicYears', DEFAULT_ACADEMIC_YEARS);

    if (!Array.isArray(stored) || stored.length === 0) {
      return [...DEFAULT_ACADEMIC_YEARS];
    }

    const normalized = stored.map((year) => Number(year)).filter((year) => Number.isFinite(year));
    return normalized.length > 0 ? normalized : [...DEFAULT_ACADEMIC_YEARS];
  });

  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    window.localStorage.setItem('storedItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    window.localStorage.setItem('academicYears', JSON.stringify(academicYears));
  }, [academicYears]);

  useEffect(() => {
    window.localStorage.setItem('visualTheme', JSON.stringify(themeMode));
    document.body.dataset.theme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    if (!selectedItemId) {
      return;
    }

    const hasSelected = items.some((item) => item.id === selectedItemId);

    if (!hasSelected) {
      setSelectedItemId(null);
    }
  }, [items, selectedItemId]);

  const statusById = useMemo(() => buildRequirementStatusMap(items), [items]);

  const plannedIds = useMemo(() => new Set(items.map((item) => item.id)), [items]);

  const selectedItem = useMemo(() => {
    return items.find((item) => item.id === selectedItemId) ?? null;
  }, [items, selectedItemId]);

  const selectedStatus = selectedItem ? statusById.get(selectedItem.id) : null;
  const isDetailOpen = Boolean(selectedItem);

  const handleDragStart = (event, item) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDropItem = (itemData, year, semester) => {
    if (!itemData?.id) {
      return;
    }

    const itemId = itemData.id;

    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === itemId);

      if (fromIndex === -1) {
        const newItem = normalizeItem(itemData, {
          year,
          semester,
          ignore_warning: false,
          animating: true,
        });
        return [...current, newItem];
      }

      const next = [...current];
      next[fromIndex] = {
        ...next[fromIndex],
        ...itemData,
        year,
        semester,
        ignore_warning: false,
        animating: true,
      };
      return next;
    });

    setSelectedItemId(itemId);

    window.setTimeout(() => {
      setItems((current) => {
        return current.map((item) => {
          if (item.id !== itemId) {
            return item;
          }

          return { ...item, animating: false };
        });
      });
    }, 350);
  };

  const handleSelectItem = (itemId) => {
    setSelectedItemId((current) => (current === itemId ? null : itemId));
  };

  const handleDeleteItem = (itemId) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
    setSelectedItemId((current) => (current === itemId ? null : current));
  };

  const handleToggleIgnoreWarning = (itemId) => {
    setItems((current) => {
      return current.map((item) => {
        if (item.id !== itemId) {
          return item;
        }

        return {
          ...item,
          ignore_warning: !item.ignore_warning,
        };
      });
    });
  };

  const handleAddAcademicYear = () => {
    setAcademicYears((current) => {
      if (current.length === 0) {
        return [1];
      }

      return [...current, Math.max(...current) + 1];
    });
  };

  const handleRemoveAcademicYear = (yearToRemove) => {
    if (academicYears.length <= 1 || !academicYears.includes(yearToRemove)) {
      return;
    }

    setAcademicYears((current) => current.filter((year) => year !== yearToRemove));

    setItems((current) => current.filter((item) => item.year !== yearToRemove));

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(`semesters-year-${yearToRemove}`);
    }
  };

  const handleCleanBoard = () => {
    setItems([]);
    setSelectedItemId(null);
    setAcademicYears([...DEFAULT_ACADEMIC_YEARS]);

    const keys = Object.keys(window.localStorage);
    for (const key of keys) {
      if (key === 'storedItems' || key === 'academicYears' || key.startsWith('semesters-year-')) {
        window.localStorage.removeItem(key);
      }
    }
  };

  return (
    <div className="min-h-screen p-5 max-md:px-3 max-md:py-3">
      <div className="mx-auto flex h-[calc(100vh-2.5rem)] max-w-[1920px] gap-3 max-md:h-auto max-md:min-h-[calc(100vh-1.5rem)] max-md:flex-col">
        <Sidebar
          units={aggregatedUnits}
          tables={tables}
          plannedIds={plannedIds}
          themeMode={themeMode}
          onDragStartItem={handleDragStart}
        />

        <div className="flex min-w-0 flex-1 gap-3 max-md:flex-col">
          <SemBoard
            themeMode={themeMode}
            academicYears={academicYears}
            items={items}
            statusById={statusById}
            selectedItemId={selectedItemId}
            onAddYear={handleAddAcademicYear}
            onRemoveYear={handleRemoveAcademicYear}
            onCleanBoard={handleCleanBoard}
            onDropItem={handleDropItem}
            onSelectItem={handleSelectItem}
            onDeleteItem={handleDeleteItem}
            onDragItem={handleDragStart}
            onChangeTheme={setThemeMode}
          />

          <DescriptionPanel
            themeMode={themeMode}
            selectedItem={selectedItem}
            status={selectedStatus}
            isOpen={isDetailOpen}
            onClose={() => setSelectedItemId(null)}
            onToggleIgnoreWarning={handleToggleIgnoreWarning}
          />
        </div>
      </div>
    </div>
  );
}
