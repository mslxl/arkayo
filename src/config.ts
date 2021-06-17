const storage = storages.create("arkayo_db");
export function set(key: string, value: any) {
  storage.put(key, value)
}
export function get(key: string): any | null {
  let v = storage.get(key)
  if (v != undefined) {
    return v
  } else {
    return null
  }
}
export function getV(key: string, defValue: any): any {
  return storage.get(key, defValue)
}
export function getF(key: string, defValue: () => any): any {
  let v = storage.get(key)
  if (v == undefined) {
    return defValue()
  } else {
    return v
  }
}
export function doIfGet(key: string, act: (value: any) => void) {
  let v = get(key)
  if (v != null) {
    act(v)
  }
}