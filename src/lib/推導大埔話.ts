// branched from https://github.com/nk2028/tshet-uinh-examples/blob/main/taibu.js

import { defaultLogger, 音韻地位 } from 'tshet-uinh';

export interface 大埔話選項 {
  文白讀: '文上白下' | '僅白讀' | '僅文讀';
  音標: '客家語拼音方案 (臺灣客拼)' | '國際音標 (IPA)';
  標調方式: '數字調號' | '符號調號' | '數字調值' | '折線調值';
}

interface 讀音 {
  聲母: string;
  韻母: string;
  聲調: string;
}

const 大埔話預設選項: 大埔話選項 = {
  文白讀: '僅文讀',
  音標: '客家語拼音方案 (臺灣客拼)',
  標調方式: '數字調號',
};

const 大埔話選項列表 = () => [
  ['文白讀', [大埔話預設選項.文白讀, '文上白下', '僅白讀', '僅文讀']],
  ['音標', [大埔話預設選項.音標, '客家語拼音方案 (臺灣客拼)', '國際音標 (IPA)']],
  ['標調方式', [大埔話預設選項.標調方式, '數字調號', '符號調號', '數字調值', '折線調值']],
];

const is音韻地位 = (value: unknown): value is 音韻地位 =>
  typeof value === 'object' && value !== null && '屬於' in value && '判斷' in value;

