'use client';

import React, { useState, useEffect, useRef } from 'react';

import TshetUinh, { 音韻地位 } from 'tshet-uinh';
import { 檢索結果 } from 'tshet-uinh/lib/資料';

import { calculateFanqie } from '../lib/反切';
import { 推導普通話 } from '@/lib/推導普通話';
import 推導廣州話 from '@/lib/推導廣州話';
import MarkdownWithImagePreview from './MarkdownWithImagePreview';
import 推導上海話 from '@/lib/推導上海話';
import CustomDropdown from './Dropdown';

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
  '苦割',
  '英及',
];

const FanqieCalculator: React.FC = () => {
  const [上字, set上字] = useState<string>('');
  const [下字, set下字] = useState<string>('');
  const [上字候選, set上字候選] = useState<檢索結果[]>([]);
  const [下字候選, set下字候選] = useState<檢索結果[]>([]);
  const [上字當前選擇, set上字當前選擇] = useState<音韻地位 | null>(null);
  const [下字當前選擇, set下字當前選擇] = useState<音韻地位 | null>(null);
  const [反切結果, set反切結果] = useState<string[]>([]);
  const [反切過程, set反切過程] = useState<string>('');
  const [上字選單Open, set上字選單Open] = useState<boolean>(false);
  const [下字選單Open, set下字選單Open] = useState<boolean>(false);
  const [推導現代音, set推導現代音] = useState<(當前音韻地位: 音韻地位) => string>(() => 推導普通話);

  const 上字選單Ref = useRef<HTMLDivElement>(null);
  const 下字選單Ref = useRef<HTMLDivElement>(null);

  // 處理上字輸入
  const handle上字Change = (value: string) => {
    set上字(value);
    if (value.length === 1) {
      const readings = TshetUinh.資料.query字頭(value);
      set上字候選(readings);
      set上字當前選擇(readings.length > 0 ? readings[0].音韻地位 : null);
      set上字選單Open(false);
    } else if (value.length === 0) {
      set上字候選([]);
      set上字當前選擇(null);
      set上字選單Open(false);
    }
  };

  // 處理下字輸入
  const handle下字Change = (value: string) => {
    set下字(value);
    if (value.length === 1) {
      const readings = TshetUinh.資料.query字頭(value);
      set下字候選(readings);
      set下字當前選擇(readings.length > 0 ? readings[0].音韻地位 : null);
      set下字選單Open(false);
    } else if (value.length === 0) {
      set下字候選([]);
      set下字當前選擇(null);
      set下字選單Open(false);
    }
  };

  // 處理粘貼
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, side: 'left' | 'right') => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');

    if (pastedText.length === 2) {
      // 如果粘貼兩個字，分別填入左右
      handle上字Change(pastedText[0]);
      handle下字Change(pastedText[1]);
    } else if (pastedText.length === 1) {
      // 如果粘貼一個字，填入對應側
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
    if (上字當前選擇 && 下字當前選擇) {
      const res = calculateFanqie(推導現代音, 上字, 下字, 上字當前選擇, 下字當前選擇);
      set反切結果(res.結果);
      set反切過程(res.過程);
    } else {
      set反切結果([]);
      set反切過程('');
    }
  }, [推導現代音, 上字, 下字, 上字當前選擇, 下字當前選擇]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      {/* 標題 */}
      <h1 className="text-4xl font-bold mb-8">反切計算器</h1>

      {/* 主要內容區域 */}
      <div className="w-full max-w-4xl">
        {/* 主要輸入區域 */}
        <div className="table m-auto items-center justify-center mb-8">
          {/* 第一行 */}
          <div className="table-row items-center space-x-8 text-3xl mono">
            {/* 左側輸入 */}
            <div className="table-cell text-center align-center items-center">
              <input
                type="text"
                value={上字}
                onChange={e => handle上字Change(e.target.value)}
                onPaste={e => handlePaste(e, 'left')}
                className="w-24 h-24 bg-gray-800 border-2 border-gray-600 rounded-lg text-center text-white text-4xl focus:border-blue-500 focus:outline-none"
                placeholder="_"
              />
            </div>

            <span className="table-cell px-4 text-gray-400">×</span>

            {/* 右側輸入 */}
            <div className="table-cell text-center align-center items-center">
              <input
                type="text"
                value={下字}
                onChange={e => handle下字Change(e.target.value)}
                onPaste={e => handlePaste(e, 'right')}
                className="w-24 h-24 bg-gray-800 border-2 border-gray-600 rounded-lg text-center text-white text-4xl focus:border-blue-500 focus:outline-none"
                placeholder="_"
              />
            </div>

            <span className="table-cell px-4 text-gray-400">→</span>

            {/* 結果顯示 */}
            <div className="table-cell text-center align-top items-center">
              <div className="w-48 h-24 bg-gray-800 border-2 border-gray-600 rounded-lg flex items-center justify-center text-white text-4xl">
                {反切結果.length === 0 ? (
                  <span className="text-gray-500">_</span>
                ) : 反切結果.length === 1 ? (
                  <span lang="zh-Latn-fonipa">{反切結果[0]}</span>
                ) : (
                  <div className="text-2xl table">
                    <span className="text-3xl table-cell align-middle pr-1">{'{'}</span>
                    <div lang="zh-Latn-fonipa" className="ml-2 text-lg table-cell text-left">
                      {反切結果.map((result, index) => (
                        <div key={index}>{result}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="table-row items-center space-x-8 text-3xl mono">
            <div className="table-cell">
              {/* 左側讀音選擇 */}
              {上字候選.length > 1 && (
                <CustomDropdown
                  候選={上字候選}
                  當前選擇={上字當前選擇}
                  推導現代音={推導現代音}
                  onSelect={set上字當前選擇}
                  isOpen={上字選單Open}
                  setIsOpen={set上字選單Open}
                  dropdownRef={上字選單Ref}
                  placeholder="選擇讀音"
                />
              )}
            </div>
            <div className="table-cell"></div>
            <div className="table-cell">
              {/* 右側讀音選擇 */}
              {下字候選.length > 1 && (
                <CustomDropdown
                  候選={下字候選}
                  當前選擇={下字當前選擇}
                  推導現代音={推導現代音}
                  onSelect={set下字當前選擇}
                  isOpen={下字選單Open}
                  setIsOpen={set下字選單Open}
                  dropdownRef={下字選單Ref}
                  placeholder="選擇讀音"
                />
              )}
            </div>
          </div>
        </div>

        {/* 說明文字 */}
        <div className="text-center text-gray-400 mb-8 text-base/8">
          <p>輸入兩個漢字進行反切計算，或粘貼兩個字自動分配到左右輸入框</p>
          {/* 預設反切 */}
          <p className="justify-center">
            或從預設反切中選取
            {預設反切.map((pair, index) => {
              const 上字 = pair[0];
              const 下字 = pair[1];
              return (
                <button
                  key={index}
                  onClick={() => {
                    handle上字Change(上字);
                    handle下字Change(下字);
                  }}
                  className="px-2 ml-2 my-1 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  {上字 + 下字}
                </button>
              );
            })}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 max-w-3xl mx-auto">
          <h3 className="text-xl my-2">選項</h3>
          {/* 現代音選擇 */}
          <div className="flex items-center justify-left space-x-2">
            <div>現代音選擇</div>
            {[推導普通話, 推導廣州話, 推導上海話].map((fn, index) => (
              <button
                key={index}
                onClick={() => set推導現代音(() => fn)}
                className={`px-2 py-1 rounded-lg ${推導現代音.name === fn.name ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}`}
              >
                {fn.name.replace('推導', '')}
              </button>
            ))}
          </div>
        </div>

        {/* 反切過程顯示 */}
        {反切過程 && (
          <div className="bg-gray-900 rounded-lg p-6 max-w-3xl mx-auto mt-4">
            <div className="prose prose-invert max-w-none fanqie-process-area">
              <MarkdownWithImagePreview content={反切過程}></MarkdownWithImagePreview>
            </div>
          </div>
        )}
      </div>

      <footer className="mt-8 text-gray-500 text-sm max-w-3xl">
        反切計算器由{' '}
        <a href="https://nk2028.shn.hk/" className="underline" target="_blank">
          nk2028
        </a>{' '}
        項目開發。歡迎加入 QQ 音韻學答疑羣（羣號 526333751）和 Telegram 更新頻道（@nk2028）。本頁面原始碼公開於 GitHub。
      </footer>
    </div>
  );
};

export default FanqieCalculator;
