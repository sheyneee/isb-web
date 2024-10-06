import React from 'react';

// Desktop Operating System data
export const desktopOS = [
  { label: 'Windows', value: 72.72 },
  { label: 'OS X', value: 16.38 },
  { label: 'Linux', value: 3.83 },
  { label: 'Chrome OS', value: 2.42 },
  { label: 'Other', value: 4.65 },
];

// Mobile Operating System data
export const mobileOS = [
  { label: 'Android', value: 70.48 },
  { label: 'iOS', value: 28.8 },
  { label: 'Other', value: 0.71 },
];

// Platforms data
export const platforms = [
  { label: 'Mobile', value: 59.12 },
  { label: 'Desktop', value: 40.88 },
];

// Helper function to normalize values
const normalize = (v, v2) => Number.parseFloat(((v * v2) / 100).toFixed(2));

// Combined mobile and desktop OS data with normalization
export const mobileAndDesktopOS = [
  ...mobileOS.map((v) => ({
    ...v,
    label: v.label === 'Other' ? 'Other (Mobile)' : v.label,
    value: normalize(v.value, platforms[0].value),
  })),
  ...desktopOS.map((v) => ({
    ...v,
    label: v.label === 'Other' ? 'Other (Desktop)' : v.label,
    value: normalize(v.value, platforms[1].value),
  })),
];

// Value formatter function
export const valueFormatter = (item) => `${item.value}%`;

const WebUsageStats = () => {
  return (
    <div>
      <h2>Web Usage Statistics</h2>

      <h3>Desktop OS Market Share:</h3>
      <ul>
        {desktopOS.map((os) => (
          <li key={os.label}>
            {os.label}: {os.value}%
          </li>
        ))}
      </ul>

      <h3>Mobile OS Market Share:</h3>
      <ul>
        {mobileOS.map((os) => (
          <li key={os.label}>
            {os.label}: {os.value}%
          </li>
        ))}
      </ul>

      <h3>Platform Market Share:</h3>
      <ul>
        {platforms.map((platform) => (
          <li key={platform.label}>
            {platform.label}: {platform.value}%
          </li>
        ))}
      </ul>

      <h3>Mobile and Desktop Combined OS Market Share:</h3>
      <ul>
        {mobileAndDesktopOS.map((os) => (
          <li key={os.label}>
            {os.label}: {os.value}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebUsageStats;
