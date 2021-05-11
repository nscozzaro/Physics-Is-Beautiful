import { getAbsoluteDependencies } from '@codesandbox/common/lib/utils/dependencies';
import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { json } from 'overmind';

const global = getGlobal() as Window & { BrowserFS: any };

const fs = global.BrowserFS.BFSRequire('fs');
// const SERVICE_URL = 'https://ata-fetcher.cloud/api/v5/typings';
const SERVICE_URL = 'https://ata.codesandbox.io/api/v8';

let lastMTime = new Date(0);

function sendTypes() {
  global.postMessage(
    {
      $broadcast: true,
      $type: 'typings-sync',
      $data: types,
    },
    protocolAndHost()
  );
}

let typeInfoPromise;
let types;

/**
 * Gets all entries of dependencies -> @types/ version
 */
function getTypesInfo() {
  if (typeInfoPromise) {
    return typeInfoPromise;
  }

  typeInfoPromise = fetch(
    'https://unpkg.com/types-registry@latest/index.json',
    // This falls back to etag caching, ensuring we always have latest version
    // https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
    { cache: 'no-cache' }
  )
    .then(x => x.json())
    .then(x => x.entries);

  return typeInfoPromise;
}

async function syncDependencyTypings(
  packageJSON: string,
  autoInstallTypes: boolean
) {
  try {
    types = {};
    const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJSON);

    const totalDependencies = {
      '@types/jest': 'latest',
      ...dependencies,
      ...devDependencies,
    };

    if (autoInstallTypes) {
      const typeInfo = await getTypesInfo();
      Object.keys(totalDependencies).forEach(async dep => {
        if (
          !dep.startsWith('@types/') &&
          !totalDependencies[`@types/${dep}`] &&
          typeInfo[dep]
        ) {
          totalDependencies[`@types/${dep}`] = typeInfo[dep].latest;
        }
      });
    }

    const absoluteDependencies = await getAbsoluteDependencies(
      totalDependencies
    );

    return Promise.all(
      Object.keys(absoluteDependencies).map(async depName => {
        const depVersion = absoluteDependencies[depName].replace(
          /^https:\/\//,
          'https:'
        );

        const dependencyQuery = encodeURIComponent(`${depName}@${depVersion}`);

        try {
          const fetchRequest = await fetch(
            // `${SERVICE_URL}/${depName}@${depVersion}.json`
            `${SERVICE_URL}/${dependencyQuery}.json`
          );

          if (!fetchRequest.ok) {
            throw new Error('Fetch error');
          }

          const { files } = await fetchRequest.json();
          types = { ...types, ...files };
          sendTypes();
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Trouble fetching types for ' + depName);
          }
        }
      })
    );
  } catch (e) {
    /* ignore */
    return Promise.resolve({});
  }
}

function sendFiles(modulesByPath) {
  global.postMessage(
    {
      $broadcast: true,
      $type: 'file-sync',
      $data: json(modulesByPath),
    },
    protocolAndHost()
  );

  try {
    fs.stat('/sandbox/package.json', (packageJsonError, stat) => {
      if (packageJsonError) {
        return;
      }

      if (stat.mtime.toString() !== lastMTime.toString()) {
        lastMTime = stat.mtime;

        fs.readFile(
          '/sandbox/package.json',
          async (packageJsonReadError, rv) => {
            if (packageJsonReadError) {
              console.error(packageJsonReadError);
              return;
            }

            fs.stat('/sandbox/tsconfig.json', (tsConfigError, result) => {
              // If tsconfig exists we want to sync the types
              syncDependencyTypings(
                rv.toString(),
                Boolean(tsConfigError) || !result
              );
            });
          }
        );
      }
    });
  } catch (e) {
    // Do nothing
  }
}

export default {
  initialize(options: {
    onModulesByPathChange: (modulesByPath: any) => void;
    getModulesByPath: () => any;
  }) {
    self.addEventListener('message', evt => {
      if (evt.data.$type === 'request-data') {
        sendTypes();
        sendFiles(options.getModulesByPath());
      }
    });

    options.onModulesByPathChange(sendFiles);
  },
};