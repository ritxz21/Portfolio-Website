import { Suspense } from "react";
import type { Metadata } from "next";
import { Chat } from "@/components/Chat";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ask",
  description: `Ask questions about ${site.name}'s background, projects and experience.`,
};

export default function AskPage() {
  // useSearchParams needs a Suspense boundary in the App Router.
  return (
    <Suspense>
      <Chat />
    </Suspense>
  );
}
