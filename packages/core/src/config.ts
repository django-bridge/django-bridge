import { FunctionComponent } from "react";
import Telepath from "telepath-unpack";

export class Config {
  public views: Map<string, FunctionComponent>;

  // Telepath Doesn't support typescript yet
  public telepathRegistry: any;

  constructor() {
    this.views = new Map();
    this.telepathRegistry = new Telepath();

    // Add default deserializers
    this.addDeserializer("Date", Date);
  }

  public addView = <P>(
    name: string,
    component: FunctionComponent<P>
  ): Config => {
    this.views.set(name, component as FunctionComponent<{}>);
    return this;
  };

  public addDeserializer = <Cls>(
    name: string,
    ctor: { new (...args: any[]): Cls }
  ): Config => {
    this.telepathRegistry.register(name, ctor);
    return this;
  };

  public unpack = (data: Record<string, unknown>): Record<string, unknown> => {
    return this.telepathRegistry.unpack(data);
  };
}
