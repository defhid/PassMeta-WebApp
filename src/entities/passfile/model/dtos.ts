/**
 * DTO for password section.
 */
export interface PwdSectionDto {
    /**
     * Section identifier.
     */
    id?: string;

    /**
     * Section name.
     */
    nm?: string;

    /**
     * Website address.
     */
    url?: string;

    /**
     * Password items.
     */
    it?: PwdItemDto[];
}

/**
 * DTO for password item.
 */
export interface PwdItemDto {
    /**
     * Username list: email, phone, etc.
     */
    usr?: string[];

    /**
     * Single password.
     */
    pwd?: string;

    /**
     * Comment.
     */
    rmk?: string;
}
