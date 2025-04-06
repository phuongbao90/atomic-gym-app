import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TranslationService {
  constructor(private readonly prisma: PrismaService) {}

  async getTranslations(keys: string[], languageId: string) {
    const translations = await this.prisma.text.findMany({
      where: {
        key: {
          in: keys,
        },
      },
      include: {
        translations: {
          where: {
            languageId,
          },
        },
      },
    });

    return new Map(
      translations.map((text) => [
        text.key,
        text.translations[0]?.content || text.originalText,
      ])
    );
  }

  async translateEntities<T extends { nameKey: string }>(
    entities: T[],
    languageId: string,
    translationFields: { [key: string]: keyof T & string } = {
      name: "nameKey",
    }
  ): Promise<(T & { [key: string]: string })[]> {
    if (!entities.length) return [];

    // Collect all keys that need translation
    const keysToTranslate = entities.reduce((keys, entity) => {
      for (const field of Object.values(translationFields)) {
        if (entity[field as keyof T]) {
          keys.add(entity[field as keyof T] as string);
        }
      }
      return keys;
    }, new Set<string>());

    const translationMap = await this.getTranslations(
      Array.from(keysToTranslate),
      languageId
    );

    // Map translations back to entities
    return entities.map((entity) => {
      const translatedEntity = { ...entity };
      for (const [newField, keyField] of Object.entries(translationFields)) {
        const key = entity[keyField as keyof T];
        if (key) {
          translatedEntity[newField] = translationMap.get(key as string) || key;
        }
      }
      return translatedEntity;
    });
  }
}
