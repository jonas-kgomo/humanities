import { permanentRedirect } from "next/navigation";

/** Research outlines now live inside Teaching as module popups. */
export default function ResearchRedirectPage() {
  permanentRedirect("/teaching");
}
