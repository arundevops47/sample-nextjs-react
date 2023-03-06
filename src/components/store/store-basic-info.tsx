import Card from "@components/common/card";
import Image from "next/image";
import { CheckMarkFill } from "@components/icons/checkmark-circle-fill";
import { CloseFillIcon } from "@components/icons/close-fill";
import { useTranslation } from "next-i18next";
import Link from "@components/ui/link";
import { ROUTES } from "@utils/routes";
import Loader from "@components/ui/loader/loader";

const StoreBasicInfo: React.FC = () => {
  const { t } = useTranslation("common");

  return (
		<Card className="flex flex-col md:flex-row items-center justify-between mb-8">
			<div className="h-full p-5 flex flex-col items-center">
				<div className="w-32 h-32 relative rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
					hello
				</div>
				<h3 className="text-lg font-semibold text-heading mt-4">fullName</h3>
				<p className="text-sm text-muted mt-1">email</p>

				<div className="border border-gray-200 rounded flex items-center justify-center text-sm text-body-dark py-2 px-3 mt-6">
					<CloseFillIcon width={16} className="me-2 text-red-500" />
				</div>
			</div>			
		</Card>
  );
};
export default StoreBasicInfo;
