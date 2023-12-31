import { uuid } from "@tmw-universe/tmw-universe-types";

export interface BookDatasource {
  id: uuid;
  code: string;
  name: string;
  standard: string;
  url: string;
  createdAt: Date;
}
