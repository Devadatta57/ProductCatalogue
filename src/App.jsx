import { useLayoutEffect } from 'react';
import { takeReturnScroll, useHashRoute } from '@/hooks/useHashRoute';
import CataloguePage from '@/pages/CataloguePage';

// Extra pages by route; anything else shows the catalogue home page
const pages = {};

export default function App() {
  const route = useHashRoute();

  // Home: back to where the user was before opening another page.
  // Any other page: start at the top.
  useLayoutEffect(() => {
    if (route === '/') {
      const y = takeReturnScroll();
      if (y !== null) window.scrollTo(0, y);
    } else {
      window.scrollTo(0, 0);
    }
  }, [route]);

  const Page = pages[route] ?? CataloguePage;
  return <Page />;
}
