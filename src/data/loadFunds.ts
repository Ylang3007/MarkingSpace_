import { fundDataPayloadSchema } from './fundSchema';
import type { FundDataPayload } from './fundSchema';

let fundsPromise: Promise<FundDataPayload> | null = null;

export function loadFunds(): Promise<FundDataPayload> {
  if (!fundsPromise) {
    fundsPromise = fetch(`${import.meta.env.BASE_URL}data/funds.normalized.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`数据文件加载失败：${response.status}`);
        }
        return response.json() as Promise<unknown>;
      })
      .then((json) => fundDataPayloadSchema.parse(json));
  }
  return fundsPromise;
}

export function resetFundsCache(): void {
  fundsPromise = null;
}
