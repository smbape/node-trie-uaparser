const lcs = (str1, str2) => {
    if (!str1 || !str2) {
        return {
            length: 0,
            sequence: "",
            offset1: 0,
            offset2: 0
        };
    }

    const str1Length = str1.length;
    const str2Length = str2.length;
    const num = new Array(str1Length);
    const sequence = new Array(str1Length > str2Length ? str2Length : str1Length);

    let length = 0;
    let lastOffset = 0;
    let seqlen = 0;

    let i, j;

    for (i = 0; i < str1Length; i++) {
        num[i] = new Array(str2Length);
        for (j = 0; j < str2Length; j++) {
            num[i][j] = 0;
        }
    }

    let offset1 = 0;
    let offset2 = 0;

    for (i = 0; i < str1Length; i++) {
        for (j = 0; j < str2Length; j++) {
            if (str1[i] !== str2[j]) {
                num[i][j] = 0;
                continue;
            }

            if (i === 0 || j === 0) {
                num[i][j] = 1;
            } else {
                num[i][j] = 1 + num[i - 1][j - 1];
            }

            if (num[i][j] <= length) {
                continue;
            }

            length = num[i][j];
            offset1 = i - num[i][j] + 1;
            offset2 = j - num[i][j] + 1;

            if (lastOffset === offset1) {
                // if the current LCS is the same as the last time this block ran
                sequence[seqlen++] = str1[i];
            } else {
                // this block resets the string builder if a different LCS is found
                lastOffset = offset1;
                seqlen = 0;
                sequence[seqlen++] = str1.slice(lastOffset, i + 1);
            }
        }
    }

    return {
        sequence: sequence.slice(0, seqlen).join(""),
        length,
        offset1,
        offset2
    };
};

module.exports = lcs;
