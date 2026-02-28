import { create } from "zustand";

type Permission = NotificationPermission | "unsupported";

type INotificationStatus = {
  supported?: boolean;
  permission: Permission;
  subscribed: boolean;
  loading: boolean;
  setStatus: (permission: Permission) => void;
  setSubscribed: (subscribed: boolean) => void;
  setIsLoading: (loading: boolean) => void;
};

export const useNotificationStatus = create<INotificationStatus>((set) => ({
  subscribed: false,
  loading: true,
  permission: "unsupported",
  setStatus: (permission: Permission) =>
    set({ supported: permission !== "unsupported", permission }),
  setSubscribed: (subscribed) => set({ subscribed }),
  setIsLoading: (loading) => set({ loading }),
}));
