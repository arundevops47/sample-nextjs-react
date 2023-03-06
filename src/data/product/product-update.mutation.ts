import { UpdateProduct } from "@ts-types/generated";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import Product from "@repositories/product";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { ROUTES } from "@utils/routes";

export interface IProductUpdateVariables {
  variables: { id: string; input: UpdateProduct };
}

export const useUpdateProductMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
	const router = useRouter();

  return useMutation(
    ({ variables: { id, input } }: IProductUpdateVariables) =>
      Product.update(`${API_ENDPOINTS.PRODUCTS}/${id}`, input),
    {
      onSuccess: (res) => {
				if(res.data.status == 400) {
					toast.error(res.data.msg)
					// toast.error(t("common:successfully-updated"));
				}
				else {
					// toast.success(t("common:successfully-updated"));
					router.push(`/${router?.query?.store}${ROUTES.PRODUCTS}`);
				}				
      },
      // Always refetch after error or success:
      onSettled: () => {
        queryClient.invalidateQueries(API_ENDPOINTS.PRODUCTS);
      },
    }
  );
};
