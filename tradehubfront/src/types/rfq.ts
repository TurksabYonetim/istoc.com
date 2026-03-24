/**
 * RFQ (Request for Quote) Page — TypeScript Interfaces
 * Types for RFQ form, products, customization cards, and testimonials.
 */

export interface Product {
  id: string;
  name: string;
  image: string;
  supplierCount: number;
  ctaText: string;
}

export interface CustomizationCard {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  position: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  avatar: string;
  name: string;
  title: string;
  company: string;
}

export interface RFQFormData {
  details: string;
  files: File[];
  aiEnabled: boolean;
}

export type AllowedFileExtension =
  | '.jpg'
  | '.jpeg'
  | '.png'
  | '.gif'
  | '.pdf'
  | '.doc'
  | '.docx'
  | '.xls'
  | '.xlsx';

export const FILE_UPLOAD_CONFIG = {
  maxFiles: 6,
  allowedExtensions: [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
  ] as AllowedFileExtension[],
  allowedFormatsDisplay: 'JPG, PNG, GIF, PDF, DOC, XLS',
} as const;
