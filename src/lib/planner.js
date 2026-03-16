export const DEFAULT_ACADEMIC_YEARS = [1, 2, 3];

export const SEMESTER_OPTIONS = [
  { value: 0, label: 'Intensive Period 1' },
  { value: 1, label: 'Semester 1' },
  { value: 3, label: 'Intensive Period 2' },
  { value: 2, label: 'Semester 2' },
];

const SEMESTER_DISPLAY_ORDER = [0, 1, 3, 2];

const COLOR_THEME_TOKENS = {
  bright: {
    semesterThemeByValue: {
      0: {
        surface: '#fcfefd',
        border: '#d6e8df',
        badge: '#0c9a6d',
        text: '#f7fffb',
      },
      1: {
        surface: '#fcfdff',
        border: '#dbe4f8',
        badge: '#1457ff',
        text: '#f6f9ff',
      },
      3: {
        surface: '#fffdfb',
        border: '#f2dfd2',
        badge: '#ff6a00',
        text: '#fff8f2',
      },
      2: {
        surface: '#fffef8',
        border: '#f0e7c7',
        badge: '#f1be00',
        text: '#2f2500',
      },
    },
    unitColorPalette: ['#1457ff', '#ff6a00', '#13b67b', '#ff3366', '#7c3aed', '#00a6fb', '#d98a00'],
    tableColorPalette: ['#e9f8f3', '#edf3ff', '#fff1e7', '#fff8df', '#f4ecff', '#e6f8ff'],
    fallbackSemesterTheme: {
      surface: '#eef2f7',
      border: '#8694a7',
      badge: '#5f6f84',
      text: '#f8fbff',
    },
  },
  muted: {
    semesterThemeByValue: {
      0: {
        surface: '#f7f8f4',
        border: '#dde3d7',
        badge: '#66755f',
        text: '#f7f3e9',
      },
      1: {
        surface: '#f7f8fa',
        border: '#d8dee4',
        badge: '#62707f',
        text: '#f7f3e9',
      },
      3: {
        surface: '#f8f5ef',
        border: '#e2d8ca',
        badge: '#796548',
        text: '#f7f3e9',
      },
      2: {
        surface: '#f8f6ea',
        border: '#e3dfc9',
        badge: '#767443',
        text: '#f7f3e9',
      },
    },
    unitColorPalette: ['#879455', '#6d7f88', '#9a7057', '#6f816d', '#8a777d', '#7a8576', '#777b94'],
    tableColorPalette: ['#e9ece1', '#e8ecef', '#ece7dd', '#ece8d8', '#ece6df', '#e4e9e3'],
    fallbackSemesterTheme: {
      surface: '#f6f3ed',
      border: '#ddd8ce',
      badge: '#6f6c64',
      text: '#f7f3e9',
    },
  },
};

function resolveColorTheme(themeMode = 'bright') {
  return COLOR_THEME_TOKENS[themeMode] ?? COLOR_THEME_TOKENS.bright;
}

function resolveSemesterOrder(semesterValue) {
  const position = SEMESTER_DISPLAY_ORDER.indexOf(Number(semesterValue));

  if (position !== -1) {
    return position;
  }

  return SEMESTER_DISPLAY_ORDER.length + Number(semesterValue || 0);
}

export function compareSemesterOrder(a, b) {
  return resolveSemesterOrder(a) - resolveSemesterOrder(b);
}

export function getSemesterTheme(semesterValue, themeMode = 'bright') {
  const theme = resolveColorTheme(themeMode);
  return theme.semesterThemeByValue[Number(semesterValue)] ?? theme.fallbackSemesterTheme;
}

