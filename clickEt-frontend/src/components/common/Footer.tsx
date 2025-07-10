import { MapPin } from "lucide-react";
import * as React from "react";
const Footer = () => {
  const links = [
    "Copyright © 2025 Apple Inc. All rights reserved.",
    "Privacy Policy",
    "Terms of Use",
    "Sales and Refunds",
  ];

  return (
    <footer className="w-full bg-primary flex flex-col md:flex-row md:justify-between lg:px-16 md:px-5 text-neutral-100">
      <div className="flex flex-col md:flex-row items-center max-sm:gap-2.5 ">
        {links.map((text, index) => (
          <React.Fragment key={index}>
            <a  className="text-nowrap" href="#">{text}</a>
            {index < links.length - 1 && <span className="hidden md:block mx-2">|</span>}
          </React.Fragment>
        ))}
      </div>
      <span className="flex gap-3 items-center justify-center"><MapPin/>Kathmandu</span>
    </footer>
  );
};

export default Footer;
