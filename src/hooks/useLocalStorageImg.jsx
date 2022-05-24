export const useLocalStorageImg = () => {
  const setImg = (key, value) => {
    localStorage.setItem(key, value);
  };
  const checkImg = (key) => {
    const found = localStorage.getItem(key);
    if (!found) return;
    return found;
  };
  return [setImg, checkImg];
};
