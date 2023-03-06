import Button from "@components/ui/button";
import Input from "@components/ui/input";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import Description from "@components/ui/description";
import Card from "@components/common/card";
import FileInput from "@components/ui/file-input";
import TextArea from "@components/ui/text-area";
import { storeValidationSchema } from "./store-validation-schema";
import { getFormattedImage } from "@utils/get-formatted-image";
import { useCreateStoreMutation } from "@data/store/use-store-create.mutation";
import { useUpdateStoreMutation } from "@data/store/use-store-update.mutation";
import { useStoreCategoriesQuery } from "@data/store/use-store-category.query";

import {
  BalanceInput,
  StoreSettings,
  StoreSocialInput,
  UserAddressInput,
	AttachmentInput
} from "@ts-types/generated";
import GooglePlacesAutocomplete from "@components/form/google-places-autocomplete";
import Label from "@components/ui/label";
import { getIcon } from "@utils/get-icon";
import SelectInput from "@components/ui/select-input";
import * as icons from "@components/icons";
import omit from "lodash/omit";

const socialIcon = [
  {
		platform: 'facebook',
    value: "FacebookIcon",
    label: "Facebook",
  },
  {
		platform: 'instagram',
    value: "InstagramIcon",
    label: "Instagram",
  },
  {
		platform: 'twitter',
    label: "Twitter",
    value: "TwitterIcon",
  },
  {
		platform: 'youtube',
    label: "Youtube",
    value: "YouTubeIcon",
  },
];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex space-s-4 items-center text-body">
      <span className="flex w-4 h-4 items-center justify-center">
        {getIcon({
          iconList: icons,
          iconName: item.value,
          className: "w-4 h-4",
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
	storeCategory: any;
  logo: AttachmentInput;
  coverImage: AttachmentInput;
  name: string;
  description: string;
	tags: string;
  address: UserAddressInput;
  settings: StoreSettings;
	socials: StoreSocialInput[];
  balance: BalanceInput;
};

const StoreForm = ({ initialValues }: { initialValues?: any }) => {
  const { mutate: createStore, isLoading: creating } = useCreateStoreMutation();
  const { mutate: updateStore, isLoading: updating } = useUpdateStoreMutation();
  const { data: storeCategories, isLoading: storeCategoriesLoading } = useStoreCategoriesQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    control,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues
      ? {
          defaultValues: {
            ...initialValues,
            logo: getFormattedImage(initialValues?.logo),
            coverImage: getFormattedImage(initialValues?.coverImage),
            storeCategoryId: {
              ...initialValues?.storeCategoryId,
            },							
            address: {
              ...initialValues?.address,
            },						
            settings: {
              ...initialValues?.settings,
            },
						socials: initialValues?.socials
						? initialValues?.socials.map((social: any) => ({
								icon: updatedIcons?.find(
									(icon) => icon?.value === social?.icon
								),
								url: social?.url,
								platform: social?.icon?.platform,
							}))
						: [],						
          },
        }
      : {}),
    resolver: yupResolver(storeValidationSchema),
  });
	
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({ 
		control, 
		name: "socials" 
	});

  function onSubmit(values: FormValues) {
    const address = { ...values?.address };		
		const settings = { ...values?.settings };		

    const socials = values?.socials
										? values?.socials?.map((social: any) => ({
												icon: social?.icon?.value,
												url: social?.url,
												platform: social?.icon?.platform,
											}))
										: [];
										
    if (initialValues) {
      updateStore({
        variables: {
          id: initialValues.id,
          input: {
            ...values,
						address: address,
            settings,
						socials,
            balance: {
              id: initialValues.balance?.id,
              ...values.balance,
            },
          },
        },
      });
    } else {
      createStore({
        variables: {
          input: {
            ...values,
            settings,
            address: address,
						socials,
            balance: {
              ...values.balance,
            },
          },
        },
      });
    }
  }

  const coverImageInformation = (
    <span>
      {t("form:store-cover-image-help-text")} <br />
      {t("form:cover-image-dimension-help-text")} &nbsp;
      <span className="font-bold">1170 x 435{t("common:text-px")}</span>
    </span>
  );

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:input-label-logo")}
            details={t("form:store-logo-help-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="logo" control={control} multiple={false} type="image"/>
          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:store-cover-image-title")}
            details={coverImageInformation}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="coverImage" control={control} multiple={false} type="image"/>
          </Card>
        </div>
				
        <div className="flex flex-wrap pb-8 border-b border-dashed border-border-base my-5 sm:my-8">
          <Description
            title={t("form:store-basic-info")}
            details={t("form:store-basic-info-help-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-name")}
              {...register("name")}
              variant="outline"
              className="mb-5"
              error={t(errors.name?.message!)}
            />
            <TextArea
              label={t("form:input-label-description")}
              {...register("description")}
              variant="outline"
							className="mb-5"
              error={t(errors.description?.message!)}
            />

						<Label>{t("form:input-label-store-category")}</Label>
						<SelectInput
							name="storeCategory"
							control={control}
							getOptionLabel={(option: any) => option.name}
							getOptionValue={(option: any) => option.id}
							options={storeCategories?.data!}
							isLoading={storeCategoriesLoading}
						/>			

          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title={t("form:store-address")}
            details={t("form:store-address-helper-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
						<TextArea
              label={t("form:input-label-street-address")}
              {...register("address.address")}
              variant="outline"
              error={t(errors.address?.address?.message!)}
            />						
						<Input
              label={t("form:input-label-city")}
              {...register("address.city")}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.city?.message!)}
            />	
            <Input
              label={t("form:input-label-state")}
              {...register("address.state")}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.state?.message!)}
            />											
            <Input
              label={t("form:input-label-country")}
              {...register("address.country")}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.country?.message!)}
            />
            <Input
              label={t("form:input-label-zip")}
              {...register("address.zip")}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.zip?.message!)}
            />
          </Card>
        </div>

        <div className="flex flex-wrap pb-8 border-b border-dashed border-gray-300 my-5 sm:my-8">
          <Description
            title={t("form:store-settings")}
            details={t("form:store-settings-helper-text")}
            className="w-full px-0 sm:pe-4 md:pe-5 pb-5 sm:w-4/12 md:w-1/3 sm:py-8"
          />
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t("form:input-label-contact")}
              {...register("settings.contact")}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.contact?.message!)}
            />
            <Input
              label={t("form:input-label-website")}
              {...register("settings.website")}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.website?.message!)}
            />						
            <Input
              label={t("form:input-label-support-email")}
              {...register("settings.supportEmail")}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.supportEmail?.message!)}
            />			
            <Input
              label={t("form:input-label-support-phone")}
              {...register("settings.supportPhone")}
              variant="outline"
              className="mb-5"
              error={t(errors.settings?.supportPhone?.message!)}
            />											
            <div>
              {fields.map(
                (item: StoreSocialInput & { id: string }, index: number) => (
                  <div
                    className="border-b border-dashed border-border-200 first:border-t last:border-b-0 first:mt-5 md:first:mt-10 py-5 md:py-8"
                    key={item.id}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-5">
                      <div className="sm:col-span-2">
                        <Label>{t("form:input-label-select-platform")}</Label>
                        <SelectInput
                          name={`socials.${index}.icon` as const}
                          control={control}
                          options={updatedIcons}
                          isClearable={true}
                          defaultValue={item?.icon!}
                        />
                      </div>
                      <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-social-url")}
                        variant="outline"
                        {...register(`socials.${index}.url` as const)}
                        defaultValue={item.url!} // make sure to set up defaultValue
                      />
                      <button
                        onClick={() => {
                          remove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none sm:mt-4 sm:col-span-1"
                      >
                        {t("form:button-label-remove")}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
            <Button
              type="button"
              onClick={() => append({ icon: "", url: "" })}
              className="w-full sm:w-auto"
            >
              {t("form:button-label-add-social")}
            </Button>
          </Card>
        </div>

        <div className="mb-5 text-end">
          <Button
            loading={creating || updating}
            disabled={creating || updating}
          >
            {initialValues
              ? t("form:button-label-update")
              : t("form:button-label-save")}
          </Button>
        </div>
      </form>
    </>
  );
};

export default StoreForm;
