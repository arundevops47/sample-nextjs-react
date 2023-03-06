import Modal from "@components/ui/modal/modal";
import dynamic from "next/dynamic";
import { useModalAction, useModalState } from "./modal.context";
const TagDeleteView = dynamic(() => import("@components/tag/tag-delete-view"));
const TaxDeleteView = dynamic(() => import("@components/tax/tax-delete-view"));
const BanCustomerView = dynamic(() => import("@components/user/user-ban-view"));
const UserWalletPointsAddView = dynamic(
  () => import("@components/user/user-wallet-points-add-view")
);
const ShippingDeleteView = dynamic(
  () => import("@components/shipping/shipping-delete-view")
);
const CategoryDeleteView = dynamic(
  () => import("@components/category/category-delete-view")
);
const CouponDeleteView = dynamic(
  () => import("@components/coupon/coupon-delete-view")
);

const ProductDeleteView = dynamic(
  () => import("@components/product/product-delete-view")
);
const TypeDeleteView = dynamic(
  () => import("@components/group/group-delete-view")
);
const AttributeDeleteView = dynamic(
  () => import("@components/attribute/attribute-delete-view")
);

const ApproveStoreView = dynamic(
  () => import("@components/store/approve-store-view")
);
const DisApproveStoreView = dynamic(
  () => import("@components/store/disapprove-store-view")
);
const RemoveStaffView = dynamic(
  () => import("@components/store/staff-delete-view")
);

const ExportImportView = dynamic(
  () => import("@components/product/import-export-modal")
);

const AttributeExportImport = dynamic(
  () => import("@components/attribute/attribute-import-export")
);
const UpdateRefundConfirmationView = dynamic(
  () => import("@components/refund/refund-confirmation-view")
);
const RefundImageModal = dynamic(
  () => import("@components/refund/refund-image-modal")
);

const ManagedModal = () => {
  const { isOpen, view } = useModalState();
  const { closeModal } = useModalAction();

  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === "DELETE_PRODUCT" && <ProductDeleteView />}
      {view === "DELETE_TYPE" && <TypeDeleteView />}
      {view === "DELETE_ATTRIBUTE" && <AttributeDeleteView />}
      {view === "DELETE_CATEGORY" && <CategoryDeleteView />}
      {view === "DELETE_COUPON" && <CouponDeleteView />}
      {view === "DELETE_TAX" && <TaxDeleteView />}
      {view === "DELETE_SHIPPING" && <ShippingDeleteView />}
      {view === "DELETE_TAG" && <TagDeleteView />}
      {view === "BAN_CUSTOMER" && <BanCustomerView />}
      {view === "STORE_APPROVE_VIEW" && <ApproveStoreView />}
      {view === "STORE_DISAPPROVE_VIEW" && <DisApproveStoreView />}
      {view === "DELETE_STAFF" && <RemoveStaffView />}
      {view === "UPDATE_REFUND" && <UpdateRefundConfirmationView />}
      {view === "ADD_WALLET_POINTS" && <UserWalletPointsAddView />}
      {view === "REFUND_IMAGE_POPOVER" && <RefundImageModal />}
      {view === "EXPORT_IMPORT_PRODUCT" && <ExportImportView />}
      {view === "EXPORT_IMPORT_ATTRIBUTE" && <AttributeExportImport />}
    </Modal>
  );
};

export default ManagedModal;
