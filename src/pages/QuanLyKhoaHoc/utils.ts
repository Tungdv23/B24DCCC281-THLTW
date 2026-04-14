import { KhoaHoc, KHOA_HOC_KEY, taoDuLieuMacDinh } from './types';

export function taiKhoaHoc(): KhoaHoc[] {
  const raw = localStorage.getItem(KHOA_HOC_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as KhoaHoc[];
    } catch (e) {
      // ignore and reseed
    }
  }
  const seeded = taoDuLieuMacDinh();
  try {
    localStorage.setItem(KHOA_HOC_KEY, JSON.stringify(seeded));
  } catch (e) {
    // ignore quota errors
  }
  return seeded;
}

export function luuKhoaHoc(khoaHoc: KhoaHoc[]) {
  try {
    localStorage.setItem(KHOA_HOC_KEY, JSON.stringify(khoaHoc));
  } catch (e) {
    // ignore
  }
}
