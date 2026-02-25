import { useEffect, useState } from "react";
import { useAppUser } from "../context/AppUserContext";
import { getMyProfile } from "./auth";

export function useAuth() {
  const { user, setUser } = useAppUser();
  const [loading, setLoading] = useState(true);

  //const navigate = useNavigate();
  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile = await getMyProfile();

        if (profile) {
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return { user, loading };
}
