"use client"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "../i18n/navigation"
import type { Locale } from "../i18n/locales"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
    { label: "English", value: "en" },
    { label: "Azerbaijani", value: "az" },
] as const

export default function LocaleSwitcher() {
    const locale = useLocale()
    const pathname = usePathname()
    const router = useRouter()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline">{locale.toUpperCase()}</Button>} />
            <DropdownMenuContent className="w-32">
                <DropdownMenuRadioGroup
                    value={locale}
                    onValueChange={(lang) => router.replace(pathname, { locale: lang as Locale })}
                >
                    {languages.map((language) => (
                        <DropdownMenuRadioItem key={language.value} value={language.value}>
                            {language.label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
