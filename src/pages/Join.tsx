import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export default function Join() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [status, setStatus] = useState("Joining team...");

  useEffect(() => {
    const joinTeam = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("Invalid invite link");
        return;
      }

      if (!user) {
        setStatus("Please log in first");
        return;
      }

      // 1. Find invitation
      const { data: invite, error } = await supabase
        .from("team_invitations")
        .select("*")
        .eq("token", token)
        .single();

      if (error || !invite) {
        setStatus("Invite not found or expired");
        return;
      }

      // 2. Add user to team
      const { error: joinError } = await supabase
        .from("team_members")
        .insert({
          team_id: invite.team_id,
          user_id: user.id,
          role: invite.role,
          status: "active"
        });

      if (joinError) {
        console.error(joinError);
        setStatus("Failed to join team");
        return;
      }

      // 3. Mark invite as accepted
      await supabase
        .from("team_invitations")
        .update({ status: "accepted" })
        .eq("id", invite.id);

      setStatus("Success! Redirecting...");

      setTimeout(() => {
        navigate("/team");
      }, 2000);
    };

    joinTeam();
  }, [user]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg">{status}</p>
    </div>
  );
}
