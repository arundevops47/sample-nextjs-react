import { useState } from "react";
import Pagination from "@components/ui/pagination";
import Image from "next/image";
import { Table } from "@components/ui/table";
import ActionButtons from "@components/common/action-buttons";
import { siteSettings } from "@settings/site.settings";
import { useTranslation } from "next-i18next";
import { useIsRTL } from "@utils/locals";
import Badge from "@components/ui/badge/badge";
import { StorePaginator, SortOrder } from "@ts-types/generated";
import TitleWithSort from "@components/ui/title-with-sort";
import Link from "@components/ui/link";

type IProps = {
  stores: StorePaginator | null | undefined;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const StoreList = ({ stores, onPagination, onSort, onOrder }: IProps) => {
  const { data, paginatorInfo } = stores! ?? {};
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: t("table:table-item-logo"),
      dataIndex: "logo",
      key: "logo",
      align: "center",
      width: 74,
      render: (logo: any, record: any) => (
        <Image
          src={logo?.thumbnail ?? siteSettings.product.placeholder}
          alt={record?.name}
          layout="fixed"
          width={42}
          height={42}
          className="rounded overflow-hidden"
        />
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-title")}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === "name"
          }
          isActive={sortingObj.column === "name"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "name",
      key: "name",
      align: alignLeft,
      onHeaderCell: () => onHeaderClick("name"),
      render: (name: any, { slug }: any) => (
        <Link href={`/${slug}`}>
          <span className="whitespace-nowrap">{name}</span>
        </Link>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-total-products")}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === "products_count"
          }
          isActive={sortingObj.column === "products_count"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "products_count",
      key: "products_count",
      align: "center",
      onHeaderCell: () => onHeaderClick("products_count"),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-total-orders")}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === "orders_count"
          }
          isActive={sortingObj.column === "orders_count"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "orders_count",
      key: "orders_count",
      align: "center",
      onHeaderCell: () => onHeaderClick("orders_count"),
    },
    {
      title: (
        <TitleWithSort
          title={t("table:table-item-status")}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === "isApproved"
          }
          isActive={sortingObj.column === "isApproved"}
        />
      ),
      className: "cursor-pointer",
      dataIndex: "isApproved",
      key: "isApproved",
      align: "center",
      onHeaderCell: () => onHeaderClick("isApproved"),
      render: (isApproved: boolean) => (
        <Badge
          textKey={isApproved ? "common:text-active" : "common:text-inactive"}
          color={isApproved ? "bg-accent" : "bg-red-500"}
        />
      ),
    },
    {
      title: t("table:table-item-actions"),
      dataIndex: "id",
      key: "actions",
      align: alignRight,
      render: (id: string, { slug, isApproved }: any) => {
        return (
          <ActionButtons
            id={id}
            approveButton={false}
            detailsUrl={`/${slug}`}
            isStoreActive={isApproved}
          />
        );
      },
    },
  ];

  return (
    <>
      <div className="rounded overflow-hidden shadow mb-6">
        <Table
          //@ts-ignore
          columns={columns}
          emptyText={t("table:empty-table-data")}
          data={data}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </div>
    </>
  );
};

export default StoreList;
