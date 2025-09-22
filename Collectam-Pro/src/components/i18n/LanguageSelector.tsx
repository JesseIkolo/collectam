"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages, Globe, Check } from "lucide-react";
import { useI18n } from '@/lib/i18n';
import { SUPPORTED_LANGUAGES, Language } from '@/lib/i18n';

interface LanguageSelectorProps {
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
}

export function LanguageSelector({ variant = 'default', className }: LanguageSelectorProps) {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  const getLanguageFlag = (lang: Language): string => {
    const flags = {
      fr: '🇫🇷',
      en: '🇺🇸',
      ar: '🇸🇦'
    };
    return flags[lang] || '🌐';
  };

  const getLanguageNativeName = (lang: Language): string => {
    const names = {
      fr: 'Français',
      en: 'English',
      ar: 'العربية'
    };
    return names[lang] || lang;
  };

  if (variant === 'icon-only') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 ${className}`}>
            <Globe className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {Object.entries(SUPPORTED_LANGUAGES).map(([lang, name]) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang as Language)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getLanguageFlag(lang as Language)}</span>
                <span>{getLanguageNativeName(lang as Language)}</span>
              </div>
              {language === lang && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === 'compact') {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className={`gap-2 ${className}`}>
            <span className="text-sm">{getLanguageFlag(language)}</span>
            <span className="text-xs font-medium">{language.toUpperCase()}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {Object.entries(SUPPORTED_LANGUAGES).map(([lang, name]) => (
            <DropdownMenuItem
              key={lang}
              onClick={() => handleLanguageChange(lang as Language)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{getLanguageFlag(lang as Language)}</span>
                <span>{getLanguageNativeName(lang as Language)}</span>
              </div>
              {language === lang && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`gap-2 ${className}`}>
          <Languages className="h-4 w-4" />
          <span className="text-lg">{getLanguageFlag(language)}</span>
          <span>{getLanguageNativeName(language)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="p-2">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            {t('settings.language')}
          </p>
        </div>
        {Object.entries(SUPPORTED_LANGUAGES).map(([lang, name]) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => handleLanguageChange(lang as Language)}
            className="flex items-center justify-between cursor-pointer py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{getLanguageFlag(lang as Language)}</span>
              <div>
                <p className="font-medium">{getLanguageNativeName(lang as Language)}</p>
                <p className="text-xs text-muted-foreground">{name}</p>
              </div>
            </div>
            {language === lang && (
              <Badge variant="default" className="h-5 px-2 text-xs">
                <Check className="h-3 w-3" />
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
