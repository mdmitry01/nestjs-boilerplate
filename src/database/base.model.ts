import { Model } from "objection";
import * as pluralize from "pluralize";
import { lowercaseFirstLetter } from "../common/utils/lowercase-first-letter.util";

export class BaseModel extends Model {
  static get tableName() {
    return pluralize(lowercaseFirstLetter(this.name));
  }
}
