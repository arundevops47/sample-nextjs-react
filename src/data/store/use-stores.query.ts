import { QueryParamsType, StoresQueryOptionsType } from "@ts-types/custom.types";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Store from "@repositories/store";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { StorePaginator } from "@ts-types/generated";

const fetchStores = async ({
  queryKey,
}: QueryParamsType): Promise<{ stores: StorePaginator }> => {
  const [_key, params] = queryKey;

  const {
    page,
    text,
    limit = 15,
    orderBy = "updatedAt",
    sortedBy = "DESC",
  } = params as StoresQueryOptionsType;

  const searchString = stringifySearchQuery({
    name: text,
  });

  const url = `${API_ENDPOINTS.STORES}?search=${searchString}&searchJoin=and&limit=${limit}&page=${page}&orderBy=${orderBy}&sortedBy=${sortedBy}`;

  const {
    data: { data, ...rest },
  } = await Store.all(url);
	
  return {
    stores: {
      data,
      paginatorInfo: mapPaginatorData({ ...rest }),
    },
  };

};

const useStoresQuery = (options: StoresQueryOptionsType) => {
  return useQuery<{ stores: StorePaginator }, Error>(
    [API_ENDPOINTS.STORES, options],
    fetchStores,
    {
      keepPreviousData: true,
    }
  );
};

export { useStoresQuery, fetchStores };
