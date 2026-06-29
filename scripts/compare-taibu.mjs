import { readFileSync } from 'node:fs';
import Module from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';
import TshetUinh, { defaultLogger } from 'tshet-uinh';
import { taibu } from 'tshet-uinh-examples';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const localPath = resolve(root, 'src/lib/推導大埔話.ts');

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

const 推導大埔話 = localModule.exports.default;
const 所有地位 = Array.from(TshetUinh.資料.iter音韻地位());
const 選項組們 = cartesian({
  文白讀: ['文上白下', '僅白讀', '僅文讀'],
  音標: ['客家語拼音方案 (臺灣客拼)', '國際音標 (IPA)'],
  標調方式: ['數字調號', '符號調號', '數字調值', '折線調值'],
});

defaultLogger.enable = false;

const 相異 = [];

for (const 選項 of 選項組們) {
  const examples推導大埔話 = taibu(選項);
  for (const 音韻地位 of 所有地位) {
    const examples結果 = call(() => examples推導大埔話(音韻地位, null), 音韻地位);
    const local結果 = call(() => 推導大埔話(音韻地位, 選項), 音韻地位);

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

if (相異.length) {
  console.error(`推導大埔話與 tshet-uinh-examples/taibu 有 ${相異.length} 個相異項目。`);
  for (const item of 相異.slice(0, 50)) {
    console.error(`${item.描述}\t${JSON.stringify(item.選項)}\texamples=${JSON.stringify(item.examples結果)}\tlocal=${JSON.stringify(item.local結果)}`);
  }
  if (相異.length > 50) console.error(`...另有 ${相異.length - 50} 個相異項目`);
  process.exitCode = 1;
} else {
  console.log(`推導大埔話一致性測試通過：${所有地位.length} 個音韻地位 × ${選項組們.length} 組選項。`);
}

function call(fn, 音韻地位) {
  try {
    return fn();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return `THROW:${音韻地位.描述}:${message}`;
  }
}

function cartesian(options) {
  return Object.entries(options).reduce(
    (rows, [key, values]) => rows.flatMap(row => values.map(value => ({ ...row, [key]: value }))),
    [{}],
  );
}
