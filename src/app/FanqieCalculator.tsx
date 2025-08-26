'use client';

import React, { useState, useEffect, useRef } from 'react';

import TshetUinh, { 音韻地位 } from 'tshet-uinh';
import { 檢索結果 } from 'tshet-uinh/lib/資料';

import { calculateFanqie } from '../lib/反切';
import CustomDropdown from './Dropdown';
import MarkdownWithImagePreview from './MarkdownWithImagePreview';
import 推導普通話 from '@/lib/推導普通話';
import 推導廣州話 from '@/lib/推導廣州話';
import 推導上海話 from '@/lib/推導上海話';

const 預設反切: string[] = [
  '德紅',
  '徒古',
  '直由',
  '在詣',
  '巨鳩',
  '苦閑',
  '徒候',
  '直弓',
  '奴登',
  '渠幽',
  '康杜',
  '甫明',
  '子廉',
  '殊六',
  '良涉',
  '蘇合',
  '都江',
  '昌紿',
  '人兮',
  // for testing
  // '之前', // invalid 反切
  // '鎶定', // no results for 鎶
  // '他凪', // no results for 凪
  // '鎶凪', // no results for 鎶 and 凪
];

const FanqieCalculator: React.FC = () => {
  const [上字, set上字] = useState<string>('');
  const [下字, set下字] = useState<string>('');
  const [上字候選, set上字候選] = useState<檢索結果[] | null>(null);
  const [下字候選, set下字候選] = useState<檢索結果[] | null>(null);
  const [上字當前選擇, set上字當前選擇] = useState<音韻地位 | null>(null);
  const [下字當前選擇, set下字當前選擇] = useState<音韻地位 | null>(null);
  const [反切結果, set反切結果] = useState<string[]>([]);
  const [反切過程, set反切過程] = useState<string>('');
  const [上字選單Open, set上字選單Open] = useState<boolean>(false);
  const [下字選單Open, set下字選單Open] = useState<boolean>(false);
  const [推導現代音, set推導現代音] = useState<(當前音韻地位: 音韻地位) => string>(() => 推導普通話);

  const 上字選單Ref = useRef<HTMLDivElement>(null);
  const 下字選單Ref = useRef<HTMLDivElement>(null);

  const fnNameMap = new Map<(當前音韻地位: 音韻地位) => string, string>([
    [推導普通話, '普通話'],
    [推導廣州話, '廣州話'],
    [推導上海話, '上海話'],
  ]);

  // 處理上字輸入
  const handle上字Change = (字: string) => {
    set上字(字);
    if ([...字].length !== 1) {
      set上字候選(null);
      set上字當前選擇(null);
      set上字選單Open(false);
    } else {
      const 候選 = TshetUinh.資料.query字頭(字);
      set上字候選(候選);
      set上字當前選擇(候選.length > 0 ? 候選[0].音韻地位 : null);
      set上字選單Open(false);
    }
  };

  // 處理下字輸入
  const handle下字Change = (字: string) => {
    set下字(字);
    if ([...字].length !== 1) {
      set下字候選(null);
      set下字當前選擇(null);
      set下字選單Open(false);
    } else {
      const 候選 = TshetUinh.資料.query字頭(字);
      set下字候選(候選);
      set下字當前選擇(候選.length > 0 ? 候選[0].音韻地位 : null);
      set下字選單Open(false);
    }
  };

  // 處理粘貼
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, side: 'left' | 'right') => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const pastedTexts = [...pastedText];

    if (pastedTexts.length === 2) {
      // 如果粘貼兩個字，分別填入左右
      handle上字Change(pastedTexts[0]);
      handle下字Change(pastedTexts[1]);
    } else {
      // 如果粘貼其他長度，填入對應側
      if (side === 'left') {
        handle上字Change(pastedText);
      } else {
        handle下字Change(pastedText);
      }
    }
  };

  // 點擊外部關閉下拉菜單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (上字選單Ref.current && !上字選單Ref.current.contains(event.target as Node)) {
        set上字選單Open(false);
      }
      if (下字選單Ref.current && !下字選單Ref.current.contains(event.target as Node)) {
        set下字選單Open(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 計算反切結果
  useEffect(() => {
    // 無法查詢到上字或下字的情況
    const 無法查詢到上字 = 上字候選 !== null && 上字候選.length === 0;
    const 無法查詢到下字 = 下字候選 !== null && 下字候選.length === 0;
    if (無法查詢到上字 || 無法查詢到下字) {
      set反切結果([]);
      const 上字Msg = 無法查詢到上字 ? [`上字「${上字}」`] : [];
      const 下字Msg = 無法查詢到下字 ? [`下字「${下字}」`] : [];
      const fullMsg = [...上字Msg, ...下字Msg].join('與');
      set反切過程(`無法查詢到${fullMsg}的音韻地位`);
      return;
    }

    if (上字當前選擇 && 下字當前選擇) {
      const res = calculateFanqie(推導現代音, 上字, 下字, 上字當前選擇, 下字當前選擇);
      set反切結果(res.結果);
      set反切過程(res.過程);
    } else {
      set反切結果([]);
      set反切過程('');
    }
  }, [推導現代音, 上字, 下字, 上字候選, 下字候選, 上字當前選擇, 下字當前選擇]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-14 text-4xl font-bold">反切計算器</h1>

      <div className="w-full max-w-3xl">
        {/* 反切算式 */}
        <div className="mx-auto flex flex-wrap items-start justify-center fanqie-div">
          {/* 上字、乘號、下字、上下字讀音選擇 */}
          <div className="table">
            {/* 第一行（上字、乘號、下字） */}
            <div className="table-row items-center">
              {/* 上字 */}
              <div className="table-cell text-center align-center items-center">
                <input
                  type="text"
                  value={上字}
                  onChange={e => handle上字Change(e.target.value)}
                  onPaste={e => handlePaste(e, 'left')}
                  className="fanqie-input-box"
                  placeholder="_"
                />
              </div>

              <div className="table-cell fanqie-math-symbol">×</div>

              {/* 下字 */}
              <div className="table-cell text-center align-center items-center">
                <input
                  type="text"
                  value={下字}
                  onChange={e => handle下字Change(e.target.value)}
                  onPaste={e => handlePaste(e, 'right')}
                  className="fanqie-input-box"
                  placeholder="_"
                />
              </div>
            </div>

            {/* 第二行（上下字讀音選擇） */}
            {((上字候選 !== null && 上字候選.length > 1) || (下字候選 !== null && 下字候選.length > 1)) && (
              <div className="table-row items-center space-x-8">
                <div className="table-cell">
                  {/* 上字讀音選擇 */}
                  {上字候選 !== null && 上字候選.length > 1 && (
                    <CustomDropdown
                      候選={上字候選}
                      當前選擇={上字當前選擇}
                      推導現代音={推導現代音}
                      onSelect={set上字當前選擇}
                      isOpen={上字選單Open}
                      setIsOpen={set上字選單Open}
                      dropdownRef={上字選單Ref}
                    />
                  )}
                </div>
                <div className="table-cell"></div>
                <div className="table-cell">
                  {/* 下字讀音選擇 */}
                  {下字候選 !== null && 下字候選.length > 1 && (
                    <CustomDropdown
                      候選={下字候選}
                      當前選擇={下字當前選擇}
                      推導現代音={推導現代音}
                      onSelect={set下字當前選擇}
                      isOpen={下字選單Open}
                      setIsOpen={set下字選單Open}
                      dropdownRef={下字選單Ref}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 箭頭、結果 */}
          <div className="flex items-center justify-center">
            {/* 箭頭 */}
            <div className="fanqie-math-symbol">→</div>

            {/* 結果 */}
            <div className="text-center items-center">
              <div className="fanqie-result-box" lang="zh-Latn-fonipa">
                {反切結果.length === 0 ? (
                  <></>
                ) : 反切結果.length === 1 ? (
                  <>{反切結果[0]}</>
                ) : (
                  <>
                    <span className="text-4xl align-middle pr-1">{'{'}</span>
                    <div className="flex flex-col ml-2 text-lg text-left">
                      {反切結果.map((result, index) => (
                        <span key={index}>{result}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 說明文字 */}
        <div className="my-8 text-center text-gray-400 text-base/8">
          <p>輸入兩個漢字進行反切計算，或粘貼兩個字自動分配至兩個輸入框</p>

          <p className="justify-center">
            或從預設反切中選取
            {預設反切.map((反切, index) => {
              const [上字, 下字] = [...反切];
              return (
                <input
                  type="button"
                  key={index}
                  value={反切}
                  onClick={() => {
                    handle上字Change(上字);
                    handle下字Change(下字);
                  }}
                  className="px-2 ml-2 my-1 bg-gray-700 hover:bg-gray-600 rounded"
                />
              );
            })}
          </p>
        </div>

        <div className="my-8 bg-gray-900 rounded-lg px-6 py-4">
          <h3 className="text-xl mb-4">選項</h3>
          {/* 現代音選擇 */}
          <div className="flex flex-wrap items-center justify-left space-x-2">
            <div>現代音選擇</div>
            {[推導普通話, 推導廣州話, 推導上海話].map((fn, index) => (
              <input
                type="button"
                key={index}
                value={fnNameMap.get(fn)}
                onClick={() => set推導現代音(() => fn)}
                className={`px-2 py-1 rounded-lg ${推導現代音 === fn ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              />
            ))}
          </div>
        </div>

        {/* 反切過程顯示 */}
        {反切過程 && (
          <div className="bg-gray-900 rounded-lg px-6 pt-2 pb-4">
            <div className="prose prose-invert fanqie-process-area max-w-full">
              <MarkdownWithImagePreview content={反切過程}></MarkdownWithImagePreview>
            </div>
          </div>
        )}
      </div>

      <footer className="flex flex-col gap-4 mt-8 max-w-3xl">
        <p className="text-gray-500 text-sm/6">
          反切計算器由{' '}
          <a href="https://nk2028.shn.hk/" target="_blank">
            nk2028
          </a>{' '}
          工作組研發。反切規則參考了潘悟雲《反切行為與反切原則》。現代音的推導規則取自 nk2028 工作組研發的{' '}
          <a href="https://github.com/nk2028/tshet-uinh-examples" target="_blank">
            Tshet-uinh Examples
          </a>{' '}
          專案。《王三》及《韻鏡》書影取自 nk2028 工作組研發並自費託管的{' '}
          <a href="https://github.com/nk2028/tshet-uinh-images" target="_blank">
            Tshet-uinh Images
          </a>{' '}
          專案。其中，《王三》所用書影為
          <a href="https://book.douban.com/subject/27591818/" target="_blank">
            江蘇鳳凰教育出版社《唐寫本王仁昫刊謬補缺切韻》
          </a>
          。《韻鏡》所用版本為古逸叢書本，書影為
          <a href="https://book.douban.com/subject/1289012/" target="_blank">
            江蘇教育出版社《宋本廣韻》
          </a>
          。歡迎加入 QQ 音韻學答疑羣（羣號 526333751）和 Telegram 更新頻道（@nk2028）。本頁面原始碼發佈於{' '}
          <a href="https://github.com/nk2028/tshet-uinh-fanqie" target="_blank">
            GitHub
          </a>
          。如發現任何錯誤，歡迎透過{' '}
          <a href="https://github.com/nk2028/tshet-uinh-fanqie/issues" target="_blank">
            GitHub Issues
          </a>{' '}
          回報。
        </p>

        <p className="text-gray-500 text-sm/6">
          本頁面是一項開放原始碼的網絡服務。作為本頁面的開發者，我們對閣下的私隱非常重視。本頁面的開發者不會收集閣下在本頁面中鍵入的任何內容。任何與閣下鍵入的內容相關的運算全部在閣下的瀏覽器本地完成，本頁面不會將包括反切在內的任何閣下鍵入的資料傳送至任何伺服器。
        </p>
      </footer>
    </div>
  );
};

export default FanqieCalculator;
