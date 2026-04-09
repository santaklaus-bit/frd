import edjsParser from 'editorjs-html';

try {
    const parser = edjsParser();
    console.log('Parser initialized successfully');
    const html = parser.parse({ blocks: [] });
    console.log('Parse result:', html);
} catch (e) {
    console.error('Error:', e);
}
