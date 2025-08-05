import {
  ComponentType,
  ButtonStyle,
  TextInputStyle,
  SelectMenuOption,
  ButtonComponent,
  SelectMenuComponent,
  TextInputComponent,
  ActionRowComponent,
  Component,
} from "./Interaction";

/**
 * Builder for creating button components
 */
export class ButtonBuilder {
  private readonly data: Partial<ButtonComponent> = {
    type: ComponentType.BUTTON,
  };

  /**
   * Sets the button style
   */
  public setStyle(style: ButtonStyle): this {
    this.data.style = style;
    return this;
  }

  /**
   * Sets the button label
   */
  public setLabel(label: string): this {
    this.data.label = label;
    return this;
  }

  /**
   * Sets the button custom ID
   */
  public setCustomId(customId: string): this {
    if (this.data.style === ButtonStyle.LINK) {
      throw new Error("Link buttons cannot have custom IDs");
    }
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the button URL (for link buttons)
   */
  public setURL(url: string): this {
    this.data.url = url;
    this.data.style = ButtonStyle.LINK;
    return this;
  }

  /**
   * Sets the button emoji
   */
  public setEmoji(emoji: {
    id?: string;
    name?: string;
    animated?: boolean;
  }): this {
    this.data.emoji = emoji;
    return this;
  }

  /**
   * Sets whether the button is disabled
   */
  public setDisabled(disabled: boolean = true): this {
    this.data.disabled = disabled;
    return this;
  }

  /**
   * Builds the button component
   */
  public toJSON(): ButtonComponent {
    if (!this.data.style) {
      throw new Error("Button style is required");
    }

    if (this.data.style === ButtonStyle.LINK && !this.data.url) {
      throw new Error("Link buttons must have a URL");
    }

    if (this.data.style !== ButtonStyle.LINK && !this.data.custom_id) {
      throw new Error("Non-link buttons must have a custom ID");
    }

    return this.data as ButtonComponent;
  }
}

/**
 * Builder for creating string select menu components
 */
export class StringSelectMenuBuilder {
  private readonly data: Partial<SelectMenuComponent> = {
    type: ComponentType.STRING_SELECT,
    options: [],
  };

  /**
   * Sets the select menu custom ID
   */
  public setCustomId(customId: string): this {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the select menu placeholder
   */
  public setPlaceholder(placeholder: string): this {
    this.data.placeholder = placeholder;
    return this;
  }

  /**
   * Sets the minimum number of selections
   */
  public setMinValues(minValues: number): this {
    this.data.min_values = Math.max(0, Math.min(minValues, 25));
    return this;
  }

  /**
   * Sets the maximum number of selections
   */
  public setMaxValues(maxValues: number): this {
    this.data.max_values = Math.max(1, Math.min(maxValues, 25));
    return this;
  }

  /**
   * Sets whether the select menu is disabled
   */
  public setDisabled(disabled: boolean = true): this {
    this.data.disabled = disabled;
    return this;
  }

  /**
   * Adds an option to the select menu
   */
  public addOptions(...options: SelectMenuOption[]): this {
    this.data.options ??= [];
    this.data.options.push(...options);
    return this;
  }

  /**
   * Sets the options for the select menu
   */
  public setOptions(options: SelectMenuOption[]): this {
    this.data.options = options;
    return this;
  }

  /**
   * Builds the select menu component
   */
  public toJSON(): SelectMenuComponent {
    if (!this.data.custom_id) {
      throw new Error("Select menu custom ID is required");
    }

    if (!this.data.options || this.data.options.length === 0) {
      throw new Error("Select menu must have at least one option");
    }

    if (this.data.options.length > 25) {
      throw new Error("Select menu cannot have more than 25 options");
    }

    return this.data as SelectMenuComponent;
  }
}

/**
 * Builder for creating user select menu components
 */
export class UserSelectMenuBuilder {
  private readonly data: Partial<SelectMenuComponent> = {
    type: ComponentType.USER_SELECT,
  };

  /**
   * Sets the select menu custom ID
   */
  public setCustomId(customId: string): this {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the select menu placeholder
   */
  public setPlaceholder(placeholder: string): this {
    this.data.placeholder = placeholder;
    return this;
  }

  /**
   * Sets the minimum number of selections
   */
  public setMinValues(minValues: number): this {
    this.data.min_values = Math.max(0, Math.min(minValues, 25));
    return this;
  }

  /**
   * Sets the maximum number of selections
   */
  public setMaxValues(maxValues: number): this {
    this.data.max_values = Math.max(1, Math.min(maxValues, 25));
    return this;
  }

  /**
   * Sets whether the select menu is disabled
   */
  public setDisabled(disabled: boolean = true): this {
    this.data.disabled = disabled;
    return this;
  }

  /**
   * Builds the select menu component
   */
  public toJSON(): SelectMenuComponent {
    if (!this.data.custom_id) {
      throw new Error("User select menu custom ID is required");
    }

    return this.data as SelectMenuComponent;
  }
}

/**
 * Builder for creating role select menu components
 */
export class RoleSelectMenuBuilder {
  private readonly data: Partial<SelectMenuComponent> = {
    type: ComponentType.ROLE_SELECT,
  };

