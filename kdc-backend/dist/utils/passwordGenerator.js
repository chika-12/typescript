import crypto from 'crypto';
export const generateStrongPassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '@#$!%*?&';
    const all = uppercase + lowercase + numbers + symbols;
    // Guarantee at least one of each character type
    const password = [
        uppercase[crypto.randomInt(uppercase.length)],
        lowercase[crypto.randomInt(lowercase.length)],
        numbers[crypto.randomInt(numbers.length)],
        symbols[crypto.randomInt(symbols.length)],
        // Fill remaining 6 characters randomly
        ...Array.from({ length: 6 }, () => all[crypto.randomInt(all.length)]),
    ];
    // Shuffle so the guaranteed characters aren't always in the same position
    return password.sort(() => crypto.randomInt(3) - 1).join('');
};
//# sourceMappingURL=passwordGenerator.js.map