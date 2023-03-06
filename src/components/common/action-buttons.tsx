import { useEffect } from "react";
import { BanUser } from "@components/icons/ban-user";
import { EditIcon } from "@components/icons";
import { Trash } from "@components/icons/trash";
import { Eye } from "@components/icons/eye-icon";
import { DownloadIcon } from "@components/icons/download-icon";
import { WalletPointsIcon } from "@components/icons/wallet-point";
import Link from "@components/ui/link";
import { useTranslation } from "next-i18next";
import { CheckMarkCircle } from "@components/icons/checkmark-circle";
import { useModalAction } from "@components/ui/modal/modal.context";
import { CloseFillIcon } from "@components/icons/close-fill";
import reactSelect from "react-select";

type Props = {
  id: string;
  deleteModalView?: string | any;
  editUrl?: string;
  detailsUrl?: string;
	downloadUrl?: string;
	downloadFileName?: string;
  isUserActive?: boolean;
  userStatus?: boolean;
  isStoreActive?: boolean;
  approveButton?: boolean;
	downloadButton?: boolean;
  showAddWalletPoints?: boolean;
  changeRefundStatus?: boolean;
};


const ActionButtons = ({
  id,
  deleteModalView,
  editUrl,
  detailsUrl,
  userStatus = false,
  isUserActive = false,
  isStoreActive,
  approveButton = false,
  showAddWalletPoints = false,
  changeRefundStatus = false,
	downloadButton = false,
	downloadUrl,
	downloadFileName,
}: Props) => {
  const { t } = useTranslation();
  const { openModal } = useModalAction();
	
  function handleDelete() {
    openModal(deleteModalView, id);
  }
  function handleUserStatus(type: string) {
    openModal("BAN_CUSTOMER", { id, type });
  }
  function handleAddWalletPoints() {
    openModal("ADD_WALLET_POINTS", id);
  }
  function handleUpdateRefundStatus() {
    openModal("UPDATE_REFUND", id);
  }
  function handleStoreStatus(status: boolean) {
    if (status === true) {
      openModal("STORE_APPROVE_VIEW", id);
    } else {
      openModal("STORE_DISAPPROVE_VIEW", id);
    }
  }

  return (
    <div className="space-s-5 inline-flex items-center w-auto">

      {showAddWalletPoints && (
        <button
          onClick={handleAddWalletPoints}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t("text-add-wallet-points")}
        >
          <WalletPointsIcon width={22} />
        </button>
      )}

      {changeRefundStatus && (
        <button
          onClick={handleUpdateRefundStatus}
          className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
          title={t("text-change-refund-status")}
        >
          <CheckMarkCircle width={20} />
        </button>
      )}

      {deleteModalView && (
        <button
          onClick={handleDelete}
          className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
          title={t("text-delete")}
        >
          <Trash width={16} />
        </button>
      )}

      {approveButton &&
        (!isStoreActive ? (
          <button
            onClick={() => handleStoreStatus(true)}
            className="text-accent transition duration-200 hover:text-accent-hover focus:outline-none"
            title={t("text-approve-store")}
          >
            <CheckMarkCircle width={20} />
          </button>
        ) : (
          <button
            onClick={() => handleStoreStatus(false)}
            className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
            title={t("text-disapprove-store")}
          >
            <CloseFillIcon width={20} />
          </button>
      ))}

      {userStatus && (
        <>
          {isUserActive ? (
            <button
              onClick={() => handleUserStatus("ban")}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={t("text-ban-user")}
            >
              <BanUser width={20} />
            </button>
          ) : (
            <button
              onClick={() => handleUserStatus("active")}
              className="text-accent transition duration-200 hover:text-accent focus:outline-none"
              title={t("text-activate-user")}
            >
              <CheckMarkCircle width={20} />
            </button>
          )}
        </>
      )}

      {editUrl && (
        <Link
          href={editUrl}
          className="text-base transition duration-200 hover:text-heading"
          title={t("text-edit")}
        >
          <EditIcon width={16} />
        </Link>
      )}

      {detailsUrl && (
        <Link
          href={detailsUrl}
          className="ml-2 text-base transition duration-200 hover:text-heading"
          title={t("text-view")}
        >
          <Eye width={24} />
        </Link>
      )}

			{downloadButton && (
				<a href={downloadUrl} download rel="noopener noreferrer">
					<button
						className="text-sm text-red-500 hover:text-red-700 transition-colors duration-200 focus:outline-none sm:mt-4 sm:col-span-1"
					>
						<DownloadIcon width={24} />
					</button>
				</a>
      )}		
    </div>
  );
};

export default ActionButtons;
