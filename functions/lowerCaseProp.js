const lowerCaseProp = (obj, lvalue, lprop) => {
    const res = Object.create(null);

    if (typeof obj !== "object" || obj === null) {
        return res;
    }

    Object.keys(obj).forEach(prop => {
        let value = obj[prop];
        if (lvalue) {
            if (Array.isArray(value)) {
                value = value.map(item => {
                    return typeof item === "string" ? item.toLowerCase() : item;
                });
            } else if (typeof obj[prop] === "string") {
                value = value.toLowerCase();
            } else if (typeof obj[prop] === "object" && obj[prop] !== null) {
                value = lowerCaseProp(value, lvalue, lprop);
            }
        }

        res[lprop !== false ? prop.toLowerCase() : prop] = value;
    });

    return res;
};

module.exports = lowerCaseProp;
