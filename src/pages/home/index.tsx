/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';

/**
 * External dependencies
 */
import {
	Chart as ChartJS,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	Title,
	CategoryScale,
	Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Icon, { BarChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Progress } from 'antd';
import { keys, map, isEmpty } from 'lodash';
import { BeatLoader } from 'react-spinners';

ChartJS.register(
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	Title,
	CategoryScale,
	Tooltip
);

/**
 * Internal dependencies
 */
import './style.scss';
import { getPath } from '@Utils';
import { usePageTitle } from '@Hooks';

const Home: React.FC = () => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [counts, setCounts] = useState({
		daily: {},
		total: 0,
		success: 0,
		failed: 0,
	});
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [],
	});
	usePageTitle(__('Home', 'notification-master'));

	const fetchData = async () => {
		try {
			const data = (await apiFetch({
				path: '/ntfm/v1/notification-logs/count',
			})) as any;

			const chartData = {
				labels: keys(data.daily),
				datasets: [
					{
						type: 'line',
						label: __('Total', 'notification-master'),
						data: map(data.daily, (value) => value.count),
						backgroundColor: '#E67A18',
						borderColor: '#E67A18',
					},
				],
			} as any;

			setChartData(chartData);
			setCounts(data);
			setIsLoaded(true);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
			title: {
				display: false,
				data: {
					display: false,
				},
			},
			datalabels: {
				display: false,
			},
		},
		scales: {
			y: {
				beginAtZero: true,
			},
		},
	};

	const navigate = useNavigate();

	return (
		<>
			{applyFilters('NotificationMaster.HomePage.Before', null)}
			<h2 className="notification-master-heading">
				<Icon
					component={
						BarChartOutlined as React.ForwardRefExoticComponent<any>
					}
					width={20}
					height={20}
				/>
				{__('Statistics', 'notification-master')}
			</h2>
			<div className="notification-master__stats">
				<div className="notification-master__stats--chart">
					{!isLoaded && (
						<div className="notification-master__stats--loading">
							<BeatLoader color="var(--notification-master-color-primary)" />
						</div>
					)}
					{isLoaded && !isEmpty(chartData) && (
						<Bar data={chartData} options={options} />
					)}
				</div>
				<div className="notification-master__stats--overview">
					{!isLoaded && (
						<div className="notification-master__stats--loading">
							<BeatLoader color="var(--notification-master-color-primary)" />
						</div>
					)}
					{isLoaded && (
						<>
							<div className="notification-master__stats--overview--header">
								<h2 className="notification-master-heading">
									<span>
										{__('Overview', 'notification-master')}
									</span>
									<p>
										{__(
											'View all logs to see more details',
											'notification-master'
										)}
									</p>
								</h2>
								<a
									href="#"
									onClick={(e: React.MouseEvent) => {
										e.preventDefault();
										navigate(getPath('notification-log'));
									}}
								>
									{__('View all', 'notification-master')}
								</a>
							</div>
							<div className="notification-master__stats--overview--content">
								<div className="notification-master__stats--overview--item">
									<span className="notification-master__stats--overview--item--name">
										<span>
											{__('Total', 'notification-master')}
										</span>
									</span>
									<span className="notification-master__stats--overview--item--progress">
										<Progress
											percent={100}
											type="circle"
											format={() => `${counts.total}`}
											status="normal"
										/>
									</span>
								</div>
								<div className="notification-master__stats--overview--item">
									<span className="notification-master__stats--overview--item--name">
										<span>
											{__(
												'Success',
												'notification-master'
											)}
										</span>
									</span>
									<span className="notification-master__stats--overview--item--progress">
										<Progress
											percent={
												(counts.success /
													counts.total) *
												100
											}
											type="circle"
											status="success"
											format={() => `${counts.success}`}
										/>
									</span>
								</div>
								<div className="notification-master__stats--overview--item">
									<span className="notification-master__stats--overview--item--name">
										<span>
											{__(
												'Failed',
												'notification-master'
											)}
										</span>
									</span>
									<span className="notification-master__stats--overview--item--progress">
										<Progress
											percent={
												(counts.failed / counts.total) *
												100
											}
											type="circle"
											status="exception"
											format={() => `${counts.failed}`}
										/>
									</span>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
			{applyFilters('NotificationMaster.HomePage.After', null)}
		</>
	);
};

export default Home;
