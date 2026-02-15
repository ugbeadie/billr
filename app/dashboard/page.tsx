import { auth } from "@/lib/auth";
import { signOut } from "@/server/actions";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <p>Welcome, {session?.user.name}!</p>

      <form action={signOut}>
        <button>logout</button>
      </form>
    </div>
  );
}
