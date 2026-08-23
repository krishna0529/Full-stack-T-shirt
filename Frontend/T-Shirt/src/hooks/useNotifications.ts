import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notificationService";

export function useNotifications(page = 0, size = 20) {
  return useQuery({
    queryKey: ["notifications", page, size],
    queryFn: () => notificationService.getNotifications(page, size),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ["notification-unread-count"],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000,
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread-count"] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-unread-count"] });
    },
  });
}
