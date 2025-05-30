export interface ReadyEvent {
    v: number;
    user: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string | null;
        bot?: boolean;
    };
    guilds: { id: string; unavailable?: boolean }[];
    session_id: string;
    application: {
        id: string;
        flags: number;
    }
}