export function stringToColorCode(str, themeMode = 'bright') {
  const theme = resolveColorTheme(themeMode);

  if (!str) {
    return theme.unitColorPalette[0];
  }

  let hash = 0;
  const safe = String(str);

  for (let i = 0; i < Math.min(6, safe.length); i += 1) {
    hash = safe.charCodeAt(i) * 31 + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % theme.unitColorPalette.length;
  return theme.unitColorPalette[index];
}

export function stringToTableColor(str, themeMode = 'bright') {
  const theme = resolveColorTheme(themeMode);

  if (!str) {
    return theme.tableColorPalette[0];
  }

  let hash = 0;
  const safe = String(str);

  for (let i = 0; i < Math.min(4, safe.length); i += 1) {
    hash = safe.charCodeAt(i) * 29 + ((hash << 4) - hash);
  }

  const index = Math.abs(hash) % theme.tableColorPalette.length;
  return theme.tableColorPalette[index];
}

const REQUIREMENT_BOOLEAN = {
  true: 'true',
  false: 'false',
  unknown: 'unknown',
};

const REQUIREMENT_STATE = {
  met: 'met',
  unmet: 'unmet',
  review: 'review',
};

const ADVISORY_MARKERS = [
  'STUDENTS WHO',
  'STUDENTS ARE',
  'YOU SHOULD ALSO',
  'THIS UNIT',
  'DETAILS WILL',
  'FOR MORE INFORMATION',
  'THE DEPARTMENT RECOMMENDS',
  'SUMMER BRIDGING COURSES',
  'NOTE:',
  'PREREQUISITES:',
];

const REVIEW_SEGMENT_PATTERNS = [
  /\bAN?\s+AVERAGE\s+MARK\s+OF\s+\d+\s+OR\s+(?:ABOVE|GREATER|MORE)\s+IN\s*\([^)]*\)/g,
  /\bAN?\s+AVERAGE\s+MARK\s+OF\s+\d+\s+OR\s+(?:ABOVE|GREATER|MORE)\s+IN\s+[A-Z0-9X\s]+/g,
  /\bAVERAGE\s+OF\s+\d+\s+OR\s+ABOVE\s+IN\s*\([^)]*\)/g,
  /\bAVERAGE\s+OF\s+\d+\s+OR\s+ABOVE\s+IN\s+[A-Z0-9X\s]+/g,
  /\bANNUAL\s+AVERAGE\s+MARK\s+OF\s+AT\s+LEAST\s+\d+(?:\s+IN\s+(?:THE\s+)?PREVIOUS\s+YEAR)?/g,
  /\bAN?\s+ANNUAL\s+AVERAGE\s+MARK\s+OF\s+AT\s+LEAST\s+\d+(?:\s+IN\s+(?:THE\s+)?PREVIOUS\s+YEAR)?/g,
  /\bANNUAL\s+AVERAGE\s+MARK\s+OF\s+AT\s+LEAST\s+\d+/g,
  /\bAN?\s+MARK\s+OF\s+\d+\s+OR\s+(?:ABOVE|GREATER|MORE)\s+IN\s*\([^)]*\)/g,
  /\bAN?\s+MARK\s+OF\s+\d+\s+OR\s+(?:ABOVE|GREATER|MORE)\s+IN\s+[A-Z]{4}[0-9X]{4}(?:\s+OR\s+[A-Z]{4}[0-9X]{4})*/g,
  /\b\d+%?\s+OR\s+(?:ABOVE|GREATER|MORE)\s+IN\s*\([^)]*\)/g,
  /\b\d+%?\s+OR\s+(?:ABOVE|GREATER|MORE)\s+IN\s+[A-Z]{4}[0-9X]{4}(?:\s+OR\s+[A-Z]{4}[0-9X]{4})*/g,
  /\bMORE\s+THAN\s+\d+%?\s+IN\s+[A-Z]{4}[0-9X]{4}(?:\s+OR\s+[A-Z]{4}[0-9X]{4})*/g,
  /\bLESS\s+THAN\s+\d+%?\s+IN\s+[A-Z]{4}[0-9X]{4}(?:\s+OR\s+[A-Z]{4}[0-9X]{4})*/g,
  /\bAVERAGE\s+MARK\s+OF\s+AT\s+LEAST\s+\d+/g,
  /\bDISTINCTION\s+AVERAGE\b/g,
  /\bWAM\s+(?:GREATER\s+THAN|ABOVE)\s+\d+\b/g,
  /\bPERMISSION\s+FROM\s+THE\s+SCHOOL\s+OF\s+CS\b/g,
  /\bDEPARTMENTAL\s+PERMISSION\b/g,
  /\bENTRY\s+IS\s+BY\s+INVITATION\b/g,
];

