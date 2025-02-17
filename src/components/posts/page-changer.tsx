import { Button } from "@headlessui/react";
import Link from "next/link";

export default function PageChanger({
  current,
  last,
}: {
  current: number;
  last: number;
}) {
  return (
    <nav className="flex items-center justify-between py-8">
      <Button
        className="group flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 disabled:text-gray-400"
        disabled={current <= 1}
      >
        <Link
          href={`/page/${current - 1}`}
          className={current <= 1 ? "pointer-events-none" : undefined}
          prefetch
        >
          <span className="flex items-center">
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
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Previous
          </span>
        </Link>
      </Button>

      <span className="text-sm text-gray-500 dark:text-gray-300">
        Page {current} of {last}
      </span>

      <Button
        className="group flex items-center text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 disabled:text-gray-400"
        disabled={current >= last}
      >
        <Link
          href={`/page/${current + 1}`}
          className={current >= last ? "pointer-events-none" : undefined}
          prefetch
        >
          <span className="flex items-center">
            Next
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
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            >
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </span>
        </Link>
      </Button>
    </nav>
  );
}
