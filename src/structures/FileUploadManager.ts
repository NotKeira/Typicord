/**
 * File Upload Utilities for Discord API
 * Handles file attachments, images, and media uploads
 */

import * as fs from "fs";
import * as path from "path";

export interface FileAttachment {
  /** File name */
  filename: string;
  /** File data as Buffer */
  data: Buffer;
  /** MIME type */
  contentType?: string;
  /** Description of the file */
  description?: string;
  /** Whether this file is ephemeral */
  ephemeral?: boolean;
}

export interface ImageAttachment extends FileAttachment {
  /** Image width */
  width?: number;
  /** Image height */
  height?: number;
  /** Whether to mark as spoiler */
  spoiler?: boolean;
}

export class FileUploadManager {
  private static readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB for premium servers
  private static readonly MAX_FILE_SIZE_BASIC = 8 * 1024 * 1024; // 8MB for basic servers

  private static readonly ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  private static readonly ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/webm",
    "video/mov",
  ];

  private static readonly ALLOWED_AUDIO_TYPES = [
    "audio/mp3",
    "audio/wav",
    "audio/ogg",
    "audio/webm",
  ];

  /**
   * Create a file attachment from a file path
   */
  static async fromPath(
    filePath: string,
    options: {
      description?: string;
      spoiler?: boolean;
      ephemeral?: boolean;
    } = {}
  ): Promise<FileAttachment> {
    const data = await fs.promises.readFile(filePath);
    const filename = options.spoiler
      ? `SPOILER_${path.basename(filePath)}`
      : path.basename(filePath);

    return {
      filename,
      data,
      contentType: this.getMimeType(filePath),
      description: options.description,
      ephemeral: options.ephemeral,
    };
  }

  /**
   * Create a file attachment from a Buffer
   */
  static fromBuffer(
    data: Buffer,
    filename: string,
    options: {
      contentType?: string;
      description?: string;
      spoiler?: boolean;
      ephemeral?: boolean;
    } = {}
  ): FileAttachment {
    const actualFilename = options.spoiler ? `SPOILER_${filename}` : filename;

    return {
      filename: actualFilename,
      data,
      contentType: options.contentType || this.getMimeType(filename),
      description: options.description,
      ephemeral: options.ephemeral,
    };
  }

  /**
   * Create an image attachment with additional metadata
   */
  static createImageAttachment(
    data: Buffer,
    filename: string,
    options: {
      width?: number;
      height?: number;
      description?: string;
      spoiler?: boolean;
      ephemeral?: boolean;
    } = {}
  ): ImageAttachment {
    return {
      ...this.fromBuffer(data, filename, options),
      width: options.width,
      height: options.height,
      spoiler: options.spoiler,
    };
  }

  /**
   * Validate file size based on server tier
   */
  static validateFileSize(data: Buffer, isPremium = false): boolean {
    const maxSize = isPremium ? this.MAX_FILE_SIZE : this.MAX_FILE_SIZE_BASIC;
    return data.length <= maxSize;
  }

  /**
   * Check if file type is allowed for images
   */
  static isValidImageType(contentType: string): boolean {
    return this.ALLOWED_IMAGE_TYPES.includes(contentType.toLowerCase());
  }

  /**
   * Check if file type is allowed for videos
   */
  static isValidVideoType(contentType: string): boolean {
    return this.ALLOWED_VIDEO_TYPES.includes(contentType.toLowerCase());
  }

  /**
   * Check if file type is allowed for audio
   */
  static isValidAudioType(contentType: string): boolean {
    return this.ALLOWED_AUDIO_TYPES.includes(contentType.toLowerCase());
  }

  /**
   * Get MIME type from file extension
   */
  private static getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
      ".mov": "video/quicktime",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".ogg": "audio/ogg",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".json": "application/json",
      ".zip": "application/zip",
    };

    return mimeTypes[ext] || "application/octet-stream";
  }

  /**
   * Resize image buffer (requires additional image processing library)
   * This is a placeholder - you'd implement with sharp, jimp, or similar
   */
  static async resizeImage(
    data: Buffer,
    _width: number,
    _height: number
  ): Promise<Buffer> {
    // Placeholder - implement with image processing library
    console.warn(
      "Image resizing not implemented - requires additional library like sharp"
    );
    return data;
  }

  /**
   * Convert file attachment to Discord API format
   */
  static toDiscordFormat(attachment: FileAttachment, id: number = 0) {
    return {
      id: id.toString(),
      filename: attachment.filename,
      content_type: attachment.contentType,
      size: attachment.data.length,
      description: attachment.description,
      ephemeral: attachment.ephemeral || false,
    };
  }

  /**
   * Create a form data payload for file uploads
   */
  static createFormData(
    attachments: FileAttachment[],
    payloadJson?: string
  ): FormData {
    const formData = new FormData();

    if (payloadJson) {
      formData.append("payload_json", payloadJson);
    }

    attachments.forEach((attachment, index) => {
      const uint8Array = new Uint8Array(attachment.data);
      const blob = new Blob([uint8Array], { type: attachment.contentType });
      formData.append(`files[${index}]`, blob, attachment.filename);
    });

    return formData;
  }
}
