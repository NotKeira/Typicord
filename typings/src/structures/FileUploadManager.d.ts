/**
 * File Upload Utilities for Discord API
 * Handles file attachments, images, and media uploads
 */
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
export declare class FileUploadManager {
    private static readonly MAX_FILE_SIZE;
    private static readonly MAX_FILE_SIZE_BASIC;
    private static readonly ALLOWED_IMAGE_TYPES;
    private static readonly ALLOWED_VIDEO_TYPES;
    private static readonly ALLOWED_AUDIO_TYPES;
    /**
     * Create a file attachment from a file path
     */
    static fromPath(filePath: string, options?: {
        description?: string;
        spoiler?: boolean;
        ephemeral?: boolean;
    }): Promise<FileAttachment>;
    /**
     * Create a file attachment from a Buffer
     */
    static fromBuffer(data: Buffer, filename: string, options?: {
        contentType?: string;
        description?: string;
        spoiler?: boolean;
        ephemeral?: boolean;
    }): FileAttachment;
    /**
     * Create an image attachment with additional metadata
     */
    static createImageAttachment(data: Buffer, filename: string, options?: {
        width?: number;
        height?: number;
        description?: string;
        spoiler?: boolean;
        ephemeral?: boolean;
    }): ImageAttachment;
    /**
     * Validate file size based on server tier
     */
    static validateFileSize(data: Buffer, isPremium?: boolean): boolean;
    /**
     * Check if file type is allowed for images
     */
    static isValidImageType(contentType: string): boolean;
    /**
     * Check if file type is allowed for videos
     */
    static isValidVideoType(contentType: string): boolean;
    /**
     * Check if file type is allowed for audio
     */
    static isValidAudioType(contentType: string): boolean;
    /**
     * Get MIME type from file extension
     */
    private static getMimeType;
    /**
     * Resize image buffer (requires additional image processing library)
     * This is a placeholder - you'd implement with sharp, jimp, or similar
     */
    static resizeImage(data: Buffer, _width: number, _height: number): Promise<Buffer>;
    /**
     * Convert file attachment to Discord API format
     */
    static toDiscordFormat(attachment: FileAttachment, id?: number): {
        id: string;
        filename: string;
        content_type: string | undefined;
        size: number;
        description: string | undefined;
        ephemeral: boolean;
    };
    /**
     * Create a form data payload for file uploads
     */
    static createFormData(attachments: FileAttachment[], payloadJson?: string): FormData;
}
//# sourceMappingURL=FileUploadManager.d.ts.map