<?php
/**
 * Class Subscription_Model
 *
 * @package notification-master
 *
 * @since 1.4.0
 */

namespace Notification_Master\DB\Models;

use Jenssegers\Agent\Agent;

/**
 * Class Subscription_Model
 */
class Subscription_Model {

	/**
	 * Table name.
	 *
	 * @since 1.4.0
	 *
	 * @var string
	 */
	public static $table_name = 'ntfm_web_push_subscriptions';

	/**
	 * Primary key.
	 *
	 * @since 1.4.0
	 *
	 * @var string
	 */
	public static $primary_key = 'id';

	/**
	 * Prepare data.
	 *
	 * @since 1.4.0
	 *
	 * @param array $data Data.
	 *
	 * @return array
	 */
	public static function prepare_data( $data ) {
		$agent   = new Agent();
		$browser = $agent->browser();
		$os      = $agent->platform();
		$user_id = get_current_user_id() ? get_current_user_id() : null;
		$device  = 'desktop';
		if ( $agent->isMobile() ) {
			$device = 'mobile';
		} elseif ( $agent->isTablet() ) {
			$device = 'tablet';
		}

		$prepared_data = array(
			'user_id'          => $user_id,
			'browser'          => $browser,
			'operating_system' => $os,
			'device'           => $device,
			'ip_address'       => self::get_ip_address(),
			'user_agent'       => self::get_user_agent(),
			'endpoint'         => $data['endpoint'],
			'auth'             => $data['auth'],
			'p256dh'           => $data['p256dh'],
			'content_encoding' => $data['content_encoding'],
			'expiration_time'  => $data['expiration_time'],
			'created_at'       => current_time( 'mysql' ),
			'updated_at'       => current_time( 'mysql' ),
		);

		return $prepared_data;
	}

	/**
	 * Get
	 *
	 * @since 1.4.0
	 *
	 * @param int $id ID.
	 *
	 * @return object
	 */
	public static function get( $id ) {
		global $wpdb;

		$result = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ntfm_subscriptions WHERE %s = %d", self::$primary_key, $id ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.

		return $result;
	}

	/**
	 * Get by endpoint.
	 *
	 * @since 1.4.0
	 *
	 * @param string $endpoint Endpoint.
	 *
	 * @return object
	 */
	public static function get_by_endpoint( $endpoint ) {
		global $wpdb;

		$result = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ntfm_subscriptions WHERE endpoint = %s", $endpoint ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.

		return $result;
	}

