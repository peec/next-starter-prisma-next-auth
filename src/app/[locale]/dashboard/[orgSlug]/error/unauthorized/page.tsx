import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("pages.dashboard/error/unauthorized");
  return <p>{t("message")}</p>;
}
