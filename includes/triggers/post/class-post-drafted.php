<?php
/**
 * Class Post_Drafted
 *
 * This class is responsible for triggering notifications when a post is drafted.
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master\Triggers\Post;

use Notification_Master\Abstracts\Post_Trigger;

/**
 * Post Drafted class.
 */
class Post_Drafted extends Post_Trigger {

	/**
	 * Trigger name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $name = 'Drafted';

	/**
	 * Trigger slug.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $slug = 'drafted';

	/**
	 * Trigger.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $hook;

	/**
	 * Constructor.
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type ) {
		parent::__construct( $post_type );
		$this->hook = "draft_{$post_type}";
		add_action( $this->hook, array( $this, 'process' ), 10, 2 );
	}

	/**
	 * Get description.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_description() {
		/* translators: %s: Trigger name */
		return sprintf( 'This trigger fires when a %s is drafted.', $this->get_name() );
	}

	/**
	 * Process.
	 *
	 * @since 1.0.0
	 *
	 * @param int    $post_id Post ID.
	 * @param object $post Post object.
	 *
	 * @return void
	 */
	public function process( $post_id, $post ) {
		if ( ! $this->is_post_type( $post ) ) {
			return;
		}

		$this->post             = $post;
		$this->post_author      = get_userdata( $post->post_author );
		$last_editor_id         = get_post_meta( $post->ID, '_edit_last', true );
		$editor_id              = $last_editor_id ? intval( $last_editor_id ) : $post->post_author;
		$this->post_last_editor = get_userdata( $editor_id );

		$this->do_connections();
	}
}
