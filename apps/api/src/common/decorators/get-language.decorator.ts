import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Language } from "@prisma/client";
import { Request } from "express";

const ACCEPT_LANGUAGE_HEADER = "accept-language";
const DEFAULT_LANGUAGE: Language = "vi";
const SUPPORTED_LANGUAGES = Object.values(Language);

export const parseLanguage = (languageHeader: string | undefined): Language => {
  if (!languageHeader) {
    return DEFAULT_LANGUAGE;
  }

  // Get the base language code (e.g., 'vi' from 'vi-VN')
  const baseLanguage = languageHeader.split("-")[0].toLowerCase();

  // Check if the language is supported, otherwise fallback to default
  return SUPPORTED_LANGUAGES.includes(baseLanguage as Language)
    ? (baseLanguage as Language)
    : DEFAULT_LANGUAGE;
};

export const GetLanguage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Language => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const languageHeader = request.headers[ACCEPT_LANGUAGE_HEADER];
    return parseLanguage(languageHeader as string);
  }
);
