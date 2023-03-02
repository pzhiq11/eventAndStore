
let userId = '';

export async function getUserId() {
  try {
    if (userId) return userId;
    // const res = await User.isLogin();
    userId = 'pzq';//res?.userId
    return userId;
  } catch (error) {
    console.log(error);
    return '';
  }
}

export function setStorage(key: string, item: string) {
  console.log(`set storeage${userId}${key}`);
  localStorage.setItem(userId + key, item);
}

export function getStorage(key: string) {
  console.log(`get storeage${userId}${key}`);
  return localStorage.getItem(userId + key);
}
