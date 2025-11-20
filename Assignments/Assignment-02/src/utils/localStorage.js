const getLocalStorageItem = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}

const setLocalStorageItem = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

export { getLocalStorageItem, setLocalStorageItem };