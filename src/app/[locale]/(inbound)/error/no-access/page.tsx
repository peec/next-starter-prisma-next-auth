import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("pages.error/no-access");
  return <p className="text-center">{t("title")}</p>;
}
