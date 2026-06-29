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

interface 聲母規則結果 {
  聲母: string;
  解釋: string;
}

interface 韻母規則結果 {
  韻母: string;
  解釋: string;
}

interface 聲調規則結果 {
  聲調: string;
  解釋: string;
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
  const 讀法名 = (白讀: boolean) => (白讀 ? '白讀' : '文讀');
  const 聲母名稱 = (聲母: string) => 聲母 || '零聲母';
  const 聲母結果 = (條件: string, 聲母: string): 聲母規則結果 => ({
    聲母,
    解釋: `${條件}，推導為聲母 ${聲母名稱(聲母)}`,
  });
  const 韻母結果 = (條件: string, 韻母: string): 韻母規則結果 => ({
    韻母,
    解釋: `${條件}，推導為韻母 ${韻母}`,
  });
  const 聲調結果 = (條件: string, 聲調: string): 聲調規則結果 => ({
    聲調,
    解釋: `${條件}，推導為第 ${聲調} 聲`,
  });

  function 聲母規則(白讀: boolean): 聲母規則結果 {
    if (is`幫母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 聲母結果('幫母 (東韻 三等 或 鍾微虞廢文元陽尤凡韻) 文讀', 'f');
      return 聲母結果('幫母', 'b');
    }
    if (is`滂母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 聲母結果('滂母 (東韻 三等 或 鍾微虞廢文元陽尤凡韻) 文讀', 'f');
      return 聲母結果('滂母', 'p');
    }
    if (is`並母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 聲母結果('並母 (東韻 三等 或 鍾微虞廢文元陽尤凡韻) 文讀', 'f');
      return 聲母結果('並母', 'p');
    }
    if (is`明母`) {
      if (is`東韻 三等 或 鍾微虞廢文元陽尤凡韻` && !白讀) return 聲母結果('明母 (東韻 三等 或 鍾微虞廢文元陽尤凡韻) 文讀', 'v');
      return 聲母結果('明母', 'm');
    }

    if (is`端母`) return 聲母結果('端母', 'd');
    if (is`透母`) return 聲母結果('透母', 't');
    if (is`定母`) return 聲母結果('定母', 't');
    if (is`泥母`) return 聲母結果('泥母', 'n');
    if (is`來母`) return 聲母結果('來母', 'l');

    if (is`知母 二等`) return 聲母結果('知母 二等', 'z');
    if (is`知母`) return 聲母結果('知母 非 二等', 'zh');
    if (is`徹母 二等`) return 聲母結果('徹母 二等', 'c');
    if (is`徹母`) return 聲母結果('徹母 非 二等', 'ch');
    if (is`澄母 二等`) return 聲母結果('澄母 二等', 'c');
    if (is`澄母`) return 聲母結果('澄母 非 二等', 'ch');
    if (is`孃母`) return 聲母結果('孃母', 'n');

    if (is`精母`) return 聲母結果('精母', 'z');
    if (is`清母`) return 聲母結果('清母', 'c');
    if (is`從母`) return 聲母結果('從母', 'c');
    if (is`心母`) return 聲母結果('心母', 's');
    if (is`邪母`) {
      if (is`支脂之微韻 去聲`) return 聲母結果('邪母 支脂之微韻 去聲', 'c');
      if (is`魚虞模東冬鍾侵韻 平聲`) return 聲母結果('邪母 魚虞模東冬鍾侵韻 平聲', 'c');
      if (is`侯尤幽麻韻`) return 聲母結果('邪母 侯尤幽麻韻', 'c');
      return 聲母結果('邪母 非 (支脂之微韻 去聲、魚虞模東冬鍾侵韻 平聲、侯尤幽麻韻)', 's');
    }

    if (is`莊母`) return 聲母結果('莊母', 'z');
    if (is`初母`) return 聲母結果('初母', 'c');
    if (is`崇母`) return 聲母結果('崇母', 'c');
    if (is`生母`) return 聲母結果('生母', 's');
    if (is`俟母`) return 聲母結果('俟母', 'c');

    if (is`章母`) return 聲母結果('章母', 'zh');
    if (is`昌母`) return 聲母結果('昌母', 'ch');
    if (is`常母`) return 聲母結果('常母', 'sh');
    if (is`書母`) return 聲母結果('書母', 'sh');
    if (is`船母`) return 聲母結果('船母', 'sh');
    if (is`日母`) return 聲母結果('日母', 'ng');

    if (is`見母`) return 聲母結果('見母', 'g');
    if (is`溪母`) return 聲母結果('溪母', 'k');
    if (is`羣母`) return 聲母結果('羣母', 'k');
    if (is`疑母`) return 聲母結果('疑母', 'ng');

    if (is`曉母`) {
      if (is`合口`) return 聲母結果('曉母 合口', 'f');
      if (is`三四等`) return 聲母結果('曉母 三四等', 'x');
      return 聲母結果('曉母 非 合口 非 三四等', 'h');
    }
    if (is`匣母`) {
      if (is`合口 或 東模韻`) return 聲母結果('匣母 (合口 或 東模韻)', 'f');
      if (is`開口 四等`) return 聲母結果('匣母 開口 四等', 'x');
      return 聲母結果('匣母 非 (合口 或 東模韻) 非 開口 四等', 'h');
    }
    if (is`影母`) {
      if (is`合口`) return 聲母結果('影母 合口', 'v');
      if (is`三四等`) return 聲母結果('影母 三四等', 'rh');
      return 聲母結果('影母 非 合口 非 三四等', '');
    }
    if (is`云母`) {
      if (is`東韻`) return 聲母結果('云母 東韻', 'x');
      if (is`支脂之微唐陽韻 或 魚虞模韻 平聲`) return 聲母結果('云母 (支脂之微唐陽韻 或 魚虞模韻 平聲)', 'v');
      return 聲母結果('云母 非 東韻 非 (支脂之微唐陽韻 或 魚虞模韻 平聲)', 'rh');
    }
    if (is`以母`) {
      if (is`支脂之微韻 合口`) return 聲母結果('以母 支脂之微韻 合口', 'v');
      return 聲母結果('以母 非 支脂之微韻 合口', 'rh');
    }

    throw new Error('無聲母規則');
  }

  function 韻母規則(白讀: boolean): 韻母規則結果 {
    if (is`東冬鍾韻 幫組`) return 韻母結果('東冬鍾韻 幫組', 'ung');
    if (is`東冬鍾韻 一等`) return 韻母結果('東冬鍾韻 一等', 'ung');
    if (is`東冬鍾韻 三等`) return 韻母結果('東冬鍾韻 三等', 'iung');

    if (is`江韻`) return 韻母結果('江韻', 'ong');

    if (is`唐韻 幫組`) return 韻母結果('唐韻 幫組', 'ong');
    if (is`唐韻 開口`) return 韻母結果('唐韻 開口', 'ong');
    if (is`唐韻 合口`) return 韻母結果('唐韻 合口', 'uong');
    if (is`陽韻 幫組` && 白讀) return 韻母結果('陽韻 幫組 白讀', 'iong');
    if (is`陽韻 幫組`) return 韻母結果('陽韻 幫組 文讀', 'ong');
    if (is`陽韻 莊組`) return 韻母結果('陽韻 莊組', 'ong');
    if (is`陽韻 開口`) return 韻母結果('陽韻 開口', 'iong');
    if (is`陽韻 合口`) return 韻母結果('陽韻 合口', 'uong');

    if (is`支脂韻 幫組`) return 韻母結果('支脂韻 幫組', 'i');
    if (is`微韻 幫組`) return 韻母結果('微韻 幫組', 'ui');
    if (is`支脂之微韻 開口`) return 韻母結果('支脂之微韻 開口', 'i');
    if (is`支脂之微韻 合口`) return 韻母結果('支脂之微韻 合口', 'ui');

    if (is`虞韻 幫組`) return 韻母結果('虞韻 幫組', 'u');
    if (is`魚虞韻 莊組`) return 韻母結果('魚虞韻 莊組', 'ii');
    if (is`魚虞韻`) {
      if (is`知章組`) return 韻母結果('魚虞韻 知章組', 'u');
      return 韻母結果('魚虞韻 非 莊組 非 知章組', 'i');
    }
    if (is`模韻`) return 韻母結果('模韻', 'u');

    if (is`咍韻` && 白讀) return 韻母結果('咍韻 白讀', 'oi');
    if (is`咍韻`) return 韻母結果('咍韻 文讀', 'ai');
    if (is`泰韻 幫組`) return 韻母結果('泰韻 幫組', 'ui');
    if (is`泰韻 開口`) return 韻母結果('泰韻 開口', 'ai');
    if (is`泰韻 合口`) {
      if (is`見組`) return 韻母結果('泰韻 合口 見組', 'uai');
      return 韻母結果('泰韻 合口 非 見組', 'ui');
    }
    if (is`灰廢韻` && 白讀) return 韻母結果('灰廢韻 白讀', 'oi');
    if (is`灰廢韻`) return 韻母結果('灰廢韻 文讀', 'ui');
    if (is`佳韻 幫組`) return 韻母結果('佳韻 幫組', 'ai');
    if (is`佳韻 開口`) {
      if (is`影組`) return 韻母結果('佳韻 開口 影組', 'ei');
      return 韻母結果('佳韻 開口 非 影組', 'ai');
    }
    if (is`佳韻 合口`) return 韻母結果('佳韻 合口', 'ua');
    if (is`皆夬韻 幫組`) return 韻母結果('皆夬韻 幫組', 'ai');
    if (is`皆夬韻 開口`) return 韻母結果('皆夬韻 開口', 'ai');
    if (is`皆夬韻 合口`) return 韻母結果('皆夬韻 合口', 'uai');
    if (is`齊祭韻 幫組`) return 韻母結果('齊祭韻 幫組', 'i');
    if (is`祭韻 開口`) return 韻母結果('祭韻 開口', 'i');
    if (is`祭韻 合口` && 白讀) return 韻母結果('祭韻 合口 白讀', 'oi');
    if (is`祭韻 合口`) return 韻母結果('祭韻 合口 文讀', 'ui');
    if (is`齊韻 開口`) {
      if (is`影組`) return 韻母結果('齊韻 開口 影組', 'i');
      if (白讀) return 韻母結果('齊韻 開口 非 影組 白讀', 'ei');
      return 韻母結果('齊韻 開口 非 影組 文讀', 'i');
    }
    if (is`齊韻 合口`) return 韻母結果('齊韻 合口', 'ui');

    if (is`痕韻`) return 韻母結果('痕韻', 'en');
    if (is`魂韻`) return 韻母結果('魂韻', 'un');
    if (is`真韻 幫組`) return 韻母結果('真韻 幫組', 'in');
    if (is`文韻 幫組`) return 韻母結果('文韻 幫組', 'un');
    if (is`真臻文殷韻 見組` && 白讀) return 韻母結果('真臻文殷韻 見組 白讀', 'iun');
    if (is`真臻文殷韻 見組`) return 韻母結果('真臻文殷韻 見組 文讀', 'in');
    if (is`真臻文殷韻 開口`) return 韻母結果('真臻文殷韻 開口', 'in');
    if (is`真臻文殷韻 合口`) {
      if (is`精組`) return 韻母結果('真臻文殷韻 合口 精組', 'un');
      return 韻母結果('真臻文殷韻 合口 非 精組', 'iun');
    }

    if (is`寒韻 幫組`) return 韻母結果('寒韻 幫組', 'an');
    if (is`寒韻 開口`) {
      if (is`見影組`) return 韻母結果('寒韻 開口 見影組', 'on');
      return 韻母結果('寒韻 開口 非 見影組', 'an');
    } else if (is`寒韻 合口`) {
      if (is`見影組`) return 韻母結果('寒韻 合口 見影組', 'uan');
      return 韻母結果('寒韻 合口 非 見影組', 'on');
    }
    if (is`刪山韻 幫組`) return 韻母結果('刪山韻 幫組', 'an');
    if (is`刪山韻 開口`) {
      if (is`見影組`) return 韻母結果('刪山韻 開口 見影組', 'ien');
      return 韻母結果('刪山韻 開口 非 見影組', 'an');
    } else if (is`刪山韻 合口`) {
      if (is`見影組`) return 韻母結果('刪山韻 合口 見影組', 'uan');
      return 韻母結果('刪山韻 合口 非 見影組', 'on');
    }
    if (is`仙韻 幫組`) return 韻母結果('仙韻 幫組', 'ien');
    if (is`仙韻 開口`) return 韻母結果('仙韻 開口', 'ien');
    if (is`仙韻 合口`) {
      if (is`見影組`) return 韻母結果('仙韻 合口 見影組', 'ien');
      if (is`精莊組 入聲`) return 韻母結果('仙韻 合口 精莊組 入聲', 'ied');
      return 韻母結果('仙韻 合口 非 見影組 非 (精莊組 入聲)', 'ion');
    }
    if (is`先韻`) {
      if (is`幫組` && 白讀) return 韻母結果('先韻 幫組 白讀', 'een');
      if (is`幫組`) return 韻母結果('先韻 幫組 文讀', 'ien');
      if (is`端組`) return 韻母結果('先韻 端組', 'een');
      if (is`來母`) return 韻母結果('先韻 來母', 'een');
      return 韻母結果('先韻 非 幫組 非 端組 非 來母', 'ien');
    }
    if (is`元韻`) {
      if (is`幫組`) return 韻母結果('元韻 幫組', 'an');
      return 韻母結果('元韻 非 幫組', 'ien');
    }

    if (is`豪韻`) return 韻母結果('豪韻', 'ou');
    if (is`肴韻`) return 韻母結果('肴韻', 'au');
    if (is`宵韻`) return 韻母結果('宵韻', 'iau');
    if (is`蕭韻`) {
      if (is`端組`) return 韻母結果('蕭韻 端組', 'eeu');
      if (is`來母`) return 韻母結果('蕭韻 來母', 'eeu');
      return 韻母結果('蕭韻 非 端組 非 來母', 'iau');
    }

    if (is`歌韻 一等`) return 韻母結果('歌韻 一等', 'ou');
    if (is`歌韻 三等`) return 韻母結果('歌韻 三等', 'iau');

    if (is`麻韻 幫組`) return 韻母結果('麻韻 幫組', 'a');
    if (is`麻韻 二等 開口`) return 韻母結果('麻韻 二等 開口', 'a');
    if (is`麻韻 二等 合口`) return 韻母結果('麻韻 二等 合口', 'ua');
    if (is`麻韻 三等`) return 韻母結果('麻韻 三等', 'ia');
    if (is`麻韻`) return 韻母結果('麻韻 其他', 'a');

    if (is`庚韻 二等 幫組` && 白讀) return 韻母結果('庚韻 二等 幫組 白讀', 'ang');
    if (is`庚韻 二等 幫組`) return 韻母結果('庚韻 二等 幫組 文讀', 'en');
    if (is`庚韻 二等 開口` && 白讀) return 韻母結果('庚韻 二等 開口 白讀', 'ang');
    if (is`庚韻 二等 開口`) return 韻母結果('庚韻 二等 開口 文讀', 'en');
    if (is`庚韻 二等 合口` && 白讀) return 韻母結果('庚韻 二等 合口 白讀', 'uang');
    if (is`庚韻 二等 合口`) return 韻母結果('庚韻 二等 合口 文讀', 'uen');
    if (is`庚韻 三等 幫組` && 白讀) return 韻母結果('庚韻 三等 幫組 白讀', 'iang');
    if (is`庚韻 三等 幫組`) return 韻母結果('庚韻 三等 幫組 文讀', 'in');
    if (is`庚韻 三等 開口` && 白讀) return 韻母結果('庚韻 三等 開口 白讀', 'iang');
    if (is`庚韻 三等 開口`) return 韻母結果('庚韻 三等 開口 文讀', 'in');
    if (is`庚韻 三等 合口` && 白讀) return 韻母結果('庚韻 三等 合口 白讀', 'iung');
    if (is`庚韻 三等 合口`) return 韻母結果('庚韻 三等 合口 文讀', 'un');
    if (is`耕韻` && 白讀) return 韻母結果('耕韻 白讀', 'ang');
    if (is`耕韻`) return 韻母結果('耕韻 文讀', 'en');
    if (is`清韻` && 白讀) return 韻母結果('清韻 白讀', 'iang');
    if (is`清韻`) return 韻母結果('清韻 文讀', 'in');
    if (is`青韻`) {
      if (is`端見組 舒聲`) return 韻母結果('青韻 端見組 舒聲', 'en');
      if (is`端見組 入聲`) return 韻母結果('青韻 端見組 入聲', 'id');
      if (is`來母 舒聲`) return 韻母結果('青韻 來母 舒聲', 'en');
      if (is`來母 入聲`) return 韻母結果('青韻 來母 入聲', 'id');
      if (白讀) return 韻母結果('青韻 其他 白讀', 'iang');
      return 韻母結果('青韻 其他 文讀', 'in');
    }

    if (is`蒸韻`) {
      if (is`莊組`) return 韻母結果('蒸韻 莊組', 'en');
      return 韻母結果('蒸韻 非 莊組', 'in');
    }
    if (is`登韻`) return 韻母結果('登韻', 'en');

    if (is`侯韻`) return 韻母結果('侯韻', 'eu');
    if (is`尤幽韻`) return 韻母結果('尤幽韻', 'iu');

    if (is`侵韻`) {
      if (is`莊組`) return 韻母結果('侵韻 莊組', 'em');
      return 韻母結果('侵韻 非 莊組', 'im');
    }

    if (is`覃談咸銜凡韻`) return 韻母結果('覃談咸銜凡韻', 'am');
    if (is`鹽嚴韻`) return 韻母結果('鹽嚴韻', 'iam');
    if (is`添韻`) {
      if (is`端組`) return 韻母結果('添韻 端組', 'eem');
      if (is`來母`) return 韻母結果('添韻 來母', 'eem');
      return 韻母結果('添韻 非 端組 非 來母', 'iam');
    }

    throw new Error('無韻母規則');
  }

  function 聲調規則(白讀: boolean): 聲調規則結果 {
    if (is`平聲 (全清 或 次清)`) return 聲調結果('全清 或 次清 平聲', '1');
    if (is`平聲`) return 聲調結果('全濁 或 次濁 平聲', '2');
    if (is`上聲 (次濁 或 全濁)` && 白讀) return 聲調結果('次濁 或 全濁 上聲 白讀', '1');
    if (is`上聲` && 白讀) return 聲調結果('全清 或 次清 上聲 白讀', '3');
    if (is`上聲 (全清 或 次清 或 次濁)` && !白讀) return 聲調結果('全清、次清 或 次濁 上聲 文讀', '3');
    if (is`上聲` && !白讀) return 聲調結果('全濁 上聲 文讀', '5');
    if (is`去聲`) return 聲調結果('去聲', '5');
    if (is`入聲 (全清 或 次清)`) return 聲調結果('全清 或 次清 入聲', '7');
    if (is`入聲`) return 聲調結果('全濁 或 次濁 入聲', '8');

    throw new Error('無聲調規則');
  }

  function 聲母處理(聲母: string, 韻母: string) {
    if (聲母 === '' && 韻母.startsWith('u')) {
      defaultLogger.log('零聲母後接 u 起始韻母時，自動補聲母 v');
      聲母 = 'v';
    }
    if (is`日母` && !韻母.startsWith('i')) {
      defaultLogger.log('日母後接洪音時，聲母改為 rh');
      聲母 = 'rh';
    }
    return 聲母;
  }

  function 韻母預先處理(韻母: string) {
    if (is`入聲`) {
      const 原韻母 = 韻母;
      if (韻母.endsWith('m')) 韻母 = 韻母.slice(0, -1) + 'b';
      else if (韻母.endsWith('n')) 韻母 = 韻母.slice(0, -1) + 'd';
      else if (韻母.endsWith('ng')) 韻母 = 韻母.slice(0, -2) + 'g';
      if (韻母 !== 原韻母) {
        defaultLogger.log(`聲調為入聲，將舒聲韻尾改為入聲韻尾，故韻母 ${原韻母} 改為 ${韻母}`);
      }
    }
    return 韻母;
  }

  function 韻母善後處理(聲母: string, 韻母: string) {
    if (is`支脂之微韻 開口` && 韻母 === 'i' && 平舌或翹舌.includes(聲母)) {
      defaultLogger.log('支脂之微韻開口接平舌或翹舌聲母時，韻母 i 改為舌尖韻母 ii');
      韻母 = 'ii';
    }
    if (is`魚虞韻` && 韻母 === 'i' && 翹舌.includes(聲母)) {
      defaultLogger.log('魚虞韻接翹舌聲母時，韻母 i 改為舌尖韻母 ii');
      韻母 = 'ii';
    }
    if (is`祭韻 開口` && 韻母 === 'i' && 翹舌.includes(聲母)) {
      defaultLogger.log('祭韻開口接翹舌聲母時，韻母 i 改為舌尖韻母 ii');
      韻母 = 'ii';
    }
    if (韻母.startsWith('ie') && 翹舌.includes(聲母)) {
      defaultLogger.log(`韻母 ${韻母} 接翹舌聲母時，介音 i 脫落且主元音改作 ee`);
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
      defaultLogger.log(`韻母 ${韻母} 接翹舌或輕脣聲母時，介音 ${韻母[0]} 脫落`);
      韻母 = 韻母.slice(1);
    }
    return 韻母;
  }

  function 根據規則推導讀音(白讀: boolean): 讀音 {
    defaultLogger.log(`推導${讀法名(白讀)}音：`);
    const 聲母推導結果 = 聲母規則(白讀);
    defaultLogger.log(聲母推導結果.解釋);
    const 韻母推導結果 = 韻母規則(白讀);
    defaultLogger.log(韻母推導結果.解釋);
    const 韻母 = 韻母善後處理(聲母推導結果.聲母, 韻母預先處理(韻母推導結果.韻母));
    const 聲母 = 聲母處理(聲母推導結果.聲母, 韻母);
    const 聲調推導結果 = 聲調規則(白讀);
    defaultLogger.log(聲調推導結果.解釋);
    return {
      韻母,
      聲母,
      聲調: 聲調推導結果.聲調,
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
        defaultLogger.log('轉換 IPA 時，u 在 ng/g 韻尾前按 oo 處理');
        元音們 = 'oo';
      } else if (元音們 === 'iu') {
        defaultLogger.log('轉換 IPA 時，iu 在 ng/g 韻尾前按 ioo 處理');
        元音們 = 'ioo';
      }
    }
    if (元音們 === 'ou') {
      defaultLogger.log('轉換 IPA 時，ou 按 oou 處理');
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
      if (平舌.includes(讀音.聲母)) {
        defaultLogger.log(`轉換 IPA 時，舌尖韻母 ii 接平舌聲母 ${讀音.聲母}（z/c/s），轉為 ɿ`);
        元音結果 = 'ɿ';
      } else {
        defaultLogger.log(`轉換 IPA 時，舌尖韻母 ii 接非平舌聲母 ${讀音.聲母}（非 z/c/s），轉為 ʅ`);
        元音結果 = 'ʅ';
      }
    }

    const 轉換結果 = {
      韻母: 元音結果 + 轉換輔音韻尾[輔音韻尾],
      聲母: 轉換聲母[讀音.聲母],
      聲調: 讀音.聲調,
    };
    defaultLogger.log(`按國際音標轉寫，${讀音.聲母}${讀音.韻母}${讀音.聲調} 轉為 ${轉換結果.聲母}${轉換結果.韻母}${轉換結果.聲調}`);
    return {
      韻母: 轉換結果.韻母,
      聲母: 轉換結果.聲母,
      聲調: 轉換結果.聲調,
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

    if (標調方式 === '符號調號') {
      defaultLogger.log(`將數字調號 ${讀音.聲調} 轉為符號調號 ${轉換爲符號調號[讀音.聲調]}`);
      return { ...讀音, 聲調: 轉換爲符號調號[讀音.聲調] };
    }
    if (標調方式 === '數字調值') {
      defaultLogger.log(`將數字調號 ${讀音.聲調} 轉為數字調值 ${轉換爲數字調值[讀音.聲調]}`);
      return { ...讀音, 聲調: 轉換爲數字調值[讀音.聲調] };
    }
    if (標調方式 === '折線調值') {
      defaultLogger.log(`將數字調號 ${讀音.聲調} 轉為折線調值 ${轉換爲折線調值[讀音.聲調]}`);
      return { ...讀音, 聲調: 轉換爲折線調值[讀音.聲調] };
    }
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
    結果 = `${文讀音結果 ?? ''}\n${白讀音結果 ?? ''}`;
  }

  defaultLogger.log(`因此，音韻地位「${當前音韻地位.描述}」對應的大埔話為 ${結果}`);
  return 結果;
}

export default 推導大埔話;
