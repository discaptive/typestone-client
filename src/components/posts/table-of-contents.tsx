"use client";

import { Utils } from "@/lib/utils";
import { Button } from "@headlessui/react";
import Link from "next/link";
import { useState } from "react";

export default function TableOfContents({ body }: { body: string }) {
  const [isOpen, setIsOpen] = useState(true);

  const toc = Utils.extractTOC(body);

  return (
    <div>
      <Button
        className="group"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <span className="ml-6 pb-2 pt-2 text-xl font-bold text-gray-700 dark:text-gray-300 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-0.5"
          >
            <path d={isOpen ? "M12 5L12 19" : "M5 12h14"} />
            <path d={isOpen ? "M19 12L12 19L5 12" : "m12 5 7 7-7 7"} />
          </svg>
          Table of Contents
        </span>
      </Button>

      <div className={`ml-6 ${isOpen ? "" : "hidden"}`}>
        <ul>
          {toc.map((item) => {
            return (
              <li
                key={item.href}
                className={item.level === 3 ? "ml-4" : undefined}
              >
                <Link href={item.href}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
