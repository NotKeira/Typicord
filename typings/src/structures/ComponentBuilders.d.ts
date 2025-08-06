import { ButtonStyle, TextInputStyle, SelectMenuOption, ButtonComponent, SelectMenuComponent, TextInputComponent, ActionRowComponent, Component } from "./Interaction";
/**
 * Builder for creating button components
 */
export declare class ButtonBuilder {
    private readonly data;
    /**
     * Sets the button style
     */
    setStyle(style: ButtonStyle): this;
    /**
     * Sets the button label
     */
    setLabel(label: string): this;
    /**
     * Sets the button custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the button URL (for link buttons)
     */
    setURL(url: string): this;
    /**
     * Sets the button emoji
     */
    setEmoji(emoji: {
        id?: string;
        name?: string;
        animated?: boolean;
    }): this;
    /**
     * Sets whether the button is disabled
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Builds the button component
     */
    toJSON(): ButtonComponent;
}
/**
 * Builder for creating string select menu components
 */
export declare class StringSelectMenuBuilder {
    private readonly data;
    /**
     * Sets the select menu custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the select menu placeholder
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the minimum number of selections
     */
    setMinValues(minValues: number): this;
    /**
     * Sets the maximum number of selections
     */
    setMaxValues(maxValues: number): this;
    /**
     * Sets whether the select menu is disabled
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Adds an option to the select menu
     */
    addOptions(...options: SelectMenuOption[]): this;
    /**
     * Sets the options for the select menu
     */
    setOptions(options: SelectMenuOption[]): this;
    /**
     * Builds the select menu component
     */
    toJSON(): SelectMenuComponent;
}
/**
 * Builder for creating user select menu components
 */
export declare class UserSelectMenuBuilder {
    private readonly data;
    /**
     * Sets the select menu custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the select menu placeholder
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the minimum number of selections
     */
    setMinValues(minValues: number): this;
    /**
     * Sets the maximum number of selections
     */
    setMaxValues(maxValues: number): this;
    /**
     * Sets whether the select menu is disabled
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Builds the select menu component
     */
    toJSON(): SelectMenuComponent;
}
/**
 * Builder for creating role select menu components
 */
export declare class RoleSelectMenuBuilder {
    private readonly data;
    /**
     * Sets the select menu custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the select menu placeholder
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the minimum number of selections
     */
    setMinValues(minValues: number): this;
    /**
     * Sets the maximum number of selections
     */
    setMaxValues(maxValues: number): this;
    /**
     * Sets whether the select menu is disabled
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Builds the select menu component
     */
    toJSON(): SelectMenuComponent;
}
/**
 * Builder for creating channel select menu components
 */
export declare class ChannelSelectMenuBuilder {
    private readonly data;
    /**
     * Sets the select menu custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the select menu placeholder
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the minimum number of selections
     */
    setMinValues(minValues: number): this;
    /**
     * Sets the maximum number of selections
     */
    setMaxValues(maxValues: number): this;
    /**
     * Sets the channel types that can be selected
     */
    setChannelTypes(channelTypes: number[]): this;
    /**
     * Sets whether the select menu is disabled
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Builds the select menu component
     */
    toJSON(): SelectMenuComponent;
}
/**
 * Builder for creating mentionable select menu components
 */
export declare class MentionableSelectMenuBuilder {
    private readonly data;
    /**
     * Sets the select menu custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the select menu placeholder
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the minimum number of selections
     */
    setMinValues(minValues: number): this;
    /**
     * Sets the maximum number of selections
     */
    setMaxValues(maxValues: number): this;
    /**
     * Sets whether the select menu is disabled
     */
    setDisabled(disabled?: boolean): this;
    /**
     * Builds the select menu component
     */
    toJSON(): SelectMenuComponent;
}
/**
 * Builder for creating text input components
 */
export declare class TextInputBuilder {
    private readonly data;
    /**
     * Sets the text input custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the text input label
     */
    setLabel(label: string): this;
    /**
     * Sets the text input style
     */
    setStyle(style: TextInputStyle): this;
    /**
     * Sets the text input placeholder
     */
    setPlaceholder(placeholder: string): this;
    /**
     * Sets the text input value
     */
    setValue(value: string): this;
    /**
     * Sets the minimum length
     */
    setMinLength(minLength: number): this;
    /**
     * Sets the maximum length
     */
    setMaxLength(maxLength: number): this;
    /**
     * Sets whether the text input is required
     */
    setRequired(required?: boolean): this;
    /**
     * Builds the text input component
     */
    toJSON(): TextInputComponent;
}
/**
 * Builder for creating action row components
 */
export declare class ActionRowBuilder {
    private components;
    /**
     * Adds components to the action row
     */
    addComponents(...components: (ButtonBuilder | StringSelectMenuBuilder | UserSelectMenuBuilder | RoleSelectMenuBuilder | ChannelSelectMenuBuilder | MentionableSelectMenuBuilder | TextInputBuilder | Component)[]): this;
    /**
     * Sets the components for the action row
     */
    setComponents(components: Component[]): this;
    /**
     * Builds the action row component
     */
    toJSON(): ActionRowComponent;
}
/**
 * Builder for creating modals
 */
export declare class ModalBuilder {
    private readonly data;
    /**
     * Sets the modal custom ID
     */
    setCustomId(customId: string): this;
    /**
     * Sets the modal title
     */
    setTitle(title: string): this;
    /**
     * Adds components to the modal
     */
    addComponents(...components: (ActionRowBuilder | ActionRowComponent)[]): this;
    /**
     * Sets the components for the modal
     */
    setComponents(components: ActionRowComponent[]): this;
    /**
     * Builds the modal
     */
    toJSON(): {
        custom_id: string;
        title: string;
        components: ActionRowComponent[];
    };
}
export declare function createSelectMenuOption(label: string, value: string, options?: {
    description?: string;
    emoji?: {
        id?: string;
        name?: string;
        animated?: boolean;
    };
    default?: boolean;
}): SelectMenuOption;
//# sourceMappingURL=ComponentBuilders.d.ts.map