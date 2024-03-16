"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import React, { useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface NavItemsProps {}

const NavItems: React.FC<NavItemsProps> = ({}) => {
  const navRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  useOnClickOutside(navRef, () => {
    setActiveIndex(null);
  });

  // close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveIndex(null);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleOpen = (index: number) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const isAnyOpen = activeIndex !== null;

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, index) => {
        const isOpen = activeIndex === index;

        return (
          <NavItem
            key={category.label}
            category={category}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
            handleOpen={() => handleOpen(index)}
          />
        );
      })}
    </div>
  );
};

export default NavItems;
