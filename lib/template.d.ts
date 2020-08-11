import { PackageJsonInput } from './interface';
export declare function packageJsonContent({ name, version, linuiversion, description }: PackageJsonInput): string;
export declare function projectConfigContent(appid: string, isOpenLoading: boolean): string;
export declare function linuiConfigContent(): string;
