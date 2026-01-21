// import { DELETE, GET, POST,POSTFILES, PUT } from "~/api/lib/client";
// import { baseUrl } from "../../url";
// import type { CustomResponse } from "~/interfaces/response";
// import type{  IProduct,IUpdateProduct } from "~/interfaces/products/product.interface";

// const ProductBaseURL = `${baseUrl}/products`;

// export const PRODUCT_API = {
//     GET_ALL_PRODUCTS: async (): Promise<CustomResponse<IProduct[]>> => {
//         try {
//             const response = await GET(`${ProductBaseURL}/getAllProducts`);
//             console.log(response)
//             return response;
            
//         } catch (err) {
//             throw(err);
//         }
//     },
//     GET_PRODUCT_BY_ID: async (id: number): Promise<CustomResponse<IProduct>> => {
//         try {
//             const response = await GET(`${ProductBaseURL}/getProductById/${id}`);
//             return response;
//         } catch (err) {
//             throw(err);
//         }
//     },
//     GET_PRODUCTS_BY_CATEGORY: async (category: string): Promise<CustomResponse<IProduct[]>> => {
//         try {
//             const response = await GET(`${ProductBaseURL}/getProductsByCategory/${category}`);
//             return response;
//         } catch (err) {
//             throw(err);
//         }
//     },
    
//     CREATE_PRODUCT: async (data: IProduct) => {
//   try {
//     const response = await POST(`${ProductBaseURL}/create`, {
//       ...data,
//       // Ensure productImage is either the object or null
//       productImage: data.productImage?.url ? data.productImage : null
//     });
//     return response;
//   } catch (err) {
//     console.error('Create product error:', err);
//     throw err; // Re-throw the error with proper formatting
//   }
// },
//     UPDATE_PRODUCT: async ( data: IProduct): Promise<CustomResponse<IProduct>> => {
//         try {
//             const response = await PUT(`${ProductBaseURL}/updateProduct/${data.id}`, data);
//             return response;
//         } catch (err) {
//             throw(err);
//         }
//     },
//     UPLOAD_IMAGE : async(formData : FormData) => {
//         try {
//             const response = await POSTFILES(`${ProductBaseURL}/uploadProductImage`,formData);
//             return response
//         } catch (error) {
//             throw error;
//         }
//     },
//     DELETE_PRODUCT: async (id: number): Promise<CustomResponse<IProduct>> => {
//         try {
//             const response = await DELETE(`${ProductBaseURL}/deleteProduct/${id}`);
//             return response;
//         } catch (err) {
//             throw(err);
//         }
//     }
// }

