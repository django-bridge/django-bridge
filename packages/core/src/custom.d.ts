declare module "telepath-unpack" {
  declare class Telepath {
    register<Cls>(
      name: string,
      constructor: new (...args: unknown[]) => Cls
    ): void;
    unpack(data: Record<string, unknown>): Record<string, unknown>;
  }

  export = Telepath;
}
