/**
 * RFQ Page Mock Data
 * Internationalized mock data for all RFQ page sections — B2B marketplace style.
 */

import { t } from '../i18n';
import type { CustomizationCard, Product, Testimonial } from '../types/rfq';

export function getCustomizationCards(): CustomizationCard[] {
  return [
    {
      id: 'card-1',
      title: t('mockData.rfqData.custCard1Title'),
      subtitle: t('mockData.rfqData.custCard1Subtitle'),
      icon: '🎨',
      position: 1,
    },
    {
      id: 'card-2',
      title: t('mockData.rfqData.custCard2Title'),
      subtitle: t('mockData.rfqData.custCard2Subtitle'),
      icon: '🏷️',
      position: 2,
    },
    {
      id: 'card-3',
      title: t('mockData.rfqData.custCard3Title'),
      subtitle: t('mockData.rfqData.custCard3Subtitle'),
      icon: '📦',
      position: 3,
    },
    {
      id: 'card-4',
      title: t('mockData.rfqData.custCard4Title'),
      subtitle: t('mockData.rfqData.custCard4Subtitle'),
      icon: '🎁',
      position: 4,
    },
  ];
}

export function getSelectedProducts(): Product[] {
  return [
    {
      id: 'sp-1',
      name: t('mockData.rfqData.sp1Name'),
      image: '',
      supplierCount: 128,
      ctaText: t('mockData.rfqData.spCta'),
    },
    {
      id: 'sp-2',
      name: t('mockData.rfqData.sp2Name'),
      image: '',
      supplierCount: 256,
      ctaText: t('mockData.rfqData.spCta'),
    },
    {
      id: 'sp-3',
      name: t('mockData.rfqData.sp3Name'),
      image: '',
      supplierCount: 89,
      ctaText: t('mockData.rfqData.spCta'),
    },
    {
      id: 'sp-4',
      name: t('mockData.rfqData.sp4Name'),
      image: '',
      supplierCount: 67,
      ctaText: t('mockData.rfqData.spCta'),
    },
    {
      id: 'sp-5',
      name: t('mockData.rfqData.sp5Name'),
      image: '',
      supplierCount: 194,
      ctaText: t('mockData.rfqData.spCta'),
    },
    {
      id: 'sp-6',
      name: t('mockData.rfqData.sp6Name'),
      image: '',
      supplierCount: 312,
      ctaText: t('mockData.rfqData.spCta'),
    },
  ];
}

