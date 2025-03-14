const getRandomBase64 = (length: number, seed: string = "") => {
    let randomChars = shuffleString("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_");
    let result = "";
    let seed_ln = seed.length,
        randomChars_ln = randomChars.length;
    for (let i = 0; i < length; i++)
        if (seed_ln)
            result += randomChars.charAt(
                ((randomChars.indexOf(seed.charAt(i % seed_ln)) * (i + 1) + randomChars.indexOf(seed.charAt(seed_ln - (i % seed_ln))) * (length - i)) *
                    Math.floor(Math.random() * randomChars_ln * randomChars_ln)) %
                    randomChars_ln
            );
        else result += randomChars.charAt(Math.floor(Math.random() * randomChars_ln));

    return result;
};

const shuffleString = (s: string) =>
    s
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");

export { getRandomBase64 };
