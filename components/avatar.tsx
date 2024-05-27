'use client';

import Image from 'next/image';

type AvatarProps = {
  src: string | null | undefined;
};

const Avatar = ({ src }: AvatarProps) => {
  return (
    <Image
      src={src || '/images/cavatar.svg'}
      alt='avatar'
      height='30'
      width='30'
      className='rounded-full '
    />
  );
};

export default Avatar;