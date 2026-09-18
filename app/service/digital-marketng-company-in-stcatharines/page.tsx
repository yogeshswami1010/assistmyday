import { permanentRedirect } from "next/navigation";

export default function LegacyRedirect() {
  permanentRedirect("/services/performance-marketing");
}
