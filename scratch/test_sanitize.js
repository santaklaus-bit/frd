function sanitize(key) {
    let privateKey = key.trim();
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');
    return privateKey;
}

const testCases = [
    { name: "With quotes and literal \\n", input: '"LINE1\\nLINE2"', expected: "LINE1\nLINE2" },
    { name: "No quotes, literal \\n", input: 'LINE1\\nLINE2', expected: "LINE1\nLINE2" },
    { name: "With real newlines and space", input: '  LINE1\nLINE2  ', expected: "LINE1\nLINE2" },
];

testCases.forEach(tc => {
    const result = sanitize(tc.input);
    console.log(`Test: ${tc.name}`);
    console.log(`Match: ${result === tc.expected}`);
    if (result !== tc.expected) {
        console.log(`Result:   [${result.replace(/\n/g, '\\n')}]`);
        console.log(`Expected: [${tc.expected.replace(/\n/g, '\\n')}]`);
    }
});
