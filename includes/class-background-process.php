<?php
/**
 * Background Process
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master;

use Notification_Master\Libraries\WP_Background_Processing\WP_Background_Process;
use Notification_Master\Connections\Process as Connections_Process;

/**
 * Background Process class.
 */
class Background_Process extends WP_Background_Process {

	/**
	 * Action
	 *
	 * @var string
	 */
	protected $action = 'ntfm_background_process';

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
			list( $connections, $trigger, $notification_id ) = $item;

			if ( empty( $connections ) ) {
				return false;
			}

			$connections_process = Connections_Process::get_instance();
			$connections_process->process( $connections, $trigger, $notification_id );
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
