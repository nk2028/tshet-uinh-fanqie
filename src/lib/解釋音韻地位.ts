import TshetUinh, { defaultLogger, 音韻地位, 音韻地位2韻鏡位置, 韻鏡位置 } from 'tshet-uinh';
import { 韻鏡位置2字頭 } from './韻鏡資料';
import { 音韻地位2所有王三小韻 } from './王三資料';

const 王三頁碼2書影Url = (小韻號: string): string[] => {
  return [
    `https://cethiunn-1305783649.cos.accelerate.myqcloud.com/王三/蘇教版/thumb/${(Number(小韻號) * 2 - 1).toString().padStart(3, '0')}.png`,
    `https://cethiunn-1305783649.cos.accelerate.myqcloud.com/王三/蘇教版/thumb/${(Number(小韻號) * 2).toString().padStart(3, '0')}.png`,
  ];
};

const generate韻鏡Url = (當前韻鏡位置: 韻鏡位置): string => {
  const urlOffset = 9;
  return `https://hiunnkyanq-1305783649.cos.accelerate.myqcloud.com/%E5%8F%A4%E9%80%B8%E5%8F%A2%E6%9B%B8%E6%9C%AC/thumb/${
    當前韻鏡位置.轉號 + urlOffset
  }.png`;
};

const 韻鏡異體字 = new Map<string, string>([['蘓', '蘇']]);

const 對應韻鏡位置字頭 = (當前音韻地位: 音韻地位): { 韻鏡位置字頭: string | undefined; 異體字處理: string } => {
  const 韻鏡位置 = 音韻地位2韻鏡位置(當前音韻地位);
  let 韻鏡位置字頭 = 韻鏡位置2字頭(韻鏡位置);
  if (!韻鏡位置字頭) {
    return { 韻鏡位置字頭: undefined, 異體字處理: '' };
  }

  let 異體字處理 = '';
  const 韻鏡位置字頭新 = 韻鏡異體字.get(韻鏡位置字頭);
  if (韻鏡位置字頭新) {
    異體字處理 = `的異體字「${韻鏡位置字頭}」`;
    韻鏡位置字頭 = 韻鏡位置字頭新;
  }

  return { 韻鏡位置字頭, 異體字處理 };
};

const 從韻鏡得出音韻地位 = (字: string, 當前音韻地位: 音韻地位, 韻鏡位置字頭: string): 音韻地位 | undefined => {
  if (字 !== 韻鏡位置字頭) return undefined;

  return 當前音韻地位;
};

const 從王三得出音韻地位 = (字: string, 當前音韻地位: 音韻地位, 韻鏡位置字頭: string): 音韻地位 | undefined => {
  const 所有王三小韻 = 音韻地位2所有王三小韻(當前音韻地位);
  if (!所有王三小韻) return undefined;

  for (const 小韻 of 所有王三小韻) {
    const 所有字 = 小韻.replace(/[0-9]/g, '');
    const 頁碼 = 小韻.match(/^[0-9]+/)![0];
    const 小韻首字 = 所有字[0]; // TODO: not accurate
    if (所有字.includes(韻鏡位置字頭) && 所有字.includes(字)) {
      const 對應 = 小韻首字 !== 韻鏡位置字頭 ? `，該小韻包含「${韻鏡位置字頭}」字` : '';
      defaultLogger.log(`「${字}」字在《王三》中屬於${小韻首字}小韻${對應}`);
      王三頁碼2書影Url(頁碼).forEach(url => {
        defaultLogger.log(`![王三（蘇教版）第 ${頁碼} 頁](${url})`);
      });
      return 當前音韻地位;
    }
  }

  return undefined;
};

const 從廣韻得出音韻地位 = (字: string, 當前音韻地位: 音韻地位, 韻鏡位置字頭: string): 音韻地位 | undefined => {
  const 資料 = TshetUinh.資料.query字頭(字).find(({ 音韻地位 }) => 音韻地位.等於(當前音韻地位));
  if (!資料) return undefined;

  const 小韻號 = 資料.來源?.小韻號;
  if (!小韻號) return undefined;

  const 所有字 = TshetUinh.資料.廣韻.get小韻(小韻號)!.map(({ 字頭 }) => 字頭);
  const 小韻首字 = 所有字[0];
  if (所有字.includes(韻鏡位置字頭) && 所有字.includes(字)) {
    const 對應 = 小韻首字 !== 韻鏡位置字頭 ? `，該小韻包含「${韻鏡位置字頭}」字` : '';
    defaultLogger.log(`「${字}」字在《廣韻》中屬於${小韻首字}小韻${對應}`);
    // TODO: 加入廣韻書影
    return 當前音韻地位;
  }
  return 當前音韻地位;
};

const 解釋字的音韻地位來源 = (字: string, 當前音韻地位: 音韻地位) => {
  const 當前韻鏡位置 = 音韻地位2韻鏡位置(當前音韻地位);
  const { 韻鏡位置字頭, 異體字處理 } = 對應韻鏡位置字頭(當前音韻地位);
  if (!韻鏡位置字頭) {
    defaultLogger.log(`無法使用常規方法獲取「${字}」的音韻地位，使用數據庫中已有的音韻地位「${當前音韻地位.描述}」`);
    return;
  }

  let a = 從韻鏡得出音韻地位(字, 當前音韻地位, 韻鏡位置字頭);
  if (!a) {
    a = 從王三得出音韻地位(字, 當前音韻地位, 韻鏡位置字頭);
    if (!a) {
      a = 從廣韻得出音韻地位(字, 當前音韻地位, 韻鏡位置字頭);
      if (!a) {
        defaultLogger.log(`無法使用常規方法獲取「${字}」的音韻地位，使用數據庫中已有的音韻地位「${當前音韻地位.描述}」`);
        return;
      }
    }
  }

  defaultLogger.log(`在《韻鏡》中查得「${韻鏡位置字頭}」字${異體字處理}位於韻鏡位置 ${當前韻鏡位置.描述}`);
  defaultLogger.log(`![韻鏡（古逸叢書本）第 ${當前韻鏡位置.轉號} 轉](${generate韻鏡Url(當前韻鏡位置)})`);
  當前韻鏡位置.to音韻地位();
  defaultLogger.log(`故韻鏡位置 ${當前韻鏡位置.描述} 對應的切韻音系音韻地位為「${當前音韻地位.描述}」`);
};

export default 解釋字的音韻地位來源;
