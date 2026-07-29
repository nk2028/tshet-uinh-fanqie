import type { Parameter, 設定項 } from 'tshet-uinh-deriver-tools';

function is參數(item: 設定項): item is Parameter {
  return 'key' in item;
}

/**
 * Determines whether a settings group is visible from a boolean parameter
 * with the same name.
 *
 * For example, `['更多選項', false]` in the raw option list is parsed as a
 * boolean parameter, while the following `'更多選項'` is parsed as a
 * `groupLabel` with the same name. When the parameter is false, the group label
 * and the settings after it are hidden. Visibility resumes at the next group
 * label that is not controlled by a false parameter. All options remain in
 * `推導設定`; this function only controls their presentation in the UI.
 */
export function 篩選顯示設定項(列表: readonly 設定項[]): readonly 設定項[] {
  let 顯示當前分組 = true;

  return 列表.filter(item => {
    if ('type' in item && item.type === 'groupLabel') {
      // A boolean parameter with the same name acts as the group's visibility toggle.
      const 控制選項 = 列表.find(
        (candidate): candidate is Parameter =>
          is參數(candidate) && candidate.key === item.text && typeof candidate.value === 'boolean'
      );
      顯示當前分組 = 控制選項?.value !== false;
    }

    return 顯示當前分組;
  });
}
