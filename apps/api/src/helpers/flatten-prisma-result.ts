type Translatable = {
  translations?: {
    name?: string;
    slug?: string;
    description?: string;
    [key: string]: any;
  }[];
  [key: string]: any;
};

export function flattenTranslation<T extends Translatable>(
  item: T | undefined
): Omit<T, "translations"> & { name: string | null; slug: string | null } {
  try {
    const { translations, ...rest } = item;

    const name = translations?.[0]?.name ?? null;
    const slug = translations?.[0]?.slug ?? null;
    const description = translations?.[0]?.description ?? null;

    return {
      ...rest,
      name,
      slug,
      description,
    };
  } catch (error) {
    return item as any;
  }
}
