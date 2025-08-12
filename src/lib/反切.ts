import TshetUinh, { defaultLogger, 執行反切, 音韻地位, 音韻地位2韻鏡位置, 韻鏡位置 } from 'tshet-uinh';
import { 韻鏡位置2字頭 } from './韻鏡資料';

function removeDuplicates<T>(arr: T[]): T[] {
    const seen = new Set<T>();
    return arr.filter(item => {
        if (seen.has(item)) return false;
        seen.add(item);
        return true;
    });
}

const 音韻地位2小韻號字頭Map = new Map<string, string[] | null>();

for (let i = 1; i <= 3874; i++) {
  const 條目 = TshetUinh.資料.廣韻.get小韻(`${i}`);
  if (條目 && 條目.length && 條目[0].音韻地位) {
    音韻地位2小韻號字頭Map.set(條目[0].音韻地位.描述, [`${i}`, 條目[0].字頭]);
  }
}

const 音韻地位2小韻號 = (當前音韻地位: 音韻地位): string[] | null => {
  return 音韻地位2小韻號字頭Map.get(當前音韻地位.描述) || null;
};

const 小韻號2小韻Url = (小韻號: string): string | null => {
  return /^[0-9]+$/.test(小韻號) ? `https://ytenx.org/kyonh/sieux/${Number(小韻號)}/` : null;
};

const generate韻鏡Url = (當前韻鏡位置: 韻鏡位置): string => {
  const urlOffset = 9;
  return `https://hiunnkyanq-1305783649.cos.accelerate.myqcloud.com/%E5%8F%A4%E9%80%B8%E5%8F%A2%E6%9B%B8%E6%9C%AC/thumb/${
    當前韻鏡位置.轉號 + urlOffset
  }.png`;
};

const 取得音韻地位 = (字: string, 當前音韻地位: 音韻地位): 音韻地位 | undefined => {
  try {
    const 資料 = TshetUinh.資料.query字頭(字).find(({ 音韻地位 }) => 音韻地位.等於(當前音韻地位))!;
    const 小韻號 = 資料.來源!.小韻號;
    const 小韻所有字 = TshetUinh.資料.廣韻.get小韻(小韻號)!.map(({ 字頭 }) => 字頭);
    const 韻鏡位置 = 音韻地位2韻鏡位置(當前音韻地位);
    const 韻鏡位置字頭 = 韻鏡位置2字頭(韻鏡位置);
    if (!韻鏡位置字頭 || !小韻所有字.includes(韻鏡位置字頭)) {
      defaultLogger.log(`無法使用常規方法獲取「${字}」的音韻地位，使用數據庫中已有的音韻地位「${當前音韻地位.描述}」`);
      return undefined;
    }
    const 對應小韻首字 = 字 !== 小韻所有字[0] ? `《廣韻》「${字}」屬於${小韻所有字[0]}小韻，` : '';
    const 小韻首字對應韻鏡位置字頭 = 小韻所有字[0] !== 韻鏡位置字頭 ? `該小韻包含「${韻鏡位置字頭}」字，` : '';
    const 對應 = 字 !== 韻鏡位置字頭 ? `${對應小韻首字}${小韻首字對應韻鏡位置字頭}` : '';
    defaultLogger.log(`${對應}在《韻鏡》中查得「${韻鏡位置字頭}」字位於韻鏡位置 ${韻鏡位置.描述}`);
    defaultLogger.log(`![韻鏡《古逸叢書本》第 ${韻鏡位置.轉號} 轉](${generate韻鏡Url(韻鏡位置)})`);
    const 當前音韻地位2 = 韻鏡位置.to音韻地位();
    const 小韻Url = 小韻號2小韻Url(小韻號);
    if (小韻Url) {
      defaultLogger.log(`故韻鏡位置 ${韻鏡位置.描述} 對應的切韻音系音韻地位為「[${當前音韻地位.描述}](${小韻Url})」`);
    } else {
      defaultLogger.log(`故韻鏡位置 ${韻鏡位置.描述} 對應的切韻音系音韻地位為「${當前音韻地位.描述}」`);
    }
    return 當前音韻地位2;
  } catch (e) {
    void e;
    defaultLogger.popAll();
    return undefined;
  }
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

  取得音韻地位(上字, 上字音韻地位);
  過程.push('# 確定上字的音韻地位');
  過程.push(defaultLogger.popAll().join('\n\n'));

  取得音韻地位(下字, 下字音韻地位);
  過程.push('# 確定下字的音韻地位');
  過程.push(defaultLogger.popAll().join('\n\n'));

  過程.push('# 根據上下字音韻地位得出被切字音韻地位');
  const 結果 = 執行反切(上字音韻地位, 下字音韻地位);
  defaultLogger.log(
    `因此，被切字的音韻地位為${結果
      .map(當前音韻地位 => {
        const 小韻號字頭 = 音韻地位2小韻號(當前音韻地位);
        if (!小韻號字頭) {
          return `「${當前音韻地位.描述}」`;
        }
        const [小韻號, 字頭] = 小韻號字頭;
        return `「[${當前音韻地位.描述}](${小韻號2小韻Url(小韻號)})」（${字頭}）`;
      })
      .join(', ')}`
  );
  過程.push(defaultLogger.popAll().join('\n\n'));

  過程.push('# 根據被切字音韻地位推導現代音');
  const 推導結果 = 結果.map(當前音韻地位 => 推導現代音(當前音韻地位));
  過程.push(defaultLogger.popAll().join('\n\n'));

  defaultLogger.enable = false;
  return { 結果: removeDuplicates(推導結果), 過程: 過程.join('\n\n') };
};