function toRequirementState(value, invert = false) {
  if (value === REQUIREMENT_BOOLEAN.unknown) {
    return REQUIREMENT_STATE.review;
  }

  if (!invert) {
    return value === REQUIREMENT_BOOLEAN.true ? REQUIREMENT_STATE.met : REQUIREMENT_STATE.unmet;
  }

  return value === REQUIREMENT_BOOLEAN.true ? REQUIREMENT_STATE.unmet : REQUIREMENT_STATE.met;
}

function andState(left, right) {
  if (left === REQUIREMENT_BOOLEAN.false || right === REQUIREMENT_BOOLEAN.false) {
    return REQUIREMENT_BOOLEAN.false;
  }

  if (left === REQUIREMENT_BOOLEAN.unknown || right === REQUIREMENT_BOOLEAN.unknown) {
    return REQUIREMENT_BOOLEAN.unknown;
  }

  return REQUIREMENT_BOOLEAN.true;
}

function orState(left, right) {
  if (left === REQUIREMENT_BOOLEAN.true || right === REQUIREMENT_BOOLEAN.true) {
    return REQUIREMENT_BOOLEAN.true;
  }

  if (left === REQUIREMENT_BOOLEAN.unknown || right === REQUIREMENT_BOOLEAN.unknown) {
    return REQUIREMENT_BOOLEAN.unknown;
  }

  return REQUIREMENT_BOOLEAN.false;
}

function stripOuterParentheses(value) {
  let text = value.trim();

  while (text.startsWith('(') && text.endsWith(')')) {
    let depth = 0;
    let balanced = true;

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];

      if (character === '(') {
        depth += 1;
      } else if (character === ')') {
        depth -= 1;

        if (depth === 0 && index < text.length - 1) {
          balanced = false;
          break;
        }
      }

      if (depth < 0) {
        balanced = false;
        break;
      }
    }

    if (!balanced || depth !== 0) {
      break;
    }

    text = text.slice(1, -1).trim();
  }

  return text;
}

function stripTrailingAdvisoryText(value) {
  let cutoff = value.length;

  for (const marker of ADVISORY_MARKERS) {
    const index = value.indexOf(marker);

    if (index !== -1) {
      cutoff = Math.min(cutoff, index);
    }
  }

  return value.slice(0, cutoff);
}

function normalizeRequirementText(raw) {
  if (!raw || typeof raw !== 'string') {
    return '';
  }

  let text = raw.toUpperCase();

  text = text
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')')
    .replace(/[;,]/g, ' ')
    .replace(/\./g, ' ')
    .replace(/(\d{4})\s*-\s*(\d{4})/g, '$1 TO $2')
    .replace(/(\d{4})\s*-\s*LEVEL/g, '$1 LEVEL')
    .replace(/(\d{4})\s+LEVEL\s+OR\s+ABOVE/g, '$1 LEVEL_OR_ABOVE')
    .replace(/\bINCLUDING AT LEAST\s+/g, ' AND ')
    .replace(/\bAT LEAST\s+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  text = stripTrailingAdvisoryText(text);

  for (const pattern of REVIEW_SEGMENT_PATTERNS) {
    text = text.replace(pattern, ' REVIEW ');
  }

  text = text
    .replace(/\bOR\s+EQUIVALENT(?:\s+UNIT\s+OF\s+STUDY)?\b/g, ' OR REVIEW ')
    .replace(/\bHSC\b[^()]*$/g, ' REVIEW ')
    .replace(/\bIB\b[^()]*$/g, ' REVIEW ')
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}

function getUnitLevel(unitId) {
  const level = Number(String(unitId).slice(4, 5));
  return Number.isFinite(level) ? level : null;
}