	/**
	 * Get all.
	 *
	 * @since 1.4.0
	 *
	 * @return array
	 */
	public static function get_all() {
		global $wpdb;

		$result = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}ntfm_subscriptions" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
		return $result;
	}

	/**
	 * Insert.
	 *
	 * @since 1.4.0
	 *
	 * @param array $data Data.
	 *
	 * @return int
	 */
	public static function insert( $data ) {
		global $wpdb;

		$data = self::prepare_data( $data );
		$wpdb->insert( "{$wpdb->prefix}ntfm_subscriptions", $data ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.

		return $wpdb->insert_id;
	}

	/**
	 * Delete.
	 *
	 * @since 1.4.0
	 *
	 * @return int
	 */
	public static function delete() {
		global $wpdb;

		return $wpdb->query( "DELETE FROM {$wpdb->prefix}ntfm_subscriptions" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
	}

	/**
	 * Delete by IDs.
	 *
	 * @since 1.4.0
	 *
	 * @param array $ids IDs.
	 */
	public static function delete_by_ids( $ids ) {
		global $wpdb;

		$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}ntfm_subscriptions WHERE id IN ($placeholders)", $ids ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
	}

	/**
	 * Delete by date.
	 *
	 * @since 1.4.0
	 *
	 * @param string $date Date.
	 */
	public static function delete_by_date( $date ) {
		global $wpdb;

		$wpdb->query( $wpdb->prepare( "DELETE FROM {$wpdb->prefix}ntfm_subscriptions WHERE created_at < %s", $date ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
	}

	/**
	 * Get rows.
	 *
	 * @since 1.4.0
	 *
	 * @param int    $per_page Per page.
	 * @param int    $page Page.
	 * @param string $status Status.
	 *
	 * @return array
	 */
	public static function get_rows( $per_page = 10, $page = 1, $status = 'all' ) {
		global $wpdb;

		$offset = ( $page - 1 ) * $per_page;
		$result = array();

		if ( 'all' === $status ) {
			$result = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ntfm_subscriptions ORDER BY id DESC LIMIT %d, %d", $offset, $per_page ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
		} else {
			$result = $wpdb->get_results( $wpdb->prepare( "SELECT * FROM {$wpdb->prefix}ntfm_subscriptions WHERE `status` = %s ORDER BY id DESC LIMIT %d, %d", $status, $offset, $per_page ) ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
		}

		return $result;
	}

	/**
	 * Get count.
	 *
	 * @since 1.4.0
	 *
	 * @return int
	 */
	public static function get_count() {
		global $wpdb;

		return $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ntfm_subscriptions" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
	}

	/**
	 * Get count by status.
	 *
	 * @since 1.4.3
	 *
	 * @param string $status Status.
	 *
	 * @return int
	 */
	public static function get_count_by_status( $status = 'subscribed' ) {
		global $wpdb;

		return $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}ntfm_subscriptions WHERE `status` = %s", $status ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Prepared in the line above and no caching needed.
	}

	/**
	 * Get count by browser.
	 *
	 * @since 1.4.3
	 *
	 * @param string $browser Browser.
	 *
	 * @return int
	 */
	public static function get_count_by_browser( $browser ) {
		global $wpdb;

		return $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}ntfm_subscriptions WHERE browser = %s", $browser ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Prepared in the line above and no caching needed.
	}

	/**
	 * Get count for browsers that not equal to chrome, firefox, safari, opera.
	 *
	 * @since 1.4.3
	 *
	 * @return int
	 */
	public static function get_count_for_other_browsers() {
		global $wpdb;

		return $wpdb->get_var( "SELECT COUNT(*) FROM {$wpdb->prefix}ntfm_subscriptions WHERE browser NOT IN ('chrome', 'firefox', 'safari', 'opera')" ); // phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- No caching needed.
	}

	/**
	 * Get count by device.
	 *
	 * @since 1.4.3
	 *
	 * @param string $device Device.
	 *
	 * @return int
	 */
	public static function get_count_by_device( $device ) {
		global $wpdb;

		return $wpdb->get_var( $wpdb->prepare( "SELECT COUNT(*) FROM {$wpdb->prefix}ntfm_subscriptions WHERE device = %s", $device ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Prepared in the line above and no caching needed.
	}

	/**
	 * Get count by date.
	 *
	 * @since 1.4.0
	 *
	 * @param string $from_date From date.
	 * @param string $to_date To date.
	 * @param string $status Status.
	 *
	 * @return int
	 */
	public static function get_count_by_date( $from_date, $to_date, $status = '' ) {
		global $wpdb;

		$sql = "SELECT COUNT(*) FROM {$wpdb->prefix}ntfm_subscriptions WHERE created_at BETWEEN %s AND %s";

		$args = array( $from_date, $to_date );

		if ( ! empty( $status ) ) {
			$sql   .= ' AND status = %s';
			$args[] = $status;
		}

		return $wpdb->get_var( $wpdb->prepare( $sql, $args ) ); // phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Prepared in the line above and no caching needed.
	}

	/**
	 * Update status.
	 *
	 * @since 1.4.3
	 *
	 * @param array  $ids IDs.
	 * @param string $status Status.
	 */
	public static function update_status( $ids, $status ) {
		global $wpdb;

		$placeholders = implode( ',', array_fill( 0, count( $ids ), '%d' ) );
		$wpdb->query(
			$wpdb->prepare(
				"UPDATE {$wpdb->prefix}ntfm_subscriptions 
			SET `status` = %s 
			WHERE id IN ($placeholders)",
				array_merge( array( $status ), $ids )
			)
		);
	}

	/**
	 * Get IP address.
	 *
	 * @since 1.4.0
	 *
	 * @return string
	 */
	public static function get_ip_address() {
		$ip_address = '';

		if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) ) {
			$ip_address = $_SERVER['HTTP_CLIENT_IP'];
		} elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
			$ip_address = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
			$ip_address = $_SERVER['REMOTE_ADDR'];
		}

		return $ip_address;
	}

	/**
	 * Get user agent.
	 *
	 * @since 1.4.0
	 *
	 * @return string
	 */
	public static function get_user_agent() {
		return $_SERVER['HTTP_USER_AGENT'];
	}
}
