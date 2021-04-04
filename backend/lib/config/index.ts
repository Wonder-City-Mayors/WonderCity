import * as common from './common';
import * as development from './development';
import * as production from './production';

export default Object.assign(
    common, process.env.DEV ? development : production
);