function sumCredits(items, predicate) {
  return items.reduce((total, item) => {
    if (!predicate(item)) {
      return total;
    }

    const credit = Number(item.credit ?? 0);
    return total + (Number.isFinite(credit) ? credit : 0);
  }, 0);
}

function matchUnitPattern(unitId, pattern) {
  const safeUnitId = String(unitId ?? '');
  const safePattern = String(pattern ?? '').trim();

  if (!safeUnitId || !safePattern) {
    return false;
  }

  const regexPattern = safePattern.replace(/X/g, '\\d');
  return new RegExp(`^${regexPattern}$`).test(safeUnitId);
}

function splitTopLevelByKeyword(value, keyword) {
  const parts = [];
  let depth = 0;
  let lastIndex = 0;
  let index = 0;

  while (index < value.length) {
    const character = value[index];

    if (character === '(') {
      depth += 1;
      index += 1;
      continue;
    }

    if (character === ')') {
      depth = Math.max(0, depth - 1);
      index += 1;
      continue;
    }

    if (
      depth === 0 &&
      value.startsWith(keyword, index) &&
      !/[A-Z0-9_]/.test(value[index - 1] ?? '') &&
      !/[A-Z0-9_]/.test(value[index + keyword.length] ?? '')
    ) {
      parts.push(value.slice(lastIndex, index).trim());
      index += keyword.length;
      lastIndex = index;
      continue;
    }

    index += 1;
  }

  parts.push(value.slice(lastIndex).trim());
  return parts.filter(Boolean);
}

function buildSelectorPredicate(rawSelector) {
  const selector = stripOuterParentheses(
    String(rawSelector ?? '')
      .replace(/\bUNITS OF STUDY\b/g, 'UNITS')
      .replace(/\bANY\s+/g, '')
      .trim(),
  );

  if (!selector) {
    return null;
  }

  const orParts = splitTopLevelByKeyword(selector, 'OR');
  const predicates = [];

  for (const rawPart of orParts) {
    const part = stripOuterParentheses(rawPart.trim());

    if (!part) {
      continue;
    }

    if (/^[A-Z]{4}[0-9X]{4}$/.test(part)) {
      predicates.push((item) => matchUnitPattern(item.id, part));
      continue;
    }

    let match = part.match(/^(\d{4})\s+TO\s+(\d{4})\s+LEVEL(?:\s+UNITS)?$/);

    if (match) {
      const minLevel = Math.floor(Number(match[1]) / 1000);
      const maxLevel = Math.floor(Number(match[2]) / 1000);
      predicates.push((item) => {
        const level = getUnitLevel(item.id);
        return level !== null && level >= minLevel && level <= maxLevel;
      });
      continue;
    }

    match = part.match(/^(\d{4})\s+LEVEL(?:\s+UNITS)?$/);

    if (match) {
      const levelRequirement = Math.floor(Number(match[1]) / 1000);
      predicates.push((item) => getUnitLevel(item.id) === levelRequirement);
      continue;
    }

    match = part.match(/^(\d{4})\s+LEVEL_OR_ABOVE\s+UNITS\s+FROM\s+([A-Z]+(?:\s+OR\s+[A-Z]+)*)$/);

    if (match) {
      const levelRequirement = Math.floor(Number(match[1]) / 1000);
      const prefixes = match[2].split(/\s+OR\s+/).map((token) => token.trim());
      predicates.push((item) => {
        const level = getUnitLevel(item.id);
        return level !== null && level >= levelRequirement && prefixes.includes(String(item.id).slice(0, 4));
      });
      continue;
    }

    return null;
  }

  if (predicates.length === 0) {
    return null;
  }

  return (item) => predicates.some((predicate) => predicate(item));
}

