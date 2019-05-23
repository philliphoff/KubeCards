export interface IEnvironmentService {
    getValue(name: string): string | undefined;
}

class WindowEnvironmentService implements IEnvironmentService {
    getValue(name: string): string | undefined {
        return (window as any)._env_[name];
    }
}

const environmentService: IEnvironmentService = new WindowEnvironmentService();

export default environmentService;