export function getCustomProducts(): Product[] {
  const cpCta = t('mockData.rfqData.cpCta');
  return [
    { id: 'cp-1', name: t('mockData.rfqData.cp1Name'), image: '', supplierCount: 45, ctaText: cpCta },
    { id: 'cp-2', name: t('mockData.rfqData.cp2Name'), image: '', supplierCount: 32, ctaText: cpCta },
    { id: 'cp-3', name: t('mockData.rfqData.cp3Name'), image: '', supplierCount: 78, ctaText: cpCta },
    { id: 'cp-4', name: t('mockData.rfqData.cp4Name'), image: '', supplierCount: 156, ctaText: cpCta },
    { id: 'cp-5', name: t('mockData.rfqData.cp5Name'), image: '', supplierCount: 23, ctaText: cpCta },
    { id: 'cp-6', name: t('mockData.rfqData.cp6Name'), image: '', supplierCount: 89, ctaText: cpCta },
    { id: 'cp-7', name: t('mockData.rfqData.cp7Name'), image: '', supplierCount: 234, ctaText: cpCta },
    { id: 'cp-8', name: t('mockData.rfqData.cp8Name'), image: '', supplierCount: 112, ctaText: cpCta },
    { id: 'cp-9', name: t('mockData.rfqData.cp9Name'), image: '', supplierCount: 67, ctaText: cpCta },
    { id: 'cp-10', name: t('mockData.rfqData.cp10Name'), image: '', supplierCount: 145, ctaText: cpCta },
    { id: 'cp-11', name: t('mockData.rfqData.cp11Name'), image: '', supplierCount: 56, ctaText: cpCta },
    { id: 'cp-12', name: t('mockData.rfqData.cp12Name'), image: '', supplierCount: 98, ctaText: cpCta },
    { id: 'cp-13', name: t('mockData.rfqData.cp13Name'), image: '', supplierCount: 43, ctaText: cpCta },
    { id: 'cp-14', name: t('mockData.rfqData.cp14Name'), image: '', supplierCount: 34, ctaText: cpCta },
    { id: 'cp-15', name: t('mockData.rfqData.cp15Name'), image: '', supplierCount: 178, ctaText: cpCta },
    { id: 'cp-16', name: t('mockData.rfqData.cp16Name'), image: '', supplierCount: 201, ctaText: cpCta },
    { id: 'cp-17', name: t('mockData.rfqData.cp17Name'), image: '', supplierCount: 89, ctaText: cpCta },
    { id: 'cp-18', name: t('mockData.rfqData.cp18Name'), image: '', supplierCount: 67, ctaText: cpCta },
    { id: 'cp-19', name: t('mockData.rfqData.cp19Name'), image: '', supplierCount: 34, ctaText: cpCta },
    { id: 'cp-20', name: t('mockData.rfqData.cp20Name'), image: '', supplierCount: 156, ctaText: cpCta },
    { id: 'cp-21', name: t('mockData.rfqData.cp21Name'), image: '', supplierCount: 278, ctaText: cpCta },
    { id: 'cp-22', name: t('mockData.rfqData.cp22Name'), image: '', supplierCount: 23, ctaText: cpCta },
    { id: 'cp-23', name: t('mockData.rfqData.cp23Name'), image: '', supplierCount: 345, ctaText: cpCta },
    { id: 'cp-24', name: t('mockData.rfqData.cp24Name'), image: '', supplierCount: 45, ctaText: cpCta },
    { id: 'cp-25', name: t('mockData.rfqData.cp25Name'), image: '', supplierCount: 78, ctaText: cpCta },
    { id: 'cp-26', name: t('mockData.rfqData.cp26Name'), image: '', supplierCount: 19, ctaText: cpCta },
    { id: 'cp-27', name: t('mockData.rfqData.cp27Name'), image: '', supplierCount: 123, ctaText: cpCta },
    { id: 'cp-28', name: t('mockData.rfqData.cp28Name'), image: '', supplierCount: 267, ctaText: cpCta },
    { id: 'cp-29', name: t('mockData.rfqData.cp29Name'), image: '', supplierCount: 56, ctaText: cpCta },
    { id: 'cp-30', name: t('mockData.rfqData.cp30Name'), image: '', supplierCount: 12, ctaText: cpCta },
    { id: 'cp-31', name: t('mockData.rfqData.cp31Name'), image: '', supplierCount: 89, ctaText: cpCta },
    { id: 'cp-32', name: t('mockData.rfqData.cp32Name'), image: '', supplierCount: 15, ctaText: cpCta },
    { id: 'cp-33', name: t('mockData.rfqData.cp33Name'), image: '', supplierCount: 67, ctaText: cpCta },
    { id: 'cp-34', name: t('mockData.rfqData.cp34Name'), image: '', supplierCount: 134, ctaText: cpCta },
    { id: 'cp-35', name: t('mockData.rfqData.cp35Name'), image: '', supplierCount: 45, ctaText: cpCta },
    { id: 'cp-36', name: t('mockData.rfqData.cp36Name'), image: '', supplierCount: 198, ctaText: cpCta },
  ];
}

export function getTestimonials(): Testimonial[] {
  return [
    {
      id: 'testimonial-1',
      quote: t('mockData.rfqData.testimonial1Quote'),
      avatar: '',
      name: t('mockData.rfqData.testimonial1Name'),
      title: t('mockData.rfqData.testimonial1Title'),
      company: t('mockData.rfqData.testimonial1Company'),
    },
    {
      id: 'testimonial-2',
      quote: t('mockData.rfqData.testimonial2Quote'),
      avatar: '',
      name: t('mockData.rfqData.testimonial2Name'),
      title: t('mockData.rfqData.testimonial2Title'),
      company: t('mockData.rfqData.testimonial2Company'),
    },
    {
      id: 'testimonial-3',
      quote: t('mockData.rfqData.testimonial3Quote'),
      avatar: '',
      name: t('mockData.rfqData.testimonial3Name'),
      title: t('mockData.rfqData.testimonial3Title'),
      company: t('mockData.rfqData.testimonial3Company'),
    },
  ];
}
