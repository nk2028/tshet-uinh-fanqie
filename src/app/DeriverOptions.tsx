import { RotateCcw } from 'lucide-react';
import type { Parameter, 推導設定, 設定項 } from 'tshet-uinh-deriver-tools';

import { 篩選顯示設定項 } from '@/lib/推導選項';

interface DeriverOptionsProps {
  方案名稱: string;
  設定: 推導設定;
  onChange: (key: string, value: unknown) => void;
  onReset: () => void;
}

function is參數(item: 設定項): item is Parameter {
  return 'key' in item;
}

function 選項說明({ children, description }: { children: React.ReactNode; description?: string }) {
  return (
    <div className="min-w-0">
      {children}
      {description && <div className="mt-1 whitespace-pre-line text-xs/5 text-gray-500">{description}</div>}
    </div>
  );
}

export default function DeriverOptions({ 方案名稱, 設定, onChange, onReset }: DeriverOptionsProps) {
  const 顯示設定列表 = 篩選顯示設定項(設定.列表);
  const 有參數 = 顯示設定列表.some(is參數);
  if (!有參數) return null;

  return (
    <div className="mt-5 border-t border-gray-700 pt-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h4 className="text-base">{方案名稱}選項</h4>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg bg-gray-700 px-2.5 py-1.5 text-sm text-gray-200 transition-colors hover:bg-gray-600"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          重置
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {顯示設定列表.map((item, index) => {
          if ('type' in item && item.type === 'newline') {
            return <div key={`newline-${index}`} className="h-0 basis-full" aria-hidden="true" />;
          }

          if ('type' in item && item.type === 'groupLabel') {
            return (
              <div key={`group-${index}`} className="basis-full py-2">
                <h5 className="text-sm">{item.text}</h5>
                {item.description && <div className="mt-1 whitespace-pre-line text-xs/5 text-gray-500">{item.description}</div>}
              </div>
            );
          }

          if (!is參數(item) || item.hidden) return null;

          const label = item.text ?? item.key;

          if (item.options) {
            const selectedIndex = item.options.findIndex(option => Object.is(option.value, item.value));
            return (
              <label key={item.key} className="inline-flex max-w-full items-center gap-2.5 text-sm text-gray-300">
                <選項說明 description={item.description}>{label}</選項說明>
                <select
                  value={selectedIndex}
                  onChange={event => onChange(item.key, item.options![Number(event.target.value)]!.value)}
                  className="h-8 w-auto max-w-full min-w-0 rounded-lg border border-gray-600 bg-gray-800 px-2.5 py-0 text-sm text-white [field-sizing:content] focus:border-blue-500 focus:outline-none"
                >
                  {item.options.map((option, optionIndex) => (
                    <option key={optionIndex} value={optionIndex}>
                      {option.text ?? String(option.value)}
                    </option>
                  ))}
                </select>
              </label>
            );
          }

          if (typeof item.value === 'boolean') {
            return (
              <label key={item.key} className="inline-flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={item.value}
                  onChange={event => onChange(item.key, event.target.checked)}
                  className="h-4 w-4 shrink-0 accent-blue-600"
                />
                <選項說明 description={item.description}>{label}</選項說明>
              </label>
            );
          }

          const isNumber = typeof item.value === 'number';
          return (
            <label key={item.key} className="inline-flex max-w-full items-center gap-2.5 text-sm text-gray-300">
              <選項說明 description={item.description}>{label}</選項說明>
              <input
                type={isNumber ? 'number' : 'text'}
                value={String(item.value)}
                onChange={event => onChange(item.key, isNumber ? Number(event.target.value) : event.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="h-8 w-52 max-w-full min-w-0 rounded-lg border border-gray-600 bg-gray-800 px-2.5 py-0 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </label>
          );
        })}
      </div>

      {設定.解析錯誤.length > 0 && <p className="mt-4 text-sm text-red-300">部分方案選項無法解析。</p>}
    </div>
  );
}
