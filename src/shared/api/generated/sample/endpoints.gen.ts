import { baseApi as api } from "../../baseApi";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTemplateSampleItems: build.query<
      GetTemplateSampleItemsApiResponse,
      GetTemplateSampleItemsApiArg
    >({
      query: (queryArg) => ({
        url: `/api/template-sample/items`,
        params: {
          search: queryArg.search,
        },
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as api };
export type GetTemplateSampleItemsApiResponse =
  /** status 200 Sample items */ TemplateSampleItem[];
export type GetTemplateSampleItemsApiArg = {
  search?: string;
};
export type TemplateSampleItem = {
  id: string;
  name: string;
  status: "active" | "archived";
  createdAt: string;
};
export const { useGetTemplateSampleItemsQuery } = injectedRtkApi;
