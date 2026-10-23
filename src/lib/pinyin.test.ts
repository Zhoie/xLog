import { expect, test } from "vitest"
import pinyin from "pinyin"

test("Chinese titles retain the editor slug transliteration without native modules", () => {
  expect(
    pinyin("你好世界", { style: pinyin.STYLE_NORMAL, compact: true }),
  ).toEqual([["ni", "hao", "shi", "jie"]])
  expect(
    pinyin("hello world", { style: pinyin.STYLE_NORMAL, compact: true }),
  ).toEqual([["hello world"]])
})
