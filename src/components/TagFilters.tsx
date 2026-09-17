import { FINANCE_TAGS, type FinanceTagConfig } from '../config/financeTags';
import { useFundPoolState } from '../state/FundPoolState';

interface TagToggleButtonProps {
  tag: FinanceTagConfig;
  selected: boolean;
  onToggle: (label: string) => void;
}

function TagToggleButton({ tag, selected, onToggle }: TagToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onToggle(tag.label)}
      aria-pressed={selected}
      className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        selected
          ? 'font-medium'
          : 'border-line bg-surface text-ink hover:border-muted'
      }`}
      style={
        selected
          ? {
              backgroundColor: `${tag.color}14`,
              borderColor: tag.color,
              color: tag.color,
            }
          : undefined
      }
    >
      {selected && <span aria-hidden="true">✓</span>}
      {tag.label}
    </button>
  );
}

interface FilterChipProps {
  label: string;
  group: '核心' | '关联';
  onRemove: () => void;
}

function FilterChip({ label, group, onRemove }: FilterChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-sm text-ink">
      <span className="text-muted">{group}</span>
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 rounded-full px-1 text-muted hover:bg-line hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-label={`移除${group}标签${label}`}
      >
        ×
      </button>
    </span>
  );
}

export function TagFilters() {
  const {
    state,
    toggleCoreTag,
    toggleRelatedTag,
    removeCoreTag,
    removeRelatedTag,
    clearAll,
  } = useFundPoolState();

  const hasConditions =
    state.coreTags.length > 0 || state.relatedTags.length > 0;

  return (
    <section className="space-y-4 rounded-card border border-line bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-sm font-medium text-ink">核心标签</div>
            <div className="flex flex-wrap gap-2">
              {FINANCE_TAGS.map((tag) => (
                <TagToggleButton
                  key={tag.id}
                  tag={tag}
                  selected={state.coreTags.includes(tag.label)}
                  onToggle={toggleCoreTag}
                />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-ink">关联标签</div>
            <div className="flex flex-wrap gap-2">
              {FINANCE_TAGS.map((tag) => (
                <TagToggleButton
                  key={tag.id}
                  tag={tag}
                  selected={state.relatedTags.includes(tag.label)}
                  onToggle={toggleRelatedTag}
                />
              ))}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={clearAll}
          className="shrink-0 rounded-lg border border-line px-3 py-2 text-sm text-muted transition hover:border-muted hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          一键清空全部条件
        </button>
      </div>

      {hasConditions && (
        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          {state.coreTags.map((label) => (
            <FilterChip
              key={`core-${label}`}
              label={label}
              group="核心"
              onRemove={() => removeCoreTag(label)}
            />
          ))}
          {state.relatedTags.map((label) => (
            <FilterChip
              key={`related-${label}`}
              label={label}
              group="关联"
              onRemove={() => removeRelatedTag(label)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
