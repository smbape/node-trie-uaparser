const flip = (obj, value, withValue) => {
    const res = {};
    Object.keys(obj).forEach(key => {
        res[obj[key]] = withValue ? value : key;
    });
    return res;
};

module.exports = flip;
