<?php
/**
 * Class Post_Added
 *
 * This class is responsible for triggering notifications when a post is added to the database.
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master\Triggers\Post;

use Notification_Master\Abstracts\Post_Trigger;

/**
 * Post Added class.
 */
class Post_Added extends Post_Trigger {

	/**
	 * Trigger name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $name = 'Added';

	/**
	 * Trigger slug.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $slug = 'added';

	/**
	 * Trigger.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	public $hook = 'wp_insert_post';

	/**
	 * Constructor.
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type ) {
		parent::__construct( $post_type );
		add_action( $this->hook, array( $this, 'process' ), 10, 3 );
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
		return sprintf( 'This trigger fires when a %s is inserted into the database.', $this->post_type );
	}

	/**
	 * Process.
	 *
	 * @since 1.0.0
	 *
	 * @param int      $post_id Post ID.
	 * @param \WP_Post $post   Post object.
	 * @param bool     $update Whether this is an existing post being updated.
	 *
	 * @return void
	 */
	public function process( $post_id, $post, $update ) {
		if ( ! $this->is_post_type( $post ) ) {
			return;
		}

		if ( ! $update ) {
			$this->post             = $post;
			$this->post_author      = get_userdata( $post->post_author );
			$last_editor_id         = get_post_meta( $post_id, '_edit_last', true );
			$editor_id              = $last_editor_id ? intval( $last_editor_id ) : $post->post_author;
			$this->post_last_editor = get_userdata( $editor_id );

			$this->do_connections();
		}
	}
}
