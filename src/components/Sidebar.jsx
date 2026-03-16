import { useMemo, useState } from 'react';
import { stringToColorCode, stringToTableColor } from '../lib/planner';

function EmptyTips() {
  const tips = [
    ['Search directly', 'Find any USYD unit by code or title.'],
    ['Browse groups', 'Scan handbook clusters when you are still exploring options.'],
    ['Drag into lanes', 'Drop units into a period and the board will stack them as modules.'],
  ];

  return (
    <div className="divide-y divide-[color:var(--border)]">
      {tips.map(([title, description]) => (
        <div key={title} className="px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
            {title}
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--text-primary)]">{description}</p>
        </div>
      ))}
    </div>
  );
}

export default function Sidebar({ units, tables, plannedIds, themeMode, onDragStartItem }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBrowseActive, setIsBrowseActive] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');

  const filteredItems = useMemo(() => {
    let result = units;

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((item) => {
        return item.name.toLowerCase().includes(query) || item.id.toLowerCase().includes(query);
      });
    }

    if (selectedTable) {
      result = result.filter((item) => item.Belonging?.includes(selectedTable));
    }

    return [...result].sort((a, b) => {
      const levelCompare = (a.id?.[4] ?? '').localeCompare(b.id?.[4] ?? '');
      if (levelCompare !== 0) {
        return levelCompare;
      }

      return a.id.localeCompare(b.id);
    });
  }, [searchQuery, selectedTable, units]);

  const showResults = !isBrowseActive && (searchQuery !== '' || selectedTable !== '');

  const handleResetControls = () => {
    setSearchQuery('');
    setSelectedTable('');
    setIsBrowseActive(false);
  };

  return (
    <aside className="app-surface flex h-full w-full max-w-[390px] flex-col overflow-hidden max-md:max-w-none max-md:min-h-[460px]">
      <div className="border-b border-[color:var(--border)] px-5 py-5 max-md:px-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-secondary)]">
          Unit library
        </p>
        <h2 className="mt-2 text-[1.9rem] font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">
          Find a unit, then slide it straight into the board.
        </h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
          The library now behaves like the planner: clearer sections, fewer decorative borders, and one
          consistent module language.
        </p>
      </div>

      <div className="border-b border-[color:var(--border)] p-4">
        <div className="app-input flex items-center px-3">
          <span className="material-symbols-outlined text-[20px] text-[color:var(--text-secondary)]">
            search
          </span>
          <input
            className="ml-2 h-12 w-full border-none bg-transparent text-[15px] font-medium text-[color:var(--text-primary)] outline-none placeholder:text-[color:var(--text-secondary)]"
            type="search"
            placeholder="Search units by code or name"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              if (event.target.value) {
                setIsBrowseActive(false);
              }
            }}
          />
          {searchQuery ? (
            <button
              type="button"
              className="app-button flex h-8 w-8 items-center justify-center p-0"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          ) : null}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="app-button flex h-11 items-center justify-center gap-2 text-sm font-semibold"
            data-active={isBrowseActive ? 'true' : 'false'}
            onClick={() => setIsBrowseActive((current) => !current)}
            aria-label="Browse tables"
          >
            <span className="material-symbols-outlined text-[18px]">menu_book</span>
            Browse groups
          </button>

          <button
            type="button"
            className="app-button flex h-11 items-center justify-center gap-2 text-sm font-semibold"
            onClick={handleResetControls}
            aria-label="Reset filters"
          >
            <span className="material-symbols-outlined text-[18px]">ink_eraser</span>
            Reset
          </button>
        </div>

        {selectedTable ? (
          <div
            className="mt-3 flex items-center justify-between gap-3 px-3 py-3 text-sm font-semibold text-[color:var(--text-primary)]"
            style={{ backgroundColor: stringToTableColor(selectedTable, themeMode) }}
          >
            <span className="truncate">{selectedTable.replace(/_/g, ' ')}</span>
            <button
              type="button"
              className="app-button flex h-8 w-8 items-center justify-center p-0"
              onClick={() => setSelectedTable('')}
              aria-label="Clear table filter"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        ) : null}
      </div>

      <div className="app-scroll flex-1 overflow-y-auto">
        {isBrowseActive ? (
          <div className="divide-y divide-[color:var(--border)]">
            {tables.map((table) => (
              <button
                key={table}
                type="button"
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface-subtle)]"
                style={{ backgroundColor: stringToTableColor(table, themeMode) }}
                onClick={() => {
                  setSelectedTable(table);
                  setIsBrowseActive(false);
                }}
              >
                <span>{table.replace(/_/g, ' ')}</span>
                <span className="material-symbols-outlined text-[18px] text-[color:var(--text-secondary)]">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        ) : null}

        {!isBrowseActive && searchQuery === '' && selectedTable === '' ? <EmptyTips /> : null}

        {showResults ? (
          <div>
            <div className="flex items-center justify-between gap-3 border-b border-[color:var(--border)] px-5 py-3 max-md:px-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
                {filteredItems.length} result{filteredItems.length === 1 ? '' : 's'}
              </p>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--text-secondary)]">
                Drag into lane
              </p>
            </div>

            {filteredItems.length > 0 ? (
              <div className="divide-y divide-[color:var(--border)]">
                {filteredItems.map((item) => {
                  const inPlan = plannedIds.has(item.id);

                  return (
                    <div
                      key={item.id}
                      className="app-library-card cursor-grab active:scale-[0.995]"
                      style={{ '--library-accent': stringToColorCode(item.id, themeMode) }}
                      data-placed={inPlan ? 'true' : 'false'}
                      draggable
                      onDragStart={(event) => onDragStartItem(event, item)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-mono text-[13px] font-semibold tracking-[0.12em] text-[color:var(--text-primary)]">
                            {item.id}
                          </p>
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
                            {inPlan ? 'Placed on board' : 'Drag to place'}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-[18px] text-[color:var(--text-secondary)]">
                          drag_indicator
                        </span>
                      </div>

                      <p className="mt-4 text-sm font-semibold leading-6 text-[color:var(--text-primary)]">
                        {item.name}
                      </p>

                      {Array.isArray(item.Belonging) && item.Belonging.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {item.Belonging.slice(0, 2).map((group) => (
                            <span
                              key={group}
                              className="bg-[color:var(--surface)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-secondary)]"
                            >
                              {group.replace(/_/g, ' ')}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="px-5 py-8 text-center max-md:px-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
                  No match
                </p>
                <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">
                  No units matched this query or group filter.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </aside>
  );
}
