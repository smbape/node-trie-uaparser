const reverseSlice = (arr, len, start = 0) => {
    const res = new Array(len);
    for (let i = 0; i < len; i++) {
        res[len - 1 - i] = arr[i + start];
    }
    return res;
};

module.exports = reverseSlice;
