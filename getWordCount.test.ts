import getWordCount from "./getWordCount";

test("count English texts", () => {
    const cnt = getWordCount("Hi, this is some English text.");
    expect(cnt).toBe(6);
});

test("count Japanese texts", () => {
   const cnt = getWordCount("こんにちは。これは、少しの日本語のテキストです。")
   expect(cnt).toBe(24);
});

test("count English texts with apostrophe", () => {
    const cnt = getWordCount("Hi, this might've been some English text which should work with apostrophes.");
    expect(cnt).toBe(12);
});
