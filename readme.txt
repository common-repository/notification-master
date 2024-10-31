=== Notification Master - All-in-One WordPress Notifications ===
Contributors: notificationmaster
Donate link: https://notification-master.com
Tags: web push, email, alerts, notifications, webhooks
Stable tag: 1.4.5
Requires at least: 4.9
Tested up to: 6.6
Requires PHP: 7.1
License: GPL-3.0-or-later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Enhance WordPress with custom alerts. Trigger notifications for events, support channels like web push and email, and personalize with merge tags.

== Description ==

Notification Master is a versatile WordPress plugin designed to enhance user engagement by providing a comprehensive notification system. With Notification Master, you can notify users about new posts, comments, user activities, and other significant events on your WordPress site. The plugin supports multiple notification channels, including WebPush notifications, Email, and more, ensuring that your audience stays informed with real-time updates.

Easily set up notifications for various actions, customize them with dynamic content, and deliver them through your preferred channels. Notification Master is designed to be user-friendly and flexible, making it an essential tool for improving communication and interaction on any WordPress site.

How to Set Up and Use the Notification Master Plugin by **WP Simple Hacks**

https://youtu.be/6gRbfHZzi1s?si=03krrf8eVNRbBI8I

**Key Features**

* **Web Push Notifications:**
  * **Instant Alerts:** Send real-time browser notifications to users, even when they are not on your site.
  * **Customizable:** Personalize notifications with dynamic merge tags to keep users engaged with timely updates.

* **Multiple Notification Channels:**
  * **Email Notifications:** Send detailed email alerts to keep users informed.
  * **Webhook Integration:** Connect with external services to expand functionality.
  * **Discord Notifications:** Engage with your community through Discord channels.
  * **Facebook Notifications:** Stay updated with notifications to Facebook pages.
  * **Twitter Notifications:** Update Twitter accounts with important alerts.
  * **Zapier Integration:** Automate tasks and workflows through Zapier.
  * **Slack Notifications:** Keep your team updated with notifications via Slack.
  * **Make (formerly Integromat) Integration:** Automate processes with Make.

**Triggers**

**Post Events:**
* **New Post:** Notify when a new post is created.
* **Post Approved:** Notify when a post is approved for publication.
* **Post Drafted:** Notify when a post is saved as a draft.
* **Post Published:** Notify when a post is published.
* **Post Scheduled:** Notify when a post is scheduled for future publication.
* **Post Sent for Review:** Notify when a post is sent for review.
* **Post Updated:** Notify when an existing post is updated.
* **Post Published Privately:** Notify when a post is published as private.
* **Post Trashed:** Notify when a post is moved to the trash.

**Comment Events:**
* **New Comment:** Notify when a new comment is added.
* **Comment Approved:** Notify when a comment is approved.
* **Comment Published:** Notify when a comment is published.
* **Comment Trashed:** Notify when a comment is moved to the trash.
* **Comment Unapproved:** Notify when a comment is unapproved.
* **Comment Marked as Spam:** Notify when a comment is marked as spam.
* **Comment Replied:** Notify when a reply is made to a comment.

**Taxonomy Events:**
* **Taxonomy Added:** Notify when a new taxonomy is added.
* **Taxonomy Updated:** Notify when an existing taxonomy is updated.
* **Taxonomy Deleted:** Notify when a taxonomy is deleted.

**User Events:**
* **User Registered:** Notify when a new user registers.
* **User Profile Updated:** Notify when a user updates their profile.
* **User Deleted:** Notify when a user is deleted.
* **User Login:** Notify when a user logs in.
* **User Logout:** Notify when a user logs out.

**Media Events:**
* **Media Added:** Notify when a new media item is uploaded.
* **Media Updated:** Notify when an existing media item is updated.
* **Media Deleted:** Notify when a media item is deleted.

**Plugin Events:**
* **Plugin Installed:** Notify when a new plugin is installed.
* **Plugin Activated:** Notify when a plugin is activated.
* **Plugin Updated:** Notify when an existing plugin is updated.
* **Plugin Deactivated:** Notify when a plugin is deactivated.

**Theme Events:**
* **Theme Installed:** Notify when a new theme is installed.
* **Theme Switched:** Notify when the active theme is switched.
* **Theme Updated:** Notify when an existing theme is updated.

**Privacy Events:**
* **Personal Data Exported:** Notify when a user's personal data is exported.
* **Personal Data Erased:** Notify when a user's personal data is erased.

**Merge Tags**

Notification Master supports the use of merge tags to personalize your notifications. Merge tags are placeholders that are replaced with dynamic content when the notification is sent. For example:

* `{{post.title}}`: The title of the post.
* `{{user.email}}`: The email address of the user.
* `{{plugin.name}}`: The name of the plugin.
* `{{theme.name}}`: The name of the theme.
* `{{comment.author}}`: The author of the comment.

