// app/ethiopian-cup/page.tsx
// Redirect page for backward compatibility

import { redirect } from "next/navigation";

export default function EthiopianCupRedirectPage() {
  redirect("/cups/ethiopian-cup");
}
