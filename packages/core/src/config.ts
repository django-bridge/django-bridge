/* eslint-disable  @typescript-eslint/no-explicit-any */

import { Context, FunctionComponent } from "react";
import Telepath from "telepath-unpack";

export default class Config {
  public views: Map<string, FunctionComponent>;

  public contextProviders: Map<string, Context<unknown>>;

  // Telepath Doesn't support typescript yet
  public telepathRegistry: Telepath;

  constructor() {
    this.views = new Map();
    this.contextProviders = new Map();
    this.telepathRegistry = new Telepath();

    // Add default deserializers
    this.addDeserializer("Date", Date);
  }

  public addView = <P>(
    name: string,
    component: FunctionComponent<P>
  ): Config => {
    this.views.set(name, component as FunctionComponent<object>);
    return this;
  };

  public addContextProvider = <C>(
    name: string,
    context: Context<C>
  ): Config => {
    this.contextProviders.set(name, context as Context<unknown>);
    return this;
  };

  public addDeserializer = <Cls>(
    name: string,
    ctor: { new (...args: any[]): Cls }
  ): Config => {
    this.telepathRegistry.register(name, ctor);
    return this;
  };

  public unpack = (data: Record<string, unknown>): Record<string, unknown> =>
    this.telepathRegistry.unpack(data);
}
