import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import ptLang from "@/locales/pt-BR.json"
import enLang from "@/locales/en-US.json"

function getTranslations(locale: string | undefined) {
    if (!locale) return ptLang

    return locale === "en-US" ? enLang : ptLang
}

export function useTranslations() {
  const { locale } = useRouter()
  const [t, setT] = useState(() => getTranslations(locale))
  const [currentLocale, setCurrentLocale] = useState<string>(locale || "pt-BR")

  useEffect(() => {
    setT(getTranslations(locale))
  }, [locale])

  const set = useCallback((newLocale: string) => {
    setT(getTranslations(newLocale))
    setCurrentLocale(newLocale)
  }, [])

  return { t, set, currentLocale }
}