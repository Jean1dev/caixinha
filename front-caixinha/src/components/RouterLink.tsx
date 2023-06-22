//@ts-nocheck
import { forwardRef } from 'react';
import Link from 'next/link';

/**
 * This is a wrapper over `next/link` component.
 * We use this to help us maintain consistency between Vite and Next.js
 */
export const RouterLink = forwardRef(function RouterLink(props, ref) {
  return (
    <Link
      ref={ref}
      {...props} />
  );
});
