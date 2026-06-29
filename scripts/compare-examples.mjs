import { readFileSync } from 'node:fs';
import Module from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import TshetUinh, { defaultLogger } from 'tshet-uinh';
import { 推導方案 } from 'tshet-uinh-deriver-tools';
import * as examples from 'tshet-uinh-examples';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const 所有地位 = Array.from(TshetUinh.資料.iter音韻地位());

const schemes = [
  {
    名稱: '推導廣州話',
    examples導出名: 'gwongzau',
    localPath: 'src/lib/推導廣州話.ts',
  },
  {
    名稱: '推導大埔話',
    examples導出名: 'taibu',
    localPath: 'src/lib/推導大埔話.ts',
  },
];

defaultLogger.enable = false;

let 有相異 = false;

for (const scheme of schemes) {
  const 相異 = compareScheme(scheme);
  if (相異.length) {
    有相異 = true;
    console.error(`${scheme.名稱} 與 tshet-uinh-examples/${scheme.examples導出名} 有 ${相異.length} 個相異項目。`);
    for (const item of 相異.slice(0, 50)) {
      console.error(`${item.描述}\t${format選項(item.選項)}\texamples=${JSON.stringify(item.examples結果)}\tlocal=${JSON.stringify(item.local結果)}`);
    }
    if (相異.length > 50) console.error(`...另有 ${相異.length - 50} 個相異項目`);
  } else {
    console.log(`${scheme.名稱} 一致性測試通過：${所有地位.length} 個音韻地位 × ${scheme.選項組們.length} 組選項。`);
  }
}

if (有相異) process.exitCode = 1;

function compareScheme(scheme) {
  const localSchema = loadLocalSchema(resolve(root, scheme.localPath));
  const examplesSchema = examples[scheme.examples導出名];
  if (typeof examplesSchema !== 'function') throw new Error(`tshet-uinh-examples 沒有導出 ${scheme.examples導出名}`);

  scheme.選項組們 = enumerateOptionSets(examplesSchema);
  const 相異 = [];
  for (const 選項 of scheme.選項組們) {
    const examplesDeriver = examplesSchema(選項);
    const localDeriver = localSchema(選項);
    for (const 音韻地位 of 所有地位) {
      const examples結果 = call(() => examplesDeriver(音韻地位, null), 音韻地位);
      const local結果 = call(() => localDeriver(音韻地位, null), 音韻地位);

      if (examples結果 !== local結果) {
        相異.push({
          描述: 音韻地位.描述,
          選項,
          examples結果,
          local結果,
        });
      }
    }
  }
  return 相異;
}

function loadLocalSchema(localPath) {
  const source = readFileSync(localPath, 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: localPath,
  });

  const localModule = new Module(localPath);
  localModule.filename = localPath;
  localModule.paths = Module._nodeModulePaths(root);
  localModule._compile(outputText, localPath);
  return new 推導方案((選項 = {}, 音韻地位, 字頭 = null) => {
    const localDeriver = localModule.exports.default;
    if (!音韻地位) return readSettings(localDeriver, 選項);
    return localDeriver(音韻地位, 選項, 字頭);
  });
}

function readSettings(localDeriver, 選項) {
  try {
    const settings = localDeriver(選項);
    return Array.isArray(settings) ? settings : [];
  } catch {
    return [];
  }
}

function enumerateOptionSets(schema) {
  const visited = new Set();
  const complete = new Map();
  const queue = [{}];

  while (queue.length) {
    const 選項 = queue.shift();
    const key = stableStringify(選項);
    if (visited.has(key)) continue;
    visited.add(key);

    const 方案設定 = schema.方案設定(選項);
    if (方案設定.解析錯誤.length) {
      throw new Error(`選項解析錯誤：${方案設定.解析錯誤.join('; ')}`);
    }

    for (const next of expandSettings(方案設定.列表)) {
      const nextKey = stableStringify(next);
      complete.set(nextKey, next);
      if (!visited.has(nextKey)) queue.push(next);
    }
  }

  return [...complete.values()];
}

function expandSettings(settings) {
  const parameters = settings.filter(item => 'key' in item);
  return parameters.reduce(
    (rows, item) => {
      const values = 'options' in item ? item.options.map(option => option.value) : [item.value];
      return rows.flatMap(row => values.map(value => ({ ...row, [item.key]: value })));
    },
    [{}],
  );
}

function call(fn, 音韻地位) {
  try {
    return fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `THROW:${音韻地位.描述}:${message}`;
  }
}

function format選項(選項) {
  return Object.keys(選項).length === 0 ? '無選項' : JSON.stringify(選項);
}

function stableStringify(value) {
  return JSON.stringify(value, Object.keys(value).sort());
}