function evaluateRequirementTerm(rawTerm, context) {
  const term = stripOuterParentheses(String(rawTerm ?? '').trim());

  if (!term) {
    return REQUIREMENT_BOOLEAN.unknown;
  }

  if (term === 'REVIEW') {
    return REQUIREMENT_BOOLEAN.unknown;
  }

  if (/^[A-Z]{4}[0-9X]{4}$/.test(term)) {
    return context.items.some((planItem) => matchUnitPattern(planItem.id, term))
      ? REQUIREMENT_BOOLEAN.true
      : REQUIREMENT_BOOLEAN.false;
  }

  let match = term.match(/^(\d+)\s*(?:CP|CREDIT POINTS?)$/);

  if (match) {
    const requiredCredits = Number(match[1]);
    return sumCredits(context.items, () => true) >= requiredCredits
      ? REQUIREMENT_BOOLEAN.true
      : REQUIREMENT_BOOLEAN.false;
  }

  match = term.match(/^(\d+)\s*(?:CP|CREDIT POINTS?)\s+(?:OF|FROM|AT)\s+(.+)$/);

  if (match) {
    const requiredCredits = Number(match[1]);
    const selector = buildSelectorPredicate(match[2]);

    if (!selector) {
      return REQUIREMENT_BOOLEAN.unknown;
    }

    return sumCredits(context.items, selector) >= requiredCredits
      ? REQUIREMENT_BOOLEAN.true
      : REQUIREMENT_BOOLEAN.false;
  }

  match = term.match(/^(\d+)\s*(?:CP|CREDIT POINTS?)\s+(\d{4})\s+TO\s+(\d{4})\s+LEVEL(?:\s+UNITS)?$/);

  if (match) {
    const requiredCredits = Number(match[1]);
    const minLevel = Math.floor(Number(match[2]) / 1000);
    const maxLevel = Math.floor(Number(match[3]) / 1000);
    return sumCredits(context.items, (item) => {
      const level = getUnitLevel(item.id);
      return level !== null && level >= minLevel && level <= maxLevel;
    }) >= requiredCredits
      ? REQUIREMENT_BOOLEAN.true
      : REQUIREMENT_BOOLEAN.false;
  }

  if (
    /\b(REVIEW|AVERAGE|MARK|WAM|PERCENT|%|PERMISSION|INVITATION|EQUIVALENT|HSC|IB|BACKGROUND|NATIVE|TERTIARY)\b/.test(
      term,
    )
  ) {
    return REQUIREMENT_BOOLEAN.unknown;
  }

  if (/\b[A-Z]{4}[0-9X]{4}\b/.test(term) || /\b\d+\s*(?:CP|CREDIT POINTS?)\b/.test(term)) {
    return REQUIREMENT_BOOLEAN.unknown;
  }

  return REQUIREMENT_BOOLEAN.false;
}

function isClauseBoundaryAfterOr(value, index) {
  let cursor = index;

  while (cursor < value.length && /\s/.test(value[cursor])) {
    cursor += 1;
  }

  if (cursor >= value.length) {
    return true;
  }

  if (value[cursor] === '(') {
    return true;
  }

  const next = value.slice(cursor);
  return (
    /^REVIEW\b/.test(next) ||
    /^[A-Z]{4}[0-9X]{4}\b/.test(next) ||
    /^\d+\s*(?:CP|CREDIT POINTS?)\b/.test(next)
  );
}

function shouldBreakOnOr(termPrefix, value, index) {
  if (!isClauseBoundaryAfterOr(value, index)) {
    return false;
  }

  if (/^\d+\s*(?:CP|CREDIT POINTS?)\s+(?:OF|FROM|AT)\s+/i.test(termPrefix.trim())) {
    const next = value.slice(index).trimStart();
    return next.startsWith('(') || /^REVIEW\b/.test(next) || /^\d+\s*(?:CP|CREDIT POINTS?)\b/.test(next);
  }

  return true;
}

function isStandaloneKeyword(value, index, keyword) {
  return (
    value.startsWith(keyword, index) &&
    !/[A-Z0-9_]/.test(value[index - 1] ?? '') &&
    !/[A-Z0-9_]/.test(value[index + keyword.length] ?? '')
  );
}

