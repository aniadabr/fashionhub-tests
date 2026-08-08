import envList from '../../config/environments.json'


export interface Environment {
    envName: string;
    baseUrl: string;
}

const knownEnvs = envList.environments as Record<string, { baseUrl: string}>;

export function getEnvironment(): Environment {
    const envName = process.env.TEST_ENV ?? envList.default;
    const selectedEnv = knownEnvs[envName];
    if (!selectedEnv) {
        throw new Error(
      `Unknown environment "${envName}". Available: ${Object.keys(knownEnvs).join(', ')}`,
    );
  }
  return { envName, baseUrl: selectedEnv.baseUrl };
}