import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { User } from "../types/userTypes";

interface UserState {
  user: User | null;
  setUser: (userInfo: User | null) => void;
  removeUser: () => void;
}

const userStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (userInfo) => set({ user: userInfo }),
      removeUser: () => set({ user: null }),
    }),
    {
      name: "user",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default userStore;
