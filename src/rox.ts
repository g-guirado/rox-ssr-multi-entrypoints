
import {
  _RoxClient, RoxContainer, RoxFetcherResult, RoxSetupOptions,
} from 'rox-ssr';

class RoxClientMultiEntrypoints extends _RoxClient {
  // Store values from initial setup. Will allow to detect whether subsequent calls to setup
  // are legitimate or not (=with different setup)
  private _initialSetup: {
    apiKey: string
    devModeSecret: string
  };

  private _confFetchedHandlers: ((fetcherResults: RoxFetcherResult) => void)[] = [];

  register(namespace: string, roxContainer: RoxContainer): void {
    try {
      super.register(namespace, roxContainer);
    } catch (e) {
      if (!e.message || !e.message.includes('A namespace must be unique')) {
        // register failed for a reason other than namespace already existing
        throw e;
      }
    }

    // calling register multiple times is legitimate, but underlying SDK does not support it
    // Each webpack entrypoint actually gets its own instance
    // of Flags. However, the Rox singleton remains unique.
    // In this case, we rewrite the Flags with the values stored within Rox.
    if (this.flags && this.flags.length > 0) {
      this.flags.forEach((f) => {
        roxContainer[f.name.replace(`${namespace}.`, '')] = f; // eslint-disable-line no-param-reassign
      });
    }
  }

  async setup(apiKey: string, options?: RoxSetupOptions): Promise<void> {
    if (this._initialSetup) {
      // this is a legitimate call only if parameters remain the same
      if (this._initialSetup.apiKey !== apiKey
        || this._initialSetup.devModeSecret !== options.devModeSecret) {
        throw new Error('Rox cannot be initialized more than once');
      }
      // Add the configurationFetchedHandler to the list of handlers
      // _configurationFetchedHandlers can only grow but this is not a memory leak; there can
      // only be a finite number of entry points
      if (options.configurationFetchedHandler) {
        this._confFetchedHandlers.push(options.configurationFetchedHandler);
      }
      return;
    }

    const _options = { ...options };
    if (options.configurationFetchedHandler) {
      this._confFetchedHandlers.push(options.configurationFetchedHandler);
    }
    _options.configurationFetchedHandler = this._confFetchedHandler;

    await super.setup(apiKey, options);
    this._initialSetup = {
      apiKey,
      devModeSecret: options?.devModeSecret,
    };
  }

  private _confFetchedHandler(): (fetcherResults: RoxFetcherResult) => void {
    const roxClient = this;
    return (fetcherResults: RoxFetcherResult): void => {
      roxClient._confFetchedHandlers.forEach((cfh) => cfh(fetcherResults));
    };
  }
}

export const Rox = new RoxClientMultiEntrypoints();
