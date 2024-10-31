<?php
/**
 * Class WebPush Integration
 *
 * This class is responsible for sending webpush notifications.
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master\Integrations;

use Notification_Master\Abstracts\Integration;
use Minishlink\WebPush\WebPush;
use Minishlink\WebPush\Subscription;
use Notification_Master\DB\Models\Subscription_Model;
use Notification_Master\Settings;
use Notification_Master\WebPush\Background_Process;
use Notification_Master\WebPush\Loader as WebPush_Loader;

use function Notification_Master\Notification_Master;

/**
 * WebPush Integration class.
 */
class WebPush_Integration extends Integration {

	/**
	 * Name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $name = 'WebPush';

	/**
	 * Slug.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $slug = 'webpush';

	/**
	 * Description.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $description = 'Send your notifications to WebPush.';

	/**
	 * Background tasks.
	 *
	 * @var Background_Process
	 */
	protected $background_tasks;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		parent::__construct();

		$this->background_tasks = new Background_Process();
		add_action( 'notification_master_process_webpush_notification', array( $this, 'process_batch' ), 10, 4 );
	}

	/**
	 * Register integration.
	 *
	 * @param array $integrations Integrations.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function register( $integrations ) {
		$integrations[ $this->slug ] = array(
			'name'        => $this->name,
			'description' => $this->description,
			'icon'        => $this->get_icon(),
			'properties'  => $this->get_attributes_schema()['properties'] ?? array(),
		);

		return $integrations;
	}

	/**
	 * Process.
	 *
	 * @since 1.0.0
	 */
	public function process() {
		if ( ! WebPush_Loader::get_instance()->is_configured() ) {
			Notification_Master()->logger->error(
				'webpush_integration_not_configured',
				$this->prepare_response(
					array(
						'message' => __( 'WebPush is not configured.', 'notification-master' ),
					)
				)
			);
			return;
		}

		$valid = $this->validate_attributes();
		if ( ! $valid ) {
			Notification_Master()->logger->error(
				'webpush_integration_invalid_attributes',
				$this->prepare_response(
					array(
						'message'    => __( 'Invalid attributes', 'notification-master' ),
						'attributes' => $this->attributes,
						'args'       => $this->args,
					)
				)
			);
			return;
		}
		// This function is used to get the values of merge tags and sanitize them.
		$this->process_attributes();

		$title   = $this->attributes['title'];
		$message = $this->attributes['message'];
		$icon    = $this->attributes['icon'] ?? '';
		$image   = $this->attributes['image'] ?? '';
		$url     = $this->attributes['url'] ?? '';
		$urgency = $this->attributes['urgency'] ?? 'normal';
		if ( empty( $message ) ) {
			return;
		}

		$this->send_notification( $title, $message, $icon, $image, $url, $urgency );
	}

	/**
	 * Send notification.
	 *
	 * @since 1.0.0
	 *
	 * @param string $title   Title.
	 * @param string $message Message.
	 * @param string $icon    Icon.
	 * @param string $image   Image.
	 * @param string $url     URL.
	 * @param string $urgency Urgency.
	 */
	public function send_notification( $title, $message, $icon, $image, $url, $urgency ) {
		$this->process_batch(
			array(
				'title'   => $title,
				'message' => $message,
				'icon'    => $icon,
				'image'   => $image,
				'url'     => $url,
				'urgency' => $urgency,
			),
			1,
			$this->trigger,
			$this->notification_name
		);
	}

	/**
	 * Process batch.
	 *
	 * @since 1.2.1
	 *
	 * @param array   $notification Notification.
	 * @param int     $page         Page.
	 * @param Trigger $trigger     Trigger.
	 * @param string  $notification_name Notification name.
	 *
	 * @return void
	 */
	public function process_batch( $notification, $page, $trigger, $notification_name ) {
		if ( ! $this->trigger ) {
			$this->trigger = $trigger;
		}

		if ( ! $this->notification_name ) {
			$this->notification_name = $notification_name;
		}

		$title   = $notification['title'];
		$message = $notification['message'];
		$icon    = $notification['icon'];
		$image   = $notification['image'];
		$url     = ! empty( $notification['url'] ) ? $notification['url'] : home_url();
		$urgency = $notification['urgency'];
		$limit   = 20;

		$subscriptions = Subscription_Model::get_rows( $limit, $page, 'subscribed' );
		$auth          = array(
			'VAPID' => array(
				'subject'    => home_url(),
				'publicKey'  => Settings::get_setting( 'webpush_public_key' ),
				'privateKey' => Settings::get_setting( 'webpush_private_key' ),
			),
		);

		$webPush = new WebPush( $auth );

		foreach ( $subscriptions as $subscription ) {
			$endpoint         = $subscription->endpoint;
			$user_auth        = $subscription->auth;
			$p256dh           = $subscription->p256dh;
			$expiration_time  = $subscription->expiration_time;
			$content_encoding = $subscription->content_encoding;

			$subscription = Subscription::create(
				array(
					'endpoint'        => $endpoint,
					'keys'            => array(
						'auth'   => $user_auth,
						'p256dh' => $p256dh,
					),
					'expirationTime'  => $expiration_time,
					'contentEncoding' => $content_encoding,
				)
			);

			$webPush->queueNotification(
				$subscription,
				wp_json_encode(
					array(
						'title'   => $title,
						'message' => $message,
						'icon'    => $icon,
						'image'   => $image,
						'url'     => $url,
					)
				),
				array(
					'urgency' => $urgency,
				)
			);
		}

		/**
		 * Check sent results
		 *
		 * @var MessageSentReport $report
		 */
		foreach ( $webPush->flush() as $report ) {
			$endpoint = $report->getRequest()->getUri()->__toString();

			if ( $report->isSuccess() ) {
				Notification_Master()->notification_logger->success(
					$this->slug,
					$this->prepare_response(
						array(
							'subscription' => $endpoint,
							'message'      => __( 'Notification sent successfully.', 'notification-master' ),
						)
					)
				);
			} else {
				Notification_Master()->notification_logger->error(
					$this->slug,
					$this->prepare_response(
						array(
							'subscription' => $endpoint,
							'message'      => $report->getReason(),
						)
					)
				);
			}
		}

		// Check if there are more subscriptions to process.
		$count = Subscription_Model::get_count();
		if ( $count > ( $page * $limit ) ) {
			$this->background_tasks->push_to_queue( array( $notification, $page + 1, $trigger, $notification_name ) );
			$this->background_tasks->save()->dispatch();
		}
	}

	/**
	 * Get attributes schema.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_attributes_schema() {
		return array(
			'type'       => 'object',
			'properties' => array(
				'title'   => array(
					'type'     => 'string',
					'format'   => 'text-field',
					'required' => true,
				),
				'message' => array(
					'type'     => 'string',
					'format'   => 'text-field',
					'required' => true,
				),
				'icon'    => array(
					'type'                          => 'string',
					'sanitize_and_prepare_callback' => 'esc_url',
				),
				'image'   => array(
					'type'                          => 'string',
					'sanitize_and_prepare_callback' => 'esc_url',
				),
				'url'     => array(
					'type'                          => 'string',
					'sanitize_and_prepare_callback' => 'esc_url',
				),
				'urgency' => array(
					'type'     => 'string',
					'enum'     => array( 'very-low', 'low', 'normal', 'high' ),
					'required' => true,
				),
			),
		);
	}

	/**
	 * Get icon.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_icon() {
		return NOTIFICATION_MASTER_URL . 'assets/integrations/' . $this->slug . '.svg';
	}
}
