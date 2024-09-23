import { useTranslations } from "next-intl";
import { z } from "zod";
import { makeZodI18nMap } from "./zodErrorMap";

export const useI18nZodErrors = () => {
  const t = useTranslations("zod");
  z.setErrorMap(makeZodI18nMap({ t }));
};
