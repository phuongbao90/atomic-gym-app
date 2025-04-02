global.beforeEach(() => {
  console.log("beforeEach")
  //   jest.mock("./apps/mobile/src/configs/i18n", () => ({
  //     __esModule: true,
  //     default: {
  //       language: "en",
  //     },
  //   }))
})

global.afterEach(() => {
  console.log("afterEach")
})
