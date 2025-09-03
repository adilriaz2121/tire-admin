"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const CompanyCard = () => {
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/Logo.png");

  useEffect(() => {
    setLogoSrc(theme !== "dark" ? "/Logo.png" : "/logo_white.png");
  }, [theme]);

  return (
    <div className="w-full min-w-40 lg:px-8">
      <div className="cursor-pointer">
        <div className="flex items-center gap-2">
          <Image
            src={logoSrc}
            alt="Company Logo"
            width={100}
            height={100}
            className="w-[150px] h-auto bg-blend-multiply"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
