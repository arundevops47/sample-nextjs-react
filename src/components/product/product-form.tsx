import Input from "@components/ui/input";
import TextArea from "@components/ui/text-area";
import { useForm, FormProvider } from "react-hook-form";
import Button from "@components/ui/button";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import Label from "@components/ui/label";
import Radio from "@components/ui/radio/radio";
import { useRouter } from "next/router";
import { yupResolver } from "@hookform/resolvers/yup";
import FileInput from "@components/ui/file-input";
import { productValidationSchema } from "./product-validation-schema";
import groupBy from "lodash/groupBy";
import ProductVariableForm from "./product-variable-form";
import ProductSimpleForm from "./product-simple-form";
import ProductCategoryInput from "./product-category-input";
import orderBy from "lodash/orderBy";
import sum from "lodash/sum";
import cloneDeep from "lodash/cloneDeep";
import ProductTypeInput from "./product-type-input";
import ProductGroupInput from "./product-group-input";
import {
  Group,
  ProductType,
  Category,
  AttachmentInput,
  ProductStatus,
  Product,
  VariationOption,
  Tag,
} from "@ts-types/generated";
import { useCreateProductMutation } from "@data/product/product-create.mutation";
import { useTranslation } from "next-i18next";
import { useUpdateProductMutation } from "@data/product/product-update.mutation";
import { useStoreQuery } from "@data/store/use-store.query";
import ProductTagInput from "./product-tag-input";
import Alert from "@components/ui/alert";
import { useState } from "react";
import { animateScroll } from "react-scroll";

type Variation = {
  formName: number;
};

type FormValues = {
  sku: string;
  name: string;
  group: Group;
  description: string;
  unit: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  salePrice: number;
  quantity: number;
  inStock: boolean;
  isTaxable: boolean;
  image: AttachmentInput;
  status: ProductStatus;
  width: string;
  height: string;
  length: string;
  productType: ProductType;
  tags: Tag[];
  categories: Category[];
  gallery: AttachmentInput[];
  isVariation: boolean;
  variations: Variation[];
  variationOptions: Product["variationOptions"];
  [key: string]: any;
};

const defaultValues = {
  sku: "",
  name: "",
  group: "",
  productTypeValue: { name: "Simple Product", value: ProductType.Simple },
  description: "",
  unit: "",
  price: "",
  minPrice: 0.0,
  maxPrice: 0.0,
  salePrice: "",
  quantity: "",
  categories: [],
  tags: [],
  inStock: true,
  isTaxable: false,
  image: [],
  gallery: [],
  status: ProductStatus.Publish,
  width: "",
  height: "",
  length: "",
  isVariation: false,
  variations: [],
  variationOptions: [],
};

type IProps = {
  initialValues?: Product | null;
};

const productType = [
  { name: "Simple Product", value: ProductType.Simple },
  { name: "Variable Product", value: ProductType.Variable },
];

function getFormattedVariations(variations: any) {
  const variationGroup = groupBy(variations, "attribute.slug");
  return Object.values(variationGroup)?.map((vg) => {
    return {
      attribute: vg?.[0]?.attribute,
      value: vg?.map((v) => ({ id: v.id, value: v.value })),
    };
  });
}

function processOptions(options: any) {
  try {
    return JSON.parse(options);
  } catch (error) {
    return options;
  }
}

function calculateMaxMinPrice(variationOptions: any) {
  if (!variationOptions || !variationOptions.length) {
    return {
      minPrice: null,
      maxPrice: null,
    };
  }
  const sortedVariationsByPrice = orderBy(variationOptions, ["price"]);
  const sortedVariationsBySalePrice = orderBy(variationOptions, ["salePrice"]);
  return { 
    minPrice:
      sortedVariationsBySalePrice?.[0].salePrice <
      sortedVariationsByPrice?.[0]?.price
        ? Number(sortedVariationsBySalePrice?.[0].salePrice)
        : Number(sortedVariationsByPrice?.[0]?.price),
    maxPrice: Number(
      sortedVariationsByPrice?.[sortedVariationsByPrice?.length - 1]?.price
    ),
  };
}

function calculateQuantity(variationOptions: any) {
  return sum(
    variationOptions?.map(({ quantity }: { quantity: number }) => quantity)
  );
}

