import Alert from "@components/ui/alert";
import Button from "@components/ui/button";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "@components/ui/link";
import { Permission } from "@ts-types/generated";
import { useRegisterMutation } from "@data/user/use-register.mutation";

type FormValues = {
  firstName: string;
	lastName: string;
  email: string;
  password: string;
  permission: Permission;
};

const registrationFormSchema = yup.object().shape({
  firstName: yup.string().required("form:error-first-name-required"),
	lastName: yup.string().required("form:error-last-name-required"),
  email: yup
    .string()
    .email("form:error-email-format")
    .required("form:error-email-required"),
  password: yup.string().required("form:error-password-required"),
  permission: yup.string().default("store_owner").oneOf(["store_owner"]),
});

const RegistrationForm = () => {
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(registrationFormSchema),
    defaultValues: {
      permission: Permission.StoreOwner,
    },
  });

  const { t } = useTranslation();
  const router = useRouter();

  async function onSubmit({ firstName, lastName, email, password, permission }: FormValues) {
    registerUser(
      {
        variables: {
          firstName,
					lastName,
          email,
          password,
          permission,
        },
      },
      {
        onSuccess: ({ data }) => {
					if(data.status == 200) {
						setSuccessMessage(data.msg);
						router.push(ROUTES.LOGIN);
					}
					else {
						setErrorMessage(data.msg);
					}
        },
        onError: (error: any) => {
          Object.keys(error?.response?.data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: error?.response?.data[field],
            });
          });
        },
      }
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={t("form:input-label-first-name")}
          {...register("firstName")}
          variant="outline"
          className="mb-4"
          error={t(errors?.firstName?.message!)}
        />
       <Input
          label={t("form:input-label-last-name")}
          {...register("lastName")}
          variant="outline"
          className="mb-4"
          error={t(errors?.lastName?.message!)}
        />				
        <Input
          label={t("form:input-label-email")}
          {...register("email")}
          type="email"
          variant="outline"
          className="mb-4"
          error={t(errors?.email?.message!)}
        />
        <PasswordInput
          label={t("form:input-label-password")}
          {...register("password")}
          error={t(errors?.password?.message!)}
          variant="outline"
          className="mb-4"
        />
        <Button className="w-full" loading={loading} disabled={loading}>
          {t("form:text-register")}
        </Button>

        {errorMessage ? (
          <Alert
            message={t(errorMessage)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMessage(null)}
          />
        ) : null}

				{successMessage ? (
          <Alert
            message={t(successMessage)}
            variant="success"
            closeable={true}
            className="mt-5"
            onClose={() => setSuccessMessage(null)}
          />
        ) : null}				
      </form>
      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute start-2/4 -top-2.5 px-2 -ms-4 bg-light">
          {t("common:text-or")}
        </span>
      </div>
      <div className="text-sm sm:text-base text-body text-center">
        {t("form:text-already-account")}{" "}
        <Link
          href={ROUTES.LOGIN}
          className="ms-1 underline text-accent font-semibold transition-colors duration-200 focus:outline-none hover:text-accent-hover focus:text-accent-700 hover:no-underline focus:no-underline"
        >
          {t("form:button-label-login")}
        </Link>
      </div>
    </>
  );
};

export default RegistrationForm;
