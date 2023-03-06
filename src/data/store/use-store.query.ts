import Store from "@repositories/store";
import { QueryKey, useQuery, UseQueryOptions } from "react-query";
import { Store as TStore } from "@ts-types/generated";
import { API_ENDPOINTS } from "@utils/api/endpoints";

export const fetchStore = async (slug: string) => {
  const { data } = await Store.find(`${API_ENDPOINTS.STORES}/${slug}`);
  return { store: data };
};

type IProps = {
  store: TStore;
};

export const useStoreQuery = (
  slug: string,
  options?: UseQueryOptions<IProps, Error, IProps, QueryKey>
) => {
  return useQuery<IProps, Error>(
    [API_ENDPOINTS.STORES, slug],
    () => fetchStore(slug),
    options
  );
};
