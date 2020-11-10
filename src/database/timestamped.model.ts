import { BaseModel } from "./base.model";

export class TimestampedModel extends BaseModel {
  updatedAt: Date;
  createdAt: Date;
  
  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
