"use server";

import fs from "fs";
import IndexWhole from "@/components/index/index-whole";

export default async function Index() {
  const readme = fs.readFileSync("README.md", "utf8");
  const readmeKo = fs.readFileSync("README-ko.md", "utf8");

  return (
    <div>
      <IndexWhole readme={readme} readmeKo={readmeKo} />
    </div>
  );
}