function evaluateRequirementExpression(rawExpression, context) {
  const input = normalizeRequirementText(rawExpression);

  if (!input) {
    return REQUIREMENT_BOOLEAN.false;
  }

  let position = 0;

  const skipWhitespace = () => {
    while (position < input.length && /\s/.test(input[position])) {
      position += 1;
    }
  };

  const parsePrimary = () => {
    skipWhitespace();

    if (position >= input.length) {
      return REQUIREMENT_BOOLEAN.unknown;
    }

    if (input[position] === '(') {
      position += 1;
      const nested = parseOr();
      skipWhitespace();

      if (input[position] === ')') {
        position += 1;
        return nested;
      }

      return REQUIREMENT_BOOLEAN.unknown;
    }

    const start = position;
    let depth = 0;

    while (position < input.length) {
      const character = input[position];

      if (character === '(') {
        depth += 1;
        position += 1;
        continue;
      }

      if (character === ')') {
        if (depth === 0) {
          break;
        }

        depth -= 1;
        position += 1;
        continue;
      }

      if (depth === 0 && isStandaloneKeyword(input, position, 'AND')) {
        break;
      }

      if (
        depth === 0 &&
        isStandaloneKeyword(input, position, 'OR') &&
        shouldBreakOnOr(input.slice(start, position), input, position + 2)
      ) {
        break;
      }

      position += 1;
    }

    return evaluateRequirementTerm(input.slice(start, position), context);
  };

  const parseAnd = () => {
    let result = parsePrimary();

    while (true) {
      skipWhitespace();

      if (!isStandaloneKeyword(input, position, 'AND')) {
        break;
      }

      position += 3;
      result = andState(result, parsePrimary());
    }

    return result;
  };

  const parseOr = () => {
    let result = parseAnd();

    while (true) {
      skipWhitespace();

      if (!isStandaloneKeyword(input, position, 'OR') || !isClauseBoundaryAfterOr(input, position + 2)) {
        break;
      }

      position += 2;
      result = orState(result, parseAnd());
    }

    return result;
  };

  const result = parseOr();
  skipWhitespace();

  return position < input.length ? REQUIREMENT_BOOLEAN.unknown : result;
}

function resolveRequirementState(rawExpression, context, invert = false) {
  if (!String(rawExpression ?? '').trim()) {
    return REQUIREMENT_STATE.met;
  }

  return toRequirementState(evaluateRequirementExpression(rawExpression, context), invert);
}

function isBefore(a, b) {
  return a.year < b.year || (a.year === b.year && compareSemesterOrder(a.semester, b.semester) < 0);
}

function isBeforeOrSame(a, b) {
  return (
    a.year < b.year || (a.year === b.year && compareSemesterOrder(a.semester, b.semester) <= 0)
  );
}

export function buildRequirementStatusMap(items) {
  const statusMap = new Map();
  const validItems = Array.isArray(items) ? items : [];
  const sorted = [...validItems].sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }

    return compareSemesterOrder(a.semester, b.semester);
  });

  for (const item of sorted) {
    const prereqContext = {
      items: sorted.filter((planItem) => isBefore(planItem, item)),
    };

    const coreqContext = {
      items: sorted.filter((planItem) => isBeforeOrSame(planItem, item)),
    };

    const prohibitionContext = {
      items: sorted.filter((planItem) => planItem.id !== item.id),
    };

    const pState = resolveRequirementState(item.P, prereqContext);
    const cState = resolveRequirementState(item.C, coreqContext);
    const nState = resolveRequirementState(item.N, prohibitionContext, true);
    const hasConflict =
      !item.ignore_warning &&
      [pState, cState, nState].some((state) => state === REQUIREMENT_STATE.unmet);
    const needsReview = [pState, cState, nState].some((state) => state === REQUIREMENT_STATE.review);

    statusMap.set(item.id, {
      pState,
      cState,
      nState,
      pMet: pState === REQUIREMENT_STATE.met,
      cMet: cState === REQUIREMENT_STATE.met,
      nMet: nState === REQUIREMENT_STATE.met,
      hasConflict,
      needsReview,
    });
  }

  return statusMap;
}

export function normalizeItem(rawItem, fallback = {}) {
  return {
    ...rawItem,
    ...fallback,
    ignore_warning: Boolean(rawItem?.ignore_warning),
  };
}
