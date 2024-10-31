/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';

/**
 * External dependencies
 */
import { map, keys } from 'lodash';
import classname from 'classnames';
import { Tooltip, Badge } from 'antd';

/**
 * Internal dependencies
 */
import './style.scss';
import { getRegisteredIntegrations } from '@Integrations';

const IntegrationsSelect: React.FC<{
	value: string;
	onChange: (value: string) => void;
}> = ({ value, onChange }) => {
	const integrations = getRegisteredIntegrations();
	const { toggleProAlert } = useDispatch('notification-master/core');

	return (
		<div className="notification-master__integrations-select">
			{map(keys(integrations), (key) => {
				const integration = integrations[key];
				const { name, available } = integration;

				if (!available) {
					return (
						<Badge.Ribbon
							text={__('Pro', 'notification-master')}
							key={key}
						>
							<Tooltip title={name}>
								<div
									className={classname(
										'notification-master__integrations-select__integration',
										{
											'notification-master__integrations-select__integration--selected':
												value === key,
										}
									)}
									onClick={() => toggleProAlert(true)}
								>
									<img src={integration.icon} alt={name} />
								</div>
							</Tooltip>
						</Badge.Ribbon>
					);
				}

				return (
					<Tooltip title={name} key={key}>
						<div
							key={key}
							className={classname(
								'notification-master__integrations-select__integration',
								{
									'notification-master__integrations-select__integration--selected':
										value === key,
								}
							)}
							onClick={() => onChange(key)}
						>
							<img src={integration.icon} alt={name} />
						</div>
					</Tooltip>
				);
			})}
		</div>
	);
};

export default IntegrationsSelect;
