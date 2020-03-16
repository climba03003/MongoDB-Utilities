import { Connector } from '@climba03003/mongodb-connector';
import { Controller } from '@climba03003/mongodb-controller';
import * as console from './debug';

export interface SessionStoreOptions {
  name: string;
  expires: number;
  connector: Connector;
}

export interface Session {
  id: string;
  data: any;
  expiredOn: Date;
  updatedAt: Date;
}

export class SessionStore extends Controller<Session> {
  expires: number;

  constructor(opt: Partial<SessionStoreOptions> = {}) {
    // ensure options is JSON
    opt = Object.assign({}, opt);
    super(opt.name ?? 'session', opt);
    this.expires = opt.expires ?? 86400000;
  }

  async get(id: string, maxAge: number, status: { rolling: boolean }): Promise<any> {
    if (!this.__isConnected) await this.connect();

    const result = await this.findOne({
      id: id,
      expiredOn: { $gte: new Date() }
    });
    console.debug('Get Session: %s (%d) [%j]', id, maxAge, status);
    return result?.data ?? {};
  }
  async set(id: string, data: any, maxAge: number, status: { rolling: boolean; changed: boolean }): Promise<any> {
    if (!this.__isConnected) await this.connect();

    if (status.changed || status.rolling) {
      await this.updateOne(
        { id: id },
        {
          $set: {
            id: id,
            data,
            expiredOn: new Date(Date.now() + this.expires),
            updatedAt: new Date()
          }
        },
        {
          upsert: true
        }
      );
      console.debug('Set Session: %s (%d) [%j]', id, maxAge, status);
    }
    return data;
  }

  async destroy(id: string): Promise<void> {
    if (!this.__isConnected) await this.connect();
    console.debug('Destroy Session:  %s', id);
    await this.deleteOne({ id: id });
  }

  static create(opt: SessionStoreOptions): SessionStore {
    return new SessionStore(opt);
  }
}
