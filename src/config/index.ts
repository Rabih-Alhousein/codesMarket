export const PRODUCT_CATEGORIES = [
  {
    label: "Websites",
    value: "websites" as const,
    featured: [
      {
        name: "Website picks",
        href: `/products?category=websites`,
        imageSrc: "/nav/websites/website1.png",
      },
      {
        name: "New Arrivals",
        href: "/products?category=websites&sort=desc",
        imageSrc: "/nav/websites/website2.jpg",
      },
      {
        name: "Bestsellers",
        href: "/products?category=websites",
        imageSrc: "/nav/websites/website3.png",
      },
    ],
  },
  {
    label: "Apps",
    value: "apps" as const,
    featured: [
      {
        name: "Favorite application Picks",
        href: `/products?category=apps`,
        imageSrc: "/nav/apps/app1.png",
      },
      {
        name: "New Arrivals",
        href: "/products?category=apps&sort=desc",
        imageSrc: "/nav/apps/app2.png",
      },
      {
        name: "Bestselling Icons",
        href: "/products?category=apps",
        imageSrc: "/nav/apps/app3.jpg",
      },
    ],
  },
];
