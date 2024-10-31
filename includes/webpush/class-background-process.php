<?php
/**
 * Background Process
 *
 * @package notification-master
 *
 * @since 1.4.0
 */

namespace Notification_Master\WebPush;

use Notification_Master\Libraries\WP_Background_Processing\WP_Background_Process;

/**
 * Background Process class.
 */
class Background_Process extends WP_Background_Process {

	/**
	 * Action
	 *
	 * @var string
	 */
	protected $action = 'ntfm_web_background_process';

	/**
	 * Really long running process
	 *
	 * @return int
	 */
	public function really_long_running_task() {
		return sleep( 5 );
	}

	/**
	 * Task
	 *
	 * @param mixed $item
	 *
	 * @return mixed
	 */
	protected function task( $item ) {
		if ( ! empty( $item ) ) {
			$this->really_long_running_task();
			list( $notification, $page, $trigger, $notification_name ) = $item;

			if ( empty( $notification ) ) {
				return false;
			}

			do_action( 'notification_master_process_webpush_notification', $notification, $page, $trigger, $notification_name );
		}

		return false;
	}

	/**
	 * Complete
	 *
	 * @return void
	 */
	protected function complete() {
		parent::complete();
	}
}
