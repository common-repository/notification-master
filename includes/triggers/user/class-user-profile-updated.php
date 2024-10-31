<?php
/**
 * User Profile Updated.
 *
 * This class is responsible for triggering notifications when a user profile is updated.
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master\Triggers\User;

use Notification_Master\Abstracts\User_Trigger;

/**
 * User Profile Updated class.
 */
class User_Profile_Updated extends User_Trigger {

	/**
	 * Trigger name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $name = 'Profile Updated';

	/**
	 * Trigger slug.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $slug = 'profile_updated';

	/**
	 * Description.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $description = 'This trigger fires when a user profile is updated.';

	/**
	 * Constructor.
	 */
	public function __construct() {
		parent::__construct();
		$this->hook = 'profile_update';
		add_action( $this->hook, array( $this, 'process' ), 10, 2 );
	}

	/**
	 * Process.
	 *
	 * @since 1.0.0
	 *
	 * @param int   $user_id User ID.
	 * @param array $old_user_data Old user data.
	 *
	 * @return void
	 */
	public function process( $user_id, $old_user_data ) {
		$this->user      = get_userdata( $user_id );
		$this->user_meta = get_user_meta( $user_id );
		$this->do_connections();
	}
}
