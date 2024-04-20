// import { http } from '@/utils/http'
// import type { IFooItem } from './foo.d'

// export { IFooItem }

// /** get 请求 */
// export const getFooAPI = (data: any) => {
//   return http<IFooItem>({
//     url: `https://restapi.amap.com/v3/geocode/regeo?key=ce15f988d6859314ea4748d9cc867e43&location=${data.location}`,
//     method: 'GET',
//     query: { name },
//   })
// }

// /** get 请求 */
// export const postFooAPI = (name: string) => {
//   return http<IFooItem>({
//     url: `/foo`,
//     method: 'POST',
//     query: { name }, // post 请求也支持 query
//     data: { name },
//   })
// }
