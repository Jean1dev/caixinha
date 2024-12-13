import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import ptLang from "@/locales/pt-BR.json"
import enLang from "@/locales/en-US.json"

function getTranslations(locale: string | undefined) {
    if (!locale) return ptLang

    return locale === "en-US" ? enLang : ptLang
}

export function useTranslations() {
  const { locale } = useRouter()
  const [t, setT] = useState(() => getTranslations(locale))
  
  useEffect(() => {
    setT(getTranslations(locale))
  }, [locale])

  return { t }
}