export default function CreateOrUpdateProductForm({ initialValues }: IProps) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { t } = useTranslation();

  const { data: storeData } = useStoreQuery(router.query.store as string, {
    enabled: !!router.query.store,
  });

  const storeId = storeData?.store?.id!;

  const methods = useForm<FormValues>({
    resolver: yupResolver(productValidationSchema),
    shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? cloneDeep({
          ...initialValues,
          isVariation:
            initialValues.variations?.length &&
            initialValues.variationOptions?.length
              ? true
              : false,
					productTypeValue: productType[0],
          variations: getFormattedVariations(initialValues?.variations),
        })
      : defaultValues,
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = methods;

  const { mutate: createProduct, isLoading: creating } =
    useCreateProductMutation();
  const { mutate: updateProduct, isLoading: updating } =
    useUpdateProductMutation();

  const onSubmit = async (values: FormValues) => {
		console.log('onSubmit ', values);

    const { group } = values;
    const inputValues: any = {
      description: values.description,
      height: values.height,
      length: values.length,
      name: values.name,
      sku: values.sku,
      status: values.status,
      unit: values.unit,
      width: values.width,
      quantity:
        values?.productTypeValue?.value === ProductType.Simple
          ? values?.quantity
          : calculateQuantity(values?.variationOptions),
      // productType: values.productTypeValue?.value,
			productType: 'simple',
      groupId: group?.id,
      ...(initialValues
        ? { storeId: initialValues?.storeId }
        : { storeId: Number(storeId) }),
      price: Number(values.price),
      salePrice: values.salePrice ? Number(values.salePrice) : null,
      categories: values?.categories?.map(({ id }: any) => id),
      tags: values?.tags?.map(({ id }: any) => id),
      image: {
        thumbnail: values?.image?.thumbnail,
        url: values?.image?.url,
        id: values?.image?.id,
      },
      gallery: values.gallery?.map(({ thumbnail, url, id }: any) => ({
        thumbnail,
        url,
        id,
      })),
      ...(productTypeValue?.value === ProductType.Variable && {
        variations: values?.variations?.flatMap(({ value }: any) =>
          value?.map(({ id }: any) => ({ attributeValueId: id }))
        ),
      }),
      ...(productTypeValue?.value === ProductType.Variable
        ? {
            variationOptions: {
              upsert: values?.variationOptions?.map(
                ({ options, ...rest }: any) => ({
                  ...rest,
                  options: processOptions(options).map(
                    ({ name, value }: VariationOption) => ({
                      name,
                      value,
                    })
                  ),
                })
              ),
              delete: initialValues?.variationOptions
                ?.map((initialVariationOption) => {
                  const find = values?.variationOptions?.find(
                    (variationOption) =>
                      variationOption?.id === initialVariationOption?.id
                  );
                  if (!find) {
                    return initialVariationOption?.id;
                  }
                })
                .filter((item) => item !== undefined),
            },
          }
        : {
            variations: [],
            variationOptions: {
              upsert: [],
              delete: initialValues?.variationOptions?.map(
                (variation) => variation?.id
              ),
            },
          }),
      ...calculateMaxMinPrice(values?.variationOptions),
    };

    if (initialValues) {
      updateProduct(
        {
          variables: {
            id: initialValues.id,
            input: inputValues,
          },
        },
        {
          onError: (error: any) => {
            Object.keys(error?.response?.data).forEach((field: any) => {
              setError(field, {
                type: "manual",
                message: error?.response?.data[field][0],
              });
            });
          },
        }
      );
    } else {
      createProduct(
        {
          ...inputValues,
        },
        {
          onError: (error: any) => {
            if (error?.response?.data?.message) {
              setErrorMessage(error?.response?.data?.message);
              animateScroll.scrollToTop();
            } else {
              Object.keys(error?.response?.data).forEach((field: any) => {
                setError(field, {
                  type: "manual",
                  message: error?.response?.data[field][0],
                });
              });
            }
          },
        }
      );
    }
  };

  const productTypeValue = watch("productTypeValue");

  return (
    <>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null }
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:featured-image-title")}
              details={t("form:featured-image-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="image" control={control} multiple={false} type="image"/>
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:gallery-title")}
              details={t("form:gallery-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <FileInput name="gallery" control={control} type="image"/>
            </Card>
          </div>

          <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
            <Description
              title={t("form:type-and-category")}
              details={t("form:type-and-category-help-text")}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <ProductGroupInput
                control={control}
                error={t((errors?.group as any)?.message)}
              />
              <ProductCategoryInput control={control} setValue={setValue} />
              <ProductTagInput control={control} setValue={setValue} />
            </Card>
          </div>

          <div className="flex flex-wrap my-5 sm:my-8">
            <Description
              title={t("form:item-description")}
              details={`${
                initialValues
                  ? t("form:item-description-edit")
                  : t("form:item-description-add")
              } ${t("form:product-description-help-text")}`}
              className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <Input
                label={`${t("form:input-label-name")}*`}
                {...register("name")}
                error={t(errors.name?.message!)}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={`${t("form:input-label-unit")}*`}
                {...register("unit")}
                error={t(errors.unit?.message!)}
                variant="outline"
                className="mb-5"
              />

              <TextArea
                label={t("form:input-label-description")}
                {...register("description")}
                error={t(errors.description?.message!)}
                variant="outline"
                className="mb-5"
              />

              <div>
                <Label>{t("form:input-label-status")}</Label>
                <Radio
                  {...register("status")}
                  label={t("form:input-label-published")}
                  id="published"
                  value="publish"
                  className="mb-2"
                />
                <Radio
                  {...register("status")}
                  id="draft"
                  label={t("form:input-label-draft")}
                  value="draft"
                />
              </div>
            </Card>
          </div>

					<Input {...register(`productTypeValue`)} type="hidden"/>

					<ProductSimpleForm initialValues={initialValues} />
          {/* Variation Group */}
          {productTypeValue?.value === ProductType.Variable && (
            <ProductVariableForm
              storeId={storeId}
              initialValues={initialValues}
            />
          )}

          <div className="mb-4 text-end">
            {initialValues && (
              <Button
                variant="outline"
                onClick={router.back}
                className="me-4"
                type="button"
              >
                {t("form:button-label-back")}
              </Button>
            )}
            <Button loading={updating || creating}>
              {initialValues
                ? t("form:button-label-update-product")
                : t("form:button-label-add-product")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
