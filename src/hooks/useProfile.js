import { useState, useEffect } from "react";
import { profileService } from "../services/teamService";

export function useProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!userId) return;
    profileService.getUserProfile(userId)
      .then(res => setProfile(res.data))
      .finally(() => setLoading(false));
  }, [userId]);
  return { profile, loading };
}
