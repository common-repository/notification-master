<?php
/**
 * Class Merge Tags
 *
 * @package notification-master
 *
 * @since 1.0.0
 */

namespace Notification_Master\Abstracts;

/**
 * Merge Tags Group class.
 */
abstract class Merge_Tags_Group {

	/**
	 * Name.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $name;

	/**
	 * Slug.
	 *
	 * @since 1.0.0
	 *
	 * @var string
	 */
	protected $slug;

	/**
	 * Merge tags.
	 *
	 * @since 1.0.0
	 *
	 * @var array
	 */
	protected $merge_tags = array();

	/**
	 * Trigger.
	 *
	 * @since 1.0.0
	 *
	 * @var Trigger
	 */
	public $trigger;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$this->set_merge_tags();
	}

	/**
	 * Get merge tags.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_merge_tags() {
		return $this->merge_tags;
	}

	/**
	 * Set merge tags.
	 *
	 * @since 1.0.0
	 */
	abstract protected function set_merge_tags();

	/**
	 * Get name.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_name() {
		return $this->name;
	}

	/**
	 * Get slug.
	 *
	 * @since 1.0.0
	 *
	 * @return string
	 */
	public function get_slug() {
		return $this->slug;
	}

	/**
	 * Set trigger.
	 *
	 * @since 1.0.0
	 *
	 * @param Trigger $trigger Trigger.
	 *
	 * @return void
	 */
	public function set_trigger( $trigger ) {
		$this->trigger = $trigger;
	}

	/**
	 * Process merge tags.
	 *
	 * @since 1.0.0
	 *
	 * @param mixed $content Content.
	 *
	 * @return mixed
	 */
	public function process( $content ) {
		if ( is_array( $content ) ) {
			$content = $this->process_merge_tags_array( $content );
		} else {
			$content = $this->process_merge_tags( $content );
		}

		return $content;
	}

	/**
	 * Process merge tags in array.
	 *
	 * @since 1.0.0
	 *
	 * @param array $array Array.
	 *
	 * @return array
	 */
	public function process_merge_tags_array( $array ) {
		foreach ( $array as $key => $value ) {
			if ( is_array( $value ) ) {
				$array[ $key ] = $this->process_merge_tags_array( $value );
			} else {
				$array[ $key ] = $this->process_merge_tags( $value );
			}
		}

		return $array;
	}

	/**
	 * Process merge tags.
	 *
	 * @since 1.0.0
	 *
	 * @param string $content Content.
	 *
	 * @return string
	 */
	public function process_merge_tags( $content ) {
		// Match all group merge tags.
		preg_match_all( '/{{(' . $this->get_slug() . ')\.([^}]*)}}/', $content, $matches );

		// If no matches found, return content.
		if ( empty( $matches[0] ) ) {
			return $content;
		}

		// Loop through each match.
		foreach ( $matches[0] as $index => $full_tag ) {
			$tag = $matches[1][ $index ];
			$key = $matches[2][ $index ];

			$merge_tag = $this->get_merge_tag( $key );
			if ( ! $merge_tag ) {
				continue;
			}

			if ( isset( $merge_tag['trigger'] ) && $merge_tag['trigger'] !== $this->trigger->get_slug() ) {
				$value = '';
			} else {
				if ( isset( $merge_tag['callback'] ) ) {
					$value = call_user_func( $merge_tag['callback'], $this );
				} else {
					$value = $this->get_value( $key );
				}
			}

			// Replace merge tag with value.
			$content = str_replace( $full_tag, $value, $content );
		}

		return $content;
	}

	/**
	 * Get merge tag.
	 *
	 * @since 1.0.0
	 *
	 * @param string $key Key.
	 *
	 * @return array|null
	 */
	protected function get_merge_tag( $key ) {
		if ( ! isset( $this->merge_tags[ $key ] ) ) {
			return null;
		}

		return $this->merge_tags[ $key ];
	}

	/**
	 * Get value.
	 *
	 * @since 1.0.0
	 *
	 * @param array $merge_tag Merge tag.
	 *
	 * @return string
	 */
	protected function get_value( $merge_tag ) {
		return '';
	}
}
