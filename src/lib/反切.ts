import TshetUinh, { defaultLogger, 執行反切, 音韻地位 } from 'tshet-uinh';
import 解釋字的音韻地位來源 from './解釋音韻地位';

function removeDuplicates<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  return arr.filter(item => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

const 音韻地位2廣韻小韻號_字頭Map = new Map<string, string[] | null>();

for (let i = 1; i <= 3874; i++) {
  const 條目 = TshetUinh.資料.廣韻.get小韻(`${i}`);
  if (條目 && 條目.length && 條目[0].音韻地位) {
    音韻地位2廣韻小韻號_字頭Map.set(條目[0].音韻地位.描述, [`${i}`, 條目[0].字頭]);
  }
}

const 音韻地位2廣韻小韻號_字頭 = (當前音韻地位: 音韻地位): string[] | null => {
  return 音韻地位2廣韻小韻號_字頭Map.get(當前音韻地位.描述) || null;
};

const 廣韻小韻號2小韻Url = (小韻號: string): string | null => {
  return /^[0-9]+$/.test(小韻號) ? `https://ytenx.org/kyonh/sieux/${Number(小韻號)}/` : null;
};

export const calculateFanqie = (
  推導現代音: (當前音韻地位: 音韻地位) => string,
  上字: string,
  下字: string,
  上字音韻地位: 音韻地位,
  下字音韻地位: 音韻地位
) => {
  const 過程: string[] = [];

  defaultLogger.popAll();
  defaultLogger.enable = true;

  解釋字的音韻地位來源(上字, 上字音韻地位);
  過程.push('# 確定上字的音韻地位');
  過程.push(defaultLogger.popAll().join('\n\n'));

  解釋字的音韻地位來源(下字, 下字音韻地位);
  過程.push('# 確定下字的音韻地位');
  過程.push(defaultLogger.popAll().join('\n\n'));

  過程.push('# 根據上下字音韻地位得出被切字音韻地位');
  const 結果 = 執行反切(上字音韻地位, 下字音韻地位);
  defaultLogger.log(
    `因此，被切字的音韻地位為${結果
      .map(當前音韻地位 => {
        const 廣韻小韻號_字頭 = 音韻地位2廣韻小韻號_字頭(當前音韻地位);
        if (!廣韻小韻號_字頭) {
          return `「${當前音韻地位.描述}」`;
        }
        const [廣韻小韻號, 字頭] = 廣韻小韻號_字頭;
        return `「[${當前音韻地位.描述}](${廣韻小韻號2小韻Url(廣韻小韻號)})」（${字頭}）`;
      })
      .join(', ')}`
  );
  過程.push(defaultLogger.popAll().join('\n\n'));

  過程.push('# 根據被切字音韻地位推導現代音（尚不完善）');
  const 推導結果 = 結果.map(當前音韻地位 => 推導現代音(當前音韻地位));
  過程.push(defaultLogger.popAll().join('\n\n'));

  defaultLogger.enable = false;
  return { 結果: removeDuplicates(推導結果), 過程: 過程.join('\n\n') };
};
