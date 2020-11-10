// You can only augment modules within modules or declaration files.
// Once you add an import or export statement it's a module.
// So, this import is here, just to make this file a module.
// See https://github.com/microsoft/TypeScript/issues/41351#issuecomment-719968244
import { Params } from "@feathersjs/feathers";

declare module "@feathersjs/feathers" {
  export interface Params {
    disableAccessControlHooks?: boolean;
  }
}
