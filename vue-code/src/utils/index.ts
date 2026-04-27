// 日期时间格式化
export function formatDate(val: string | Date | null | undefined, fmt = 'YYYY-MM-DD'): string {
  if (!val) return ''
  const d = new Date(val)
  if (isNaN(d.getTime())) return String(val)
  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    MM: String(d.getMonth() + 1).padStart(2, '0'),
    DD: String(d.getDate()).padStart(2, '0'),
    HH: String(d.getHours()).padStart(2, '0'),
    mm: String(d.getMinutes()).padStart(2, '0'),
    ss: String(d.getSeconds()).padStart(2, '0'),
  }
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (k) => map[k])
}

// 从 options 列表中根据 value 找 label
export function getLabel(
  options: { value: string | number; label: string }[],
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) return ''
  return options.find((o) => String(o.value) === String(value))?.label ?? String(value)
}

// 深拷贝
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}
