import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "../services/wishlistService";
import { useWishlistStore } from "../store/wishlistStore";
import { useAuthStore } from "../store/authStore";

export function useWishlist() {
  const { isAuthenticated } = useAuthStore();
  const localWishlist = useWishlistStore((state) => state.items);

  const query = useQuery({
    queryKey: ["user-wishlist"],
    queryFn: wishlistService.getWishlist,
    enabled: isAuthenticated,
    staleTime: 60000,
  });

  return {
    items: isAuthenticated ? query.data?.items || [] : localWishlist,
    count: isAuthenticated ? query.data?.count || 0 : localWishlist.length,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { toggleWishlist: toggleLocal } = useWishlistStore();

  return useMutation({
    mutationFn: async ({ productId, isWishlisted, product }: { productId: number; isWishlisted: boolean; product: any }) => {
      if (!isAuthenticated) {
        toggleLocal(product);
        return;
      }
      if (isWishlisted) {
        return await wishlistService.removeFromWishlist(productId);
      } else {
        return await wishlistService.addToWishlist(productId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-wishlist"] });
    },
  });
}
