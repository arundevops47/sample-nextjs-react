import { useRouter } from "next/router";
import { useEffect } from "react";
import { ROUTES } from "@utils/routes";
import { useTranslation } from "next-i18next";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { useMutation } from "react-query";
import User from "@repositories/user";

import { getAuthCredentials, isAuthenticated } from "@utils/auth-utils";

export interface IEmailVerificationVariables {
	variables: {
		input: { token: string; };
	};
}

const EmailVerificationView = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const { token: authToken, permissions } = getAuthCredentials();
  if (isAuthenticated({ authToken, permissions })) {
    router.replace(ROUTES.DASHBOARD);
  }

	const mutation = useMutation(({ variables: { input } }: IEmailVerificationVariables) =>
		User.verifyEmail(API_ENDPOINTS.VERIFY_EMAIL, input)
  );

	useEffect(() => {
		const { token } = router.query;
	
		if (token) {
			mutation.mutate({
				variables: {
					input: {
						token: token as string,
					},
				},
			});
		}
	}, [router.query]);
	
  return (
    <>
			<div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
				{ mutation.isLoading ? (
					<p>Please wait...</p>
				) : (
					<>
						{mutation.isError ? (
							<div>An error occurred: { mutation.error }</div>
						) : null}
						{mutation.isSuccess ? <div>{ t(mutation.data.data.msg) }</div> : null}
					</>
				)}				
			</div>
    </>
  );
};

export default EmailVerificationView;
