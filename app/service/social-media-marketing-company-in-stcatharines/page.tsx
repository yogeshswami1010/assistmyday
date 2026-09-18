import { permanentRedirect } from "next/navigation";

export default function LegacyRedirect() {
  permanentRedirect("/services/brand-content-social");
}
