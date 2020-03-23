import { Flag as _Flag, Rox } from 'rox-ssr';

export class Flag extends _Flag {
  isEnabled(context?: any): boolean {
    try {
      if (!this.name) {
        throw new Error('Flag value requested on a flag that wasn\'t registered. Did you initialize Rollout properly?');
      }
    } catch (e) {
      console.warn(e); // eslint-disable-line

      return this.defaultValue === 'true';
    }
    return Rox.dynamicApi.isEnabled(this.name, this.defaultValue === 'true', context);
  }
}
