export interface IConfigurable<T = any> {
  setOptions(options: T): void;
}
