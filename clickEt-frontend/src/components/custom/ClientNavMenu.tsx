import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";

type MenuItem = {
  title: string;
  href: string;
  className?: string;
};

type MenuProps = {
  config: MenuItem[];
  maxWidth?: number;
};

const withDefaultIndex = (a: number, def = 0): number => (!~a ? def : a);

const curRouteIndex = (items: MenuItem[], pathname: string): number => {
  return withDefaultIndex(items.findIndex((e) => e.href === pathname));
};

const Menu: React.FC<MenuProps> = ({ config }) => {
  const location = useLocation();
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    curRouteIndex(config, location.pathname)
  );
  const [underlineStyles, setUnderlineStyles] = useState({
    width: 0,
    left: 0,
  });
  const menuItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Update underline position and width based on the current active/hovered item
  const updateUnderline = (index: number) => {
    const currentItem = menuItemsRef.current[index];
    if (currentItem) {
      const parentLeft = currentItem.parentElement?.getBoundingClientRect().left || 0;
      const itemRect = currentItem.getBoundingClientRect();
      const linkElement = currentItem.querySelector('a');
      
      setUnderlineStyles({
        width: linkElement?.offsetWidth || itemRect.width,
        left: itemRect.left - parentLeft,
      });
    }
  };

  // Update underline on hover/selection change
  useEffect(() => {
    const activeIndex = hoverIndex !== -1 ? hoverIndex : selectedIndex;
    updateUnderline(activeIndex);
  }, [hoverIndex, selectedIndex]);

  // Update underline on window resize
  useEffect(() => {
    const handleResize = () => {
      const activeIndex = hoverIndex !== -1 ? hoverIndex : selectedIndex;
      updateUnderline(activeIndex);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hoverIndex, selectedIndex]);

  return (
    <ul className="relative flex justify-between bg-primary gap-8 p-4 rounded-md w-fit">
      {config.map((item, idx) => (
        <li
          key={idx}
          ref={(el) => (menuItemsRef.current[idx] = el)}
          onMouseEnter={() => setHoverIndex(idx)}
          onMouseLeave={() => setHoverIndex(-1)}
          className="hover relative"
        >
          <a
            href={item.href}
            onClick={() => setSelectedIndex(idx)}
            className={`text-center whitespace-nowrap ${
              item.className || "text-white"
            }`}
          >
            {item.title}
          </a>
        </li>
      ))}
      <hr
        className="absolute bottom-3 h-[0.178rem] bg-white transition-all duration-300"
        style={{
          width: `${underlineStyles.width}px`,
          left: `${underlineStyles.left}px`,
        }}
      />
    </ul>
  );
};

export default Menu;