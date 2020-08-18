import { PackageJsonInput } from './interface';
export declare function packageJsonContent({ name, version, linuiversion, description, cliversion, cliname }: PackageJsonInput): string;
export declare function projectConfigContent(isOpenLoading: boolean, linuiConfigName: string, projectname: string, miniVersion: string): string;
export declare function linuiConfigContent(): string;
