import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (): Promise<Song[]> => {
  const supabase = createServerComponentClient({
    cookies,
  });

  const session = await supabase.auth.getSession();
  if (session.error) {
    console.error(session.error.message);
    return [];
  }

  if (!session.data.session || !session.data.session.user.id) {
    console.error("something went wrong");
    return [];
  }

  const result = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", session.data.session?.user.id)
    .order("created_at", { ascending: false });

  if (result.error) {
    console.error(result.error.message);
  }

  return result.data || [];
};

export default getSongsByUserId;
