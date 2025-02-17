import Link from "next/link";

export default function Footer({ username }: { username: string }) {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          (C) 2025. {username} all rights reserved.
        </div>
        <div className="mb-8 text-sm text-gray-500 dark:text-gray-400">
          <span className="mr-1">Built with</span>
          <Link
            className="font-semibold underline"
            href="https://typestone.io"
            target="_blank"
          >
            Typestone.io
          </Link>
        </div>
      </div>
    </footer>
  );
}
