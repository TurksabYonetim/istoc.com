/**
 * Legal Pages Content Data
 * Internationalized content for Terms, Privacy, Cookies, Returns pages
 */

import type { LegalSection } from '../components/legal/LegalPageLayout';
import { t } from '../i18n';

export interface LegalPageData {
  pageTitle: string;
  lastUpdated: string;
  breadcrumbLabel: string;
  sections: LegalSection[];
}

export function termsContent(): LegalPageData {
  return {
    pageTitle: t('legal.terms.pageTitle'),
    lastUpdated: t('legal.terms.lastUpdated'),
    breadcrumbLabel: t('legal.terms.breadcrumbLabel'),
    sections: [
      {
        id: 'tanimlar',
        title: t('legal.terms.section1Title'),
        content: t('legal.terms.section1Content'),
      },
      {
        id: 'kapsam',
        title: t('legal.terms.section2Title'),
        content: t('legal.terms.section2Content'),
      },
      {
        id: 'uyelik',
        title: t('legal.terms.section3Title'),
        content: t('legal.terms.section3Content'),
      },
      {
        id: 'siparis',
        title: t('legal.terms.section4Title'),
        content: t('legal.terms.section4Content'),
      },
      {
        id: 'odeme',
        title: t('legal.terms.section5Title'),
        content: t('legal.terms.section5Content'),
      },
      {
        id: 'kargo',
        title: t('legal.terms.section6Title'),
        content: t('legal.terms.section6Content'),
      },
      {
        id: 'iade',
        title: t('legal.terms.section7Title'),
        content: t('legal.terms.section7Content'),
      },
      {
        id: 'fikri-mulkiyet',
        title: t('legal.terms.section8Title'),
        content: t('legal.terms.section8Content'),
      },
      {
        id: 'sorumluluk',
        title: t('legal.terms.section9Title'),
        content: t('legal.terms.section9Content'),
      },
      {
        id: 'uygulanacak-hukuk',
        title: t('legal.terms.section10Title'),
        content: t('legal.terms.section10Content'),
      },
    ],
  };
}

export function privacyContent(): LegalPageData {
  return {
    pageTitle: t('legal.privacy.pageTitle'),
    lastUpdated: t('legal.privacy.lastUpdated'),
    breadcrumbLabel: t('legal.privacy.breadcrumbLabel'),
    sections: [
      {
        id: 'veri-sorumlusu',
        title: t('legal.privacy.section1Title'),
        content: t('legal.privacy.section1Content'),
      },
      {
        id: 'toplanan-veriler',
        title: t('legal.privacy.section2Title'),
        content: t('legal.privacy.section2Content'),
      },
      {
        id: 'isleme-amaclari',
        title: t('legal.privacy.section3Title'),
        content: t('legal.privacy.section3Content'),
      },
      {
        id: 'hukuki-dayanak',
        title: t('legal.privacy.section4Title'),
        content: t('legal.privacy.section4Content'),
      },
      {
        id: 'veri-paylasimi',
        title: t('legal.privacy.section5Title'),
        content: t('legal.privacy.section5Content'),
      },
      {
        id: 'uluslararasi-transfer',
        title: t('legal.privacy.section6Title'),
        content: t('legal.privacy.section6Content'),
      },
      {
        id: 'veri-hakklari',
        title: t('legal.privacy.section7Title'),
        content: t('legal.privacy.section7Content'),
      },
      {
        id: 'iletisim',
        title: t('legal.privacy.section8Title'),
        content: t('legal.privacy.section8Content'),
      },
    ],
  };
}

export function cookiesContent(): LegalPageData {
  return {
    pageTitle: t('legal.cookies.pageTitle'),
    lastUpdated: t('legal.cookies.lastUpdated'),
    breadcrumbLabel: t('legal.cookies.breadcrumbLabel'),
    sections: [
      {
        id: 'cerez-nedir',
        title: t('legal.cookies.section1Title'),
        content: t('legal.cookies.section1Content'),
      },
      {
        id: 'zorunlu',
        title: t('legal.cookies.section2Title'),
        content: t('legal.cookies.section2Content'),
      },
      {
        id: 'fonksiyonel',
        title: t('legal.cookies.section3Title'),
        content: t('legal.cookies.section3Content'),
      },
      {
        id: 'analitik',
        title: t('legal.cookies.section4Title'),
        content: t('legal.cookies.section4Content'),
      },
      {
        id: 'pazarlama',
        title: t('legal.cookies.section5Title'),
        content: t('legal.cookies.section5Content'),
      },
      {
        id: 'yonetim',
        title: t('legal.cookies.section6Title'),
        content: t('legal.cookies.section6Content'),
      },
    ],
  };
}

export function returnsContent(): LegalPageData {
  return {
    pageTitle: t('legal.returns.pageTitle'),
    lastUpdated: t('legal.returns.lastUpdated'),
    breadcrumbLabel: t('legal.returns.breadcrumbLabel'),
    sections: [
      {
        id: 'genel-kosullar',
        title: t('legal.returns.section1Title'),
        content: t('legal.returns.section1Content'),
      },
      {
        id: 'iade-suresi',
        title: t('legal.returns.section2Title'),
        content: t('legal.returns.section2Content'),
      },
      {
        id: 'iade-sureci',
        title: t('legal.returns.section3Title'),
        content: t('legal.returns.section3Content'),
      },
      {
        id: 'kargo',
        title: t('legal.returns.section4Title'),
        content: t('legal.returns.section4Content'),
      },
      {
        id: 'inceleme',
        title: t('legal.returns.section5Title'),
        content: t('legal.returns.section5Content'),
      },
      {
        id: 'para-iadesi',
        title: t('legal.returns.section6Title'),
        content: t('legal.returns.section6Content'),
      },
      {
        id: 'istisnalar',
        title: t('legal.returns.section7Title'),
        content: t('legal.returns.section7Content'),
      },
    ],
  };
}