function 推導大埔話(選項?: Partial<大埔話選項>): readonly unknown[];
function 推導大埔話(選項: Partial<大埔話選項>, 當前音韻地位: 音韻地位): string;
function 推導大埔話(當前音韻地位: 音韻地位, 指定選項?: Partial<大埔話選項>): string;
function 推導大埔話(
  音韻地位或選項?: 音韻地位 | Partial<大埔話選項> | null,
  選項或音韻地位: 音韻地位 | Partial<大埔話選項> = {}
): string | readonly unknown[] {
  let 當前音韻地位: 音韻地位;
  let 指定選項: Partial<大埔話選項>;

  if (is音韻地位(音韻地位或選項)) {
    當前音韻地位 = 音韻地位或選項;
    指定選項 = is音韻地位(選項或音韻地位) ? {} : 選項或音韻地位;
  } else if (is音韻地位(選項或音韻地位)) {
    當前音韻地位 = 選項或音韻地位;
    指定選項 = 音韻地位或選項 ?? {};
  } else {
    return 大埔話選項列表();
  }

  const 選項 = { ...大埔話預設選項, ...指定選項 };
  const is = (...x: Parameters<typeof 當前音韻地位.屬於>) => 當前音韻地位.屬於(...x);

  const 平舌 = ['z', 'c', 's'];
  const 翹舌 = ['zh', 'ch', 'sh', 'rh'];
  const 平舌或翹舌 = 平舌.concat(翹舌);
  const 輕脣 = ['f', 'v'];
  const 翹舌或輕脣 = 翹舌.concat(輕脣);

  function 聲母規則(白讀: boolean) {
    if (is`幫母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 'f';
      return 'b';
    }
    if (is`滂母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 'f';
      return 'p';
    }
    if (is`並母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 'f';
      return 'p';
    }
    if (is`明母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 'v';
      return 'm';
    }

    if (is`端母`) return 'd';
    if (is`透母`) return 't';
    if (is`定母`) return 't';
    if (is`泥母`) return 'n';
    if (is`來母`) return 'l';

    if (is`知母`) return is`二等` ? 'z' : 'zh';
    if (is`徹母`) return is`二等` ? 'c' : 'ch';
    if (is`澄母`) return is`二等` ? 'c' : 'ch';
    if (is`孃母`) return 'n';

    if (is`精母`) return 'z';
    if (is`清母`) return 'c';
    if (is`從母`) return 'c';
    if (is`心母`) return 's';
    if (is`邪母`) {
      if (is`支脂之微韻 去聲`) return 'c';
      if (is`魚虞模東冬鍾侵韻 平聲`) return 'c';
      if (is`侯尤幽麻韻`) return 'c';
      return 's';
    }

    if (is`莊母`) return 'z';
    if (is`初母`) return 'c';
    if (is`崇母`) return 'c';
    if (is`生母`) return 's';
    if (is`俟母`) return 'c';

    if (is`章母`) return 'zh';
    if (is`昌母`) return 'ch';
    if (is`常母`) return 'sh';
    if (is`書母`) return 'sh';
    if (is`船母`) return 'sh';
    if (is`日母`) return 'ng';

    if (is`見母`) return 'g';
    if (is`溪母`) return 'k';
    if (is`羣母`) return 'k';
    if (is`疑母`) return 'ng';

    if (is`曉母`) {
      if (is`合口`) return 'f';
      if (is`三四等`) return 'x';
      return 'h';
    }
    if (is`匣母`) {
      if (is`合口 或 東模韻`) return 'f';
      if (is`開口 四等`) return 'x';
      return 'h';
    }
    if (is`影母`) {
      if (is`合口`) return 'v';
      if (is`三四等`) return 'rh';
      return '';
    }
    if (is`云母`) {
      if (is`東韻`) return 'x';
      if (is`支脂之微唐陽韻 或 魚虞模韻 平聲`) return 'v';
      return 'rh';
    }
    if (is`以母`) {
      if (is`支脂之微韻 合口`) return 'v';
      return 'rh';
    }

    throw new Error('無聲母規則');
  }

  function 韻母規則(白讀: boolean) {
    if (is`東冬鍾韻 幫組`) return 'ung';
    if (is`東冬鍾韻 一等`) return 'ung';
    if (is`東冬鍾韻 三等`) return 'iung';

    if (is`江韻`) return 'ong';

    if (is`唐韻 幫組`) return 'ong';
    if (is`唐韻 開口`) return 'ong';
    if (is`唐韻 合口`) return 'uong';
    if (is`陽韻 幫組`) return 白讀 ? 'iong' : 'ong';
    if (is`陽韻 莊組`) return 'ong';
    if (is`陽韻 開口`) return 'iong';
    if (is`陽韻 合口`) return 'uong';

    if (is`支脂韻 幫組`) return 'i';
    if (is`微韻 幫組`) return 'ui';
    if (is`支脂之微韻 開口`) return 'i';
    if (is`支脂之微韻 合口`) return 'ui';

    if (is`虞韻 幫組`) return 'u';
    if (is`魚虞韻 莊組`) return 'ii';
    if (is`魚虞韻`) {
      if (is`知章組`) return 'u';
      return 'i';
    }
    if (is`模韻`) return 'u';

    if (is`咍韻`) return 白讀 ? 'oi' : 'ai';
    if (is`泰韻 幫組`) return 'ui';
    if (is`泰韻 開口`) return 'ai';
    if (is`泰韻 合口`) {
      if (is`見組`) return 'uai';
      return 'ui';
    }
    if (is`灰廢韻`) return 白讀 ? 'oi' : 'ui';
    if (is`佳韻 幫組`) return 'ai';
    if (is`佳韻 開口`) {
      if (is`影組`) return 'ei';
      return 'ai';
    }
    if (is`佳韻 合口`) return 'ua';
    if (is`皆夬韻 幫組`) return 'ai';
    if (is`皆夬韻 開口`) return 'ai';
    if (is`皆夬韻 合口`) return 'uai';
    if (is`齊祭韻 幫組`) return 'i';
    if (is`祭韻 開口`) return 'i';
    if (is`祭韻 合口`) return 白讀 ? 'oi' : 'ui';
    if (is`齊韻 開口`) {
      if (is`影組`) return 'i';
      return 白讀 ? 'ei' : 'i';
    }
    if (is`齊韻 合口`) return 'ui';

    if (is`痕韻`) return 'en';
    if (is`魂韻`) return 'un';
    if (is`真韻 幫組`) return 'in';
    if (is`文韻 幫組`) return 'un';
    if (is`真臻文殷韻 見組`) return 白讀 ? 'iun' : 'in';
    if (is`真臻文殷韻 開口`) return 'in';
    if (is`真臻文殷韻 合口`) {
      if (is`精組`) return 'un';
      return 'iun';
    }

    if (is`寒韻 幫組`) return 'an';
    if (is`寒韻 開口`) {
      if (is`見影組`) return 'on';
      return 'an';
    } else if (is`寒韻 合口`) {
      if (is`見影組`) return 'uan';
      return 'on';
    }
    if (is`刪山韻 幫組`) return 'an';
    if (is`刪山韻 開口`) {
      if (is`見影組`) return 'ien';
      return 'an';
    } else if (is`刪山韻 合口`) {
      if (is`見影組`) return 'uan';
      return 'on';
    }
    if (is`仙韻 幫組`) return 'ien';
    if (is`仙韻 開口`) return 'ien';
    if (is`仙韻 合口`) {
      if (is`見影組`) return 'ien';
      if (is`精莊組 入聲`) return 'ied';
      return 'ion';
    }
    if (is`先韻`) {
      if (is`幫組`) return 白讀 ? 'een' : 'ien';
      if (is`端組`) return 'een';
      if (is`來母`) return 'een';
      return 'ien';
    }
    if (is`元韻`) {
      if (is`幫組`) return 'an';
      return 'ien';
    }

    if (is`豪韻`) return 'ou';
    if (is`肴韻`) return 'au';
    if (is`宵韻`) return 'iau';
    if (is`蕭韻`) {
      if (is`端組`) return 'eeu';
      if (is`來母`) return 'eeu';
      return 'iau';
    }

    if (is`歌韻 一等`) return 'ou';
    if (is`歌韻 三等`) return 'iau';

    if (is`麻韻 幫組`) return 'a';
    if (is`麻韻 二等 開口`) return 'a';
    if (is`麻韻 二等 合口`) return 'ua';
    if (is`麻韻 三等`) return 'ia';
    if (is`麻韻`) return 'a';

    if (is`庚韻 二等 幫組`) return 白讀 ? 'ang' : 'en';
    if (is`庚韻 二等 開口`) return 白讀 ? 'ang' : 'en';
    if (is`庚韻 二等 合口`) return 白讀 ? 'uang' : 'uen';
    if (is`庚韻 三等 幫組`) return 白讀 ? 'iang' : 'in';
    if (is`庚韻 三等 開口`) return 白讀 ? 'iang' : 'in';
    if (is`庚韻 三等 合口`) return 白讀 ? 'iung' : 'un';
    if (is`耕韻`) return 白讀 ? 'ang' : 'en';
    if (is`清韻`) return 白讀 ? 'iang' : 'in';
    if (is`青韻`) {
      if (is`端見組 舒聲`) return 'en';
      if (is`端見組 入聲`) return 'id';
      if (is`來母 舒聲`) return 'en';
      if (is`來母 入聲`) return 'id';
      return 白讀 ? 'iang' : 'in';
    }

    if (is`蒸韻`) {
      if (is`莊組`) return 'en';
      return 'in';
    }
    if (is`登韻`) return 'en';

    if (is`侯韻`) return 'eu';
    if (is`尤幽韻`) return 'iu';

    if (is`侵韻`) {
      if (is`莊組`) return 'em';
      return 'im';
    }

    if (is`覃談咸銜凡韻`) return 'am';
    if (is`鹽嚴韻`) return 'iam';
    if (is`添韻`) {
      if (is`端組`) return 'eem';
      if (is`來母`) return 'eem';
      return 'iam';
    }

    throw new Error('無韻母規則');
  }

  function 聲調規則(白讀: boolean) {
    if (is`平聲`) return is`全清 或 次清` ? '1' : '2';
    if (is`上聲` && 白讀) return is`次濁 或 全濁` ? '1' : '3';
    if (is`上聲` && !白讀) return is`全清 或 次清 或 次濁` ? '3' : '5';
    if (is`去聲`) return '5';
    if (is`入聲`) return is`全清 或 次清` ? '7' : '8';

    throw new Error('無聲調規則');
  }

  function 聲母處理(聲母: string, 韻母: string) {
    if (聲母 === '' && 韻母.startsWith('u')) 聲母 = 'v';
    if (is`日母` && !韻母.startsWith('i')) 聲母 = 'rh';
    return 聲母;
  }

  function 韻母預先處理(韻母: string) {
    if (is`入聲`) {
      if (韻母.endsWith('m')) 韻母 = 韻母.slice(0, -1) + 'b';
      else if (韻母.endsWith('n')) 韻母 = 韻母.slice(0, -1) + 'd';
      else if (韻母.endsWith('ng')) 韻母 = 韻母.slice(0, -2) + 'g';
    }
    return 韻母;
  }

  function 韻母善後處理(聲母: string, 韻母: string) {
    if (is`支脂之微韻 開口` && 韻母 === 'i' && 平舌或翹舌.includes(聲母)) {
      韻母 = 'ii';
    }
    if (is`魚虞韻` && 韻母 === 'i' && 翹舌.includes(聲母)) 韻母 = 'ii';
    if (is`祭韻 開口` && 韻母 === 'i' && 翹舌.includes(聲母)) 韻母 = 'ii';
    if (韻母.startsWith('ie') && 翹舌.includes(聲母)) {
      韻母 = 'ee' + 韻母.slice(2);
    }
    if (
      (韻母.startsWith('ia') ||
        韻母.startsWith('io') ||
        韻母.startsWith('iu') ||
        韻母.startsWith('ua') ||
        韻母.startsWith('ue') ||
        韻母.startsWith('uo')) &&
      翹舌或輕脣.includes(聲母) &&
      韻母 !== 'iu'
    ) {
      韻母 = 韻母.slice(1);
    }
    return 韻母;
  }

  function 根據規則推導讀音(白讀: boolean): 讀音 {
    const 聲母推導結果 = 聲母規則(白讀);
    const 韻母推導結果 = 韻母規則(白讀);
    const 韻母 = 韻母善後處理(聲母推導結果, 韻母預先處理(韻母推導結果));
    return {
      韻母,
      聲母: 聲母處理(聲母推導結果, 韻母),
      聲調: 聲調規則(白讀),
    };
  }

  function 客拼轉IPA(讀音: 讀音): 讀音 {
    const 輔音韻尾正則匹配 = /(ng|n|m|[bdg])$/;
    const 首元音正則匹配 = /^(ii|i|u|[aeo][reo]?)/;
    const 轉換聲母: Record<string, string> = {
      m: 'm',
      n: 'n',
      ng: 'ŋ',
      b: 'p',
      d: 't',
      g: 'k',
      p: 'pʰ',
      t: 'tʰ',
      k: 'kʰ',
      s: 's',
      sh: 'ʃ',
      x: 'ɕ',
      z: 'ts',
      zh: 'tʃ',
      c: 'tsʰ',
      ch: 'tʃʰ',
      rh: 'ʒ',
      f: 'f',
      h: 'h',
      v: 'v',
      l: 'l',
      '': '',
    };
    const 轉換元音: Record<string, string> = {
      i: 'i',
      ii: 'ɨ',
      u: 'u',
      oo: 'o',
      er: 'ə',
      e: 'ɛ',
      o: 'ɔ',
      ee: 'æ',
      a: 'a',
      m: 'm̩',
      ng: 'ŋ̍',
    };
    const 轉換輔音韻尾: Record<string, string> = {
      m: 'm',
      n: 'n',
      ng: 'ŋ',
      b: 'p',
      d: 't',
      g: 'k',
      '': '',
    };

    const 輔音韻尾 = 讀音.韻母.match(輔音韻尾正則匹配)?.[0] ?? '';
    let 元音們 = 輔音韻尾 !== '' ? 讀音.韻母.slice(0, -輔音韻尾.length) : 讀音.韻母;

    if (輔音韻尾 === 'ng' || 輔音韻尾 === 'g') {
      if (元音們 === 'u') {
        元音們 = 'oo';
      } else if (元音們 === 'iu') {
        元音們 = 'ioo';
      }
    }
    if (元音們 === 'ou') {
      元音們 = 'oou';
    }

    const 轉換後的元音們: string[] = [];
    while (元音們.length !== 0) {
      const 當前元音 = 元音們.match(首元音正則匹配)?.[0];
      if (!當前元音) throw new Error(`無法轉換大埔話韻母 ${讀音.韻母} 爲 IPA`);
      轉換後的元音們.push(轉換元音[當前元音]);
      元音們 = 元音們.slice(當前元音.length);
    }

    let 元音結果 = 轉換後的元音們.join('');
    if (元音結果 === 'ɨ') {
      元音結果 = 平舌.includes(讀音.聲母) ? 'ɿ' : 'ʅ';
    }

    return {
      韻母: 元音結果 + 轉換輔音韻尾[輔音韻尾],
      聲母: 轉換聲母[讀音.聲母],
      聲調: 讀音.聲調,
    };
  }

  function 轉換標調方式(讀音: 讀音, 標調方式: 大埔話選項['標調方式']): 讀音 {
    const 轉換爲符號調號: Record<string, string> = {
      '1': 'ˊ',
      '2': 'ˇ',
      '3': '^',
      '5': 'ˋ',
      '7': '^',
      '8': 'ˋ',
    };
    const 轉換爲數字調值: Record<string, string> = {
      '1': '⁴⁵',
      '2': '²²⁴',
      '3': '³¹',
      '5': '⁵¹',
      '7': '³²',
      '8': '⁵',
    };
    const 轉換爲折線調值: Record<string, string> = {
      '1': '˦˥',
      '2': '˨˨˦',
      '3': '˧˩',
      '5': '˥˩',
      '7': '˧˨',
      '8': '˥',
    };

    if (標調方式 === '符號調號') return { ...讀音, 聲調: 轉換爲符號調號[讀音.聲調] };
    if (標調方式 === '數字調值') return { ...讀音, 聲調: 轉換爲數字調值[讀音.聲調] };
    if (標調方式 === '折線調值') return { ...讀音, 聲調: 轉換爲折線調值[讀音.聲調] };
    return 讀音;
  }

  let 白讀音: 讀音 | null = null;
  let 文讀音: 讀音 | null = null;

  if (選項.文白讀 === '僅白讀') {
    白讀音 = 根據規則推導讀音(true);
  } else if (選項.文白讀 === '僅文讀') {
    文讀音 = 根據規則推導讀音(false);
  } else if (選項.文白讀 === '文上白下') {
    白讀音 = 根據規則推導讀音(true);
    文讀音 = 根據規則推導讀音(false);
  }

  if (選項.音標 === '國際音標 (IPA)') {
    白讀音 = 白讀音 ? 客拼轉IPA(白讀音) : null;
    文讀音 = 文讀音 ? 客拼轉IPA(文讀音) : null;
  }

  白讀音 = 白讀音 ? 轉換標調方式(白讀音, 選項.標調方式) : null;
  文讀音 = 文讀音 ? 轉換標調方式(文讀音, 選項.標調方式) : null;

  const 白讀音結果 = 白讀音 ? 白讀音.聲母 + 白讀音.韻母 + 白讀音.聲調 : null;
  const 文讀音結果 = 文讀音 ? 文讀音.聲母 + 文讀音.韻母 + 文讀音.聲調 : null;

  let 結果: string;
  if (選項.文白讀 === '僅白讀') {
    結果 = 白讀音結果 ?? '';
  } else if (選項.文白讀 === '僅文讀') {
    結果 = 文讀音結果 ?? '';
  } else if (文讀音結果 === 白讀音結果) {
    結果 = 文讀音結果 ?? '';
  } else {
    結果 = `${文讀音結果 ?? ''}(文) ${白讀音結果 ?? ''}(白)`;
  }

  defaultLogger.log(`大埔話推導過程暫缺，推導結果為 ${結果}`);
  return 結果;
}

export default 推導大埔話;
