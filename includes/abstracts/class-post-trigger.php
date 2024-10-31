<?php
/**
 * Trigger Abstract
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master\Abstracts;

use Notification_Master\Abstracts\Trigger;

/**
 * Trigger Abstract class.
 */
abstract class Post_Trigger extends Trigger {

	/**
	 * Post type.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $post_type;

	/**
	 * Post Object.
	 *
	 * @since 1.0.0
	 *
	 * @var \WP_Post_Type
	 */
	public $post_type_object;

	/**
	 * Post.
	 *
	 * @since 1.0.0
	 *
	 * @var \WP_Post|null
	 */
	public $post;

	/**
	 * Post author.
	 *
	 * @since 1.0.0
	 *
	 * @var \WP_User|null
	 */
	public $post_author;

	/**
	 * Post last editor.
	 *
	 * @since 1.0.0
	 *
	 * @var \WP_User|null
	 */
	public $post_last_editor;

	/**
	 * Current user.
	 *
	 * @since 1.0.0
	 *
	 * @var \WP_User|null
	 */
	public $current_user;

	/**
	 * Constructor.
	 *
	 * @param string $post_type Post type.
	 */
	public function __construct( $post_type ) {
		$this->post_type        = $post_type;
		$this->post_type_object = get_post_type_object( $this->post_type );
		parent::__construct();
	}

	/**
	 * Get name.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->post_type_object->labels->singular_name . ' ' . $this->name;
	}

	/**
	 * Get slug.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_slug() {
		return $this->post_type_object->name . '-' . $this->slug;
	}

	/**
	 * Get group.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_group() {
		return $this->post_type;
	}

	/**
	 * Is post type.
	 *
	 * @param \WP_Post $post Post object.
	 *
	 * @return bool
	 */
	public function is_post_type( $post ) {
		return $this->post_type === $post->post_type;
	}

	/**
	 * Get merge tags.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_merge_tags() {
		return array(
			$this->post_type,
			"{$this->post_type}_author",
			"{$this->post_type}_last_editor",
		);
	}
}
