import { Variant as _Variant, Rox } from 'rox-ssr';

export class Variant extends _Variant {
  /**
       * Returns the current value of the Variant, accounting for value overrides
       */
  getValue(context?: any): string {
    return Rox.dynamicApi.value(this.name, this.defaultValue, context);
  }
}
