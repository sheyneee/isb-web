import React from 'react';

const PresentAddress = ({ formData, handleInputChange, errors }) => {
  return (
    <details className="dropdown mt-6">
      {/* Clickable summary element to toggle dropdown */}
      <summary className="text-2xl font-semibold cursor-pointer">
        Present Address
      </summary>

      {/* Address fields inside details */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-md font-medium text-gray-700">Unit/Floor/Room No.</label>
          <input
                type="text"
                name="presentAddress.unitFloorRoomNo"
                value={formData.presentAddress?.unitFloorRoomNo || ''} 
                onChange={handleInputChange}
                className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
                placeholder="Enter Unit/Floor/Room No."
            />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Building</label>
          <input
              type="text"
              name="presentAddress.building"
              value={formData.presentAddress?.building || ''} 
              onChange={handleInputChange}
              className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
              placeholder="Enter Building"
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Block No.</label>
          <input
            type="text"
            name="presentAddress.blockNo"
            value={formData.presentAddress.blockNo}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Block No."
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Lot No.</label>
          <input
            type="text"
            name="presentAddress.lotNo"
            value={formData.presentAddress.lotNo}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Lot No."
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Phase No.</label>
          <input
            type="text"
            name="presentAddress.phaseNo"
            value={formData.presentAddress.phaseNo}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Phase No."
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">House No.</label>
          <input
            type="text"
            name="presentAddress.houseNo"
            value={formData.presentAddress.houseNo}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter House No."
          />
          {errors['presentAddress.houseNo'] && <p className="text-red-500 text-m mt-1">{errors['presentAddress.houseNo']}</p>}
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Street</label>
          <input
            type="text"
            name="presentAddress.street"
            value={formData.presentAddress.street}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Street"
          />
          {errors['presentAddress.street'] && <p className="text-red-500 text-m mt-1">{errors['presentAddress.street']}</p>}
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Subdivision</label>
          <input
            type="text"
            name="presentAddress.subdivision"
            value={formData.presentAddress.subdivision}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Subdivision"
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Barangay</label>
          <input
            type="text"
            name="presentAddress.barangay"
            value={formData.presentAddress.barangay}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Barangay"
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">City</label>
          <input
            type="text"
            name="presentAddress.city"
            value={formData.presentAddress.city}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter City"
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Province</label>
          <input
            type="text"
            name="presentAddress.province"
            value={formData.presentAddress.province}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Province"
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Region</label>
          <input
            type="text"
            name="presentAddress.region"
            value={formData.presentAddress.region}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Region"
          />
        </div>
        <div>
          <label className="block text-md font-medium text-gray-700">Postal Code</label>
          <input
            type="text"
            name="presentAddress.postalcode"
            value={formData.presentAddress.postalcode}
            onChange={handleInputChange}
            className="border mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-md"
            placeholder="Enter Postal Code"
          />
        </div>
      </div>
    </details>
  );
};

export default PresentAddress;
