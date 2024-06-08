'use client';

import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

type GoogleCaptchaWrapperProps = {
  children: React.ReactNode;
};

export default function GoogleCaptchaWrapper({
  children,
}: GoogleCaptchaWrapperProps) {
  const captchaKey = process.env.NEXT_PUBLIC_RECAPTCHA_KEY;
  console.log('🚀 ~ captchaKey:', captchaKey);
  if (!captchaKey) throw new Error('No Key found!');

  return (
    <GoogleReCaptchaProvider reCaptchaKey={captchaKey}>
      {children}
    </GoogleReCaptchaProvider>
  );
}
