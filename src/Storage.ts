import { Readable } from "stream";
import {
  IStorage,
  StorageConfig,
  ConfigLocal,
  ConfigAmazonS3,
  ConfigGoogleCloud
} from "./types";
import { StorageLocal, StorageAmazonS3, StorageGoogleCloud } from ".";

export class Storage implements IStorage {
  public static TYPE_GOOGLE_CLOUD: string = "TYPE_GOOGLE_CLOUD";
  public static TYPE_AMAZON_S3: string = "TYPE_AMAZON_S3";
  public static TYPE_LOCAL: string = "TYPE_LOCAL";
  public storage: IStorage;
  protected bucketName: string;
  protected bucketCreated: boolean = false;

  constructor(config: StorageConfig) {
    this.switchStorage(config);
  }

  async test(): Promise<void> {
    return this.storage.test();
  }

  async addFileFromBuffer(buffer: Buffer, targetPath: string): Promise<void> {
    return this.storage.addFileFromBuffer(buffer, targetPath);
  }

  async addFileFromPath(origPath: string, targetPath: string): Promise<void> {
    return this.storage.addFileFromPath(origPath, targetPath);
  }

  async createBucket(name?: string): Promise<void> {
    return this.storage.createBucket(name);
  }

  async clearBucket(name?: string): Promise<void> {
    return this.storage.clearBucket(name);
  }

  async deleteBucket(name?: string): Promise<void> {
    return this.storage.deleteBucket(name);
  }

  async listBuckets(): Promise<string[]> {
    return this.storage.listBuckets();
  }

  public getSelectedBucket(): string | null {
    return this.storage.getSelectedBucket();
  }

  async getFileAsReadable(name: string): Promise<Readable> {
    return this.storage.getFileAsReadable(name);
  }

  async getFileByteRangeAsReadable(
    name: string,
    start: number,
    length?: number
  ): Promise<Readable> {
    return this.storage.getFileByteRangeAsReadable(name, start, length);
  }

  async removeFile(fileName: string): Promise<void> {
    return this.storage.removeFile(fileName);
  }

  async listFiles(): Promise<[string, number][]> {
    return this.storage.listFiles();
  }

  async selectBucket(name: string | null): Promise<void> {
    return this.storage.selectBucket(name);
  }

  public switchStorage(config: StorageConfig): void {
    if (typeof (config as ConfigLocal).directory !== "undefined") {
      this.storage = new StorageLocal(config as ConfigLocal);
    } else if (typeof (config as ConfigAmazonS3).accessKeyId !== "undefined") {
      this.storage = new StorageAmazonS3(config as ConfigAmazonS3);
    } else if (
      typeof (config as ConfigGoogleCloud).keyFilename !== "undefined"
    ) {
      this.storage = new StorageGoogleCloud(config as ConfigGoogleCloud);
    } else {
      throw new Error("Not a supported configuration");
    }
  }

  async sizeOf(name: string): Promise<number> {
    return this.storage.sizeOf(name);
  }
}
