import { SetMetadata } from '@nestjs/common';

export const PREMIUM_KEY = 'requiresPremium';
// Kontroller/metodni faqat premium foydalanuvchilar uchun cheklaydi
export const RequirePremium = () => SetMetadata(PREMIUM_KEY, true);
