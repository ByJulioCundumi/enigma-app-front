export const checkVip = (vipExpireAt: number | null): boolean => {
  if (!vipExpireAt) return false;

  return Date.now() < vipExpireAt;
};