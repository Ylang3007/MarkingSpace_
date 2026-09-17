import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import XLSX from 'xlsx';
import { DATA_CONFIG } from '../data/data-config';
import {
  getMissingRequiredSourceFields,
  getRequiredSourceFields,
} from '../src/config/sourceFields';
import {
  buildFundRecord,
  compareLabels,
  isFinanceTagLabel,
  parseSourceLabels,
  trimText,
} from '../src/data/normalizeFundRow';
import { validateFundRecords } from '../src/data/fundRecordValidation';
import type { FundRecord, LabelItem } from '../src/domain/fundTypes';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const sourcePath = path.join(projectRoot, DATA_CONFIG.sourceFileName);
const outputDirectory = path.join(projectRoot, 'public', 'data');
const outputPath = path.join(outputDirectory, DATA_CONFIG.outputFileName);

interface RawRow {
  [header: string]: unknown;
}

interface ParsedSheet {
  headers: string[];
  rows: RawRow[];
}

function normalizeHeader(header: string): string {
  return header.replace(/^\uFEFF/, '').trim();
}

function hasRequiredSourceValue(row: RawRow): boolean {
  return getRequiredSourceFields().some((field) => {
    const value = row[field];
    return (
      value !== null &&
      value !== undefined &&
      String(value).trim() !== ''
    );
  });
}

function readSheet(): ParsedSheet {
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`未找到数据源文件：${sourcePath}`);
  }

  const workbook = XLSX.readFile(sourcePath, {
    cellDates: false,
    cellNF: false,
    cellText: false,
  });

  const sheetName = DATA_CONFIG.dataSheetName;
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    throw new Error(
      `未找到工作表 ${sheetName}，当前工作簿包含：${workbook.SheetNames.join('、')}`,
    );
  }

  const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    defval: null,
    raw: true,
  });

  const rawHeaders = matrix[0] ?? [];
  const headers = rawHeaders.map((header) =>
    normalizeHeader(trimText(header)),
  );
  const seenHeaders = new Set<string>();
  for (const header of headers) {
    if (!header) continue;
    if (seenHeaders.has(header)) {
      throw new Error(`字段名重复：${header}`);
    }
    seenHeaders.add(header);
  }

  const rows = matrix
    .slice(1)
    .map((values) => {
      const row: RawRow = {};
      headers.forEach((header, index) => {
        if (header) {
          row[header] = values[index];
        }
      });
      return row;
    })
    .filter(hasRequiredSourceValue);

  return { headers, rows };
}

function toFundRecord(
  row: RawRow,
): FundRecord {
  const getCell = (sourceField: string): unknown => {
    return row[sourceField];
  };
  return buildFundRecord(getCell);
}

function toSourceLabels(
  row: RawRow,
): { coreLabels: LabelItem[]; relatedLabels: LabelItem[] } {
  const getCell = (sourceField: string): unknown => {
    return row[sourceField];
  };
  return parseSourceLabels(getCell);
}

function formatLocalIso(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}+08:00`;
}

function checkSourceHeaders(headers: string[]): void {
  const missing = getMissingRequiredSourceFields(headers);
  if (missing.length > 0) {
    throw new Error(`缺失必填字段：${missing.join('、')}`);
  }
}

function logSourceConsistency(
  fund: FundRecord,
  sourceCore: LabelItem[],
  sourceRelated: LabelItem[],
): void {
  const coreMatches = compareLabels(fund.coreLabels, sourceCore);
  const relatedMatches = compareLabels(fund.relatedLabels, sourceRelated);
  if (coreMatches && relatedMatches) return;

  console.warn(
    `[数据核验] ${fund.fundCode} 源表标签与重算结果不一致：` +
      `源表核心=[${sourceCore.map((item) => item.label).join(',')}]，` +
      `重算核心=[${fund.coreLabels.map((item) => item.label).join(',')}]；` +
      `源表关联=[${sourceRelated.map((item) => item.label).join(',')}]，` +
      `重算关联=[${fund.relatedLabels.map((item) => item.label).join(',')}]`,
  );
}

function validateSourceLabelsAreKnown(
  coreLabels: LabelItem[],
  relatedLabels: LabelItem[],
): void {
  const unknownLabels = [...coreLabels, ...relatedLabels]
    .filter((item) => !isFinanceTagLabel(item.label))
    .map((item) => item.label);
  if (unknownLabels.length > 0) {
    console.warn(`[数据核验] 忽略未知源表标签：${unknownLabels.join('、')}`);
  }
}

function run(): void {
  const { headers, rows } = readSheet();
  if (rows.length === 0) {
    throw new Error('数据源工作表中没有有效记录');
  }

  checkSourceHeaders(headers);

  const funds: FundRecord[] = [];
  for (const row of rows) {
    const fund = toFundRecord(row);
    funds.push(fund);

    const sourceLabels = toSourceLabels(row);
    validateSourceLabelsAreKnown(
      sourceLabels.coreLabels,
      sourceLabels.relatedLabels,
    );
    logSourceConsistency(fund, sourceLabels.coreLabels, sourceLabels.relatedLabels);
  }

  validateFundRecords(funds);

  const payload = {
    meta: {
      asOfDate: DATA_CONFIG.asOfDate,
      generatedAt: formatLocalIso(new Date()),
      recordCount: funds.length,
      ruleVersion: DATA_CONFIG.ruleVersion,
    },
    funds,
  };

  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(
    `[数据转换] 已生成 ${outputPath}，共 ${funds.length} 条基金记录。`,
  );
}

try {
  run();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[数据转换失败] ${message}`);
  process.exit(1);
}
