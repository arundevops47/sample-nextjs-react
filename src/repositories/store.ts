import Base from "./base";

import {
  ApproveStoreInput,
  StoreInput,
  AddStaffInput,
	StoreDocument
} from "@ts-types/generated";

class Store extends Base<StoreInput, StoreInput> {
  staffs = (url: string) => {
    return this.http(url, "get");
  };

  approve = async (url: string, variables: ApproveStoreInput) => {
    return this.http<ApproveStoreInput>(url, "post", variables);
  };

  disapprove = async (url: string, variables: { id: string }) => {
    return this.http<{ id: string }>(url, "post", variables);
  };

  addStaff = async (url: string, variables: AddStaffInput) => {
    return this.http<AddStaffInput>(url, "post", variables);
  };

  removeStaff = async (url: string, id: string) => {
    return this.http<{ id: string }>(url, "delete", { id });
  };

	allDocuments = async (url: string) => {
    return this.http<StoreDocument>(url, "get");
  };

	addDocument = async (url: string, variables: StoreDocument[]) => {
    return this.http<StoreDocument[]>(url, "post", variables);
  };

	updateDocument = async (url: string, variables: StoreDocument[]) => {
    return this.http<StoreDocument[]>(url, "post", variables);
  };
}

export default new Store();
