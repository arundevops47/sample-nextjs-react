import Image from "next/image";
import { useTranslation } from "next-i18next";
import Link from "@components/ui/link";
import Badge from "@components/ui/badge/badge";

type StoreCardProps = {
  store: any;
};

const StoreCard: React.FC<StoreCardProps> = ({ store }) => {
  const { t } = useTranslation();

  const isNew = false;

  return (
    <Link href={`/${store?.slug}`}>
      <div className="flex items-center p-5 bg-light border border-gray-200 rounded cursor-pointer relative">
        {isNew && (
          <span className="text-xs text-light px-2 py-1 rounded bg-blue-500 absolute top-2 end-2">
            {t("common:text-new")}
          </span>
        )}
        <div className="w-16 h-16 relative flex flex-shrink-0 border border-gray-100 items-center justify-center bg-gray-300 rounded-full overflow-hidden">
          <Image
            alt={t("common:text-logo")}
            src={
              store?.logo?.thumbnail! ?? "/product-placeholder-borderless.svg"
            }
            layout="fill"
            objectFit="cover"
          />
        </div>

        <div className="flex flex-col ms-4">
          <span className="text-lg font-semibold text-heading mb-2">
            {store?.name}
          </span>
          <span>
            <Badge
              textKey={
                store?.isActive ? "common:text-active" : "common:text-inactive"
              }
              color={store?.isActive ? "bg-accent" : "bg-red-500"}
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
