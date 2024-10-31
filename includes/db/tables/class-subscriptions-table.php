<?php
/**
 * Class Subscriptions_Table
 *
 * @package notification-master
 *
 * @since 1.4.0
 */

namespace Notification_Master\DB\Tables;

use Notification_Master\Abstracts\DB_Table;

/**
 * Class Subscriptions_Table
 *
 * @package notification-master
 *
 * @since 1.4.0
 */
class Subscriptions_Table extends DB_Table {

	/**
	 * Table name
	 *
	 * @since 1.4.0
	 *
	 * @var string
	 */
	public $table_name = 'ntfm_subscriptions';

	/**
	 * Get table columns
	 *
	 * @since 1.4.0
	 *
	 * @return array
	 */
	/**
	 * Get Columns.
	 *
	 * @since 1.0.0
	 *
	 * @return array
	 */
	public function get_columns() {
		return array(
			'id',
			'user_id',
			'ip_address',
			'device',
			'operating_system',
			'browser',
			'user_agent',
			'endpoint',
			'auth',
			'p256dh',
			'status',
			'created_at',
			'updated_at',
		);
	}

	/**
	 * Get create table query.
	 *
	 * @since 1.4.0
	 *
	 * @return string
	 */
	public function get_create_table_query() {
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		$query = "CREATE TABLE IF NOT EXISTS {$wpdb->prefix}{$this->table_name} (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
			user_id BIGINT(20) UNSIGNED NULL DEFAULT NULL,
			user_agent VARCHAR(255) NULL DEFAULT NULL,
			browser VARCHAR(255) NULL DEFAULT NULL,
			operating_system VARCHAR(255) NULL DEFAULT NULL,
			ip_address VARCHAR(255) NULL DEFAULT NULL,
			device VARCHAR(255) NULL DEFAULT NULL,
            `endpoint` VARCHAR(255) NOT NULL,
            auth VARCHAR(255) NOT NULL,
            p256dh VARCHAR(255) NOT NULL,
			`status` VARCHAR(255) NULL DEFAULT 'subscribed',
			expiration_time TIMESTAMP NULL DEFAULT NULL,
			content_encoding VARCHAR(255) NULL DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY `endpoint` (`endpoint`)
        ) $charset_collate;";

		return $query;
	}

	/**
	 * Add status column.
	 *
	 * @since 1.4.0
	 *
	 * @return void
	 */
	public function add_status_column() {
		global $wpdb;

		// Check if column exists.
		$column_exists = $wpdb->get_results( "SHOW COLUMNS FROM {$wpdb->prefix}{$this->table_name} LIKE 'status'" );
		if ( ! empty( $column_exists ) ) {
			return;
		}

		$wpdb->query( "ALTER TABLE {$wpdb->prefix}{$this->table_name} ADD status VARCHAR(255) NULL DEFAULT 'subscribed' AFTER p256dh" );
	}
}
