import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { redirect } from "next/navigation";

const Page = async () => {
  const { getUser } = getKindeServerSession();
  const user: KindeUser | null = await getUser();

  if (!user) {
    redirect("/auth-callback?origin=dashboard");
  }

  return <div>{user?.email}</div>;
};

export default Page;