  /**
   * Sets the select menu custom ID
   */
  public setCustomId(customId: string): this {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the select menu placeholder
   */
  public setPlaceholder(placeholder: string): this {
    this.data.placeholder = placeholder;
    return this;
  }

  /**
   * Sets the minimum number of selections
   */
  public setMinValues(minValues: number): this {
    this.data.min_values = Math.max(0, Math.min(minValues, 25));
    return this;
  }

  /**
   * Sets the maximum number of selections
   */
  public setMaxValues(maxValues: number): this {
    this.data.max_values = Math.max(1, Math.min(maxValues, 25));
    return this;
  }

  /**
   * Sets whether the select menu is disabled
   */
  public setDisabled(disabled: boolean = true): this {
    this.data.disabled = disabled;
    return this;
  }

  /**
   * Builds the select menu component
   */
  public toJSON(): SelectMenuComponent {
    if (!this.data.custom_id) {
      throw new Error("Role select menu custom ID is required");
    }

    return this.data as SelectMenuComponent;
  }
}

/**
 * Builder for creating channel select menu components
 */
export class ChannelSelectMenuBuilder {
  private readonly data: Partial<SelectMenuComponent> = {
    type: ComponentType.CHANNEL_SELECT,
  };

  /**
   * Sets the select menu custom ID
   */
  public setCustomId(customId: string): this {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the select menu placeholder
   */
  public setPlaceholder(placeholder: string): this {
    this.data.placeholder = placeholder;
    return this;
  }

  /**
   * Sets the minimum number of selections
   */
  public setMinValues(minValues: number): this {
    this.data.min_values = Math.max(0, Math.min(minValues, 25));
    return this;
  }

  /**
   * Sets the maximum number of selections
   */
  public setMaxValues(maxValues: number): this {
    this.data.max_values = Math.max(1, Math.min(maxValues, 25));
    return this;
  }

  /**
   * Sets the channel types that can be selected
   */
  public setChannelTypes(channelTypes: number[]): this {
    this.data.channel_types = channelTypes;
    return this;
  }

  /**
   * Sets whether the select menu is disabled
   */
  public setDisabled(disabled: boolean = true): this {
    this.data.disabled = disabled;
    return this;
  }

  /**
   * Builds the select menu component
   */
  public toJSON(): SelectMenuComponent {
    if (!this.data.custom_id) {
      throw new Error("Channel select menu custom ID is required");
    }

    return this.data as SelectMenuComponent;
  }
}

/**
 * Builder for creating mentionable select menu components
 */
export class MentionableSelectMenuBuilder {
  private readonly data: Partial<SelectMenuComponent> = {
    type: ComponentType.MENTIONABLE_SELECT,
  };

  /**
   * Sets the select menu custom ID
   */
  public setCustomId(customId: string): this {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the select menu placeholder
   */
  public setPlaceholder(placeholder: string): this {
    this.data.placeholder = placeholder;
    return this;
  }

  /**
   * Sets the minimum number of selections
   */
  public setMinValues(minValues: number): this {
    this.data.min_values = Math.max(0, Math.min(minValues, 25));
    return this;
  }

  /**
   * Sets the maximum number of selections
   */
  public setMaxValues(maxValues: number): this {
    this.data.max_values = Math.max(1, Math.min(maxValues, 25));
    return this;
  }

  /**
   * Sets whether the select menu is disabled
   */
  public setDisabled(disabled: boolean = true): this {
    this.data.disabled = disabled;
    return this;
  }

  /**
   * Builds the select menu component
   */
  public toJSON(): SelectMenuComponent {
    if (!this.data.custom_id) {
      throw new Error("Mentionable select menu custom ID is required");
    }

    return this.data as SelectMenuComponent;
  }
}

/**
 * Builder for creating text input components
 */
export class TextInputBuilder {
  private readonly data: Partial<TextInputComponent> = {
    type: ComponentType.TEXT_INPUT,
  };

