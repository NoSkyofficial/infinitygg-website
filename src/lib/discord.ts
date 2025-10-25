import axios from 'axios';

const DISCORD_API_BASE = 'https://discord.com/api/v10';

export interface DiscordWebhookPayload {
  content?: string;
  embeds?: DiscordEmbed[];
  username?: string;
  avatar_url?: string;
}

export interface DiscordEmbed {
  title?: string;
  description?: string;
  color?: number;
  fields?: Array<{
    name: string;
    value: string;
    inline?: boolean;
  }>;
  footer?: {
    text: string;
    icon_url?: string;
  };
  timestamp?: string;
}

class DiscordClient {
  private botToken: string;
  private guildId: string;

  constructor() {
    this.botToken = process.env.DISCORD_BOT_TOKEN || '';
    this.guildId = process.env.DISCORD_GUILD_ID || '';
  }

  /**
   * Send message to Discord webhook
   */
  async sendWebhook(webhookUrl: string, payload: DiscordWebhookPayload) {
    try {
      await axios.post(webhookUrl, payload);
      return { success: true };
    } catch (error) {
      console.error('Discord webhook error:', error);
      return { success: false, error };
    }
  }

  /**
   * Add role to Discord member
   */
  async addRoleToMember(userId: string, roleId: string) {
    try {
      await axios.put(
        `${DISCORD_API_BASE}/guilds/${this.guildId}/members/${userId}/roles/${roleId}`,
        {},
        {
          headers: {
            Authorization: `Bot ${this.botToken}`,
          },
        }
      );
      return { success: true };
    } catch (error) {
      console.error('Discord add role error:', error);
      return { success: false, error };
    }
  }

  /**
   * Remove role from Discord member
   */
  async removeRoleFromMember(userId: string, roleId: string) {
    try {
      await axios.delete(
        `${DISCORD_API_BASE}/guilds/${this.guildId}/members/${userId}/roles/${roleId}`,
        {
          headers: {
            Authorization: `Bot ${this.botToken}`,
          },
        }
      );
      return { success: true };
    } catch (error) {
      console.error('Discord remove role error:', error);
      return { success: false, error };
    }
  }

  /**
   * Get Discord member info
   */
  async getMember(userId: string) {
    try {
      const response = await axios.get(
        `${DISCORD_API_BASE}/guilds/${this.guildId}/members/${userId}`,
        {
          headers: {
            Authorization: `Bot ${this.botToken}`,
          },
        }
      );
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Discord get member error:', error);
      return { success: false, error };
    }
  }

  /**
   * Send whitelist approval notification
   */
  async notifyWhitelistApproved(discordId: string, discordTag: string) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_WHITELIST_APPROVED;
    if (!webhookUrl) return { success: false, error: 'Webhook URL not configured' };

    const embed: DiscordEmbed = {
      title: '✅ Podanie Zaakceptowane',
      description: `<@${discordId}> Twoje podanie na whitelistę zostało zaakceptowane!`,
      color: 0x26a69a, // Green color
      fields: [
        {
          name: 'Użytkownik',
          value: discordTag,
          inline: true,
        },
        {
          name: 'Status',
          value: 'Zaakceptowane ✓',
          inline: true,
        },
      ],
      footer: {
        text: 'InfinityGG Whitelist System',
      },
      timestamp: new Date().toISOString(),
    };

    return this.sendWebhook(webhookUrl, {
      content: `<@${discordId}>`,
      embeds: [embed],
    });
  }

  /**
   * Send whitelist rejection notification
   */
  async notifyWhitelistRejected(
    discordId: string,
    discordTag: string,
    reason: string
  ) {
    const webhookUrl = process.env.DISCORD_WEBHOOK_WHITELIST_REJECTED;
    if (!webhookUrl) return { success: false, error: 'Webhook URL not configured' };

    const embed: DiscordEmbed = {
      title: '❌ Podanie Odrzucone',
      description: `<@${discordId}> Twoje podanie na whitelistę zostało odrzucone.`,
      color: 0xff5252, // Red color
      fields: [
        {
          name: 'Użytkownik',
          value: discordTag,
          inline: true,
        },
        {
          name: 'Status',
          value: 'Odrzucone ✗',
          inline: true,
        },
        {
          name: 'Powód',
          value: reason || 'Nie podano powodu',
          inline: false,
        },
      ],
      footer: {
        text: 'InfinityGG Whitelist System',
      },
      timestamp: new Date().toISOString(),
    };

    return this.sendWebhook(webhookUrl, {
      content: `<@${discordId}>`,
      embeds: [embed],
    });
  }

  /**
   * Assign whitelist role and notify
   */
  async approveWhitelist(discordId: string, discordTag: string) {
    const roleId = process.env.DISCORD_WHITELIST_ROLE_ID;
    if (!roleId) return { success: false, error: 'Whitelist role ID not configured' };

    // Add role
    const roleResult = await this.addRoleToMember(discordId, roleId);
    if (!roleResult.success) {
      return roleResult;
    }

    // Send notification
    const notifyResult = await this.notifyWhitelistApproved(discordId, discordTag);
    
    return {
      success: true,
      roleAdded: roleResult.success,
      notificationSent: notifyResult.success,
    };
  }

  /**
   * Remove whitelist role and notify rejection
   */
  async rejectWhitelist(discordId: string, discordTag: string, reason: string) {
    // Send notification
    const notifyResult = await this.notifyWhitelistRejected(discordId, discordTag, reason);
    
    return {
      success: true,
      notificationSent: notifyResult.success,
    };
  }
}

export const discordClient = new DiscordClient();
