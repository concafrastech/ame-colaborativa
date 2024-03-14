import { Contact } from "./Contact";

export interface Customer {
  name: string;
  email: string;
  tax_id: string;
  phones: Contact[];
}
