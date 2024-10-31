/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

/**
 * External dependencies
 */
import ReactSelect from 'react-select';
import { map } from 'lodash';

const UserSelect: React.FC<{
	value: { value: string; label: string } | null;
	onChange: (value: string) => void;
}> = ({ value, onChange }) => {
	const [search, setSearch] = useState('');
	const [users, setUsers] = useState<any>([]);
	const [fetching, setFetching] = useState(false);

	const getUsers = async () => {
		setFetching(true);

		try {
			const response = await apiFetch({
				path: addQueryArgs('/wp/v2/users', {
					per_page: 10,
					search,
				}),
			});

			setUsers(response as any);
		} catch (error) {
			console.error(error);
		} finally {
			setFetching(false);
		}
	};

	useEffect(() => {
		getUsers();
	}, [search]);

	return (
		<ReactSelect
			options={map(users, (user: any) => ({
				value: user.id,
				label: user.name,
			}))}
			isSearchable={true}
			value={value ? value : null}
			onChange={(option: any) => onChange(option)}
			onInputChange={(input: string) => setSearch(input)}
			isLoading={fetching}
			placeholder={__('Select a user', 'notification-master')}
			noOptionsMessage={() => __('No users found', 'notification-master')}
			className="notification-master__integration--settings__field__list__item__input notification-master-input-custom"
			styles={{
				control: (provided) => ({
					...provided,
					minHeight: '35px',
					height: '35px',
				}),
				valueContainer: (provided) => ({
					...provided,
					height: '35px',
					padding: '0 6px',
				}),

				input: (provided) => ({
					...provided,
					margin: '0px',
				}),
				indicatorSeparator: () => ({
					display: 'none',
				}),
				indicatorsContainer: (provided) => ({
					...provided,
					height: '35px',
				}),
			}}
		/>
	);
};

export default UserSelect;
