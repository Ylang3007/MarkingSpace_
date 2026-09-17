import { FINANCE_TAGS, type FinanceTag } from '../config/financeTags';
import type { TagRatioItem } from '../domain/fundTypes';
import { formatPercent } from '../utils/format';

interface TagRatioListProps {
  items: TagRatioItem[];
  emphasis?: 'high' | 'medium';
  emptyText?: string;
}

function getTagOrder(label: FinanceTag): number {
  const index = FINANCE_TAGS.findIndex((tag) => tag.label === label);
  return index >= 0 ? index : FINANCE_TAGS.length;
}

function getTagColor(label: FinanceTag): string {
  return FINANCE_TAGS.find((tag) => tag.label === label)?.color ?? '#6B7280';
}

export function sortTagRatioItems(
  items: TagRatioItem[],
): TagRatioItem[] {
  return [...items].sort((a, b) => {
    const ratioDiff = b.ratio - a.ratio;
    if (ratioDiff !== 0) return ratioDiff;
    return getTagOrder(a.label) - getTagOrder(b.label);
  });
}

export function TagRatioList({
  items,
  emphasis = 'medium',
  emptyText = '暂无',
}: TagRatioListProps) {
  const sortedItems = sortTagRatioItems(items);

  if (sortedItems.length === 0) {
    return <span className="text-sm text-muted">{emptyText}</span>;
  }

  const high = emphasis === 'high';

  return (
    <div className="flex flex-wrap gap-1.5">
      {sortedItems.map((item) => (
        <span
          key={item.label}
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${
            high ? 'text-sm font-medium' : 'text-xs'
          }`}
          style={{
            borderColor: `${getTagColor(item.label)}${high ? '99' : '55'}`,
            backgroundColor: `${getTagColor(item.label)}${high ? '1F' : '12'}`,
            color: getTagColor(item.label),
          }}
        >
          {item.label}
          <span className="tabular-nums">{formatPercent(item.ratio)}</span>
        </span>
      ))}
    </div>
  );
}
