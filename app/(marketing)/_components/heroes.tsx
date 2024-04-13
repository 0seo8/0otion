import Image from 'next/image';
import React from 'react';

export default function Heroes() {
  return (
    <div className="flex max-w-5xl flex-col items-center justify-center">
      <div className="flex items-center">
        <div className="relative size-[300px] sm:size-[350px] md:size-[400px]">
          <Image alt="Documents" className="object-contain" fill src="/documents.webp" />
        </div>
        <div className="relative hidden size-[400px] md:block ">
          <Image alt="Reading" className="object-contain" fill src="/reading.webp" />
        </div>
      </div>
    </div>
  );
}
