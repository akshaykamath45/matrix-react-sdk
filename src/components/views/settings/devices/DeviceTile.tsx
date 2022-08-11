/*
Copyright 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { Fragment } from "react";

import { _t } from "../../../../languageHandler";
import { formatDate, formatRelativeTime } from "../../../../DateUtils";
import TooltipTarget from "../../elements/TooltipTarget";
import { Alignment } from "../../elements/Tooltip";
import Heading from "../../typography/Heading";
import { DeviceWithVerification } from "./useOwnDevices";

export interface DeviceTileProps {
    device: DeviceWithVerification;
    children?: React.ReactNode;
    onClick?: () => void;
}

const DeviceTileName: React.FC<{ device: DeviceWithVerification }> = ({ device }) => {
    if (device.display_name) {
        return <TooltipTarget
            alignment={Alignment.Top}
            label={`${device.display_name} (${device.device_id})`}
        >
            <Heading size='h4'>
                { device.display_name }
            </Heading>
        </TooltipTarget>;
    }
    return <Heading size='h4'>
        { device.device_id }
    </Heading>;
};

const MS_6_DAYS = 6 * 24 * 60 * 60 * 1000;
const formatLastActivity = (timestamp: number, now = new Date().getTime()): string => {
    // less than a week ago
    if (timestamp + MS_6_DAYS >= now) {
        const date = new Date(timestamp);
        // Tue 20:15
        return formatDate(date);
    }
    return formatRelativeTime(new Date(timestamp));
};

const DeviceMetadata: React.FC<{ value: string, id: string }> = ({ value, id }) => (
    value ? <span data-testid={`device-metadata-${id}`}>{ value }</span> : null
);

const DeviceTile: React.FC<DeviceTileProps> = ({ device, children, onClick }) => {
    const lastActivity = device.last_seen_ts && `${_t('Last activity')} ${formatLastActivity(device.last_seen_ts)}`;
    const verificationStatus = device.isVerified ? _t('Verified') : _t('Unverified');
    const metadata = [
        { id: 'isVerified', value: verificationStatus },
        { id: 'lastActivity', value: lastActivity },
        { id: 'lastSeenIp', value: device.last_seen_ip },
    ];

    return <div className="mx_DeviceTile" data-testid={`device-tile-${device.device_id}`}>
        <div className="mx_DeviceTile_info" onClick={onClick}>
            <DeviceTileName device={device} />
            <div className="mx_DeviceTile_metadata">
                { metadata.map(({ id, value }, index) =>
                    <Fragment key={id}>
                        { !!index && ' · ' }
                        <DeviceMetadata id={id} value={value} />
                    </Fragment>,
                ) }
            </div>
        </div>
        <div className="mx_DeviceTile_actions">
            { children }
        </div>
    </div>;
};

export default DeviceTile;