  /**
   * Sets the text input custom ID
   */
  public setCustomId(customId: string): this {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the text input label
   */
  public setLabel(label: string): this {
    this.data.label = label;
    return this;
  }

  /**
   * Sets the text input style
   */
  public setStyle(style: TextInputStyle): this {
    this.data.style = style;
    return this;
  }

  /**
   * Sets the text input placeholder
   */
  public setPlaceholder(placeholder: string): this {
    this.data.placeholder = placeholder;
    return this;
  }

  /**
   * Sets the text input value
   */
  public setValue(value: string): this {
    this.data.value = value;
    return this;
  }

  /**
   * Sets the minimum length
   */
  public setMinLength(minLength: number): this {
    this.data.min_length = Math.max(0, Math.min(minLength, 4000));
    return this;
  }

  /**
   * Sets the maximum length
   */
  public setMaxLength(maxLength: number): this {
    this.data.max_length = Math.max(1, Math.min(maxLength, 4000));
    return this;
  }

  /**
   * Sets whether the text input is required
   */
  public setRequired(required: boolean = true): this {
    this.data.required = required;
    return this;
  }

  /**
   * Builds the text input component
   */
  public toJSON(): TextInputComponent {
    if (!this.data.custom_id) {
      throw new Error("Text input custom ID is required");
    }

    if (!this.data.label) {
      throw new Error("Text input label is required");
    }

    if (!this.data.style) {
      throw new Error("Text input style is required");
    }

    return this.data as TextInputComponent;
  }
}

/**
 * Builder for creating action row components
 */
export class ActionRowBuilder {
  private components: Component[] = [];

  /**
   * Adds components to the action row
   */
  public addComponents(
    ...components: (
      | ButtonBuilder
      | StringSelectMenuBuilder
      | UserSelectMenuBuilder
      | RoleSelectMenuBuilder
      | ChannelSelectMenuBuilder
      | MentionableSelectMenuBuilder
      | TextInputBuilder
      | Component
    )[]
  ): this {
    for (const component of components) {
      if (
        component instanceof ButtonBuilder ||
        component instanceof StringSelectMenuBuilder ||
        component instanceof UserSelectMenuBuilder ||
        component instanceof RoleSelectMenuBuilder ||
        component instanceof ChannelSelectMenuBuilder ||
        component instanceof MentionableSelectMenuBuilder ||
        component instanceof TextInputBuilder
      ) {
        this.components.push(component.toJSON());
      } else {
        this.components.push(component);
      }
    }
    return this;
  }

  /**
   * Sets the components for the action row
   */
  public setComponents(components: Component[]): this {
    this.components = components;
    return this;
  }

  /**
   * Builds the action row component
   */
  public toJSON(): ActionRowComponent {
    if (this.components.length === 0) {
      throw new Error("Action row must have at least one component");
    }

    if (this.components.length > 5) {
      throw new Error("Action row cannot have more than 5 components");
    }

    // Validate component types - can't mix buttons with select menus in same row
    const hasButtons = this.components.some(
      c => c.type === ComponentType.BUTTON
    );
    const hasSelectMenus = this.components.some(
      c =>
        c.type === ComponentType.STRING_SELECT ||
        c.type === ComponentType.USER_SELECT ||
        c.type === ComponentType.ROLE_SELECT ||
        c.type === ComponentType.MENTIONABLE_SELECT ||
        c.type === ComponentType.CHANNEL_SELECT
    );

    if (hasButtons && hasSelectMenus) {
      throw new Error(
        "Cannot mix buttons and select menus in the same action row"
      );
    }

    return {
      type: ComponentType.ACTION_ROW,
      components: this.components as (
        | ButtonComponent
        | SelectMenuComponent
        | TextInputComponent
      )[],
    };
  }
}

/**
 * Builder for creating modals
 */
export class ModalBuilder {
  private readonly data: {
    custom_id?: string;
    title?: string;
    components: ActionRowComponent[];
  } = {
    components: [],
  };

  /**
   * Sets the modal custom ID
   */
  public setCustomId(customId: string): this {
    this.data.custom_id = customId;
    return this;
  }

  /**
   * Sets the modal title
   */
  public setTitle(title: string): this {
    this.data.title = title;
    return this;
  }

  /**
   * Adds components to the modal
   */
  public addComponents(
    ...components: (ActionRowBuilder | ActionRowComponent)[]
  ): this {
    for (const component of components) {
      if (component instanceof ActionRowBuilder) {
        this.data.components.push(component.toJSON());
      } else {
        this.data.components.push(component);
      }
    }
    return this;
  }

  /**
   * Sets the components for the modal
   */
  public setComponents(components: ActionRowComponent[]): this {
    this.data.components = components;
    return this;
  }

  /**
   * Builds the modal
   */
  public toJSON(): {
    custom_id: string;
    title: string;
    components: ActionRowComponent[];
  } {
    if (!this.data.custom_id) {
      throw new Error("Modal custom ID is required");
    }

    if (!this.data.title) {
      throw new Error("Modal title is required");
    }

    if (this.data.components.length === 0) {
      throw new Error("Modal must have at least one component");
    }

    if (this.data.components.length > 5) {
      throw new Error("Modal cannot have more than 5 action rows");
    }

    return {
      custom_id: this.data.custom_id,
      title: this.data.title,
      components: this.data.components,
    };
  }
}

// Utility function to create a select menu option
export function createSelectMenuOption(
  label: string,
  value: string,
  options: {
    description?: string;
    emoji?: { id?: string; name?: string; animated?: boolean };
    default?: boolean;
  } = {}
): SelectMenuOption {
  return {
    label,
    value,
    ...options,
  };
}
