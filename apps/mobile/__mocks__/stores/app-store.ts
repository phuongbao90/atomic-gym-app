import { observable } from "@legendapp/state"
// import { mockedI18n } from "../i18n"

export const mockAppStore$ = observable({
  theme: "light" as "light" | "dark",
  switchTheme: jest.fn(() => {
    const nextTheme = mockAppStore$.theme.get() === "light" ? "dark" : "light"
    mockAppStore$.theme.set(nextTheme)
  }),
  language: "vi" as "vi" | "en",
  switchLanguage: jest.fn(() => {
    const nextLang = mockAppStore$.language.get() === "vi" ? "en" : "vi"
    // mockedI18n.changeLanguage(nextLang, () => {
    mockAppStore$.language.set(nextLang)
    // })
  }),
})

// jest.mock("../../src/stores/app-store", () => ({
//   appStore$: mockAppStore$,
// }))

// jest.mock("@legendapp/state/react", () => ({
//   use$: jest.fn((value) => value),
// }))
