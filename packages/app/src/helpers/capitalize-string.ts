/**
 * Capitalize the first letter of a string
 * hello world => Hello World
 *
 */

export const capitalizeString = (str: string | undefined | null) => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeFirstLetter = (str: string | undefined | null) => {
  if (!str) return ""
  return str.charAt(0).toUpperCase() + str.slice(1)
}
