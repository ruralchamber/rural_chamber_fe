// import { DELETE, GET, POST, PUT } from "~/api/lib/client";
// import { baseUrl } from "../../url";
// import type { CustomResponse } from "~/interfaces/response";
// import type { IProduct } from "~/interfaces/products/product.interface";

// export interface ICartItemBase {
//   id: number;
//   productId: number;
//   quantity: number;
//   cartId: number;
//   price?: number;
//   name?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
//   productImage?: string; // Simplified for consistency
// }

// export interface ICartItemWithProduct extends ICartItemBase {
//   product: IProduct;
// }

// export interface ICart {
//   id: number;
//   userId: number;
//   createdAt?: Date;
//   updatedAt?: Date;
//   items?: ICartItemWithProduct[]; // Changed from cartItems to items for consistency
// }

// export interface ICartWithItems extends ICart {
//   items: ICartItemWithProduct[];
//   totals: {
//     subtotal: number;
//     shipping?: number;
//     total: number;
//   };
// }

// // Guest cart item for frontend
// export interface IGuestCartItem {
//   id: number;
//   productId: number;
//   productImage: string;
//   name: string;
//   price: number;
//   quantity: number;
//   subtotal: number;
//   cartId: number;
// }
// const CartBaseURL = `${baseUrl}/cart`;

// // Helper function to get userId from localStorage
// const getUserIdFromStorage = (): number => {
//   const userId = localStorage.getItem("userId");
//   if (!userId) {
//     throw new Error("User not authenticated - no userId found in localStorage");
//   }

//   const parsedUserId = parseInt(userId);
//   if (isNaN(parsedUserId)) {
//     throw new Error("Invalid userId in localStorage");
//   }

//   console.log('📱 Using userId from localStorage:', parsedUserId);
//   return parsedUserId;
// };

// export const CART_API = {
//     // GET /api/cart/:userId/getCartWithItems
//     GET_CART: async (): Promise<CustomResponse<ICartWithItems>> => {
//         try {
//             const userId = getUserIdFromStorage();
//             console.log('🛒 Getting cart for userId:', userId);

//             const response = await GET(`${CartBaseURL}/${userId}/getCartWithItems`);
//             console.log('✅ Cart retrieved successfully');
//             return response;
//         } catch (err) {
//             console.error('❌ Error getting cart:', err);
//             throw(err);
//         }
//     },

//     // POST /api/cart/:userId/items
//     ADD_ITEM: async (data: {
//         productId: number;
//         quantity: number;
//     }): Promise<CustomResponse<ICartItemBase>> => {
//         try {
//             const userId = getUserIdFromStorage();
//             console.log('➕ Adding item to cart:', { userId, ...data });

//             const response = await POST(`${CartBaseURL}/${userId}/items`, data);
//             console.log('✅ Item added to cart successfully');
//             return response;
//         } catch (err) {
//             console.error('❌ Error adding item to cart:', err);
//             throw(err);
//         }
//     },

//     // PUT /api/cart/:userId/items/:id
//     UPDATE_ITEM: async (itemId: number, updateData: {
//         quantity: number
//     }): Promise<CustomResponse<ICartItemBase>> => {
//         try {
//             const userId = getUserIdFromStorage();
//             console.log('🔄 Updating cart item:', { userId, itemId, ...updateData });

//             const response = await PUT(`${CartBaseURL}/${userId}/items/${itemId}`, updateData);
//             console.log('✅ Cart item updated successfully');
//             return response;
//         } catch (err) {
//             console.error('❌ Error updating cart item:', err);
//             throw(err);
//         }
//     },

//     // DELETE /api/cart/:userId/items/:id
//     DELETE_ITEM: async (itemId: number): Promise<CustomResponse<null>> => {
//         try {
//             const userId = getUserIdFromStorage();
//             console.log('🗑️ Deleting cart item:', { userId, itemId });

//             const response = await DELETE(`${CartBaseURL}/${userId}/items/${itemId}`);
//             console.log('✅ Cart item deleted successfully');
//             return response;
//         } catch (err) {
//             console.error('❌ Error deleting cart item:', err);
//             throw(err);
//         }
//     },

//     // DELETE /api/cart/:userId/clear
//     CLEAR_CART: async (): Promise<CustomResponse<null>> => {
//         try {
//             const userId = getUserIdFromStorage();
//             console.log('🧹 Clearing cart for userId:', userId);

//             const response = await DELETE(`${CartBaseURL}/${userId}/clear`);
//             console.log('✅ Cart cleared successfully');
//             return response;
//         } catch (err) {
//             console.error('❌ Error clearing cart:', err);
//             throw(err);
//         }
//     },

// };
