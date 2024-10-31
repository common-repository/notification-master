<?php
/**
 * Class Process Connections
 *
 * This class is responsible for processing connections.
 *
 * @package notification-master
 *
 * @since 1.0.0
 */
namespace Notification_Master\Connections;

use Notification_Master\Integrations\Loader as Integrations_Loader;
use Notification_Master\Abstracts\Trigger;
use Notification_Master\Settings;
use Notification_Master\Background_Process;

/**
 * Process Connections class.
 *
 * @since 1.0.0
 */
class Process {

	/**
	 * Background tasks.
	 *
	 * @var Background_Process
	 */
	protected $background_tasks;

	/**
	 * Instance of this class.
	 *
	 * @since 1.0.0
	 *
	 * @var Process
	 */
	private static $instance;

	/**
	 * Get instance of this class.
	 *
	 * @since 1.0.0
	 *
	 * @return Process
	 */
	public static function get_instance() {
		if ( ! isset( self::$instance ) && ! ( self::$instance instanceof Process ) ) {
			self::$instance = new Process();
		}

		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->background_tasks = new Background_Process();
	}

	/**
	 * Process connections.
	 *
	 * @since 1.0.0
	 *
	 * @param array   $connections Connections.
	 * @param Trigger $trigger Trigger.
	 * @param int     $notification_id Notification ID.
	 *
	 * @return void
	 */
	public function process_connections( $connections, $trigger, $notification_id ) {
		$background_process = Settings::get_setting( 'enable_background_processing', false );

		if ( $background_process ) {
			$this->background_tasks->push_to_queue( array( $connections, $trigger, $notification_id ) );
			$this->background_tasks->save()->dispatch();
			return;
		}

		$this->process( $connections, $trigger, $notification_id );
	}

	/**
	 * Process connections.
	 *
	 * @since 1.0.0
	 *
	 * @param array   $connections Connections.
	 * @param Trigger $trigger Trigger.
	 * @param int     $notification_id Notification ID.
	 *
	 * @return void
	 */
	public function process( $connections, $trigger, $notification_id ) {
		foreach ( $connections as $connection_id => $connection ) {
			$enabled     = isset( $connection['enabled'] ) ? $connection['enabled'] : true;
			$integration = Integrations_Loader::get_instance()->get_integration( $connection['integration'] );

			if ( ! $enabled || ! $integration ) {
				continue;
			}

			$connection_settings = $connection['settings'] ?? array();

			// Add action before process connection.
			do_action( 'notification_master_before_process_connection', $connection_settings, $trigger, $notification_id );

			$integration->process();

			// Add action after process connection.
			do_action( 'notification_master_after_process_connection' );
		}
	}
}