**How to Use Notification Master**
1. Install and activate the Notification Master plugin.
2. Go to the Notification Master dashboard in your WordPress admin panel.
3. Create a new notification by selecting the trigger event and add the desired channels.
4. Customize the notification content using merge tags.
5. Save the notification and start sending alerts to your users.

For more detailed guides on using Notification Master, refer to our documentation:
* [Getting Started](https://notification-master.com/docs/getting-started/) - Learn how to install and set up Notification Master.
* [Settings](https://notification-master.com/docs/settings/) - Explore and configure the various settings available in Notification Master.
* [Triggers](https://notification-master.com/docs/triggers/) - Understand the different events that can trigger notifications.
* [Discord Integration](https://notification-master.com/docs/discord/) - Set up and configure Discord integration.
* [Webhook Integration](https://notification-master.com/docs/webhook/) - Learn how to send notifications using webhooks.
* [WebPush Notifications](https://notification-master.com/docs/web-push/) - Set up and configure WebPush integration.
* [Facebook Integration](https://notification-master.com/docs/facebook/) - Set up and configure Facebook integration.
* [Twitter Integration](https://notification-master.com/docs/x-formerly-twitter/) - Set up and configure Twitter integration.
* [Zapier Integration](https://notification-master.com/docs/zapier/) - Set up and configure Zapier integration.
* [Slack Integration](https://notification-master.com/docs/slack/) - Set up and configure Slack integration.
* [Make (formerly Integromat) Integration](https://notification-master.com/docs/make-formerly-integromat/) - Set up and configure Make (formerly Integromat) integration.
* [WooCommerce Triggers](https://notification-master.com/docs/woocommerce-triggers/) - Learn how to set up notifications for WooCommerce events.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/notification-master` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.

**Development**
1. Run `composer install` to install the required dependencies.
2. Run `npm install` to install the required dependencies.
3. Run `npm run build` to build the assets.
4. Run `npm run dev` to watch the assets for changes.

== Frequently Asked Questions ==

= What events can trigger notifications? =

Notification Master supports a wide range of triggers such as comments, theme changes, plugin updates, user registrations, and more.

= What channels are supported for sending notifications? =

Notification Master currently supports WebPush, Email, Webhook, Discord, Facebook, Twitter, Zapier, Slack, and Make (formerly Integromat) channels.

= Can I use multiple channels for single notifications? =

Yes, you can add connections to multiple channels for each notification.

= How can I personalize my notifications? =

You can personalize your notifications using dynamic merge tags. These merge tags can insert dynamic content into your notifications such as user names or post titles.

== Screenshots ==
1. Notification Master - Notifications
2. Notification Master - Notification
3. Notification Master - Integrations
4. Notification Master - Merge Tags

== Changelog ==

= 1.4.5 =
* Added: Push notifications floating button option.
* Added: Customization options for push notifications floating button and normal button.
* Added: Allow users to unsubscribe from push notifications.

= 1.4.4 =
* Added: Help links for the integrations.
* Improved: Integration settings UI.

= 1.4.3 =
* Improved: Dashboard and settings page UI.
* Fixed: Delete logs by selected IDs not working.

= 1.4.2 =
* Fixed: Web push keys generation not working in some cases.
* Fixed: Email notification email address not saved.

= 1.4.1 =
* Fixed: Web push notifications not working in some cases.

= 1.4.0 =
* Added: Web push notifications subscriptions management.

= 1.3.3 =
* Fixed: Some plugin trigger merge tags not working.
* Improved: Code Improvements.

= 1.3.2 =
* Fixed: Changelog issue.

= 1.3.1 =
* Fixed: WooCommerce product triggers conflict with custom post type triggers.
* Added: Current time and date merge tags for notifications.

= 1.3.0 =
* Added: WebPush notifications Feature.
* Improved: Settings page.

= 1.2.1 =
* Improved: Enhanced the dashboard navigation bar styling.

= 1.2.0 =
* Improved: Email notifications now support multiple recipients, allowing selection based on user roles, individual users, custom email addresses, or merge tags.
* Improved: Added the ability to exclude email addresses from notifications, with options to exclude based on user roles, individual users, custom email addresses, or merge tags.

= 1.1.4 =
* Feature: Added the ability to delete logs by selected IDs.
* Feature: Added the ability to delete notification logs by selected IDs.

= 1.1.3 =
* Fixed: Issue when updating notifications.

= 1.1.2 =
* Added: Background processing for notifications to improve performance.

= 1.1.1 =
* Fixed: Some Admin UI issues

= 1.1.0 =
* Added: Facebook integration
* Added: Twitter integration
* Added: Zapier integration
* Added: Slack integration
* Added: Make (formerly Integromat) integration
* Added: WooCommerce triggers

= 1.0.1 =
* Added: Support for WordPress 6.6
* Added: Documentation links

= 1.0.0 =
* Initial release

== Upgrade Notice ==
The latest version of Notification Master includes bug fixes and improvements to enhance the user experience.