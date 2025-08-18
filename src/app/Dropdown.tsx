import { ChevronDown } from 'lucide-react';
import { 音韻地位 } from 'tshet-uinh';
import { 檢索結果 } from 'tshet-uinh/lib/資料';

interface CustomDropdownProps {
  候選: 檢索結果[];
  當前選擇: 音韻地位 | null;
  推導現代音: (當前音韻地位: 音韻地位) => string;
  onSelect: (pronunciation: 音韻地位 | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

// 自定義下拉組件
const CustomDropdown: React.FC<CustomDropdownProps> = ({ 候選, 當前選擇, 推導現代音, onSelect, isOpen, setIsOpen, dropdownRef }) => {
  const selectedItem = 候選.find(p => 當前選擇 && p.音韻地位.等於(當前選擇));

  return (
    <div className="relative fanqie-select-box" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fanqie-select-btn bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none flex items-center justify-between"
      >
        <div className="flex-1 min-w-0">
          {selectedItem ? (
            <div>
              <div className="fanqie-select-btn-title">{`${selectedItem.音韻地位.描述} (${推導現代音(selectedItem.音韻地位)})`}</div>
              <div className="fanqie-select-btn-text truncate">{selectedItem.釋義}</div>
            </div>
          ) : (
            <span></span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
          {候選.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onSelect(item.音韻地位);
                setIsOpen(false);
              }}
              className="fanqie-select-btn border-b border-gray-700 last:border-b-0"
            >
              <div className="fanqie-select-btn-title">{`${item.音韻地位.描述} (${推導現代音(item.音韻地位)})`}</div>
              <div className="fanqie-select-btn-text leading-relaxed">{item.釋義}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
