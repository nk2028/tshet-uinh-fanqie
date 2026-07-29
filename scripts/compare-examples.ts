import assert from 'node:assert/strict';

import TshetUinh, { defaultLogger } from 'tshet-uinh';
import { 推導設定 } from 'tshet-uinh-deriver-tools';
import type { 推導方案 } from 'tshet-uinh-deriver-tools';
import { gwongzau as examples廣州話, putonghua as examples普通話, zaonhe as examples上海話 } from 'tshet-uinh-examples';

import { 推導上海話, 上海話選項列表 } from '../src/lib/推導上海話';
import { 推導廣州話, 廣州話選項列表 } from '../src/lib/推導廣州話';
import { 推導普通話, 普通話選項列表 } from '../src/lib/推導普通話';
import { 篩選顯示設定項 } from '../src/lib/推導選項';

type 選項 = Record<string, unknown>;
type 字串推導方案 = 推導方案<string>;
interface 本地方案 {
  推導: (音韻地位: TshetUinh.音韻地位, 選項?: Readonly<選項>) => string;
  選項列表: readonly unknown[];
}
type 方案測試項目 = readonly [名稱: string, 本地方案: 本地方案, examples方案: 字串推導方案];

const 方案們: readonly 方案測試項目[] = [
  ['普通話', { 推導: 推導普通話, 選項列表: 普通話選項列表 }, examples普通話],
  ['廣州話', { 推導: 推導廣州話, 選項列表: 廣州話選項列表 }, examples廣州話],
  ['上海話', { 推導: 推導上海話, 選項列表: 上海話選項列表 }, examples上海話],
];

const 所有音韻地位 = Array.from(TshetUinh.資料.iter音韻地位());

function serialize(value: unknown): string {
  return (
    JSON.stringify(value, (_key: string, item: unknown) => {
      if (Object.is(item, -0)) return '-0';
      if (typeof item === 'number' && Number.isNaN(item)) return 'NaN';
      return item;
    }) ?? String(value)
  );
}

function collectOptionCases(方案: 字串推導方案): 選項[] {
  const cases = new Map<string, 選項>();
  const seenSettings = new Set<string>();
  const queue: 選項[] = [{}];

  while (queue.length > 0) {
    const suppliedOptions = queue.shift()!;
    const rawSettings = 方案.方案設定(suppliedOptions);
    const settings = rawSettings.with(suppliedOptions);
    const actualOptions = { ...settings.選項 };
    cases.set(serialize(actualOptions), actualOptions);

    const settingsShape = serialize(rawSettings.列表);
    if (seenSettings.has(settingsShape)) continue;
    seenSettings.add(settingsShape);

    for (const item of settings.列表) {
      if (!('key' in item) || item.hidden) continue;

      let values: unknown[] = [item.value];
      if (item.options) values = item.options.map(option => option.value);
      else if (typeof item.value === 'boolean') values = [false, true];

      for (const value of values) {
        const optionCase = { ...actualOptions, [item.key]: value };
        const key = serialize(optionCase);
        if (!cases.has(key)) {
          cases.set(key, optionCase);
          queue.push(optionCase);
        }
      }
    }
  }

  return [...cases.values()];
}

for (const [名稱, 本地方案, examples方案] of 方案們) {
  const optionCases = collectOptionCases(examples方案);
  let hasExplanation = false;

  for (const 選項 of optionCases) {
    const 本地原始設定 = new 推導設定(本地方案.選項列表).with(選項);
    const examples設定 = examples方案.方案設定(選項).with(選項);
    assert.deepEqual(
      篩選顯示設定項(本地原始設定.列表),
      examples設定.列表,
      `${名稱}的可見選項列表不一致；選項：${serialize(選項)}`
    );
    assert.deepEqual(
      Object.fromEntries(Object.keys(examples設定.選項).map(key => [key, 本地原始設定.選項[key]])),
      examples設定.選項,
      `${名稱}的已解析選項不一致；選項：${serialize(選項)}`
    );

    const examples推導 = examples方案(選項);
    defaultLogger.enable = true;

    for (const 音韻地位 of 所有音韻地位) {
      const actual = 本地方案.推導(音韻地位, 選項);
      const explanation = defaultLogger.popAll();
      if (explanation.length > 0) hasExplanation = true;
      const expected = examples推導(音韻地位);
      // Convert the UI-friendly 文/白 labels back to the newline format used by tshet-uinh-examples.
      const comparableActual = 名稱 === '上海話' ? actual.replace(/^(.*)\(文\) (.*)\(白\)$/, '$1\n$2') : actual;
      assert.equal(comparableActual, expected, `${名稱}推導結果不一致；選項：${serialize(選項)}；音韻地位：${音韻地位.描述}`);
    }
  }

  defaultLogger.enable = false;
  assert.ok(hasExplanation, `${名稱}未透過 defaultLogger 產生解釋`);
  console.log(`${名稱}：${optionCases.length} 組選項 × ${所有音韻地位.length} 個音韻地位，結果一致`);
}
