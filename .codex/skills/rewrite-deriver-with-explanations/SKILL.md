---
name: rewrite-deriver-with-explanations
description: Use when rewriting a tshet-uinh derivation scheme to add rule-by-rule explanations, logger output, option-aware behavior, or parity tests while preserving the scheme's original derived readings exactly.
---

# Rewrite Deriver With Explanations

## Overview

Use this skill when converting a compact tshet-uinh derivation scheme into a more explanatory implementation. The goal is to make every derivation step auditable without changing the readings, options, or output format.

## Workflow

1. Establish the behavioral baseline before editing.
   - Locate the local scheme and any upstream/reference implementation.
   - Inspect the scheme options and enumerate meaningful option combinations.
   - Add or run a comparison test over `TshetUinh.資料.iter音韻地位()` before trusting a refactor.

2. Refactor rules without changing semantics.
   - Keep the original order of rule matching unless a test proves the order is irrelevant.
   - Convert returned strings into structured rule results such as `{ 聲母, 解釋 }`, `{ 韻母, 解釋 }`, and `{ 聲調, 解釋 }`.
   - Split ternaries and broad compound branches when different outcomes need different explanations.
   - Preserve tshet-uinh condition semantics exactly; use parentheses in `屬於` strings when boolean grouping matters, such as `平聲 (全清 或 次清)`.

3. Write explanations at the rule level.
   - Each rule branch should explain the actual matched condition and resulting value.
   - Avoid generic messages like `依某方案規則，推導為...` when the rule condition is known.
   - Keep readable spaces and parentheses in condition names, for example `幫母 (東韻 三等 或 鍾微虞廢文元陽尤凡韻) 文讀`.
   - Add `文讀` or `白讀` only when the rule distinguishes the reading layer; omit it when the rule is shared.
   - Do not log redundant "初步推導結果" messages unless the existing scheme relies on that explanation.

4. Explain post-processing separately.
   - If the scheme changes a coda, tone mark, romanization system, IPA output, or display format after initial rule matching, log that transformation as its own step.
   - Spell out the actual branch condition for post-processing rules. For example, do not say `ii 按聲母分別轉為 ɿ 或 ʅ`; say `ii 接平舌聲母 z/c/s 轉為 ɿ` and `ii 接非平舌聲母轉為 ʅ`.
   - Keep formatting behavior in the deriver identical to the reference; UI-only formatting belongs in the UI layer.

5. Validate parity and types.
   - Compare the rewritten scheme against the reference across all 音韻地位 and option combinations.
   - When differences appear, print the 音韻地位, option set, expected result, and actual result for the first several mismatches.
   - Run the repo's relevant tests, then `npx tsc --noEmit` and `npm run build` when frontend or exported APIs are affected.
   - If TypeScript races with a framework build that regenerates type files, rerun `npx tsc --noEmit` by itself.

## Comparison Test Pattern

Prefer a direct parity test when a reference scheme is available:

```js
for (const 音韻地位 of TshetUinh.資料.iter音韻地位()) {
  for (const 選項 of 選項組合) {
    const expected = referenceDeriver(音韻地位, 選項);
    const actual = localDeriver(音韻地位, 選項);
    if (actual !== expected) {
      mismatches.push({ 音韻地位: 音韻地位.描述, 選項, expected, actual });
    }
  }
}
```

Use the test output to guide the refactor. Do not "fix" mismatches by changing the reference contract unless the user explicitly asks for a deliberate behavior change.
