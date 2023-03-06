import { CreateProduct } from "@ts-types/generated";
import Product from "@repositories/product";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { ROUTES } from "@utils/routes";

export const useCreateProductMutation = () => {
	const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(
    (input: CreateProduct) => Product.create(API_ENDPOINTS.PRODUCTS, input),
    {
      onSuccess: (res) => {
				if(res.data.status == 400) {
					toast.error(res.data.msg)
					// toast.error(t("common:successfully-updated"));
				}
				else {
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
