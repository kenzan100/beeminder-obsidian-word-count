import getWordCount from "./getWordCount";

test("count English texts", () => {
    const cnt = getWordCount("Hi, this is some English texts.");
    expect(cnt).toBe(6);
});

test("count Japanese texts", () => {
   const cnt = getWordCount("こんにちは。これは、少しの日本語のテキストです。")
   expect(cnt).toBe(24);
});