export const useLocalStorageList = () => {
  const setList = (id) => {
    const wishlist = localStorage.getItem("wishlist");
    if (!wishlist) {
      localStorage.setItem("wishlist", id);
      return;
    }
    const listArr = [...new Set(wishlist.split(","))];
    const index = listArr.indexOf(id.toString());
    const found = index + 1;
    if (!found) {
      listArr.push(id);
      localStorage.setItem("wishlist", listArr);
    }
  };
  const removeList = (id) => {
    const wishlist = localStorage.getItem("wishlist");
    if (!wishlist) return;
    let listArr = wishlist.split(",");
    const index = listArr.indexOf(id.toString());
    const found = index + 1;
    if (found) {
      listArr.splice(index, 1);
      localStorage.setItem("wishlist", listArr);
    }
  };

  const existList = (id) => {
    const wishlist = localStorage.getItem("wishlist");
    if (!wishlist) return;
    const listArr = [...new Set(wishlist.split(","))];
    const index = listArr.indexOf(id.toString());
    const found = index + 1;
    if (found) {
      return true;
    } else {
      return false;
    }
  };

  return [setList, removeList, existList];
};
