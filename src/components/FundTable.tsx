import { Link } from 'react-router-dom';
import { formatFundScale } from '../domain/formatters';
import type { FundRecord } from '../domain/fundTypes';
import { TagRatioList } from './TagRatioList';

export function FundTable({ funds }: { funds: FundRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-surface shadow-sm">
      <table className="w-full min-w-[960px] border-collapse text-left">
        <thead>
          <tr className="h-11 bg-slate-50 text-sm text-muted">
            <th className="px-4 py-2 font-medium">基金代码</th>
            <th className="px-4 py-2 font-medium">基金简称</th>
            <th className="px-4 py-2 font-medium">二级分类</th>
            <th className="px-4 py-2 font-medium">基金规模（亿元）</th>
            <th className="px-4 py-2 font-medium">核心标签及占比</th>
            <th className="px-4 py-2 font-medium">关联标签及占比</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((fund) => (
            <tr
              key={fund.fundCode}
              className="h-14 border-t border-line text-sm text-ink"
            >
              <td className="px-4 py-2 tabular-nums">
                <Link
                  to={`/funds/${fund.fundCode}`}
                  state={{ from: 'list' }}
                  className="text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {fund.fundCode}
                </Link>
              </td>
              <td className="max-w-[240px] px-4 py-2">
                <Link
                  to={`/funds/${fund.fundCode}`}
                  state={{ from: 'list' }}
                  title={fund.fundName}
                  className="block truncate text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {fund.fundName}
                </Link>
              </td>
              <td className="px-4 py-2">{fund.secondaryCategory}</td>
              <td className="px-4 py-2 tabular-nums">
                {formatFundScale(fund.fundScale)}
              </td>
              <td className="px-4 py-2">
                <TagRatioList
                  items={fund.coreLabels}
                  emphasis="high"
                  emptyText="暂无核心标签"
                />
              </td>
              <td className="px-4 py-2">
                <TagRatioList
                  items={fund.relatedLabels}
                  emphasis="medium"
                  emptyText="暂无关联标签"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
