import heroProduce from '@/assets/images/catalogue/hero-produce.png';

export const catalogueHeroContent = {
  titleLines: ['FEED Export', 'Product'],
  titleHighlight: 'Catalogue',
  description: 'Farm to Foreign Exports Entrepreneurship Development Multi-State Co-operative Society Ltd.',
  // `wide` cards hold the long rupee figures and take a bigger share of the row
  stats: [
    { value: '56', label: 'Product families' },
    { value: '10', label: 'Product groups' },
    { value: '461', label: 'HSN products' },
    { value: '₹3,84,745.41 Cr', label: 'Total export FY26', wide: true },
    { value: '₹3,17,959.13 Cr', label: 'Total import FY26', wide: true },
  ],
  image: {
    src: heroProduce,
    alt: 'Spread of Indian spices, pulses, grains, fruits, vegetables and seafood in wooden bowls',
  },
};
