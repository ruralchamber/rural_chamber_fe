// import { DELETE, GET, POST, PUT } from "~/api/lib/client";
// import { baseUrl } from "../../url";
// import type { CustomResponse } from "~/interfaces/response";
// import type {  IOrderSummary, IOrderAdminResponse, OrderStatus, IOrderExpandedDetails } from "~/interfaces/orders/order.interface";

// const OrderBaseURL = `${baseUrl}/orders`;

// export const ORDERS_API = {
//     CREATE_ORDER: async (orderData: any): Promise<CustomResponse<any>> => {
//         try {
//             const response = await POST(`${OrderBaseURL}/create`, orderData);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
//     GET_USER_ORDERS: async (id:any)  => {
//         try {
//             const response = await GET(`${OrderBaseURL}/getUserOrders/${id}`);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
//     GET_ORDER_BY_ID: async (orderId: number): Promise<CustomResponse<IOrderSummary>> => {
//         try {
//             const response = await GET(`${OrderBaseURL}/${orderId}`);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },

//         GET_ORDER_BY_REFERENCE: async (reference: string): Promise<CustomResponse<IOrderSummary>> => {
//         try {
//             const response = await GET(`${OrderBaseURL}/findOderByReference${reference}`);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
//     UPDATE_ORDER: async (orderId: number, updateData: Partial<IOrderSummary>): Promise<CustomResponse<IOrderSummary>> => {
//         try {
//             const response = await PUT(`${OrderBaseURL}/updateOrder/${orderId}`, updateData);
//             return response;
//         } catch (error) {
//             throw error;
//     }
//     },
//     DELETE_ORDER: async (orderId: number): Promise<CustomResponse<null>> => {
//         try {
//             const response = await DELETE(`${OrderBaseURL}/deleteOrder/${orderId}`);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
//     GET_ALL_ORDERS: async (): Promise<CustomResponse<IOrderSummary[]>> => {
//         try {            
//             const response = await GET(`${OrderBaseURL}/getAllOrders`);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
//     GET_ORDERS_BY_STATUS: async (status: OrderStatus): Promise<CustomResponse<IOrderSummary[]>> => {
//         try {            
//             const response = await GET(`${OrderBaseURL}/getOrdersByStatus/${status}`);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
//     GET_ORDERS_BY_CUSTOMER_NAME: async (fullName: string): Promise<CustomResponse<IOrderSummary[]>> => {
//         try {
//             const response = await GET(`${OrderBaseURL}/getOrdersByCustomerName/${fullName}`);
//             return response;
//         } catch (error) {
//             throw error;
//         }
//     },
// };