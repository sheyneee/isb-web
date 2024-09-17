import React, { useState } from 'react';
import { OrganizationChart } from 'primereact/organizationchart';

const ResidentBarangayDirectory = () => {
    const [selection, setSelection] = useState([]);
    const [data] = useState([
        {
            expanded: true,
            type: 'person',
            className: 'bg-white text-black',
            style: { borderRadius: '8px', padding: '10px' },
            data: {
                image: 'https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png',
                name: 'Amy Elsner',
                title: 'Barangay Captain'
            },
            children: [
                {
                    expanded: true,
                    type: 'person',
                    className: 'bg-white text-black ',
                    style: { borderRadius: '8px', padding: '10px' },
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/annafali.png',
                        name: 'Anna Fali',
                        title: 'Secretary'
                    },
                    children: [
                        {
                            label: 'Sales',
                            className: 'bg-white text-black ',
                            style: { borderRadius: '8px', padding: '10px', textAlign: 'center' }
                        },
                        {
                            label: 'Marketing',
                            className: 'bg-white text-black ',
                            style: { borderRadius: '8px', padding: '10px', textAlign: 'center' }
                        }
                    ]
                },
                {
                    expanded: true,
                    type: 'person',
                    className: 'bg-white text-black ',
                    style: { borderRadius: '8px', padding: '10px' },
                    data: {
                        image: 'https://primefaces.org/cdn/primereact/images/avatar/stephenshaw.png',
                        name: 'Stephen Shaw',
                        title: 'KAGAWAD'
                    },
                    children: [
                        {
                            label: 'Development',
                            className: 'bg-white text-black ',
                            style: { borderRadius: '8px', padding: '10px', textAlign: 'center' }
                        },
                        {
                            label: 'UI/UX Design',
                            className: 'bg-white text-black ',
                            style: { borderRadius: '8px', padding: '10px', textAlign: 'center' }
                        }
                    ]
                }
            ]
        }
    ]);

    const nodeTemplate = (node) => {
        if (node.type === 'person') {
            return (
                <div className="flex flex-col p-4 border rounded shadow-md items-center" style={node.style}>
                    <img alt={node.data.name} src={node.data.image} className="mb-3 rounded-full w-16 h-16" />
                    <div className='flex-col flex'>
                    <span className="font-bold mb-2">{node.data.name}</span>
                    <span className="flex-col">{node.data.title}</span>
                    </div>
                </div>
            );
        }
        // For non-person nodes like 'Sales', 'Marketing', etc.
        return (
            <div className="flex justify-center items-center p-2 border rounded-md" style={node.style}>
                {node.label}
            </div>
        );
    };

    return (
        <div className="card overflow-x-auto">
            <OrganizationChart
                value={data}
                selectionMode="multiple"
                selection={selection}
                onSelectionChange={(e) => setSelection(e.data)}
                nodeTemplate={nodeTemplate}
            />
        </div>
    );
};

export default ResidentBarangayDirectory;
