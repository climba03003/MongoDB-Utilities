import * as Validator from '@climba03003/validator';

export function clean(o: any): any {
  Object.entries(o).reduce(function(o: any, v: [string, any]) {
    if (Validator.Empty.isEmpty(v[1])) delete o[v[0]];
    return o;
  }, o);
  return o;
}

export function remove(o: any, keys: string | Array<string>): any {
  if (!Validator.Array.isArray(keys)) keys = [keys];
  if (Validator.Empty.isEmpty(o)) o = {};
  keys.reduce(function(o: any, key: string) {
    delete o[key];
    return clean(o);
  }, o);
  return o;
}
