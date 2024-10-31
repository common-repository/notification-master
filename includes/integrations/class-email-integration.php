<?php
/**
 * Class Email Integration
 *
 * This class is responsible for sending email notifications.
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master\Integrations;

use Notification_Master\Abstracts\Integration;
use Notification_Master\Users\Users;

use function Notification_Master\Notification_Master;

/**
 * Email Integration class.
 */
class Email_Integration extends Integration {

	/**
	 * Name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $name = 'Email';

	/**
	 * Slug.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $slug = 'email';

	/**
	 * Description.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $description = 'Send email notifications.';

	/**
	 * Process.
	 *
	 * @since 1.0.0
	 */
	public function process() {
		$valid = $this->validate_attributes();
		if ( ! $valid ) {
			Notification_Master()->logger->error(
				'email_integration_invalid_attributes',
				$this->prepare_response(
					array(
						'message'    => __( 'Invalid attributes.', 'notification-master' ),
						'attributes' => $this->attributes,
					)
				)
			);
			return;
		}

		// This function is used to get the values of merge tags and sanitize them.
		$this->process_attributes();

		$emails          = $this->attributes['emails'];
		$excluded_emails = $this->attributes['excluded_emails'];
		$emails          = array_values( array_diff( $emails, $excluded_emails ) );
		$subject         = $this->attributes['subject'];
		$message         = $this->attributes['message'];

		$headers = array(
			'Content-Type: text/html; charset=UTF-8',
		);

		if ( empty( $emails ) ) {
			Notification_Master()->notification_logger->error(
				$this->slug,
				$this->prepare_response(
					array(
						'message' => __( 'No emails found.', 'notification-master' ),
						'emails'  => $emails,
						'subject' => $subject,
						'body'    => $message,
						'headers' => $headers,
					)
				)
			);
			return;
		}

		$this->send_notification( $emails, $subject, $message, $headers );
	}

	/**
	 * Send email.
	 *
	 * @since 1.0.0
	 *
	 * @param array  $emails  Emails.
	 * @param string $subject Subject.
	 * @param string $message Message.
	 * @param array  $headers Headers.
	 */
	public function send_notification( $emails, $subject, $message, $headers ) {
		// Do action before send email.
		do_action( 'notification_master_before_send_email', $emails, $subject, $message, $headers );

		// Send email.
		$result = wp_mail( $emails, $subject, $message, $headers );
		if ( ! $result ) {
			Notification_Master()->notification_logger->error(
				$this->slug,
				$this->prepare_response(
					array(
						'message' => __( 'Failed to send email.', 'notification-master' ),
						'emails'  => $emails,
						'subject' => $subject,
						'body'    => $message,
						'headers' => $headers,
					)
				)
			);
		} else {
			Notification_Master()->notification_logger->success(
				$this->slug,
				$this->prepare_response(
					array(
						'message' => __( 'Email sent successfully.', 'notification-master' ),
						'emails'  => $emails,
						'subject' => $subject,
						'body'    => $message,
						'headers' => $headers,
					)
				)
			);
		}

		// Do action after send email.
		do_action( 'notification_master_after_send_email', $result, $emails, $subject, $message, $headers );
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
				'emails'          => array(
					'type'                          => 'array',
					'required'                      => true,
					'items'                         => array(
						'type' => array( 'string', 'object' ),
					),
					'sanitize_and_prepare_callback' => array( $this, 'sanitize_emails' ),
				),
				'excluded_emails' => array(
					'type'                          => 'array',
					'required'                      => false,
					'items'                         => array(
						'type' => array( 'string', 'object' ),
					),
					'sanitize_and_prepare_callback' => array( $this, 'sanitize_emails' ),
				),
				'subject'         => array(
					'type'     => 'string',
					'required' => true,
					'format'   => 'text-field',
				),
				'message'         => array(
					'type'     => 'string',
					'required' => false,
				),
			),
		);
	}

	/**
	 * Sanitize emails.
	 *
	 * @since 1.0.0
	 *
	 * @param array $emails Emails.
	 *
	 * @return array
	 */
	public function sanitize_emails( $emails ) {
		if ( empty( $emails ) ) {
			return array();
		}

		$sanitized_emails = array();

		foreach ( $emails as $email ) {
			if ( is_string( $email ) ) {
				$email = array(
					'type'  => 'custom',
					'value' => $email,
				);
			}

			$type  = $email['type'];
			$value = $email['value'];
			if ( empty( $value ) || empty( $type ) ) {
				continue;
			}

			switch ( $type ) {
				case 'custom':
					if ( ! is_email( $value ) ) {
						continue 2;
					}
					$sanitized_emails[] = sanitize_email( $value );
					break;
				case 'role':
					$role = $value['value'];
					if ( ! empty( $role ) ) {
						$users            = Users::get_instance();
						$emails           = $users->get_users_emails_by_role( $role );
						$sanitized_emails = array_merge( $sanitized_emails, $emails );
					}
					break;
				case 'user':
					$user_id = $value['value'];
					if ( ! empty( $user_id ) ) {
						$user               = get_user_by( 'ID', $user_id );
						$sanitized_emails[] = $user->user_email;
					}
					break;
			}
		}

		$sanitized_emails = array_unique( $sanitized_emails );

		return $sanitized_emails;
	}
}
