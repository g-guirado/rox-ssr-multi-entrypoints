import { Flag as _Flag, Rox } from 'rox-ssr';

export class Flag extends _Flag {
  isEnabled(context?: any): boolean {
    return Rox.dynamicApi.isEnabled(this.name, this.defaultValue === 'true', context);
  }
}
